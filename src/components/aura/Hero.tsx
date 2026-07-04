import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { gsap } from "@/lib/gsap";
import { SplineScene } from "./SplineScene";
import { ShaderBackground } from "@/components/ui/shader-background";
import { FloatingShapesBackground } from "@/components/ui/floating-shapes-background";

// Spline's CDN doesn't send cache-busting headers, so browsers happily keep
// serving a stale scene after we publish edits in the editor. Bump this
// version query whenever the scene is updated there.
const MACBOOK_SCENE = "https://prod.spline.design/XQvITXgf5wat-lmy/scene.splinecode?v=5";

/**
 * The hero has two acts within a single pinned scroll span: first a
 * full-screen title card (shader background + our headline, no laptop in
 * sight) gets its own moment, then it dissolves into the Macbook scene
 * (which drives its own scroll-triggered opening natively). The handoff to
 * the next section at the end is a short black dissolve, not a hard cut.
 */
export function Hero() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const macbookRef = useRef<HTMLDivElement>(null);
  const fadeOutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const macbook = macbookRef.current;
    const fadeOut = fadeOutRef.current;
    if (!section || !title || !macbook || !fadeOut) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.set(macbook, { opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=200%",
          scrub: 0.8,
          pin: true,
        },
      });
      tl.to(title, { opacity: 0, y: -30, duration: 0.1 }, 0.1)
        .to(macbook, { opacity: 1, duration: 0.1 }, 0.12)
        // Short dissolve to black right at the end of the pin, so the
        // handoff to the next section reads as an (almost) instant fade
        // instead of a long dead stretch of scrolling through black.
        .to(fadeOut, { opacity: 1, duration: 0.08 }, 0.92);
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      {/* Act one: full-screen title card, no laptop in view yet. */}
      <div ref={titleRef} className="absolute inset-0 z-10">
        <div className="absolute inset-0 opacity-70">
          <ShaderBackground />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/60 pointer-events-none" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <p className="font-mono-spec text-xs uppercase tracking-[0.4em] text-white/50 mb-8">
            {t("hero.badge")}
          </p>
          <h1 className="font-display text-6xl sm:text-8xl md:text-9xl font-bold leading-[0.9] tracking-tighter text-white">
            Aura Web
            <br />
            <span className="text-gradient-aura">Studio</span>
          </h1>
          <p className="mt-8 text-lg md:text-xl text-white/60 font-light leading-relaxed max-w-lg">
            {t("hero.tagline", "Progettiamo siti web su misura che elevano il valore percepito del tuo brand.")}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-full bg-white text-black px-8 py-4 font-mono-spec text-xs uppercase tracking-[0.25em] font-medium hover:bg-white/90 transition-colors"
            >
              {t("hero.cta", "Richiedi un preventivo")}
            </a>
            <a
              href="#projects"
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-8 py-4 font-mono-spec text-xs uppercase tracking-[0.25em] text-white/80 hover:border-white/40 hover:text-white transition-colors"
            >
              {t("hero.secondaryCta", "Guarda i lavori")}
            </a>
          </div>
        </div>
      </div>

      {/* Act two: the laptop, hidden until the title card has made its case. */}
      <div ref={macbookRef} className="absolute inset-0 z-0">
        {/* Strictly behind the laptop — the Spline canvas paints an opaque
            background over its full area, so this is invisible once the
            laptop is on screen. That's intentional: nothing may render on
            top of the 3D model, only behind it. */}
        <FloatingShapesBackground className="z-0" />
        <SplineScene scene={MACBOOK_SCENE} className="absolute inset-0 z-10" eager />
      </div>

      <div className="absolute bottom-10 left-0 right-0 z-20 flex flex-col items-center gap-3 pointer-events-none">
        <span className="font-mono-spec text-[10px] uppercase tracking-[0.3em] text-white/30">
          {t("hero.scroll")}
        </span>
        <div className="h-10 w-px bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
      </div>

      <div ref={fadeOutRef} className="absolute inset-0 z-30 bg-black opacity-0 pointer-events-none" />
    </section>
  );
}
