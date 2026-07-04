import { useEffect, useRef } from "react";
import { rafDebounce } from "@/lib/utils";

/**
 * A field of soft drifting white dots that flicker in and out — used as a
 * subtle ambient texture behind page headers. Headless canvas, no colors
 * baked in beyond plain white (the site is monochrome already), and skips
 * entirely under prefers-reduced-motion.
 */
export function SparklesCanvas({ className = "", count = 220 }: { className?: string; count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    type P = { x: number; y: number; r: number; speed: number; alpha: number; alphaSpeed: number };
    let particles: P[] = [];

    const makeParticle = (): P => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 1.3 + 0.3,
      speed: Math.random() * 0.25 + 0.06,
      alpha: Math.random(),
      alphaSpeed: (Math.random() * 0.015 + 0.004) * (Math.random() > 0.5 ? 1 : -1),
    });

    function resize() {
      if (!canvas) return;
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    particles = Array.from({ length: count }, makeParticle);

    let raf = 0;
    let running = true;
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.y -= p.speed;
        if (p.y < 0) p.y = h;
        p.alpha += p.alphaSpeed;
        if (p.alpha <= 0 || p.alpha >= 1) p.alphaSpeed *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,255,255,${Math.max(0, Math.min(1, p.alpha))})`;
        ctx.fill();
      }
      if (running) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // Pure perf optimization: stop the rAF loop while scrolled far away, and
    // pick back up when it re-enters view. No visual difference once
    // visible — it's already animating by the time it can be seen.
    const io = new IntersectionObserver(
      ([entry]) => {
        running = entry.isIntersecting;
        if (running) raf = requestAnimationFrame(tick);
        else cancelAnimationFrame(raf);
      },
      { rootMargin: "200px" },
    );
    io.observe(canvas);

    const onResize = rafDebounce(resize);
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      onResize.cancel();
      window.removeEventListener("resize", onResize);
    };
  }, [count]);

  return <canvas ref={canvasRef} aria-hidden className={`block w-full h-full ${className}`} />;
}
