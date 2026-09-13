"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { MaskWords, Reveal, useReducedMotion } from "@/components/mobile/motion";
import type { Locale } from "@/lib/seo";

/**
 * What the studio builds, and what it costs to start.
 *
 * This is the section the rebuild exists for. On the desktop it is a scroll
 * sequence where one interface morphs between a landing page, a shop and a
 * web app; on a phone that sequence survived as 3,331px of scroll — four
 * screens, almost all of it black — for two paragraphs of copy. It was, by
 * height, the largest single thing on the phone site and the emptiest.
 *
 * Rebuilt as a sticky title with the four product words cycling under it.
 * Same idea as the desktop morph (one base, many shapes), a tenth of the
 * scroll, and the claim stays on screen while the evidence for it changes —
 * which is the part that actually did the work.
 */

/**
 * The four shapes the base takes, each with a real site that is that shape.
 *
 * The desktop morphs an actual interface between these; the first version of
 * this section kept only the words, which left the whole passage as abstract
 * type on black — a claim with nothing behind it. Showing the built work
 * instead makes the same argument and makes it checkable: these are four of
 * the studio's own projects, not illustrations.
 *
 * Mirrors the desktop morph's order.
 */
const SHAPES = [
  { word: "Landing", image: "/projects/pernthaler_premium.webp", alt: "Landing page Pernthaler" },
  {
    word: "Vetrina",
    image: "/projects/schlosshof_resort.webp",
    alt: "Sito vetrina Schlosshof Resort",
  },
  { word: "Shop", image: "/projects/abigio.webp", alt: "E-commerce ricambi ABIGIO" },
  { word: "Web App", image: "/projects/sport_id.webp", alt: "Web app SportID" },
] as const;

export function MobileProducts({ locale }: { locale: Locale }) {
  const { t } = useTranslation();
  const reduced = useReducedMotion();
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);

  /**
   * Which shape is showing is a function of how far through the track we are.
   *
   * Read inside a rAF and only on frames the browser was going to paint
   * anyway. The handler is passive so it can never delay the scroll itself —
   * on a phone, a non-passive scroll listener is the single most reliable way
   * to make a page feel broken.
   */
  useEffect(() => {
    if (reduced) return;
    const track = trackRef.current;
    if (!track) return;

    let raf = 0;
    let queued = false;

    const measure = () => {
      queued = false;
      const rect = track.getBoundingClientRect();
      const travel = rect.height - window.innerHeight;
      if (travel <= 0) return;
      const p = Math.min(Math.max(-rect.top / travel, 0), 0.999);
      setActive(Math.floor(p * SHAPES.length));
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      raf = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <section id="team" className="relative bg-black">
      {/* Track height sets how long each shape holds. The panel pins for
          (track - viewport), so 240svh gives roughly 285px of scroll per
          word: slow enough to read all four on a normal flick, and still a
          fraction of the 3,331px this section used to cost. At 170svh the
          whole cycle went past in 569px and you reached "Web App" before
          you had read "Landing". */}
      <div ref={trackRef} className="relative h-[240svh]">
        <div className="sticky top-0 flex min-h-[100svh] flex-col justify-center px-6 py-24">
          <Reveal>
            <span className="font-mono-spec text-[10px] tracking-[0.28em] text-white/35 uppercase">
              {t("product.label")}
            </span>
          </Reveal>

          <h2 className="font-display mt-4 text-[2.1rem] leading-[1.08] font-bold tracking-[-0.03em] text-white">
            <MaskWords text={t("product.headingPre").trim()} />{" "}
            <span className="text-white/45">{t("product.headingHighlight")}</span>
            {t("product.headingPost")}
          </h2>

          {/* The morph. A fixed-height window with the four words stacked
              inside it: the active one sits at zero, the others are pushed
              out of the mask above or below. Height is locked so the copy
              underneath never moves as the word changes — a shifting
              paragraph would undo the whole effect. */}
          <div
            className="relative mt-6 h-[3.2rem] overflow-hidden"
            // The word is decorative repetition of what the list below says.
            // Announcing four cycling words would be noise, so the live
            // region is silent and the list carries the meaning.
            aria-hidden
          >
            {SHAPES.map((shape, i) => (
              <span
                key={shape.word}
                className="font-display absolute inset-x-0 top-0 text-[2.6rem] leading-[1.2] font-bold tracking-[-0.03em] text-white will-change-transform"
                style={
                  reduced
                    ? { opacity: i === 0 ? 1 : 0 }
                    : {
                        opacity: i === active ? 1 : 0,
                        transform:
                          i === active
                            ? "none"
                            : `translate3d(0, ${i < active ? "-70%" : "70%"}, 0)`,
                        transition:
                          "transform 620ms cubic-bezier(0.16, 1, 0.3, 1), opacity 420ms ease",
                      }
                }
              >
                {shape.word}
              </span>
            ))}
          </div>

          {/* The work itself, swapping with the word.
           *
           * All four screenshots are stacked and only the active one is
           * opaque, rather than one <Image> whose `src` changes: swapping a
           * src means a decode mid-scroll and a blank frame while it
           * happens. Four eager images cost more up front and nothing at
           * all during the animation, which is the trade that matters
           * here.
           *
           * The frame keeps the 16:9 of the assets, so nothing is cropped,
           * and the aspect-ratio box means the copy below never shifts as
           * the pictures load. */}
          <div className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-[1.1rem] border border-white/10 bg-neutral-900">
            {SHAPES.map((shape, i) => (
              <Image
                key={shape.word}
                src={shape.image}
                alt={shape.alt}
                fill
                sizes="(max-width: 768px) 100vw, 640px"
                loading="eager"
                className="object-cover object-top"
                style={{
                  opacity: i === (reduced ? 0 : active) ? 1 : 0,
                  transition: reduced ? undefined : "opacity 500ms ease",
                }}
              />
            ))}
          </div>

          <Reveal delay={0.1} className="mt-6">
            <p className="max-w-[38ch] text-[0.95rem] leading-relaxed text-white/60">
              {t("product.paragraph")}
            </p>
          </Reveal>

          {/* The same four shapes as a plain list, which is what a screen
              reader and a reduced-motion visitor get instead of the morph,
              and what gives the progress dots their meaning. */}
          <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2">
            {SHAPES.map((shape, i) => (
              <li
                key={shape.word}
                className="font-mono-spec text-[10px] tracking-[0.22em] uppercase transition-colors duration-300"
                style={{ color: i === active ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.3)" }}
              >
                {shape.word}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Pricing hand-off. Its own block below the track, so it arrives after
          the morph has finished rather than fighting it for the same screen. */}
      <div id="pricing-cta" className="px-6 pt-8 pb-24">
        <Reveal>
          <span className="font-mono-spec text-[10px] tracking-[0.28em] text-white/35 uppercase">
            {t("product.pricingLabel")}
          </span>
        </Reveal>
        <h2 className="font-display mt-3 text-[1.9rem] leading-[1.1] font-bold tracking-[-0.03em] text-white">
          <MaskWords text={t("product.pricingHeadingLine1")} />
        </h2>
        <Reveal delay={0.08} className="mt-4">
          <p className="max-w-[38ch] text-sm leading-relaxed text-white/55">
            {t("product.pricingParagraph")}
          </p>
        </Reveal>
        <Reveal delay={0.14} className="mt-8">
          <Link
            href={`/${locale}/pricing`}
            className="flex items-center justify-between rounded-[1.25rem] border border-white/10 bg-neutral-950 px-6 py-5"
          >
            <span className="font-display text-base font-bold tracking-tight text-white">
              {t("product.pricingCta")}
            </span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
