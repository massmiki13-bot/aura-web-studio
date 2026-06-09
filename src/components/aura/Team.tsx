import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";

const capabilities = [
  {
    t: "Landing Page",
    d: "Da zero, su misura del brand. Hero cinematici, micro-interazioni e copy che converte.",
    k: "01",
  },
  {
    t: "Siti Vetrina & Brand",
    d: "Identità digitale completa, multi-pagina, ottimizzata per SEO e velocità.",
    k: "02",
  },
  {
    t: "E-commerce & Shop",
    d: "Cataloghi, carrello, pagamenti e gestione ordini integrati. Da boutique a marketplace.",
    k: "03",
  },
  {
    t: "Web App Custom",
    d: "Booking, dashboard, gestionali. Funzionalità su misura, niente template.",
    k: "04",
  },
];

const morphFrames = [
  { label: "Landing", accent: "oklch(0.85 0.18 200)" },
  { label: "Vetrina", accent: "oklch(0.78 0.22 280)" },
  { label: "Shop", accent: "oklch(0.82 0.2 340)" },
  { label: "Web App", accent: "oklch(0.85 0.18 150)" },
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
          Costruiamo siti <span className="text-gradient-aura italic">su misura</span>.<br />
          Dalla landing allo shop.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-8 text-white/55 text-base md:text-lg max-w-2xl"
        >
          Niente template. Niente compromessi. Ogni progetto nasce dalle tue esigenze: landing che
          converte, vetrine eleganti, e-commerce performanti o web app custom — sempre con la stessa
          cura cinematica.
        </motion.p>

        <MorphingScreen frames={morphFrames} />

        <div className="mt-24 grid md:grid-cols-2 gap-6 select-none">
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
                <span className="font-mono-spec text-xs uppercase tracking-widest text-white/40">
                  / {c.k}
                </span>
              </div>
              <h3 className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-white mb-3">
                {c.t}
              </h3>
              <p className="text-white/60 leading-relaxed">{c.d}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function MorphingScreen({ frames }: { frames: { label: string; accent: string }[] }) {
  const wrap = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start end", "end start"] });
  // Map scroll progress to active frame index
  const indexMV = useTransform(scrollYProgress, [0.1, 0.9], [0, frames.length - 0.001]);

  return (
    <div ref={wrap} className="mt-20 relative">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-4">
          <p className="font-mono-spec text-[10px] uppercase tracking-[0.3em] text-primary">
            // scroll = morph
          </p>
          <h3 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-white">
            Una sola filosofia, <span className="text-gradient-aura italic">infinite forme</span>.
          </h3>
          <p className="text-white/55">
            Scrolla e guarda come la stessa interfaccia diventa landing, vetrina, shop o web app. È
            così che lavoriamo: una base solida, modellata su di te.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {frames.map((f) => (
              <span
                key={f.label}
                className="glass rounded-full px-3 py-1.5 font-mono-spec text-[10px] uppercase tracking-widest text-white/70"
              >
                {f.label}
              </span>
            ))}
          </div>
        </div>

        <div className="relative aspect-[4/3] w-full glass rounded-3xl overflow-hidden">
          <div className="absolute inset-0 noise-bg opacity-40 pointer-events-none" />
          {/* browser chrome */}
          <div className="absolute top-0 left-0 right-0 h-9 flex items-center gap-1.5 px-4 border-b border-white/10 bg-black/40 backdrop-blur z-20">
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="ml-3 font-mono-spec text-[10px] uppercase tracking-widest text-white/40">
              aura.studio
            </span>
          </div>

          {frames.map((f, i) => (
            <FrameLayer key={f.label} index={i} indexMV={indexMV} frame={f} total={frames.length} />
          ))}
        </div>
      </div>
    </div>
  );
}

function FrameLayer({
  index,
  indexMV,
  frame,
  total,
}: {
  index: number;
  indexMV: MotionValue<number>;
  frame: { label: string; accent: string };
  total: number;
}) {
  // opacity peaks at index, fades out before next
  const opacity = useTransform<number, number>(indexMV, (v) => {
    const d = Math.abs(v - index);
    return Math.max(0, 1 - d * 1.4);
  });
  const y = useTransform<number, number>(indexMV, (v) => (v - index) * 30);

  return (
    <motion.div
      style={{ opacity, y }}
      className="absolute inset-0 pt-9 px-6 pb-6 flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <div className="h-2 w-20 rounded-full" style={{ background: frame.accent }} />
          <div className="h-3 w-32 rounded-full bg-white/30" />
        </div>
        <div className="flex gap-1.5">
          {Array.from({ length: 3 }).map((_, j) => (
            <div key={j} className="h-2 w-8 rounded-full bg-white/15" />
          ))}
        </div>
      </div>
      {/* unique layout per frame */}
      {index === 0 && (
        <div className="flex-1 grid place-items-center">
          <div className="text-center space-y-2">
            <div className="h-4 w-48 mx-auto rounded-full bg-white/40" />
            <div className="h-2 w-32 mx-auto rounded-full bg-white/15" />
            <div
              className="mt-3 inline-block h-6 w-24 rounded-full"
              style={{ background: frame.accent }}
            />
          </div>
        </div>
      )}
      {index === 1 && (
        <div className="flex-1 grid grid-cols-3 gap-2">
          {Array.from({ length: 6 }).map((_, j) => (
            <div key={j} className="rounded-lg bg-white/10 border border-white/10" />
          ))}
        </div>
      )}
      {index === 2 && (
        <div className="flex-1 grid grid-cols-3 gap-2">
          {Array.from({ length: 6 }).map((_, j) => (
            <div
              key={j}
              className="rounded-lg bg-white/5 border border-white/10 p-2 flex flex-col justify-between"
            >
              <div
                className="aspect-square rounded-md"
                style={{ background: frame.accent, opacity: 0.4 }}
              />
              <div className="space-y-1">
                <div className="h-1.5 w-10 rounded bg-white/40" />
                <div className="h-1.5 w-6 rounded" style={{ background: frame.accent }} />
              </div>
            </div>
          ))}
        </div>
      )}
      {index === 3 && (
        <div className="flex-1 flex gap-2">
          <div className="w-1/4 rounded-lg bg-white/10 border border-white/10 p-2 space-y-1.5">
            {Array.from({ length: 5 }).map((_, j) => (
              <div key={j} className="h-2 rounded bg-white/15" />
            ))}
          </div>
          <div className="flex-1 grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-white/5 border border-white/10 p-2 flex flex-col gap-1.5">
              <div className="h-2 w-16 rounded bg-white/30" />
              <div
                className="flex-1 rounded"
                style={{ background: `linear-gradient(135deg, ${frame.accent}, transparent)` }}
              />
            </div>
            <div className="rounded-lg bg-white/5 border border-white/10 p-2 space-y-1.5">
              <div className="h-2 w-12 rounded bg-white/30" />
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="h-1.5 rounded bg-white/15" />
              ))}
            </div>
            <div className="col-span-2 rounded-lg bg-white/5 border border-white/10 h-12 p-2 flex items-center gap-2">
              <div className="h-6 w-6 rounded-full" style={{ background: frame.accent }} />
              <div className="flex-1 h-1.5 rounded bg-white/15" />
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between pt-1">
        <span
          className="font-mono-spec text-[10px] uppercase tracking-widest"
          style={{ color: frame.accent }}
        >
          / {String(index + 1).padStart(2, "0")} {frame.label}
        </span>
        <span className="font-mono-spec text-[10px] uppercase tracking-widest text-white/30">
          {index + 1} / {total}
        </span>
      </div>
    </motion.div>
  );
}
