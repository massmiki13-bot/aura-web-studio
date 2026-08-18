"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

import { CHROME_FRAGMENT_BODY, getChromeMatcap } from "./chrome-matcap";
import { CanvasBoundary } from "@/components/CanvasBoundary";
import { useBootReady } from "@/lib/use-boot-ready";

/**
 * The "Cosa offriamo" backdrop — a faceted chrome solid turning inside a pair
 * of thin rings, leaning toward the cursor.
 *
 * Built first for the showcase panel beside "Ingegneria 3D", where it stood in
 * for the Spline robot; the robot came back and this moved up to fill the
 * full-screen section instead. `fullBleed` is the only difference between the
 * two framings — see the note on the camera distances below.
 *
 * Faceted on purpose. The hero's form is soft and molten; this reads as cut and
 * precise — same metal, opposite surface, so the two never look like the same
 * object twice.
 *
 * The facets come from the fragment shader, not the geometry. Taking the
 * normal from screen-space derivatives of the view position gives the exact
 * plane of each triangle for free, so the mesh stays indexed and small instead
 * of being split into per-face vertices to carry flat normals.
 */

const VERTEX = /* glsl */ `
varying vec3 vViewPos;
void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vViewPos = mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`;

const FRAGMENT = /* glsl */ `
uniform sampler2D uMatcap;
varying vec3 vViewPos;

void main() {
  // The facet's true plane, from how the view position changes across
  // neighbouring fragments. One cross product, no per-face vertex duplication.
  vec3 vNormal = normalize(cross(dFdx(vViewPos), dFdy(vViewPos)));
  vec3 vViewDir = normalize(-vViewPos);
${CHROME_FRAGMENT_BODY}
  gl_FragColor = vec4(col, 1.0);
}
`;

/** Shared by the solid and both rings, so all three catch the same light. */
function useChromeMaterial() {
  const matcap = useMemo(() => getChromeMatcap(), []);
  return useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { uMatcap: { value: matcap } },
        vertexShader: VERTEX,
        fragmentShader: FRAGMENT,
      }),
    [matcap],
  );
}

/** Half the assembly's own extent — the outer ring's radius plus a hair. */
const CRYSTAL_HALF_EXTENT = 1.95;

function Crystal({ running, offsetX }: { running: boolean; offsetX: number }) {
  const group = useRef<THREE.Group>(null!);
  const solid = useRef<THREE.Mesh>(null!);
  const ringA = useRef<THREE.Mesh>(null!);
  const ringB = useRef<THREE.Mesh>(null!);
  const time = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });

  const material = useChromeMaterial();
  useEffect(() => () => material.dispose(), [material]);

  // The frame's own size in world units at the object's depth, so the framing
  // below is expressed as a fraction of it rather than in absolute units.
  //
  // This is the fix for a real bug: `offsetX` used to be world units tuned on
  // a 16:9 laptop, where the frame is ~10.6 units wide. At 768x1024 it is 4.5,
  // so the same number put the object's centre on the right edge and cropped
  // half of it away. Both the shift and the scale are now derived, so the
  // composition holds at any aspect instead of at one.
  const viewport = useThree((s) => s.viewport);
  const { shift, drop, fit } = useMemo(() => {
    const halfW = viewport.width / 2;
    const aspect = viewport.width / viewport.height;

    // Side-by-side is a wide-frame composition. On a portrait tablet there is
    // no horizontal room for it — the copy would land on top of the object —
    // so the object centres and drops instead, and the copy takes the space
    // above it. Decided from the frame's own shape rather than a breakpoint,
    // so it is right for any window the visitor actually has.
    const wide = aspect > 1.25;

    // Never past the point where the object would leave the frame.
    const shift = wide ? Math.min(offsetX * halfW, Math.max(0, halfW - CRYSTAL_HALF_EXTENT)) : 0;
    const drop = wide ? 0 : -viewport.height * 0.12;

    // And if the frame is still too tight to hold it, shrink rather than crop.
    const fit = Math.min(1, viewport.width / (2 * (CRYSTAL_HALF_EXTENT + Math.abs(shift))));
    return { shift, drop, fit };
  }, [viewport.width, viewport.height, offsetX]);

  // detail 1, not 0: a bare icosahedron is 20 faces and reads as a d20 rather
  // than a cut stone. One subdivision gives 80 — enough facets to catch the
  // matcap's bands at several angles at once, still trivial to draw.
  const geometries = useMemo(() => {
    const g = {
      solid: new THREE.IcosahedronGeometry(1.15, 1),
      ring: new THREE.TorusGeometry(1.85, 0.018, 3, 128),
    };
    return g;
  }, []);
  useEffect(
    () => () => {
      geometries.solid.dispose();
      geometries.ring.dispose();
    },
    [geometries],
  );

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
    const d = Math.min(delta, 1 / 30);
    time.current += d;

    solid.current.rotation.y += d * 0.35;
    solid.current.rotation.x = Math.sin(time.current * 0.4) * 0.18;

    // The rings counter-rotate on different axes: two slow rates that never
    // line up, so the assembly never looks like it is resetting.
    ringA.current.rotation.x = time.current * 0.28;
    ringA.current.rotation.y = time.current * 0.17;
    ringB.current.rotation.y = -time.current * 0.22;
    ringB.current.rotation.z = Math.PI / 2 + time.current * 0.13;

    // What the robot's eyes used to do, damped the way everything else on this
    // site leans toward the pointer.
    const lean = 1 - Math.exp(-3.5 * d);
    const g = group.current;
    g.rotation.x += (pointer.current.y * 0.3 - g.rotation.x) * lean;
    g.rotation.y += (pointer.current.x * 0.4 - g.rotation.y) * lean;
  });

  return (
    <group ref={group} position={[shift, drop, 0]} scale={fit}>
      <mesh ref={solid} geometry={geometries.solid} material={material} />
      <mesh ref={ringA} geometry={geometries.ring} material={material} />
      <mesh ref={ringB} geometry={geometries.ring} material={material} />
    </group>
  );
}

/**
 * Camera distance, which is the only thing that differs between the two places
 * this is used.
 *
 * The fov is vertical, so framing is set by height alone. In the showcase
 * panel the rings span about 94% of it — right for an object filling a card
 * beside a paragraph. A full-screen section wants the same object reading as a
 * centred subject with room around it, so the camera pulls back until the rings
 * take roughly two thirds of the height.
 */
const PANEL_DISTANCE = 5.4;
const FULL_BLEED_DISTANCE = 8.2;

export function ChromeCrystal({
  className = "",
  fullBleed = false,
  offsetX = 0,
}: {
  className?: string;
  /** Framing for a full-screen section rather than a card panel. */
  fullBleed?: boolean;
  /**
   * Horizontal offset as a fraction of the frame's half-width, for
   * compositions that need the object off-centre — the services section puts
   * copy in the space this clears. A fraction rather than world units so it
   * means the same thing on a 21:9 monitor and a portrait tablet.
   */
  offsetX?: number;
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
    <div ref={wrapRef} className={className}>
      {mounted && (
        <CanvasBoundary label="showcase crystal">
          <Canvas
            camera={{ position: [0, 0, fullBleed ? FULL_BLEED_DISTANCE : PANEL_DISTANCE], fov: 40 }}
            dpr={[1, 1.5]}
            flat
            frameloop={running ? "always" : "demand"}
            gl={{
              alpha: true,
              antialias: true,
              stencil: false,
              powerPreference: "high-performance",
            }}
          >
            <Crystal running={running} offsetX={offsetX} />
          </Canvas>
        </CanvasBoundary>
      )}
    </div>
  );
}
