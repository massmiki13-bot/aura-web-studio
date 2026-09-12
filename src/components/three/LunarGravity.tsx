"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

import { CanvasBoundary } from "@/components/CanvasBoundary";
import { useBootReady } from "@/lib/use-boot-ready";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/* ------------------------------------------------------------------------ *
 * Lunar gravity
 *
 * A moon with a ring of dust that assembles out of its own surface as the
 * section is scrolled through, and a belt of rock that ploughs furrows in the
 * dust as it passes.
 *
 * Adapted from the published component, and cut down hard, because this runs
 * on a page that already carries three other WebGL scenes:
 *
 * · No `@react-three/drei`. The original used it for three things — a texture
 *   loader, `Environment` and `OrbitControls`. The first is four lines with
 *   `useLoader`; the third is an interaction this section (a scroll-driven
 *   backdrop) shouldn't have; and the second was the expensive one — it pulls
 *   a multi-megabyte HDR off a third-party CDN and runs PMREM over it, and
 *   the original mounted it *twice*. Two directional lights and an ambient do
 *   the same job here for nothing.
 * · 30,000 ring particles, not 60,000, and 28 asteroids in the deformation
 *   loop rather than 75 — that loop runs per vertex per frame, so at the
 *   original numbers it is 4.5 million distance tests a frame.
 *
 *   Measured rather than assumed, and the honest answer is that this one was
 *   not the bottleneck: on an Intel UHD 630, the original counts also held
 *   59.9fps. What the halving actually buys is worst-frame headroom (116ms →
 *   83ms on the same machine) and about a megabyte less buffer, on hardware
 *   weaker than the one it was measured on.
 * · No shadow maps. A 2048² shadow pass costs a full extra render of the
 *   scene, and on a black stage lit from one side there is nothing in it to
 *   see.
 * · The texture is served from this origin instead of the component author's
 *   CDN — an outside domain in the critical path of a section is an outage
 *   waiting to happen.
 *
 * The ring's reveal is scrubbed against the section's own scroll rather than
 * fired by a click. Nothing else on this site asks to be clicked to animate,
 * and a reveal nobody discovers is a reveal that isn't there.
 * ------------------------------------------------------------------------ */

const MOON_RADIUS = 2.0;
const PARTICLES = 30000;
/** Asteroids that deform the dust. Kept well under the belt's own count. */
const HEAVY = 28;
const BELT = 70;

/** One ring of dust, generated once for the life of the page. */
function buildRing() {
  const pos = new Float32Array(PARTICLES * 3);
  const col = new Float32Array(PARTICLES * 3);
  const rnd = new Float32Array(PARTICLES);

  for (let i = 0; i < PARTICLES; i++) {
    const angle = Math.random() * Math.PI * 2;
    // Biased inward, so the ring is dense at the moon and thins outward.
    const rDist = Math.pow(Math.random(), 1.5);
    const radius = 2.2 + rDist * 2.2;

    const thickness = 0.4 - rDist * 0.2;
    // Three uniforms summed: a cheap bell, so the ring has a soft edge in Y
    // rather than a slab's.
    const ySpread = Math.random() + Math.random() + Math.random() - 1.5;

    pos[i * 3] = Math.cos(angle) * radius;
    pos[i * 3 + 1] = ySpread * thickness;
    pos[i * 3 + 2] = Math.sin(angle) * radius;

    const intensity = 1 - rDist;

    /**
     * Monochrome, unlike the original's blue and purple.
     *
     * This site has no hue anywhere: a ring with cyan and violet sparks in it
     * would be the only coloured thing on the whole page. The variation here
     * is temperature instead — most of the dust neutral, a minority a touch
     * cool — which keeps the sparkle without introducing a palette.
     */
    const cool = Math.random() < 0.18 ? 0.12 : 0;
    const base = 0.42 + Math.random() * 0.12;
    const sparkle = Math.random() > 0.955 ? 2.6 : 1;

    col[i * 3] = (base - cool * 0.5) * intensity * sparkle;
    col[i * 3 + 1] = base * intensity * sparkle;
    col[i * 3 + 2] = (base + cool) * intensity * sparkle;
    rnd[i] = Math.random();
  }
  return { pos, col, rnd };
}

