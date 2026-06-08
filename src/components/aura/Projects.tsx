import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const projects = [
  {
    n: "01",
    name: "La Cave Shisha Lounge",
    tag: "Hospitality / Lounge",
    desc: "Ambient purple glow, glassmorphic overlays e 3D smoke trails reattivi allo scroll.",
    stack: ["React", "WebGL", "GSAP"],
    bg: "radial-gradient(ellipse at 30% 30%, oklch(0.35 0.2 305) 0%, #050108 60%)",
    accent: "oklch(0.7 0.25 305)",
  },
  {
    n: "02",
    name: "Triclinium Cotoletteria",
    tag: "Restaurant / Street Pop",
    desc: "Street-pop yellow con asset di posate cinetiche e burst di particelle interattivi.",
    stack: ["Next.js", "Lenis", "Framer"],
    bg: "radial-gradient(ellipse at 70% 40%, oklch(0.85 0.2 95) 0%, #0a0700 70%)",
    accent: "oklch(0.92 0.2 95)",
  },
  {
    n: "03",
    name: "Enoteca da Aldo",
    tag: "Wine / Luxury",
    desc: "Dark-slate luxury con parallax tiles e menù in frosted glass premium.",
    stack: ["Astro", "Three.js", "Tailwind"],
    bg: "radial-gradient(ellipse at 50% 60%, oklch(0.25 0.04 250) 0%, #02040a 70%)",
    accent: "oklch(0.9 0.05 250)",
  },
  {
    n: "04",
    name: "Piccola Italia",
    tag: "Trattoria / Editorial",
    desc: "Editoriale tipografico, transizioni cinematiche e identità visiva su misura.",
    stack: ["SvelteKit", "GSAP", "Sanity"],
    bg: "radial-gradient(ellipse at 20% 70%, oklch(0.45 0.22 25) 0%, #080203 70%)",
    accent: "oklch(0.78 0.2 25)",
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
      className="relative bg-black hidden md:block"
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
    <section className="md:hidden bg-black px-6 py-24 space-y-8">
      <div className="space-y-3">
        <p className="font-mono-spec text-[10px] uppercase tracking-[0.3em] text-primary">// Selected Work</p>
        <h2 className="font-display text-4xl font-bold tracking-tighter text-white">Case studies cinematici.</h2>
      </div>
      <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory -mx-6 px-6 pb-4 scrollbar-hide">
        {projects.map((p) => (
          <div
            key={p.n}
            className="snap-center flex-shrink-0 w-[80vw] h-[70vh] rounded-2xl p-6 flex flex-col justify-between"
            style={{ background: p.bg }}
          >
            <div className="flex justify-between font-mono-spec text-[10px] uppercase tracking-widest text-white/60">
              <span style={{ color: p.accent }}>● {p.n}</span>
              <span>{p.tag}</span>
            </div>
            <div>
              <h3 className="font-display text-3xl font-bold tracking-tight text-white mb-3">{p.name}</h3>
              <p className="text-white/60 text-sm">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}