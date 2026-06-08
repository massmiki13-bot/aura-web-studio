import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const capabilities = [
  { t: "Advanced Animations", d: "GSAP, Motion, WebGL shaders. Ogni interazione cinematica e a 60fps.", k: "01" },
  { t: "Tailored UI/UX", d: "Sistemi di design su misura. Componenti chirurgici, micro-interazioni emotive.", k: "02" },
  { t: "Dynamic Smooth-Scroll", d: "Lenis + scroll triggers fisici. Viewport ecosystems da 100vh.", k: "03" },
  { t: "Multi-language Frameworks", d: "i18n nativo, edge-rendered, SEO localizzato per ogni mercato.", k: "04" },
];

export function Team() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgX = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);

  return (
    <section id="team" ref={ref} className="relative bg-black py-32 md:py-48 overflow-hidden">
      <motion.div
        style={{ x: bgX }}
        className="absolute top-1/2 -translate-y-1/2 left-0 whitespace-nowrap font-display text-[18vw] font-bold tracking-tighter text-white/[0.04] pointer-events-none select-none"
      >
        ECOSYSTEM · ECOSYSTEM · ECOSYSTEM ·
      </motion.div>

      <div className="relative px-6 md:px-16 max-w-7xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-mono-spec text-[10px] uppercase tracking-[0.3em] text-primary mb-6"
        >
          // 03 — The Trio
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-4xl md:text-7xl font-bold leading-[0.95] tracking-tighter text-white max-w-5xl"
        >
          Tre menti, <span className="text-gradient-aura italic">un unico</span> ecosistema digitale.
        </motion.h2>

        <div className="mt-24 grid md:grid-cols-2 gap-6">
          {capabilities.map((c, i) => (
            <motion.div
              key={c.k}
              initial={{ opacity: 0, rotateX: -25, y: 60 }}
              whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformPerspective: 1200 }}
              className="group glass rounded-2xl p-8 md:p-10 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-start justify-between mb-8">
                <span className="font-mono-spec text-xs uppercase tracking-widest text-white/40">/ {c.k}</span>
                <div className="h-10 w-10 rounded-full border border-white/15 flex items-center justify-center group-hover:border-primary group-hover:glow-cyan transition-all">
                  <span className="text-white/60 group-hover:text-primary">→</span>
                </div>
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-white mb-3">{c.t}</h3>
              <p className="text-white/60 leading-relaxed">{c.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}