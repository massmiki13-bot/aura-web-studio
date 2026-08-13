"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { gsap } from "@/lib/gsap";
import { HeroChrome, type HeroChromeMotion } from "./HeroChrome";
import { FloatingShapesBackground } from "@/components/ui/floating-shapes-background";
import { CanvasBoundary } from "@/components/CanvasBoundary";
import { useIsDesktopViewport } from "@/hooks/use-desktop-viewport";
import { introWillPlay } from "@/lib/boot";
import { useBootReady } from "@/lib/use-boot-ready";

/**
 * The hero is one pinned scroll span built around a single object.
 *
 * A liquid-chrome form is on screen from the moment the page opens, and holds
 * one size throughout — it undulates and melts, but it never zooms. What
 * scroll moves is where it sits.
 *
 * Act one rests it low and right, and stands the masthead *behind* it: the
 * type is interrupted by the object rather than laid over it, so the depth is
 * real geometry and not a drop shadow. The copy that has to stay readable is
 * kept clear of the form entirely, in the opposite corner. Act two dissolves
 * that copy, glides the form to dead centre, and brings the brand promises up
 * centred over it. The handoff to the next section is a short black dissolve,
 * not a hard cut.
 *
 * Everything is DOM text (translatable and crawlable, unlike the old Spline
 * scene that had the copy baked into a texture), and the object is the page's
 * only WebGL context above the fold — it replaced a separate shader background
 * that used to run underneath act one. Two contexts compiling in the same
 * window is what made cold visits stutter, so there is deliberately one.
 *
 * No GPU layer exists until the boot gate opens (see @/lib/boot): they used to
 * start their render loops while the browser was still hydrating, parsing
 * fonts and building other WebGL scenes.
 */
