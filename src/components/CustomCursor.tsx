"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The site's pointer: a small solid dot that tracks the mouse almost exactly,
 * and a ring that trails behind it and stretches along its direction of travel
 * — the same liquid-metal language as the hero's chrome form, which squashes
 * and melts rather than moving rigidly.
 *
 * The whole thing is drawn in `mix-blend-mode: difference`, which is what makes
 * it work over the site's two surfaces without any logic: white over the black
 * page, black over the white CTA buttons. (Its one blind spot is a true mid
 * grey, where difference approaches invisible. Nothing on this site is one for
 * long — the only large mid-tone is the chrome blob's own highlight, where the
 * cursor thins out for a moment and comes back.)
 *
 * Rules it holds to:
 *
 * - The native cursor is never hidden by the stylesheet. `.has-custom-cursor`
 *   is put on <html> by this effect *after* it has confirmed it can draw a
 *   replacement, and taken off again the moment it can't. A failed chunk, a
 *   render error, JavaScript off — every one of those leaves the visitor with
 *   the arrow they started with instead of no pointer at all.
 * - Coarse pointers never get it, and neither does anyone who asked for reduced
 *   motion. The fine-pointer query is watched rather than sampled once, so
 *   plugging a mouse into a touch laptop turns it on mid-session.
 * - It stays hidden until the mouse actually moves, so a keyboard-only visitor
 *   is never shown a dot parked in the corner.
 * - Text fields keep the caret. `cursor: text` wins over the blanket
 *   `cursor: none` in the stylesheet, and the ring hides itself to match.
 *
 * The frame loop stops itself once everything has converged and wakes on the
 * next input, so a still mouse costs nothing.
 */

/** Elements the ring opens up over. `data-cursor="grow"` opts anything in. */
const INTERACTIVE =
  'a, button, summary, label[for], select, [role="button"], [role="link"], [data-cursor="grow"]';

/**
 * Elements where the native caret says more than a ring can. Keep in sync with
 * the matching `cursor: text` rule in styles.css — that one restores the caret,
 * this one gets the ring out of its way.
 */
const TEXT_FIELD =
  'textarea, [contenteditable="true"], input:not([type="button"], [type="submit"], [type="reset"], [type="checkbox"], [type="radio"], [type="range"], [type="color"], [type="file"])';

/** Ring scale by state. 1 is its resting 32px. */
const RING_OVER = 1.85;
const RING_PRESS = 0.72;
/** Dot scale by state. It gets out of the way when the ring opens. */
const DOT_OVER = 0;
const DOT_PRESS = 1.5;

/** Velocity at which the ring reaches its full stretch, in px/s. */
const STRETCH_AT = 2600;
const STRETCH_MAX = 0.4;

