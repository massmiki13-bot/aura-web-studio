import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import type { SPEObject } from "@splinetool/runtime";
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
const CROSSFADE_START = 0.4; // fraction of the pin where the caption crossfade begins
const CROSSFADE_END = 0.62; // ...and where it finishes

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const fadeInRef = useRef<HTMLDivElement>(null);
  // Cached once on load — findObjectByName walks the whole scene graph, far
  // too expensive to call twice per scrubbed scroll frame.
  const captionsRef = useRef<{ first?: SPEObject; second?: SPEObject }>({});

  useEffect(() => {
    const section = sectionRef.current;
    const fadeIn = fadeInRef.current;
    if (!section || !fadeIn) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // The scene brightens *while the section travels up into view* — after
    // the hero's dissolve, the viewport used to show a full screen-height of
    // dead black before the pin started and only then faded in. Tying the
    // reveal to the approach instead means the columns are already emerging
    // as they arrive, and are fully lit the moment the pin engages.
    const reveal = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "top top",
      scrub: true,
      onUpdate: (self) => {
        // Ease-out on the reveal: most of the brightening happens early in
        // the approach, so the dark bridge from the hero reads as a beat,
        // not a stretch.
        const v = Math.pow(1 - self.progress, 1.7);
        fadeIn.style.opacity = String(v);
        // Once fully transparent the overlay is also visibility:hidden, so
        // the compositor stops blending a fullscreen no-op layer every frame.
        fadeIn.style.visibility = v <= 0.001 ? "hidden" : "visible";
      },
    });

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=180%",
      // scrub: true — Lenis already smooths the scroll; see Hero for why a
      // second smoothing layer here makes the fades lag the 3D scene.
      scrub: true,
      pin: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        // Cross-dissolve the two captions via their material's alpha rather
        // than a hard hide()/show() cut — smooth, gradual handoff between
        // the first and second line as the coin moves across the columns.
        const t = Math.min(
          Math.max((self.progress - CROSSFADE_START) / (CROSSFADE_END - CROSSFADE_START), 0),
          1,
        );
        const { first, second } = captionsRef.current;
        if (first?.material) first.material.alpha = 1 - t;
        if (second?.material) second.material.alpha = t;
      },
    });

    return () => {
      reveal.kill();
      trigger.kill();
    };
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      <SplineScene
        scene={COLUMNS_SCENE}
        className="absolute inset-0"
        onSplineLoad={(app) => {
          captionsRef.current = {
            first: app.findObjectByName("Text"),
            second: app.findObjectByName("Text 3"),
          };
          // Start on the first caption only — the second stays fully
          // transparent (not hidden, so its alpha can be tweened) until the
          // crossfade window is reached.
          const second = captionsRef.current.second;
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