export function Hero() {
  const { t } = useTranslation();
  const booted = useBootReady();
  // The GPU layers trail the boot signal by a beat, on purpose — see the
  // effect below. `booted` reveals the copy; this mounts the shader background.
  const [layersOn, setLayersOn] = useState(false);
  // Desktop only. The chrome blob is a second WebGL context running a vertex
  // shader with six 3D simplex evaluations per vertex over a ~17k-triangle
  // sphere — on a phone it drops the whole act to single-digit fps, on top of
  // the shader background already holding a context. Mobile gets a CSS orb
  // instead (see the act-two markup below), which costs the main thread
  // nothing. `null` (not yet measured) counts as "not desktop" so no canvas is
  // ever armed speculatively.
  const isDesktop = useIsDesktopViewport();
  const sectionRef = useRef<HTMLElement>(null);
  // Act one's masthead and its readable copy, on opposite sides of the object.
  // Two refs rather than one wrapper — see the markup for why.
  const titleBackRef = useRef<HTMLDivElement>(null);
  const titleFrontRef = useRef<HTMLDivElement>(null);
  // The masthead itself, which carries the cursor sweep's CSS variables.
  const wordmarkRef = useRef<HTMLHeadingElement>(null);
  const actTwoRef = useRef<HTMLDivElement>(null);
  const promise1Ref = useRef<HTMLDivElement>(null);
  const promise2Ref = useRef<HTMLDivElement>(null);
  const fadeOutRef = useRef<HTMLDivElement>(null);
  // Mobile's stand-in for the form. Null on desktop, where the canvas renders
  // instead, so every use of it has to tolerate its absence.
  const orbRef = useRef<HTMLDivElement>(null);
  // Owns the title card's entrance: created when the copy is parked, added to
  // when the boot gate opens, reverted if the hero ever unmounts.
  const entranceRef = useRef<gsap.Context | null>(null);
  // Written every scrubbed frame, read by the chrome blob's render loop —
  // a ref so scroll never causes React re-renders.
  const chromeMotion = useRef<HeroChromeMotion>({ progress: 0 });

  useEffect(() => {
    const section = sectionRef.current;
    const titleBack = titleBackRef.current;
    const titleFront = titleFrontRef.current;
    const actTwo = actTwoRef.current;
    const promise1 = promise1Ref.current;
    const promise2 = promise2Ref.current;
    const fadeOut = fadeOutRef.current;
    // Not guarded against: desktop legitimately has no orb.
    const orb = orbRef.current;
    if (!section || !titleBack || !titleFront || !actTwo) return;
    if (!promise1 || !promise2 || !fadeOut) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.set(actTwo, { autoAlpha: 0 });
      gsap.set([promise1, promise2], { autoAlpha: 0 });
      gsap.set(fadeOut, { autoAlpha: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=200%",
          // scrub: true, not a smoothed value — Lenis already smooths the
          // scroll itself; a second smoothing layer here made the fades lag
          // behind the rest of the page's scroll response.
          scrub: true,
          pin: true,
          // Start the pin slightly early on fast scrolls so the section
          // never visibly overshoots before snapping into place.
          anticipatePin: 1,
          // The only thing scroll has to publish now. The object is on screen
          // for the whole pin, so there is no longer a layer to arm partway
          // through, and none to pause either — what used to be gated by act
          // is now gated by whether the hero is on screen at all, which each
          // layer already answers for itself with an IntersectionObserver.
          onUpdate: (self) => {
            chromeMotion.current.progress = self.progress;
          },
        },
      });
      // autoAlpha (not opacity) so fully-faded layers also get
      // visibility:hidden — the compositor skips them entirely instead of
      // blending a fullscreen transparent layer every frame.
      // The masthead recedes rather than just fading: a touch of scale away
      // from the viewer while the form slides across in front of it, so the
      // handoff reads as depth rather than as a crossfade between two states.
      tl.to(titleBack, { autoAlpha: 0, y: -30, scale: 0.94, duration: 0.12 }, 0.08)
        .to(titleFront, { autoAlpha: 0, y: -24, duration: 0.1 }, 0.08)
        .to(actTwo, { autoAlpha: 1, duration: 0.1 }, 0.14)
        // The promises swap as the visitor scrolls: each one condenses out
        // of a blur, holds while the blob melts, then dissolves upward for
        // the next — the text equivalent of the chrome behind it.
        //
        // The blur peaks at 10px rather than 14. Gaussian cost scales with the
        // radius and this is paid on every scrubbed frame; at this size, with
        // the scale and travel doing most of the talking, the difference in
        // the effect is not one you can pick out and the difference in cost is.
        .fromTo(
          promise1,
          { autoAlpha: 0, y: 70, scale: 1.04, filter: "blur(10px)" },
          { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.12, ease: "none" },
          0.15,
        )
        .to(
          promise1,
          { autoAlpha: 0, y: -60, scale: 0.94, filter: "blur(9px)", duration: 0.1, ease: "none" },
          0.46,
        )
        .fromTo(
          promise2,
          { autoAlpha: 0, y: 70, scale: 1.04, filter: "blur(10px)" },
          { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.12, ease: "none" },
          0.57,
        )
        // Mobile's equivalent of the form's travel, on the same stretch of
        // scroll and the same easing the canvas uses. It rests off to the
        // right and settles to the middle of the screen for the second act.
        //
        // It travels *down* rather than up, unlike the desktop form: a phone
        // has the copy stacked underneath, so act one's resting place has to
        // be above centre, not below it. The y here undoes the markup's lift
        // (see pb-40 on its container) to land dead centre. Percentages of the
        // orb's own size, so it scales with the viewport. Skipped entirely on
        // desktop, where this ref holds nothing.
        .fromTo(
          orb ?? [],
          { xPercent: 34, yPercent: 0 },
          { xPercent: 0, yPercent: 45, duration: 0.22, ease: "power2.inOut" },
          0.04,
        )
        // The metal sheen sweeps across both headlines over the whole act.
        .to(
          section.querySelectorAll("[data-chrome-text]"),
          { backgroundPosition: "120% 0%", duration: 0.8, ease: "none" },
          0.12,
        )
        // Short dissolve to black right at the end of the pin, so the
        // handoff to the next section reads as an (almost) instant fade
        // instead of a long dead stretch of scrolling through black.
        // autoAlpha keeps this fullscreen overlay visibility:hidden (and out
        // of the compositor) for the 92% of the pin where it's transparent.
        .to(fadeOut, { autoAlpha: 1, duration: 0.08 }, 0.92);
    }, section);

    return () => ctx.revert();
  }, []);

  // Entrance for the title card, played as the intro hands over. Only when
  // the intro actually runs: it holds an opaque curtain over the page from
  // before first paint (see the `intro-pending` shim in styles.css), so
  // parking the copy out of position here can't be seen. Without that curtain
  // — a warm visit, reduced motion, no JS — the server-rendered hero is
  // already on screen and stays exactly where it is.
  //
  // Split deliberately across two effects: park here, reveal below off the
  // `booted` render. The reveal must not be built inside the boot listener
  // itself, because that listener is invoked from inside the intro's GSAP
  // timeline (`tl.call`) — and a gsap.context adopts any animation created
  // inside its callbacks. Written that way, this entrance belonged to the
  // *intro's* context, and the `ctx.revert()` in the intro's unmount cleanup
  // killed it mid-flight and reverted the copy to where the tween began:
  // invisible, permanently. React flushes effects well outside that call
  // stack, so building it there is a guarantee rather than a hope.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !introWillPlay()) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const items = section.querySelectorAll("[data-hero-in]");
    if (!items.length) return;

    const ctx = gsap.context(() => {
      gsap.set(items, { autoAlpha: 0, y: 36 });
    }, section);
    entranceRef.current = ctx;

    return () => {
      entranceRef.current = null;
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    const ctx = entranceRef.current;
    if (!booted || !ctx) return;

    ctx.add(() => {
      gsap.to("[data-hero-in]", {
        autoAlpha: 1,
        y: 0,
        duration: 1.05,
        stagger: 0.09,
        // Overlaps the tail of the intro's dissolve, so the two reveals read
        // as one continuous move rather than two separate beats.
        delay: 0.25,
        ease: "power3.out",
        // Leaves nothing behind for the pin timeline's own transforms to
        // fight over once the entrance has landed.
        clearProps: "opacity,visibility,transform",
      });
    });

    // The floor under all of it. If anything ever kills that tween before it
    // can clear its own props, this strips the inline styles anyway — a hero
    // with no headline is not a failure mode worth risking for an entrance.
    // A no-op when the tween finished normally, since clearProps already ran.
    const safety = window.setTimeout(() => {
      gsap.set("#hero [data-hero-in]", { clearProps: "opacity,visibility,transform" });
    }, 2600);
    return () => window.clearTimeout(safety);
  }, [booted]);

  // The masthead's cursor sweep: a soft light that travels across the glyphs
  // with the pointer. See .hero-wordmark in styles.css for the fill itself —
  // all this effect owns is where the light is.
  //
  // CSS custom properties rather than :hover, for two reasons. The masthead
  // sits at z-5, underneath the full-bleed canvas layer, so a pointer event
  // never reaches it in the first place; and :hover is on/off, which cannot
  // say *where* on the word the light should be. A window-level listener
  // answers both, and keeps working over the object standing in front.
  //
  // That listener only records a position. Everything else happens in the
  // frame loop, so a high-polling mouse writes the two variables once per
  // frame rather than several hundred times a second.
  useEffect(() => {
    const section = sectionRef.current;
    const word = wordmarkRef.current;
    if (!section || !word) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // The pointer, and the damped light that chases it — both in viewport
    // coordinates, converted to the masthead's own box on write.
    let px = 0;
    let py = 0;
    let lx = 0;
    let ly = 0;
    // Until the pointer has been seen once, the variables are left alone and
    // the fill stays the flat ramp its defaults describe. Snapping on that
    // first move is what stops a highlight flying in from the page corner.
    let seen = false;
    // The masthead lives inside a pinned, scrubbed section whose timeline puts
    // a transform on its container, so this box genuinely moves. Re-measured
    // on a throttle inside the frame we already own, rather than from a scroll
    // listener that would force layout on every scroll event.
    let box = word.getBoundingClientRect();
    let stamp = 0;
    let raf = 0;
    let running = false;

    const onMove = (e: MouseEvent) => {
      px = e.clientX;
      py = e.clientY;
      if (!seen) {
        seen = true;
        lx = px;
        ly = py;
      }
    };

    const tick = (now: number) => {
      if (now - stamp > 250) {
        stamp = now;
        box = word.getBoundingClientRect();
      }
      if (seen) {
        // Damped, so the light trails the cursor the way something molten
        // would instead of snapping to it.
        lx += (px - lx) * 0.12;
        ly += (py - ly) * 0.12;
        word.style.setProperty("--sweep-x", `${lx - box.left}px`);
        word.style.setProperty("--sweep-y", `${ly - box.top}px`);
      }
      raf = requestAnimationFrame(tick);
    };

    // Perf only, and the same bargain every other loop on this section makes:
    // there is nothing to light once the hero has been scrolled past, and the
    // mousemove listener comes off with the frame loop rather than staying
    // bound for the rest of the page.
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting === running) return;
        running = entry.isIntersecting;
        if (running) {
          window.addEventListener("mousemove", onMove, { passive: true });
          raf = requestAnimationFrame(tick);
        } else {
          window.removeEventListener("mousemove", onMove);
          cancelAnimationFrame(raf);
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(section);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);

  // Why the shader background waits a beat longer than the copy does.
  //
  // Mounting it is a heavy commit — a WebGL context and a shader compile. Done
  // in the same commit that flips `booted`, that work runs *before* React can
  // flush the entrance effect above, so the tween was created a few hundred
  // milliseconds late and the hand-off showed a beat of black between the intro
  // dissolving and the headline arriving. Splitting them keeps the boot commit
  // cheap: copy first, decoration after.
  useEffect(() => {
    if (!booted) return;
    const id = window.setTimeout(() => setLayersOn(true), 260);
    return () => window.clearTimeout(id);
  }, [booted]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      {/* The object, and the only layer that belongs to neither act.

          It used to live inside act two and mount on the visitor's first
          scroll. Now the title card is built around it, so it is here from the
          boot gate and simply persists: one continuous form that sits at rest
          behind the masthead, then grows and melts as the scroll runs. Nothing
          mounts mid-pin any more, which removes the hitch that gating was
          working around in the first place.

          It also replaces the shader background rather than joining it. That
          keeps act one at exactly one WebGL context, as before — two of them
          compiling in the same window is what made cold visits stutter.

          Not paused by scroll position: both layers below run their own
          IntersectionObserver and stop themselves once the hero is scrolled
          away, which is now the only time either is genuinely invisible. */}
      {/* pointer-events-none because nothing in here is interactive and this
          layer is full-bleed over the masthead: the blob reads the cursor from
          a window listener, not from events landing on its canvas. */}
      <div className="pointer-events-none absolute inset-0 z-10">
        {layersOn && isDesktop === true && (
          <CanvasBoundary label="hero chrome">
            <FloatingShapesBackground className="z-0" />
            <HeroChrome className="absolute inset-0 z-10" motion={chromeMotion} />
          </CanvasBoundary>
        )}
        {/* Mobile: the same silhouette, drawn with gradients. Server-rendered
            and inert — no gate, no canvas, nothing to arm. See
            .chrome-orb-fallback in styles.css. */}
        {isDesktop !== true && (
          // Lifted in the markup, settled by the transform. The padding keeps
          // it roughly on the masthead's centre line and clear of the copy
          // stack — a phone has nowhere near the vertical room a desktop does
          // — and the timeline then walks it down to true centre for act two.
          // Parking it high here rather than animating from centre means a
          // reduced-motion visitor, who never gets the timeline at all, still
          // sees it clear of the tagline instead of sitting on top of it.
          <div className="md:hidden absolute inset-0 flex items-center justify-center overflow-hidden pb-40 md:pb-0">
            {/* Its own wrapper purely to carry the travel. The orb itself is
                driven by a looping CSS keyframe that animates `transform`, so
                anything GSAP wrote there would be overwritten on the next
                frame of that animation — the move has to live on a parent. */}
            <div ref={orbRef} className="will-change-transform">
              <div
                aria-hidden
                className="chrome-orb-fallback relative aspect-square w-[46vw] max-w-64 rounded-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* Act one, back half: the masthead, which the form stands in front of.

          Deliberately a sibling of the copy below rather than its parent. The
          two are faded together by the same tween, and GSAP animates opacity —
          which creates a stacking context. Nested, the whole block would have
          been flattened to one z-index the moment the fade began, and the
          object would have jumped in front of the buttons or behind the
          masthead. Split, each half keeps its own side of the object. */}
      <div
        ref={titleBackRef}
        className="absolute inset-0 z-5 flex items-center justify-center overflow-hidden px-6 pb-48 select-none md:pb-0"
      >
        {/* nowrap pins this to the two lines the <br/> asks for. Left to
            reflow it broke into three on a phone — "Aura" / "Web" / "Studio" —
            and every one of those lines is narrower than the orb in front of
            them, so the entire masthead disappeared behind it. The object has
            to be narrower than the shortest line for any of this to read,
            which is also why the orb shrank at that breakpoint. */}
        <h1
          data-hero-in
          ref={wordmarkRef}
          className="hero-wordmark font-display text-center text-[18vw] leading-[0.82] font-semibold tracking-tighter whitespace-nowrap md:text-[17vw]"
        >
          Aura Web
          <br />
          Studio
        </h1>
      </div>

      {/* Act one, front half: everything that has to stay readable, kept clear
          of the form and grouped low-left the way the promise copy is. */}
      <div
        ref={titleFrontRef}
        className="absolute inset-x-0 bottom-40 z-20 flex flex-col items-center px-6 text-center md:bottom-28 md:items-start md:px-16 md:text-left"
      >
        <p
          data-hero-in
          className="font-mono-spec mb-5 text-xs tracking-[0.4em] text-white/50 uppercase"
        >
          {t("hero.badge")}
        </p>
        <p
          data-hero-in
          className="max-w-lg text-lg leading-relaxed font-light text-white/60 md:text-xl"
        >
          {t(
            "hero.tagline",
            "Progettiamo siti web su misura che elevano il valore percepito del tuo brand.",
          )}
        </p>
        <div
          data-hero-in
          className="mt-8 flex flex-wrap items-center justify-center gap-4 md:justify-start"
        >
          <a
            href="#contact"
            className="font-mono-spec inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-xs font-medium tracking-[0.25em] text-black uppercase transition-colors hover:bg-white/90"
          >
            {t("hero.cta", "Richiedi un preventivo")}
          </a>
          <a
            href="#projects"
            className="font-mono-spec inline-flex items-center justify-center rounded-full border border-white/15 px-8 py-4 text-xs tracking-[0.25em] text-white/80 uppercase transition-colors hover:border-white/40 hover:text-white"
          >
            {t("hero.secondaryCta", "Guarda i lavori")}
          </a>
        </div>
      </div>

      {/* Act two: the promise copy, which is now all this act adds — the form
          it talks about is already on screen, one layer down, and simply keeps
          going. Above the object at z-20, and hidden by default in the markup
          (opacity-0 invisible = GSAP's autoAlpha:0 state) so it never flashes
          through the title card during SSR paint or before the reveal effect
          runs. That also keeps it hidden under prefers-reduced-motion, where
          the effect returns early without ever pinning. */}
      <div
        ref={actTwoRef}
        className="invisible absolute inset-0 z-20 opacity-0 pointer-events-none"
      >
        <div className="absolute inset-0">
          {/* Readability scrim, back in the middle where the copy is. The
              promises sit directly over the form here, and the chrome's
              brightest highlights are dead centre — a soft dark ellipse under
              the text is what keeps it legible.

              Still a gradient rather than a blurred shape: a 64px Gaussian on
              a box this size is a full backing store to rasterise, and a
              radial-gradient produces the same soft falloff for free. */}
          <div
            className="absolute top-1/2 left-1/2 h-[46vh] w-[76vw] -translate-x-1/2 -translate-y-1/2"
            style={{
              background:
                "radial-gradient(closest-side, rgba(0,0,0,0.42), rgba(0,0,0,0.36) 52%, rgba(0,0,0,0.16) 78%, transparent)",
            }}
          />
          {/* Each promise is positioned by an outer box that never animates,
              and animated on an inner one that is only as big as the words.
              Everything the timeline touches here it touches on a scrub — and
              `filter: blur()` re-rasterises whatever layer it is applied to on
              every single frame of that scrub. On a full-bleed box this was a
              viewport-sized Gaussian per frame, twice over. Sized to the copy
              it is a fraction of the pixels, and `will-change` keeps the
              result on its own layer instead of re-promoting it each time. */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <div
              ref={promise1Ref}
              className="flex flex-col items-center will-change-[transform,opacity,filter]"
            >
              <h2
                data-chrome-text
                className="chrome-text font-display text-5xl leading-[0.95] font-semibold tracking-tighter sm:text-7xl md:text-8xl"
              >
                {t("hero.actTwoTitle", "Il tuo brand, elevato.")}
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed font-light text-white/60 md:text-lg">
                {t("hero.actTwoSub", "Web design su misura per chi non si accontenta.")}
              </p>
            </div>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <div
              ref={promise2Ref}
              className="flex flex-col items-center will-change-[transform,opacity,filter]"
            >
              <h2
                data-chrome-text
                className="chrome-text font-display text-5xl leading-[0.95] font-semibold tracking-tighter sm:text-7xl md:text-8xl"
              >
                {t("hero.actTwoTitle2", "Estetica che converte.")}
              </h2>
              <p className="mt-6 max-w-md text-base leading-relaxed font-light text-white/60 md:text-lg">
                {t("hero.actTwoSub2", "Performance, SEO e conversioni — di serie.")}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-10 left-0 right-0 z-20 flex flex-col items-center gap-3 pointer-events-none">
        <span className="font-mono-spec text-[10px] uppercase tracking-[0.3em] text-white/30">
          {t("hero.scroll")}
        </span>
        <div className="h-10 w-px bg-gradient-to-b from-white/40 to-transparent animate-pulse" />
      </div>

      <div
        ref={fadeOutRef}
        className="absolute inset-0 z-30 bg-black opacity-0 pointer-events-none"
      />
    </section>
  );
}
