import { useEffect, useRef } from "react";

type Shape = {
  depth: number;
  base: number;
  delay: number;
  phase: number;
  fspeed: number;
  famp: number;
  width: string;
  height: string;
  left?: string;
  right?: string;
  top?: string;
  bottom?: string;
};

// Neutral silver/white tints instead of the reference's indigo/rose/amber/cyan
// palette, to stay inside the site's monochrome theme instead of introducing
// brand-clashing colors.
const SHAPES: Shape[] = [
  {
    depth: 1.4, base: 12, delay: 0, phase: 0, fspeed: 0.55, famp: 16,
    width: "clamp(280px,42vw,600px)", height: "clamp(70px,10vw,140px)",
    left: "-12%", top: "14%",
  },
  {
    depth: 1.1, base: -15, delay: 200, phase: 1.3, fspeed: 0.45, famp: 14,
    width: "clamp(230px,35vw,500px)", height: "clamp(60px,9vw,120px)",
    right: "-8%", top: "68%",
  },
  {
    depth: 1.8, base: -8, delay: 100, phase: 2.1, fspeed: 0.6, famp: 12,
    width: "clamp(160px,22vw,300px)", height: "clamp(45px,6vw,80px)",
    left: "3%", bottom: "4%",
  },
  {
    depth: 2.2, base: 20, delay: 300, phase: 0.7, fspeed: 0.7, famp: 10,
    width: "clamp(110px,15vw,200px)", height: "clamp(32px,4.5vw,60px)",
    right: "12%", top: "8%",
  },
  {
    depth: 2.6, base: -25, delay: 400, phase: 1.9, fspeed: 0.8, famp: 9,
    width: "clamp(90px,11vw,150px)", height: "clamp(24px,3.2vw,40px)",
    left: "16%", top: "3%",
  },
];

const INFLUENCE = 380;
const MAX_PUSH = 46;

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Ambient 3D-feeling backdrop: a faint masked grid, a cursor-following
 * spotlight glow, and a handful of thin rotated bars that drift, tilt with
 * pointer parallax, and "bend away" when the cursor gets close. Pure
 * DOM/CSS + rAF (no canvas) — cheap enough to sit behind other content.
 */
