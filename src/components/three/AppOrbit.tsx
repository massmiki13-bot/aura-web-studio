"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

import { CanvasBoundary } from "@/components/CanvasBoundary";
import { useBootReady } from "@/lib/use-boot-ready";

/* ------------------------------------------------------------------------ *
 * App orbit
 *
 * The header scene for the apps page: a body with three tilted orbits around
 * it, a lit node riding each one, and a field of stars behind.
 *
 * It is the page's argument in one object. An app built to order is a core
 * with things in orbit around it — data, people, the agent — and the orbits
 * are what the page then explains. It is also the only piece on the page that
 * is literally three-dimensional, which is why the header no longer reads as
 * a column of text with a hole punched next to it.
 *
 * Shares the moon texture and the light direction with the services section
 * and the rock field, so a visitor crossing the site reads one world rather
 * than a set of unrelated props.
 *
 * Costs: one sphere, three thin toruses, three small spheres and one points
 * cloud — a handful of draw calls. The loop is stopped outright while the
 * header is off screen, and the whole canvas is never mounted at all under
 * prefers-reduced-motion.
 * ------------------------------------------------------------------------ */

const TEXTURE = "/textures/moon.webp";

/** Tilt, radius and speed of each orbit. Deliberately unrelated numbers: three
 *  rings on tidy multiples read as a diagram, not as a system. */
const ORBITS = [
  { tilt: [1.15, 0.2, 0.35], radius: 2.35, speed: 0.22, node: 0.055 },
  { tilt: [0.55, 0.9, -0.2], radius: 2.95, speed: -0.16, node: 0.045 },
  { tilt: [1.5, -0.35, 0.8], radius: 3.55, speed: 0.11, node: 0.038 },
] as const;

/** How many rocks ride each ring. Uneven counts on purpose: three equal
 *  clusters would read as a pattern rather than as debris. */
const ASTEROIDS_PER_ORBIT = [9, 7, 11];

type Asteroid = {
  /** Which ring it belongs to. */
  orbit: number;
  /** Where it sits on that ring, and how far off it drifts. */
  angle: number;
  radiusOffset: number;
  height: number;
  scale: number;
  /** Its own tumble, per second. */
  spinX: number;
  spinY: number;
  spinZ: number;
  rotX: number;
  rotY: number;
  rotZ: number;
};

/**
 * The rocks, generated once outside React.
 *
 * They travel with their ring rather than on orbits of their own: the ring's
 * own speed carries them, and each one keeps a small radius and height offset
 * so the belt has thickness instead of being a necklace of beads on a wire.
 */
function buildAsteroids(): Asteroid[] {
  const out: Asteroid[] = [];
  ASTEROIDS_PER_ORBIT.forEach((count, orbit) => {
    for (let i = 0; i < count; i++) {
      out.push({
        orbit,
        // Spread around the ring, then nudged, so they neither line up nor
        // clump into one arc.
        angle: (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.45,
        radiusOffset: (Math.random() - 0.5) * 0.34,
        height: (Math.random() - 0.5) * 0.2,
        // Mostly small with a few larger: a cube keeps the big ones rare.
        scale: 0.035 + Math.pow(Math.random(), 3) * 0.1,
        spinX: (Math.random() - 0.5) * 0.9,
        spinY: (Math.random() - 0.5) * 0.9,
        spinZ: (Math.random() - 0.5) * 0.9,
        rotX: Math.random() * Math.PI,
        rotY: Math.random() * Math.PI,
        rotZ: Math.random() * Math.PI,
      });
    }
  });
  return out;
}

/**
 * Every rock in every ring, as one instanced mesh — one draw call for the
 * whole belt, however many there are. Faceted and flat shaded: at this size a
 * smooth sphere reads as a bead, and the facets are what make it stone.
 */
function Asteroids({ map }: { map: THREE.Texture }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const rocks = useMemo(() => buildAsteroids(), []);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  // Each ring's tilt as a matrix, so a rock's position can be computed in the
  // ring's own plane and then carried into the scene by it.
  const tilts = useMemo(
    () =>
      ORBITS.map((o) =>
        new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(o.tilt[0], o.tilt[1], o.tilt[2])),
      ),
    [],
  );

  useFrame((_, delta) => {
    const m = mesh.current;
    if (!m) return;
    const t = performance.now() / 1000;

    for (let i = 0; i < rocks.length; i++) {
      const r = rocks[i];
      const orbit = ORBITS[r.orbit];
      const a = r.angle + t * orbit.speed;
      const radius = orbit.radius + r.radiusOffset;

      dummy.position.set(Math.cos(a) * radius, r.height, Math.sin(a) * radius);
      dummy.position.applyMatrix4(tilts[r.orbit]);

      r.rotX += r.spinX * delta;
      r.rotY += r.spinY * delta;
      r.rotZ += r.spinZ * delta;
      dummy.rotation.set(r.rotX, r.rotY, r.rotZ);

      dummy.scale.setScalar(r.scale);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, rocks.length]} frustumCulled={false}>
      <icosahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        map={map}
        color="#9a9ca3"
        roughness={0.95}
        metalness={0.02}
        flatShading
      />
    </instancedMesh>
  );
}

