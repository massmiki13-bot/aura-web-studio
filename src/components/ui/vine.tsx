"use client";

import { useEffect, useRef, useState } from "react";

import { gsap, ScrollTrigger } from "@/lib/gsap";
import { rafDebounce } from "@/lib/utils";

/* ------------------------------------------------------------------------ *
 * The vine
 *
 * A climbing stem that runs out of a section heading and fills the rule
 * beside it, drawn as it is scrolled to and rewound if you scroll back.
 *
 * Three things keep it away from clip-art:
 *
 * · The stem is not a stroked line but a filled ribbon, sampled point by
 *   point and tapered to a tip. That is the whole difference between a branch
 *   and a piece of wire.
 * · No two leaves are the same. They swell toward the middle of the stem and
 *   shrink at both ends the way a real sprig does, and the blade is
 *   asymmetric with its tip bent toward the stalk.
 * · It does not grow on a timer. How much of it exists comes in from outside
 *   as `--grow`, which the section ties to its own scroll position, so the
 *   plant draws while the heading arrives and unwinds if you go back up.
 *
 * Ported from the vine written for the Manna Italia site and re-cut for this
 * one: monochrome instead of two greens, glints instead of buds so it belongs
 * with the sparkles in the header, and a viewBox measured from the element
 * rather than fixed — `preserveAspectRatio="none"` over a fixed 420-unit box
 * stretched every leaf into an ellipse on a wide screen.
 * ------------------------------------------------------------------------ */

const STEPS = 72;

/** Roughly one leaf per this many pixels of run, within the bounds below. */
const PX_PER_LEAF = 74;
const MIN_LEAVES = 6;
const MAX_LEAVES = 15;

/** Deterministic: same seed, same plant, on the server and in the browser. */
function noise(seed: number) {
  let x = Math.sin(seed * 127.1) * 43758.5453;
  return () => {
    x = Math.sin(x * 12.9898 + 78.233) * 43758.5453;
    return x - Math.floor(x);
  };
}

type Pt = { x: number; y: number };

const wave = (
  t: number,
  w: number,
  base: number,
  amp: number,
  phase: number,
  drop: number,
): Pt => ({
  x: t * w,
  y: base + drop + amp * Math.sin(t * Math.PI * 2.1 + phase),
});

/**
 * The ribbon: out along the curve on one edge and back along the other, with
 * the thickness falling away toward the tip.
 *
 * The normal comes from the analytic derivative of the sine rather than from
 * the chord between two samples — at the inflection points the difference is
 * visible.
 */
function ribbon(w: number, base: number, amp: number, phase: number, drop: number, thick: number) {
  const up: string[] = [];
  const down: string[] = [];
  for (let i = 0; i <= STEPS; i++) {
    const t = i / STEPS;
    const p = wave(t, w, base, amp, phase, drop);
    const dy = amp * Math.cos(t * Math.PI * 2.1 + phase) * ((Math.PI * 2.1) / w);
    const len = Math.hypot(1, dy);
    const nx = -dy / len;
    const ny = 1 / len;
    // Full at the base, thinning along the run, and closing to a point over
    // the last fifth instead of being cut off square.
    const taper = t > 0.8 ? (1 - t) / 0.2 : 1;
    const half = thick * (1 - t * 0.55) * taper * 0.5;
    up.push(`${(p.x + nx * half).toFixed(2)} ${(p.y + ny * half).toFixed(2)}`);
    down.unshift(`${(p.x - nx * half).toFixed(2)} ${(p.y - ny * half).toFixed(2)}`);
  }
  return `M${up[0]} L${up.slice(1).join(" L")} L${down.join(" L")} Z`;
}

/** One leaf, drawn once at the origin and placed by transform. */
const LEAF = {
  blade: "M0 0 C 4 -6.4, 12.5 -8, 19.8 -1.6 C 15 6.4, 5.2 6.4, 0 0 Z",
  stalk: "M-4 1 C -2.4 0.7, -1.2 0.3, 0 0",
  midrib: "M0.6 0 C 6 -1.4, 12.4 -2.2, 19 -1.5",
  veins: [
    "M4.4 -1 C 6 -3, 7.8 -4.2, 9.8 -4.8",
    "M8 -1.8 C 9.6 -3.6, 11.4 -4.6, 13.4 -5",
    "M7 0.9 C 8.6 2.6, 10.4 3.6, 12.6 3.9",
  ],
};

