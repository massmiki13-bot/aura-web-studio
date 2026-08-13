"use client";

import { Suspense, lazy, useEffect, useRef, useState } from "react";
import type { Application } from "@splinetool/runtime";
import { useNearViewport } from "@/hooks/use-near-viewport";
import { CanvasBoundary } from "@/components/CanvasBoundary";
import { getLenis } from "@/lib/lenis";
import { onBootReady, onScrollIntent } from "@/lib/boot";
import { useBootReady } from "@/lib/use-boot-ready";

// The Spline runtime + WebGL scene are heavy, so the component is code-split
// and only imported the first time the host element nears the viewport.
const Spline = lazy(() => import("@splinetool/react-spline"));

export type SplineSceneProps = {
  /** The published scene URL (…/scene.splinecode). */
  scene?: string;
  className?: string;
};

/**
 * Silences one specific, diagnosed line of noise from the Spline runtime.
 *
 * The Services scene (0CM1l3LnIBHakUny) contains a looping timeline whose
 * tween references a state the runtime cannot resolve. When that timeline
 * first completes, `buildTimeline` constructs the tween, the constructor
 * throws `new Error("Missing property")`, and buildTimeline's *own* try/catch
 * swallows it and calls `console.error(err.message)` — a bare string with no
 * stack. Nothing else happens: the scene loads, renders and animates, and the
 * only real consequence is that one interaction in the scene never fires.
 *
 * It is emitted exactly once per page load (measured: one occurrence, then
 * nothing across 45s parked on the section), so this costs no frames. What it
 * does cost is a Next dev-overlay panel in your face every time you scroll
 * past the hero, because the overlay intercepts console.error.
 *
 * This is a mitigation, not a repair — the defect is in the published scene
 * binary and cannot be fixed from this repository. The durable fix is to
 * correct the event in the Spline editor and re-publish, or to replace the
 * scene. Delete this function when either happens.
 *
 * Deliberately narrow:
 * - development only, so production logging and any error monitoring you add
 *   later still see everything;
 * - installed from this module, so it exists only on pages that actually mount
 *   a Spline scene rather than being global surgery in the root layout;
 * - matches a lone string argument by exact value. Spline logs `err.message`,
 *   so an Error object with the same text — from anything else — is a
 *   different type and still gets through.
 */
const SPLINE_TIMELINE_NOISE = "Missing property";
let noiseFiltered = false;
function silenceSplineTimelineNoise() {
  if (noiseFiltered || process.env.NODE_ENV !== "development") return;
  if (typeof window === "undefined") return;
  noiseFiltered = true;
  const original = console.error;
  console.error = (...args: unknown[]) => {
    if (args.length === 1 && args[0] === SPLINE_TIMELINE_NOISE) return;
    original(...args);
  };
}

// Fetching + evaluating the runtime chunk costs several MB and a long main-
// thread task. Left to the scroll, that task lands in the middle of the
// approach to the section and stalls a frame, so it's started during idle time
// instead — by the time the section is near, mounting is just a canvas and the
// scene download.
//
// The timing is gated twice, deliberately. First the boot gate (see @/lib/boot)
// — this section's wrapper mounts on the very first render of a cold visit, and
// warming from there put a multi-megabyte download and parse up against the
// intro and the hero's shader compile. Then scroll intent: even after boot, the
// visitor is looking at the hero, and this parse is a long main-thread task that
// stutters the hero's background animation if it lands in that window. It waits
// for the first scroll — still a full section of runway before this scene is
// reached — with a long fallback for a visitor who lingers on the hero.
//
// Second line of defence for phones. Callers are expected not to render this
// component on mobile at all (see Services), but this helper's whole job is to
// schedule work on gates that fire *later* — long after a component that only
// existed for one render has gone. If it ever runs on a narrow viewport it
// would download several megabytes for a scene that is never shown, so it
// refuses outright rather than trusting the caller.
let warmed = false;
function warmSplineRuntime() {
  if (warmed || typeof window === "undefined") return;
  if (!window.matchMedia("(min-width: 768px)").matches) return;
  warmed = true;
  const load = () => {
    void import("@splinetool/react-spline");
  };
  const schedule = () => {
    if (typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(load, { timeout: 4000 });
    } else {
      window.setTimeout(load, 2000);
    }
  };
  onBootReady(() => onScrollIntent(schedule, 8000));
}

/**
 * Drop-in Spline scene wrapper. Replaces the procedural R3F coin (UnovaCoin):
 * client-only (nothing mounts during SSR), lazy (the runtime + scene download
 * only start once the element is near the viewport, via the same
 * useNearViewport pattern the rest of the site's canvases use), and fades in
 * once the scene has finished loading so there's no pop.
 *
 * Under prefers-reduced-motion the scene still renders (Spline shows its
 * initial pose) but nothing is force-loaded eagerly.
 */
