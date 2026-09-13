"use client";

import { useEffect, useRef } from "react";

/**
 * The masthead's background: a drifting field of dots that answers your
 * finger.
 *
 * Touch it and the dots nearby are pushed outward and brighten, and hairlines
 * reach from the closest of them to where you are holding. Let go and they
 * ease back into their drift. It is the one piece of the phone home page that
 * responds to the visitor rather than to the scroll position, which is what
 * makes an opening screen feel like a place rather than a picture.
 *
 * Written for this page rather than reusing `SparklesCanvas`: that component
 * is shared with the desktop headers and has no notion of a pointer, and
 * teaching it one would put touch handling on pages that do not want it.
 *
 * The performance rules it holds to, all of which matter more on a phone than
 * the effect does:
 *
 *   - One pre-rendered dot sprite, stamped with `drawImage`. Ninety
 *     `arc()`+`fill()` pairs per frame is real CPU on a mid-range phone; a
 *     blit is a fraction of it for an identical soft dot.
 *   - Device pixel ratio capped at 2. A modern phone reports 3, which is
 *     2.25× the pixels to clear and paint every frame for a difference
 *     nobody can see on a soft 2px dot.
 *   - The loop is cancelled — not merely skipped — when the masthead scrolls
 *     away. A rAF that returns early still wakes the main thread sixty times
 *     a second for the entire length of the page.
 *   - The links are drawn from the pointer to each dot, never between dots.
 *     Dot-to-dot is O(n²): at ninety particles that is eight thousand
 *     distance checks per frame, for a constellation nobody asked for.
 *   - Nothing runs at all under prefers-reduced-motion; the canvas simply
 *     stays empty and the masthead is type on black, which is what that
 *     setting is asking for.
 */
