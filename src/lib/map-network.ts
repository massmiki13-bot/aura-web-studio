import { allProjects } from "@/components/aura/projects-data";

/**
 * Where the work is, and where it reaches.
 *
 * Three plates, zooming out: the valley, the country, the world.
 *
 * Two different claims, kept apart on purpose. The Alto Adige and Italy plates
 * are a record: every pin is a town a live site in the catalogue was actually
 * built for, and the count under it is that catalogue counted, not a number
 * typed in. The world plate is a statement of reach — the studio works
 * remotely and says so on this page already — and is labelled as such rather
 * than dressed up as offices it does not have.
 *
 * The five Alto Adige towns only appear on the first plate. Bolzano, Merano,
 * Lana, Andriano and Val di Non sit inside sixty pixels of each other once the
 * whole country is in frame; zoomed out, the region is one dot.
 *
 * Project ids are checked against the catalogue at module load. A city whose
 * project has been renamed or removed fails the build instead of silently
 * showing "0 progetti".
 */

export type Pin = {
  id: string;
  city: string;
  /** Province or region code, shown next to the name. */
  area: string;
  lat: number;
  lon: number;
  /** The base. Drawn differently and every arc starts here. */
  hq?: boolean;
  /** Catalogue ids of the work delivered here. */
  work: string[];
};

const SOUTH_TYROL: Pin[] = [
  {
    id: "bolzano",
    city: "Bolzano",
    area: "BZ",
    lat: 46.4983,
    lon: 11.3548,
    hq: true,
    work: [
      "piccola-italia",
      "osteria-da-marco",
      "la-cave",
      "enoteca-da-aldo",
      "kernerhof",
      "poke-city",
      "s-nails",
      "studio-legale-conte",
    ],
  },
  {
    id: "merano",
    city: "Merano",
    area: "BZ",
    lat: 46.6713,
    lon: 11.1593,
    work: ["central-merano", "lala-hair", "sahal-barber"],
  },
  {
    id: "laives",
    city: "Laives",
    area: "BZ",
    lat: 46.4269,
    lon: 11.3376,
    work: ["autoservice-foppa"],
  },
  {
    id: "lana",
    city: "Lana",
    area: "BZ",
    lat: 46.6157,
    lon: 11.1444,
    work: ["schlosshof-resort"],
  },
  {
    id: "andriano",
    city: "Andriano",
    area: "BZ",
    lat: 46.5217,
    lon: 11.2314,
    work: ["manna-italia"],
  },
  {
    id: "val-di-non",
    city: "Val di Non",
    area: "TN",
    lat: 46.3547,
    lon: 11.0561,
    work: ["hotel-rosa"],
  },
];

/**
 * The country plate.
 *
 * Bolzano stands for the whole of Alto Adige here — see the note at the top —
 * and carries the region's work with it, so nothing delivered disappears
 * between the first plate and the second.
 */
const ITALY: Pin[] = [
  {
    id: "bolzano",
    city: "Bolzano",
    area: "BZ",
    lat: 46.4983,
    lon: 11.3548,
    hq: true,
    work: SOUTH_TYROL.flatMap((p) => p.work),
  },
  {
    id: "milano",
    city: "Milano",
    area: "MI",
    lat: 45.4642,
    lon: 9.19,
    work: ["lorenza-lombardi"],
  },
  {
    id: "cremona",
    city: "Cremona",
    area: "CR",
    lat: 45.1333,
    lon: 10.0227,
    work: ["rdd-servizi"],
  },
  {
    id: "montepulciano",
    city: "Montepulciano",
    area: "SI",
    lat: 43.0989,
    lon: 11.7806,
    work: ["la-vineria"],
  },
];

/**
 * The world plate.
 *
 * Reach, not addresses — the same set the page has always shown, paired with
 * the h24-remote line above it. Pola is the exception and is marked as such:
 * there is a real barber shop there with a real site in the catalogue.
 */
const WORLD: Pin[] = [
  { id: "bolzano-w", city: "Bolzano", area: "IT", lat: 46.4983, lon: 11.3548, hq: true, work: [] },
  { id: "pola", city: "Pola", area: "HR", lat: 44.8666, lon: 13.8496, work: ["chicpokystyle"] },
  { id: "new-york", city: "New York", area: "US", lat: 40.7128, lon: -74.006, work: [] },
  { id: "los-angeles", city: "Los Angeles", area: "US", lat: 34.0522, lon: -118.2437, work: [] },
  { id: "buenos-aires", city: "Buenos Aires", area: "AR", lat: -34.6037, lon: -58.3816, work: [] },
  { id: "pechino", city: "Pechino", area: "CN", lat: 39.9042, lon: 116.4074, work: [] },
  { id: "tokyo", city: "Tokyo", area: "JP", lat: 35.6762, lon: 139.6503, work: [] },
  { id: "johannesburg", city: "Johannesburg", area: "ZA", lat: -26.2041, lon: 28.0473, work: [] },
  { id: "sydney", city: "Sydney", area: "AU", lat: -33.8688, lon: 151.2093, work: [] },
];

/** Every id on the map has to name a project that exists. */
for (const pin of [...SOUTH_TYROL, ...ITALY, ...WORLD]) {
  for (const id of pin.work) {
    if (!allProjects.some((p) => p.id === id)) {
      throw new Error(`map-network: "${pin.city}" references unknown project "${id}"`);
    }
  }
}

export const southTyrolPins = SOUTH_TYROL;
export const italyPins = ITALY;
export const worldPins = WORLD;

/** Projects delivered in a town, in catalogue order. */
export function workAt(pin: Pin) {
  return pin.work
    .map((id) => allProjects.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));
}

/** Every project the Italian plates account for. */
export const italyWorkCount = ITALY.reduce((n, p) => n + p.work.length, 0);
