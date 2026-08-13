/**
 * First-load orchestration for the landing page.
 *
 * Deliberately free of React. The root layout is a server component and needs
 * INTRO_CURTAIN_SCRIPT from this module; a single `useState` import anywhere
 * in the file makes the whole thing unimportable from the server, however
 * unrelated the rest of it is. The subscription hook therefore lives next door
 * in `use-boot-ready.ts`, behind its own "use client" boundary, and everything
 * here is plain functions and module state that either side can call.
 *
 * The home page mounts several independent GPU workloads (the hero's shader
 * background, the hero's chrome blob, the Spline scene one section down) plus
 * the intro overlay. Left to themselves they all spin up inside the same few
 * hundred milliseconds as hydration, font loading and ScrollTrigger's first
 * pin — which is exactly why the hero background used to stutter for the first
 * seconds of a cold visit: three WebGL contexts compiling shaders and a
 * multi-megabyte runtime downloading while the compositor is trying to hold
 * 60fps.
 *
 * So there is one gate. Nothing heavy starts until `markBootReady()` fires:
 *
 * - cold visit → the intro plays; it owns the screen and the GPU, and opens
 *   the gate at its hand-off, while its light-leak flash still covers the page
 *   (so the hero's shader compile is masked by an animation that's on purpose);
 * - warm visit / reduced motion / `?nointro` → the gate opens on its own a
 *   beat after first paint, so the text hero paints (and LCP lands) before the
 *   canvases claim the main thread.
 *
 * The intro decision is taken synchronously and memoised, so both the intro
 * and everything waiting behind the gate read the same answer regardless of
 * effect ordering.
 */

/** Set on <html> before first paint by `INTRO_CURTAIN_SCRIPT`. */
export const INTRO_PENDING_CLASS = "intro-pending";

/**
 * Inline, render-blocking, in <head> — deliberately.
 *
 * The page is server-rendered, so the hero is painted from HTML long before
 * React hydrates and the intro overlay can mount. Without this, a cold visit
 * flashes the finished hero for a beat and *then* drops the curtain, which
 * gives the whole intro away. Deciding here (before the body paints) lets the
 * `.intro-pending` shim in styles.css hold black from the very first frame.
 *
 * Doing it in script rather than in the server response also keeps the page
 * cacheable — the decision depends on a media query and the URL, neither of
 * which the server can see — and keeps it safe for visitors with JavaScript
 * off, who never get the class and so never get a black screen.
 *
 * The answer is published on `window.__auraIntro` so the module above and the
 * intro component read exactly what the curtain was based on.
 *
 * The intro plays on every fresh load of "/" (barring `?nointro` and reduced
 * motion). The timeout is the floor under all of it: whatever happens to the
 * bundle after this point — a chunk that never arrives, a render that throws —
 * the curtain is not allowed to be the last thing a visitor sees.
 */
export const INTRO_CURTAIN_SCRIPT = `(function(){try{var l=location,p=new URLSearchParams(l.search),v;if(p.has('nointro')){v=false}else if(p.has('intro')){v=true}else{v=l.pathname==='/'&&!matchMedia('(prefers-reduced-motion: reduce)').matches}window.__auraIntro=v;if(v){var d=document.documentElement;d.classList.add('${INTRO_PENDING_CLASS}');setTimeout(function(){d.classList.remove('${INTRO_PENDING_CLASS}')},12000)}}catch(e){}})();`;

declare global {
  interface Window {
    /** Written by the pre-paint head snippet; see `introCurtainScript`. */
    __auraIntro?: boolean;
  }
}

let introDecision: boolean | null = null;

function decideIntro(): boolean {
  try {
    // The head snippet already made this call before the page painted, and it
    // is the one that put the curtain up — so its answer wins, always.
    if (typeof window.__auraIntro === "boolean") return window.__auraIntro;
    const params = new URLSearchParams(window.location.search);
    if (params.has("nointro")) return false;
    if (params.has("intro")) return true;
    if (window.location.pathname !== "/") return false;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
    // Plays on every fresh load of the home page. Within a single document the
    // answer is still memoised (and markIntroSeen flips it), so a client-side
    // navigation to "/" and back doesn't replay it — only an actual reload,
    // which re-runs the pre-paint script in a new document, does.
    return true;
  } catch {
    // Private mode / blocked storage — never trap the visitor behind an intro
    // we can't remember having shown.
    return false;
  }
}

