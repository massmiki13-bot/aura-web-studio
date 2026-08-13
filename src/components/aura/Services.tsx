import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ScrollTrigger } from "@/lib/gsap";
import { useIsDesktopViewport } from "@/hooks/use-desktop-viewport";
import { tList } from "@/lib/utils";
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
  const isDesktop = useIsDesktopViewport();

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
      // Desktop keeps the exact original box (h-screen, clipped) since it's
      // a full-bleed backdrop for the Spline scene. Mobile sizes to its own
      // content instead — it previously carried `min-h-screen` from when a
      // full-bleed scene lived here, which left a screen-height of dead black
      // under the last offer card before the next section.
      className="relative md:h-screen w-full overflow-visible md:overflow-hidden bg-black"
    >
      {/* The Spline scene fills the section and receives pointer events so it
          reacts to the mouse the same way it does in the Spline editor.
          Desktop-only: the scene's camera framing is authored for a wide
          viewport and doesn't recompose for a narrow, tall one, and the
          runtime alone is several megabytes plus a long parse.

          Gated on `=== true`, not `!== false`. On the render before the media
          query is measured `isDesktop` is null, and rendering <SplineScene>
          for even that one pass was enough: its mount effect registers the
          runtime pre-warm on the boot/scroll-intent gates, and those fire
          later regardless of whether the component is still mounted. Phones
          were still downloading and parsing the whole Spline runtime for a
          scene they never showed. */}
      {isDesktop === true && (
        <div className="absolute inset-0">
          <SplineScene className="absolute inset-0" />
        </div>
      )}

      {/* Mobile replacement: what used to be a Spline scene (badly cropped at
          a portrait aspect ratio) is now a short list of concrete offerings —
          in normal flow, not absolute, so the section grows to fit it instead
          of clipping. Rendered while `isDesktop` is still null too, so the
          section is never momentarily empty on a phone. */}
      {isDesktop !== true && (
        <div className="md:hidden pt-32 pb-16 px-6">
          <ServicesMobileOffer />
        </div>
      )}

      <ServicesLabel />
      {/* Reveal overlay stays click-through so it never blocks the scene. */}
      <div ref={fadeInRef} className="absolute inset-0 z-20 bg-black pointer-events-none" />
    </section>
  );
}

/**
 * Mobile-only "what we offer" cards — replaces the desktop Spline scene,
 * which is a decorative backdrop rather than actual content, with concrete,
 * scannable offerings. Same solid-card language used elsewhere on the site
 * (bg-neutral-950 + border, not the shared translucent .glass utility).
 */
function ServicesMobileOffer() {
  const { t } = useTranslation();
  // Guarded, never cast: a transient SSR/i18n resource-loading race must not
  // crash the page. Empty list means the cards don't render, not a 500.
  const items = tList<{ title: string; desc: string }>(
    t("services.mobileItems", { returnObjects: true }),
  );
  return (
    <div className="relative z-10 space-y-4">
      {items.map((item) => (
        <div key={item.title} className="bg-neutral-950 rounded-2xl border border-white/10 p-5">
          <h3 className="font-display text-lg font-semibold tracking-tight text-white mb-1.5">
            {item.title}
          </h3>
          <p className="text-white/60 text-sm font-light leading-relaxed">{item.desc}</p>
        </div>
      ))}
    </div>
  );
}

function ServicesLabel() {
  const { t } = useTranslation();
  return (
    <p className="absolute top-16 md:top-20 left-1/2 -translate-x-1/2 z-10 font-mono-spec text-[11px] uppercase tracking-[0.35em] text-white/50 pointer-events-none">
      {t("services.label", "Cosa offriamo")}
    </p>
  );
}
