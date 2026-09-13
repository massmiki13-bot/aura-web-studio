"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

import { featuredProjects } from "@/components/aura/projects-data";
import { MaskWords, Reveal } from "@/components/mobile/motion";
import type { Locale } from "@/lib/seo";

/**
 * The five featured projects, as a swipe deck.
 *
 * The desktop mechanic — a 3D field of planes that the scroll walks through,
 * stopping on each — is the best thing on the site and the worst possible fit
 * for a phone: it needs a wide viewport to read as depth, it hijacks the one
 * gesture a phone visitor has, and it costs roughly two screens of scroll per
 * card. Translating it literally would mean nine screens to see five
 * projects.
 *
 * A horizontal snap track does the same job in one screen. It is also the
 * gesture people already use for photos, so nothing has to be taught.
 *
 * Native CSS scroll-snap, not a carousel library: it runs on the compositor,
 * keeps the platform's own momentum and rubber-banding, and works with the
 * phone's assistive tech for free. A JS carousel would give up all three.
 */
export function MobileProjects({ locale }: { locale: Locale }) {
  const { t } = useTranslation();

  return (
    <section id="projects" className="relative bg-black py-24">
      <div className="px-6">
        <Reveal>
          <span className="font-mono-spec text-[10px] tracking-[0.28em] text-white/35 uppercase">
            {t("projects.selectedWork")}
          </span>
        </Reveal>
        <h2 className="font-display mt-3 text-[2.1rem] leading-[1.08] font-bold tracking-[-0.03em] text-white">
          <MaskWords text={t("projects.mobileTitle")} />
        </h2>
      </div>

      {/* The track. px-6 on the parent would cut the scroll area short, so the
          inset is carried by the first and last child's scroll margin instead
          — that way a card can rest flush against the screen edge while the
          deck still lines up with the copy above it. */}
      <div
        className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-6 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        // Not a listbox or a tablist: it is a set of links you can scroll.
        // Labelling it as a region with a name is what lets a screen reader
        // announce it and move into it deliberately.
        role="region"
        aria-label={t("projects.selectedWork")}
      >
        {featuredProjects.map((project, i) => {
          const body = (
            <>
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[1.25rem] bg-neutral-900">
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.alt}
                    fill
                    // The card is 78vw wide and a phone is at most ~430px
                    // CSS pixels, so 340px covers it; the browser picks the
                    // 2x source from the same srcset when the screen needs it.
                    sizes="(max-width: 768px) 78vw, 340px"
                    className="object-cover"
                    // The first card is the one on screen when the section
                    // arrives, so it is worth fetching early; the rest are a
                    // swipe away and must not compete with it.
                    priority={i === 0}
                  />
                ) : null}
                {/* Scrim: the names sit over the screenshots, and a few of
                    those screenshots are bright at the bottom. */}
                <div
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/85 to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <h3 className="font-display text-xl leading-tight font-bold tracking-tight text-white">
                    {project.name}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-[0.8rem] leading-snug text-white/60">
                    {project.desc}
                  </p>
                  <span className="font-mono-spec mt-3 inline-block text-[10px] tracking-[0.22em] text-white/45 uppercase">
                    {project.domain ? t("projects.visit") : t("projects.comingSoon")}
                  </span>
                </div>
              </div>
            </>
          );

          return (
            <Reveal
              as="article"
              key={project.id}
              delay={Math.min(i, 2) * 0.06}
              className="w-[78vw] shrink-0 snap-center last:mr-6"
            >
              {project.domain ? (
                <a
                  href={project.domain}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="block"
                >
                  {body}
                </a>
              ) : (
                // Unpublished work is shown but not linked — the card says so
                // rather than handing the visitor a 404.
                <div>{body}</div>
              )}
            </Reveal>
          );
        })}
      </div>

      <div className="px-6">
        <Reveal className="mt-6">
          <Link
            href={`/${locale}/lavori`}
            className="group flex items-center justify-between rounded-[1.25rem] border border-white/10 bg-neutral-950 px-6 py-5"
          >
            <span className="font-display text-base font-bold tracking-tight text-white">
              {t("projects.seeAll")}
            </span>
            <span aria-hidden className="text-white/40">
              →
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