/**
 * Stars on a shell rather than in a cube: a cube of stars shows its corners
 * as soon as the camera moves.
 *
 * Built in a plain function, not inline in the component: the randomness has
 * to stay out of render, same as the rock field's own generator.
 */
function buildStars(count: number) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 14 + Math.random() * 10;
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  return g;
}

function Stars({ count = 420 }: { count?: number }) {
  const geometry = useMemo(() => buildStars(count), [count]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <points geometry={geometry}>
      <pointsMaterial
        size={0.045}
        sizeAttenuation
        color="#ffffff"
        transparent
        opacity={0.75}
        depthWrite={false}
      />
    </points>
  );
}

function System({ pointer }: { pointer: React.RefObject<{ x: number; y: number }> }) {
  const map = useLoader(THREE.TextureLoader, TEXTURE);
  const group = useRef<THREE.Group>(null);
  const body = useRef<THREE.Mesh>(null);
  const nodes = useRef<(THREE.Mesh | null)[]>([]);

  useEffect(() => {
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 4;
  }, [map]);

  useFrame((_, delta) => {
    const t = performance.now() / 1000;

    // The body turns on its own axis; the whole system leans towards the
    // pointer, which is what makes it feel held rather than played back.
    if (body.current) body.current.rotation.y += delta * 0.06;
    if (group.current) {
      const p = pointer.current ?? { x: 0, y: 0 };
      group.current.rotation.y += (p.x * 0.35 - group.current.rotation.y) * 0.04;
      group.current.rotation.x += (-p.y * 0.25 + 0.1 - group.current.rotation.x) * 0.04;
    }

    // Each node rides its own ring, in the ring's own plane — the orbit group
    // carries the tilt, so the node only has to travel a circle.
    ORBITS.forEach((orbit, i) => {
      const node = nodes.current[i];
      if (!node) return;
      const a = t * orbit.speed + i * 2.1;
      node.position.set(Math.cos(a) * orbit.radius, 0, Math.sin(a) * orbit.radius);
    });
  });

  return (
    <group ref={group}>
      {/* The body. Dark and matte: it is the thing the page is about, but it
          is not the thing the visitor should look at first. */}
      <mesh ref={body}>
        <sphereGeometry args={[1.35, 64, 64]} />
        <meshStandardMaterial map={map} color="#8c8f96" roughness={0.95} metalness={0.02} />
      </mesh>

      {/* A hairline shell just off the surface, so the silhouette stays
          readable against black. */}
      <mesh scale={1.035}>
        <sphereGeometry args={[1.35, 36, 24]} />
        <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.06} />
      </mesh>

      {ORBITS.map((orbit, i) => (
        <group key={i} rotation={orbit.tilt as unknown as [number, number, number]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[orbit.radius, 0.004, 8, 180]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.22} />
          </mesh>
          <mesh
            ref={(m) => {
              nodes.current[i] = m;
            }}
          >
            <sphereGeometry args={[orbit.node, 16, 16]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
        </group>
      ))}

      <Asteroids map={map} />

      <Stars />
    </group>
  );
}

export function AppOrbit({ className = "" }: { className?: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const booted = useBootReady();
  const [enabled, setEnabled] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Phones get the still fallback: a header scene is not worth a WebGL
    // context and a texture download on a phone.
    if (window.matchMedia("(max-width: 1023px)").matches) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !enabled) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      rootMargin: "300px",
    });
    io.observe(el);

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      pointer.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.current.y = ((e.clientY - r.top) / r.height) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [enabled]);

  const mounted = enabled && booted;
  const running = mounted && inView;

  return (
    <div ref={wrapRef} className={className} aria-hidden>
      {mounted ? (
        <CanvasBoundary label="app orbit">
          <Canvas
            camera={{ position: [0, 0.6, 8.2], fov: 42 }}
            dpr={[1, 1.5]}
            frameloop={running ? "always" : "demand"}
            gl={{
              alpha: true,
              antialias: true,
              stencil: false,
              powerPreference: "high-performance",
            }}
          >
            <ambientLight intensity={0.12} />
            <directionalLight position={[8, 5, 6]} intensity={2.4} />
            <directionalLight position={[-6, -3, -4]} intensity={0.35} color="#9db4d0" />
            <Suspense fallback={null}>
              <System pointer={pointer} />
            </Suspense>
          </Canvas>
        </CanvasBoundary>
      ) : (
        // Phones, reduced motion, and the beat before boot: a still mark in
        // the same place, so the column is never an empty black rectangle.
        <div className="relative h-full w-full">
          <span
            className="absolute top-1/2 left-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 38% 34%, rgba(255,255,255,0.30), rgba(255,255,255,0.06) 48%, transparent 70%)",
            }}
          />
          <span className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
          <span className="absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/[0.07]" />
        </div>
      )}
    </div>
  );
}
