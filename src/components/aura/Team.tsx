import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { ServicesShowcase } from "./ServicesShowcase";
import { ParticleText } from "@/components/ui/particle-text";
import { getLocaleFromPathname } from "@/i18n";
import { localizedPath } from "@/lib/seo";

export function Team() {
  const { t } = useTranslation();
  const locale = getLocaleFromPathname(useRouterState({ select: (s) => s.location.pathname }));
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgX = useTransform(scrollYProgress, [0, 1], ["0%", "-40%"]);

  return (
    <section
      id="team"
      ref={ref}
      className="relative bg-black pt-32 pb-4 md:pt-48 md:pb-16 overflow-hidden"
    >
      <motion.div
        style={{ x: bgX, willChange: "transform" }}
        className="absolute top-1/2 -translate-y-1/2 left-0 whitespace-nowrap font-display text-[18vw] font-bold tracking-tighter text-white/[0.04] pointer-events-none select-none"
      >
        ECOSYSTEM · ECOSYSTEM · ECOSYSTEM ·
      </motion.div>

      <div className="relative px-6 md:px-16 max-w-7xl mx-auto">
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="font-mono-spec text-[10px] uppercase tracking-[0.3em] text-primary mb-6"
        >
          {t("product.label")}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-4xl md:text-7xl font-bold leading-[0.95] tracking-tighter text-white max-w-5xl"
        >
          {t("product.headingPre")}
          <span className="text-gradient-aura italic pr-5">{t("product.headingHighlight")}</span>
          {t("product.headingPost")}
          <br />
          {t("product.headingLine2")}
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="mt-8 text-white/55 text-base md:text-lg max-w-2xl"
        >
          {t("product.paragraph")}
        </motion.p>

        <ServicesShowcase />

        <section
          id="pricing-cta"
          className="relative pt-32 pb-24 md:pt-96 overflow-hidden flex flex-col justify-center px-6 md:px-16 mt-44"
        >
          <div className="relative w-full text-center flex flex-col items-center z-10">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6 }}
              className="font-mono-spec text-[10px] uppercase tracking-[0.3em] text-primary mb-6"
            >
              {t("product.pricingLabel")}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            // Full section width (not the narrower max-w-5xl column below) so
            // particles have real room to travel in from the edges instead
            // of a small centered box.
            className="relative z-10 w-full"
          >
            <ParticleText
              words={[
                t("product.pricingHeadingLine1"),
                `${t("product.pricingHeadingPre")}${t("product.pricingHeadingHighlight")}`,
              ]}
              className="h-[220px] sm:h-[280px] md:h-[360px] w-full"
            />
          </motion.div>

          <div className="relative max-w-5xl mx-auto w-full text-center flex flex-col items-center z-10">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 0.15 }}
              className="mt-8 text-white/55 text-base md:text-lg max-w-2xl leading-relaxed font-light"
            >
              {t("product.pricingParagraph")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="mt-12 w-full max-w-xs"
            >
              <Link to={localizedPath(locale, "pricing")} className="block w-full cursor-pointer">
                <button
                  type="submit"
                  className="w-full cursor-pointer hover:shadow-(--shadow-neon) transition-shadow duration-300 rounded-full py-4 px-6 font-mono-spec text-xs uppercase tracking-[0.3em] text-black text-center transition-opacity"
                  style={{
                    background: "var(--gradient-aura)",
                    boxShadow: "",
                  }}
                >
                  {t("product.pricingCta")}
                </button>
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </section>
  );
}
