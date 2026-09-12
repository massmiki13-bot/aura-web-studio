"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import { gsap, ScrollTrigger } from "@/lib/gsap";
import { getLenis } from "@/lib/lenis";
import { useIsDesktopViewport } from "@/hooks/use-desktop-viewport";
import { categoryLabel, featuredProjects, type Project } from "@/components/aura/projects-data";
import { localizedPath, type Locale } from "@/lib/seo";
import { RockField } from "@/components/three/RockField";

/* ------------------------------------------------------------------------ *
 * The field
 *
 * One continuous 3D space rather than a state machine. Every project is a
 * plane on a wall that recedes from the viewer; scrolling walks the camera
 * along that wall. A plane far from the camera sits at its scattered spot,
 * turned away at a shared angle and small; as it reaches the camera it
 * straightens, slides to the middle and opens out to fill the screen.
 *
 * There is no "grid mode" and no "open mode" — a single blend factor per card
 * does both, which is why it never has to decide when to switch and can never
 * be caught half-switched. Scrub it backwards and it runs backwards.
 *
 * The scroll settles on each project in turn (see `settle`), so a plane at
 * full screen is a resting state rather than something glimpsed in passing.
 * ------------------------------------------------------------------------ */

/**
 * Where each plane sits on the wall, as a fraction of the viewport from its
 * centre. One position per featured project, so the five of them are a single
 * composition rather than a repeating motif — art-directed to clear each other
 * at every aspect ratio between 4:3 and 21:9.
 */
const SCATTER: { x: number; y: number }[] = [
  { x: -0.29, y: -0.28 },
  { x: 0.05, y: -0.34 },
  { x: 0.32, y: -0.06 },
  { x: -0.26, y: 0.19 },
  { x: 0.14, y: 0.3 },
];

/** Nudge applied per full turn of SCATTER, if the list ever outgrows it. */
const CYCLE_DRIFT = { x: 0.045, y: 0.03 };

/**
 * The shared angle every plane is turned to while it's out on the wall, and
 * the focal length they are all seen through.
 *
 * The angle and the perspective have to be picked together: at 1600px of
 * focal length a 34° turn barely foreshortens at all and the field reads as
 * flat cards that happen to be skewed. 1150px is short enough that the near
 * edge of a plane is visibly larger than its far edge, which is what sells the
 * planes as objects in a space rather than as parallelograms.
 */
const FIELD_ROT_X = 11;
const FIELD_ROT_Y = -34;
const PERSPECTIVE = 1150;

/**
 * How small a plane is at rest on the wall, relative to its open size.
 *
 * The planes are laid out at their *open* size and scaled down, never up:
 * scaling a 340px image four times over to fill a screen is how you get a
 * blurred hero, and it is the one thing that would give this away as a trick.
 */
const FIELD_SCALE = 0.29;

/**
 * How much wall one full turn of SCATTER occupies, in viewport heights.
 *
 * This is the only thing that sets the field's density. SCATTER already
 * spreads its planes across most of a screen, so a cycle height near 1 means
 * all five are on screen together when the section is entered.
 *
 * An earlier version marched the planes down a single column and shrank them
 * toward a vanishing point. The arithmetic was fine and the result was empty:
 * with the convergence point a viewport and a half below the middle of the
 * screen, only the two planes either side of the camera ever landed on it.
 * The reference's planes are all about the same size, because its field is
 * wide rather than deep — so this one is too.
 */
const CYCLE_HEIGHT = 0.95;

/**
 * How much a plane shrinks and dims per slot of distance from the camera.
 * Deliberately slight: enough to tell the eye which planes are further off,
 * not enough to turn the field into a tunnel.
 */
const DEPTH = 0.055;

/** Slots either side of the camera over which a plane opens. One = one card. */
const FOCUS_SPAN = 1;

/**
 * How far *before* the first project the camera starts, in slots.
 *
 * Without it the section opens with project 01 already filling the screen and
 * the field is never seen at all — you would arrive at the end of the first
 * transition rather than the start of it. A slot and a bit of run-up means the
 * section is entered on the field, and the first thing scrolling does is pull
 * one plane out of it, which is the whole idea.
 */
const LEAD_IN = 1.35;

/** Scroll distance spent per project, in viewport heights. */
const SCROLL_PER_CARD = 0.72;

/** Quiet after the last scroll event before the field settles onto a project. */
const SETTLE_DELAY = 130;

