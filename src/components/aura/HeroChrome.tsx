"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { getChromeMatcap } from "@/components/three/chrome-matcap";

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
 * - the sphere's tessellation is chosen from the device's own coarse
 *   capabilities: every vertex costs six 3D simplex evaluations (the surface
 *   normal is rebuilt from two displaced neighbours), so the vertex count is
 *   by far the biggest lever on this scene's cost,
 * - while the act is hidden the loop runs in `demand` mode, which still draws
 *   exactly one frame when the canvas mounts. That single frame is what
 *   compiles the shader and uploads the geometry — done during idle time
 *   behind the title card instead of at the moment the act has to appear.
 */

export type HeroChromeMotion = {
  /** Hero pin progress, 0..1 — written by the Hero's ScrollTrigger. */
  progress: number;
};

// The chrome material now lives in @/components/three/chrome-matcap, shared
// with the services crystal — both metal surfaces on this page are lit by one
// light rather than two near-copies of it. See that module for how the matcap
// is drawn.

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
//
// Algebraically identical to the straightforward version of this, with the
// per-vertex redundancy taken out. Three things changed, none of them visible:
//
// - the two noise scroll offsets used to be derived from `uTime` inside
//   `deform`, i.e. recomputed on all three of its (inlined) call sites for
//   every vertex. They depend on nothing but time, so they are now worked out
//   once per frame on the CPU and arrive as uniforms;
// - the mesh is a sphere, so `position == n * r`. Displacing along the normal
//   collapses from `p + n * d * uAmp` to a single scale of `n`, and the
//   `normalize(p)` each call opened with becomes one division in main();
// - `cross(n0, t1)` is the cross product of two perpendicular unit vectors and
//   is therefore already unit-length — the normalize() on it was a no-op.
const VERTEX_SHADER = /* glsl */ `
uniform vec3 uOff1;
uniform vec3 uOff2;
uniform float uAmp;
varying vec3 vNormal;
varying vec3 vViewDir;
${GLSL_SIMPLEX}
// n: unit direction on the sphere. r: the undisplaced radius.
vec3 deform(vec3 n, float r) {
  float d = snoise(n * 1.35 + uOff1) * 0.7
          + snoise(n * 2.9 + uOff2) * 0.3;
  return n * (r + d * uAmp);
}
void main() {
  float r = length(position);
  vec3 n0 = position / r;
  vec3 up = abs(n0.y) < 0.98 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
  vec3 t1 = normalize(cross(up, n0));
  vec3 t2 = cross(n0, t1);
  float e = 0.12;
  // The neighbours are stepped off the *undisplaced surface point* (n0 * r),
  // not off n0, so the angular step stays what it always was.
  vec3 dp  = deform(n0, r);
  vec3 dp1 = deform(normalize(n0 * r + t1 * e), r);
  vec3 dp2 = deform(normalize(n0 * r + t2 * e), r);
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
uniform float uOpacity;
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
  // Real alpha, not a fade toward black: the masthead sits *behind* this
  // canvas (z-5 under the layer stack, see Hero), so darkening the metal
  // would punch a black hole through the type instead of revealing it.
  gl_FragColor = vec4(col, uOpacity);
}
`;

function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

/** Ease in and out of a 0..1 ramp, so the glide to centre never starts or
 *  stops abruptly the way tracking the scroll linearly would. */
function smoothstep(v: number) {
  return v * v * (3 - 2 * v);
}

/**
 * Where the form rests on the title card, as a fraction of the frame's
 * half-width and half-height. Down and to the right: clear of the masthead's
 * centre line, and diagonally opposite the copy in the lower-left corner.
 * Both fall to zero as the scroll centres it for the second act.
 */
const RESTING_X = 0.62;
const RESTING_Y = -0.3;

