/* ------------------------------------------------------------------------ *
 * The world map
 *
 * Not an image: real coastlines, from Natural Earth's 1:110m admin-0 set
 * (public domain), reduced to a few hundred points per country. The result is
 * a file of SVG paths that weighs a few dozen kilobytes and stays sharp at any
 * scale — and, unlike a PNG, lets individual countries light up.
 *
 * Same three steps as the Italy plate this is the companion to:
 *   1. Mercator (lon/lat → x/y), clipped well short of the poles, because the
 *      projection sends them to infinity and Antarctica would otherwise be the
 *      largest thing on the map by a wide margin;
 *   2. Douglas-Peucker simplification, to drop the points that don't change
 *      the drawing at the size it is actually looked at;
 *   3. islands under a minimum area are discarded — at 1200px wide, most of
 *      the Pacific is a scatter of half-pixels.
 *
 * Usage: node scripts/build-world-map.mjs [source.geojson]
 * With no argument it fetches Natural Earth directly.
 * ------------------------------------------------------------------------ */

import fs from "node:fs";
import path from "node:path";

const SRC = process.argv[2];
const OUT = path.resolve("src/data/world.ts");
const NE_URL =
  "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_110m_admin_0_countries.geojson";

/** Table width; everything else follows from it. */
const W = 1400;
/** Simplification tolerance, in table units. */
const TOL = 1.1;
/** Smallest island kept, in table units². */
const MIN_AREA = 6;
/** Latitude the projection is cut at, north and south. */
const LAT_CLIP = 78;

const merc = ([lon, lat]) => {
  const clamped = Math.max(-LAT_CLIP, Math.min(LAT_CLIP, lat));
  return [(lon * Math.PI) / 180, Math.log(Math.tan(Math.PI / 4 + (clamped * Math.PI) / 360))];
};

/** Keeps the points that stray from the chord by more than the tolerance. */
function simplify(pts, tol) {
  if (pts.length < 3) return pts;
  const sq = tol * tol;
  const keep = new Uint8Array(pts.length);
  keep[0] = keep[pts.length - 1] = 1;
  const stack = [[0, pts.length - 1]];

  while (stack.length) {
    const [a, b] = stack.pop();
    let far = -1;
    let best = 0;
    const [ax, ay] = pts[a];
    const [bx, by] = pts[b];
    const dx = bx - ax;
    const dy = by - ay;
    const len = dx * dx + dy * dy;

    for (let i = a + 1; i < b; i++) {
      const [px, py] = pts[i];
      let t = len ? ((px - ax) * dx + (py - ay) * dy) / len : 0;
      t = t < 0 ? 0 : t > 1 ? 1 : t;
      const qx = ax + t * dx;
      const qy = ay + t * dy;
      const d = (px - qx) ** 2 + (py - qy) ** 2;
      if (d > best) {
        best = d;
        far = i;
      }
    }

    if (best > sq && far > 0) {
      keep[far] = 1;
      stack.push([a, far], [far, b]);
    }
  }
  return pts.filter((_, i) => keep[i]);
}

const area = (ring) => {
  let a = 0;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    a += ring[j][0] * ring[i][1] - ring[i][0] * ring[j][1];
  }
  return Math.abs(a / 2);
};

const round = (n) => Math.round(n * 10) / 10;
const toPath = (ring) => `M${ring.map(([x, y]) => `${round(x)} ${round(y)}`).join("L")}Z`;

/* ------------------------------------------------------------------------ */

let geo;
if (SRC) {
  geo = JSON.parse(fs.readFileSync(SRC, "utf8"));
} else {
  process.stdout.write("fetching Natural Earth 1:110m…\n");
  const res = await fetch(NE_URL);
  if (!res.ok) throw new Error(`Natural Earth fetch failed: ${res.status}`);
  geo = await res.json();
}

const countries = geo.features
  .map((f) => {
    const polys = f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
    const p = f.properties;
    return {
      // Natural Earth's casing varies between releases.
      name: p.NAME || p.name || p.ADMIN || p.admin || "",
      iso: p.ISO_A2 || p.iso_a2 || "",
      // Outer ring only: holes are lakes, and a lake at this scale is noise.
      rings: polys.map((poly) => poly[0].map(merc)),
    };
  })
  // Antarctica survives the latitude clip as a band across the bottom of the
  // frame, which is worse than not drawing it.
  .filter((c) => c.name && c.name !== "Antarctica");

let minX = Infinity;
let minY = Infinity;
let maxX = -Infinity;
let maxY = -Infinity;
for (const c of countries) {
  for (const ring of c.rings) {
    for (const [x, y] of ring) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}

const k = W / (maxX - minX);
const H = Math.round((maxY - minY) * k);
/** y flips: Mercator grows north, SVG grows down. */
const place = ([x, y]) => [(x - minX) * k, (maxY - y) * k];

const out = countries
  .map((c) => {
    const rings = c.rings
      .map((ring) => simplify(ring.map(place), TOL))
      .filter((ring) => ring.length > 3 && area(ring) > MIN_AREA)
      .sort((a, b) => area(b) - area(a));
    return { name: c.name, iso: c.iso, d: rings.map(toPath).join("") };
  })
  .filter((c) => c.d)
  .sort((a, b) => a.name.localeCompare(b.name));

const points = out.reduce((n, c) => n + (c.d.match(/L/g) || []).length, 0);

const body = `/* GENERATED BY scripts/build-world-map.mjs — do not edit by hand.
   Coastlines from Natural Earth 1:110m admin-0 (public domain).
   ${out.length} countries, ${points} points, Mercator clipped at ${LAT_CLIP}°. */

export const viewBox = "0 0 ${W} ${H}";
export const mapW = ${W};
export const mapH = ${H};

/** The script's own projection, so runtime pins land where the drawing does. */
export function project(lon: number, lat: number): [number, number] {
  const clamped = Math.max(-${LAT_CLIP}, Math.min(${LAT_CLIP}, lat));
  const x = (lon * Math.PI) / 180;
  const y = Math.log(Math.tan(Math.PI / 4 + (clamped * Math.PI) / 360));
  return [(x - ${minX}) * ${k}, (${maxY} - y) * ${k}];
}

export type Country = { name: string; iso: string; d: string };

export const countries: Country[] = ${JSON.stringify(out, null, 0)
  .replace(/\},\{/g, "},\n  {")
  .replace(/^\[/, "[\n  ")
  .replace(/\]$/, ",\n]")};
`;

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, body, "utf8");
console.log(
  `world.ts — ${out.length} countries, ${points} points, ${(body.length / 1024).toFixed(1)} kB, viewBox 0 0 ${W} ${H}`,
);
