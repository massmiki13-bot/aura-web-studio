import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTranslation } from "react-i18next";
import * as THREE from "three";
import { gsap } from "@/lib/gsap";
import { rafDebounce } from "@/lib/utils";
import { getLenis } from "@/lib/lenis";
import { introWillPlay, markBootReady, markIntroSeen } from "@/lib/boot";
import { useOverlayRoot } from "@/lib/overlay-root";

/**
 * The first-visit intro — a 3D "genesis" sequence, deliberately not a curtain
 * with a spinner on it.
 *
 * A field of metallic sparks is scattered across deep space; on cue they
 * spiral inward along curved, staggered paths and collapse onto a molten
 * chrome orb (the same near-black-chrome material language as the hero blob).
 * As they pack in, the sparks turn from cool silver to violet and the orb
 * ignites a Fresnel rim, while in front of it the AURA wordmark assembles out
 * of a few thousand glowing dots flying in from off-screen — the same dust
 * treatment the pricing headline uses.
 *
 * And then the thing everyone is waiting for turns out not to be a fade: the
 * orb detonates, the sparks blow outward straight past the camera, the
 * wordmark tears apart with them through a shockwave, and the light-leak of
 * the blast is what wipes the overlay off the hero waiting underneath.
 *
 * Behaviour, matching the rest of the site:
 * - client-only (nothing renders during SSR, so no-JS visitors see the site,
 *   not a stuck black screen, and there is no hydration flash to manage);
 * - plays once per browser session and only on a fresh load of "/", so a
 *   reload or a click back to the home page doesn't replay it — append
 *   `?intro` to force it, `?nointro` to skip. That decision lives in
 *   @/lib/boot, which also puts the pre-paint curtain up;
 * - prefers-reduced-motion skips it entirely — no 3D, no large motion, no
 *   delay before the site;
 * - scroll is locked (and reset to the top) for the duration;
 * - skippable at any time, with a failsafe if the GL context never comes up;
 * - hands the page its "boot" signal at the detonation, one beat before it
 *   dissolves, so the hero's own WebGL layers spin up while the flash still
 *   covers them instead of stuttering into view afterwards;
 * - every GL resource is disposed and the whole overlay unmounts when done, so
 *   the WebGL context is freed and nothing lingers over the page.
 */

const COLD_COLOR = new THREE.Color("#cdd6ea"); // cool silver spark
const ACCENT_COLOR = new THREE.Color("#a855f7"); // violet, the ignition accent
/** Dust palette for the wordmark: silver cooling into the violet accent. */
const DUST_COLORS = ["#ffffff", "#dccdff", "#a855f7"] as const;
// Two particle systems now share the frame (these sparks and the wordmark
// dust), so this is lower than it would be if the orb were carrying the scene
// on its own.
const PARTICLE_COUNT = 1800;
const CORE_RADIUS = 1.55;
/** The choreography is authored against this length, in seconds… */
const RUNTIME = 3.9;
/** …then the whole timeline is run this much faster, so every cue — the 3D
 *  convergence, the dust wordmark, the blast, the hand-off — stays in sync
 *  while the intro finishes sooner (~3.1s). */
const INTRO_SPEED = 1.25;

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

