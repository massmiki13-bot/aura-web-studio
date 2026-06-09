import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { label: "Home", href: "#hero" },
  { label: "Lavori", href: "#projects" },
  { label: "Team", href: "#team" },
  { label: "Contatti", href: "#contact" },
];

export function Nav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-5 flex items-center justify-between max-w-[100vw] bg-black/40 backdrop-blur-md" style={{ willChange: "transform" }}>
        <a href="#hero" className="font-display text-lg font-bold tracking-tight text-white">
          AURA<span className="text-primary">.</span>
        </a>
        <nav className="hidden md:flex gap-10 font-mono-spec text-xs uppercase tracking-[0.2em] text-white">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="story-link hover:text-primary transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <button
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden relative w-10 h-10 flex flex-col items-center justify-center gap-1.5"
          style={{ willChange: "transform" }}
        >
          <motion.span
            animate={open ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
            className="block h-px w-6 bg-white origin-center"
          />
          <motion.span
            animate={open ? { rotate: -45, y: -4 } : { rotate: 0, y: 0 }}
            className="block h-px w-6 bg-white origin-center"
          />
        </button>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center"
          >
            <div className="absolute inset-0 noise-bg opacity-40" />
            <nav className="relative flex flex-col items-center gap-8">
              {links.map((l, i) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ y: 60, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 30, opacity: 0 }}
                  transition={{ delay: 0.1 + i * 0.07, ease: [0.22, 1, 0.36, 1], duration: 0.7 }}
                  className="font-display text-5xl sm:text-6xl font-bold tracking-tight text-white hover:text-gradient-aura hover:text-transparent bg-clip-text"
                  style={{ backgroundImage: "var(--gradient-aura)" }}
                >
                  {l.label}
                </motion.a>
              ))}
            </nav>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute bottom-10 left-0 right-0 text-center font-mono-spec text-xs uppercase tracking-[0.3em] text-white/40"
            >
              Aura Web Studio — 2026
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
