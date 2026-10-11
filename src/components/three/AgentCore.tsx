"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { CanvasBoundary } from "@/components/CanvasBoundary";
import { getChromeMatcap } from "@/components/three/chrome-matcap";
import { useBootReady } from "@/lib/use-boot-ready";

/* ------------------------------------------------------------------------ *
 * Agent core
 *
 * The object beside the agent's four capabilities: a knotted chrome form
 * turning inside a shell of drifting points, with a marker riding the shell
 * at the angle of whatever is selected.
 *
 * It replaces a flat ring diagram. The diagram was accurate and dead — it
 * said "instrument" when the section is about something that works on your
 * behalf. A single continuous surface that folds through itself says that
 * better, and it is the same chrome the hero is made of, so the page reads as
 * one site rather than two.
 *
 * Reacts to the list beside it: choosing a capability pulses the form and
 * swings the marker. That is the whole reason it earns a WebGL context here
 * rather than being a picture.
 *
 * Matcap, not lights: one texture read per fragment, no light maths, and the
 * same procedural chrome every other metal surface on the site uses. One
 * geometry, one material, one points cloud — three draw calls.
 * ------------------------------------------------------------------------ */

/** Points on a tilted shell around the knot. Built outside render: the
 *  randomness must not run during a React render. */
function buildShell(count: number) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = 2.25 + Math.random() * 0.55;
    // Flattened on Y: a shell, not a sphere, so the knot stays the subject.
    const y = (Math.random() - 0.5) * 0.9;
    positions[i * 3] = Math.cos(a) * r;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = Math.sin(a) * r;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  return g;
}

function Core({
  active,
  total,
  pointer,
}: {
  active: number;
  total: number;
  pointer: React.RefObject<{ x: number; y: number }>;
}) {
  const matcap = useMemo(() => getChromeMatcap(), []);
  const shell = useMemo(() => buildShell(260), []);
  const group = useRef<THREE.Group>(null);
  const knot = useRef<THREE.Mesh>(null);
  const marker = useRef<THREE.Mesh>(null);
  const shellRef = useRef<THREE.Points>(null);

  // Decays to 0 after each selection; drives the pulse and a brief lift in
  // the shell's spin.
  const pulse = useRef(0);
  useEffect(() => {
    pulse.current = 1;
  }, [active]);

  useEffect(() => () => shell.dispose(), [shell]);

  const targetAngle = total > 0 ? (Math.PI * 2 * active) / total : 0;

  useFrame((_, delta) => {
    pulse.current = Math.max(0, pulse.current - delta * 1.6);
    const p = pulse.current;

    if (knot.current) {
      knot.current.rotation.y += delta * (0.22 + p * 0.5);
      knot.current.rotation.x += delta * 0.09;
      // A short swell on selection, easing back to rest.
      const s = 1 + p * p * 0.09;
      knot.current.scale.setScalar(s);
    }

    if (shellRef.current) shellRef.current.rotation.y -= delta * (0.05 + p * 0.25);

    if (marker.current) {
      // The marker takes the short way round to the selected angle.
      const cur = marker.current.userData.angle ?? targetAngle;
      let diff = targetAngle - cur;
      while (diff > Math.PI) diff -= Math.PI * 2;
      while (diff < -Math.PI) diff += Math.PI * 2;
      const next = cur + diff * Math.min(1, delta * 4.5);
      marker.current.userData.angle = next;
      marker.current.position.set(Math.cos(next) * 2.65, 0, Math.sin(next) * 2.65);
      const ms = 1 + p * 0.6;
      marker.current.scale.setScalar(ms);
    }

    if (group.current) {
      const pt = pointer.current ?? { x: 0, y: 0 };
      group.current.rotation.y += (pt.x * 0.3 - group.current.rotation.y) * 0.05;
      group.current.rotation.x += (-pt.y * 0.22 + 0.22 - group.current.rotation.x) * 0.05;
    }
  });

  return (
    <group ref={group}>
      <mesh ref={knot}>
        <torusKnotGeometry args={[1.05, 0.33, 260, 36]} />
        <meshMatcapMaterial matcap={matcap} />
      </mesh>

      {/* The shell the marker rides. */}
      <points ref={shellRef} geometry={shell}>
        <pointsMaterial
          size={0.035}
          sizeAttenuation
          color="#ffffff"
          transparent
          opacity={0.5}
          depthWrite={false}
        />
      </points>

      {/* Where the selected capability sits. */}
      <mesh ref={marker}>
        <sphereGeometry args={[0.075, 18, 18]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>

      {/* The ring the marker travels, drawn thin so the marker reads as being
       *on* something. */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.65, 0.004, 8, 160]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

export function AgentCore({
  active,
  total,
  className = "",
}: {
  active: number;
  total: number;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const booted = useBootReady();
  const [enabled, setEnabled] = useState(false);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // The section hides this column below lg anyway; this keeps the context
    // and the geometry off phones entirely rather than just out of sight.
    if (window.matchMedia("(max-width: 1023px)").matches) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || !enabled) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      rootMargin: "250px",
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
        <CanvasBoundary label="agent core">
          <Canvas
            camera={{ position: [0, 1.2, 6.4], fov: 42 }}
            dpr={[1, 1.5]}
            frameloop={running ? "always" : "demand"}
            gl={{
              alpha: true,
              antialias: true,
              stencil: false,
              powerPreference: "high-performance",
            }}
          >
            <Suspense fallback={null}>
              <Core active={active} total={total} pointer={pointer} />
            </Suspense>
          </Canvas>
        </CanvasBoundary>
      ) : (
        <div className="relative h-full w-full">
          <span
            className="absolute top-1/2 left-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background:
                "radial-gradient(circle at 38% 34%, rgba(255,255,255,0.26), rgba(255,255,255,0.05) 50%, transparent 72%)",
            }}
          />
          <span className="absolute top-1/2 left-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
        </div>
      )}
    </div>
  );
}