export function SplineScene({
  scene = "https://prod.spline.design/0CM1l3LnIBHakUny/scene.splinecode",
  className,
}: SplineSceneProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  // A full viewport of lead time: the canvas has to exist and the scene has to
  // be decoding *before* the section starts arriving, otherwise that work is
  // paid frame-by-frame during the scroll into it.
  const { mounted: near, active } = useNearViewport(wrapRef, 900);
  const booted = useBootReady();
  // Even once booted and measured near, the scene's own mount forces the heavy
  // runtime import (the Suspense child imports it regardless of the warm
  // helper), so the mount itself waits for scroll intent — otherwise that parse
  // lands while the visitor is still on the hero and stutters its animation.
  // A page that loads already scrolled down skips the wait.
  const [intent, setIntent] = useState(false);
  useEffect(() => {
    if (!booted) return;
    if (window.scrollY > 50) {
      setIntent(true);
      return;
    }
    return onScrollIntent(() => setIntent(true), 8000);
  }, [booted]);
  const mounted = near && booted && intent;
  const [loaded, setLoaded] = useState(false);
  const appRef = useRef<Application | null>(null);

  useEffect(warmSplineRuntime, []);
  useEffect(silenceSplineTimelineNoise, []);

  // Kill Spline's scroll-wheel zoom. Spline binds a native `wheel` listener on
  // its canvas; a capture-phase listener on the wrapper fires first and stops
  // the event before the canvas ever sees it.
  //
  // Stopping there is not enough on its own, though: Lenis drives the whole
  // page and listens on `window` in the bubble phase, so a swallowed wheel
  // event never reached it — the browser fell back to native scrolling while
  // Lenis resynced from it, which is the jolt you felt scrolling into this
  // section. The gesture is therefore re-dispatched straight at `window`,
  // where Lenis picks it up with its own easing, multipliers and delta-mode
  // normalisation. The synthetic event's path is just `window`, so it can't
  // come back through this listener.
  useEffect(() => {
    const node = wrapRef.current;
    if (!node || !mounted) return;
    const onWheel = (e: WheelEvent) => {
      e.stopPropagation();
      const lenis = getLenis();
      // No Lenis (prefers-reduced-motion) or a browser-zoom gesture: the
      // native default is the right behaviour, so it's left untouched.
      if (!lenis || e.ctrlKey) return;
      e.preventDefault();
      window.dispatchEvent(
        new WheelEvent("wheel", {
          deltaX: e.deltaX,
          deltaY: e.deltaY,
          deltaMode: e.deltaMode,
          cancelable: true,
        }),
      );
    };
    node.addEventListener("wheel", onWheel, { capture: true, passive: false });
    return () =>
      node.removeEventListener("wheel", onWheel, { capture: true } as EventListenerOptions);
  }, [mounted]);

  // The scene keeps rendering (and running its controls) once mounted, and
  // there is more than one of these on the page — parked far from the viewport
  // that's frames taken from whatever the visitor is actually looking at.
  useEffect(() => {
    const app = appRef.current;
    if (!app) return;
    if (active) app.play();
    else app.stop();
  }, [active, loaded]);

  // react-spline sizes its canvas against the container once, at load time. In
  // a full-bleed section that only reaches its final size after the pinned
  // layout above it settles, that leaves the canvas stuck at the wrong size —
  // so the runtime is re-sized whenever the container's box changes.
  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) appRef.current?.setSize(width, height);
    });
    ro.observe(node);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className={className} aria-hidden>
      {mounted && (
        <CanvasBoundary label="spline scene">
          <Suspense fallback={null}>
            <Spline
              scene={scene}
              onLoad={(app) => {
                appRef.current = app;
                // Scenes are published at "auto" pixel ratio, i.e. the full
                // devicePixelRatio — four times the fragments on a hi-DPI
                // screen, and for a section-sized canvas that is the single
                // biggest reason frames start dropping while scrolling through
                // it. Capped through the runtime's own (private but stable)
                // renderer hook; if the internals ever move this silently
                // no-ops and the scene just renders at full resolution again.
                try {
                  const renderer = (
                    app as unknown as { _renderer?: { setPixelRatio?: (r: number) => void } }
                  )._renderer;
                  renderer?.setPixelRatio?.(Math.min(window.devicePixelRatio || 1, 1.5));
                } catch {
                  /* keep full-res rendering */
                }
                // The container may not have reached its final size until this
                // frame — one forced resize pass covers that.
                const box = wrapRef.current?.getBoundingClientRect();
                if (box && box.width > 0 && box.height > 0) app.setSize(box.width, box.height);
                setLoaded(true);
              }}
              style={{
                width: "100%",
                height: "100%",
                opacity: loaded ? 1 : 0,
                transition: "opacity 600ms ease",
              }}
            />
          </Suspense>
        </CanvasBoundary>
      )}
    </div>
  );
}
