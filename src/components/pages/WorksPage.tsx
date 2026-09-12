"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Nav } from "@/components/aura/Nav";
import { Footer } from "@/components/aura/Contact";
import {
  allProjects,
  categories,
  categoryLabel,
  type Project,
} from "@/components/aura/projects-data";
import { localizedPath, type Locale } from "@/lib/seo";
import { cn } from "@/lib/utils";
import { SparklesCanvas } from "@/components/ui/sparkles-canvas";
import { WordRevealHeading } from "@/components/ui/word-reveal-heading";
import { Vine } from "@/components/ui/vine";
import { RockField } from "@/components/three/RockField";

/**
 * One project.
 *
 * `feature` makes it the wide one at the head of its category — the rhythm the
 * v2 page got from alternating sides, without the cost of thirty full-width
 * blocks in a row. The image is the content here: everything else is a caption
 * under it.
 */
function WorkCard({ project, feature }: { project: Project; feature: boolean }) {
  const { t } = useTranslation();
  const label = categoryLabel(project.category);

  return (
    <li className={cn(feature && "md:col-span-2")}>
      <a
        href={project.domain ?? undefined}
        target={project.domain ? "_blank" : undefined}
        rel={project.domain ? "noreferrer" : undefined}
        aria-label={`${project.name} — ${label}`}
        className={cn(
          "group block outline-none",
          project.domain ? "cursor-pointer" : "cursor-default",
        )}
      >
        <div
          className={cn(
            "relative w-full overflow-hidden rounded-xl border border-white/10 bg-neutral-950",
            feature ? "aspect-[16/8]" : "aspect-[16/10]",
          )}
        >
          {project.image ? (
            <Image
              src={project.image}
              alt={project.alt}
              fill
              // The feature card is the full content width; the rest are half
              // of it from md up. Getting this wrong is the difference between
              // a 3400px file and an 800px one, thirty times over.
              sizes={
                feature
                  ? "(max-width: 767px) 100vw, (max-width: 1279px) 92vw, 1300px"
                  : "(max-width: 767px) 100vw, (max-width: 1279px) 46vw, 640px"
              }
              className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.03]"
            />
          ) : (
            // No screenshot yet: keep the proportions and say the name, rather
            // than leaving a hole in the grid.
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
              <span className="font-mono-spec text-[10px] tracking-[0.35em] text-white/40 uppercase">
                {label}
              </span>
              <span className="font-display text-2xl font-bold tracking-tighter text-white/70">
                {project.name}
              </span>
            </div>
          )}

          {/* Lifts on hover rather than sitting there as a permanent scrim. */}
          <div className="absolute inset-0 bg-black/30 transition-opacity duration-700 group-hover:opacity-0" />

          {project.domain && (
            <span className="absolute right-4 bottom-4 grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-black/50 text-white opacity-0 backdrop-blur-md transition-all duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          )}
        </div>

        <div className="mt-5 flex items-start justify-between gap-6">
          <div className="min-w-0">
            <h3
              className={cn(
                "font-display leading-tight font-semibold tracking-tighter text-white",
                feature ? "text-2xl md:text-4xl" : "text-xl md:text-2xl",
              )}
            >
              {project.name}
            </h3>
            <p className="mt-2 max-w-xl text-sm leading-relaxed font-light text-white/50">
              {project.desc}
            </p>
          </div>

          {!project.domain && (
            <span className="font-mono-spec shrink-0 pt-1.5 text-[10px] tracking-[0.25em] text-white/25 uppercase">
              {t("projects.comingSoon", "Presto online")}
            </span>
          )}
        </div>
      </a>
    </li>
  );
}

/**
 * Every project, grouped by the sector it was built for.
 *
 * The v2 page this replaces was one flat run of alternating case studies. That
 * reads beautifully at eight projects and becomes an unnavigable scroll at
 * thirty — there is no way to tell, from anywhere in it, how much is left or
 * whether the thing you want is above or below you.
 *
 * Grouping by sector is also the more useful answer to the question a visitor
 * actually arrives with, which is not "what have you made" but "have you made
 * one of these for someone like me". The chips at the top are real anchors
 * into the groups, so nothing is ever hidden from a crawler or from a reader
 * who doesn't use them — every project is in the DOM, in order, always.
 */
export function WorksPage({ locale }: { locale: Locale }) {
  const { t } = useTranslation();
  const homeHref = localizedPath(locale, "");

  const groups = categories
    .map((c) => ({ ...c, items: allProjects.filter((p) => p.category === c.key) }))
    .filter((g) => g.items.length > 0);

  return (
    <main className="relative min-h-screen bg-black text-white">
      <Nav />

      {/* Ambient wash, matched to the other inner pages. Purely decorative and
          behind everything, so it never intercepts a click. */}
      <div className="noise-bg pointer-events-none absolute inset-0 z-0 opacity-30" />
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-40">
        <div
          className="absolute top-[-10%] left-[-20%] h-[600px] w-[600px] rounded-full blur-[150px]"
          style={{ background: "var(--glow-cyan)" }}
        />
        <div
          className="absolute right-[-25%] bottom-[15%] h-[700px] w-[700px] rounded-full blur-[180px]"
          style={{ background: "var(--glow-purple)" }}
        />
      </div>

      {/* ------------------------------------------------------------------ *
       * The hero.
       *
       * A full panel of its own before a single project appears. Thirty
       * screenshots are a lot of noise to open a page on, and the page has
       * nothing to say for itself if it opens straight into them — this is the
       * beat that says what the list *is* before the list starts.
       *
       * The sparkles and the grid are the pricing header's treatment, kept to
       * plain white at low alpha, and radially masked so the field dies out
       * before it reaches the work.
       * ------------------------------------------------------------------ */}
      <header className="relative z-10 flex min-h-[88svh] flex-col justify-end overflow-hidden px-6 pt-32 pb-16 md:px-16 md:pt-44 md:pb-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            maskImage: "radial-gradient(75% 70% at 50% 35%, black, transparent 88%)",
            WebkitMaskImage: "radial-gradient(75% 70% at 50% 35%, black, transparent 88%)",
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(55% 60% at 50% 30%, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.04) 45%, transparent 75%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-45"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.09) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
              backgroundSize: "70px 80px",
            }}
          />
          <SparklesCanvas className="absolute inset-0" count={200} />
        </div>

        {/* Rock, drifting behind the title.

            Outside the masked block above on purpose: the mask is shaped for
            a flat grid and would cut the rocks off mid-tumble. This gets its
            own, much softer fade at the edges, and sits under the copy — the
            heading is what the page is for. */}
        <RockField
          className="pointer-events-none absolute inset-0 z-0"
          count={30}
          // Capped well below the services belt's largest. A single big rock
          // beside a heading stops being atmosphere and becomes an object the
          // eye goes to instead of the words.
          size={[0.05, 0.3]}
          spread={[11, 5.5, 5]}
          drift={0.18}
          distance={13}
          opacity={0.55}
        />

        <div className="relative z-10">
          <Link
            href={homeHref}
            className="group/back font-mono-spec mb-12 inline-flex items-center gap-2 text-[10px] tracking-[0.3em] text-white/40 uppercase transition-colors hover:text-white md:mb-16"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover/back:-translate-x-0.5" />
            {t("projects.backHome", "Torna alla home")}
          </Link>

          {/* Set as big as the viewport will carry it — this is the one thing
              on the page that isn't a screenshot, so it gets the room. */}
          <WordRevealHeading
            text={t("projects.allTitle", "I nostri lavori")}
            // leading-[1], not tighter. WordRevealHeading masks each word in
            // its own overflow-hidden box so it can slide up into place, and
            // that box is exactly one line-height tall — set the leading below
            // 1 and the box ends up shorter than the glyphs, which clips the
            // tops and bottoms off every word. At 0.84 the mobile heading was
            // losing the top of "lavori" and the two lines were overlapping.
            className="font-display text-[13vw] leading-[1] font-bold tracking-tighter text-white sm:text-[12vw] md:text-[11vw] lg:text-[9.5vw]"
          />

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12 flex flex-col gap-10 border-t border-white/10 pt-8 md:mt-16 md:flex-row md:items-end md:justify-between"
          >
            <p className="max-w-md text-base leading-relaxed font-light text-white/55 md:text-lg">
              {t(
                "projects.pageIntro",
                "Ogni progetto nasce su misura: nessun template, codice scritto per il brand che lo porta.",
              )}
            </p>

            {/* Counted off the catalogue, never typed in — a number on a
                portfolio page that disagrees with the page is worse than no
                number at all. */}
            <dl className="flex items-end gap-10 md:gap-14">
              <div>
                <dt className="font-mono-spec text-[10px] tracking-[0.3em] text-white/35 uppercase">
                  {t("projects.projectsLabel", "progetti")}
                </dt>
                <dd className="font-display mt-2 text-4xl leading-none font-bold tracking-tighter text-white tabular-nums md:text-5xl">
                  {allProjects.length}
                </dd>
              </div>
              <div>
                <dt className="font-mono-spec text-[10px] tracking-[0.3em] text-white/35 uppercase">
                  {t("projects.sectorsLabel", "settori")}
                </dt>
                <dd className="font-display mt-2 text-4xl leading-none font-bold tracking-tighter text-white tabular-nums md:text-5xl">
                  {groups.length}
                </dd>
              </div>
              <div>
                <dt className="font-mono-spec text-[10px] tracking-[0.3em] text-white/35 uppercase">
                  {t("projects.onlineLabel", "online")}
                </dt>
                <dd className="font-display mt-2 text-4xl leading-none font-bold tracking-tighter text-white tabular-nums md:text-5xl">
                  {allProjects.filter((p) => p.domain).length}
                </dd>
              </div>
            </dl>
          </motion.div>
        </div>
      </header>

      <div className="relative z-10 mx-auto max-w-[1500px] px-6 pt-4 pb-28 md:px-16 md:pb-40">
        {/* The index. Anchors, not filters — nothing is removed from the page,
            so the browser's own find-in-page and a crawler both still see all
            thirty. */}
        <nav
          aria-label={t("projects.bySector", "Progetti per settore")}
          className="mt-6 mb-20 flex flex-wrap items-center gap-x-3 gap-y-3 border-y border-white/10 py-6 md:mt-10 md:mb-28"
        >
          {groups.map((group) => (
            <a
              key={group.key}
              href={`#settore-${group.key}`}
              className="font-mono-spec rounded-full border border-white/12 px-4 py-2 text-[10px] tracking-[0.2em] text-white/55 uppercase transition-colors hover:border-white/40 hover:text-white focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
            >
              {group.label} <span className="text-white/25 tabular-nums">{group.items.length}</span>
            </a>
          ))}
        </nav>

        <div className="space-y-24 md:space-y-36">
          {groups.map((group, i) => (
            <section
              key={group.key}
              id={`settore-${group.key}`}
              // The fixed nav would otherwise land on top of the heading when
              // a chip is followed.
              className="scroll-mt-28 md:scroll-mt-32"
            >
              <div className="mb-10 flex items-end justify-between gap-6 border-b border-white/10 pb-5 md:mb-14">
                <h2 className="font-display shrink-0 text-2xl leading-none font-bold tracking-tighter text-white md:text-4xl">
                  {group.label}
                </h2>

                {/* The vine runs out of the heading and fills the rule.
                    Hidden below md: at phone width there is no rule for it to
                    fill — the heading already takes the row — and a plant
                    squeezed into 80px is a smudge, not a plant. */}
                <Vine
                  seed={i + 1}
                  className="hidden h-[clamp(40px,4vw,58px)] min-w-0 flex-1 md:block"
                />
              </div>

              <ul className="grid gap-x-8 gap-y-14 md:grid-cols-2 md:gap-y-20">
                {group.items.map((project, i) => (
                  <WorkCard
                    key={project.id}
                    project={project}
                    // The first of each group runs full width, which gives the
                    // page a beat at the top of every sector instead of thirty
                    // identical tiles.
                    feature={i === 0}
                  />
                ))}
              </ul>
            </section>
          ))}
        </div>

        <div className="mt-28 border-t border-white/10 pt-12 md:mt-40">
          <p className="max-w-lg text-lg leading-relaxed font-light text-white/50 md:text-xl">
            {t("projects.ctaLine", "Il prossimo potrebbe essere il tuo.")}
          </p>
          <Link
            href={localizedPath(locale, "contact")}
            className="group font-display mt-6 inline-flex items-baseline gap-4 text-3xl leading-none font-bold tracking-tighter text-white transition-colors outline-none hover:text-white/70 focus-visible:ring-2 focus-visible:ring-white/60 sm:text-4xl md:text-5xl"
          >
            {t("projects.ctaAction", "Parliamo del tuo progetto")}
            <ArrowUpRight
              className="h-7 w-7 shrink-0 transition-transform duration-500 ease-out group-hover:translate-x-1 group-hover:-translate-y-1 md:h-9 md:w-9"
              aria-hidden
            />
          </Link>
        </div>
      </div>

      <div className="relative z-10">
        <Footer />
      </div>
    </main>
  );
}
