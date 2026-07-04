import { Suspense, lazy, useEffect, useRef, useState } from "react";
import type { Application } from "@splinetool/runtime";

const Spline = lazy(() => import("@splinetool/react-spline"));

type SplineSceneProps = {
  scene: string;
  className?: string;
  /** Skip the "wait until near viewport" lazy-load and mount immediately —
   *  use for scenes that are already visible on first paint (e.g. the hero),
   *  where waiting for an IntersectionObserver only delays the load. */
  eager?: boolean;
  /** Fires once the runtime has parsed the scene, with the live Application
   *  instance — use it to drive camera zoom / object state from scroll. */
  onSplineLoad?: (app: Application) => void;
};

/**
 * Loads a Spline 3D scene only once it's near the viewport, and never on
 * prefers-reduced-motion or narrow/mobile viewports — the runtime is heavy
 * (1-3MB+ of wasm/JS) and 3D here is a premium desktop accent, not a
 * requirement, per the site's performance-first design brief.
 */
export function SplineScene({ scene, className, eager, onSplineLoad }: SplineSceneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobile = window.innerWidth < 768;
    if (reduceMotion || isMobile) return;

    if (eager) {
      setShouldLoad(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    // IntersectionObserver doesn't fire reliably for this component in this
    // project's setup, so "near viewport" is instead a plain scroll-driven
    // bounding-rect check (rAF-throttled) with a generous margin. It also
    // runs once immediately on mount to catch elements already in view.
    let ticking = false;
    let done = false;
    const margin = 400;
    const check = () => {
      ticking = false;
      if (done || !ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      if (rect.bottom > -margin && rect.top < window.innerHeight + margin) {
        done = true;
        setShouldLoad(true);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
      }
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(check);
      }
    };
    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [eager]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // react-spline sizes its canvas once against the container's dimensions
    // at load time. If that happens before the surrounding flex/grid layout
    // has settled (e.g. inside a pinned full-bleed hero), the canvas is
    // stuck small forever — force a resize whenever the container changes.
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) appRef.current?.setSize(width, height);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {shouldLoad && (
        <Suspense fallback={null}>
          <Spline
            scene={scene}
            onLoad={(app) => {
              appRef.current = app;
              setReady(true);
              onSplineLoad?.(app);
              // Force one resize pass right after load too, in case the
              // container's final size wasn't reached until this frame.
              requestAnimationFrame(() => {
                if (ref.current) {
                  const { width, height } = ref.current.getBoundingClientRect();
                  if (width > 0 && height > 0) app.setSize(width, height);
                }
              });
            }}
            style={{
              width: "100%",
              height: "100%",
              opacity: ready ? 1 : 0,
              transition: "opacity 1.2s ease",
            }}
          />
        </Suspense>
      )}
    </div>
  );
}
