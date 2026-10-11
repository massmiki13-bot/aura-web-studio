"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, Minus, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";

import { ScrollTrigger } from "@/lib/gsap";
import { Nav } from "@/components/aura/Nav";
import { Footer } from "@/components/aura/Contact";
import { AppsStage } from "@/components/aura/AppsStage";
import { AppOrbit } from "@/components/three/AppOrbit";
import { AgentCore } from "@/components/three/AgentCore";
import { localizedPath, type Locale } from "@/lib/seo";
import { tList } from "@/lib/utils";

type Process = { title: string; desc: string };
type Point = { title: string; desc: string };
type BuildItem = { title: string; desc: string };

const EASE = [0.22, 1, 0.36, 1] as const;

/** Read outside the component: a clock read inside one looks like an impure
 *  call during render to the lint rule, even from an event handler. */
function nowMs() {
  return performance.now();
}

/** One reveal, used everywhere on this page so the rhythm stays the same. */
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** A section's opening mark: the mono label and the display heading. */
function SectionHead({
  label,
  title,
  className = "mb-16 md:mb-24",
}: {
  label: string;
  title: React.ReactNode;
  className?: string;
}) {
  return (
    <Reveal className={className}>
      <p className="font-mono-spec mb-7 text-[11px] tracking-[0.4em] text-white/35 uppercase">
        {label}
      </p>
      <h2 className="font-display max-w-3xl text-3xl leading-[1.02] font-bold tracking-tighter text-balance text-white sm:text-4xl lg:text-5xl xl:text-6xl">
        {title}
      </h2>
    </Reveal>
  );
}

/**
 * The process, as rows that open.
 *
 * Four paragraphs stacked is something a visitor scans and forgets. Opening
 * the body on demand lets the four titles read as a sequence first — which is
 * the actual argument — and keeps the detail for whoever wants it. One row
 * open at a time, so the section never becomes a wall again.
 */
