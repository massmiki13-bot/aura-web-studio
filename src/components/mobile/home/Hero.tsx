"use client";

import { useTranslation } from "react-i18next";

import { MobileHeroField } from "@/components/mobile/home/HeroField";
import { MobileHeroObject } from "@/components/mobile/home/HeroObject";
import { MaskWords, Reveal } from "@/components/mobile/motion";

/**
 * The phone masthead.
 *
 * Centred, black, and empty around the type on purpose. The first version of
 * this had a large CSS orb behind the copy, inherited from the desktop's
 * WebGL object; at phone size it filled half the screen as a soft purple
 * smear and made the headline look like it was sitting on a stain. There is
 * nothing decorative here now — the type is the design, and the air around it
 * is what makes it read as expensive.
 *
 * Carries everything the desktop masthead carries, which the first pass did
 * not: the tagline and both calls to action were missing, so the phone's
 * opening screen had no way to reach the quote form or the work.
 */
export function MobileHero() {
  const { t } = useTranslation();

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-black px-6 pt-24 pb-16 text-center"
    >
      {/* The interactive field, behind everything.
       *
       * inset-0 and z-0 with the copy lifted to z-10: the canvas has to
       * cover the whole masthead to be worth touching, but every word
       * above it must stay selectable and every button still tappable,
       * which is why the copy sits in its own layer rather than the canvas
       * being pushed behind with a negative index. */}
      <MobileHeroField className="pointer-events-auto absolute inset-0 z-0 h-full w-full" />

      {/* The turning object, between the dot field and the words.
       *
       * High, not centred. `rotateX(64deg)` flattens the assembly to about
       * 119px tall, and at any lower position its rings ran straight
       * through the headline — a ruled line across a word is the one thing
       * that makes type harder to read rather than better framed. Here it
       * clears the badge with room to spare. */}
      <MobileHeroObject className="pointer-events-none absolute top-[2%] left-1/2 z-0 -translate-x-1/2" />
      <Reveal delay={0.05} className="relative z-10">
        <p className="font-mono-spec text-[10px] tracking-[0.35em] text-white/40 uppercase">
          {t("hero.badge")}
        </p>
      </Reveal>

      {/* One <h1>, as large as a 375px screen will carry without the longest
          word in any of the four languages breaking the line badly.
          leading-[1.06], not tighter: each word is clipped to its own line box
          by MaskWords, and a line-height under 1 shears the descenders. */}
      <h1 className="font-display relative z-10 mt-7 text-[2.9rem] leading-[1.06] font-bold tracking-[-0.035em] text-balance text-white">
        <MaskWords text={t("hero.actTwoTitle")} delay={0.12} />
      </h1>

      {/* Both of the desktop masthead's lines, in its own order: the headline's
          own subtitle first, then act one's promise. Two lines under a
          headline is the most a screen this size carries before it stops
          being a statement and becomes a paragraph — which is why the
          remaining claim gets its own section below rather than a third
          line here. */}
      <Reveal delay={0.45} className="relative z-10 mt-6">
        <p className="mx-auto max-w-[28ch] text-[1.05rem] leading-relaxed text-white/70">
          {t("hero.actTwoSub")}
        </p>
        <p className="mx-auto mt-3 max-w-[32ch] text-sm leading-relaxed font-light text-white/40">
          {t(
            "hero.tagline",
            "Progettiamo siti web su misura che elevano il valore percepito del tuo brand.",
          )}
        </p>
      </Reveal>

      {/* Full-width stacked buttons rather than a wrapped row. A phone has one
          thumb; two pills side by side on a 375px screen are both too narrow
          to read and too small to hit comfortably. */}
      <Reveal delay={0.6} className="relative z-10 mt-10 flex w-full max-w-[20rem] flex-col gap-3">
        <a
          href="#contact"
          className="font-mono-spec flex h-14 items-center justify-center rounded-full bg-white text-[11px] font-medium tracking-[0.25em] text-black uppercase"
        >
          {t("hero.cta", "Richiedi un preventivo")}
        </a>
        <a
          href="#projects"
          className="font-mono-spec flex h-14 items-center justify-center rounded-full border border-white/15 text-[11px] tracking-[0.25em] text-white/80 uppercase"
        >
          {t("hero.secondaryCta", "Guarda i lavori")}
        </a>
      </Reveal>

      {/* Pinned to the bottom edge rather than sitting in the stack, so the
          copy above stays optically centred on the screen instead of being
          pushed high by a cue almost nobody reads. */}
      <Reveal
        delay={0.85}
        className="absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-2"
      >
        <span className="font-mono-spec text-[9px] tracking-[0.35em] text-white/30 uppercase">
          {t("hero.scroll")}
        </span>
        <span
          aria-hidden
          className="hero-scroll-rule relative h-8 w-px overflow-hidden bg-white/10"
        >
          <span className="absolute inset-x-0 top-0 h-3 bg-white/50" />
        </span>
      </Reveal>
    </section>
  );
}

/**
 * The desktop hero's second act, given its own screen.
 *
 * On the desktop this is a scroll-pinned reveal over the WebGL object; here it
 * is simply the next thing you reach, with nothing else on screen. Keeping it
 * as a separate beat rather than folding it under the masthead copy is what
 * stops the opening from becoming a wall of four stacked claims.
 */
export function MobileHeroCoda() {
  const { t } = useTranslation();

  return (
    <section className="flex min-h-[70svh] flex-col justify-center bg-black px-6 py-24 text-center">
      <h2 className="font-display text-[2.3rem] leading-[1.08] font-bold tracking-[-0.03em] text-balance text-white">
        <MaskWords text={t("hero.actTwoTitle2")} />
      </h2>
      <Reveal delay={0.15} className="mt-5">
        <p className="mx-auto max-w-[30ch] text-base leading-relaxed font-light text-white/50">
          {t("hero.actTwoSub2")}
        </p>
      </Reveal>
    </section>
  );
}
