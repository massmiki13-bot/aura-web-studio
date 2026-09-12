"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";

import {
  regions as italyRegions,
  viewBox as italyViewBox,
  project as projectItaly,
} from "@/data/italy";
import {
  countries as worldCountries,
  viewBox as worldViewBox,
  project as projectWorld,
} from "@/data/world";
import {
  comuni as southComuni,
  viewBox as southViewBox,
  project as projectSouth,
} from "@/data/southtyrol";
import { southTyrolPins, italyPins, worldPins, workAt, type Pin } from "@/lib/map-network";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------------ *
 * The network map
 *
 * Three plates you swipe between, zooming out: Alto Adige, Italy, the world.
 * All three are the real outline — 282 ISTAT comuni, twenty ISTAT regions and
 * a hundred and seventy Natural Earth coastlines, simplified up front (see
 * scripts/) — not images. Three things follow from that which a PNG could not
 * do:
 *
 * · the country a pin sits in lights up with it;
 * · an arc leaves Bolzano and arrives at the chosen town, drawing itself — the
 *   studio reaching the client, rather than a list of cities;
 * · the outline traces itself the first time the plate comes into view.
 *
 * The pins are real buttons: tab to them, open with Enter, and the card beside
 * the map stays readable either way. Each is placed by the same projection the
 * drawing came out of, so nothing is positioned by eye.
 *
 * Replaces a dotted-map render that pulled proj4, mgrs and wkt-parser — some
 * 700 kB of geo libraries — to draw a grid of dots. This is 110 kB of path
 * data and no runtime dependency at all.
 * ------------------------------------------------------------------------ */

/** A taut arc between two points — the bend you see on flight maps. */
function arc(a: [number, number], b: [number, number], bendRatio = 0.18) {
  const [ax, ay] = a;
  const [bx, by] = b;
  const mx = (ax + bx) / 2;
  const my = (ay + by) / 2;
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy) || 1;
  const bend = len * bendRatio;
  return `M${ax} ${ay}Q${mx + (dy / len) * bend} ${my - (dx / len) * bend} ${bx} ${by}`;
}

type Plate = {
  key: "altoadige" | "italia" | "mondo";
  label: string;
  caption: string;
  viewBox: string;
  shapes: { name: string; d: string }[];
  project: (lon: number, lat: number) => [number, number];
  pins: Pin[];
  /** Shapes lit under the selected pin, by name. */
  litFor: (pin: Pin) => Set<string>;
  bend: number;
};