/**
 * The constellation drawn between the planes.
 *
 * Every pair of planes gets a line, but a line only shows when the two are
 * close enough on screen: beyond this fraction of the viewport's short side it
 * fades out entirely. Drawing all of them at full strength turns five planes
 * into a scribble — this way the web forms and re-forms as the field moves,
 * which is what makes it read as a structure the planes belong to rather than
 * as decoration laid over them.
 */
const LINK_REACH = 1.25;

/**
 * How far behind each plane its wireframe backing sits, in local pixels.
 *
 * This is what turns a scatter of flat pictures into a rig. Each plane gets a
 * frame floating behind it at this depth and four struts running back from its
 * own corners — so the plane reads as a screen mounted on something, and the
 * whole field reads as one structure seen in perspective rather than as cards
 * lying on a black page.
 */
const RIG_DEPTH = 210;

/** How much wider than its plane the backing frame is. */
const RIG_SPREAD = 1.16;

/** Smootherstep — flat at both ends, so a plane settles open rather than snapping. */
function ease(t: number) {
  const c = Math.min(Math.max(t, 0), 1);
  return c * c * c * (c * (c * 6 - 15) + 10);
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

type CardRefs = {
  root: HTMLElement;
  plane: HTMLElement;
  caption: HTMLElement | null;
  dim: HTMLElement | null;
};

/**
 * Selected work as a field of planes you scroll through, stopping on each.
 *
 * What was here before was a typographic index — thirteen rows of display type
 * with a preview that chased the cursor. It read well and it was cheap, but it
 * showed the work at the size of a postage stamp and only ever one at a time,
 * and it asked a visitor to read a list when what we actually have to sell is
 * how the sites *look*.
 *
 * This shows five of them at the size of the screen, and the rest live on
 * /lavori. Five is the number the section can afford: each one costs a stop
 * and about three quarters of a screen of scroll, so thirteen came to eleven
 * screens for a single section of the home page.
 *
 * Everything a crawler or a reader needs is in the DOM either way. Each plane
 * is a real anchor wrapping a real heading and a real image, server-rendered,
 * in source order, whether or not a single frame of the transform work runs.
 */
function ProjectsField({ items }: { items: Project[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<CardRefs[]>([]);
  const backdropRef = useRef<HTMLDivElement>(null);
  /**
   * The whole wireframe, in three <path> elements: the backing frames, the
   * struts, and the links between planes.
   *
   * It used to be thirty-five separate <line> and <polygon> elements, each
   * getting its own setAttribute every scrubbed frame. That measured a p90 of
   * 32ms on the pinned section — one frame in ten at half rate — because the
   * cost is not the geometry, it is thirty-five separate invalidations and
   * display-list entries per frame. Three path strings cost three.
   *
   * Opacity can't be per-element any more, so the fade that was per-plane is
   * now baked into the stroke of each subpath instead — see `place`.
   */
  const framesPath = useRef<SVGPathElement>(null);
  const strutsPath = useRef<SVGPathElement>(null);
  const linksPath = useRef<SVGPathElement>(null);

  /**
   * Which plane the camera is on, as a float. Written by the scroll loop, read
   * by the click handler and the arrows — a ref, because it changes every
   * frame and nothing about the render depends on it.
   */
  const head = useRef(-LEAD_IN);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  /** Set while the field is scrolling itself, so it can't fight its own tween. */
  const settling = useRef(false);

  /**
   * Which planes are close enough to be worth a full-resolution image. Only
   * this crosses into React, and only when the set actually changes — roughly
   * once per project passed, not once per frame.
   */
  const [near, setNear] = useState<number[]>([0, 1]);

  const register = useCallback((i: number, refs: CardRefs | null) => {
    if (refs) cardsRef.current[i] = refs;
  }, []);

  /**
   * Scroll position for a given camera slot.
   *
   * `-LEAD_IN` is the field at rest, `0`…`last` are the projects. Everything
   * that moves the camera goes through this, so the resting places and the
   * places the arrows and clicks aim at are the same numbers by construction.
   */
  const scrollForSlot = useCallback(
    (slot: number) => {
      const trigger = triggerRef.current;
      if (!trigger) return null;
      const span = items.length - 1 + LEAD_IN;
      const progress = (slot + LEAD_IN) / span;
      return trigger.start + (trigger.end - trigger.start) * Math.min(Math.max(progress, 0), 1);
    },
    [items.length],
  );

  /**
   * Walk the camera to a slot.
   *
   * Scrolls rather than animating the transforms directly: the scrub is the
   * single source of truth for where the camera is, so moving the page is the
   * only way to move the camera that can't end up disagreeing with it. Lenis
   * owns the scroll position, so it gets asked first and the native scroller
   * is only a fallback for reduced-motion visitors.
   */
  const goTo = useCallback(
    (slot: number, duration = 1) => {
      const target = scrollForSlot(Math.max(-LEAD_IN, Math.min(items.length - 1, slot)));
      if (target === null) return;
      const lenis = getLenis();
      settling.current = true;
      const release = () => {
        settling.current = false;
      };
      if (lenis) lenis.scrollTo(target, { duration, onComplete: release });
      else {
        window.scrollTo({ top: target, behavior: "smooth" });
        window.setTimeout(release, duration * 1000);
      }
      // Belt and braces: Lenis drops onComplete if the visitor interrupts the
      // tween with their own wheel, and a lock that never lifts would leave
      // the field unable to settle again for the rest of the visit.
      window.setTimeout(release, duration * 1000 + 400);
    },
    [items.length, scrollForSlot],
  );

  useEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const n = items.length;
    const last = n - 1;

    /**
     * Place every plane for a given camera position.
     *
     * Runs on each scrubbed frame and writes transforms straight to the nodes:
     * no React in the loop, and nothing but `transform` and `opacity`, so a
     * frame costs the compositor and nothing else.
     */
    const place = (at: number) => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const nearNext: number[] = [];
      const centres: { x: number; y: number; d: number }[] = [];
      let framesD = "";
      let strutsD = "";
      let linksD = "";
      let peak = 0;

      // The plane's CSS width, read from the element rather than recomputed
      // from the `min(96vw, 168vh)` expression — one source of truth.
      const planeW = cardsRef.current[0]?.plane.offsetWidth ?? Math.min(vw * 0.96, vh * 1.68);

      for (let i = 0; i < n; i++) {
        const entry = cardsRef.current[i];
        if (!entry) continue;

        // Signed distance from the camera, in plane-slots. 0 = wide open.
        const u = i - at;
        const dist = Math.abs(u);

        // A slight shrink with distance. See DEPTH — this is atmosphere, not
        // the layout; the layout is the scatter below.
        const fs = 1 / (1 + dist * DEPTH);

        // How far open. Non-zero only for the plane the camera is on and its
        // two immediate neighbours.
        const k = ease(1 - Math.min(dist / FOCUS_SPAN, 1));
        if (k > peak) peak = k;
        if (dist < 1.7) nearNext.push(i);

        // Where this plane is pinned on the wall: its slot in the scatter,
        // pushed down by one cycle height for every full turn.
        const spot = SCATTER[i % SCATTER.length];
        const cycle = Math.floor(i / SCATTER.length);
        const wallX = (spot.x + cycle * CYCLE_DRIFT.x) * vw;
        const wallY = (spot.y + cycle * (CYCLE_HEIGHT + CYCLE_DRIFT.y)) * vh;

        // The wall slides up at the rate that carries one cycle past the
        // camera every SCATTER.length slots. The plane the camera is on won't
        // land exactly in the middle by this arithmetic — it doesn't need to,
        // because `k` takes it there.
        const scrolled = (at / SCATTER.length) * CYCLE_HEIGHT * vh;

        const restX = wallX * fs;
        const restY = (wallY - scrolled) * fs;

        // Open position is dead centre, square to the camera, full size.
        const x = restX * (1 - k);
        const y = restY * (1 - k);
        const scale = lerp(FIELD_SCALE * fs, 1, k);
        const rx = FIELD_ROT_X * (1 - k);
        const ry = FIELD_ROT_Y * (1 - k);

        entry.plane.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(
          2,
        )}px, 0) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(${scale.toFixed(4)})`;

        // Where the constellation below will hang its node for this plane.
        centres.push({ x: vw / 2 + x, y: vh / 2 + y, d: fs });

        /**
         * The rig behind this plane, projected by hand.
         *
         * The browser has already done this maths to draw the plane, but it
         * will not tell anyone the answer — so it is redone here for the four
         * corners. A local point is scaled, turned about Y then about X (the
         * order CSS composes `rotateX() rotateY() scale()` in, right to left),
         * translated, and then divided through by the same focal length the
         * stage declares. Get the order wrong and the frame slides off its
         * plane the moment anything rotates.
         */
        const ra = (rx * Math.PI) / 180;
        const rb = (ry * Math.PI) / 180;
        const cosA = Math.cos(ra);
        const sinA = Math.sin(ra);
        const cosB = Math.cos(rb);
        const sinB = Math.sin(rb);

        const project = (lx: number, ly: number, lz: number) => {
          const sx0 = lx * scale;
          const sy0 = ly * scale;
          const sz0 = lz * scale;
          // rotateY
          const x1 = sx0 * cosB + sz0 * sinB;
          const z1 = -sx0 * sinB + sz0 * cosB;
          // rotateX
          const y2 = sy0 * cosA - z1 * sinA;
          const z2 = sy0 * sinA + z1 * cosA;
          // translate, then the stage's own perspective divide
          const X = x1 + x;
          const Y = y2 + y;
          const persp = PERSPECTIVE / (PERSPECTIVE - z2);
          return { x: vw / 2 + X * persp, y: vh / 2 + Y * persp };
        };

        const hw = planeW / 2;
        const hh = planeW / 2 / (16 / 9);
        const front = [
          project(-hw, -hh, 0),
          project(hw, -hh, 0),
          project(hw, hh, 0),
          project(-hw, hh, 0),
        ];
        const back = [
          project(-hw * RIG_SPREAD, -hh * RIG_SPREAD, -RIG_DEPTH),
          project(hw * RIG_SPREAD, -hh * RIG_SPREAD, -RIG_DEPTH),
          project(hw * RIG_SPREAD, hh * RIG_SPREAD, -RIG_DEPTH),
          project(-hw * RIG_SPREAD, hh * RIG_SPREAD, -RIG_DEPTH),
        ];

        framesD += `M${back.map((pt) => `${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`).join("L")}Z`;
        for (let c = 0; c < 4; c++) {
          strutsD += `M${front[c].x.toFixed(1)} ${front[c].y.toFixed(1)}L${back[c].x.toFixed(
            1,
          )} ${back[c].y.toFixed(1)}`;
        }

        /**
         * Planes further down the wall darken rather than staying crisp —
         * which is the other half of reading as distance.
         *
         * Done with a black layer inside the card, not with opacity on the
         * card itself. Opacity made the plane translucent, and once there was
         * rock drifting behind the field you could see it straight through the
         * screenshots: a project card with an asteroid ghosting through the
         * middle of it. Darkening an opaque card looks the same and hides
         * what's behind it, which is what a screen should do.
         */
        if (entry.dim) {
          entry.dim.style.opacity = (1 - lerp(Math.max(0.5, 0.96 - dist * 0.075), 1, k)).toFixed(3);
        }
        // The open one has to sit above everything, including the planes that
        // are nominally in front of it on the wall.
        entry.root.style.zIndex = String(100 + Math.round(k * 100) - Math.round(dist));
        if (entry.caption) entry.caption.style.opacity = ease((k - 0.55) / 0.45).toFixed(3);
      }

      // The wall darkens as a plane opens, so the open one reads as a screen
      // rather than as a very large card lying on top of other cards.
      if (backdropRef.current) backdropRef.current.style.opacity = (peak * 0.82).toFixed(3);

      // The constellation.
      //
      // A plane's transform rotates and scales about its own centre and then
      // translates, so its centre on screen is just the stage centre plus that
      // translation — no need to unpick the matrix. Lines are drawn between
      // those centres and faded by distance, so the web thins out as the field
      // spreads and draws together as it gathers.
      //
      // It fades out with `peak`: once a plane is opening to fill the screen,
      // a web of lines over the top of it is noise.
      const web = 1 - ease(peak);

      if (framesPath.current) {
        framesPath.current.setAttribute("d", framesD);
        framesPath.current.style.opacity = (0.3 * web).toFixed(3);
      }
      if (strutsPath.current) {
        strutsPath.current.setAttribute("d", strutsD);
        strutsPath.current.style.opacity = (0.22 * web).toFixed(3);
      }

      // The links, as one subpath each.
      //
      // Distance still decides whether a pair is joined at all, but the
      // per-pair fade is gone with the per-element opacity: a pair is either
      // drawn or it isn't, and the cut-off is soft enough in practice because
      // the planes are always moving through it. What is kept is the reach —
      // without it every plane joins every other and the field is a scribble.
      let strongest = 0;
      for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
          const a = centres[i];
          const b = centres[j];
          const len = Math.hypot(b.x - a.x, b.y - a.y);
          const fade = 1 - len / (Math.min(vw, vh) * LINK_REACH);
          if (fade <= 0.06) continue;
          if (fade > strongest) strongest = fade;
          linksD += `M${a.x.toFixed(1)} ${a.y.toFixed(1)}L${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
        }
      }
      if (linksPath.current) {
        linksPath.current.setAttribute("d", linksD);
        linksPath.current.style.opacity = (Math.min(1, strongest) * 0.42 * web).toFixed(3);
      }

      setNear((prev) =>
        prev.length === nearNext.length && prev.every((v, j) => v === nearNext[j])
          ? prev
          : nearNext,
      );
    };

    /**
     * Come to rest on a project rather than wherever the wheel ran out.
     *
     * Done here rather than with ScrollTrigger's own `snap` on purpose: that
     * one tweens the window's scroll position directly, and Lenis is already
     * tweening the same number from its own inertia — the two argue, and the
     * page judders to a halt. Asking Lenis to do the travel means there is
     * only ever one thing moving the page.
     *
     * `-LEAD_IN` is in the list of resting places, so entering the section
     * rests on the whole field and the first wheel gesture is what pulls a
     * project out of it.
     */
    let timer = 0;
    let direction = 1;

    /** The places the field is allowed to come to rest: the whole field, then each project. */
    const stops = [-LEAD_IN, ...items.map((_, i) => i)];

    const settle = () => {
      const trigger = triggerRef.current;
      if (!trigger || !trigger.isActive || settling.current) return;
      const at = head.current;

      // Already resting on one. Without this the field would re-scroll to
      // where it already is every time the visitor twitched the wheel.
      if (stops.some((s) => Math.abs(s - at) < 0.02)) return;

      // The next stop *in the direction of travel*, never the nearest one.
      //
      // Nearest is the obvious implementation and it traps the visitor. The
      // gap between the field and the first project is a slot and a third —
      // about a screen of scroll — so an ordinary wheel flick lands a third of
      // the way across it, is still nearest to the field, and gets pulled
      // straight back. The section becomes a wall: you scroll, and nothing
      // happens, forever. Directional makes one gesture mean one project,
      // which is also what it should have meant in the first place.
      const target =
        direction >= 0 ? stops.find((s) => s > at) : [...stops].reverse().find((s) => s < at);

      // Nothing ahead in that direction means the visitor is leaving the
      // section — off the end, or back up out of the top. Let them.
      if (target === undefined) return;

      goTo(target, 0.5);
    };

    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: "top top",
        end: `+=${Math.round((last + LEAD_IN) * SCROLL_PER_CARD * 100)}%`,
        pin: stage,
        pinSpacing: true,
        // Lenis already smooths the scroll; a second smoothing pass here makes
        // the planes visibly trail the page, the same way it did in Hero.
        scrub: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          direction = self.direction;
          head.current = self.progress * (last + LEAD_IN) - LEAD_IN;
          place(head.current);
          window.clearTimeout(timer);
          timer = window.setTimeout(settle, SETTLE_DELAY);
        },
        onRefresh: () => place(head.current),
      });
      triggerRef.current = trigger;
    }, section);

    place(head.current);
    const onResize = () => place(head.current);
    window.addEventListener("resize", onResize);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", onResize);
      triggerRef.current = null;
      ctx.revert();
    };
  }, [items, goTo]);

  /**
   * A click on a plane that isn't open yet means "bring me to this one" — not
   * "leave the site". Only once it is actually open does the anchor do what an
   * anchor does. Without this, a visitor aiming at a small plane in the corner
   * of the field would be thrown out to a client's site by a stray click,
   * which is both surprising and the fastest way off this page.
   */
  const onCardClick = useCallback(
    (i: number) => (event: React.MouseEvent) => {
      if (Math.abs(head.current - i) < 0.35) return; // open: let the link run
      event.preventDefault();
      goTo(i);
    },
    [goTo],
  );

  return (
    <div ref={sectionRef} className="relative">
      <div
        ref={stageRef}
        className="relative flex h-[100svh] items-center justify-center overflow-hidden"
        // The one perspective every plane shares. On the element that holds
        // them, not on each plane, so they sit in a single space and their
        // vanishing point is the middle of the screen rather than their own
        // centres.
        style={{ perspective: `${PERSPECTIVE}px`, perspectiveOrigin: "50% 50%" }}
      >
        {/* The room.

            A floor and a ceiling, laid in the stage's own perspective rather
            than faked with a gradient: they are ordinary elements turned about
            X and pushed away, so they recede to exactly the vanishing point
            the planes do. That shared vanishing point is the whole trick — it
            is what makes the planes read as being *in* somewhere instead of on
            top of something.

            Direct children of the stage, not wrapped: `perspective` applies to
            an element's own children, so a wrapper div would flatten these two
            back into a picture of a grid. Each is masked on its own — and the
            mask is deliberately short in Y, because after the rotation the
            element's Y axis is mostly depth, and a mask that reaches the far
            edge is a mask trying to cover the horizon. */}
        {[-1, 1].map((side) => (
          <div
            key={side}
            aria-hidden
            className="pointer-events-none absolute top-1/2 left-1/2 z-0 h-[130vh] w-[200vw]"
            style={{
              transform: `translate(-50%, -50%) translateY(${side * 46}vh) rotateX(${
                side * 80
              }deg)`,
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.3) 1px, transparent 1px)",
              backgroundSize: "110px 110px",
              maskImage: "radial-gradient(36% 22% at 50% 52%, rgba(0,0,0,0.9) 0%, transparent 72%)",
              WebkitMaskImage:
                "radial-gradient(36% 22% at 50% 52%, rgba(0,0,0,0.9) 0%, transparent 72%)",
            }}
          />
        ))}

        {/* Rock, drifting in the volume the planes hang in.

            Behind the planes and behind the constellation, in front of the
            room: the screens are the content and nothing may pass in front of
            them. It sits below the backdrop too, so when a project opens to
            fill the screen the rock dims away with everything else.

            This is what the connections were missing. Lines strung between
            five planes over an empty void read as a diagram; the same lines
            strung across a space with objects actually in it read as a place.
            */}
        <RockField
          className="pointer-events-none absolute inset-0 z-[40]"
          count={38}
          spread={[10, 5.5, 6]}
          // Larger than the page headers get: these share the frame with
          // screens a thousand pixels wide, and pebbles next to those read as
          // dust on the lens.
          size={[0.07, 0.62]}
          drift={0.2}
          distance={12.5}
          opacity={0.7}
        />

        {/* A soft wash over the room, so the middle of the stage lifts off
            the black and the grid never reads as a hard graphic. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
          style={{
            background:
              "radial-gradient(55% 55% at 50% 45%, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 45%, transparent 75%)",
          }}
        />

        {/* The constellation the planes hang in.
            
            Below the planes and below the backdrop, so it disappears the
            moment one of them opens. Positioned in raw viewport pixels — the
            same coordinates `place` computes the plane centres in — so the
            svg has no viewBox and no scaling of its own to disagree with. */}
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[50] h-full w-full"
          style={{ overflow: "visible" }}
        >
          {/* Three paths for the whole wireframe — see the refs above for
              why it is not thirty-five elements. Drawn back to front: the
              frames behind the planes, the struts that carry them, then the
              links between planes over the top. */}
          <path
            ref={framesPath}
            fill="none"
            stroke="rgb(255 255 255)"
            strokeWidth={1}
            strokeLinejoin="round"
            opacity={0}
          />
          <path
            ref={strutsPath}
            fill="none"
            stroke="rgb(255 255 255)"
            strokeWidth={1}
            strokeLinecap="round"
            opacity={0}
          />
          <path
            ref={linksPath}
            fill="none"
            stroke="rgb(255 255 255)"
            strokeWidth={1.2}
            strokeLinecap="round"
            opacity={0}
          />
        </svg>

        {/* Darkens under the plane that's opening — see `place`. */}
        <div
          ref={backdropRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 z-[60] bg-black opacity-0"
        />

        <ul className="contents">
          {items.map((project, i) => (
            <FieldCard
              key={project.id}
              project={project}
              index={i}
              highRes={near.includes(i)}
              onClick={onCardClick(i)}
              register={register}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * One plane.
 *
 * The outer `li` never moves — it is the anchor point in the middle of the
 * stage that every transform is measured from. Everything the loop writes goes
 * on the inner `[data-plane]` element, so the two concerns (where the plane is
 * in the layout, where it is in the space) never fight.
 */
function FieldCard({
  project,
  index,
  highRes,
  onClick,
  register,
}: {
  project: Project;
  index: number;
  highRes: boolean;
  onClick: (event: React.MouseEvent) => void;
  register: (i: number, refs: CardRefs | null) => void;
}) {
  const { t } = useTranslation();
  const rootRef = useRef<HTMLLIElement>(null);
  const planeRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const dimRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (rootRef.current && planeRef.current) {
      register(index, {
        root: rootRef.current,
        plane: planeRef.current,
        caption: captionRef.current,
        dim: dimRef.current,
      });
    }
    return () => register(index, null);
  }, [index, register]);

  return (
    <li
      ref={rootRef}
      // `pointer-events-none`, with the plane inside turning them back on.
      //
      // Every one of these boxes is the full open size and every one of them
      // is stacked on the middle of the stage, so the one on top — whichever
      // plane is currently open — covers the screen and, left to itself, eats
      // the clicks aimed at the small planes visibly sitting out in the field.
      // Hit-testing has to follow the transform, not the layout box.
      className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{ zIndex: 100 - index }}
    >
      <div
        ref={planeRef}
        data-plane
        // The open size. Everything else is this, scaled down — never up, so
        // the image is sharp at the moment it matters. 16:9 because every one
        // of these is a landscape screenshot of a website.
        //
        // No `will-change`, and a fixed radius rather than one that opens out
        // as the plane does. Both were in here and both were wrong in the same
        // way: these boxes are 1382x778 apiece, and hinting them all for
        // promotion asks the compositor for tens of megabytes of texture on a
        // page already running three WebGL scenes — enough for Chrome to drop
        // the layers and paint the stage black. Animating the radius then
        // forced a full repaint of every one of them on every scrubbed frame,
        // which is the exact thing the rest of this file is careful never to
        // do. A constant 10px is invisible at full-screen size anyway.
        className="pointer-events-auto relative overflow-hidden rounded-[10px] shadow-[0_50px_110px_-40px_rgba(0,0,0,0.95)]"
        style={{
          width: "min(96vw, 168vh)",
          aspectRatio: "16 / 9",
        }}
      >
        <a
          href={project.domain ?? undefined}
          target={project.domain ? "_blank" : undefined}
          rel={project.domain ? "noreferrer" : undefined}
          onClick={onClick}
          aria-label={`${project.name} — ${categoryLabel(project.category)}`}
          className="group block h-full w-full overflow-hidden rounded-[inherit] border border-white/10 bg-neutral-950 outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          {project.image && (
            <span className="relative block h-full w-full">
              {/* The wall copy: small, cheap, always there, so a plane out in
                  the field is never an empty box waiting on the network. */}
              <Image
                src={project.image}
                alt={project.alt}
                fill
                sizes="460px"
                className="object-cover"
              />
              {/* The open copy, mounted only for the planes near the camera and
                  faded over the top. Every full-width screenshot fetched at
                  once would be several megabytes for images nobody is looking
                  at yet. */}
              {highRes && (
                <Image
                  src={project.image}
                  alt=""
                  fill
                  sizes="(max-width: 767px) 100vw, 96vw"
                  className="object-cover"
                />
              )}
            </span>
          )}

          {/* The caption belongs to the open state: it fades in with the plane
              (see `place`) and is invisible, but still readable, out on the
              wall — the text is in the DOM for a crawler and a screen reader
              at every scroll position.

              Bottom padding clears the stage's own chrome, which sits in the
              same corner of the screen once this plane fills it. */}
          <div
            ref={captionRef}
            // A deep, tall fade rather than a light one. These screenshots are
            // of websites, which means the bottom of every one of them already
            // has its own headline, buttons and ticker sitting exactly where
            // this caption goes — at from-black/85 the two read as one jumbled
            // block of text. Taking the band to solid black and starting the
            // fade higher gives the caption a surface of its own.
            className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 via-35% to-transparent px-6 pt-28 pb-20 opacity-0 md:px-10 md:pt-36 md:pb-24"
          >
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="max-w-xl">
                {/* Name and one line. The number, the category and the total
                    are all on the chrome a few lines below and visible at
                    every scroll position — saying them twice in one corner of
                    the screen reads as a bug, not as emphasis. */}
                <h3 className="font-display text-3xl leading-[1.05] font-semibold tracking-tighter text-white md:text-5xl">
                  {project.name}
                </h3>
                <p className="mt-3 hidden text-sm leading-relaxed font-light text-white/60 md:block">
                  {project.desc}
                </p>
              </div>
              <span className="font-mono-spec flex items-center gap-2 text-[10px] tracking-[0.25em] text-white/70 uppercase">
                {project.domain ? (
                  <>
                    {t("projects.visit", "Visita il sito")}
                    <ArrowUpRight className="h-4 w-4" />
                  </>
                ) : (
                  t("projects.comingSoon", "Presto online")
                )}
              </span>
            </div>
          </div>
        </a>

        {/* The distance dim — see `place`. Last child and above the anchor, so
            it darkens the caption with the card rather than leaving the words
            bright on a card that has receded. */}
        <div
          ref={dimRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] bg-black"
        />
      </div>
    </li>
  );
}