/**
 * How much of its full size the form holds while it rests on the title card,
 * and how far the metal is faded back there.
 *
 * The act-two composition is the one this object was sized for: dead centre,
 * with the promise copy over it. On the title card it is a supporting element
 * — it has to interrupt the masthead without eating it, so it rests small,
 * out at the right edge, and translucent enough that the glyphs behind read
 * *through* the metal rather than being erased by it. Both ride the same
 * `settle` ramp as the travel, so the object grows into its full presence at
 * exactly the moment it becomes the subject.
 */
const RESTING_SCALE = 0.52;
const RESTING_OPACITY = 0.72;

/**
 * Icosahedron subdivision level. `detail` costs quadratically: 20·(d+1)²
 * triangles, and every vertex of every one of them runs six 3D simplex
 * evaluations (the surface normal is rebuilt from two displaced neighbours),
 * so this is the biggest single lever on the scene's cost.
 *
 * Both tiers came down after measuring: at 28 the sphere is ~50k vertices,
 * which is what made the act stutter on anything but a fast discrete GPU — and
 * against a blob this soft, this large and this reflective, the silhouette is
 * indistinguishable from 20. The coarse tier is for weak GPUs that still get
 * the canvas at all; phones don't render this component in the first place
 * (see Hero).
 */
function pickDetail() {
  if (typeof window === "undefined") return 20;
  const smallish = Math.min(window.innerWidth, window.innerHeight) < 700;
  const cores = navigator.hardwareConcurrency ?? 4;
  if (smallish || cores <= 4) return 12;
  return 20;
}

/**
 * The subdivided icosahedron, welded into an indexed buffer.
 *
 * THREE's IcosahedronGeometry is non-indexed: every triangle carries its own
 * three copies of its corners. On a sphere each corner is shared by six
 * triangles, so at detail 20 that is 8,820 triangles = 26,460 vertex shader
 * invocations to draw 4,412 distinct points — five of every six running the
 * same six simplex evaluations to arrive at a result that had already been
 * computed. That waste was the bulk of this scene's per-frame cost.
 *
 * Welding them and handing the GPU an index buffer lets its post-transform
 * cache shade each point about once. Same vertices, same silhouette, same
 * shader; roughly a sixth of the work.
 *
 * `normal` and `uv` are not carried over, and the weld is keyed on position
 * alone. The shader builds its own normal from the displaced surface and never
 * reads a uv, so neither is worth the bandwidth — and matching on all three
 * would have let the polyhedron's uv seam split corners that are a single
 * point in space, blocking the weld exactly where it pays best.
 */
function makeChromeGeometry(radius: number, detail: number): THREE.BufferGeometry {
  const src = new THREE.IcosahedronGeometry(radius, detail);
  const pos = src.getAttribute("position");

  const positions: number[] = [];
  const indices: number[] = [];
  // Numeric keys, not strings: this runs over tens of thousands of vertices on
  // the main thread and string building would dominate it.
  const seen = new Map<number, number>();

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    // Quantised to 1e-4. Corners reached from different faces can disagree in
    // the last few bits, and neighbouring points on this sphere are ~0.07
    // apart, so the grid is far finer than it needs to be to separate them.
    // A pair that straddles a grid line simply fails to weld, which costs one
    // duplicated vertex and nothing else: the displacement is a pure function
    // of position, so both copies land in the same place regardless.
    const key =
      ((Math.round(x * 1e4) + 32768) * 65536 + (Math.round(y * 1e4) + 32768)) * 65536 +
      (Math.round(z * 1e4) + 32768);
    let at = seen.get(key);
    if (at === undefined) {
      at = positions.length / 3;
      seen.set(key, at);
      positions.push(x, y, z);
    }
    indices.push(at);
  }

  src.dispose();

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  // A plain array here lets three pick a 16- or 32-bit index buffer itself.
  geo.setIndex(indices);
  // Set rather than computed: the mesh is drawn with frustumCulled off, and a
  // bound that ignored the displacement would be wrong anyway.
  geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), radius * 2.2);
  return geo;
}