function MapPlate({
  plate,
  active,
  live,
  onPick,
}: {
  plate: Plate;
  active: string;
  /**
   * Whether this plate is the one being looked at.
   *
   * Only the live plate's land is in the DOM. All three at once is 491 svg
   * paths — 282 comuni, 173 coastlines and 20 regions — and the browser
   * re-rasters the lot every time the page scrolls past, which measured a p90
   * of 67ms on this route: one frame in ten at 15fps. The pins and arcs are a
   * handful of nodes and stay.
   */
  live: boolean;
  onPick: (id: string) => void;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [drawn, setDrawn] = useState(false);
  /** Set once the outline has finished drawing — see the CSS note. */
  const [settled, setSettled] = useState(false);

  const placed = useMemo(
    () => plate.pins.map((p) => ({ ...p, xy: plate.project(p.lon, p.lat) })),
    [plate],
  );
  const hq = placed.find((p) => p.hq) ?? placed[0];
  const sel = placed.find((p) => p.id === active) ?? placed[0];
  const lit = plate.litFor(sel);

  /** The stroke starts when the plate is genuinely on screen. */
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDrawn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { rootMargin: "-10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /**
   * The dash comes off a beat after the last region has finished drawing:
   * 1.4s of transition plus the longest stagger, with a margin.
   */
  useEffect(() => {
    if (!drawn) return;
    const id = window.setTimeout(() => setSettled(true), 2800);
    return () => window.clearTimeout(id);
  }, [drawn]);

  /**
   * Stroke width in viewBox units, set so the drawn line lands on about one
   * device pixel whatever the table's scale — the job `non-scaling-stroke`
   * used to do, done once per resize instead of once per raster.
   */
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const vb = svg.viewBox.baseVal;
    const measure = () => {
      const r = svg.getBoundingClientRect();
      if (!r.height || !vb.height) return;
      const scale = Math.min(r.width / vb.width, r.height / vb.height);
      svg.style.setProperty("--land-stroke", (1 / Math.max(scale, 0.05)).toFixed(3));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(svg);
    return () => ro.disconnect();
  }, [plate.viewBox]);

  return (
    <div
      ref={rootRef}
      // A fixed height, with the drawing scaled to fit inside it.
      //
      // The two tables have opposite proportions — Italy is 1000x1304, the
      // world 1400x763 — so sizing by width alone gave a world map that fit
      // and an Italy that ran a screen and a half past the bottom of its box.
      // Height is the one dimension both can be held to.
      className={cn(
        "map-plate relative flex h-[400px] items-center justify-center overflow-hidden rounded-2xl bg-black sm:h-[500px] lg:h-[560px]",
        drawn && "is-drawn",
        settled && "is-settled",
      )}
    >
      {/* The graticule behind the land. Purely a surface for it to sit on. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(80% 75% at 50% 50%, black, transparent 100%)",
          WebkitMaskImage: "radial-gradient(80% 75% at 50% 50%, black, transparent 100%)",
        }}
      />

      <svg
        ref={svgRef}
        className="relative block h-full w-full"
        viewBox={plate.viewBox}
        role="img"
        aria-label={plate.label}
        preserveAspectRatio="xMidYMid meet"
      >
        <g>
          {live &&
            plate.shapes.map((shape, i) => (
              <path
                key={shape.name}
                d={shape.d}
                className={cn("map-land", lit.has(shape.name) && "is-lit")}
                pathLength={1}
                style={{ "--i": i % 24 } as React.CSSProperties}
              />
            ))}
        </g>

        <g aria-hidden>
          {placed
            .filter((p) => !p.hq)
            .map((p) => (
              <path
                key={p.id}
                d={arc(hq.xy, p.xy, plate.bend)}
                className={cn("map-link", p.id === sel.id && "is-on")}
              />
            ))}
        </g>

        <g>
          {placed.map((p, i) => {
            const on = p.id === sel.id;
            // The plates are drawn at very different scales, so pin sizes are
            // a fraction of the table rather than fixed numbers.
            const u = plate.key === "mondo" ? 0.62 : 1;
            return (
              <g
                key={p.id}
                className={cn("map-pin", on && "is-on", p.hq && "is-hq")}
                style={{ "--i": i } as React.CSSProperties}
                transform={`translate(${p.xy[0]} ${p.xy[1]})`}
              >
                {on && <circle className="map-ping" r={26 * u} />}
                <circle className="map-halo" r={15 * u} />
                <circle className="map-dot" r={(p.hq ? 8 : 6) * u} />
                {/* Labelled only when it is the base or the chosen pin.
                    Bolzano, Merano, Lana, Andriano and Val di Non sit inside
                    sixty pixels of each other on the Italy plate, and five
                    names in that space is a smudge, not a map. Every name is
                    in the list under the plate, always. */}
                {(p.hq || on) && (
                  <text className="map-label" x={0} y={-26 * u}>
                    {p.city}
                  </text>
                )}
                {/* The finger target: as wide as it needs to be, invisible. */}
                <circle
                  className="map-hit"
                  r={30 * u}
                  tabIndex={0}
                  role="button"
                  aria-pressed={on}
                  aria-label={p.city}
                  onClick={() => onPick(p.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onPick(p.id);
                    }
                  }}
                />
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

export function NetworkMap() {
  const { t } = useTranslation();

  const plates: Plate[] = useMemo(
    () => [
      {
        key: "altoadige",
        label: t("contactPage.mapSouthTyrol", "Alto Adige"),
        caption: t(
          "contactPage.mapSouthTyrolCaption",
          "Casa. La maggior parte dei siti che abbiamo costruito sta entro un'ora di macchina da qui.",
        ),
        viewBox: southViewBox,
        shapes: southComuni,
        project: projectSouth,
        pins: southTyrolPins,
        litFor: () => new Set<string>(),
        bend: 0.2,
      },
      {
        key: "italia",
        label: t("contactPage.mapItaly", "Italia"),
        caption: t(
          "contactPage.mapItalyCaption",
          "Ogni punto è una città dove un sito che abbiamo costruito è online.",
        ),
        viewBox: italyViewBox,
        shapes: italyRegions,
        project: projectItaly,
        pins: italyPins,
        // Lighting the region a pin sits in would need a point-in-polygon test
        // against twenty simplified outlines, and the simplification means the
        // answer would be wrong near the borders. Nothing lights on these
        // plates — the arc and the pin carry it.
        litFor: () => new Set<string>(),
        bend: 0.18,
      },
      {
        key: "mondo",
        label: t("contactPage.mapWorld", "Mondo"),
        caption: t(
          "contactPage.mapWorldCaption",
          "Lavoriamo da remoto: il fuso orario non è mai stato il problema.",
        ),
        viewBox: worldViewBox,
        shapes: worldCountries,
        project: projectWorld,
        pins: worldPins,
        litFor: () => new Set<string>(),
        // Flatter: at world scale the Italy plate's bend sends an arc to Sydney
        // halfway up the frame and out of the top.
        bend: 0.1,
      },
    ],
    [t],
  );

  const [which, setWhich] = useState(0);
  const [picked, setPicked] = useState<Record<string, string>>({
    altoadige: southTyrolPins[0].id,
    italia: italyPins[0].id,
    mondo: worldPins[1].id,
  });

  const scrollerRef = useRef<HTMLDivElement>(null);

  /**
   * The tabs and the swipe are the same control.
   *
   * The scroller is a real scroll-snap container, so a trackpad flick, a touch
   * swipe and a click on a tab all end in the same place — and the tab state
   * follows the scroll rather than being set by the click, so it can never
   * disagree with what is on screen.
   */
  const goTo = useCallback((i: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTo({ left: i * el.clientWidth, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const i = Math.round(el.scrollLeft / Math.max(1, el.clientWidth));
        setWhich((prev) => (prev === i ? prev : i));
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      el.removeEventListener("scroll", onScroll);
    };
  }, []);

  const plate = plates[Math.min(which, plates.length - 1)];
  const selected = plate.pins.find((p) => p.id === picked[plate.key]) ?? plate.pins[0];
  const delivered = workAt(selected);

  return (
    <div>
      {/* Which plate, and the way between them. */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {plates.map((p, i) => (
            <button
              key={p.key}
              type="button"
              onClick={() => goTo(i)}
              aria-current={which === i}
              className={cn(
                "font-mono-spec rounded-full border px-4 py-2 text-[10px] tracking-[0.25em] uppercase transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white/60",
                which === i
                  ? "border-white/45 text-white"
                  : "border-white/12 text-white/45 hover:border-white/30 hover:text-white/80",
              )}
            >
              {p.label}
            </button>
          ))}
        </div>
        <p className="font-mono-spec text-[10px] tracking-[0.25em] text-white/30 uppercase">
          {t("contactPage.mapSwipe", "Scorri →")}
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
        {/* The plates. `snap-mandatory` on a plain overflow container: no
            library, and the keyboard and a screen reader get an ordinary
            scrollable region. */}
        <div
          ref={scrollerRef}
          className="map-scroller flex snap-x snap-mandatory overflow-x-auto overscroll-x-contain rounded-2xl border border-white/10 bg-neutral-950 p-2"
        >
          {plates.map((p, i) => (
            <div key={p.key} className="w-full shrink-0 snap-center">
              <MapPlate
                plate={p}
                active={picked[p.key]}
                // The neighbour is kept live too, so a plate is already drawn
                // by the time a swipe lands on it rather than appearing a beat
                // late.
                live={Math.abs(which - i) <= 1}
                onPick={(id) => setPicked((prev) => ({ ...prev, [p.key]: id }))}
              />
            </div>
          ))}
        </div>

        {/* The card for whatever is selected on the plate you are looking at. */}
        <aside key={`${plate.key}-${selected.id}`} className="map-card">
          <h3 className="font-display flex flex-wrap items-baseline gap-x-3 text-3xl font-bold tracking-tighter text-white">
            {selected.city}
            <span className="font-mono-spec text-[11px] tracking-[0.2em] text-white/35">
              {selected.area}
            </span>
          </h3>

          <p className="mt-4 text-sm leading-relaxed font-light text-white/50">{plate.caption}</p>

          {delivered.length > 0 ? (
            <>
              <ul className="mt-7 space-y-2">
                {delivered.map((p) => (
                  <li key={p.id}>
                    {p.domain ? (
                      <a
                        href={p.domain}
                        target="_blank"
                        rel="noreferrer"
                        className="group inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
                      >
                        {p.name}
                        <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                      </a>
                    ) : (
                      <span className="text-sm text-white/50">{p.name}</span>
                    )}
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className="font-mono-spec mt-7 text-[10px] tracking-[0.3em] text-white/30 uppercase">
              {t("contactPage.mapRemote", "Da remoto")}
            </p>
          )}
        </aside>
      </div>

      {/* The same list under the map: on a phone it beats aiming at a dot, and
          for anyone reading with a keyboard it is the section's index. */}
      <ul className="mt-6 flex flex-wrap gap-2">
        {plate.pins.map((p) => (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => setPicked((prev) => ({ ...prev, [plate.key]: p.id }))}
              className={cn(
                "font-mono-spec rounded-full border px-3 py-1.5 text-[10px] tracking-[0.2em] uppercase transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white/60",
                p.id === selected.id
                  ? "border-white/40 text-white"
                  : "border-white/10 text-white/40 hover:border-white/25 hover:text-white/75",
              )}
            >
              {p.city}
              {p.work.length > 0 && (
                <span className="ml-2 text-white/25 tabular-nums">{p.work.length}</span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