// Monochrome "studio softbox" matcap for the chrome orb, drawn procedurally so
// nothing is fetched — a bright key band, a couple of fills and a dark grazing
// rim. Same recipe as the hero's chrome blob, kept local to stay self-contained.
function makeMatcapTexture(): THREE.CanvasTexture {
  const size = 256;
  const cv = document.createElement("canvas");
  cv.width = cv.height = size;
  const g = cv.getContext("2d")!;

  const base = g.createRadialGradient(
    size * 0.4,
    size * 0.34,
    size * 0.04,
    size * 0.5,
    size * 0.5,
    size * 0.62,
  );
  base.addColorStop(0, "#eef1f6");
  base.addColorStop(0.32, "#8d919b");
  base.addColorStop(0.64, "#232429");
  base.addColorStop(1, "#020204");
  g.fillStyle = base;
  g.fillRect(0, 0, size, size);

  g.save();
  g.translate(size / 2, size / 2);
  g.rotate(-0.55);
  const band = (y: number, h: number, alpha: number) => {
    const grad = g.createLinearGradient(0, y - h / 2, 0, y + h / 2);
    grad.addColorStop(0, "rgba(255,255,255,0)");
    grad.addColorStop(0.5, `rgba(255,255,255,${alpha})`);
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grad;
    g.fillRect(-size, y - h / 2, size * 2, h);
  };
  band(-size * 0.27, size * 0.16, 0.9);
  band(-size * 0.02, size * 0.07, 0.42);
  band(size * 0.19, size * 0.05, 0.2);
  g.restore();

  const rim = g.createRadialGradient(
    size / 2,
    size / 2,
    size * 0.36,
    size / 2,
    size / 2,
    size * 0.5,
  );
  rim.addColorStop(0, "rgba(0,0,0,0)");
  rim.addColorStop(0.75, "rgba(0,0,0,0.28)");
  rim.addColorStop(1, "rgba(0,0,0,0.85)");
  g.fillStyle = rim;
  g.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// ─── Spark field ───────────────────────────────────────────────────────────
// Each spark carries a scattered start position, a target position on the orb
// shell, and a seed (stagger delay / swirl direction / size+brightness). The
// whole convergence — curved swirl, staggered timing, easing — and the final
// detonation happen in the vertex shader; the CPU only writes a few uniforms
// per frame, so the sequence costs the main thread nothing while React is
// still hydrating the page underneath.
const PARTICLE_VERT = /* glsl */ `
uniform float uProgress;   // 0..1 convergence
uniform float uBurst;      // 0..1 detonation
uniform float uTime;
uniform float uFade;       // global fade in / out
uniform float uSize;
attribute vec3 aStart;
attribute vec3 aTarget;
attribute vec3 aSeed;      // x: delay, y: swirl dir, z: rand
varying float vCore;       // how converged this spark is (0..1)
varying float vFade;
varying float vBurst;
void main() {
  float delay = aSeed.x * 0.4;
  float local = clamp((uProgress - delay) / (1.0 - 0.4), 0.0, 1.0);
  float e = local * local * (3.0 - 2.0 * local);   // smoothstep ease

  vec3 pos = mix(aStart, aTarget, e);

  // Swirl the interpolated position around Y — strong while far out, unwinding
  // to zero as it packs onto the orb, so the sparks arrive on curved orbits.
  float swirl = (1.0 - e) * aSeed.y * 3.14159 + uTime * 0.2 * (1.0 - e);
  float s = sin(swirl), c = cos(swirl);
  pos.xz = mat2(c, -s, s, c) * pos.xz;

  // Idle drift before they're pulled in.
  pos += normalize(pos + 0.001) * sin(uTime * 0.6 + aSeed.z * 12.0) * 0.18 * (1.0 - e);

  // Detonation: flung outward along the direction they packed from, on an
  // accelerating curve and with a per-spark spread, so the shell tears apart
  // unevenly and the nearest sparks rush the camera.
  float b = uBurst * uBurst * (0.55 + aSeed.z * 0.9);
  pos += normalize(aTarget) * b * 22.0;

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;

  float dist = max(-mv.z, 0.35);
  gl_PointSize = min(
    uSize * (aSeed.z * 0.7 + 0.5) * (1.0 / dist) * (0.35 + 0.8 * uFade) * (1.0 + uBurst * 1.6),
    72.0
  );
  vCore = e;
  vFade = uFade;
  vBurst = uBurst;
}
`;

const PARTICLE_FRAG = /* glsl */ `
uniform vec3 uCold;
uniform vec3 uAccent;
varying float vCore;
varying float vFade;
varying float vBurst;
void main() {
  vec2 uv = gl_PointCoord - 0.5;
  float d = length(uv);
  if (d > 0.5) discard;
  float a = smoothstep(0.5, 0.0, d);
  a *= a;                                   // soft round glow
  vec3 col = mix(uCold, uAccent, smoothstep(0.35, 1.0, vCore));
  col += vCore * 0.35 + vBurst * 0.8;       // packed sparks burn brighter still
  gl_FragColor = vec4(col, a * vFade * (0.45 + 0.7 * vCore));
}
`;

// ─── Chrome core ─────────────────────────────────────────────────────────────
const CORE_VERT = /* glsl */ `
uniform float uTime;
varying vec3 vNormal;
varying vec3 vView;
void main() {
  vec3 p = position;
  // Gentle molten breathing (small enough that flat normals stay convincing).
  float w = sin(p.y * 3.5 + uTime * 1.1) * 0.03 + sin(p.x * 4.5 - uTime * 0.8) * 0.03;
  p += normal * w;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vNormal = normalize(normalMatrix * normal);
  vView = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}
`;

const CORE_FRAG = /* glsl */ `
uniform sampler2D uMatcap;
uniform float uTime;
uniform float uAccent;     // 0..1 rim ignition
uniform float uOpacity;
uniform vec3 uAccentColor;
varying vec3 vNormal;
varying vec3 vView;
void main() {
  vec3 n = normalize(vNormal);
  // Rotate the matcap lookup so the reflection sweeps across the orb.
  float a = uTime * 0.18;
  float s = sin(a), c = cos(a);
  vec2 muv = mat2(c, -s, s, c) * n.xy;
  muv = muv * 0.5 + 0.5;
  vec3 col = texture2D(uMatcap, muv).rgb;
  float fres = pow(1.0 - max(dot(n, normalize(vView)), 0.0), 3.0);
  // Violet belongs on the grazing rim, not across the whole ball — pushed any
  // harder the chrome stops reading as metal and becomes a purple balloon.
  col += fres * (0.16 + uAccent * uAccentColor * 1.05);
  gl_FragColor = vec4(col, uOpacity);
}
`;

type GenesisScene = {
  group: THREE.Group;
  particleMat: THREE.ShaderMaterial;
  coreMat: THREE.ShaderMaterial;
  core: THREE.Mesh;
  dispose: () => void;
};

function buildGenesis(): GenesisScene {
  const owned: { dispose(): void }[] = [];
  const own = <T extends { dispose(): void }>(x: T): T => (owned.push(x), x);

  // Spark buffers.
  const starts = new Float32Array(PARTICLE_COUNT * 3);
  const targets = new Float32Array(PARTICLE_COUNT * 3);
  const seeds = new Float32Array(PARTICLE_COUNT * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    // Scattered start on a slightly flattened shell, radius 5..11.
    const u = Math.random() * 2 - 1;
    const phi = Math.random() * Math.PI * 2;
    const r = Math.sqrt(1 - u * u);
    const rad = 5 + Math.random() * 6;
    starts[i * 3] = Math.cos(phi) * r * rad;
    starts[i * 3 + 1] = u * rad * 0.72;
    starts[i * 3 + 2] = Math.sin(phi) * r * rad;

    // Target: an even Fibonacci shell on the orb; ~1 in 6 sits proud as a halo.
    const y = 1 - (i / (PARTICLE_COUNT - 1)) * 2;
    const rr = Math.sqrt(1 - y * y);
    const theta = golden * i;
    const shell = CORE_RADIUS + (Math.random() < 0.16 ? Math.random() * 1.5 : Math.random() * 0.1);
    targets[i * 3] = Math.cos(theta) * rr * shell;
    targets[i * 3 + 1] = y * shell;
    targets[i * 3 + 2] = Math.sin(theta) * rr * shell;

    seeds[i * 3] = Math.random(); // delay
    seeds[i * 3 + 1] = Math.random() * 2 - 1; // swirl direction/strength
    seeds[i * 3 + 2] = Math.random(); // size + brightness
  }

  const pGeo = own(new THREE.BufferGeometry());
  pGeo.setAttribute("position", new THREE.BufferAttribute(starts, 3));
  pGeo.setAttribute("aStart", new THREE.BufferAttribute(starts, 3));
  pGeo.setAttribute("aTarget", new THREE.BufferAttribute(targets, 3));
  pGeo.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 3));

  const particleMat = own(
    new THREE.ShaderMaterial({
      uniforms: {
        uProgress: { value: 0 },
        uBurst: { value: 0 },
        uTime: { value: 0 },
        uFade: { value: 0 },
        uSize: { value: 26 },
        uCold: { value: COLD_COLOR },
        uAccent: { value: ACCENT_COLOR },
      },
      vertexShader: PARTICLE_VERT,
      fragmentShader: PARTICLE_FRAG,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    }),
  );
  const points = new THREE.Points(pGeo, particleMat);
  points.frustumCulled = false;
  points.renderOrder = 2;

  // Chrome core.
  const matcap = own(makeMatcapTexture());
  const coreGeo = own(new THREE.IcosahedronGeometry(CORE_RADIUS, 5));
  const coreMat = own(
    new THREE.ShaderMaterial({
      uniforms: {
        uMatcap: { value: matcap },
        uTime: { value: 0 },
        uAccent: { value: 0 },
        uOpacity: { value: 0 },
        uAccentColor: { value: ACCENT_COLOR },
      },
      vertexShader: CORE_VERT,
      fragmentShader: CORE_FRAG,
      transparent: true,
    }),
  );
  const core = new THREE.Mesh(coreGeo, coreMat);
  core.scale.setScalar(0.0001);
  core.renderOrder = 1;

  const group = new THREE.Group();
  group.add(core, points);

  return {
    group,
    particleMat,
    coreMat,
    core,
    dispose: () => owned.forEach((o) => o.dispose()),
  };
}

