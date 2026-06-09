import { useEffect, useRef } from "react";

export function ParticleHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;

    type P = { x: number; y: number; ox: number; oy: number; vx: number; vy: number; r: number; c: string };
    let particles: P[] = [];

    const palette = ["#7df9ff", "#b388ff", "#ffffff", "#67e8f9"];

    function isMobile() {
      return window.innerWidth < 768;
    }

    function resize() {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    }

    function build() {
      const mobile = isMobile();
      // Cap particles: 60 on mobile, up to 180 on desktop
      const maxParticles = mobile ? 60 : 180;
      const density = Math.min(maxParticles, Math.floor((width * height) / 9000));
      particles = Array.from({ length: density }, () => {
        const x = Math.random() * width;
        const y = Math.random() * height;
        return {
          x, y, ox: x, oy: y,
          vx: 0, vy: 0,
          r: Math.random() * 1.6 + 0.4,
          c: palette[Math.floor(Math.random() * palette.length)],
        };
      });
    }

    function tick() {
      ctx!.clearRect(0, 0, width, height);
      const m = mouseRef.current;
      const mobile = isMobile();

      for (const p of particles) {
        // Skip mouse interaction on mobile (touch events are unreliable for this)
        if (!mobile) {
          const dx = m.x - p.x;
          const dy = m.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (m.active && dist < 160) {
            const force = (160 - dist) / 160;
            p.vx -= (dx / dist) * force * 0.8;
            p.vy -= (dy / dist) * force * 0.8;
          }
        }
        // spring back
        p.vx += (p.ox - p.x) * 0.012;
        p.vy += (p.oy - p.y) * 0.012;
        p.vx *= 0.86;
        p.vy *= 0.86;
        p.x += p.vx;
        p.y += p.vy;

        ctx!.beginPath();
        ctx!.fillStyle = p.c;
        ctx!.globalAlpha = 0.85;
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fill();
      }

      // Skip connecting lines on mobile — O(n²) kills frame budget
      if (!mobile) {
        ctx!.globalAlpha = 0.12;
        ctx!.strokeStyle = "#7df9ff";
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const a = particles[i], b = particles[j];
            const dx = a.x - b.x, dy = a.y - b.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < 6400) {
              ctx!.beginPath();
              ctx!.moveTo(a.x, a.y);
              ctx!.lineTo(b.x, b.y);
              ctx!.stroke();
            }
          }
        }
      }

      raf = requestAnimationFrame(tick);
    }

    function onMove(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    }
    function onLeave() { mouseRef.current.active = false; }

    resize();
    tick();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" style={{ willChange: "transform" }} />;
}