/**
 * True when the full-motion intro will cover the screen on this page view.
 * Decided once and memoised, so every caller agrees regardless of the order
 * React happens to run their effects in — and so a client-side navigation
 * back to "/" later in the session doesn't replay it.
 */
export function introWillPlay(): boolean {
  if (typeof window === "undefined") return false;
  if (introDecision === null) introDecision = decideIntro();
  return introDecision;
}

/**
 * Marks the intro as played *for this document*. Flips both the in-memory
 * decision and the pre-paint script's answer, so a client-side navigation away
 * from the home page and back doesn't remount the intro and play it a second
 * time. It is not persisted: an actual page reload starts a fresh document, and
 * the intro plays again — which is the intended behaviour.
 */
export function markIntroSeen() {
  introDecision = false;
  if (typeof window !== "undefined") window.__auraIntro = false;
}

let ready = false;
const listeners = new Set<() => void>();

export function isBootReady() {
  return ready;
}

/**
 * Opens the gate. Idempotent — the intro calls it from its hand-off, its skip
 * button and its own failsafe.
 *
 * This is also where the pre-paint curtain comes down. It has to be here and
 * not at the end of the intro: the intro reveals the page by *fading itself
 * out*, so an opaque shim still sitting underneath would turn that dissolve
 * into a hard cut. At hand-off the intro overlay is still fully opaque and on
 * top, so removing the shim underneath it cannot be seen.
 */
export function markBootReady() {
  if (ready) return;
  ready = true;
  if (typeof document !== "undefined") {
    document.documentElement.classList.remove(INTRO_PENDING_CLASS);
  }
  for (const l of [...listeners]) l();
  listeners.clear();
}

export function onBootReady(cb: () => void): () => void {
  if (ready) {
    cb();
    return () => {};
  }
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

/**
 * Fires once, the first time the visitor shows intent to move down the page — a
 * wheel, a touch drag, an arrow key, a pointer press — or after `fallbackMs` if
 * they never do.
 *
 * The first seconds on the hero are spent watching its shader background
 * animate. Anything heavy that belongs further down the page — the chrome
 * blob's WebGL context, the multi-megabyte Spline runtime — visibly stutters
 * that animation if it mounts or parses in the same window (measured: a ~280ms
 * main-thread task right as the chrome canvas comes up). Gating that work on
 * the first real scroll intent keeps it out of the hero's moment entirely, and
 * moves its cost into a scroll gesture, where the motion hides the hitch.
 */
export function onScrollIntent(cb: () => void, fallbackMs = 6000): () => void {
  if (typeof window === "undefined") return () => {};
  let done = false;
  const events = ["wheel", "touchmove", "scroll", "keydown", "pointerdown"] as const;
  const fire = () => {
    if (done) return;
    done = true;
    cleanup();
    cb();
  };
  const cleanup = () => {
    for (const e of events) window.removeEventListener(e, fire);
    window.clearTimeout(timer);
  };
  for (const e of events) window.addEventListener(e, fire, { passive: true });
  const timer = window.setTimeout(fire, fallbackMs);
  return cleanup;
}

/**
 * Two frames (so the first paint is on screen) then the first idle slot, with
 * a short timeout so a busy main thread can't hold the visuals back for long.
 */
export function openGateAfterFirstPaint() {
  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      if (typeof window.requestIdleCallback === "function") {
        window.requestIdleCallback(() => markBootReady(), { timeout: 400 });
      } else {
        window.setTimeout(markBootReady, 120);
      }
    }),
  );
}

let armed = false;

/**
 * Last resort. If the intro is expected but never reports in — a WebGL
 * context that won't come up, a render error inside the overlay — the page
 * must not stay behind a black curtain. The intro has a tighter failsafe of
 * its own; this one only covers the case where it never mounted at all.
 */
export function armFailsafe() {
  if (armed) return;
  armed = true;
  window.setTimeout(markBootReady, 9000);
}

/* The React subscription to this gate lives in ./use-boot-ready. */
