import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Reads an array-valued translation safely.
 *
 * `t(key, { returnObjects: true })` is typed as returning whatever you cast it
 * to, but at runtime it returns the *key* (a string) whenever the resource
 * isn't loaded — and a transient SSR/i18n race is enough to hit that. The
 * casts this replaces were each followed by `.map()`, so that race threw
 * "x.map is not a function" during the server render and Vercel answered the
 * whole page with a 500. Rendering nothing there is always better than
 * rendering an error page.
 */
export function tList<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

/**
 * Collapses a burst of calls (e.g. window "resize" firing continuously while
 * a user drags the window edge) into a single rAF-scheduled call — avoids
 * canvas components re-measuring/re-rendering on every intermediate event.
 */
export function rafDebounce<T extends (...args: never[]) => void>(
  fn: T,
): T & { cancel: () => void } {
  let raf = 0;
  const debounced = ((...args: Parameters<T>) => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => fn(...args));
  }) as T & { cancel: () => void };
  debounced.cancel = () => cancelAnimationFrame(raf);
  return debounced;
}