export function CustomCursor() {
  // Deliberately *not* behind the boot gate (@/lib/boot), unlike every other
  // moving thing on this page. That gate exists to keep WebGL contexts and
  // shader compiles out of the intro's moment; this is two divs and a loop
  // that idles when the mouse is still. Holding it back would only mean the
  // visitor watches their pointer change shape partway through the intro.
  //
  // Whether this visitor should get a custom pointer at all. Kept as state
  // rather than checked inside the loop's effect so that when the answer is no
  // — reduced motion, a touch screen — the two elements are never put in the
  // document. An invisible fixed element carrying mix-blend-mode still asks
  // the compositor for a blended layer; the cheapest version of it is absent.
  //
  // Starts false, so the server render and the hydration pass agree, and the
  // fine-pointer query is subscribed to rather than sampled once: plugging a
  // mouse into a touch laptop turns the cursor on mid-session.
  const [capable, setCapable] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const read = () => setCapable(fine.matches);
    read();
    fine.addEventListener("change", read);
    return () => fine.removeEventListener("change", read);
  }, []);

  useEffect(() => {
    if (!capable) return;
    const root = rootRef.current;
    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!root || !ring || !dot) return;

    // Where the pointer is, and the two damped followers chasing it.
    let tx = 0;
    let ty = 0;
    let rx = 0;
    let ry = 0;
    let dx = 0;
    let dy = 0;
    // Ring position last frame, for the velocity the stretch is derived from.
    let prx = 0;
    let pry = 0;
    let angle = 0;
    let ringScale = 1;
    let dotScale = 1;
    let ringTo = 1;
    let dotTo = 1;
    // The interactive element under the pointer, held (rather than a boolean)
    // so a stale hover can be detected if it leaves the document — see tick.
    let over: Element | null = null;
    let onText = false;
    let pressed = false;
    let inside = true;
    let moved = false;
    let last = 0;
    let raf = 0;
    let alive = false;

    const sync = () => {
      ringTo = over ? RING_OVER : 1;
      dotTo = over ? DOT_OVER : 1;
      if (pressed) {
        ringTo *= RING_PRESS;
        if (!over) dotTo = DOT_PRESS;
      }
      root.classList.toggle("is-over", !!over);
      // Visible only once the mouse has told us where it is, only while it is
      // inside the document, and never over a text field.
      root.classList.toggle("is-visible", moved && inside && !onText);
    };

    const tick = (now: number) => {
      // First frame after a wake has no meaningful delta; treat it as one
      // frame at 60Hz rather than letting a huge dt snap everything at once.
      const d = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
      last = now;

      // A hover whose element has been removed from the document — a route
      // change under a still cursor — never gets a mouseover to correct it.
      // `isConnected` is a plain property read, no layout.
      if (over && !over.isConnected) {
        over = null;
        sync();
      }

      // exp() damping, so the feel is identical at 30, 60 or 144Hz. The dot is
      // pulled hard enough to read as exact; the ring is what lags.
      const kd = 1 - Math.exp(-45 * d);
      const kr = 1 - Math.exp(-14 * d);
      const ks = 1 - Math.exp(-12 * d);

      dx += (tx - dx) * kd;
      dy += (ty - dy) * kd;
      prx = rx;
      pry = ry;
      rx += (tx - rx) * kr;
      ry += (ty - ry) * kr;
      ringScale += (ringTo - ringScale) * ks;
      dotScale += (dotTo - dotScale) * ks;

      // Squash and stretch along the direction of travel. Derived from the
      // ring's own movement rather than the raw pointer's, so it inherits the
      // damping instead of twitching on every jittery mouse sample.
      const vx = (rx - prx) / d;
      const vy = (ry - pry) / d;
      const speed = Math.hypot(vx, vy);
      const stretch = Math.min(speed / STRETCH_AT, STRETCH_MAX);
      // Below walking pace the direction is noise, so the last angle is held —
      // otherwise the ring spins as the cursor settles.
      if (speed > 120) angle = Math.atan2(vy, vx);

      ring.style.transform =
        `translate3d(${rx}px, ${ry}px, 0) rotate(${angle}rad) ` +
        `scale(${ringScale * (1 + stretch)}, ${ringScale * (1 - stretch * 0.65)})`;
      dot.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(${dotScale})`;

      // Everything has arrived: write the exact values once and stop. The next
      // input event wakes the loop again.
      const settled =
        Math.abs(tx - rx) < 0.1 &&
        Math.abs(ty - ry) < 0.1 &&
        Math.abs(tx - dx) < 0.1 &&
        Math.abs(ty - dy) < 0.1 &&
        Math.abs(ringTo - ringScale) < 0.002 &&
        Math.abs(dotTo - dotScale) < 0.002;
      if (settled) {
        alive = false;
        ring.style.transform = `translate3d(${tx}px, ${ty}px, 0) rotate(${angle}rad) scale(${ringTo})`;
        dot.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${dotTo})`;
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    const wake = () => {
      if (alive) return;
      alive = true;
      last = 0;
      raf = requestAnimationFrame(tick);
    };

    const onMove = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!moved) {
        // Land the followers on the pointer rather than flying them in from
        // the origin on the very first move.
        moved = true;
        rx = dx = prx = tx;
        ry = dy = pry = ty;
        sync();
      }
      if (!inside) {
        inside = true;
        sync();
      }
      wake();
    };

    // mouseover, not a closest() on every mousemove: this fires once when the
    // pointer crosses onto a different element, which is exactly when the
    // answer can change.
    const onOver = (e: MouseEvent) => {
      const el = e.target instanceof Element ? e.target : null;
      const nextOver = el?.closest(INTERACTIVE) ?? null;
      const nextText = !!el?.closest(TEXT_FIELD);
      if (nextOver === over && nextText === onText) return;
      over = nextOver;
      onText = nextText;
      sync();
      wake();
    };

    const onDown = () => {
      pressed = true;
      sync();
      wake();
    };
    const onUp = () => {
      pressed = false;
      sync();
      wake();
    };

    // Leaving through the edge of the window, or the window losing focus to a
    // devtools pane or another app. Both would otherwise strand the cursor at
    // the last position it saw.
    const onLeave = (e: MouseEvent) => {
      if (e.relatedTarget) return;
      inside = false;
      sync();
    };
    const onBlur = () => {
      inside = false;
      pressed = false;
      sync();
    };

    // Taking the native pointer away is the *last* thing this effect does, and
    // only once everything that replaces it is bound and ready to draw.
    document.documentElement.classList.add("has-custom-cursor");
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mousedown", onDown, { passive: true });
    window.addEventListener("mouseup", onUp, { passive: true });
    window.addEventListener("blur", onBlur);
    document.addEventListener("mouseout", onLeave, { passive: true });

    return () => {
      // …and giving it back is the first thing the teardown does, so there is
      // no window in which the page has neither pointer.
      document.documentElement.classList.remove("has-custom-cursor");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("mouseout", onLeave);
      cancelAnimationFrame(raf);
      alive = false;
    };
  }, [capable]);

  if (!capable) return null;

  return (
    <div ref={rootRef} aria-hidden className="cursor-root">
      <div ref={ringRef} className="cursor-ring" />
      <div ref={dotRef} className="cursor-dot" />
    </div>
  );
}
