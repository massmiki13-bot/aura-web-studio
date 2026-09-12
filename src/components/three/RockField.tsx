"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";

import { CanvasBoundary } from "@/components/CanvasBoundary";
import { useBootReady } from "@/lib/use-boot-ready";

/* ------------------------------------------------------------------------ *
 * Rock field
 *
 * The same rock that orbits the moon in the services section, lifted out so
 * the rest of the site can borrow it: a drift of tumbling stone behind a page
 * header, or hanging in the space the project planes float in.
 *
 * One instanced mesh, one shared texture, one geometry — the whole field is a
 * single draw call however many rocks are in it, which is the only reason it
 * is affordable to put on four different pages.
 *
 * Deliberately not the belt from LunarGravity: that one orbits a body and
 * feeds its positions back to a shader that deforms dust around it. This is
 * the simpler thing — a volume of rock drifting through itself, wrapping at
 * the edges so it never runs out.
 * ------------------------------------------------------------------------ */

const TEXTURE = "/textures/moon.webp";

type Rock = {
  x: number;
  y: number;
  z: number;
  /** Drift, in world units per second. */
  dx: number;
  dy: number;
  dz: number;
  rx: number;
  ry: number;
  rz: number;
  rsx: number;
  rsy: number;
  rsz: number;
  scale: number;
};

function build(
  count: number,
  spread: [number, number, number],
  size: [number, number],
  drift: number,
) {
  const [sx, sy, sz] = spread;
  const rocks: Rock[] = [];
  for (let i = 0; i < count; i++) {
    rocks.push({
      x: (Math.random() - 0.5) * sx * 2,
      y: (Math.random() - 0.5) * sy * 2,
      z: (Math.random() - 0.5) * sz * 2,
      dx: (Math.random() - 0.5) * drift,
      dy: (Math.random() - 0.5) * drift * 0.5,
      dz: (Math.random() - 0.5) * drift * 0.5,
      rx: Math.random() * Math.PI,
      ry: Math.random() * Math.PI,
      rz: Math.random() * Math.PI,
      // Tumble rates are per second here, unlike the belt's per-frame ones —
      // a per-frame rate spins at whatever rate the monitor happens to run at.
      rsx: (Math.random() - 0.5) * 0.5,
      rsy: (Math.random() - 0.5) * 0.5,
      rsz: (Math.random() - 0.5) * 0.5,
      // Mostly small with a few large: a fourth power keeps the big ones rare,
      // which is what stops a field of identical pebbles reading as a texture.
      scale: size[0] + Math.pow(Math.random(), 4) * (size[1] - size[0]),
    });
  }
  // Biggest first, so if a count is ever trimmed it loses the small ones.
  rocks.sort((a, b) => b.scale - a.scale);
  return rocks;
}

function Rocks({
  count,
  spread,
  size,
  drift,
  opacity,
}: {
  count: number;
  spread: [number, number, number];
  size: [number, number];
  drift: number;
  opacity: number;
}) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const texture = useLoader(THREE.TextureLoader, TEXTURE);
  // Depends on the numbers, not on the arrays: a caller writing
  // `spread={[9, 5, 5]}` inline hands over a new array every render, and a
  // memo keyed on it would rebuild — and so re-scatter — the entire field on
  // every single one.
  const [sx, sy, sz] = spread;
  const [minSize, maxSize] = size;
  const rocks = useMemo(
    () => build(count, [sx, sy, sz], [minSize, maxSize], drift),
    [count, sx, sy, sz, minSize, maxSize, drift],
  );
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const fade = useRef(0);

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 2;
  }, [texture]);

  useFrame((_, delta) => {
    const m = mesh.current;
    if (!m) return;
    // Clamped: a tab that has been in the background hands back one enormous
    // delta, and an unclamped one teleports the whole field.
    const d = Math.min(delta, 1 / 30);

    // Fade in rather than appear: the canvas mounts when the section is still
    // 300px away, and rock popping into being is the one thing that would
    // give away that this is a decoration rather than a place.
    fade.current = Math.min(1, fade.current + d * 0.7);

    for (let i = 0; i < rocks.length; i++) {
      const r = rocks[i];
      r.x += r.dx * d;
      r.y += r.dy * d;
      r.z += r.dz * d;

      // Wrap at the edges of the volume, so the field never empties out.
      if (r.x > sx) r.x = -sx;
      else if (r.x < -sx) r.x = sx;
      if (r.y > sy) r.y = -sy;
      else if (r.y < -sy) r.y = sy;
      if (r.z > sz) r.z = -sz;
      else if (r.z < -sz) r.z = sz;

      r.rx += r.rsx * d;
      r.ry += r.rsy * d;
      r.rz += r.rsz * d;

      dummy.position.set(r.x, r.y, r.z);
      dummy.rotation.set(r.rx, r.ry, r.rz);
      dummy.scale.setScalar(r.scale * fade.current);
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]} frustumCulled={false}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        map={texture}
        bumpMap={texture}
        bumpScale={0.08}
        roughness={0.78}
        metalness={0.05}
        transparent={opacity < 1}
        opacity={opacity}
      />
    </instancedMesh>
  );
}

export function RockField({
  className = "",
  count = 34,
  /** Half-extent of the volume the rocks drift in, in world units. */
  spread = [9, 5, 5],
  /** Smallest and largest rock. */
  size = [0.05, 0.42],
  /** How fast they drift across the volume, world units per second. */
  drift = 0.22,
  /** Camera distance. Larger = the field reads as further away and calmer. */
  distance = 12,
  opacity = 1,
}: {
  className?: string;
  count?: number;
  spread?: [number, number, number];
  size?: [number, number];
  drift?: number;
  distance?: number;
  opacity?: number;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const booted = useBootReady();
  const [enabled, setEnabled] = useState(false);
  const [inView, setInView] = useState(false);

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

  const mounted = enabled && booted;
  const running = mounted && inView;

  return (
    <div ref={wrapRef} className={className} aria-hidden>
      {mounted && (
        <CanvasBoundary label="rock field">
          <Canvas
            camera={{ position: [0, 0, distance], fov: 45 }}
            dpr={[1, 1.5]}
            // Stopped entirely while the field is off screen.
            frameloop={running ? "always" : "demand"}
            gl={{
              alpha: true,
              antialias: true,
              stencil: false,
              powerPreference: "high-performance",
            }}
          >
            {/* Lit from the same side as the moon in the services section, so
                a visitor who scrolls between them reads one light source for
                the whole site rather than a set of unrelated props. */}
            <ambientLight intensity={0.1} />
            <directionalLight position={[8, 5, 6]} intensity={2.2} />
            <directionalLight position={[-6, -3, -4]} intensity={0.3} color="#9db4d0" />
            <Suspense fallback={null}>
              <Rocks count={count} spread={spread} size={size} drift={drift} opacity={opacity} />
            </Suspense>
          </Canvas>
        </CanvasBoundary>
      )}
    </div>
  );
}
