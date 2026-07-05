import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * The hero's second act: a liquid-chrome form that undulates, melts further
 * as the visitor scrolls through the pin, and leans toward the cursor.
 * Replaces the old Spline MacBook scene — fully self-contained (three.js +
 * R3F were already dependencies, the matcap is drawn on a canvas at runtime),
 * so the hero no longer ships the multi-MB Spline runtime at all.
 *
 * Built to stay flawless on weak machines:
 * - all displacement happens in the vertex shader (zero per-frame CPU work
 *   beyond a handful of uniform writes),
 * - scroll progress arrives through a mutable ref, never through React state,
 * - every eased value uses exp() damping on the frame delta, so the motion
 *   feels identical at 30, 60 or 144Hz,
 * - the render loop is switched off (`frameloop="never"`) whenever the act
 *   is hidden behind the title card or the hero is scrolled out of view.
 */

export type HeroChromeMotion = {
  /** Hero pin progress, 0..1 — written by the Hero's ScrollTrigger. */
  progress: number;
};

// Monochrome "studio softbox" matcap, drawn procedurally: a bright key
// reflection band, two thinner fill bands, and a dark grazing-angle rim.
// Keeps the look on-palette and avoids shipping/fetching a texture.
function makeMatcapTexture(): THREE.CanvasTexture {
  const size = 512;
  const cv = document.createElement("canvas");
  cv.width = cv.height = size;
  const g = cv.getContext("2d")!;

  const base = g.createRadialGradient(
    size * 0.38,
    size * 0.34,
    size * 0.05,
    size * 0.5,
    size * 0.5,
    size * 0.62,
  );
  base.addColorStop(0, "#e8eaee");
  base.addColorStop(0.3, "#8b8e96");
  base.addColorStop(0.62, "#26272c");
  base.addColorStop(1, "#020203");
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
  band(-size * 0.02, size * 0.07, 0.45);
  band(size * 0.18, size * 0.05, 0.22);
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
  rim.addColorStop(0.75, "rgba(0,0,0,0.25)");
  rim.addColorStop(1, "rgba(0,0,0,0.82)");
  g.fillStyle = rim;
  g.fillRect(0, 0, size, size);

  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

// Ashima 3D simplex noise (webgl-noise, MIT) — the standard GPU noise.
const GLSL_SIMPLEX = /* glsl */ `
vec3 mod289(vec3 x){return x - floor(x * (1.0/289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0/289.0)) * 289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0)) + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

// Displaces along the sphere normal with two octaves of simplex noise, then
// rebuilds the normal by sampling two tangent neighbours — the matcap shading
// stays correct however far the surface melts.
const VERTEX_SHADER = /* glsl */ `
uniform float uTime;
uniform float uAmp;
varying vec3 vNormal;
varying vec3 vViewDir;
${GLSL_SIMPLEX}
vec3 deform(vec3 p) {
  vec3 n = normalize(p);
  float slow = uTime * 0.28;
  float d = snoise(n * 1.35 + vec3(0.0, slow, 0.0)) * 0.7
          + snoise(n * 2.9 - vec3(slow * 0.7, 0.0, slow * 0.45)) * 0.3;
  return p + n * (d * uAmp);
}
void main() {
  vec3 p = position;
  float r = length(p);
  vec3 n0 = normalize(p);
  vec3 up = abs(n0.y) < 0.98 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
  vec3 t1 = normalize(cross(up, n0));
  vec3 t2 = normalize(cross(n0, t1));
  float e = 0.12;
  vec3 dp  = deform(p);
  vec3 dp1 = deform(normalize(p + t1 * e) * r);
  vec3 dp2 = deform(normalize(p + t2 * e) * r);
  vec3 nn = normalize(cross(dp1 - dp, dp2 - dp));
  if (dot(nn, n0) < 0.0) nn = -nn;
  vNormal = normalize(normalMatrix * nn);
  vec4 mv = modelViewMatrix * vec4(dp, 1.0);
  vViewDir = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}
`;

const FRAGMENT_SHADER = /* glsl */ `
uniform sampler2D uMatcap;
varying vec3 vNormal;
varying vec3 vViewDir;
void main() {
  vec3 n = normalize(vNormal);
  vec3 v = normalize(vViewDir);
  vec2 muv = n.xy * 0.48 + 0.5;
  vec3 col = texture2D(uMatcap, muv).rgb;
  float fres = pow(1.0 - max(dot(n, v), 0.0), 3.0);
  col += fres * 0.38;
  col *= vec3(0.94, 0.96, 1.04);
  gl_FragColor = vec4(col, 1.0);
}
`;

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

function ChromeBlob({ motion }: { motion: React.MutableRefObject<HeroChromeMotion> }) {
  const mesh = useRef<THREE.Mesh>(null!);
  const group = useRef<THREE.Group>(null!);
  const timeRef = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });

  const matcap = useMemo(makeMatcapTexture, []);
  useEffect(() => () => matcap.dispose(), [matcap]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmp: { value: 0.22 },
      uMatcap: { value: matcap },
    }),
    [matcap],
  );

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame((_, delta) => {
    // Clamp the delta so a resumed/paused tab never produces a violent jump.
    const d = Math.min(delta, 1 / 30);
    timeRef.current += d;

    // The act runs from ~0.12 to 0.92 of the hero pin; normalize so the blob
    // finishes "melting" around three quarters of the way through.
    const t = clamp01((motion.current.progress - 0.12) / 0.7);

    uniforms.uTime.value = timeRef.current;
    // exp() damping — frame-rate independent easing toward the target.
    const ease = 1 - Math.exp(-3 * d);
    uniforms.uAmp.value += (0.22 + t * 0.26 - uniforms.uAmp.value) * ease;

    const m = mesh.current;
    m.rotation.y += d * (0.15 + t * 0.45);
    m.position.y = Math.sin(timeRef.current * 0.6) * 0.08;
    const s = 1 + t * 0.12;
    m.scale.setScalar(s);

    // Cursor lean, damped.
    const g = group.current;
    const lean = 1 - Math.exp(-3.5 * d);
    g.rotation.x += (pointer.current.y * 0.22 - g.rotation.x) * lean;
    g.rotation.y += (pointer.current.x * 0.3 - g.rotation.y) * lean;
  });

  return (
    <group ref={group}>
      <mesh ref={mesh} frustumCulled={false}>
        <icosahedronGeometry args={[1.45, 48]} />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={VERTEX_SHADER}
          fragmentShader={FRAGMENT_SHADER}
        />
      </mesh>
    </group>
  );
}

export function HeroChrome({
  className = "",
  paused = false,
  motion,
}: {
  className?: string;
  /** Stop the render loop while the act is hidden behind the title card. */
  paused?: boolean;
  motion: React.MutableRefObject<HeroChromeMotion>;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [inView, setInView] = useState(true);

  // Client-only (avoids any SSR/hydration concern) and skipped entirely under
  // prefers-reduced-motion, like every other animated layer on the site.
  useEffect(() => {
    setEnabled(!window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  // Stop rendering once the hero is scrolled well out of view.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !enabled) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: "200px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, [enabled]);

  const running = enabled && inView && !paused;

  return (
    <div ref={wrapRef} className={className}>
      {enabled && (
        <Canvas
          camera={{ position: [0, 0, 6], fov: 42 }}
          dpr={[1, 1.5]}
          flat
          frameloop={running ? "always" : "never"}
          gl={{ alpha: true, antialias: true, stencil: false, powerPreference: "high-performance" }}
        >
          <ChromeBlob motion={motion} />
        </Canvas>
      )}
    </div>
  );
}
