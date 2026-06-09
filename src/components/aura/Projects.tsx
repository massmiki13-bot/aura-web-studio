import { Link } from "@tanstack/react-router";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const projects = [
  {
    n: "01",
    name: "La Cave Shisha Lounge",
    tag: "Nightlife / Luxury",
    desc: "Luxury shisha bar dark mode experience featuring glowing gold accents, glassmorphic overlays, and scroll-reactive 3D smoke trails.",
    stack: ["Vite", "React", "Framer"],
    domain: "https://la-cave-eosin.vercel.app",
    bg: "radial-gradient(ellipse at 30% 30%, oklch(0.35 0.2 305) 0%, #050108 60%)",
    accent: "oklch(0.7 0.25 305)",
    image: "/projects/la_cave.png",
  },
  {
    n: "02",
    name: "Triclinium Cotoletteria",
    tag: "Food / Street Food",
    desc: "Vibrant street-pop aesthetic driven by dynamic scroll effects, kinetic cutlery assets, and interactive particle bursts.",
    stack: ["Vite", "Tailwind", "Framer"],
    domain: "https://triclinium-cotoletteria.vercel.app",
    bg: "radial-gradient(ellipse at 70% 40%, oklch(0.85 0.2 95) 0%, #0a0700 70%)",
    accent: "oklch(0.92 0.2 95)",
    image: "/projects/triclinium.png",
  },
  {
    n: "03",
    name: "Enoteca da Aldo",
    tag: "Wine / Luxury",
    desc: "Dark-slate luxury layout enhanced by smooth parallax tiles and a premium frosted glass navigation menu.",
    stack: ["React", "Tailwind", "Framer"],
    domain: "https://aldo-s-glass-wine-bar.vercel.app",
    bg: "radial-gradient(ellipse at 50% 60%, oklch(0.25 0.04 250) 0%, #02040a 70%)",
    accent: "oklch(0.9 0.05 250)",
    image: "/projects/enoteca_da_aldo.png",
  },
  {
    n: "04",
    name: "Piccola Italia",
    tag: "Restaurant / Corporate",
    desc: "Italian-Indian fusion restaurant experience built on an editorial dark mode with premium gold accents and cinematic transitions.",
    stack: ["Vite", "React", "Framer"],
    domain: "https://namastepiccolaitalia.it",
    bg: "radial-gradient(ellipse at 20% 70%, oklch(0.45 0.22 25) 0%, #080203 70%)",
    accent: "oklch(0.78 0.2 25)",
    image: "/projects/piccola_italia.png",
  },
  {
    n: "05",
    name: "S.nail & Saloon - beauty studio",
    tag: "Fashion / Corporate",
    desc: "Elegant light mode beauty studio showcase with fluid animations, custom cosmetics branding, and micro-interactions.",
    stack: ["Vite", "React", "Framer"],
    domain: "https://s-nail-beauty-studio.vercel.app",
    bg: "radial-gradient(ellipse at 60% 30%, oklch(0.4 0.18 340) 0%, #060106 65%)",
    accent: "oklch(0.82 0.2 340)",
    image: "/projects/snail&saloon.png",
  },
  {
    n: "06",
    name: "Be Beauty - beauty centre",
    tag: "Fashion / Corporate",
    desc: "Sophisticated light mode wellness interface featuring refined layouts, fluid animations, and a seamless user-friendly booking flow.",
    stack: ["Vite", "React", "Framer"],
    domain: "https://be-beauty-wellness.vercel.app",
    bg: "radial-gradient(ellipse at 40% 50%, oklch(0.38 0.15 180) 0%, #00060a 70%)",
    accent: "oklch(0.85 0.18 180)",
    image: "/projects/bebeauty_saloon.png",
  },
  {
    n: "07",
    name: "Markz3D - 3D FiveM maps and scripts",
    tag: "Gaming / Portfolio",
    desc: "FiveM modding online shop and portfolio engineered with immersive dark and neon-blue tones, fluid animations, and interactive product grids.",
    stack: ["Vite", "React", "Framer"],
    domain: "https://www.markz3d.com",
    bg: "radial-gradient(ellipse at 30% 60%, oklch(0.4 0.16 150) 0%, #02070a 70%)",
    accent: "oklch(0.85 0.18 150)",
    image: "/projects/markz3d.png",
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
        <motion.div style={{ x }} className="flex h-full">
          {projects.map((p, i) => (
            <div
              key={p.n}
              className="relative h-screen w-screen shrink-0 flex items-center"
              style={{ background: p.bg }}
            >
              <div className="absolute inset-0 noise-bg opacity-30" />
              <div className="relative z-10 px-10 md:px-24 w-full grid grid-cols-12 gap-8 items-center">
                <div className="col-span-7 space-y-6">
                  <div className="flex items-center gap-4 font-mono-spec text-xs uppercase tracking-[0.3em] text-white/50">
                    <span style={{ color: p.accent }}>● {p.n}</span>
                    <span>{p.tag}</span>
                  </div>
                  <h2
                    onClick={() => window.open(p.domain, "_blank")}
                    className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tighter text-white cursor-pointer hover:opacity-80 transition-opacity"
                  >
                    {p.name}
                  </h2>
                  <p className="max-w-lg text-white/70 text-base md:text-lg">{p.desc}</p>
                  <div className="flex gap-2 pt-4">
                    {p.stack.map((s) => (
                      <span
                        key={s}
                        className="glass px-3 py-1.5 rounded-full font-mono-spec text-[10px] uppercase tracking-widest text-white/80"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="col-span-5 relative w-full h-[40vh] hidden md:block">
                  <Link
                    className="absolute inset-0 rounded-2xl glass overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                    to={p.domain}
                    target="_blank"
                    style={{ boxShadow: `0 30px 80px -20px ${p.accent}` }}
                  >
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    <div
                      className="absolute inset-0 opacity-40"
                      style={{
                        background: `radial-gradient(circle at 50% 50%, ${p.accent} 0%, transparent 70%)`,
                      }}
                    />
                    <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end font-mono-spec text-[10px] uppercase tracking-widest text-white/60">
                      <span>case_study/{p.n}</span>
                      <span>live →</span>
                    </div>
                  </Link>
                </div>
              </div>
              <div className="absolute bottom-8 left-10 right-10 flex justify-between items-center font-mono-spec text-[10px] uppercase tracking-[0.3em] text-white/30">
                <span>
                  Project {i + 1} / {projects.length}
                </span>
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
        <p className="font-mono-spec text-[10px] uppercase tracking-[0.3em] text-primary">
          // Selected Work
        </p>
        <h2 className="font-display text-4xl font-bold tracking-tighter text-white">
          Case studies cinematici.
        </h2>
      </div>
      <div className="flex gap-5 overflow-x-auto snap-x snap-mandatory -mx-6 px-6 pb-4 scrollbar-hide">
        {projects.map((p) => (
          <div
            key={p.n}
            onClick={() => window.open(p.domain, "_blank")}
            className="snap-center shrink-0 w-[80vw] h-[70vh] rounded-2xl p-6 flex flex-col justify-between cursor-pointer hover:opacity-80 transition-opacity"
            style={{ background: p.bg }}
          >
            <div className="flex justify-between font-mono-spec text-[10px] uppercase tracking-widest text-white/60">
              <span style={{ color: p.accent }}>● {p.n}</span>
              <span>{p.tag}</span>
            </div>
            <div>
              <h3 className="font-display text-3xl font-bold tracking-tight text-white mb-3">
                {p.name}
              </h3>
              <p className="text-white/60 text-sm">{p.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
