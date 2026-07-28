import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ScrollTrigger } from "@/lib/gsap";
import { SplineScene } from "./SplineScene";

/**
 * "Cosa offriamo": a full-screen section whose entire space is the mouse-
 * interactive Spline scene. Previously an R3F staircase with a procedural coin
 * climbing it under two crossfading headlines; that set piece and its captions
 * have been removed so the Spline animation stands on its own. Only the small
 * section label and the approach reveal-fade remain.
 */

export function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const fadeInRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const fadeIn = fadeInRef.current;
    if (!section || !fadeIn) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // The scene brightens *while the section travels up into view* — after
    // the hero's dissolve, the viewport used to show a full screen-height of
    // dead black before it faded in. Tying the reveal to the approach instead
    // means the space is already emerging as it arrives.
    const reveal = ScrollTrigger.create({
      trigger: section,
      start: "top bottom",
      end: "top top",
      scrub: true,
      onUpdate: (self) => {
        // Ease-out on the reveal: most of the brightening happens early in
        // the approach, so the dark bridge from the hero reads as a beat.
        const v = Math.pow(1 - self.progress, 1.7);
        fadeIn.style.opacity = String(v);
        // Once fully transparent the overlay is also visibility:hidden, so
        // the compositor stops blending a fullscreen no-op layer every frame.
        fadeIn.style.visibility = v <= 0.001 ? "hidden" : "visible";
      },
    });

    return () => {
      reveal.kill();
    };
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      {/* The Spline scene fills the section and receives pointer events so it
          reacts to the mouse the same way it does in the Spline editor. */}
      <div className="absolute inset-0">
        <SplineScene className="absolute inset-0" />
      </div>

      <ServicesLabel />
      {/* Reveal overlay stays click-through so it never blocks the scene. */}
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
