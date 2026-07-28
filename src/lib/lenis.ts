import type Lenis from "lenis";

/**
 * The page's single Lenis instance, published by <SmoothScroll /> on mount.
 *
 * Anything that has to intercept a wheel gesture — an embedded 3D canvas that
 * would otherwise zoom, a custom scroller — needs to hand that gesture back to
 * Lenis rather than swallow it. Lenis listens on `window` in the bubble phase,
 * so a `stopPropagation()` anywhere below it silently drops the page out of
 * smooth scroll and into raw native scrolling for the duration of the gesture,
 * which reads as a stall mid-page.
 *
 * Null when smooth scroll isn't running (prefers-reduced-motion): callers
 * should then simply let the native scroll through.
 */
let current: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  current = instance;
}

export function getLenis(): Lenis | null {
  return current;
}
