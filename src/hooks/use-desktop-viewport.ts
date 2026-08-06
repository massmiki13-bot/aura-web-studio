import { useEffect, useState } from "react";

const DESKTOP_QUERY = "(min-width: 768px)"; // Tailwind's `md` breakpoint

/**
 * Is the viewport at least `md` wide? `null` until measured on the client, so
 * SSR and the first client render agree and there is nothing to
 * hydration-mismatch on; the real answer commits a beat later.
 *
 * Callers gating a WebGL scene must test `=== true`, never `!== false`. The
 * heavy scenes here mount off a `getBoundingClientRect()` proximity check
 * (`useNearViewport`), and a `display:none` element collapses to a (0,0,0,0)
 * box that reads as "at the top of the viewport" — so a CSS-hidden branch still
 * mounts its canvas and still downloads its runtime. Only not rendering the
 * component at all keeps that work off phones.
 */
export function useIsDesktopViewport(): boolean | null {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isDesktop;
}
