"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

import { CanvasBoundary } from "@/components/CanvasBoundary";
import { useBootReady } from "@/lib/use-boot-ready";

/* ------------------------------------------------------------------------ *
 * Chrome vines
 *
 * A climber that grows up around the contact panel: real geometry, not a
 * sprite — tapered tube branches, leaves with a fold down the midrib and a
 * raised vein, chromed metal catching a procedural room. It sprouts from below
 * when the panel comes into view and then stays alive on a breath you can
 * barely see.
 *
 * The canvas is larger than the panel (`inset`, in px), so a few branches can
 * cross the border and pass in front of it — a vine that stops dead at a
 * rectangle reads as a frame, not as something growing.
 *
 * Ported from the gold version written for the Studio Legale Conte site and
 * re-cut for this one:
 *
 * · Chrome instead of gold. This site has no hue anywhere, and it already has
 *   a chrome vocabulary — the hero's molten form, the crystal that used to
 *   hold the services section. Silver branches belong to it; gold ones would
 *   be the only warm thing on the page.
 * · The render loop actually stops. The original returned early from its
 *   animate callback but kept requesting frames forever; this one tears the
 *   loop down when the panel leaves the viewport and starts it again when it
 *   comes back. On a page that is already carrying three other WebGL scenes
 *   that is the difference between free and not.
 * · Leaf count and segment counts trimmed, and the growth is driven off the
 *   same clock rather than `performance.now()` read twice per frame.
 * ------------------------------------------------------------------------ */

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * A tube that thins toward its tip, built by hand.
 *
 * `TubeGeometry` has a constant radius, and a branch that is as thick at the
 * tip as at the root reads as wire. The Frenet frames give a stable ring
 * orientation along the curve; the ring count is recorded so the growth can
 * reveal the branch a ring at a time through `setDrawRange`.
 */
function taperedTube(
  curve: THREE.Curve<THREE.Vector3>,
  {
    segments = 72,
    radial = 7,
    radius = 0.02,
    taper = (u: number) => 1 - u * 0.6,
  }: { segments?: number; radial?: number; radius?: number; taper?: (u: number) => number },
) {
  const frames = curve.computeFrenetFrames(segments, false);
  const positions: number[] = [];
  const normals: number[] = [];
  const indices: number[] = [];
  const P = new THREE.Vector3();

  for (let i = 0; i <= segments; i++) {
    const u = i / segments;
    curve.getPointAt(u, P);
    const N = frames.normals[i];
    const B = frames.binormals[i];
    const r = radius * taper(u);
    for (let j = 0; j <= radial; j++) {
      const a = (j / radial) * Math.PI * 2;
      const nx = Math.cos(a) * N.x + Math.sin(a) * B.x;
      const ny = Math.cos(a) * N.y + Math.sin(a) * B.y;
      const nz = Math.cos(a) * N.z + Math.sin(a) * B.z;
      positions.push(P.x + nx * r, P.y + ny * r, P.z + nz * r);
      normals.push(nx, ny, nz);
    }
  }
  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < radial; j++) {
      const a = i * (radial + 1) + j;
      const b = a + radial + 1;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
  geo.setIndex(indices);
  geo.userData.ringIndices = radial * 6;
  geo.userData.rings = segments;
  return geo;
}

/**
 * A lance-shaped leaf, folded along the midrib: two faces meeting at the
 * centre, tip curling over. Not a flat cut-out — a flat leaf turned edge-on
 * disappears and looks like a splinter.
 */