function Genesis({ progress }: { progress: React.MutableRefObject<{ p: number }> }) {
  const gl = useThree((s) => s.gl);
  const camera = useThree((s) => s.camera);
  const built = useMemo(buildGenesis, []);
  const time = useRef(0);

  useEffect(() => () => built.dispose(), [built]);

  useEffect(() => {
    // gl_PointSize is in device pixels; scale so sparks look the same at any dpr.
    built.particleMat.uniforms.uSize.value = 26 * Math.min(gl.getPixelRatio(), 2);
  }, [built, gl]);

  useFrame((_, delta) => {
    const d = Math.min(delta, 1 / 30);
    time.current += d;
    const t = time.current;
    const p = progress.current.p;

    // Cue points are in units of the single 0..1 tween that drives this scene,
    // and are timed against the DOM beats in the timeline below: the orb starts
    // to go at ~0.88, which is a beat before the wordmark reacts to it.
    const conv = smoothstep(0.03, 0.58, p); // spark convergence
    const coreIn = smoothstep(0.36, 0.62, p);
    const burst = smoothstep(0.88, 1, p); // detonation
    const gone = smoothstep(0.94, 1, p); // what the blast leaves behind

    built.particleMat.uniforms.uProgress.value = conv;
    built.particleMat.uniforms.uBurst.value = burst;
    built.particleMat.uniforms.uTime.value = t;
    // Fade the sparks in at the very start; they burn out with the blast.
    built.particleMat.uniforms.uFade.value = smoothstep(0, 0.06, p) * (1 - gone);

    built.coreMat.uniforms.uTime.value = t;
    built.coreMat.uniforms.uAccent.value = smoothstep(0.5, 0.78, p) + burst * 1.0;
    built.coreMat.uniforms.uOpacity.value = coreIn * (1 - gone);
    // A hair of implosion just before it lets go, then it swells through the
    // camera — the recoil is what sells the detonation.
    const recoil = 1 - smoothstep(0.8, 0.885, p) * 0.16 * (1 - burst);
    built.core.scale.setScalar(Math.max(0.0001, coreIn * recoil * (1 + burst * 3.4)));
    built.core.rotation.y = t * 0.25;

    // Slow dolly in through the convergence, then a hard push on the blast.
    const targetZ = 8.6 - conv * 3.3 - burst * 1.8;
    camera.position.z += (targetZ - camera.position.z) * (1 - Math.exp(-6 * d));
    camera.lookAt(0, 0, 0);
  });

  return <primitive object={built.group} />;
}

