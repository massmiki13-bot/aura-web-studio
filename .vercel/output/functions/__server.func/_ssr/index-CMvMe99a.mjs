import { j as jsxRuntimeExports, r as reactExports } from "../_libs/react.mjs";
import { N as Nav, C as Contact, F as Footer } from "./Contact-DRv9VHNb.mjs";
import { L as Link } from "../_libs/tanstack__react-router.mjs";
import "../_libs/i18next.mjs";
import "../_libs/sonner.mjs";
import { u as useTranslation } from "../_libs/react-i18next.mjs";
import { u as useScroll, a as useTransform, m as motion } from "../_libs/framer-motion.mjs";
import "./router-DFDAN8IL.mjs";
import "../_libs/tanstack__query-core.mjs";
import "../_libs/tanstack__react-query.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/use-sync-external-store.mjs";
import "./client-CS_abGrP.mjs";
import "../_libs/supabase__supabase-js.mjs";
import "../_libs/supabase__postgrest-js.mjs";
import "../_libs/supabase__realtime-js.mjs";
import "../_libs/supabase__phoenix.mjs";
import "../_libs/supabase__storage-js.mjs";
import "../_libs/iceberg-js.mjs";
import "../_libs/supabase__auth-js.mjs";
import "tslib";
import "../_libs/supabase__functions-js.mjs";
import "../_libs/lucide-react.mjs";
import "../_libs/motion-dom.mjs";
import "../_libs/motion-utils.mjs";
function ParticleHero() {
  const canvasRef = reactExports.useRef(null);
  const mouseRef = reactExports.useRef({ x: -9999, y: -9999, active: false });
  reactExports.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let visible = true;
    let last = 0;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let particles = [];
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
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    }
    function build() {
      const mobile = isMobile();
      const maxParticles = mobile ? 40 : 180;
      const divisor = mobile ? 16e3 : 9e3;
      const density = Math.min(maxParticles, Math.floor(width * height / divisor));
      particles = Array.from({ length: density }, () => {
        const x = Math.random() * width;
        const y = Math.random() * height;
        return {
          x,
          y,
          ox: x,
          oy: y,
          vx: 0,
          vy: 0,
          r: Math.random() * 1.6 + 0.4,
          c: palette[Math.floor(Math.random() * palette.length)]
        };
      });
    }
    function tick(now) {
      raf = requestAnimationFrame(tick);
      if (!visible) {
        last = now;
        return;
      }
      const mobile = isMobile();
      if (mobile) {
        if (now - last < 33) return;
        last = now;
      }
      ctx.clearRect(0, 0, width, height);
      const m = mouseRef.current;
      for (const p of particles) {
        if (!mobile) {
          const dx = m.x - p.x;
          const dy = m.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (m.active && dist < 160) {
            const force = (160 - dist) / 160;
            p.vx -= dx / dist * force * 0.8;
            p.vy -= dy / dist * force * 0.8;
          }
        }
        p.vx += (p.ox - p.x) * 0.012;
        p.vy += (p.oy - p.y) * 0.012;
        p.vx *= 0.86;
        p.vy *= 0.86;
        p.x += p.vx;
        p.y += p.vy;
        ctx.beginPath();
        ctx.fillStyle = p.c;
        ctx.globalAlpha = 0.85;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!mobile) {
        ctx.globalAlpha = 0.12;
        ctx.strokeStyle = "#7df9ff";
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const a = particles[i], b = particles[j];
            const dx = a.x - b.x, dy = a.y - b.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < 6400) {
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }
    }
    function onMove(e) {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    }
    function onLeave() {
      mouseRef.current.active = false;
    }
    resize();
    if (reduceMotion) {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        ctx.beginPath();
        ctx.fillStyle = p.c;
        ctx.globalAlpha = 0.85;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      window.addEventListener("resize", resize);
      return () => window.removeEventListener("resize", resize);
    }
    const io = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0 }
    );
    io.observe(canvas);
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("canvas", { ref: canvasRef, className: "absolute inset-0 h-full w-full", style: { willChange: "transform" } });
}
function Hero() {
  const { t } = useTranslation();
  const ref = reactExports.useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);
  const opacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.4, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { id: "hero", ref, className: "relative h-screen w-full overflow-hidden bg-black", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        style: { scale, opacity, willChange: "transform, opacity", translateZ: 0 },
        className: "absolute inset-0",
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(ParticleHero, {})
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black pointer-events-none" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        style: { y: textY, opacity, willChange: "transform, opacity" },
        className: "relative z-10 h-full w-full flex flex-col items-center justify-center px-6 text-center",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.p,
            {
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.1, duration: 0.6 },
              className: "font-mono-spec text-[10px] sm:text-xs uppercase tracking-[0.4em] text-primary mb-8",
              children: t("hero.badge")
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.h1,
            {
              initial: { opacity: 0, y: 40 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] },
              className: "font-display text-5xl sm:text-7xl md:text-[8rem] font-bold leading-[0.9] tracking-tighter text-white max-w-6xl",
              children: [
                "Aura Web",
                /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient-aura italic block", children: "Studio" })
              ]
            }
          )
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      motion.div,
      {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { delay: 0.8, duration: 0.8 },
        className: "absolute bottom-10 left-0 right-0 flex flex-col items-center gap-3 z-10",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono-spec text-[10px] uppercase tracking-[0.3em] text-white/40", children: t("hero.scroll") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.div,
            {
              animate: { y: [0, 8, 0] },
              transition: { duration: 2, repeat: Infinity, ease: "easeInOut" },
              className: "h-10 w-px bg-gradient-to-b from-primary to-transparent"
            }
          )
        ]
      }
    )
  ] });
}
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
    image: "/projects/la_cave.png"
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
    image: "/projects/triclinium.png"
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
    image: "/projects/enoteca_da_aldo.png"
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
    image: "/projects/piccola_italia.png"
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
    image: "/projects/snail&saloon.png"
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
    image: "/projects/bebeauty_saloon.png"
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
    image: "/projects/markz3d.png"
  }
];
function Projects() {
  const { t } = useTranslation();
  const ref = reactExports.useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${(projects.length - 1) * 100}vw`]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "section",
    {
      id: "projects",
      ref,
      className: "relative bg-black hidden md:block",
      style: { height: `${projects.length * 100}vh` },
      children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "sticky top-0 h-screen w-screen overflow-hidden", style: { willChange: "transform", transform: "translateZ(0)" }, children: /* @__PURE__ */ jsxRuntimeExports.jsx(motion.div, { style: { x, willChange: "transform" }, className: "flex h-full", children: projects.map((p, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "div",
        {
          className: "relative h-screen w-screen shrink-0 flex items-center",
          style: { background: p.bg },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 noise-bg opacity-30" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative z-10 px-10 md:px-24 w-full grid grid-cols-12 gap-8 items-center", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-7 space-y-6", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4 font-mono-spec text-xs uppercase tracking-[0.3em] text-white/50", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: p.accent }, children: [
                    "● ",
                    p.n
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: p.tag })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "h2",
                  {
                    onClick: () => window.open(p.domain, "_blank"),
                    className: "font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] tracking-tighter text-white cursor-pointer hover:opacity-80 transition-opacity",
                    children: p.name
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "max-w-lg text-white/70 text-base md:text-lg", children: t(`projects.items.${p.n}`, p.desc) }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-2 pt-4", children: p.stack.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "glass px-3 py-1.5 rounded-full font-mono-spec text-[10px] uppercase tracking-widest text-white/80",
                    children: s
                  },
                  s
                )) })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "col-span-5 relative w-full h-[40vh] hidden md:block", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                Link,
                {
                  className: "absolute inset-0 rounded-2xl glass overflow-hidden cursor-pointer hover:opacity-90 transition-opacity",
                  to: p.domain,
                  target: "_blank",
                  style: { boxShadow: `0 30px 80px -20px ${p.accent}` },
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("img", { src: p.image, alt: p.name, className: "w-full h-full object-cover" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "div",
                      {
                        className: "absolute inset-0 opacity-40",
                        style: {
                          background: `radial-gradient(circle at 50% 50%, ${p.accent} 0%, transparent 70%)`
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-6 left-6 right-6 flex justify-between items-end font-mono-spec text-[10px] uppercase tracking-widest text-white/60", children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                        "case_study/",
                        p.n
                      ] }),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("projects.live") })
                    ] })
                  ]
                }
              ) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-8 left-10 right-10 flex justify-between items-center font-mono-spec text-[10px] uppercase tracking-[0.3em] text-white/30", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                t("projects.project"),
                " ",
                i + 1,
                " / ",
                projects.length
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: t("projects.caseStudies") })
            ] })
          ]
        },
        p.n
      )) }) })
    }
  );
}
function ProjectsMobile() {
  const { t } = useTranslation();
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "md:hidden bg-black py-24 space-y-8 overflow-x-hidden", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "px-6 space-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono-spec text-[10px] uppercase tracking-[0.3em] text-primary", children: t("projects.selectedWork") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "font-display text-4xl font-bold tracking-tighter text-white", children: t("projects.mobileTitle") })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto snap-x snap-mandatory scrollbar-hide", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-5 px-6 pb-4 w-max", children: projects.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        onClick: () => window.open(p.domain, "_blank"),
        className: "snap-center shrink-0 w-[80vw] h-[70vh] rounded-2xl p-6 flex flex-col justify-between cursor-pointer hover:opacity-80 transition-opacity",
        style: { background: p.bg },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between font-mono-spec text-[10px] uppercase tracking-widest text-white/60", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { style: { color: p.accent }, children: [
              "● ",
              p.n
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: p.tag })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-display text-3xl font-bold tracking-tight text-white mb-3", children: p.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/60 text-sm", children: t(`projects.items.${p.n}`, p.desc) })
          ] })
        ]
      },
      p.n
    )) }) })
  ] });
}
function Team() {
  const { t } = useTranslation();
  const morphFrames = [
    { label: t("product.frames.landing"), accent: "oklch(0.85 0.18 200)" },
    { label: t("product.frames.showcase"), accent: "oklch(0.78 0.22 280)" },
    { label: t("product.frames.shop"), accent: "oklch(0.82 0.2 340)" },
    { label: t("product.frames.webapp"), accent: "oklch(0.85 0.18 150)" }
  ];
  const ref = reactExports.useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgX = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "section",
    {
      id: "team",
      ref,
      className: "relative bg-black pt-32 pb-4 md:pt-48 md:pb-16 overflow-hidden",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          motion.div,
          {
            style: { x: bgX, willChange: "transform" },
            className: "absolute top-1/2 -translate-y-1/2 left-0 whitespace-nowrap font-display text-[18vw] font-bold tracking-tighter text-white/[0.04] pointer-events-none select-none",
            children: "ECOSYSTEM · ECOSYSTEM · ECOSYSTEM ·"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative px-6 md:px-16 max-w-7xl mx-auto", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.p,
            {
              initial: { opacity: 0, y: 15 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, margin: "-60px" },
              transition: { duration: 0.6 },
              className: "font-mono-spec text-[10px] uppercase tracking-[0.3em] text-primary mb-6",
              children: t("product.label")
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            motion.h2,
            {
              initial: { opacity: 0, y: 30 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, margin: "-60px" },
              transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
              className: "font-display text-4xl md:text-7xl font-bold leading-[0.95] tracking-tighter text-white max-w-5xl",
              children: [
                t("product.headingPre"),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient-aura italic", children: t("product.headingHighlight") }),
                t("product.headingPost"),
                /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                t("product.headingLine2")
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            motion.p,
            {
              initial: { opacity: 0, y: 20 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, margin: "-60px" },
              transition: { duration: 0.7, delay: 0.15 },
              className: "mt-8 text-white/55 text-base md:text-lg max-w-2xl",
              children: t("product.paragraph")
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(MorphingScreen, { frames: morphFrames }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "section",
            {
              id: "pricing-cta",
              className: "relative pt-32 pb-24 md:pt-96 overflow-hidden flex flex-col justify-center px-6 md:px-16 mt-44",
              children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative max-w-5xl mx-auto w-full text-center flex flex-col items-center z-10", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.p,
                  {
                    initial: { opacity: 0, y: 15 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true, margin: "-60px" },
                    transition: { duration: 0.6 },
                    className: "font-mono-spec text-[10px] uppercase tracking-[0.3em] text-primary mb-6",
                    children: t("product.pricingLabel")
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  motion.h2,
                  {
                    initial: { opacity: 0, y: 30 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true, margin: "-60px" },
                    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
                    className: "font-display text-4xl md:text-7xl font-bold leading-[0.95] tracking-tighter text-white max-w-3xl",
                    children: [
                      t("product.pricingHeadingLine1"),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("br", {}),
                      t("product.pricingHeadingPre"),
                      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient-aura italic pr-3", children: t("product.pricingHeadingHighlight") })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.p,
                  {
                    initial: { opacity: 0, y: 20 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true, margin: "-60px" },
                    transition: { duration: 0.7, delay: 0.15 },
                    className: "mt-8 text-white/55 text-base md:text-lg max-w-2xl leading-relaxed font-light",
                    children: t("product.pricingParagraph")
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  motion.div,
                  {
                    initial: { opacity: 0, y: 20 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true, margin: "-60px" },
                    transition: { duration: 0.7, delay: 0.25 },
                    className: "mt-12 w-full max-w-xs",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(Link, { to: "/pricing", className: "block w-full cursor-pointer", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      "button",
                      {
                        type: "submit",
                        className: "w-full cursor-pointer hover:shadow-(--shadow-neon) transition-shadow duration-300 rounded-full py-4 px-6 font-mono-spec text-xs uppercase tracking-[0.3em] text-black text-center transition-opacity",
                        style: {
                          background: "var(--gradient-aura)",
                          boxShadow: ""
                        },
                        children: t("product.pricingCta")
                      }
                    ) })
                  }
                )
              ] })
            }
          )
        ] })
      ]
    }
  );
}
function MorphingScreen({ frames }) {
  const { t } = useTranslation();
  const wrap = reactExports.useRef(null);
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start end", "end start"] });
  const indexMV = useTransform(scrollYProgress, [0.1, 0.9], [0, frames.length - 1e-3]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: wrap, className: "mt-20 relative", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid md:grid-cols-2 gap-10 items-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "font-mono-spec text-[10px] uppercase tracking-[0.3em] text-primary", children: t("product.morphLabel") }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h3", { className: "font-display text-3xl md:text-4xl font-bold tracking-tight text-white", children: [
        t("product.morphTitlePre"),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-gradient-aura italic", children: t("product.morphTitleHighlight") }),
        "."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white/55", children: t("product.morphParagraph") }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-2 pt-2", children: frames.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "glass rounded-full px-3 py-1.5 font-mono-spec text-[10px] uppercase tracking-widest text-white/70",
          children: f.label
        },
        f.label
      )) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative aspect-[4/3] w-full glass rounded-3xl overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 noise-bg opacity-40 pointer-events-none" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute top-0 left-0 right-0 h-9 flex items-center gap-1.5 px-4 border-b border-white/10 bg-black/40 backdrop-blur z-20", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2.5 w-2.5 rounded-full bg-white/20" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2.5 w-2.5 rounded-full bg-white/20" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "h-2.5 w-2.5 rounded-full bg-white/20" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-3 font-mono-spec text-[10px] uppercase tracking-widest text-white/40", children: "aura.studio" })
      ] }),
      frames.map((f, i) => /* @__PURE__ */ jsxRuntimeExports.jsx(FrameLayer, { index: i, indexMV, frame: f, total: frames.length }, f.label))
    ] })
  ] }) });
}
function FrameLayer({
  index,
  indexMV,
  frame,
  total
}) {
  const opacity = useTransform(indexMV, (v) => {
    const clamped = Math.max(0, Math.min(total - 1e-3, v));
    const d = Math.abs(clamped - index);
    return Math.max(0, 1 - d * 1.4);
  });
  const y = useTransform(indexMV, (v) => {
    const clamped = Math.max(0, Math.min(total - 1e-3, v));
    return (clamped - index) * 30;
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    motion.div,
    {
      style: { opacity, y, willChange: "transform, opacity" },
      className: "absolute inset-0 pt-9 px-6 pb-6 flex flex-col gap-3",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-20 rounded-full", style: { background: frame.accent } }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-3 w-32 rounded-full bg-white/30" })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-1.5", children: Array.from({ length: 3 }).map((_, j) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-8 rounded-full bg-white/15" }, j)) })
        ] }),
        index === 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 grid place-items-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-center space-y-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-48 mx-auto rounded-full bg-white/40" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-32 mx-auto rounded-full bg-white/15" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: "mt-3 inline-block h-6 w-24 rounded-full",
              style: { background: frame.accent }
            }
          )
        ] }) }),
        index === 1 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 grid grid-cols-3 gap-2", children: Array.from({ length: 6 }).map((_, j) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-lg bg-white/10 border border-white/10" }, j)) }),
        index === 2 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 grid grid-cols-3 gap-2", children: Array.from({ length: 6 }).map((_, j) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "rounded-lg bg-white/5 border border-white/10 p-2 flex flex-col justify-between",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "aspect-square rounded-md",
                  style: { background: frame.accent, opacity: 0.4 }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-1", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-10 rounded bg-white/40" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 w-6 rounded", style: { background: frame.accent } })
              ] })
            ]
          },
          j
        )) }),
        index === 3 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 flex gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-1/4 rounded-lg bg-white/10 border border-white/10 p-2 space-y-1.5", children: Array.from({ length: 5 }).map((_, j) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 rounded bg-white/15" }, j)) }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 grid grid-cols-2 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-white/5 border border-white/10 p-2 flex flex-col gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-16 rounded bg-white/30" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "flex-1 rounded",
                  style: { background: `linear-gradient(135deg, ${frame.accent}, transparent)` }
                }
              )
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-lg bg-white/5 border border-white/10 p-2 space-y-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-2 w-12 rounded bg-white/30" }),
              Array.from({ length: 4 }).map((_, j) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1.5 rounded bg-white/15" }, j))
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "col-span-2 rounded-lg bg-white/5 border border-white/10 h-12 p-2 flex items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-6 w-6 rounded-full", style: { background: frame.accent } }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-1 h-1.5 rounded bg-white/15" })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between pt-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "span",
            {
              className: "font-mono-spec text-[10px] uppercase tracking-widest",
              style: { color: frame.accent },
              children: [
                "/ ",
                String(index + 1).padStart(2, "0"),
                " ",
                frame.label
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono-spec text-[10px] uppercase tracking-widest text-white/30", children: [
            index + 1,
            " / ",
            total
          ] })
        ] })
      ]
    }
  );
}
function Index() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "bg-black text-white", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Nav, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Hero, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Projects, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(ProjectsMobile, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Team, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Contact, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Footer, {})
  ] });
}
export {
  Index as component
};