function leafGeometry(length = 0.13, width = 0.052) {
  const N = 11;
  const positions: number[] = [];
  const indices: number[] = [];
  const mid: THREE.Vector3[] = [];
  for (let i = 0; i <= N; i++) {
    const u = i / N;
    const curl = Math.sin(u * Math.PI * 0.6) * length * 0.22;
    mid.push(new THREE.Vector3(u * length, curl, 0));
  }
  for (let i = 0; i <= N; i++) {
    const u = i / N;
    const w = width * Math.pow(Math.sin(Math.PI * u), 0.75) * (1 - u * 0.12);
    const fold = w * 0.38;
    const m = mid[i];
    positions.push(m.x, m.y, 0);
    positions.push(m.x, m.y - fold * 0.5, w);
    positions.push(m.x, m.y - fold * 0.5, -w);
  }
  for (let i = 0; i < N; i++) {
    const a = i * 3;
    const b = (i + 1) * 3;
    indices.push(a, b, a + 1, b, b + 1, a + 1);
    indices.push(a, a + 2, b, a + 2, b + 2, b);
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

/**
 * The path around the panel: sprouts below the corner, climbs hugging the
 * edge, turns the corner and carries on along the top for a stretch. The steps
 * are irregular, and now and then the shoot crosses the border and passes in
 * front of it.
 */
function edgePath({
  rx,
  ry,
  side,
  climb,
  run,
  rand,
}: {
  rx: number;
  ry: number;
  side: number;
  climb: number;
  run: number;
  rand: () => number;
}) {
  const j = (k = 1) => (rand() - 0.5) * 0.045 * k;
  const pts: THREE.Vector3[] = [];
  const x = (v: number) => side * v;

  pts.push(new THREE.Vector3(x(rx + 0.07), -ry - 0.14, -0.02));
  pts.push(new THREE.Vector3(x(rx + 0.02 + j()), -ry - 0.02, 0.03));

  const steps = 6;
  for (let i = 1; i <= steps; i++) {
    const u = i / steps;
    const y = -ry + ry * 2 * climb * u;
    const cross = Math.sin(u * Math.PI * 1.6) * 0.035;
    pts.push(new THREE.Vector3(x(rx + j(1.2) - cross), y, 0.02 + j(1.6)));
  }

  // Two close points at the corner, so it turns rather than kinks.
  pts.push(new THREE.Vector3(x(rx + 0.015 + j(0.6)), ry - 0.05, 0.03));
  pts.push(new THREE.Vector3(x(rx - 0.03 + j(0.6)), ry + 0.045, 0.02));

  const hSteps = 5;
  for (let i = 1; i <= hSteps; i++) {
    const u = i / hSteps;
    const cross = Math.sin(u * Math.PI) * 0.03;
    pts.push(
      new THREE.Vector3(x(rx - rx * run * u + j(1.1)), ry + 0.03 - cross + j(0.8), 0.02 + j(1.4)),
    );
  }

  return new THREE.CatmullRomCurve3(pts, false, "catmullrom", 0.45);
}

function Vines({ inset }: { inset: number }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let width = mount.clientWidth;
    let height = mount.clientHeight;
    if (!width || !height) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(26, width / height, 0.1, 50);
    camera.position.set(0, 0, 4.4);

    const halfW = Math.tan((26 * Math.PI) / 360) * 4.4 * (width / height);
    const halfH = halfW / (width / height);
    const rx = halfW - (inset / width) * halfW * 2;
    const ry = halfH - (inset / height) * halfH * 2;
    // Foliage lives inside the canvas but never against its edge: every leaf
    // is placed at least `reach` from the limit, so the vine fades into the
    // dark instead of being sliced off.
    const insideX = (m: number) => Math.max(0.05, halfW - m);
    const insideY = (m: number) => Math.max(0.05, halfH - m);

    // Real metal reflections with no external file: the room is procedural.
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = envRT.texture;

    const key = new THREE.DirectionalLight(0xffffff, 2.1);
    key.position.set(-1.2, 1.6, 2.2);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xbcd0e6, 0.75);
    rim.position.set(1.6, -0.6, -1.4);
    scene.add(rim);
    scene.add(new THREE.AmbientLight(0xffffff, 0.22));

    // Three weights of the same metal. A branch with one material on it reads
    // as extruded; three make it read as grown.
    const materials = [
      new THREE.MeshStandardMaterial({
        color: 0xd8dde3,
        metalness: 1,
        roughness: 0.24,
        envMapIntensity: 1.25,
      }),
      new THREE.MeshStandardMaterial({
        color: 0x8f979f,
        metalness: 1,
        roughness: 0.42,
        envMapIntensity: 1.0,
      }),
      new THREE.MeshStandardMaterial({
        color: 0xf2f5f8,
        metalness: 1,
        roughness: 0.16,
        envMapIntensity: 1.45,
      }),
    ];

    /** Repeatable randomness: the page always draws the same vine. */
    let seed = 20260913;
    const rand = () => {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };

    const group = new THREE.Group();
    scene.add(group);

    const grown: { geo: THREE.BufferGeometry; rings: number; start: number; span: number }[] = [];
    const leaves: {
      mesh: THREE.Mesh;
      appearAt: number;
      phase: number;
      base: THREE.Quaternion;
    }[] = [];
    const disposables: THREE.BufferGeometry[] = [];

    const addBranch = (
      curve: THREE.Curve<THREE.Vector3>,
      {
        radius,
        taper,
        start,
        span,
        segments = 72,
      }: {
        radius: number;
        taper: (u: number) => number;
        start: number;
        span: number;
        segments?: number;
      },
    ) => {
      const geo = taperedTube(curve, { segments, radius, taper });
      const mesh = new THREE.Mesh(geo, materials[0]);
      mesh.renderOrder = 2;
      group.add(mesh);
      disposables.push(geo);
      grown.push({ geo, rings: segments, start, span });
    };

    const addLeaf = (
      curve: THREE.Curve<THREE.Vector3>,
      u: number,
      sideSign: number,
      appearAt: number,
    ) => {
      const scale = 0.68 + rand() * 0.5;
      const geo = leafGeometry(0.15 * scale, 0.055 * scale);
      const mat = materials[rand() < 0.22 ? 2 : rand() < 0.35 ? 1 : 0];
      const mesh = new THREE.Mesh(geo, mat);
      const p = curve.getPointAt(clamp(u, 0, 1));
      const tan = curve.getTangentAt(clamp(u, 0, 1));
      const reach = 0.15 * scale + 0.03;
      mesh.position.set(
        clamp(p.x, -insideX(reach), insideX(reach)),
        clamp(p.y, -insideY(reach), insideY(reach)),
        p.z,
      );
      const away = new THREE.Vector3(
        sideSign,
        0.35 + rand() * 0.4,
        0.25 + rand() * 0.5,
      ).normalize();
      const dir = tan.clone().multiplyScalar(0.45).add(away.multiplyScalar(0.9)).normalize();
      mesh.quaternion.setFromUnitVectors(new THREE.Vector3(1, 0, 0), dir);
      // Contained roll: a leaf turned edge-on vanishes.
      mesh.rotateX((rand() - 0.5) * 1.1);
      mesh.scale.setScalar(0.001);
      mesh.renderOrder = 3;
      group.add(mesh);
      disposables.push(geo);
      leaves.push({ mesh, appearAt, phase: rand() * Math.PI * 2, base: mesh.quaternion.clone() });

      // A raised vein, a shade darker.
      const veinGeo = new THREE.CylinderGeometry(0.0035 * scale, 0.0016 * scale, 0.15 * scale, 5);
      const vein = new THREE.Mesh(veinGeo, materials[1]);
      vein.position.set(0.075 * scale, 0.012 * scale, 0);
      vein.rotation.z = Math.PI / 2;
      mesh.add(vein);
      disposables.push(veinGeo);
    };

    // Two main shoots: one climbs the left, one the right, out of step.
    (
      [
        { side: -1, climb: 1.0, run: 0.62, start: 0.0, span: 0.6, spread: 1 },
        { side: 1, climb: 0.92, run: 0.42, start: 0.26, span: 0.58, spread: 0.55 },
      ] as const
    ).forEach(({ side, climb, run, start, span, spread }) => {
      const curve = edgePath({ rx, ry, side, climb, run, rand });
      addBranch(curve, { radius: 0.0135, taper: (u) => 1 - u * 0.6, start, span });

      const spots = [0.2, 0.38, 0.56, 0.76];
      spots.forEach((u0, k) => {
        const p0 = curve.getPointAt(u0);
        const t0 = curve.getTangentAt(u0);
        const out = new THREE.Vector3(
          side * (0.6 + rand() * 0.5) * spread,
          0.5 + rand() * 0.5,
          0.3 + rand() * 0.6,
        ).normalize();
        const len = (0.16 + rand() * 0.16) * (0.6 + spread * 0.4);
        const p1 = p0
          .clone()
          .addScaledVector(t0, len * 0.5)
          .addScaledVector(out, len * 0.55);
        const p2 = p1
          .clone()
          .addScaledVector(t0, len * 0.35)
          .addScaledVector(out, len * 0.7);
        [p1, p2].forEach((q) => {
          q.x = clamp(q.x, -insideX(0.22), insideX(0.22));
          q.y = clamp(q.y, -insideY(0.22), insideY(0.22));
        });
        const sub = new THREE.CatmullRomCurve3([p0, p1, p2], false, "catmullrom", 0.5);
        addBranch(sub, {
          radius: 0.0072,
          taper: (u) => 1 - u * 0.8,
          start: start + span * u0 * 0.9,
          span: 0.16,
          segments: 32,
        });
        // The shoot is clothed along its whole length: no bare sticks.
        const at = start + span * u0 * 0.9;
        addLeaf(sub, 0.35, -side, at + 0.06);
        addLeaf(sub, 0.6, side, at + 0.09);
        addLeaf(sub, 0.85, -side, at + 0.12);
        addLeaf(sub, 1.0, side, at + 0.14);
        addLeaf(curve, u0 + 0.04 + k * 0.01, side, start + span * (u0 + 0.05));
        addLeaf(curve, u0 - 0.06, -side, start + span * (u0 - 0.04));
      });

      addLeaf(curve, 0.97, side, start + span * 0.95);
      addLeaf(curve, 1.0, -side, start + span * 0.98);
    });

    /** Growth, 0 → 1. Each branch uncovers its rings in order. */
    let progress = reduced ? 1 : 0;
    const apply = () => {
      for (const { geo, rings, start, span } of grown) {
        const eased = easeInOut(clamp((progress - start) / span, 0, 1));
        geo.setDrawRange(0, Math.round(rings * eased) * geo.userData.ringIndices);
      }
      for (const l of leaves) {
        const k = clamp((progress - l.appearAt) / 0.12, 0, 1);
        const e = k < 1 ? 1 - Math.pow(1 - k, 3) : 1;
        // A small opening flick, then it settles.
        const overshoot = k < 1 ? 1 + Math.sin(k * Math.PI) * 0.12 : 1;
        l.mesh.scale.setScalar(Math.max(0.001, e * overshoot));
      }
    };
    apply();

    const DURATION = 7.2;
    const clock = new THREE.Timer();
    let elapsed = 0;
    let started = reduced;
    let raf = 0;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      clock.update(now);
      const d = Math.min(clock.getDelta(), 1 / 30);
      const t = clock.getElapsed();

      if (started && progress < 1) {
        elapsed += d;
        progress = clamp(elapsed / DURATION, 0, 1);
        apply();
      }

      // Breath: barely there.
      group.rotation.z = Math.sin(t * 0.24) * 0.012;
      group.position.y = Math.sin(t * 0.31) * 0.006;
      for (let i = 0; i < leaves.length; i++) {
        const l = leaves[i];
        const s = Math.sin(t * 0.7 + l.phase) * 0.05;
        l.mesh.quaternion.copy(l.base);
        l.mesh.rotateY(s);
        l.mesh.rotateZ(s * 0.6);
        if (i % 7 === 0) l.mesh.rotateX(Math.sin(t * 0.5 + l.phase) * 0.04);
      }

      renderer.render(scene, camera);
    };

    /**
     * The loop is torn down when the panel leaves, not merely skipped.
     *
     * The gold original kept requesting frames for the life of the page and
     * returned early inside the callback — which still costs a wake-up every
     * frame, forever, on every page it appears on. Here the rAF is cancelled
     * outright and the clock is re-based so the breath does not jump forward
     * by however long the visitor was elsewhere.
     */
    const start = () => {
      if (raf) return;
      // Timer only accumulates what `update()` measures, so re-basing it here
      // drops the time spent away instead of counting it as one long frame.
      clock.reset();
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      if (!raf) return;
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          started = true;
          start();
        } else {
          stop();
        }
      },
      { rootMargin: "120px" },
    );
    io.observe(mount);

    const onResize = () => {
      width = mount.clientWidth;
      height = mount.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", onResize);

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("resize", onResize);
      disposables.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      envRT.dispose();
      pmrem.dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, [inset]);

  return <div ref={mountRef} className="absolute inset-0" />;
}

export function ChromeVines({
  inset = 52,
  className = "",
}: {
  inset?: number;
  className?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const booted = useBootReady();
  const [near, setNear] = useState(false);

  // Mounted only once the panel is genuinely approaching. Creating the context
  // and running PMREM over a procedural room is the expensive part, and on a
  // page carrying three other scenes it has no business happening at the top.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "500px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className={`pointer-events-none absolute ${className}`} aria-hidden>
      {near && booted && (
        <CanvasBoundary label="chrome vines">
          <Vines inset={inset} />
        </CanvasBoundary>
      )}
    </div>
  );
}