// ─── Wordmark dust ──────────────────────────────────────────────────────────
// The wordmark is not type — it is a few thousand glowing dots that fly in from
// off-screen and settle into the shape of the letters, the same treatment the
// pricing headline uses (see @/components/ui/particle-text). The technique is
// shared; the driving is not. That component runs on its own clock, cycling
// phrases forever, while this one is slaved to the intro's single 0..1 tween so
// the letters land on the beat the orb ignites and come apart in the same blast
// that throws the sparks past the camera.

/** Soft radial dot, drawn once per colour and blitted per particle. Doing the
 *  glow with canvas shadowBlur instead would re-run a Gaussian per draw call —
 *  thousands of times a frame. */
function makeDustSprite(color: string): HTMLCanvasElement {
  const size = 64;
  const cv = document.createElement("canvas");
  cv.width = cv.height = size;
  const c = cv.getContext("2d")!;
  const half = size / 2;
  const g = c.createRadialGradient(half, half, 0, half, half, half);
  g.addColorStop(0, color);
  g.addColorStop(0.22, color);
  g.addColorStop(0.45, `${color}47`);
  g.addColorStop(1, `${color}00`);
  c.fillStyle = g;
  c.fillRect(0, 0, size, size);
  return cv;
}

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}

type Dust = {
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  /** Direction away from centre, reused for the blast. */
  bx: number;
  by: number;
  delay: number;
  size: number;
  phase: number;
  sprite: number;
};

