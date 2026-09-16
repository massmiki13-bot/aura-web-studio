"use client";

import { useTranslation } from "react-i18next";

import { MaskWords, Reveal } from "@/components/mobile/motion";

type Offer = { title: string; desc: string };
type Step = { title: string };

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
    <section id="services" className="relative bg-black px-6 py-28">
      {/* Process: three lines, each its own beat. Large type, no cards — this
          is the studio talking, and boxing it would make it read as a
          feature list. */}
      <ol className="space-y-16 text-center">
        {steps.map((step) => (
          <li key={step.title}>
            <h3 className="font-display mx-auto max-w-[18ch] text-[1.75rem] leading-[1.14] font-bold tracking-[-0.025em] text-balance text-white">
              <MaskWords text={step.title} stagger={0.04} />
            </h3>
          </li>
        ))}
      </ol>

      <div className="mx-auto mt-24 h-px w-16 bg-white/15" />

      <ul className="mt-16 divide-y divide-white/8">
        {offers.map((offer, i) => (
          <Reveal as="li" key={offer.title} delay={i * 0.06}>
            {/* A ruled list, not a stack of boxes. Four bordered cards in a
                column is the default a template would produce; rules give the
                same separation without drawing four competing rectangles. */}
            <article className="py-7">
              <h4 className="font-display text-[1.3rem] leading-tight font-bold tracking-tight text-white">
                {offer.title}
              </h4>
              <p className="mt-2 max-w-[34ch] text-[0.95rem] leading-relaxed text-white/45">
                {offer.desc}
              </p>
            </article>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