function Moon({ texture }: { texture: THREE.Texture }) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (mesh.current) mesh.current.rotation.y += Math.min(delta, 1 / 30) * 0.05;
  });
  return (
    <mesh ref={mesh}>
      <sphereGeometry args={[MOON_RADIUS, 48, 48]} />
      <meshStandardMaterial
        map={texture}
        bumpMap={texture}
        bumpScale={0.02}
        roughness={0.85}
        metalness={0.05}
      />
    </mesh>
  );
}

function Ring({
  progress,
  heavyRef,
}: {
  progress: React.MutableRefObject<number>;
  heavyRef: React.MutableRefObject<Float32Array>;
}) {
  const points = useRef<THREE.Points>(null);
  const geo = useMemo(() => buildRing(), []);

  const uniforms = useRef({
    uProgress: { value: 0 },
    uAsteroids: { value: new Float32Array(HEAVY * 4) },
    uTime: { value: 0 },
  });

  // Scratch objects, hoisted out of the frame loop: allocating a Matrix4 and
  // a Vector3 per asteroid per frame is 1,500 objects a second for the
  // collector to deal with, in a loop that is trying to hold 60fps.
  const inv = useMemo(() => new THREE.Matrix4(), []);
  const v = useMemo(() => new THREE.Vector3(), []);
  const local = useMemo(() => new Float32Array(HEAVY * 4), []);

  useFrame((state, delta) => {
    const d = Math.min(delta, 1 / 30);
    uniforms.current.uTime.value = state.clock.elapsedTime;
    uniforms.current.uProgress.value = progress.current;

    const p = points.current;
    if (!p) return;
    p.rotation.y -= d * 0.02;

    // The dust is deformed in its own local space, so the world-space rock
    // positions have to come back through the ring's inverse matrix first.
    p.updateMatrix();
    inv.copy(p.matrix).invert();
    for (let i = 0; i < HEAVY; i++) {
      v.set(heavyRef.current[i * 4], heavyRef.current[i * 4 + 1], heavyRef.current[i * 4 + 2]);
      v.applyMatrix4(inv);
      local[i * 4] = v.x;
      local[i * 4 + 1] = v.y;
      local[i * 4 + 2] = v.z;
      local[i * 4 + 3] = heavyRef.current[i * 4 + 3];
    }
    uniforms.current.uAsteroids.value = local;
  });

  const onBeforeCompile = (shader: THREE.WebGLProgramParametersWithUniforms) => {
    shader.uniforms.uProgress = uniforms.current.uProgress;
    shader.uniforms.uAsteroids = uniforms.current.uAsteroids;
    shader.uniforms.uTime = uniforms.current.uTime;

    shader.vertexShader = `
      uniform float uProgress;
      uniform vec4 uAsteroids[${HEAVY}];
      uniform float uTime;
      attribute float aRandom;
      varying float vProgress;
      ${shader.vertexShader}`;

    shader.vertexShader = shader.vertexShader.replace(
      "#include <begin_vertex>",
      /* glsl */ `
      vec3 transformed = vec3(position);

      // Each particle waits its turn by angle, so the ring sweeps into
      // existence around the moon instead of fading up all at once.
      float angle = atan(transformed.x, transformed.z);
      float spawnThreshold = 1.0 - abs(angle) / 3.14159265359;
      float particleProgress = smoothstep(0.0, 0.4, (uProgress * 1.4) - spawnThreshold);
      vProgress = particleProgress;

      transformed.y += sin(angle * 10.0 + uTime) * 0.05 * aRandom;

      // Only once the ring is mostly there — before that the rocks have
      // nothing to plough through, and this is the expensive part of the
      // shader.
      if (uProgress > 0.5) {
        for (int i = 0; i < ${HEAVY}; i++) {
          vec4 ast = uAsteroids[i];
          vec3 delta = transformed - ast.xyz;
          float dist = length(delta);
          float rad = ast.w * 2.0 + 0.15;
          if (dist < rad) {
            float force = pow((rad - dist) / rad, 2.0);
            transformed += normalize(delta) * force * 0.4;
            transformed.y += force * 0.20 * (aRandom - 0.5);
          }
        }
      }

      // Unwinding: the dust starts wound tight against the surface and
      // spirals out to where it belongs.
      float swirl = (1.0 - particleProgress) * 4.0;
      float s = sin(swirl);
      float c = cos(swirl);
      transformed.xz = mat2(c, -s, s, c) * transformed.xz;
      transformed.y += (1.0 - particleProgress) * (transformed.y >= 0.0 ? 1.0 : -1.0);

      vec3 moonSurface = normalize(transformed) * 2.1;
      transformed = mix(moonSurface, transformed, particleProgress);
      `,
    );

    shader.fragmentShader = `varying float vProgress;\n${shader.fragmentShader}`;
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <color_fragment>",
      "#include <color_fragment>\n      diffuseColor.a *= vProgress;",
    );
  };

  return (
    <points ref={points} rotation={[-Math.PI / 2, 0, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[geo.pos, 3]} />
        <bufferAttribute attach="attributes-color" args={[geo.col, 3]} />
        <bufferAttribute attach="attributes-aRandom" args={[geo.rnd, 1]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.009}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        onBeforeCompile={onBeforeCompile}
      />
    </points>
  );
}