function ParticleWordmark({
  text,
  progress,
  className = "",
}: {
  text: string;
  progress: React.MutableRefObject<{ p: number }>;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const sprites = DUST_COLORS.map(makeDustSprite);
    let w = 0;
    let h = 0;
    let dust: Dust[] = [];

    // Sampling the glyphs before the webfont arrives would trace the fallback
    // face and settle the dots into the wrong letterforms. There is time to
    // wait: nothing assembles until a second into the sequence.
    const fontReady: Promise<unknown> = document.fonts
      ? Promise.race([
          document.fonts.load(`700 100px "Clash Display"`),
          new Promise((r) => setTimeout(r, 700)),
        ])
      : Promise.resolve();

    /** Rasterises the word offscreen and keeps one dot per opaque sample. */
    function build() {
      if (w < 2 || h < 2) return;
      const off = document.createElement("canvas");
      off.width = Math.floor(w);
      off.height = Math.floor(h);
      const octx = off.getContext("2d")!;

      // Sized like display type, not like a banner: letting it run to the full
      // width of a wide viewport spreads a fixed dot budget over a huge area
      // and the glyphs stop reading as letters at all.
      let fontSize = Math.min(h * 0.3, 200);
      const fit = () => {
        octx.font = `700 ${fontSize}px "Clash Display", Satoshi, sans-serif`;
        return octx.measureText(text).width;
      };
      while (fit() > Math.min(w * 0.62, 780) && fontSize > 24) fontSize -= 4;

      octx.fillStyle = "#fff";
      octx.textAlign = "center";
      octx.textBaseline = "middle";
      octx.fillText(text, w / 2, h / 2);

      const { data } = octx.getImageData(0, 0, off.width, off.height);
      const step = 3;
      const coords: [number, number][] = [];
      for (let y = 0; y < off.height; y += step) {
        for (let x = 0; x < off.width; x += step) {
          if (data[(y * off.width + x) * 4 + 3] > 120) coords.push([x, y]);
        }
      }
      // Shuffle then slice: a uniform subsample, so a very wide viewport gets
      // slightly sparser letters rather than an unbounded per-frame draw count.
      for (let i = coords.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [coords[i], coords[j]] = [coords[j], coords[i]];
      }
      const kept = coords.slice(0, 3200);

      dust = kept.map(([tx, ty]) => {
        // In from beyond the edges, so they read as arriving from off-screen.
        const edge = Math.floor(Math.random() * 4);
        const mx = w * 0.6;
        const my = Math.max(240, h * 1.4);
        const sx = edge === 1 ? w + mx : edge === 3 ? -mx : Math.random() * (w + mx * 2) - mx;
        const sy = edge === 0 ? -my : edge === 2 ? h + my : Math.random() * h;
        const vx = tx - w / 2;
        const vy = ty - h / 2;
        const len = Math.hypot(vx, vy) || 1;
        return {
          sx,
          sy,
          tx,
          ty,
          bx: vx / len,
          by: vy / len,
          delay: Math.random() * 0.45,
          size: 1.3 + Math.random() * 1.5,
          phase: Math.random() * Math.PI * 2,
          // Mostly silver, tipped with violet — the same cool-to-accent shift
          // the sparks make as they pack onto the orb.
          sprite: Math.random() < 0.62 ? 0 : Math.random() < 0.72 ? 1 : 2,
        };
      });
    }

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };

    resize();
    let cancelled = false;
    void fontReady.then(() => {
      if (!cancelled) build();
    });
    const onResize = rafDebounce(resize);
    window.addEventListener("resize", onResize);

    let raf = 0;
    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      ctx.clearRect(0, 0, w, h);
      if (!dust.length) return;

      const p = progress.current.p;
      // Cued against the 3D scene: the letters finish assembling as the orb
      // ignites, and come apart on the same frames the sparks do.
      const form = smoothstep(0.24, 0.72, p);
      const burst = smoothstep(0.88, 1, p);
      const alpha = smoothstep(0.16, 0.3, p) * (1 - smoothstep(0.9, 1, p));
      if (alpha <= 0.001) return;

      ctx.globalCompositeOperation = "lighter";
      const blast = burst * burst;

      for (const d of dust) {
        const local = Math.min(1, Math.max(0, (form - d.delay) / (1 - 0.45)));
        const e = easeOutCubic(local);
        // Organic drift that unwinds to nothing as the dot reaches its letter.
        const wobble = (1 - e) * 16;
        let x = d.sx + (d.tx - d.sx) * e + Math.sin(now * 0.002 + d.phase) * wobble * 0.4;
        let y = d.sy + (d.ty - d.sy) * e + Math.cos(now * 0.0016 + d.phase) * wobble * 0.4;
        if (blast > 0) {
          const throwOut = blast * (0.6 + d.size * 0.5) * Math.max(w, h) * 0.9;
          x += d.bx * throwOut;
          y += d.by * throwOut;
        }
        const draw = d.size * 4 * (1 + burst * 1.4);
        ctx.globalAlpha = alpha * (0.35 + 0.65 * e);
        ctx.drawImage(sprites[d.sprite], x - draw * 0.5, y - draw * 0.5, draw, draw);
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      onResize.cancel();
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    // The caller owns positioning entirely — pinning a `relative` of our own
    // here fought the `absolute` passed in, and the box collapsed to zero
    // height, which silently skipped the build (there is nothing to sample in
    // a canvas with no height) and the wordmark simply never appeared.
    <div ref={wrapRef} className={`pointer-events-none ${className}`}>
      <canvas ref={canvasRef} aria-hidden className="block h-full w-full" />
    </div>
  );
}

