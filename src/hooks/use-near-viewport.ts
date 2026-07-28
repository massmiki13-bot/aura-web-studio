import { useEffect, useState } from "react";

// Reading a bounding rect right after ScrollTrigger's per-frame style writes
// forces a synchronous layout, and doing that on every scrolled frame (once
// per mounted scene) shows up as jank on scroll-heavy sections. A proximity
// test against a several-hundred-pixel margin needs nothing like that
// precision, so checks are capped at this interval — with a trailing one so
// the final resting position is never missed.
const CHECK_INTERVAL = 120;

/**
 * Tracks whether an element is within `margin` px of the viewport, using the
 * project's scroll-driven bounding-rect pattern (IntersectionObserver doesn't
 * fire reliably in this setup — see SplineScene/VolumetricStudio history),
 * throttled to one rect read per CHECK_INTERVAL and always aligned to a frame.
 *
 * - `mounted` flips true the first time the element comes near and then stays
 *   true, so a WebGL canvas is created once and never torn down by scrolling
 *   (context creation is far more expensive than an idle context).
 * - `active` follows visibility continuously — use it to pause render loops.
 *
 * Both start false, so nothing mounts during SSR.
 */
export function useNearViewport(ref: React.RefObject<HTMLElement | null>, margin = 400) {
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);

  useEffect(() => {
    let frame = 0;
    let trailing = 0;
    let last = 0;

    const check = () => {
      frame = 0;
      last = performance.now();
      const node = ref.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const near = rect.bottom > -margin && rect.top < window.innerHeight + margin;
      setActive((prev) => (prev === near ? prev : near));
      if (near) setMounted(true);
    };

    const schedule = () => {
      if (frame) return;
      frame = requestAnimationFrame(check);
    };

    const onScroll = () => {
      const since = performance.now() - last;
      if (since >= CHECK_INTERVAL) {
        schedule();
        return;
      }
      if (!trailing) {
        trailing = window.setTimeout(() => {
          trailing = 0;
          schedule();
        }, CHECK_INTERVAL - since);
      }
    };

    check();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      if (trailing) window.clearTimeout(trailing);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref, margin]);

  return { mounted, active };
}
