"use client";

import Image from "next/image";

import { allProjects } from "@/components/aura/projects-data";

/**
 * A slow band of the studio's work, drifting sideways under the masthead.
 *
 * It exists to break a run of four text-only screens. Before it, the phone
 * home page opened with the masthead, its coda, three process lines and four
 * offers — all type on black — and the first picture arrived a third of the
 * way down. Whatever the words say, a page that looks like that reads as a
 * document rather than as a studio's work.
 *
 * Eight screenshots, chosen across the catalogue's sectors so the band shows
 * range rather than repetition, and small: at this height each is roughly
 * 150px tall, so they read as a texture of work rather than as things to
 * examine. The five that matter get shown properly further down.
 */

/** Across sectors, not the featured five — this band is about breadth. */
const STRIP = [
  "bullman",
  "schlosshof_resort",
  "lorenza_lombardi",
  "poke_city",
  "nils_automotive",
  "kernerhof",
  "rdd_servizi",
  "sport_id",
];

export function MobileWorkStrip() {
  const shots = STRIP.map((file) => {
    const match = allProjects.find((p) => p.image === `/projects/${file}.webp`);
    return { file, alt: match?.alt ?? "" };
  });

  return (
    <section
      aria-hidden
      className="relative overflow-hidden bg-black py-10"
      // The band is decoration built from work that is presented properly in
      // the projects section below, with its own names and links. Announcing
      // eight more images here would make a screen reader read the catalogue
      // twice.
    >
      {/* Two identical runs side by side, translated by exactly half the
          track: when the first has travelled its own width the second is
          exactly where it started, so the loop has no seam. */}
      <div className="work-strip flex w-max gap-4">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 gap-4">
            {shots.map((shot) => (
              <div
                key={`${copy}-${shot.file}`}
                className="relative h-[150px] w-[267px] shrink-0 overflow-hidden rounded-xl border border-white/10 bg-neutral-900"
              >
                <Image
                  src={`/projects/${shot.file}.webp`}
                  alt=""
                  fill
                  sizes="267px"
                  // Eager, like the projects list, and for the same reason:
                  // these drift into view under their own animation rather
                  // than because the visitor scrolled to them, so lazy
                  // loading leaves empty frames sliding across the screen.
                  loading="eager"
                  className="object-cover object-top opacity-55"
                />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Both edges fade to the page ground, so the band reads as a window on
          something longer instead of as a row that stops. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black to-transparent"
      />
    </section>
  );
}
