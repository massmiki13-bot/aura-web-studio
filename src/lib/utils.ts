import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Collapses a burst of calls (e.g. window "resize" firing continuously while
 * a user drags the window edge) into a single rAF-scheduled call — avoids
 * canvas components re-measuring/re-rendering on every intermediate event.
 */
export function rafDebounce<T extends (...args: never[]) => void>(fn: T): T & { cancel: () => void } {
  let raf = 0;
  const debounced = ((...args: Parameters<T>) => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => fn(...args));
  }) as T & { cancel: () => void };
  debounced.cancel = () => cancelAnimationFrame(raf);
  return debounced;
}