type Rock = {
  angle: number;
  baseRadius: number;
  amp: number;
  radialSpeed: number;
  phase: number;
  z: number;
  speed: number;
  rx: number;
  ry: number;
  rz: number;
  rsx: number;
  rsy: number;
  rsz: number;
  scale: number;
};

function buildBelt(): Rock[] {
  const out: Rock[] = [];
  for (let i = 0; i < BELT; i++) {
    out.push({
      angle: Math.random() * Math.PI * 2,
      baseRadius: 2.8 + Math.random() * 2.0,
      amp: 0.5 + Math.random() * 1.5,
      radialSpeed: 0.15 + Math.random() * 0.25,
      phase: Math.random() * Math.PI * 2,
      z: (Math.random() - 0.5) * 0.8,
      speed: (0.04 + Math.random() * 0.08) * (Math.random() > 0.5 ? 1 : -1),
      rx: Math.random() * Math.PI,
      ry: Math.random() * Math.PI,
      rz: Math.random() * Math.PI,
      rsx: (Math.random() - 0.5) * 0.05,
      rsy: (Math.random() - 0.5) * 0.05,
      rsz: (Math.random() - 0.5) * 0.05,
      // Mostly small, a few large: a fourth power keeps the big ones rare.
      scale: 0.02 + Math.pow(Math.random(), 4) * 0.18,
    });
  }
  // Biggest first, so the ones the dust reacts to are the ones you can see.
  out.sort((a, b) => b.scale - a.scale);
  return out;
}

