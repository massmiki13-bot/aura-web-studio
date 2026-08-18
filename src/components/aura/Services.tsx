"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsDesktopViewport } from "@/hooks/use-desktop-viewport";
import { tList } from "@/lib/utils";
import { ChromeCrystal } from "@/components/three/ChromeCrystal";

/**
 * "Cosa offriamo": a full-screen section whose entire space is the chrome
 * crystal. It has held a Spline scene, an R3F staircase with a procedural coin
 * and a WebGPU depth-scan before this; only the small section label and the
 * approach reveal-fade have survived all of them.
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
      // a full-bleed backdrop for the canvas. Mobile sizes to its own
      // content instead — it previously carried `min-h-screen` from when a
      // full-bleed scene lived here, which left a screen-height of dead black
      // under the last offer card before the next section.
      className="relative md:h-screen w-full overflow-visible md:overflow-hidden bg-black"
    >
      {/* The crystal fills the section. Desktop-only: it is framed for a wide
          viewport and reads as a cropped smear on a narrow, tall one, and a
          phone has better uses for a GPU context than this.

          Gated on `=== true`, not `!== false`. On the render before the media
          query is measured `isDesktop` is null, and rendering the scene for
          even that one pass used to be enough to start work that outlived the
          component — the Spline wrapper registered a multi-megabyte runtime
          pre-warm on gates that fired later whether or not it was still
          mounted. The strict gate is cheap insurance and stays. */}
      {isDesktop === true && (
        <ChromeCrystal className="absolute inset-0" fullBleed offsetX={0.44} />
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

      {isDesktop === true && <ServicesSteps />}
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

/**
 * The three headers that cross-fade down the left of the section as the
 * visitor scrolls through it.
 *
 * The section is pinned for two extra screens and the timeline is scrubbed
 * against that, so the copy is tied to scroll position rather than played on a
 * timer — scroll back up and it runs backwards, exactly in step.
 *
 * Built to stay smooth under the two things that usually ruin this:
 *
 * - `scrub: true`, not a smoothed number. Lenis already smooths the scroll
 *   itself, and a second smoothing layer here makes the copy visibly trail the
 *   rest of the page — the hero learned this the same way, see Hero.
 * - No React state in the loop. GSAP writes opacity and transform straight to
 *   the DOM nodes, so a scrubbed frame costs no render, no reconciliation and
 *   no layout; both properties are compositor-only.
 *
 * Under prefers-reduced-motion there is no pin and no scrub at all: a section
 * that only advances when you scroll *is* the motion being opted out of. The
 * three steps are simply laid out in flow, all readable at once.
 */
function ServicesSteps() {
  const { t } = useTranslation();
  const wrapRef = useRef<HTMLDivElement>(null);
  // Decided once on mount. It changes the layout, not just the animation, so
  // it has to reach the render rather than only the effect.
  const [reduced, setReduced] = useState(false);

  const steps = tList<{ kicker: string; title: string }>(
    t("services.steps", { returnObjects: true }),
  );

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (reduced) return;
    const wrap = wrapRef.current;
    if (!wrap) return;
    const section = wrap.closest("section");
    if (!section) return;

    const items = Array.from(wrap.querySelectorAll<HTMLElement>("[data-step]"));
    if (items.length < 2) return;

    const ctx = gsap.context(() => {
      // First visible, the rest parked below and transparent.
      gsap.set(items[0], { autoAlpha: 1, y: 0 });
      gsap.set(items.slice(1), { autoAlpha: 0, y: 34 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=200%",
          scrub: true,
          pin: true,
          // Engage slightly early on a fast flick so the section never
          // overshoots before it snaps into place.
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // One unit of timeline per hand-off. The outgoing header starts leaving
      // before the incoming one arrives, so there is always a beat with
      // neither at full strength — a cross-dissolve rather than a swap.
      for (let i = 1; i < items.length; i++) {
        tl.to(
          items[i - 1],
          { autoAlpha: 0, y: -34, duration: 0.55, ease: "power2.inOut" },
          i - 1,
        ).to(items[i], { autoAlpha: 1, y: 0, duration: 0.55, ease: "power2.inOut" }, i - 1 + 0.28);
      }
      // A held beat on the last one, so the final line is readable for a
      // stretch of scroll rather than arriving exactly as the pin releases.
      tl.to({}, { duration: 0.6 });
    }, wrap);

    return () => ctx.revert();
  }, [reduced, steps.length]);

  if (!steps.length) return null;

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none absolute inset-y-0 left-0 z-10 flex w-full max-w-md items-start px-6 pt-28 md:px-16 lg:max-w-xl lg:items-center lg:pt-0"
    >
      {/*
        Stacked in one grid cell when animated, in flow when not.

        Stacking this way rather than with absolute positioning keeps the block
        sized to its tallest member, so the vertical centre never moves as the
        titles change length — the fade happens with nothing underneath it
        shifting.
      */}
      <div className={reduced ? "w-full space-y-10" : "grid w-full"}>
        {steps.map((step) => (
          <div
            key={step.title}
            data-step
            className={reduced ? "" : "col-start-1 row-start-1 will-change-[transform,opacity]"}
          >
            <p className="font-mono-spec mb-4 text-[11px] tracking-[0.35em] text-white/45 uppercase">
              {step.kicker}
            </p>
            <p
              className={`font-display font-semibold tracking-tighter text-white ${
                reduced
                  ? "text-2xl leading-[1.15] lg:text-3xl"
                  : "text-4xl leading-[1.05] lg:text-5xl xl:text-6xl"
              }`}
            >
              {step.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
