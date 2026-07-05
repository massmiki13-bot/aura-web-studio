import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
  // Mobile browsers fire resize when the URL bar collapses mid-scroll; a
  // full ScrollTrigger refresh at that moment visibly hitches every pinned
  // section. Dimensions are re-measured on orientation change regardless.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger };
