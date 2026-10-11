"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsDesktopViewport } from "@/hooks/use-desktop-viewport";
import { tList } from "@/lib/utils";

/** Cells in the abstract surface. Three columns reads as an interface; more
 *  reads as a spreadsheet, fewer as a wireframe nobody finished. */
const MODULES = 9;
/** Spokes from the core out to the surface. */
const LINKS = 8;

type Step = { title: string; desc: string };

/**
 * The signature moment of the apps page: an app assembling itself while the
 * section is pinned, with the copy handing over beside it.
 *
 * Deliberately abstract. No screenshots, no product names, no mock interface
 * anyone could mistake for a real one — there is nothing to show yet, and a
 * plausible fake UI would be a promise about something the visitor cannot
 * click. What scrolls past is the *idea* of an app being built: a surface
 * drawn from nothing, modules snapping into it one at a time, and a core
 * igniting in the middle that wires itself to every one of them.
 *
 * One scrubbed GSAP timeline drives about twenty DOM nodes on transform and
 * opacity alone — no canvas, no WebGL context, nothing on a timer. On phones
 * (and under prefers-reduced-motion) the pin is dropped entirely: a section
 * that only advances when you scroll is exactly the thing being opted out of,
 * and on a phone a pin fights the thumb. There the object is shown finished
 * and the lines are simply laid out in flow.
 */
export function AppsStage() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const isDesktop = useIsDesktopViewport();
  const [reduced, setReduced] = useState(false);

  const steps = tList<Step>(t("apps.steps", { returnObjects: true }));
  // `null` (unmeasured) counts as "not animated", so the server HTML and the
  // first client render agree.
  const animated = isDesktop === true && !reduced;

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (!animated) return;
    const section = sectionRef.current;
    if (!section || !steps.length) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(section);
      const stage = q("[data-stage]");
      const frame = q("[data-frame]");
      const modules = q("[data-module]");
      const links = q("[data-link]");
      const core = q("[data-core]");
      const copy = q("[data-step]");

      // Starting state lives here, not in the markup, so the section still
      // renders complete if the timeline never runs.
      gsap.set(stage, { rotateY: -24, rotateX: 14, scale: 0.92 });
      gsap.set(frame, { scaleY: 0, transformOrigin: "top center" });
      gsap.set(modules, { autoAlpha: 0, y: 30, scale: 0.88 });
      gsap.set(core, { autoAlpha: 0, scale: 0.3 });
      links.forEach((link, i) => {
        gsap.set(link, { rotate: (360 / LINKS) * i, scaleX: 0, transformOrigin: "left center" });
      });
      gsap.set(copy[0], { autoAlpha: 1, y: 0 });
      gsap.set(copy.slice(1), { autoAlpha: 0, y: 34 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=360%",
          scrub: true,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // One slow turn under everything else, so the object reads as a thing
      // in space rather than a diagram being filled in.
      tl.to(stage, { rotateY: 12, rotateX: 0, scale: 1, ease: "none", duration: 4 }, 0);

      // Act one: the surface draws itself from its top edge down.
      tl.to(frame, { scaleY: 1, duration: 0.7, ease: "power2.out" }, 0.05);

      // Act two: the modules arrive one at a time. Built to order, in order.
      tl.to(
        modules,
        { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, stagger: 0.11, ease: "power3.out" },
        0.7,
      );

      // Act three: the core ignites and wires itself to what surrounds it.
      tl.to(core, { autoAlpha: 1, scale: 1, duration: 0.55, ease: "back.out(1.9)" }, 2.0);
      tl.to(links, { scaleX: 1, duration: 0.45, stagger: 0.04, ease: "power2.out" }, 2.25);

      // The copy hands over across the whole span: the outgoing line starts
      // leaving before the incoming one lands, so it reads as a dissolve.
      for (let i = 1; i < copy.length; i++) {
        const at = i * (3.1 / copy.length) + 0.45;
        tl.to(copy[i - 1], { autoAlpha: 0, y: -34, duration: 0.5, ease: "power2.inOut" }, at);
        tl.to(copy[i], { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.inOut" }, at + 0.25);
      }

      // A held beat, so the last line is readable for a stretch of scroll
      // instead of arriving exactly as the pin releases.
      tl.to({}, { duration: 0.6 });
    }, section);

    return () => ctx.revert();
  }, [animated, steps.length]);

  useEffect(() => {
    if (!animated) return;
    // The pin changes the page height; re-measure once the fonts around it
    // have settled.
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 300);
    return () => window.clearTimeout(id);
  }, [animated]);

  return (
    <section
      ref={sectionRef}
      className={`relative w-full overflow-hidden ${animated ? "flex min-h-screen items-center" : "py-24"}`}
    >
      {/* Floor grid, laid back in perspective: something for the object to
          stand on, without drawing a visible line of its own. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.10) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.10) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          transform: "perspective(600px) rotateX(68deg) scale(1.9)",
          transformOrigin: "50% 100%",
          maskImage: "radial-gradient(ellipse 60% 55% at 50% 85%, black, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 60% 55% at 50% 85%, black, transparent 75%)",
        }}
      />

      <div className="relative z-10 mx-auto grid w-full max-w-[1500px] items-center gap-16 px-6 md:px-16 lg:grid-cols-2 lg:gap-24">
        {/* Stacked in one grid cell when animated, in flow when not: the block
            stays as tall as its longest line either way, so nothing below it
            moves as the lines hand over. */}
        <div className={animated ? "order-2 grid lg:order-1" : "order-2 space-y-12 lg:order-1"}>
          {steps.map((step) => (
            <div
              key={step.title}
              data-step
              className={animated ? "col-start-1 row-start-1 will-change-[transform,opacity]" : ""}
            >
              <p className="font-display max-w-xl text-2xl leading-[1.1] font-semibold tracking-tight text-balance text-white lg:text-[1.9rem]">
                {step.title}
              </p>
              <p className="mt-4 max-w-md text-base leading-relaxed font-light text-white/45">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="relative order-1 lg:order-2" style={{ perspective: "1500px" }}>
          <div
            data-stage
            className="relative mx-auto aspect-[4/5] w-full max-w-[380px] will-change-transform"
            style={{ transformStyle: "preserve-3d" }}
          >
            <span
              data-frame
              className="absolute inset-0 rounded-[26px] border border-white/18 bg-white/[0.015] will-change-transform"
              style={{ boxShadow: "0 50px 120px -40px rgba(0,0,0,0.9)" }}
            />

            {/* Corner brackets: the registration marks of something measured.
                They sit outside the frame's own scale animation, so they read
                as the jig the surface is built in. */}
            {[
              "top-3 left-3 border-t border-l",
              "top-3 right-3 border-t border-r",
              "bottom-3 left-3 border-b border-l",
              "bottom-3 right-3 border-b border-r",
            ].map((pos) => (
              <span
                key={pos}
                aria-hidden
                className={`pointer-events-none absolute h-5 w-5 border-white/35 ${pos}`}
              />
            ))}

            {/* One slow pass of light across the surface: the only thing here
                that moves on its own, and it is what keeps the object from
                looking frozen between scroll gestures. */}
            <span
              aria-hidden
              className="apps-sweep pointer-events-none absolute inset-0 overflow-hidden rounded-[26px]"
            />

            {/* A hairline grid inside the surface: the ruling a thing is laid
                out on, visible under the cells rather than behind them. */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-6 rounded-lg opacity-50"
              style={{
                backgroundImage:
                  "linear-gradient(to right, rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.07) 1px, transparent 1px)",
                backgroundSize: "26px 26px",
              }}
            />

            {/* The cells. Abstract on purpose — bars and a dot, never a label
                or a control, so nothing here can be read as a real screen —
                but detailed enough to look built rather than blocked out.
                Each sits at its own depth, so the parallax between them is
                real 3D rather than a drawing that happens to be tilted. */}
            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-3 p-6">
              {Array.from({ length: MODULES }, (_, i) => (
                <span
                  key={i}
                  data-module
                  className="relative overflow-hidden rounded-xl border border-white/12 bg-white/[0.035] will-change-[transform,opacity]"
                  style={{ transform: `translateZ(${(i % 3) * 9 + (i % 2) * 5}px)` }}
                >
                  <span
                    className="absolute top-3 left-3 h-1.5 w-1.5 rounded-full"
                    style={{ background: `rgba(255,255,255,${0.25 + (i % 3) * 0.18})` }}
                  />
                  <span className="absolute top-3 right-3 h-px w-4 bg-white/15" />
                  <span className="absolute inset-x-3 bottom-6 h-px bg-white/18" />
                  <span
                    className="absolute bottom-3.5 left-3 h-px bg-white/12"
                    style={{ width: `${34 + ((i * 17) % 42)}%` }}
                  />
                  <span
                    className="absolute right-3 bottom-3.5 h-px bg-white/10"
                    style={{ width: `${12 + ((i * 11) % 20)}%` }}
                  />
                </span>
              ))}
            </div>

            {/* Spokes. Rotated and drawn by GSAP so both transforms live in
                one place and never fight each other. */}
            <div className="absolute top-1/2 left-1/2 h-0 w-0">
              {Array.from({ length: LINKS }, (_, i) => (
                <span
                  key={i}
                  data-link
                  className="absolute h-px w-[128px] origin-left will-change-transform"
                  style={{
                    background:
                      "linear-gradient(to right, rgba(255,255,255,0.55), rgba(255,255,255,0.08))",
                  }}
                >
                  {/* The end of a spoke lands on a node, so the core reads as
                      wired to the cells and not as a sunburst. */}
                  <span
                    className="absolute top-1/2 right-0 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-white/70"
                    style={{ boxShadow: "0 0 10px 2px rgba(255,255,255,0.35)" }}
                  />
                </span>
              ))}
            </div>

            {/* The core: the agent that lives inside the app. */}
            <div
              data-core
              className="absolute top-1/2 left-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center will-change-transform"
            >
              <span
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.05) 45%, transparent 70%)",
                }}
              />
              <span className="apps-core-ring absolute inset-0 rounded-full border border-dashed border-white/25" />
              <span className="absolute inset-2 rounded-full border border-white/25" />
              <span className="absolute inset-5 rounded-full border border-white/40" />
              {/* Four ticks on the inner ring: the core is an instrument, not
                  a glow. */}
              {[0, 90, 180, 270].map((deg) => (
                <span
                  key={deg}
                  className="absolute top-1/2 left-1/2 h-px w-2 origin-left bg-white/45"
                  style={{ transform: `rotate(${deg}deg) translateX(34px)` }}
                />
              ))}
              <span
                className="h-3 w-3 rounded-full bg-white"
                style={{ boxShadow: "0 0 24px 6px rgba(255,255,255,0.55)" }}
              />
            </div>
          </div>

          <p className="font-mono-spec mt-10 text-center text-[10px] tracking-[0.3em] text-white/25 uppercase">
            {t("apps.note")}
          </p>
        </div>
      </div>
    </section>
  );
}
