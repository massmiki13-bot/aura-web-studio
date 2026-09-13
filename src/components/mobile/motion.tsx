"use client";

import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * The phone site's movement vocabulary. Four pieces, used everywhere, rather
 * than a bespoke effect per section — that is what makes a site read as
 * designed instead of decorated.
 *
 * Everything here animates `transform` and `opacity` and nothing else. Those
 * two are the only properties a browser can hand to the compositor without
 * recalculating layout or repainting, which is the whole difference between
 * 60fps and the stutter the phone site has today.
 *
 * The `as` prop lets a caller pick the element without giving up the
 * animation — a list item still has to be an <li>. It is an explicit union of
 * the handful of tags these wrap, not a general `ElementType`: that resolves
 * to the intersection of every element's props, which is `never`, and
 * widening it back out with a props parameter makes the JSX union too large
 * for the compiler. A short list is both simpler and stricter.
 *
 * Enter animations run off IntersectionObserver and plain CSS transitions,
 * not a scroll library. An observer fires a handful of times per page; a
 * scroll handler fires on every frame of every flick. For "appear once when
 * you reach it", the observer is both cheaper and impossible to jank.
 */

type PolymorphicTag = "div" | "li" | "span" | "p" | "article" | "section";

/**
 * Does this visitor ask for less movement? `false` until measured, so the
 * server and the first client render agree.
 *
 * Honouring this is not a nicety. The animations below start at `opacity: 0`;
 * if a reduced-motion visitor were served those styles with the transitions
 * stripped, the page would be blank. Everything here therefore skips to the
 * finished state rather than skipping the animation.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}

/**
 * Fires once, when the element has been on screen by `amount` of its height.
 * Disconnects immediately after — these are entrances, not states, and an
 * observer left attached to forty elements is forty things to re-evaluate on
 * every scroll.
 */
function useHasEntered(amount = 0.2) {
  const ref = useRef<HTMLElement | null>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Anything already on screen when the page loads reveals straight away,
    // rather than waiting for a scroll.
    //
    // The test is the full viewport height, not the `amount` threshold the
    // observer uses below, and that difference matters: the hero's scroll cue
    // sits near the bottom edge, just outside the observer's trigger line, so
    // with a stricter test it stayed invisible until the visitor scrolled —
    // which is precisely what it exists to ask them to do.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      setEntered(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setEntered(true);
        io.disconnect();
      },
      { threshold: amount, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [amount]);

  return { ref, entered };
}

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Seconds of delay, for staggering siblings by hand. */
  delay?: number;
  /** How far it travels up, in pixels. */
  distance?: number;
  as?: PolymorphicTag;
};

/**
 * The workhorse: content rises a little and fades in as it arrives.
 *
 * Small distances on purpose. A phone viewport is short, so a 60px entrance
 * is a third of a visible card travelling — it reads as sloppy rather than
 * dramatic. The drama comes from `MaskWords` and the sticky sections, not
 * from moving everything a long way.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  distance = 18,
  as: Tag = "div",
}: RevealProps) {
  const reduced = useReducedMotion();
  const { ref, entered } = useHasEntered();

  if (reduced) return <Tag className={className}>{children}</Tag>;

  return (
    <Tag
      ref={ref as never}
      className={cn("will-change-transform", className)}
      style={{
        opacity: entered ? 1 : 0,
        transform: entered ? "none" : `translate3d(0, ${distance}px, 0)`,
        transition: `opacity 700ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}s, transform 700ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
      }}
    >
      {children}
    </Tag>
  );
}

/**
 * A heading whose words climb out from behind a mask, one after the next.
 *
 * Per word, not per line. Splitting by line needs the text measured after it
 * has wrapped, and on a phone the wrap points move with the font, the
 * language and the rotation — a measured split is a hydration mismatch and a
 * relayout waiting to happen. Words wrap naturally and each carries its own
 * mask, which looks the same and costs nothing to compute.
 *
 * The mask is `overflow: hidden` on an inline-block wrapper exactly one
 * line-height tall. That means the caller MUST NOT set a line-height below 1
 * on this element: the mask would then be shorter than the glyphs and clip
 * the descenders. (The desktop hero learned this the hard way with
 * `leading-[0.84]`.)
 */
export function MaskWords({
  text,
  className,
  delay = 0,
  stagger = 0.06,
  as: Tag = "span",
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: PolymorphicTag;
}) {
  const reduced = useReducedMotion();
  const { ref, entered } = useHasEntered(0.1);
  const words = text.split(" ");

  if (reduced) return <Tag className={className}>{text}</Tag>;

  return (
    <Tag ref={ref as never} className={className}>
      {words.map((word, i) => (
        <Fragment key={`${word}-${i}`}>
          <span
            // leading-[1.15] gives the descenders room inside the mask;
            // without it "g" and "p" are sheared flat.
            className="inline-block overflow-hidden align-bottom leading-[1.15]"
          >
            <span
              className="inline-block will-change-transform"
              style={{
                transform: entered ? "none" : "translate3d(0, 110%, 0)",
                transition: `transform 900ms cubic-bezier(0.16, 1, 0.3, 1) ${delay + i * stagger}s`,
              }}
            >
              {word}
            </span>
          </span>
          {/* The space between words is a sibling of the mask, never a child
              of it. Inside, it sits at the edge of an inline-block with
              `overflow: hidden` and is collapsed away — which ran every
              heading together into a single word. */}
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </Tag>
  );
}

/**
 * Counts up to `value` when it arrives on screen.
 *
 * Driven by rAF rather than a CSS transition because the thing changing is
 * text content, not a style. Kept short — a number that takes three seconds
 * to settle is a number the visitor has already scrolled past.
 */
export function CountUp({
  value,
  className,
  duration = 1100,
  suffix = "",
}: {
  value: number;
  className?: string;
  duration?: number;
  suffix?: string;
}) {
  const reduced = useReducedMotion();
  const { ref, entered } = useHasEntered(0.4);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!entered || reduced) return;
    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      // Ease-out cubic: fast at first, settles gently. A linear count looks
      // mechanical.
      setShown(Math.round(value * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [entered, reduced, value, duration]);

  return (
    <span ref={ref as never} className={className}>
      {reduced ? value : shown}
      {suffix}
    </span>
  );
}
