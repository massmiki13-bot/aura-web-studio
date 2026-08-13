"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setLenis } from "@/lib/lenis";

/**
 * Drives the whole site with Lenis smooth scroll, synced to GSAP's ticker
 * so ScrollTrigger-based reveals stay perfectly in step with the scroll.
 * Disabled under prefers-reduced-motion to respect accessibility settings.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);
    // Published so components that intercept wheel events (the Spline scenes
    // block the runtime's scroll-zoom) can forward the gesture back here
    // instead of dropping the page onto native scroll — see @/lib/lenis.
    setLenis(lenis);

    // Named so cleanup can actually remove it — removing `lenis.raf` (a
    // different function than this wrapper) would leak a ticker callback
    // that keeps firing every frame after unmount/HMR.
    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // Lenis drives scroll via its own transform, so plain hash links (nav
    // anchors, "#contact" CTAs) need to go through lenis.scrollTo — a native
    // scrollIntoView/location.hash jump would desync the visual scroll
    // position from window.scrollY.
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a[href*='#']");
      if (!anchor) return;
      const href = anchor.getAttribute("href") ?? "";
      const hashIndex = href.indexOf("#");
      if (hashIndex === -1) return;
      const path = href.slice(0, hashIndex);
      if (path && path !== window.location.pathname) return; // cross-page hash link, let the router navigate
      const id = href.slice(hashIndex + 1);
      const target = id ? document.getElementById(id) : document.body;
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: 0 });
    };
    document.addEventListener("click", onClick);

    return () => {
      setLenis(null);
      lenis.destroy();
      gsap.ticker.remove(onTick);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
