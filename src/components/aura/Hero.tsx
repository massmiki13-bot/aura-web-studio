import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { gsap } from "@/lib/gsap";
import { HeroChrome, type HeroChromeMotion } from "./HeroChrome";
import { ShaderBackground } from "@/components/ui/shader-background";
import { FloatingShapesBackground } from "@/components/ui/floating-shapes-background";
import { CanvasBoundary } from "@/components/CanvasBoundary";
import { introWillPlay, onScrollIntent, useBootReady } from "@/lib/boot";

/**
 * The hero has two acts within a single pinned scroll span: first a
 * full-screen title card (shader background + our headline) gets its own
 * moment, then it dissolves into the liquid-chrome act — a molten metal form
 * that melts further with scroll, with the brand promise as DOM text in
 * front of it (translatable and crawlable, unlike the old Spline scene that
 * had the copy baked into a texture). The handoff to the next section at the
 * end is a short black dissolve, not a hard cut.
 *
 * None of the GPU layers exist until the page's boot gate opens (see
 * @/lib/boot) — the shader background used to start its render loop while the
 * browser was still hydrating, parsing fonts and building three other WebGL
 * scenes, which is what made the first seconds of a cold visit stutter.
 */
export function Hero() {
  const { t } = useTranslation();
  const booted = useBootReady();
  // The GPU layers trail the boot signal by a beat, on purpose — see the
  // effect below. `booted` reveals the copy; this mounts the shader background.
  const [layersOn, setLayersOn] = useState(false);
  // The chrome blob (act two) is a second WebGL context whose mount is heavy
  // enough to stutter the shader if it lands while the visitor is still on the
  // title card. It doesn't exist until the visitor starts scrolling toward it —
  // see the effect below — so act one stays undisturbed.
  const [chromeOn, setChromeOn] = useState(false);
  const chromeOnRef = useRef(false);
  const armChrome = () => {
    if (chromeOnRef.current) return;
    chromeOnRef.current = true;
    setChromeOn(true);
  };
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const actTwoRef = useRef<HTMLDivElement>(null);
  const promise1Ref = useRef<HTMLDivElement>(null);
  const promise2Ref = useRef<HTMLDivElement>(null);
  const fadeOutRef = useRef<HTMLDivElement>(null);
  // Owns the title card's entrance: created when the copy is parked, added to
  // when the boot gate opens, reverted if the hero ever unmounts.
  const entranceRef = useRef<gsap.Context | null>(null);
  // Written every scrubbed frame, read by the chrome blob's render loop —
  // a ref so scroll never causes React re-renders.
  const chromeMotion = useRef<HeroChromeMotion>({ progress: 0 });
  // Perf: the shader and the act-two layers are per-frame render loops, but
  // each is only visible during one "act" of the pin — pause whichever layer
  // the current scroll position has fully hidden.
  const [shaderPaused, setShaderPaused] = useState(false);
  const [actTwoPaused, setActTwoPaused] = useState(true);
  const pausesRef = useRef({ shader: false, actTwo: true });

  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    const actTwo = actTwoRef.current;
    const promise1 = promise1Ref.current;
    const promise2 = promise2Ref.current;
    const fadeOut = fadeOutRef.current;
    if (!section || !title || !actTwo || !promise1 || !promise2 || !fadeOut) return;
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
          onUpdate: (self) => {
            const p = self.progress;
            chromeMotion.current.progress = p;
            // The instant any scroll into the pin registers, bring the chrome
            // canvas up — well before it's due to appear at p≈0.12, and while
            // the motion masks its mount cost. Also covers a reload part-way
            // into the pin, where this fires immediately at a high progress.
            if (p > 0.004) armChrome();
            // The title (and its shader) is fully transparent past 0.2 of
            // the timeline; act two is invisible before 0.12. Ref-guarded so
            // setState only fires when a threshold is actually crossed.
            const pauses = pausesRef.current;
            const shaderHidden = p > 0.22;
            const actTwoHidden = p < 0.1;
            if (shaderHidden !== pauses.shader) {
              pauses.shader = shaderHidden;
              setShaderPaused(shaderHidden);
            }
            if (actTwoHidden !== pauses.actTwo) {
              pauses.actTwo = actTwoHidden;
              setActTwoPaused(actTwoHidden);
            }
          },
        },
      });
      // autoAlpha (not opacity) so fully-faded layers also get
      // visibility:hidden — the compositor skips them entirely instead of
      // blending a fullscreen transparent layer every frame.
      tl.to(title, { autoAlpha: 0, y: -30, duration: 0.1 }, 0.1)
        .to(actTwo, { autoAlpha: 1, duration: 0.1 }, 0.12)
        // The promises swap as the visitor scrolls: each one condenses out
        // of a blur, holds while the blob melts, then dissolves upward for
        // the next — the text equivalent of the chrome behind it.
        .fromTo(
          promise1,
          { autoAlpha: 0, y: 70, scale: 1.04, filter: "blur(14px)" },
          { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.12, ease: "none" },
          0.15,
        )
        .to(
          promise1,
          { autoAlpha: 0, y: -60, scale: 0.94, filter: "blur(12px)", duration: 0.1, ease: "none" },
          0.46,
        )
        .fromTo(
          promise2,
          { autoAlpha: 0, y: 70, scale: 1.04, filter: "blur(14px)" },
          { autoAlpha: 1, y: 0, scale: 1, filter: "blur(0px)", duration: 0.12, ease: "none" },
          0.57,
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

  // Arm the chrome blob on the first hint of scrolling (with a long fallback
  // for a visitor who never scrolls, so it's ready if they eventually do). This
  // keeps its heavy WebGL mount out of the first seconds on the title card,
  // where it would stutter the shader behind it.
  useEffect(() => {
    if (!layersOn) return;
    return onScrollIntent(armChrome, 6000);
  }, [layersOn]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      {/* Act one: full-screen title card. */}
      <div ref={titleRef} className="absolute inset-0 z-10">
        <div className="absolute inset-0 opacity-70">
          {/* Held until the boot gate opens — see the component's own note on
              why context creation is deferred rather than merely paused. */}
          <CanvasBoundary label="hero shader">
            <ShaderBackground paused={shaderPaused || !layersOn} />
          </CanvasBoundary>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/60 pointer-events-none" />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
          <p
            data-hero-in
            className="font-mono-spec text-xs uppercase tracking-[0.4em] text-white/50 mb-8"
          >
            {t("hero.badge")}
          </p>
          <h1
            data-hero-in
            className="font-display text-6xl sm:text-8xl md:text-9xl font-bold leading-[0.9] tracking-tighter text-white"
          >
            Aura Web
            <br />
            <span className="text-gradient-aura">Studio</span>
          </h1>
          <p
            data-hero-in
            className="mt-8 text-lg md:text-xl text-white/60 font-light leading-relaxed max-w-lg"
          >
            {t(
              "hero.tagline",
              "Progettiamo siti web su misura che elevano il valore percepito del tuo brand.",
            )}
          </p>
          <div data-hero-in className="mt-10 flex flex-wrap items-center justify-center gap-4">
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

      {/* Act two: the liquid-chrome form, hidden until the title card has
          made its case. Floating shapes give the black space around it depth.
          Hidden by default in the markup (opacity-0 invisible = GSAP's
          autoAlpha:0 state) so it never flashes through the title card during
          SSR paint / before the reveal effect runs — GSAP overrides these with
          inline styles once it takes over. Also keeps it hidden under
          prefers-reduced-motion, where the effect returns early without pinning. */}
      <div ref={actTwoRef} className="absolute inset-0 z-0 opacity-0 invisible">
        {/* Canvases only — the copy below stays server-rendered so it is
            translatable and crawlable whatever the boot gate is doing. Gated on
            scroll intent (not just boot) so this second WebGL context never
            mounts while the visitor is still watching act one. */}
        {chromeOn && (
          <CanvasBoundary label="hero chrome">
            <FloatingShapesBackground className="z-0" paused={actTwoPaused} />
            <HeroChrome
              className="absolute inset-0 z-10"
              paused={actTwoPaused}
              motion={chromeMotion}
            />
          </CanvasBoundary>
        )}
        <div className="absolute inset-0 z-20 pointer-events-none">
          {/* Soft dark halo behind the copy so it stays readable over the
              brightest parts of the chrome. */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[72vw] h-[44vh] rounded-full bg-black/30 blur-3xl" />
          <div
            ref={promise1Ref}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
          >
            <h2
              data-chrome-text
              className="chrome-text font-display text-5xl sm:text-7xl md:text-8xl font-bold leading-[0.95] tracking-tighter"
            >
              {t("hero.actTwoTitle", "Il tuo brand, elevato.")}
            </h2>
            <p className="mt-6 text-base md:text-lg text-white/60 font-light leading-relaxed max-w-md">
              {t("hero.actTwoSub", "Web design su misura per chi non si accontenta.")}
            </p>
          </div>
          <div
            ref={promise2Ref}
            className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
          >
            <h2
              data-chrome-text
              className="chrome-text font-display text-5xl sm:text-7xl md:text-8xl font-bold leading-[0.95] tracking-tighter"
            >
              {t("hero.actTwoTitle2", "Estetica che converte.")}
            </h2>
            <p className="mt-6 text-base md:text-lg text-white/60 font-light leading-relaxed max-w-md">
              {t("hero.actTwoSub2", "Performance, SEO e conversioni — di serie.")}
            </p>
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