/**
 * The flow fallback: a plain list of the same five anchors.
 *
 * Used on phones, where there is no room for a field and no pointer to aim
 * into it, and under prefers-reduced-motion, where a section that only
 * advances when you scroll *is* the motion being opted out of. Same data, same
 * links, same headings — only the staging is different.
 */
function ProjectsStack({ items }: { items: Project[] }) {
  const { t } = useTranslation();
  return (
    <ul className="grid gap-8 sm:grid-cols-2">
      {items.map((project, i) => (
        <li key={project.id} className={i === 0 ? "sm:col-span-2" : undefined}>
          <a
            href={project.domain ?? undefined}
            target={project.domain ? "_blank" : undefined}
            rel={project.domain ? "noreferrer" : undefined}
            aria-label={`${project.name} — ${categoryLabel(project.category)}`}
            className="group block outline-none"
          >
            {project.image && (
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-white/10">
                <Image
                  src={project.image}
                  alt={project.alt}
                  fill
                  sizes="(max-width: 639px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            )}
            <div className="mt-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-xl leading-tight font-semibold tracking-tight text-white">
                  {project.name}
                </h3>
              </div>
              {project.domain ? (
                <ArrowUpRight className="mt-1 h-5 w-5 shrink-0 text-white/40 transition-colors group-hover:text-white" />
              ) : (
                <span className="font-mono-spec mt-1 shrink-0 text-[10px] tracking-[0.2em] text-white/25 uppercase">
                  {t("projects.comingSoon", "Presto online")}
                </span>
              )}
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Projects({ locale }: { locale: Locale }) {
  const { t } = useTranslation();
  // `=== true`, never `!== false`: null means "not measured yet", and a field
  // that mounted on that would pin the page for several screens on a phone
  // before the media query came back and told it not to.
  const isDesktop = useIsDesktopViewport();
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  const field = isDesktop === true && !reduced;

  return (
    <section id="projects" className="relative bg-black">
      <div className="mx-auto max-w-[1600px] px-6 pt-32 md:px-16 md:pt-48">
        <div className="mb-16 max-w-2xl">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-4xl leading-[1.02] font-bold tracking-tighter sm:text-5xl md:text-6xl"
          >
            {t("projects.mobileTitle", "Progetti reali, per settori reali.")}
          </motion.h2>
        </div>
      </div>

      {field ? <ProjectsField items={featuredProjects} /> : null}

      <div className="mx-auto max-w-[1600px] px-6 pb-32 md:px-16 md:pb-48">
        {!field ? <ProjectsStack items={featuredProjects} /> : null}

        {/* The way out of a section that deliberately only shows five. */}
        <div className="mt-16 flex flex-wrap items-baseline justify-between gap-8 border-t border-white/10 pt-12 md:mt-24">
          <Link
            href={localizedPath(locale, "lavori")}
            className="group font-display inline-flex items-baseline gap-4 text-3xl leading-none font-bold tracking-tighter text-white transition-colors outline-none hover:text-white/70 focus-visible:ring-2 focus-visible:ring-white/60 sm:text-4xl md:text-5xl"
          >
            {t("projects.seeAll", "Vedi tutti i lavori")}
            <ArrowRight
              className="h-7 w-7 shrink-0 transition-transform duration-500 ease-out group-hover:translate-x-2 md:h-9 md:w-9"
              aria-hidden
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
