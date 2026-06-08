import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const projects = [
  {
    n: "01",
    name: "La Cave Shisha Lounge",
    tag: "Hospitality / Lounge",
    desc: "Ambient purple glow, glassmorphic overlays e 3D smoke trails reattivi allo scroll.",
    stack: ["Vite", "React", "Framer"],
    bg: "radial-gradient(ellipse at 30% 30%, oklch(0.35 0.2 305) 0%, #050108 60%)",
    accent: "oklch(0.7 0.25 305)",
  },
  {
    n: "02",
    name: "Triclinium Cotoletteria",
    tag: "Restaurant / Street Pop",
    desc: "Street-pop yellow con asset di posate cinetiche e burst di particelle interattivi.",
    stack: ["Vite", "Tailwind", "Framer"],
    bg: "radial-gradient(ellipse at 70% 40%, oklch(0.85 0.2 95) 0%, #0a0700 70%)",
    accent: "oklch(0.92 0.2 95)",
  },
  {
    n: "03",
    name: "Enoteca da Aldo",
    tag: "Wine / Luxury",
    desc: "Dark-slate luxury con parallax tiles e menù in frosted glass premium.",
    stack: ["React", "Tailwind", "Framer"],
    bg: "radial-gradient(ellipse at 50% 60%, oklch(0.25 0.04 250) 0%, #02040a 70%)",
    accent: "oklch(0.9 0.05 250)",
  },
  {
    n: "04",
    name: "Piccola Italia",
    tag: "Trattoria / Editorial",
    desc: "Editoriale tipografico, transizioni cinematiche e identità visiva su misura.",
    stack: ["Vite", "React", "Framer"],
    bg: "radial-gradient(ellipse at 20% 70%, oklch(0.45 0.22 25) 0%, #080203 70%)",
    accent: "oklch(0.78 0.2 25)",
  },
  {
    n: "05",
    name: "Atelier Nova",
    tag: "Fashion / E-commerce",
    desc: "Placeholder — shop premium con quick-view animato, cart drawer fluido e lookbook scroll.",
    stack: ["Vite", "React", "Framer"],
    bg: "radial-gradient(ellipse at 60% 30%, oklch(0.4 0.18 340) 0%, #060106 65%)",
    accent: "oklch(0.82 0.2 340)",
  },
  {
    n: "06",
    name: "Orbit Studio",
    tag: "SaaS / Landing",
    desc: "Placeholder — landing prodotto con hero 3D, pricing interattivo e onboarding animato.",
    stack: ["Vite", "React", "Framer"],
    bg: "radial-gradient(ellipse at 40% 50%, oklch(0.38 0.15 180) 0%, #00060a 70%)",
    accent: "oklch(0.85 0.18 180)",
  },
  {
    n: "07",
    name: "Verde Botanica",
    tag: "Wellness / Brand",
    desc: "Placeholder — sito brand con palette organica, storytelling verticale e prenotazioni live.",
    stack: ["Vite", "React", "Framer"],
    bg: "radial-gradient(ellipse at 30% 60%, oklch(0.4 0.16 150) 0%, #02070a 70%)",
    accent: "oklch(0.85 0.18 150)",
  },
];

export function Projects() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  // shift across (n-1) panels
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${(projects.length - 1) * 100}vw`]);

  return (
    <section
      id="projects"
      ref={ref}
      className="relative bg-black hidden lg:block overflow-hidden"
      style={{ height: `${projects.length * 100}vh` }}
    >
      <div className="sticky top-0 h-screen w-screen overflow-hidden">
        <motion.div style={{ x }} className="flex h-full" >
          {projects.map((p, i) => (
            <div
              key={p.n}
              className="relative h-screen w-screen flex-shrink-0 flex items-center"
              style={{ background: p.bg }}
            >
              <div className="absolute inset-0 noise-bg opacity-30" />
              <div className="relative z-10 px-10 md:px-24 w-full grid grid-cols-12 gap-8 items-center">
                <div className="col-span-7 space-y-6">
                  <div className="flex items-center gap-4 font-mono-spec text-xs uppercase tracking-[0.3em] text-white/50">
                    <span style={{ color: p.accent }}>● {p.n}</span>
                    <span>{p.tag}</span>
                  </div>
                  <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tighter text-white">
                    {p.name}
                  </h2>
                  <p className="max-w-lg text-white/70 text-base md:text-lg">{p.desc}</p>
                  <div className="flex gap-2 pt-4">
                    {p.stack.map((s) => (
                      <span key={s} className="glass px-3 py-1.5 rounded-full font-mono-spec text-[10px] uppercase tracking-widest text-white/80">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="col-span-5 relative h-[60vh] hidden md:block">
                  <div
                    className="absolute inset-0 rounded-2xl glass overflow-hidden"
                    style={{ boxShadow: `0 30px 80px -20px ${p.accent}` }}
                  >
                    <div
                      className="absolute inset-0 opacity-60"
                      style={{ background: `radial-gradient(circle at 50% 50%, ${p.accent} 0%, transparent 70%)` }}
                    />
                    <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end font-mono-spec text-[10px] uppercase tracking-widest text-white/60">
                      <span>case_study/{p.n}</span>
                      <span>live →</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute bottom-8 left-10 right-10 flex justify-between items-center font-mono-spec text-[10px] uppercase tracking-[0.3em] text-white/30">
                <span>Project {i + 1} / {projects.length}</span>
                <span>Aura — Case Studies</span>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export function ProjectsMobile() {
  return (
    <section id="projects-mobile" className="lg:hidden bg-black px-6 sm:px-10 py-24 space-y-10 overflow-hidden">
      <div className="space-y-3 max-w-3xl">
        <p className="font-mono-spec text-[10px] uppercase tracking-[0.3em] text-primary">// 02 — Selected Work</p>
        <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tighter text-white">
          Case studies <span className="text-gradient-aura italic">cinematici.</span>
        </h2>
        <p className="text-white/50 text-sm sm:text-base max-w-xl">
          Una selezione di progetti reali e concept. Ogni layout è ricostruito da zero per il brand.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {projects.map((p, i) => (
          <motion.div
            key={p.n}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: (i % 2) * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-2xl p-6 aspect-[4/5] flex flex-col justify-between overflow-hidden border border-white/10"
            style={{ background: p.bg }}
          >
            <div className="absolute inset-0 noise-bg opacity-30 pointer-events-none" />
            <div className="relative flex justify-between font-mono-spec text-[10px] uppercase tracking-widest text-white/60">
              <span style={{ color: p.accent }}>● {p.n}</span>
              <span className="truncate ml-2">{p.tag}</span>
            </div>
            <div className="relative">
              <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">{p.name}</h3>
              <p className="text-white/60 text-sm line-clamp-3">{p.desc}</p>
              <div className="flex flex-wrap gap-1.5 pt-3">
                {p.stack.map((s) => (
                  <span key={s} className="glass px-2 py-1 rounded-full font-mono-spec text-[9px] uppercase tracking-widest text-white/70">{s}</span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}