function ChromeBlob({
  motion,
  detail,
  running,
}: {
  motion: React.MutableRefObject<HeroChromeMotion>;
  detail: number;
  /** Mirrors the render loop, so idle work can be unhooked with it. */
  running: boolean;
}) {
  const mesh = useRef<THREE.Mesh>(null!);
  const group = useRef<THREE.Group>(null!);
  const timeRef = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });
  // World-space size of the frame at the blob's depth. Re-read on resize, and
  // used to keep the scroll zoom inside the canvas — see the clamp below.
  const viewport = useThree((s) => s.viewport);

  const matcap = useMemo(() => getChromeMatcap(), []);

  const geometry = useMemo(() => makeChromeGeometry(1.45, detail), [detail]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  const uniforms = useMemo(
    () => ({
      uOff1: { value: new THREE.Vector3() },
      uOff2: { value: new THREE.Vector3() },
      uAmp: { value: 0.22 },
      uOpacity: { value: RESTING_OPACITY },
      uMatcap: { value: matcap },
    }),
    [matcap],
  );

  // Only bound while the loop is actually running. A high-polling-rate mouse
  // fires this hundreds of times a second, and for most of the page's life
  // this act is either hidden behind the title card or scrolled past.
  useEffect(() => {
    if (!running) return;
    const onMove = (e: MouseEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [running]);

  useFrame((_, delta) => {
    // Clamp the delta so a resumed/paused tab never produces a violent jump.
    const d = Math.min(delta, 1 / 30);
    timeRef.current += d;

    // The act runs from ~0.12 to 0.92 of the hero pin; normalize so the blob
    // finishes "melting" around three quarters of the way through.
    const t = clamp01((motion.current.progress - 0.12) / 0.7);

    // Both noise octaves scroll off the same clock. Done here, once, instead
    // of three times per vertex in the shader — see VERTEX_SHADER.
    const slow = timeRef.current * 0.28;
    uniforms.uOff1.value.set(0, slow, 0);
    uniforms.uOff2.value.set(-slow * 0.7, 0, -slow * 0.45);
    // exp() damping — frame-rate independent easing toward the target.
    const ease = 1 - Math.exp(-3 * d);
    uniforms.uAmp.value += (0.22 + t * 0.26 - uniforms.uAmp.value) * ease;

    const m = mesh.current;
    m.rotation.y += d * (0.15 + t * 0.45);
    m.position.y = Math.sin(timeRef.current * 0.6) * 0.08;

    // Scroll promotes the form from a supporting element to the subject, and
    // it does that three ways at once off a single ramp: it travels in from
    // low and right of centre — off the masthead's axis, diagonally opposite
    // the copy — to dead centre, it grows to full size, and it resolves from
    // translucent to solid metal.
    //
    // The travel offsets are fractions of the frame's own half-extents, read
    // from the live viewport, so the composition holds its proportions at any
    // window size rather than drifting with an absolute world offset. At rest
    // it lands over the tail of "Studio" rather than clear of the type: the
    // point of standing the masthead behind the object is that the object
    // interrupts it, and one parked in the empty margin interrupts nothing.
    const g = group.current;
    const settle = smoothstep(clamp01((motion.current.progress - 0.04) / 0.22));
    const off = 1 - settle;
    g.position.x = RESTING_X * (viewport.width / 2) * off;
    g.position.y = RESTING_Y * (viewport.height / 2) * off;
    // Scale on the group, not the geometry: the displacement amplitude is in
    // the mesh's own object space, so scaling here shrinks the form and its
    // melt together instead of leaving an outsized wobble on a small blob.
    g.scale.setScalar(RESTING_SCALE + (1 - RESTING_SCALE) * settle);
    // Straight off the ramp, undamped — `settle` is already smoothstepped and
    // scrubbed, so a second easing layer would only make the fill lag the
    // travel it is supposed to happen with.
    uniforms.uOpacity.value = RESTING_OPACITY + (1 - RESTING_OPACITY) * settle;

    // Cursor lean, damped.
    const lean = 1 - Math.exp(-3.5 * d);
    g.rotation.x += (pointer.current.y * 0.22 - g.rotation.x) * lean;
    g.rotation.y += (pointer.current.x * 0.3 - g.rotation.y) * lean;
  });

  return (
    <group ref={group}>
      <mesh ref={mesh} frustumCulled={false}>
        <primitive object={geometry} attach="geometry" />
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={VERTEX_SHADER}
          fragmentShader={FRAGMENT_SHADER}
          // Safe on a mesh that self-overlaps like this one only because the
          // displacement is purely radial: the surface stays star-shaped about
          // the centre, so back-face culling (ShaderMaterial's default side)
          // leaves at most one layer per view ray. Without that, triangles
          // blending in index order would double-blend wherever a far one
          // happened to draw before a near one, and the metal would mottle.
          transparent
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
  const [detail, setDetail] = useState(0);
  const [inView, setInView] = useState(true);

  // Client-only (avoids any SSR/hydration concern) and skipped entirely under
  // prefers-reduced-motion, like every other animated layer on the site.
  //
  // Built synchronously on mount, deliberately. This used to wait for an idle
  // slot (with a 2.5s timeout) on the reasoning that the geometry build and
  // shader compile are a long task — but the *mount itself* is now the gate:
  // Hero doesn't render this component until the visitor's first scroll, which
  // is a full screen of scrolling before act two is due. Waiting a second time
  // meant that on a busy main thread — exactly when someone is scrolling —
  // requestIdleCallback ran out its timeout and the blob faded in seconds into
  // an act that had already started without it. That was the late spawn.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setDetail(pickDetail());
  }, []);

  const enabled = detail > 0;

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
        // The canvas is sized to the blob rather than to the section. Three's
        // fov is vertical, so the form is centred and scaled by the viewport's
        // height; anything outside the box around it is transparent pixels
        // being cleared, shaded and MSAA-resolved every frame for nothing.
        //
        // 16:9 is the widest the blob ever needs, at the far end of the scroll
        // zoom. That makes this full-bleed on a 16:9 screen and narrower than
        // the section on anything wider — the saving now only shows up on
        // ultrawide monitors. It was a tighter 6:5 before the zoom existed;
        // the zoom needs the room, and a hard rectangular cut across the
        // middle of the screen is not a trade worth making for fill rate.
        //
        // Full-bleed. This used to be a narrower centred box — the form only
        // ever occupied the middle of the frame, so the rest was transparent
        // pixels being cleared and MSAA-resolved for nothing. That stopped
        // paying once the form started travelling across the frame: a box
        // sized to hold it at both ends is the whole width anyway, and one
        // sized to hold it at neither cuts it against a hard edge mid-screen.
        //
        // The fill-rate saving is gone; the geometry weld, which was the far
        // larger win, is not. Bleeding off the viewport edge is now the
        // intended look at rest rather than a bug to design around.
        <div className="absolute inset-0">
          <Canvas
            camera={{ position: [0, 0, 6], fov: 42 }}
            // Capped below the shader background's ceiling: this canvas is only
            // ever seen behind large soft chrome, where extra pixels buy
            // nothing — the silhouette is carried by MSAA, not by resolution.
            dpr={[1, 1.25]}
            flat
            // "demand" (not "never") while hidden: R3F still renders the single
            // frame that warms the pipeline, then stays idle until it's needed.
            frameloop={running ? "always" : "demand"}
            gl={{
              alpha: true,
              antialias: true,
              stencil: false,
              depth: true,
              powerPreference: "high-performance",
            }}
          >
            <ChromeBlob motion={motion} detail={detail} running={running} />
          </Canvas>
        </div>
      )}
    </div>
  );
}