function Belt({
  texture,
  progress,
  heavyRef,
}: {
  texture: THREE.Texture;
  progress: React.MutableRefObject<number>;
  heavyRef: React.MutableRefObject<Float32Array>;
}) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const rocks = useMemo(() => buildBelt(), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const shown = useRef(0);

  useFrame((_, delta) => {
    const m = mesh.current;
    if (!m) return;
    const d = Math.min(delta, 1 / 30);

    // The belt arrives with the ring and leaves with it.
    const target = progress.current > 0.02 ? 1 : 0;
    shown.current = THREE.MathUtils.lerp(shown.current, target, d * (target ? 2 : 5));
    if (shown.current < 0.01) {
      m.visible = false;
      return;
    }
    m.visible = true;

    for (let i = 0; i < rocks.length; i++) {
      const r = rocks[i];
      r.angle += r.speed * d;
      r.phase += r.radialSpeed * d;

      let radius = r.baseRadius + Math.sin(r.phase) * r.amp;
      // Soft floor rather than a clamp, so a rock swinging inward slows into
      // the moon instead of sticking flat against it.
      if (radius < 2.15) radius = 2.15 + (2.15 - radius) * 0.85;

      const x = Math.cos(r.angle) * radius;
      const y = Math.sin(r.angle) * radius;

      if (i < HEAVY) {
        heavyRef.current[i * 4] = x;
        heavyRef.current[i * 4 + 1] = y;
        heavyRef.current[i * 4 + 2] = r.z;
        heavyRef.current[i * 4 + 3] = r.scale;
      }

      r.rx += r.rsx;
      r.ry += r.rsy;
      r.rz += r.rsz;

      dummy.position.set(x, y, r.z);
      dummy.rotation.set(r.rx, r.ry, r.rz);
      dummy.scale.setScalar(r.scale * shown.current);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, BELT]} frustumCulled={false}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        map={texture}
        bumpMap={texture}
        bumpScale={0.08}
        roughness={0.75}
        metalness={0.05}
      />
    </instancedMesh>
  );
}

function Scene({
  progress,
  offsetX,
}: {
  progress: React.MutableRefObject<number>;
  offsetX: number;
}) {
  const texture = useLoader(THREE.TextureLoader, "/textures/moon.webp");
  const heavyRef = useRef(new Float32Array(HEAVY * 4));
  const group = useRef<THREE.Group>(null);

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
  }, [texture]);

  // Same off-centre framing the crystal had: the copy on the left needs the
  // space, and a fraction of the frame means the same thing on every aspect.
  const shift = offsetX * 3.4;

  return (
    <group ref={group} position={[shift, 0, 0]} rotation={[Math.PI / 8, 0, 0]}>
      <Moon texture={texture} />
      <Ring progress={progress} heavyRef={heavyRef} />
      <Belt texture={texture} progress={progress} heavyRef={heavyRef} />
    </group>
  );
}

export function LunarGravity({
  className = "",
  offsetX = 0,
}: {
  className?: string;
  offsetX?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const booted = useBootReady();
  const [enabled, setEnabled] = useState(false);
  const [inView, setInView] = useState(false);
  const progress = useRef(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !enabled) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      rootMargin: "300px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, [enabled]);

  /**
   * The ring's assembly, scrubbed against the section.
   *
   * Written to a ref, not to state: this changes every scrolled frame and the
   * only thing that reads it is the render loop.
   */
  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !enabled) return;
    const section = el.closest("section");
    if (!section) return;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section,
        start: "top 70%",
        end: "bottom 85%",
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          progress.current = self.progress;
        },
      });
    }, el);
    return () => ctx.revert();
  }, [enabled]);

  const mounted = enabled && booted;
  const running = mounted && inView;

  return (
    <div ref={wrapRef} className={className}>
      {mounted && (
        <CanvasBoundary label="lunar gravity">
          <Canvas
            camera={{ position: [0, 3.4, 9.4], fov: 42 }}
            dpr={[1, 1.5]}
            // Nothing is rendered at all while the section is off screen —
            // "demand" with no invalidate call is a stopped loop.
            frameloop={running ? "always" : "demand"}
            gl={{
              alpha: true,
              antialias: true,
              stencil: false,
              depth: true,
              powerPreference: "high-performance",
            }}
          >
            <ambientLight intensity={0.08} />
            <directionalLight position={[8, 5, 5]} intensity={2.1} />
            <directionalLight position={[-6, -3, -5]} intensity={0.35} color="#9db4d0" />
            {/* `useLoader` suspends until the texture is decoded, and a
                suspension with nothing to catch it takes the whole canvas
                down to nothing rather than to a moonless scene. */}
            <Suspense fallback={null}>
              <Scene progress={progress} offsetX={offsetX} />
            </Suspense>
          </Canvas>
        </CanvasBoundary>
      )}
    </div>
  );
}
