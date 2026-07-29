import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollTrigger } from "@/lib/gsap";
import { SplineScene } from "./SplineScene";

const DESKTOP_QUERY = "(min-width: 768px)"; // Tailwind's `md` breakpoint

/**
 * Is the viewport at least `md` wide? Null until measured on the client, so
 * SSR and the very first client render agree (both render neither branch's
 * *content-bearing* component — see the null-check below) and there's
 * nothing to hydration-mismatch on; the real branch commits a beat later.
 *
 * Needed because `useNearViewport` (SplineScene's lazy-mount gate) measures
 * `getBoundingClientRect()`, not CSS — a `display:none` element collapses to
 * a (0,0,0,0) box, which reads as "at the top of the viewport" and mounts
 * the WebGL scene anyway. Hiding the Spline branch with Tailwind's `hidden
 * md:block` alone still downloaded the multi-MB runtime on phones; only not
 * rendering `<SplineScene>` at all on mobile stops that.
 */
function useIsDesktopViewport() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_QUERY);
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isDesktop;
}

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
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      {/* The Spline scene fills the section and receives pointer events so it
          reacts to the mouse the same way it does in the Spline editor.
          Desktop-only (unchanged): the scene's camera framing is authored for
          a wide viewport, and doesn't recompose for a narrow, tall one. Not
          rendered at all on mobile (see useIsDesktopViewport) rather than
          just CSS-hidden, so the heavy runtime + scene never download there. */}
      {isDesktop !== false && (
        <div className="absolute inset-0 hidden md:block">
          <SplineScene className="absolute inset-0" />
        </div>
      )}

      {/* Mobile-only static replacement: same chrome/metallic language as the
          Hero and Intro (silver-on-black radial gradient, soft glow), just
          without the WebGL scene — lighter to load and reads correctly at a
          portrait aspect ratio instead of an off-centre crop of a wide scene. */}
      {isDesktop !== true && (
        <div className="absolute inset-0 md:hidden" aria-hidden>
          <ServicesMobileVisual />
        </div>
      )}

      <ServicesLabel />
      {/* Reveal overlay stays click-through so it never blocks the scene. */}
      <div ref={fadeInRef} className="absolute inset-0 z-20 bg-black pointer-events-none" />
    </section>
  );
}

/**
 * CSS-only "chrome orb" — a static stand-in for the desktop Spline scene.
 * Reuses the same silver-on-black material language as the Hero's chrome
 * blob and the Intro's genesis core (no new colour introduced), just without
 * a WebGL context: a centred radial-gradient sphere with a soft ambient glow
 * and a slow breathing scale, cheap enough to run happily on any phone.
 */
function ServicesMobileVisual() {
  return (
    <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
      <div
        className="absolute h-[70vw] w-[70vw] max-h-[380px] max-w-[380px] rounded-full blur-3xl opacity-60"
        style={{ background: "var(--glow-cyan)" }}
      />
      <div
        className="services-orb-breathe relative h-[46vw] w-[46vw] max-h-[240px] max-w-[240px] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, oklch(0.95 0 0) 0%, oklch(0.55 0.01 260) 55%, oklch(0.12 0.005 260) 100%)",
          boxShadow: "0 0 90px 10px oklch(1 0 0 / 0.08)",
        }}
      />
    </div>
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