export function FloatingShapesBackground({
  className = "",
  paused = false,
}: {
  className?: string;
  /** Externally stop/resume the animation loop — e.g. while this layer is
   *  hidden behind other content but still inside the viewport. */
  paused?: boolean;
}) {
  const spotlightRef = useRef<HTMLDivElement>(null);
  const shapeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pausedRef = useRef(paused);
  const syncRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    pausedRef.current = paused;
    syncRef.current?.();
  }, [paused]);

  useEffect(() => {
    const container = shapeRefs.current[0]?.closest("[data-floating-shapes]") as HTMLElement | null;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let smX = 0;
    let smY = 0;
    let spotX = mouseX;
    let spotY = mouseY;
    // `o` tracks the last opacity written, so the entrance stops touching the
    // property once it has settled at 1 instead of re-assigning it forever.
    const pushState = SHAPES.map(() => ({ x: 0, y: 0, rot: 0, o: -1 }));
    let rects: { cx: number; cy: number }[] = [];
    let rectsStamp = 0;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) {
        mouseX = t.clientX;
        mouseY = t.clientY;
      }
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });

    // Park the spotlight at the viewport center immediately (it may stay
    // paused for a while, and its SSR position is intentionally offscreen).
    if (spotlightRef.current) {
      spotlightRef.current.style.transform = `translate3d(${spotX}px, ${spotY}px, 0) translate(-50%, -50%)`;
    }

    const refreshRects = () => {
      rects = shapeRefs.current.map((el) => {
        if (!el) return { cx: 0, cy: 0 };
        const r = el.getBoundingClientRect();
        return { cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
      });
    };

    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = now - start;
      // Shape centers barely move (only on scroll/resize); re-measuring them
      // a few times a second inside the frame we already own is far cheaper
      // than forcing five layout reads on every scroll event.
      if (now - rectsStamp > 250) {
        rectsStamp = now;
        refreshRects();
      }
      const nx = (mouseX / window.innerWidth) * 2 - 1;
      const ny = (mouseY / window.innerHeight) * 2 - 1;
      smX += (nx - smX) * 0.055;
      smY += (ny - smY) * 0.055;

      spotX += (mouseX - spotX) * 0.12;
      spotY += (mouseY - spotY) * 0.12;
      if (spotlightRef.current) {
        // transform, not left/top — moving a compositor layer instead of
        // triggering layout on a 700px fixed element every frame.
        spotlightRef.current.style.transform = `translate3d(${spotX}px, ${spotY}px, 0) translate(-50%, -50%)`;
      }

      SHAPES.forEach((s, i) => {
        const el = shapeRefs.current[i];
        if (!el) return;

        const progress = Math.min(Math.max((t - s.delay) / 1500, 0), 1);
        const eased = easeOutCubic(progress);
        const entranceY = (1 - eased) * -150;
        const entranceRot = (1 - eased) * -15;
        const opacity = eased;

        const floatY = Math.sin((t / 1000) * s.fspeed + s.phase) * s.famp;
        const tiltX = smX * s.depth * 34;
        const tiltYGlobal = smY * s.depth * 16;
        const tiltRot = smX * s.depth * 9 + smY * s.depth * 3;

        let pushX = 0;
        let pushY = 0;
        let pushRot = 0;
        const rect = rects[i];
        if (rect) {
          const dx = rect.cx - mouseX;
          const dy = rect.cy - mouseY;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < INFLUENCE) {
            const force = 1 - dist / INFLUENCE;
            const ang = Math.atan2(dy, dx);
            pushX = Math.cos(ang) * force * MAX_PUSH;
            pushY = Math.sin(ang) * force * MAX_PUSH * 0.6;
            pushRot = force * (dx > 0 ? 1 : -1) * 6;
          }
        }
        const ps = pushState[i];
        ps.x += (pushX - ps.x) * 0.12;
        ps.y += (pushY - ps.y) * 0.12;
        ps.rot += (pushRot - ps.rot) * 0.12;

        const tx = tiltX + ps.x;
        const ty = entranceY + floatY + tiltYGlobal + ps.y;
        const rot = s.base + entranceRot + tiltRot + ps.rot;

        el.style.transform = `translate(${tx}px, ${ty}px) rotate(${rot}deg)`;
        if (ps.o !== opacity) {
          ps.o = opacity;
          el.style.opacity = String(opacity);
        }
      });

      raf = requestAnimationFrame(tick);
    };

    let running = false;
    let intersecting = true;
    const sync = () => {
      const shouldRun = intersecting && !pausedRef.current;
      if (shouldRun && !running) {
        running = true;
        raf = requestAnimationFrame(tick);
      } else if (!shouldRun && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    };
    syncRef.current = sync;
    sync();

    // Perf only: stop animating once scrolled well past this (pinned)
    // section, resume if it comes back into view.
    let io: IntersectionObserver | undefined;
    if (container) {
      io = new IntersectionObserver(
        ([entry]) => {
          intersecting = entry.isIntersecting;
          sync();
        },
        { rootMargin: "200px" },
      );
      io.observe(container);
    }

    return () => {
      cancelAnimationFrame(raf);
      io?.disconnect();
      syncRef.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onTouch);
    };
  }, []);

  return (
    <div data-floating-shapes className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {/* No blur on this one. It is a two-stop linear gradient across the
          whole viewport — there is no detail in it for a 64px Gaussian to
          soften, so the filter was buying a viewport-sized backing store and
          a blur pass in exchange for a visually identical result. */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-white/[0.03]" />
      <div
        className="absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 10%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 40%, black 10%, transparent 75%)",
        }}
      />
      <div
        ref={spotlightRef}
        className="fixed left-0 top-0 h-[700px] w-[700px] rounded-full will-change-transform"
        style={{
          background:
            "radial-gradient(circle, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 35%, transparent 70%)",
          // Parked far offscreen until the effect positions it on mount —
          // avoids an SSR hydration mismatch from viewport-dependent values.
          transform: "translate3d(-9999px, -9999px, 0) translate(-50%, -50%)",
        }}
      />
      {SHAPES.map((s, i) => (
        <div
          key={i}
          className="absolute"
          style={{ left: s.left, right: s.right, top: s.top, bottom: s.bottom }}
        >
          <div
            ref={(el) => {
              shapeRefs.current[i] = el;
            }}
            // will-change so the per-frame transform stays a compositor move.
            // Each bar carries a border and a 32px shadow; without its own
            // layer the browser is free to re-rasterise both every frame.
            className="relative rounded-full border border-white/15 shadow-[0_8px_32px_0_rgba(255,255,255,0.08)] will-change-transform"
            style={{
              width: s.width,
              height: s.height,
              background: "linear-gradient(90deg, rgba(255,255,255,0.14), transparent 70%)",
              opacity: 0,
            }}
          />
        </div>
      ))}
    </div>
  );
}
