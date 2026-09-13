"use client";

import { useTranslation } from "react-i18next";

import { MaskWords, Reveal } from "@/components/mobile/motion";

/**
 * The phone masthead.
 *
 * What it replaces was the desktop hero with its WebGL layers switched off,
 * which left a gradient sphere, the word "Scorri", and no headline at all —
 * the title lived in a scroll-pinned second act that a phone visitor only
 * reached after roughly three screens of black. The first thing anyone saw of
 * the studio said nothing about it.
 *
 * So the order is inverted here: the claim arrives first, unprompted, in the
 * first frame. Both of the desktop's two acts are shown, stacked, because on
 * a phone they are two short paragraphs rather than two full screens — the
 * second one ("Estetica che converte") carries the commercial argument and
 * dropping it would be dropping content, which is not what was asked for.
 *
 * The orb stays, as a CSS gradient. It is the one piece of the desktop
 * identity that survives translation intact, and it costs nothing: no canvas,
 * no context, no runtime.
 */
export function MobileHero() {
  const { t } = useTranslation();

  return (
    <section
      id="hero"
      // min-h rather than h: at 100svh with a large accessibility font the
      // stack would otherwise be taller than its own section and clip.
      className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-black px-6 pt-28 pb-12"
    >
      {/* The orb. Deliberately behind and off-centre: it frames the type
          instead of competing with it, which is what it was doing when it sat
          alone in the middle of an empty screen.

          -z-0 with the content at z-10 rather than `absolute inset-0` on a
          wrapper, so it can bleed past the right edge without giving the
          document a horizontal scrollbar — overflow-hidden on the section
          clips it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-32 -z-0 size-[26rem] rounded-full opacity-70 blur-[2px]"
        style={{
          background:
            "radial-gradient(circle at 32% 28%, rgba(255,255,255,0.92) 0%, rgba(168,160,205,0.45) 18%, rgba(60,54,96,0.55) 42%, rgba(8,8,12,0.95) 72%)",
        }}
      />
      {/* A second, much wider wash low on the screen. Stops the type from
          sitting on flat black, which is what made the section read as empty
          rather than dark. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-24 -z-0 size-[30rem] rounded-full opacity-40 blur-[90px]"
        style={{ background: "radial-gradient(circle, rgba(120,110,180,0.55), transparent 70%)" }}
      />

      <div className="relative z-10">
        <Reveal delay={0.05}>
          <p className="font-mono-spec text-[10px] tracking-[0.28em] text-white/45 uppercase">
            {t("hero.badge")}
          </p>
        </Reveal>

        {/* The one <h1> on the page. leading-[1.05], not tighter: MaskWords
            clips each word to its own line box, and a line-height under 1
            shears the descenders off. */}
        <h1 className="font-display mt-5 text-[2.75rem] leading-[1.05] font-bold tracking-[-0.03em] text-white">
          <MaskWords text={t("hero.actTwoTitle")} delay={0.15} />
        </h1>

        <Reveal delay={0.5} className="mt-5">
          <p className="max-w-[34ch] text-[0.95rem] leading-relaxed text-white/65">
            {t("hero.actTwoSub")}
          </p>
        </Reveal>

        {/* Act two of the desktop hero, kept as a hairline-separated coda
            rather than a second screen. */}
        <Reveal delay={0.62} className="mt-8 border-t border-white/10 pt-6">
          <p className="font-display text-xl leading-tight font-bold tracking-tight text-white/90">
            {t("hero.actTwoTitle2")}
          </p>
          <p className="mt-2 max-w-[34ch] text-sm leading-relaxed text-white/55">
            {t("hero.actTwoSub2")}
          </p>
        </Reveal>

        <Reveal delay={0.78} className="mt-10 flex items-center gap-3">
          <span className="font-mono-spec text-[10px] tracking-[0.28em] text-white/40 uppercase">
            {t("hero.scroll")}
          </span>
          {/* The line the eye follows down. A looping transform on a 1px rule
              — no layout, no paint, and it stops itself under
              prefers-reduced-motion via the class's own media query. */}
          <span
            aria-hidden
            className="hero-scroll-rule relative h-px w-16 overflow-hidden bg-white/15"
          >
            <span className="absolute inset-y-0 left-0 w-6 bg-white/70" />
          </span>
        </Reveal>
      </div>
    </section>
  );
}
