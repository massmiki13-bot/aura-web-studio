"use client";

import { useTranslation } from "react-i18next";

import { MaskWords, Reveal } from "@/components/mobile/motion";

type Offer = { title: string; desc: string };
type Step = { kicker: string; title: string };

/**
 * What the studio sells, and how it works.
 *
 * The desktop puts both of these on screen at once — the three process steps
 * scrub past a WebGL scene while the offers sit beside it. On a phone the
 * scene was cut, which left the offers stranded as four plain cards under a
 * screen of dead black, and the three process steps were dropped entirely.
 * Dropping them lost real copy, so they are back here, as the section's
 * opening statement.
 *
 * The cards are numbered because a phone shows two at a time: the numbers are
 * what tell the visitor the list has an end.
 */
export function MobileServices() {
  const { t } = useTranslation();

  // `returnObjects` gives back the arrays declared in @/i18n, so the wording
  // and the ordering stay shared with the desktop rather than copied.
  const steps = t("services.steps", { returnObjects: true }) as Step[];
  const offers = t("services.mobileItems", { returnObjects: true }) as Offer[];

  return (
    <section id="services" className="relative bg-black px-6 py-24">
      {/* Process: three lines, each its own beat. Large type, no cards — this
          is the studio talking, and boxing it would make it read as a
          feature list. */}
      <ol className="space-y-10">
        {steps.map((step, i) => (
          <li key={step.kicker}>
            <Reveal delay={i * 0.05}>
              <span className="font-mono-spec text-[10px] tracking-[0.28em] text-white/35 uppercase">
                {step.kicker}
              </span>
            </Reveal>
            <h3 className="font-display mt-2 text-[1.6rem] leading-[1.15] font-bold tracking-[-0.02em] text-white">
              <MaskWords text={step.title} stagger={0.04} />
            </h3>
          </li>
        ))}
      </ol>

      <div className="mt-20 h-px w-full bg-white/10" />

      <ul className="mt-12 space-y-4">
        {offers.map((offer, i) => (
          <Reveal as="li" key={offer.title} delay={i * 0.06}>
            <article className="flex gap-5 rounded-[1.25rem] border border-white/10 bg-neutral-950 p-6">
              <span
                aria-hidden
                className="font-mono-spec pt-0.5 text-[11px] tracking-widest text-white/30 tabular-nums"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0">
                <h4 className="font-display text-lg leading-tight font-bold tracking-tight text-white">
                  {offer.title}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-white/55">{offer.desc}</p>
              </div>
            </article>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
