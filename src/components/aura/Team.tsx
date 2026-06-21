import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export function Team() {
  const { t } = useTranslation();
  const morphFrames = [
    { label: t("product.frames.landing"), accent: "oklch(0.85 0.18 200)" },
    { label: t("product.frames.showcase"), accent: "oklch(0.78 0.22 280)" },
    { label: t("product.frames.shop"), accent: "oklch(0.82 0.2 340)" },
    { label: t("product.frames.webapp"), accent: "oklch(0.85 0.18 150)" },
  ];
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
          <span className="text-gradient-aura italic">{t("product.headingHighlight")}</span>
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

        <MorphingScreen frames={morphFrames} />

        <section
          id="pricing-cta"
          className="relative pt-32 pb-24 md:pt-96 overflow-hidden flex flex-col justify-center px-6 md:px-16 mt-44"
        >
          <div className="relative max-w-5xl mx-auto w-full text-center flex flex-col items-center z-10">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6 }}
              className="font-mono-spec text-[10px] uppercase tracking-[0.3em] text-primary mb-6"
            >
              {t("product.pricingLabel")}
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-4xl md:text-7xl font-bold leading-[0.95] tracking-tighter text-white max-w-3xl"
            >
              {t("product.pricingHeadingLine1")}
              <br />
              {t("product.pricingHeadingPre")}
              <span className="text-gradient-aura italic pr-3">
                {t("product.pricingHeadingHighlight")}
              </span>
            </motion.h2>
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
              <Link to="/pricing" className="block w-full cursor-pointer">
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

function MorphingScreen({ frames }: { frames: { label: string; accent: string }[] }) {
  const { t } = useTranslation();
  const wrap = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start end", "end start"] });
  // Map scroll progress to active frame index
  const indexMV = useTransform(scrollYProgress, [0.1, 0.9], [0, frames.length - 0.001]);

  return (
    <div ref={wrap} className="mt-20 relative">
      <div className="grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-4">
          <p className="font-mono-spec text-[10px] uppercase tracking-[0.3em] text-primary">
            {t("product.morphLabel")}
          </p>
          <h3 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-white">
            {t("product.morphTitlePre")}
            <span className="text-gradient-aura italic pr-3">
              {t("product.morphTitleHighlight")}
            </span>
            .
          </h3>
          <p className="text-white/55">{t("product.morphParagraph")}</p>
          <div className="flex flex-wrap gap-2 pt-2">
            {frames.map((f) => (
              <span
                key={f.label}
                className="glass rounded-full px-3 py-1.5 font-mono-spec text-[10px] uppercase tracking-widest text-white/70"
              >
                {f.label}
              </span>
            ))}
          </div>
        </div>

        <div className="relative aspect-[4/3] w-full glass rounded-3xl overflow-hidden">
          <div className="absolute inset-0 noise-bg opacity-40 pointer-events-none" />
          {/* browser chrome */}
          <div className="absolute top-0 left-0 right-0 h-9 flex items-center gap-1.5 px-4 border-b border-white/10 bg-black/40 backdrop-blur z-20">
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
            <span className="ml-3 font-mono-spec text-[10px] uppercase tracking-widest text-white/40">
              aura.studio
            </span>
          </div>

          {frames.map((f, i) => (
            <FrameLayer key={f.label} index={i} indexMV={indexMV} frame={f} total={frames.length} />
          ))}
        </div>
      </div>
    </div>
  );
}

function FrameLayer({
  index,
  indexMV,
  frame,
  total,
}: {
  index: number;
  indexMV: MotionValue<number>;
  frame: { label: string; accent: string };
  total: number;
}) {
  // opacity peaks at index, fades out before next
  const opacity = useTransform<number, number>(indexMV, (v) => {
    const clamped = Math.max(0, Math.min(total - 0.001, v));
    const d = Math.abs(clamped - index);
    return Math.max(0, 1 - d * 1.4);
  });
  const y = useTransform<number, number>(indexMV, (v) => {
    const clamped = Math.max(0, Math.min(total - 0.001, v));
    return (clamped - index) * 30;
  });

  return (
    <motion.div
      style={{ opacity, y, willChange: "transform, opacity" }}
      className="absolute inset-0 pt-9 px-6 pb-6 flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1.5">
          <div className="h-2 w-20 rounded-full" style={{ background: frame.accent }} />
          <div className="h-3 w-32 rounded-full bg-white/30" />
        </div>
        <div className="flex gap-1.5">
          {Array.from({ length: 3 }).map((_, j) => (
            <div key={j} className="h-2 w-8 rounded-full bg-white/15" />
          ))}
        </div>
      </div>
      {/* unique layout per frame */}
      {index === 0 && (
        <div className="flex-1 grid place-items-center">
          <div className="text-center space-y-2">
            <div className="h-4 w-48 mx-auto rounded-full bg-white/40" />
            <div className="h-2 w-32 mx-auto rounded-full bg-white/15" />
            <div
              className="mt-3 inline-block h-6 w-24 rounded-full"
              style={{ background: frame.accent }}
            />
          </div>
        </div>
      )}
      {index === 1 && (
        <div className="flex-1 grid grid-cols-3 gap-2">
          {Array.from({ length: 6 }).map((_, j) => (
            <div key={j} className="rounded-lg bg-white/10 border border-white/10" />
          ))}
        </div>
      )}
      {index === 2 && (
        <div className="flex-1 grid grid-cols-3 gap-2">
          {Array.from({ length: 6 }).map((_, j) => (
            <div
              key={j}
              className="rounded-lg bg-white/5 border border-white/10 p-2 flex flex-col justify-between"
            >
              <div
                className="aspect-square rounded-md"
                style={{ background: frame.accent, opacity: 0.4 }}
              />
              <div className="space-y-1">
                <div className="h-1.5 w-10 rounded bg-white/40" />
                <div className="h-1.5 w-6 rounded" style={{ background: frame.accent }} />
              </div>
            </div>
          ))}
        </div>
      )}
      {index === 3 && (
        <div className="flex-1 flex gap-2">
          <div className="w-1/4 rounded-lg bg-white/10 border border-white/10 p-2 space-y-1.5">
            {Array.from({ length: 5 }).map((_, j) => (
              <div key={j} className="h-2 rounded bg-white/15" />
            ))}
          </div>
          <div className="flex-1 grid grid-cols-2 gap-2">
            <div className="rounded-lg bg-white/5 border border-white/10 p-2 flex flex-col gap-1.5">
              <div className="h-2 w-16 rounded bg-white/30" />
              <div
                className="flex-1 rounded"
                style={{ background: `linear-gradient(135deg, ${frame.accent}, transparent)` }}
              />
            </div>
            <div className="rounded-lg bg-white/5 border border-white/10 p-2 space-y-1.5">
              <div className="h-2 w-12 rounded bg-white/30" />
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="h-1.5 rounded bg-white/15" />
              ))}
            </div>
            <div className="col-span-2 rounded-lg bg-white/5 border border-white/10 h-12 p-2 flex items-center gap-2">
              <div className="h-6 w-6 rounded-full" style={{ background: frame.accent }} />
              <div className="flex-1 h-1.5 rounded bg-white/15" />
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between pt-1">
        <span
          className="font-mono-spec text-[10px] uppercase tracking-widest"
          style={{ color: frame.accent }}
        >
          / {String(index + 1).padStart(2, "0")} {frame.label}
        </span>
        <span className="font-mono-spec text-[10px] uppercase tracking-widest text-white/30">
          {index + 1} / {total}
        </span>
      </div>
    </motion.div>
  );
}