/** A four-pointed glint, the same mark the page header's sparkles make. */
const GLINT =
  "M0 -5 C 0.6 -1.4, 1.4 -0.6, 5 0 C 1.4 0.6, 0.6 1.4, 0 5 C -0.6 1.4, -1.4 0.6, -5 0 C -1.4 -0.6, -0.6 -1.4, 0 -5 Z";

export function Vine({ seed = 0, className = "" }: { seed?: number; className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null);
  /**
   * The drawing width, measured rather than assumed, so one viewBox unit is
   * one CSS pixel and nothing is stretched. Starts at a sensible default so
   * the server renders a real plant rather than a collapsed one.
   */
  /**
   * Null until the element has been measured, and nothing is drawn until it
   * is.
   *
   * The plant has to be generated in the browser, not on the server. How many
   * leaves it has, where its curls sit and which blades are pale all come out
   * of one seeded generator, and how many times that generator is called
   * depends on the measured width — so the server, which has no width, draws a
   * *different plant* and React tears the whole subtree down on hydration.
   * (Even holding the width fixed it would still mismatch: Math.sin is
   * implementation-defined in the last bits, and the raw path coordinates
   * showed it.)
   *
   * Rendering nothing on the server costs exactly nothing here — the vine is
   * aria-hidden decoration that only appears once scrolled to.
   */
  const [box, setBox] = useState<{ w: number; h: number } | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const read = () => {
      const r = host.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) return;
      setBox((prev) =>
        prev && Math.abs(prev.w - r.width) < 2 && Math.abs(prev.h - r.height) < 2
          ? prev
          : { w: r.width, h: r.height },
      );
    };

    // The first measurement is taken straight away, not through the frame
    // debounce: requestAnimationFrame does not run while the tab is in the
    // background, so a vine mounted in a hidden tab would sit there as an
    // empty box until something resized it. One rect read on mount costs a
    // single layout and is the difference between the plant existing and not.
    read();

    // Later ones are debounced — a ResizeObserver can fire many times during a
    // drag, and each of these re-generates a whole plant.
    const onResize = rafDebounce(read);
    const ro = new ResizeObserver(onResize);
    ro.observe(host);
    return () => {
      ro.disconnect();
      onResize.cancel();
    };
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    // Opted out of motion: the plant is simply already there, whole. The
    // growth *is* the animation, so there is nothing to play at reduced speed.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      host.style.setProperty("--grow", "1");
      return;
    }

    host.style.setProperty("--grow", "0");
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: host,
        // Starts drawing as the heading comes up off the bottom and is done
        // by the time it settles into the upper half — the plant is finished
        // at about the moment you start reading the projects under it.
        start: "top 88%",
        end: "top 42%",
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => host.style.setProperty("--grow", self.progress.toFixed(4)),
      });
    }, host);

    return () => ctx.revert();
  }, []);

  // Measured; see the state above.
  if (!box) return <div ref={hostRef} className={`vine-host ${className}`} aria-hidden />;

  const { w, h } = box;
  const base = h / 2;
  const rnd = noise(seed + 1);

  /**
   * The sway, and how much of it there is.
   *
   * Proportional to the run, not a constant: the Manna vine was drawn over a
   * fixed 420-unit box, and the same amplitude across a 900px rule reads as a
   * straight wire with a kink in it. Capped at a third of the row so a wide
   * heading doesn't throw the stem into the projects above and below.
   */
  const amp = Math.min((9 + rnd() * 5) * (w / 420), h * 0.34);
  const phase = rnd() * Math.PI;

  /**
   * Leaf count follows the run too. Eight leaves look right over 420px and
   * sparse over 900 — this keeps the spacing between them roughly constant
   * however wide the heading's rule turns out to be.
   */
  const leafCount = Math.max(MIN_LEAVES, Math.min(MAX_LEAVES, Math.round(w / PX_PER_LEAF)));

  const leaves = Array.from({ length: leafCount }, (_, i) => {
    // Spread along the run with a little jitter, so the spacing doesn't read
    // as a ruler.
    const t = +(0.06 + ((i + 0.5) / leafCount) * 0.88 + (rnd() - 0.5) * 0.03).toFixed(4);
    const p = wave(t, w, base, amp, phase, 0);
    const up = i % 2 === 0;
    // Big through the middle of the run, small at both ends.
    const bell = 0.55 + 0.95 * Math.sin(t * Math.PI);
    const scale = bell * (0.85 + rnd() * 0.3) * Math.min(1.35, h / 46);
    return {
      t,
      x: p.x,
      y: p.y,
      rot: (up ? -1 : 1) * (24 + rnd() * 30),
      scale,
      flip: up ? 1 : -1,
      pale: rnd() > 0.62,
    };
  });

  const glintCount = Math.max(3, Math.min(6, Math.round(w / 190)));
  const glints = Array.from({ length: glintCount }, (_, i) => {
    const t = +(0.18 + ((i + 0.5) / glintCount) * 0.74 + (rnd() - 0.5) * 0.04).toFixed(4);
    const p = wave(t, w, base, amp * 0.82, phase + Math.PI, 2);
    return {
      t,
      x: p.x,
      y: p.y + (rnd() > 0.5 ? 6 : -6),
      scale: (0.55 + rnd() * 0.5) * Math.min(1.3, h / 46),
    };
  });

  const curls = [
    {
      t: +(0.34 + (rnd() - 0.5) * 0.06).toFixed(4),
      d: "c 6 -4.5, 12.5 -1, 11.6 5.4 c -0.9 5.4, -8 6.3, -9 0.9 c -0.9 -4.5, 4.5 -6.3, 6.3 -2.7",
    },
    {
      t: +(0.74 + (rnd() - 0.5) * 0.06).toFixed(4),
      d: "c -6 -5.4, -13.4 -1.8, -12.5 4.5 c 0.9 5.4, 8 6.3, 9 0.9 c 0.9 -4.5, -4.5 -6.3, -6.3 -2.7",
    },
  ].map((c) => {
    const p = wave(c.t, w, base, amp, phase, 1);
    return { ...c, x: p.x, y: p.y };
  });

  return (
    <div ref={hostRef} className={`vine-host ${className}`} aria-hidden>
      {/* The viewBox is the element's own measured box, so one unit is one
          CSS pixel in both axes. A fixed viewBox with preserveAspectRatio
          "none" squashed every leaf vertically by whatever the row happened
          to be — an ellipse where a leaf should be. */}
      <svg
        className="vine"
        viewBox={`0 0 ${w.toFixed(1)} ${h.toFixed(1)}`}
        preserveAspectRatio="none"
      >
        {/* The understem first, so the main one lies over it. */}
        <path
          className="vine__stem vine__stem--b"
          d={ribbon(w, base, amp * 0.82, phase + Math.PI, 2, 1.8)}
        />
        <path className="vine__stem vine__stem--a" d={ribbon(w, base, amp, phase, 0, 3.4)} />

        {curls.map((c, i) => (
          <path
            key={c.t}
            className={`vine__curl${i ? " vine__curl--b" : ""}`}
            style={{ "--t": c.t } as React.CSSProperties}
            d={`M${c.x.toFixed(2)} ${c.y.toFixed(2)} ${c.d}`}
          />
        ))}

        {glints.map((g) => (
          <path
            key={g.t}
            className="vine__glint"
            style={{ "--t": g.t } as React.CSSProperties}
            d={GLINT}
            transform={`translate(${g.x.toFixed(2)} ${g.y.toFixed(2)}) scale(${g.scale.toFixed(2)})`}
          />
        ))}

        {leaves.map((l) => (
          <g
            key={l.t}
            className={`vine__leaf${l.pale ? " is-pale" : ""}`}
            style={{ "--t": l.t } as React.CSSProperties}
            transform={`translate(${l.x.toFixed(2)} ${l.y.toFixed(2)}) rotate(${l.rot.toFixed(
              1,
            )}) scale(${l.scale.toFixed(2)} ${(l.scale * l.flip).toFixed(2)})`}
          >
            <path className="vine__stalk" d={LEAF.stalk} />
            <path className="vine__blade" d={LEAF.blade} />
            <path className="vine__vein" d={LEAF.midrib} />
            {LEAF.veins.map((d) => (
              <path key={d} className="vine__vein vine__vein--thin" d={d} />
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
}
