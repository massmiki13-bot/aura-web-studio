import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Globe, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { LANGUAGES, persistLanguage, type LanguageCode } from "@/i18n";
import { PlanRequestModal, type PlanRequestTarget } from "@/components/aura/PlanRequestModal";

// No specific plan behind this entry point (it's the header CTA, reachable
// from any page) — price/priceValue stay empty so the modal hides the
// price badge and the "customize budget" section, which only make sense
// relative to a plan chosen on the pricing page.
const GENERIC_QUOTE_REQUEST: PlanRequestTarget = {
  name: "Richiesta generale",
  price: "",
  priceValue: 0,
};

function LanguageSwitcher({ onSelect, dropUp = false }: { onSelect?: () => void; dropUp?: boolean }) {
  const { i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const current =
    LANGUAGES.find((l) => l.code === i18n.language) ??
    LANGUAGES.find((l) => i18n.language?.startsWith(l.code)) ??
    LANGUAGES[0];

  const choose = (code: LanguageCode) => {
    persistLanguage(code);
    setOpen(false);
    onSelect?.();
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 font-mono-spec text-xs uppercase tracking-[0.2em] text-white/80 hover:text-primary transition-colors cursor-pointer"
        aria-label="Change language"
      >
        <Globe className="h-3.5 w-3.5" />
        {current.short}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: dropUp ? 8 : -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: dropUp ? 8 : -8 }}
              transition={{ duration: 0.2 }}
              className={
                dropUp
                  ? "absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-50 min-w-40 glass rounded-2xl border border-white/10 p-2 backdrop-blur-xl"
                  : "absolute right-0 mt-3 z-50 min-w-40 glass rounded-2xl border border-white/10 p-2 backdrop-blur-xl"
              }
            >
              {LANGUAGES.map((l) => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => choose(l.code)}
                  className="w-full flex items-center justify-between gap-3 rounded-xl px-3 py-2 font-mono-spec text-[11px] uppercase tracking-widest text-white/70 hover:bg-white/5 hover:text-white transition-colors cursor-pointer"
                >
                  <span>{l.label}</span>
                  {current.code === l.code && <Check className="h-3 w-3 text-primary" />}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Nav() {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  // Portal target only exists once mounted on the client — see the portal
  // below for why the mobile overlay needs one at all.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const [quoteOpen, setQuoteOpen] = useState(false);

  // Slide the bar away while scrolling down, bring it back on any upward
  // scroll (and always near the top of the page). Direction is accumulated
  // rather than per-event so Lenis's tiny per-frame deltas — or a trackpad's
  // jittery ones — can't make the bar flicker.
  useEffect(() => {
    let last = window.scrollY;
    let acc = 0;
    const onScroll = () => {
      const y = Math.max(0, window.scrollY);
      const dy = y - last;
      last = y;
      if (dy === 0) return;
      if (dy > 0 !== acc > 0) acc = 0;
      acc += dy;
      if (y < 80) setHidden(false);
      else if (acc > 24) setHidden(true);
      else if (acc < -16) setHidden(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: t("nav.work"), href: "/#projects", type: "hash" as const },
    { label: t("nav.pricing", "Prezzi"), href: "/pricing", type: "route" as const },
    { label: t("nav.team"), href: "/team", type: "route" as const },
    { label: t("nav.contact"), href: "/contact", type: "route" as const },
  ];

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 px-6 md:px-10 py-5 flex items-center justify-between max-w-screen bg-black/40 backdrop-blur-md transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        }`}
        style={{ willChange: "transform" }}
      >
        <a href="/#hero" className="font-display text-lg font-bold tracking-tight text-white">
          AURA<span className="text-accent">.</span>
        </a>
        <nav className="hidden md:flex items-center gap-10 font-mono-spec text-xs uppercase tracking-[0.2em] text-white">
          {links.map((l) =>
            l.type === "route" ? (
              <Link
                key={l.href}
                to={l.href}
                className="story-link hover:text-primary transition-colors"
              >
                {l.label}
              </Link>
            ) : (
              <a
                key={l.href}
                href={l.href}
                className="story-link hover:text-primary transition-colors"
              >
                {l.label}
              </a>
            ),
          )}
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => setQuoteOpen(true)}
            className="inline-flex items-center rounded-full border border-white/15 px-5 py-2 text-[11px] uppercase tracking-widest text-white/80 hover:border-white/40 hover:text-white transition-colors cursor-pointer"
          >
            {t("nav.cta", "Richiedi preventivo")}
          </button>
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

      {/* Ported to <body>: this overlay is a sibling of <Hero/> under the same
          <main>, and Hero's GSAP ScrollTrigger pin wraps itself in a
          `.pin-spacer` div that React never sees. That silently invalidates
          React's record of <main>'s children, so this AnimatePresence's own
          insert (computed against the stale child list) targeted a node no
          longer actually there and threw insertBefore/NotFoundError, crashing
          the whole app — reproducible only on "/", the one route that pins
          anything. Rendering into <body> instead removes it from that shared,
          GSAP-touched reconciliation parent entirely. */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="fixed inset-0 z-40 bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center overflow-y-auto py-24"
              >
                <div className="absolute inset-0 noise-bg opacity-40 pointer-events-none" />
                <nav className="relative flex flex-col items-center gap-6 sm:gap-8 my-auto">
                  {links.map((l, i) => {
                    const cls =
                      "font-display text-5xl sm:text-6xl font-bold tracking-tight text-white hover:text-gradient-aura hover:text-transparent bg-clip-text";
                    const anim = {
                      initial: { y: 60, opacity: 0 },
                      animate: { y: 0, opacity: 1 },
                      exit: { y: 30, opacity: 0 },
                      transition: {
                        delay: 0.1 + i * 0.07,
                        ease: [0.22, 1, 0.36, 1] as const,
                        duration: 0.7,
                      },
                      style: { backgroundImage: "var(--gradient-aura)" },
                      className: cls,
                      onClick: () => setOpen(false),
                    };
                    return l.type === "route" ? (
                      <motion.div key={l.href} {...anim}>
                        <Link to={l.href} onClick={() => setOpen(false)} className={cls}>
                          {l.label}
                        </Link>
                      </motion.div>
                    ) : (
                      <motion.a key={l.href} href={l.href} {...anim}>
                        {l.label}
                      </motion.a>
                    );
                  })}
                  <div className="mt-10 flex justify-center">
                    <LanguageSwitcher dropUp onSelect={() => setOpen(false)} />
                  </div>
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
          </AnimatePresence>,
          document.body,
        )}

      <PlanRequestModal
        plan={quoteOpen ? GENERIC_QUOTE_REQUEST : null}
        onOpenChange={(next) => !next && setQuoteOpen(false)}
      />
    </>
  );
}