export function Intro() {
  const { t } = useTranslation();
  const [stage, setStage] = useState<"pending" | "playing" | "done">("pending");
  // The 3D scene outlives its usefulness before the overlay does — see the
  // hand-off in the timeline below.
  const [glLive, setGlLive] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const progress = useRef({ p: 0 });
  const finished = useRef(false);
  const skipping = useRef(false);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const overlayRoot = useOverlayRoot();

  // Decide once, on the client. The answer was already settled before the page
  // painted (@/lib/boot), so this only reads it back.
  useEffect(() => {
    setStage(introWillPlay() ? "playing" : "done");
  }, []);

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    markIntroSeen();
    // Normally already open (the hand-off opens it mid-timeline); this covers
    // skipping and the failsafe.
    markBootReady();
    setStage("done");
  };

  // Lock scrolling while the intro owns the screen. Lenis drives the page, so
  // it has to be stopped at the source — an overflow lock alone would leave it
  // free to keep easing toward a position nobody asked for.
  useEffect(() => {
    if (stage !== "playing") return;
    window.scrollTo(0, 0);
    const lenis = getLenis();
    lenis?.stop();
    const prevHtml = document.documentElement.style.overflow;
    const prevBody = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prevHtml;
      document.body.style.overflow = prevBody;
      window.scrollTo(0, 0);
      lenis?.start();
    };
  }, [stage]);

  // The choreography.
  useEffect(() => {
    if (stage !== "playing") return;

    // Recorded up front, not at the end: a visitor who reloads halfway through
    // is telling us they've had enough of it.
    markIntroSeen();
    // Failsafe: if the GL context never comes up, don't trap the visitor.
    const failsafe = window.setTimeout(finish, 7000);

    const ctx = gsap.context(() => {
      gsap.set([".intro-sub", ".intro-badge"], { opacity: 0 });
      gsap.set(barRef.current, { scaleX: 0 });
      gsap.set(ringRef.current, { opacity: 0, scale: 0.15 });

      const counter = { v: 0 };
      const tl = gsap.timeline({ onComplete: finish, defaults: { ease: "power3.out" } });
      tl.timeScale(INTRO_SPEED);
      tlRef.current = tl;

      // The 3D sequence — one value, read by Genesis's render loop.
      tl.to(progress.current, { p: 1, duration: RUNTIME - 0.55, ease: "none" }, 0);

      // Loader: a counter to 100 and a hairline growing from the centre out,
      // both racing the sparks and landing as the orb forms.
      tl.to(
        counter,
        {
          v: 100,
          duration: 2.4,
          ease: "power2.out",
          onUpdate: () => {
            if (counterRef.current) counterRef.current.textContent = String(Math.round(counter.v));
          },
        },
        0,
      );
      tl.to(barRef.current, { scaleX: 1, duration: 2.4, ease: "power2.out" }, 0);
      tl.fromTo(".intro-badge", { opacity: 0, y: 8 }, { opacity: 0.55, y: 0, duration: 0.7 }, 0.25);

      // AURA has no tween of its own: the wordmark is a dust field reading the
      // same `progress` value the 3D scene does, so its assembly and its blast
      // are already on the beat. See ParticleWordmark.
      //
      // Lands exactly as the loader UI starts clearing out below, so the two
      // never fight over the same properties.
      tl.fromTo(
        ".intro-sub",
        { opacity: 0, y: 12, letterSpacing: "0.2em" },
        { opacity: 0.7, y: 0, letterSpacing: "0.42em", duration: 0.5 },
        2.35,
      );

      // Detonation. The loader UI drops out first (its job is done), a
      // shockwave ring expands past the edges of the screen and the light-leak
      // whites the overlay out. The wordmark tears itself apart on `progress`.
      const blast = RUNTIME - 0.85;
      tl.to(
        [".intro-badge", ".intro-sub", ".intro-skip", barRef.current, counterRef.current],
        { opacity: 0, y: -14, duration: 0.35 },
        blast - 0.2,
      );
      // One tween, not a flash-in then a flash-out: two overlapping tweens on
      // the same opacity would cancel the ring out before it was ever seen.
      tl.fromTo(
        ringRef.current,
        { opacity: 0.95, scale: 0.12 },
        { scale: 4.2, opacity: 0, duration: 0.8, ease: "power2.out" },
        // A breath ahead of the flash: once the light-leak is up the ring has
        // nothing left to read against, so it needs its moment on black first.
        blast - 0.1,
      );
      tl.to(flashRef.current, { opacity: 0.92, duration: 0.22, ease: "power2.in" }, blast + 0.02);
      tl.to(flashRef.current, { opacity: 0, duration: 0.5, ease: "power2.out" }, blast + 0.3);

      // Hand-off. The page's heavy layers are told to start here, at the peak
      // of the flash — whatever they cost to spin up is spent behind an
      // animation that is meant to be blinding.
      tl.call(markBootReady, undefined, blast + 0.2);
      // …and this scene's WebGL context is handed back at the same time rather
      // than held for the remaining dissolve. Browsers cap live contexts, and
      // the hero is bringing two of its own up right now; overlapping them is
      // how a context gets force-lost. By this point the flash is at full
      // strength and there is nothing left of the orb to see through it.
      tl.call(() => setGlLive(false), undefined, blast + 0.42);
      tl.to(rootRef.current, { opacity: 0, duration: 0.55, ease: "power2.inOut" }, blast + 0.3);
    }, rootRef);

    return () => {
      window.clearTimeout(failsafe);
      ctx.revert();
    };
  }, [stage]);

  const skip = () => {
    if (finished.current || skipping.current) return;
    skipping.current = true;
    tlRef.current?.kill();
    gsap.to(rootRef.current, { opacity: 0, duration: 0.4, ease: "power2.out", onComplete: finish });
  };

  // Escape skips too — a full-screen overlay that traps you is a bug.
  useEffect(() => {
    if (stage !== "playing") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter" || e.key === " ") skip();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  if (stage !== "playing" || !overlayRoot) return null;

  // Portalled out of the route tree rather than rendered inline: this overlay
  // is a sibling of <Nav/> under the same <main>, and its own timed unmount
  // (~3s in, or on skip) raced the mobile nav's AnimatePresence overlay
  // mounting in the same commit — React would occasionally lose track of which
  // sibling DOM node to insert before and throw insertBefore/NotFoundError,
  // crashing the whole page (only reachable on "/", the one route that renders
  // this at all). The target is a standalone container rather than <body>,
  // which React owns here too — see @/lib/overlay-root.
  return createPortal(
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100] bg-black overflow-hidden"
      role="dialog"
      aria-label="Intro"
    >
      {glLive && (
        <Canvas
          className="absolute inset-0"
          camera={{ position: [0, 0, 8.6], fov: 42 }}
          // Additive sparks are fill-rate bound, and this canvas is fullscreen —
          // past ~1.4× the extra pixels cost frames and buy nothing visible.
          dpr={[1, 1.4]}
          gl={{ alpha: true, antialias: true, stencil: false, powerPreference: "high-performance" }}
        >
          <Genesis progress={progress} />
        </Canvas>
      )}

      {/* Shockwave from the detonation. */}
      <div
        ref={ringRef}
        className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[46vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white opacity-0 will-change-transform"
        style={{
          boxShadow: "0 0 70px rgba(226,214,255,0.6), inset 0 0 50px rgba(168,85,247,0.4)",
        }}
      />

      {/* Vignette + a dark halo so the wordmark stays legible over the orb —
          the dust is fine white points and the ignited orb behind it is the
          brightest thing on screen, so this earns its keep. */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.65)_100%)]" />
        <div className="absolute left-1/2 top-1/2 h-[40vh] w-[64vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/60 blur-3xl" />
      </div>

      {/* The wordmark, as dust. Full-screen rather than a boxed layer: the
          glow accumulates well past the glyphs, and a canvas cropped close to
          the letters showed that haze cut off as a bright rectangle. */}
      <ParticleWordmark text="AURA" progress={progress} className="absolute inset-0" />

      {/* Centre wordmark. */}
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <p className="intro-badge font-mono-spec mb-7 text-[10px] uppercase tracking-[0.5em] text-white/80">
          {t("intro.badge", "Creative Web Studio")}
        </p>
        <h1 className="sr-only">AURA</h1>
        {/* Reserves the wordmark's place in the column; the dust itself is
            drawn by the full-screen canvas layer above, centred on the same
            spot. Kept symmetric so that centre lines up with this gap. */}
        <div aria-hidden className="h-[30vh] max-h-[260px] min-h-[150px]" />
        <p className="intro-sub font-mono-spec mt-6 text-xs uppercase tracking-[0.42em] text-white/90">
          {t("intro.tagline", "Il tuo brand, elevato")}
        </p>
      </div>

      {/* Loader hairline + counter. */}
      <div className="pointer-events-none absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
        <div className="h-px w-40 overflow-hidden bg-white/10 sm:w-56">
          <div
            ref={barRef}
            className="h-full w-full origin-center bg-gradient-to-r from-transparent via-white to-transparent"
          />
        </div>
        <span className="font-mono-spec text-[10px] uppercase tracking-[0.4em] text-white/40">
          <span ref={counterRef}>0</span>
        </span>
      </div>

      {/* Light-leak flash used at the hand-off. */}
      <div
        ref={flashRef}
        // Violet is a much darker colour than the ember this used to be, so a
        // straight swap turned the light-leak into a dim haze. The core is
        // kept white-hot and given room; the violet does the falloff.
        className="pointer-events-none absolute inset-0 opacity-0 bg-[radial-gradient(circle_at_center,rgba(255,253,255,0.98)_0%,rgba(236,225,255,0.92)_20%,rgba(168,85,247,0.6)_45%,transparent_75%)]"
      />

      <button
        type="button"
        onClick={skip}
        className="intro-skip font-mono-spec absolute bottom-12 right-8 z-10 text-[10px] uppercase tracking-[0.3em] text-white/40 transition-colors hover:text-white/80"
      >
        {t("intro.skip", "Salta")} →
      </button>
    </div>,
    document.body,
  );
}
