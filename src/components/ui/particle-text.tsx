import { useEffect, useRef, useState } from "react";
import { rafDebounce } from "@/lib/utils";

type Color = { r: number; g: number; b: number };

// Neutral white/silver palette instead of the reference's indigo/fuchsia/amber
// mix, so the effect reads as a premium monochrome accent rather than a
// colorful demo.
const PALETTE: Color[] = [
  { r: 255, g: 255, b: 255 },
  { r: 214, g: 214, b: 214 },
  { r: 180, g: 180, b: 190 },
];

const WORD_INTERVAL = 3800;
const PIXEL_STEP = 3;
const ARRIVE_MIN = 900;
const ARRIVE_MAX = 1500;

function easeOutCubic(t: number) {
  return 1 - (1 - t) ** 3;
}
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function lerpColor(a: Color, b: Color, t: number): Color {
  return { r: lerp(a.r, b.r, t), g: lerp(a.g, b.g, t), b: lerp(a.b, b.b, t) };
}

/**
 * Each dot animates on a guaranteed start->target tween (eased, with a touch
 * of organic drift) instead of a force-steered simulation — the previous
 * force/damping model could leave particles stranded partway across a wide
 * canvas depending on distance, which made the text unreadable. A direct
 * tween always arrives, so "the particles must actually form the title" is
 * true by construction rather than by tuning constants.
 */
class Dot {
  sx: number;
  sy: number;
  tx: number;
  ty: number;
  startTime: number;
  duration: number;
  fromColor: Color;
  toColor: Color;
  size: number;
  phase: number;

  constructor(sx: number, sy: number, tx: number, ty: number, now: number, fromColor: Color, toColor: Color) {
    this.sx = sx;
    this.sy = sy;
    this.tx = tx;
    this.ty = ty;
    this.startTime = now;
    this.duration = ARRIVE_MIN + Math.random() * (ARRIVE_MAX - ARRIVE_MIN);
    this.fromColor = fromColor;
    this.toColor = toColor;
    this.size = 1.3 + Math.random() * 1.5;
    this.phase = Math.random() * Math.PI * 2;
  }

  retarget(tx: number, ty: number, now: number, toColor: Color, base: { x: number; y: number }, fromColor: Color) {
    this.sx = base.x;
    this.sy = base.y;
    this.tx = tx;
    this.ty = ty;
    this.startTime = now;
    this.duration = ARRIVE_MIN + Math.random() * (ARRIVE_MAX - ARRIVE_MIN);
    this.fromColor = fromColor;
    this.toColor = toColor;
  }

  // Base position/color at time `now`, before any pointer-repel offset.
  base(now: number) {
    const t = Math.min(1, (now - this.startTime) / this.duration);
    const eased = easeOutCubic(t);
    const wobble = (1 - eased) * 18;
    const x = lerp(this.sx, this.tx, eased) + Math.sin(now * 0.002 + this.phase) * wobble * 0.4;
    const y = lerp(this.sy, this.ty, eased) + Math.cos(now * 0.0016 + this.phase) * wobble * 0.4;
    const color = lerpColor(this.fromColor, this.toColor, eased);
    return { x, y, color, settled: t >= 1 };
  }
}

/**
 * A phrase assembles itself from thousands of dots flying in from the
 * screen edges, holds, then dissolves into the next phrase. Lightweight
 * canvas port of the reference "fluid particle text" effect — trimmed to
 * just the visual (no demo toolbar, FPS counter or word-list UI) and
 * recolored to the site's monochrome palette. Falls back to plain static
 * text under prefers-reduced-motion.
 */