export function MobileHeroField({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;

    type P = {
      /** Where it belongs, and drifts around. */
      hx: number;
      hy: number;
      /** Where it is right now, after being pushed. */
      x: number;
      y: number;
      /** Current push, decayed every frame. */
      vx: number;
      vy: number;
      r: number;
      /** Its own slow vertical drift, so the field never looks like a grid. */
      drift: number;
      phase: number;
      alpha: number;
    };

    let dots: P[] = [];

    // A soft dot, drawn once into an offscreen canvas and then stamped.
    const sprite = document.createElement("canvas");
    const SPRITE = 16;
    sprite.width = sprite.height = SPRITE;
    const sctx = sprite.getContext("2d");
    if (sctx) {
      const g = sctx.createRadialGradient(
        SPRITE / 2,
        SPRITE / 2,
        0,
        SPRITE / 2,
        SPRITE / 2,
        SPRITE / 2,
      );
      g.addColorStop(0, "rgba(255,255,255,1)");
      g.addColorStop(0.45, "rgba(255,255,255,0.55)");
      g.addColorStop(1, "rgba(255,255,255,0)");
      sctx.fillStyle = g;
      sctx.fillRect(0, 0, SPRITE, SPRITE);
    }

    const build = () => {
      // Density rather than a fixed count, so a tall phone and a short one
      // both get a field that looks deliberate.
      const count = Math.min(110, Math.round((w * h) / 3600));
      dots = Array.from({ length: count }, () => {
        const hx = Math.random() * w;
        const hy = Math.random() * h;
        return {
          hx,
          hy,
          x: hx,
          y: hy,
          vx: 0,
          vy: 0,
          r: Math.random() * 1.6 + 0.6,
          drift: Math.random() * 0.14 + 0.03,
          phase: Math.random() * Math.PI * 2,
          alpha: Math.random() * 0.5 + 0.25,
        };
      });
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };

    resize();

    /** Where the finger is, and how strongly it is being felt. */
    const touch = { x: -999, y: -999, power: 0 };
    const REACH = 110;

    const point = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      touch.x = e.clientX - rect.left;
      touch.y = e.clientY - rect.top;
      touch.power = 1;
    };
    const release = () => {
      touch.power = 0;
    };

    // Passive: this must never be able to delay a scroll. The effect reads
    // the pointer, it never consumes the gesture, so the visitor can still
    // flick the page while dragging across the field.
    canvas.addEventListener("pointerdown", point, { passive: true });
    canvas.addEventListener("pointermove", point, { passive: true });
    canvas.addEventListener("pointerup", release, { passive: true });
    canvas.addEventListener("pointercancel", release, { passive: true });
    canvas.addEventListener("pointerleave", release, { passive: true });

    let raf = 0;
    let running = false;
    let t = 0;

    /**
     * Paints one frame. Separate from the loop so the first one can be drawn
     * synchronously on mount: `requestAnimationFrame` does not fire until the
     * tab is actually being presented, so without this the masthead's
     * background is empty for the first painted frame — and stays empty for
     * as long as the page is open in a backgrounded tab.
     */
    const draw = () => {
      t += 0.016;
      ctx.clearRect(0, 0, w, h);

      const px = touch.x;
      const py = touch.y;
      const live = touch.power > 0.01;

      ctx.globalCompositeOperation = "lighter";

      for (const d of dots) {
        // Home position drifts upward and wraps, so the field breathes even
        // when nobody is touching it.
        d.hy -= d.drift;
        if (d.hy < -8) {
          d.hy = h + 8;
          d.hx = Math.random() * w;
        }

        let lit = 0;

        if (live) {
          const dx = d.x - px;
          const dy = d.y - py;
          const dist = Math.hypot(dx, dy);
          if (dist < REACH && dist > 0.001) {
            // Falls off with distance, so the push has a soft edge rather
            // than a visible circular boundary.
            const force = (1 - dist / REACH) * 1.5;
            d.vx += (dx / dist) * force;
            d.vy += (dy / dist) * force;
            lit = 1 - dist / REACH;
          }
        }

        // Spring home, then damp. Together these are what make it settle
        // rather than either snapping back or drifting away.
        d.vx += (d.hx - d.x) * 0.012;
        d.vy += (d.hy - d.y) * 0.012;
        d.vx *= 0.9;
        d.vy *= 0.9;
        d.x += d.vx;
        d.y += d.vy;

        const twinkle = 0.75 + Math.sin(t * 1.4 + d.phase) * 0.25;
        const a = Math.min(1, d.alpha * twinkle + lit * 0.8);
        const size = (d.r + lit * 1.6) * 4;

        ctx.globalAlpha = a;
        ctx.drawImage(sprite, d.x - size / 2, d.y - size / 2, size, size);

        // A hairline back to the finger for the closest dots only — the thing
        // that makes the interaction legible rather than merely felt.
        if (lit > 0.55) {
          ctx.globalAlpha = (lit - 0.55) * 0.5;
          ctx.strokeStyle = "rgba(255,255,255,0.8)";
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(d.x, d.y);
          ctx.lineTo(px, py);
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };

    const frame = () => {
      draw();
      raf = requestAnimationFrame(frame);
    };

    // The still frame, before anything is scheduled.
    draw();

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    };
    const stop = () => {
      if (!running) return;
      running = false;
      cancelAnimationFrame(raf);
    };

    // Only while the masthead is actually on screen.
    const io = new IntersectionObserver(([entry]) => (entry.isIntersecting ? start() : stop()), {
      threshold: 0,
    });
    io.observe(canvas);

    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    return () => {
      stop();
      io.disconnect();
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("pointerdown", point);
      canvas.removeEventListener("pointermove", point);
      canvas.removeEventListener("pointerup", release);
      canvas.removeEventListener("pointercancel", release);
      canvas.removeEventListener("pointerleave", release);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      // touch-none would swallow the scroll; the field reads the pointer
      // without claiming the gesture, so the page still flicks normally.
      className={className}
    />
  );
}