function ProcessSteps({ steps }: { steps: Process[] }) {
  const [open, setOpen] = useState(0);

  return (
    <ol className="border-t border-white/10">
      {steps.map((step, i) => {
        const isOpen = open === i;
        return (
          <motion.li
            key={step.title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, delay: i * 0.05, ease: EASE }}
            className="border-b border-white/10"
          >
            <button
              type="button"
              onClick={() => setOpen(isOpen ? -1 : i)}
              aria-expanded={isOpen}
              className="group/row grid w-full cursor-pointer grid-cols-[auto_1fr_auto] items-center gap-6 py-8 text-left md:gap-10 md:py-11"
            >
              <span
                className={`font-mono-spec text-[11px] tracking-[0.35em] transition-colors duration-300 ${
                  isOpen ? "text-white" : "text-white/30 group-hover/row:text-white/60"
                }`}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3
                className={`font-display text-xl leading-tight font-bold tracking-tight transition-colors duration-300 md:text-2xl lg:text-3xl ${
                  isOpen ? "text-white" : "text-white/70 group-hover/row:text-white"
                }`}
              >
                {step.title}
              </h3>
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-300 ${
                  isOpen
                    ? "border-white/60 text-white"
                    : "border-white/15 text-white/40 group-hover/row:border-white/40"
                }`}
              >
                {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="overflow-hidden"
                >
                  <p className="max-w-2xl pb-10 text-base leading-relaxed font-light text-white/50 md:pb-12 md:pl-20">
                    {step.desc}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.li>
        );
      })}
    </ol>
  );
}

/**
 * The agent's capabilities, wired to the diagram beside them.
 *
 * Picking a line turns the ring: the beam swings to that node and the centre
 * names it. The copy and the drawing are one object rather than an
 * illustration parked next to a list, which is what earns the diagram its
 * half of the section.
 */
function AgentCapabilities({ points }: { points: Point[] }) {
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  /** While the visitor is driving with the pointer, scrolling must not fight
   *  them for the selection. Set on hover and click; scrolling takes over
   *  again a moment after they leave. */
  const manualUntil = useRef(0);

  const choose = (i: number) => {
    manualUntil.current = nowMs() + 2500;
    setActive(i);
  };

  // The section advances on its own as it crosses the viewport: by the time
  // it has passed, all four have had their turn, and the object beside them
  // has moved four times. No pin — the page keeps scrolling normally, which
  // is what "scrolls with the page" has to mean after a pinned section
  // directly above it.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap || points.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const trigger = ScrollTrigger.create({
      trigger: wrap,
      start: "top 75%",
      end: "bottom 60%",
      onUpdate: (self) => {
        if (nowMs() < manualUntil.current) return;
        const i = Math.min(points.length - 1, Math.floor(self.progress * points.length));
        // Only on a change: four state updates across the whole section, not
        // one per scroll frame.
        setActive((prev) => (prev === i ? prev : i));
      },
    });

    return () => trigger.kill();
  }, [points.length]);

  return (
    <div ref={wrapRef} className="grid items-center gap-16 lg:grid-cols-2 lg:gap-24">
      <ul className="space-y-3">
        {points.map((point, i) => {
          const isActive = active === i;
          return (
            <motion.li
              key={point.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.05, ease: EASE }}
            >
              <button
                type="button"
                onClick={() => choose(i)}
                onMouseEnter={() => choose(i)}
                onFocus={() => choose(i)}
                aria-pressed={isActive}
                className="group/cap w-full cursor-pointer border-l py-4 pl-6 text-left transition-colors duration-300"
                style={{
                  borderColor: isActive ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.12)",
                }}
              >
                <span className="flex items-baseline gap-4">
                  <span
                    className={`font-mono-spec text-[10px] tracking-[0.3em] transition-colors duration-300 ${
                      isActive ? "text-white/70" : "text-white/25"
                    }`}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`font-display text-lg font-bold tracking-tight transition-colors duration-300 md:text-xl ${
                      isActive ? "text-white" : "text-white/55 group-hover/cap:text-white/80"
                    }`}
                  >
                    {point.title}
                  </span>
                </span>
                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.span
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: EASE }}
                      className="block max-w-md overflow-hidden text-[0.95rem] leading-relaxed font-light text-white/45"
                    >
                      <span className="block pt-3">{point.desc}</span>
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>
            </motion.li>
          );
        })}
      </ul>

      {/* The object. Hidden below lg: at that width it would be a thumbnail
          of the one thing on the page that is actually dimensional. */}
      <Reveal className="hidden lg:block">
        <div className="relative mx-auto w-full max-w-[460px]">
          <AgentCore active={active} total={points.length} className="h-[460px] w-full" />

          {/* The caption, under the object where it can be read: index, name,
              and a rule tying it back to the list. */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <span className="h-px w-10 bg-white/20" />
            <span className="font-mono-spec text-[10px] tracking-[0.3em] text-white/35">
              {String(active + 1).padStart(2, "0")}
            </span>
            <span className="font-mono-spec text-[11px] tracking-[0.25em] text-white/80 uppercase">
              {points[active]?.title}
            </span>
            <span className="h-px w-10 bg-white/20" />
          </div>
        </div>
      </Reveal>
    </div>
  );
}

/**
 * One line of the index of what can be built.
 *
 * Six bordered cards is the layout a template produces, and at this size they
 * read as a pricing table for things that have no price. A ruled index reads
 * as a studio listing its range: the number and the name carry it, the
 * description sits in the second column for whoever is actually reading, and
 * the rule under the row draws itself as the pointer crosses.
 */
function BuildRow({ item, index, href }: { item: BuildItem; index: number; href: string }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay: (index % 3) * 0.05, ease: EASE }}
      className="group/row relative border-b border-white/10"
    >
      <Link href={href} className="relative block overflow-hidden">
        {/* A wash that arrives from the left edge rather than a box that
            lights up: the row stays a rule, not a tile. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full transition-transform duration-700 ease-out group-hover/row:translate-x-0"
          style={{
            background:
              "linear-gradient(to right, rgba(255,255,255,0.055), rgba(255,255,255,0.015) 45%, transparent 75%)",
          }}
        />

        <div className="relative grid grid-cols-[auto_1fr] items-baseline gap-x-6 gap-y-3 py-8 md:grid-cols-[auto_minmax(0,0.85fr)_minmax(0,1.15fr)_auto] md:gap-x-12 md:py-11">
          <span className="font-mono-spec text-[11px] tracking-[0.35em] text-white/25 transition-colors duration-500 group-hover/row:text-white/60">
            {String(index + 1).padStart(2, "0")}
          </span>

          <h3 className="font-display text-2xl leading-[1.05] font-bold tracking-tight text-white transition-transform duration-500 ease-out group-hover/row:translate-x-1.5 md:text-3xl lg:text-[2.1rem]">
            {item.title}
          </h3>

          <p className="col-span-2 max-w-xl text-[0.95rem] leading-relaxed font-light text-white/45 transition-colors duration-500 group-hover/row:text-white/65 md:col-span-1">
            {item.desc}
          </p>

          <ArrowUpRight className="col-start-2 h-5 w-5 justify-self-end text-white/0 transition-all duration-500 group-hover/row:text-white/70 md:col-start-auto md:translate-x-0 md:-translate-y-1 md:group-hover/row:translate-x-0" />
        </div>

        {/* The rule that draws itself under the row. */}
        <span
          aria-hidden
          className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-white/70 transition-transform duration-700 ease-out group-hover/row:scale-x-100"
        />
      </Link>
    </motion.li>
  );
}

/**
 * The dedicated page for custom apps.
 *
 * It sells something that cannot be shown: two apps exist, neither is being
 * put on display, and invented screenshots would promise an interface nobody
 * can touch. So the page is built out of the *argument* — what gets built,
 * how, and what the agent inside it actually does — carried by two objects
 * that are abstract on purpose: a body with things in orbit in the header,
 * and an app assembling itself further down.
 */
export function AppsPage({ locale }: { locale: Locale }) {
  const { t } = useTranslation();

  const process = tList<Process>(t("apps.process", { returnObjects: true }));
  const agentPoints = tList<Point>(t("apps.agentPoints", { returnObjects: true }));
  const buildItems = tList<BuildItem>(t("apps.buildItems", { returnObjects: true }));
  const contactHref = localizedPath(locale, "contact");

  return (
    <main className="relative min-h-screen bg-black text-white">
      <Nav />

      {/* ---------------------------------------------------------- hero */}
      <section className="relative overflow-hidden px-6 pt-32 pb-24 md:px-16 md:pt-44 md:pb-32">
        <div className="noise-bg pointer-events-none absolute inset-0 opacity-25" />

        <div className="relative z-10 mx-auto grid w-full max-w-[1500px] items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <div>
            <Link
              href={localizedPath(locale)}
              className="font-mono-spec -my-4 inline-flex items-center gap-2 py-4 text-[10px] tracking-[0.25em] text-white/45 uppercase transition-colors hover:text-white"
            >
              <ArrowLeft className="h-3 w-3" />
              {t("apps.backHome")}
            </Link>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
              className="font-mono-spec mt-14 mb-8 text-[11px] tracking-[0.4em] text-white/35 uppercase"
            >
              {t("apps.label")}
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.16, ease: EASE }}
              className="font-display text-[2.6rem] leading-[0.94] font-bold tracking-tighter text-balance text-white sm:text-6xl lg:text-[4.1rem] xl:text-7xl"
            >
              {t("apps.titlePre")}
              <span className="text-gradient-aura italic">{t("apps.titleHighlight")}</span>
              {t("apps.titlePost")}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.26, ease: EASE }}
              className="mt-10 max-w-xl text-lg leading-relaxed font-light text-white/50 md:text-xl"
            >
              {t("apps.heroLead")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.36, ease: EASE }}
              className="mt-12 flex flex-wrap items-center gap-4"
            >
              <Link
                href={contactHref}
                className="group/cta font-mono-spec inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-[11px] font-medium tracking-[0.25em] text-black uppercase transition-colors hover:bg-white/85"
              >
                {t("apps.cta")}
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover/cta:translate-x-1" />
              </Link>
              <Link
                href={localizedPath(locale, "pricing")}
                className="font-mono-spec inline-flex items-center rounded-full border border-white/15 px-8 py-4 text-[11px] tracking-[0.25em] text-white/70 uppercase transition-colors hover:border-white/40 hover:text-white"
              >
                {t("apps.ctaSecondary")}
              </Link>
            </motion.div>
          </div>

          {/* The space that used to be black. */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, delay: 0.3, ease: EASE }}
            className="relative h-[340px] sm:h-[420px] lg:h-[620px]"
          >
            <AppOrbit className="absolute inset-0" />
          </motion.div>
        </div>
      </section>

      {/* ------------------------------------------- the assembling object */}
      <AppsStage />

      {/* ------------------------------------------------------- process */}
      <section className="relative px-6 py-28 md:px-16 md:py-40">
        <div className="mx-auto w-full max-w-[1500px]">
          <SectionHead label={t("apps.processLabel")} title={t("apps.processTitle")} />
          <ProcessSteps steps={process} />
        </div>
      </section>

      {/* --------------------------------------------------------- agent */}
      <section className="relative overflow-hidden px-6 py-28 md:px-16 md:py-40">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-60"
          style={{
            background:
              "radial-gradient(45% 45% at 78% 50%, rgba(255,255,255,0.07) 0%, transparent 70%)",
          }}
        />
        <div className="relative z-10 mx-auto w-full max-w-[1500px]">
          <SectionHead
            label={t("apps.agentLabel")}
            title={t("apps.agentTitle")}
            className="mb-10 md:mb-14"
          />
          <Reveal className="mb-16 md:mb-20">
            <p className="max-w-2xl text-lg leading-relaxed font-light text-white/50">
              {t("apps.agentLead")}
            </p>
          </Reveal>
          <AgentCapabilities points={agentPoints} />
        </div>
      </section>

      {/* --------------------------------------------------- what we build */}
      <section className="relative px-6 py-28 md:px-16 md:py-40">
        <div className="mx-auto w-full max-w-[1500px]">
          <SectionHead label={t("apps.buildLabel")} title={t("apps.buildTitle")} />

          <ul className="border-t border-white/10">
            {buildItems.map((item, i) => (
              <BuildRow key={item.title} item={item} index={i} href={contactHref} />
            ))}
          </ul>

          <Reveal>
            <p className="font-mono-spec mt-10 text-[10px] tracking-[0.3em] text-white/30 uppercase">
              {t("apps.buildNote")}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ----------------------------------------------------- closing cta */}
      <section className="relative overflow-hidden px-6 pt-20 pb-36 md:px-16 md:pb-48">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(50% 60% at 50% 100%, rgba(255,255,255,0.10) 0%, transparent 70%)",
          }}
        />
        <Reveal className="relative z-10 mx-auto w-full max-w-3xl text-center">
          <h2 className="font-display text-3xl leading-[1.04] font-bold tracking-tighter text-balance text-white sm:text-4xl lg:text-5xl">
            {t("apps.ctaTitle")}
          </h2>
          <p className="mx-auto mt-7 max-w-xl text-base leading-relaxed font-light text-white/50 md:text-lg">
            {t("apps.ctaLead")}
          </p>
          <Link
            href={contactHref}
            className="group/end font-mono-spec mt-12 inline-flex items-center gap-3 rounded-full bg-white px-9 py-5 text-[11px] font-medium tracking-[0.25em] text-black uppercase transition-colors hover:bg-white/85"
          >
            {t("apps.cta")}
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover/end:translate-x-1" />
          </Link>
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}
