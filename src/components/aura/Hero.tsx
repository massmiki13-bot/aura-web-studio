import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { ParticleHero } from "./ParticleHero";

export function Hero() {
  const { t } = useTranslation();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);
  const opacity = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.4, 0]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -120]);

  return (
    <section id="hero" ref={ref} className="relative h-screen w-full overflow-hidden bg-black">
      <motion.div
        style={{ scale, opacity, willChange: "transform, opacity", translateZ: 0 }}
        className="absolute inset-0"
      >
        <ParticleHero />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black pointer-events-none" />
      <motion.div
        style={{ y: textY, opacity, willChange: "transform, opacity" }}
        className="relative z-10 h-full w-full flex flex-col items-center justify-center px-6 text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="font-mono-spec text-[10px] sm:text-xs uppercase tracking-[0.4em] text-primary mb-8"
        >
          {t("hero.badge")}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-5xl sm:text-7xl md:text-[8rem] font-bold leading-[0.9] tracking-tighter text-white max-w-6xl"
        >
          Aura Web
          <br />
          <span className="text-gradient-aura italic block">Studio</span>
        </motion.h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-3 z-10"
      >
        <span className="font-mono-spec text-[10px] uppercase tracking-[0.3em] text-white/40">
          {t("hero.scroll")}
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="h-10 w-px bg-gradient-to-b from-primary to-transparent"
        />
      </motion.div>
    </section>
  );
}