export function ParticleText({ words, className = "" }: { words: string[]; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setReducedMotion(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx2d = canvas.getContext("2d", { alpha: true });
    if (!ctx2d) return;
    const ctx = ctx2d;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let dots: Dot[] = [];
    let wordIndex = 0;
    let colorIndex = 0;
    let lastWordTime = performance.now();
    const mouse = { x: -9999, y: -9999, inside: false };

    function edgeSpawn(): { x: number; y: number } {
      const vMargin = Math.max(220, h * 0.8);
      const edge = Math.floor(Math.random() * 4);
      if (edge === 0) return { x: Math.random() * w, y: -vMargin };
      if (edge === 1) return { x: w + 100, y: Math.random() * h };
      if (edge === 2) return { x: Math.random() * w, y: h + vMargin };
      return { x: -100, y: Math.random() * h };
    }

    function sampleText(word: string) {
      const off = document.createElement("canvas");
      off.width = Math.max(1, Math.floor(w));
      off.height = Math.max(1, Math.floor(h));
      const octx = off.getContext("2d")!;

      const targetWidth = w * 0.8;
      let fontSize = Math.min(h * 0.55, 180);
      octx.font = `800 ${fontSize}px Space Grotesk, Inter, sans-serif`;
      let metrics = octx.measureText(word);
      while (metrics.width > targetWidth && fontSize > 14) {
        fontSize -= 3;
        octx.font = `800 ${fontSize}px Space Grotesk, Inter, sans-serif`;
        metrics = octx.measureText(word);
      }

      octx.fillStyle = "white";
      octx.textAlign = "center";
      octx.textBaseline = "middle";
      octx.fillText(word, w / 2, h / 2);

      const img = octx.getImageData(0, 0, off.width, off.height);
      const data = img.data;
      const coords: { x: number; y: number }[] = [];
      for (let y = 0; y < off.height; y += PIXEL_STEP) {
        for (let x = 0; x < off.width; x += PIXEL_STEP) {
          const idx = (y * off.width + x) * 4;
          if (data[idx + 3] > 120) coords.push({ x, y });
        }
      }
      for (let i = coords.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [coords[i], coords[j]] = [coords[j], coords[i]];
      }
      return coords;
    }

    function nextWord(word: string) {
      const now = performance.now();
      const coords = sampleText(word);
      const color = PALETTE[colorIndex % PALETTE.length];
      colorIndex++;

      let i = 0;
      for (; i < coords.length; i++) {
        const c = coords[i];
        if (i < dots.length) {
          const d = dots[i];
          const base = d.base(now);
          d.retarget(c.x, c.y, now, { ...color }, base, base.color);
        } else {
          const spawn = edgeSpawn();
          dots.push(new Dot(spawn.x, spawn.y, c.x, c.y, now, { r: 20, g: 20, b: 22 }, { ...color }));
        }
      }
      // Excess dots from a shorter word: send them back out to the edges
      // instead of leaving them stranded at their old formed positions.
      for (; i < dots.length; i++) {
        const d = dots[i];
        const base = d.base(now);
        const out = edgeSpawn();
        d.retarget(out.x, out.y, now, { r: 8, g: 8, b: 10 }, base, base.color);
      }
      lastWordTime = now;
    }

    function resize() {
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      dots = [];
      nextWord(words[wordIndex]);
    }

    const onMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.inside = true;
    };
    const onLeave = () => {
      mouse.inside = false;
    };

    const onResize = rafDebounce(resize);
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mouseleave", onLeave);
    window.addEventListener("resize", onResize);
    resize();

    let raf = 0;
    const loop = (now: number) => {
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      ctx.shadowBlur = 6;
      ctx.shadowColor = "rgba(255,255,255,0.25)";

      for (const d of dots) {
        const { x, y, color } = d.base(now);
        let dx = x;
        let dy = y;
        if (mouse.inside) {
          const mdx = x - mouse.x;
          const mdy = y - mouse.y;
          const mdist = Math.hypot(mdx, mdy);
          const radius = 90;
          if (mdist < radius && mdist > 0.1) {
            const strength = (1 - mdist / radius) * 26;
            dx += (mdx / mdist) * strength;
            dy += (mdy / mdist) * strength;
          }
        }
        ctx.fillStyle = `rgba(${color.r | 0},${color.g | 0},${color.b | 0},0.9)`;
        ctx.fillRect(dx - d.size * 0.5, dy - d.size * 0.5, d.size, d.size);
      }

      ctx.globalCompositeOperation = "source-over";
      ctx.shadowBlur = 0;

      if (now - lastWordTime > WORD_INTERVAL) {
        wordIndex = (wordIndex + 1) % words.length;
        nextWord(words[wordIndex]);
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // Perf only: stop animating while scrolled far away, resume on return.
    const io = new IntersectionObserver(
      ([entry]) => {
        cancelAnimationFrame(raf);
        if (entry.isIntersecting) raf = requestAnimationFrame(loop);
      },
      { rootMargin: "200px" },
    );
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      onResize.cancel();
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion, words.join("|")]);

  if (reducedMotion) {
    return (
      <div className={className}>
        <h2 className="font-display text-4xl md:text-7xl font-bold leading-[0.95] tracking-tighter text-white">
          {words.join(" ")}
        </h2>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <span className="sr-only">{words.join(" ")}</span>
      <canvas ref={canvasRef} aria-hidden className="block w-full h-full" />
    </div>
  );
}
