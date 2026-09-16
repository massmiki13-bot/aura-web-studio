"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import { featuredProjects } from "@/components/aura/projects-data";
import { MaskWords, Reveal, useHasEntered, useReducedMotion } from "@/components/mobile/motion";
import type { Locale } from "@/lib/seo";

/**
 * The five featured projects.
 *
 * This replaced the desktop's 3D field, and the first attempt at it was
 * wrong in two ways that only showed up on a real phone:
 *
 *   - The screenshots are 1600×900. They were being shown in a 3:4 portrait
 *     card, so `object-cover` threw away two thirds of the width and left a
 *     narrow vertical slice of a website — unreadable, and worse than no
 *     image. Every card is 16:9 now, the shape the asset actually is, so the
 *     whole page is visible.
 *   - Only the first image ever loaded. The other four sat in a horizontal
 *     scroller, and lazy loading inside one is unreliable: the browser has no
 *     reason to fetch them until they are scrolled to, and on a phone that
 *     reads as broken. They are eager now — five 1600×900 WebPs at phone
 *     width is a small budget for the section that sells the studio.
 *
 * Vertical, one project per beat, rather than a swipe deck. A deck hides four
 * of the five behind a gesture and shrinks each to a card; stacked full-bleed
 * images are what the work deserves and what a phone shows best.
 */
export function MobileProjects({ locale }: { locale: Locale }) {
  const { t } = useTranslation();

  return (
    <section id="projects" className="relative bg-black py-28">
      <div className="px-6 text-center">
        <h2 className="font-display text-[2.2rem] leading-[1.08] font-bold tracking-[-0.03em] text-balance text-white">
          <MaskWords text={t("projects.mobileTitle")} />
        </h2>
      </div>

      <ul className="mt-14 space-y-16">
        {featuredProjects.map((project, i) => (
          <ProjectShot key={project.id} project={project} index={i} />
        ))}
      </ul>

      <div className="mt-16 px-6">
        <Reveal>
          <Link
            href={`/${locale}/lavori`}
            className="font-mono-spec flex h-14 items-center justify-center rounded-full border border-white/15 text-[11px] tracking-[0.25em] text-white/80 uppercase"
          >
            {t("projects.seeAll")}
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/**
 * One project: the screenshot, then its name and line beneath it.
 *
 * The image settles from 1.06 to 1 as it arrives. That one move is the whole
 * motion budget for this section — it is the gesture Apple uses on product
 * shots, and it works because it is barely noticeable: the picture appears to
 * come to rest rather than to animate. Anything more here competes with the
 * work being shown.
 */
function ProjectShot({
  project,
  index,
}: {
  project: (typeof featuredProjects)[number];
  index: number;
}) {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const { ref, entered } = useHasEntered(0.15);

  const shot = (
    <>
      {/* overflow-hidden on the frame, the scale on the image inside it: the
          image can breathe past its own edges without ever pushing the
          rounded corner out of shape. */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[1.25rem] border border-white/10 bg-neutral-900">
        {project.image ? (
          <Image
            src={project.image}
            alt={project.alt}
            fill
            sizes="(max-width: 768px) 100vw, 640px"
            // Eager, deliberately: see the note on the section above.
            loading="eager"
            priority={index === 0}
            className="object-cover object-top will-change-transform"
            style={
              reduced
                ? undefined
                : {
                    transform: entered ? "scale(1)" : "scale(1.06)",
                    transition: "transform 1100ms cubic-bezier(0.16, 1, 0.3, 1)",
                  }
            }
          />
        ) : null}
      </div>

      <div className="mt-5 px-1">
        <div className="flex items-baseline justify-between gap-4">
          <h3 className="font-display text-xl leading-tight font-bold tracking-tight text-white">
            {project.name}
          </h3>
          <span className="font-mono-spec shrink-0 text-[9px] tracking-[0.22em] text-white/35 uppercase">
            {project.domain ? t("projects.visit") : t("projects.comingSoon")}
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-white/45">{project.desc}</p>
      </div>
    </>
  );

  return (
    <li ref={ref as never} className="px-6">
      {project.domain ? (
        <a href={project.domain} target="_blank" rel="noreferrer noopener" className="block">
          {shot}
        </a>
      ) : (
        // Unpublished work is shown but not linked — the label says so rather
        // than handing the visitor a 404.
        <div>{shot}</div>
      )}
    </li>
  );
}
