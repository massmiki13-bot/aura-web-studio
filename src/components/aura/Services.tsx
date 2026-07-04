import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import type { Application } from "@splinetool/runtime";
import { ScrollTrigger } from "@/lib/gsap";
import { SplineScene } from "./SplineScene";

// Spline's CDN doesn't send cache-busting headers, so bump this version
// query whenever the scene is updated in the editor.
const COLUMNS_SCENE = "https://prod.spline.design/nFN858rUaWOUlNsP/scene.splinecode?v=6";

/**
 * This scene is ours (owned in our Spline account): a row of columns with a
 * coin and two captions ("Text" and "Text 3"). The scene ships with an
 * empty/unused Timeline, so its internal interaction graph doesn't actually
 * drive anything on scroll — we drive the caption swap ourselves via the
 * documented runtime API (show()/hide() on the named objects) instead of
 * fighting an authoring setup we can't see into.
 */
const FADE_IN_END = 0.06; // fraction of the pin spent emerging from black — kept short so the handoff from the hero feels near-instant
const CROSSFADE_START = 0.4; // fraction of the pin where the caption crossfade begins
const CROSSFADE_END = 0.62; // ...and where it finishes

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const fadeInRef = useRef<HTMLDivElement>(null);
  const splineAppRef = useRef<Application | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const fadeIn = fadeInRef.current;
    if (!section || !fadeIn) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=180%",
      scrub: 0.8,
      pin: true,
      onUpdate: (self) => {
        // Emerges from black over a short opening stretch of the pin, so the
        // handoff from the hero (which dissolves to black) reads as one
        // continuous, near-instant fade rather than a dead stretch of black.
        const fadeProgress = Math.min(self.progress / FADE_IN_END, 1);
        fadeIn.style.opacity = String(1 - fadeProgress);

        const app = splineAppRef.current;
        if (!app) return;

        // Cross-dissolve the two captions via their material's alpha rather
        // than a hard hide()/show() cut — smooth, gradual handoff between
        // the first and second line as the coin moves across the columns.
        const t = Math.min(
          Math.max((self.progress - CROSSFADE_START) / (CROSSFADE_END - CROSSFADE_START), 0),
          1,
        );
        const first = app.findObjectByName("Text");
        const second = app.findObjectByName("Text 3");
        if (first?.material) first.material.alpha = 1 - t;
        if (second?.material) second.material.alpha = t;
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <section id="services" ref={sectionRef} className="relative h-screen w-full overflow-hidden bg-black">
      <SplineScene
        scene={COLUMNS_SCENE}
        className="absolute inset-0"
        onSplineLoad={(app) => {
          splineAppRef.current = app;
          // Start on the first caption only — the second stays fully
          // transparent (not hidden, so its alpha can be tweened) until the
          // crossfade window is reached.
          const second = app.findObjectByName("Text 3");
          if (second?.material) second.material.alpha = 0;
        }}
      />
      <ServicesLabel />
      <div ref={fadeInRef} className="absolute inset-0 z-20 bg-black pointer-events-none" />
    </section>
  );
}

function ServicesLabel() {
  const { t } = useTranslation();
  return (
    <p className="absolute top-16 md:top-20 left-1/2 -translate-x-1/2 z-10 font-mono-spec text-[11px] uppercase tracking-[0.35em] text-white/50 pointer-events-none">
      {t("services.label", "// Cosa offriamo")}
    </p>
  );
}
