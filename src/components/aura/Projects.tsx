"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";

export type ProjectCategory = "hospitality" | "beauty" | "automotive" | "other";

type Project = {
  id: string;
  name: string;
  category: ProjectCategory;
  descKey: string;
  desc: string;
  domain: string | null;
  image: string | null;
  alt: string;
  bg: string;
};

const projects: Project[] = [
  {
    id: "la-cave",
    name: "La Cave Shisha Lounge",
    category: "hospitality",
    descKey: "01",
    desc: "Esperienza dark mode per uno shisha bar di lusso, con accenti dorati luminosi e overlay glassmorphici.",
    domain: "https://la-cave-eosin.vercel.app",
    image: "/projects/la_cave.jpg",
    alt: "Sito web per shisha bar di lusso La Cave, dark mode con dettagli dorati — progetto Aura Web Studio",
    bg: "radial-gradient(ellipse at 30% 30%, oklch(0.22 0.02 305) 0%, #050108 60%)",
  },
  {
    id: "triclinium",
    name: "Triclinium Cotoletteria",
    category: "hospitality",
    descKey: "02",
    desc: "Estetica street-pop vibrante guidata da effetti di scroll dinamici e particelle interattive.",
    domain: "https://triclinium-cotoletteria.vercel.app",
    image: "/projects/triclinium.png",
    alt: "Sito web ristorante Triclinium Cotoletteria con animazioni scroll dinamiche — progetto Aura Web Studio",
    bg: "radial-gradient(ellipse at 70% 40%, oklch(0.25 0.03 95) 0%, #0a0700 70%)",
  },
  {
    id: "enoteca-aldo",
    name: "Enoteca da Aldo",
    category: "hospitality",
    descKey: "03",
    desc: "Layout di lusso dark-slate impreziosito da fluide piastrelle in parallax.",
    domain: "https://enotecadaaldo.vercel.app",
    image: "/projects/enoteca_da_aldo.jpg",
    alt: "Sito web enoteca di lusso Enoteca da Aldo con effetto parallax — progetto Aura Web Studio",
    bg: "radial-gradient(ellipse at 50% 60%, oklch(0.2 0.01 250) 0%, #02040a 70%)",
  },
  {
    id: "piccola-italia",
    name: "Piccola Italia",
    category: "hospitality",
    descKey: "04",
    desc: "Ristorante fusion italo-indiano su un dark mode editoriale con accenti premium.",
    domain: "https://namastepiccolaitalia.it",
    image: "/projects/piccola_italia.jpg",
    alt: "Sito web ristorante fusion italo-indiano Piccola Italia — progetto Aura Web Studio",
    bg: "radial-gradient(ellipse at 20% 70%, oklch(0.25 0.03 25) 0%, #080203 70%)",
  },
  {
    id: "osteria-da-marco",
    name: "Osteria da Marco",
    category: "hospitality",
    descKey: "08",
    desc: "Osteria storica a Bolzano: cucina italiana autentica, prenotazione tavolo e menu digitale.",
    domain: "https://osteria-da-marco.vercel.app",
    image: "/projects/osteria_da_marco.jpg",
    alt: "Sito web osteria storica a Bolzano, Osteria da Marco, con prenotazione tavolo online — progetto Aura Web Studio",
    bg: "radial-gradient(ellipse at 40% 40%, oklch(0.22 0.03 60) 0%, #0a0602 70%)",
  },
  {
    id: "central-merano",
    name: "Central — Food & Beverage",
    category: "hospitality",
    descKey: "09",
    desc: "Bar & restaurant nel cuore di Merano: colazione, business lunch e cocktail d'autore.",
    domain: "https://central-merano.vercel.app",
    image: "/projects/central_merano.jpg",
    alt: "Sito web bar e ristorante Central nel centro di Merano — progetto Aura Web Studio",
    bg: "radial-gradient(ellipse at 60% 50%, oklch(0.2 0.02 40) 0%, #060402 70%)",
  },
  {
    id: "snail-saloon",
    name: "S.nail & Saloon",
    category: "beauty",
    descKey: "05",
    desc: "Vetrina per beauty studio in light mode elegante con branding cosmetico custom.",
    domain: "https://s-nail-beauty-studio.vercel.app",
    image: "/projects/snail_saloon.jpg",
    alt: "Sito web beauty studio S.nail & Saloon in light mode elegante — progetto Aura Web Studio",
    bg: "radial-gradient(ellipse at 60% 30%, oklch(0.2 0.02 340) 0%, #060106 65%)",
  },
  {
    id: "be-beauty",
    name: "Be Beauty",
    category: "beauty",
    descKey: "06",
    desc: "Interfaccia wellness raffinata con flusso di prenotazione intuitivo.",
    domain: "https://be-beauty-wellness.vercel.app",
    image: "/projects/bebeauty_saloon.jpg",
    alt: "Sito web centro wellness Be Beauty con flusso di prenotazione online — progetto Aura Web Studio",
    bg: "radial-gradient(ellipse at 40% 50%, oklch(0.2 0.02 180) 0%, #00060a 70%)",
  },
  {
    id: "sahal-barber",
    name: "Sahal Barber Studio",
    category: "beauty",
    descKey: "10",
    desc: "Barbershop moderno con prenotazione online e galleria tagli.",
    domain: "https://sahal-barber-next.vercel.app",
    image: "/projects/sahal_barber.jpg",
    alt: "Sito web barbershop moderno Sahal Barber Studio con prenotazione online e galleria tagli — progetto Aura Web Studio",
    bg: "radial-gradient(ellipse at 50% 40%, oklch(0.2 0.02 210) 0%, #04060a 70%)",
  },
  {
    id: "lala-hair",
    name: "Lala Hair Studio",
    category: "beauty",
    descKey: "11",
    desc: "Salone di parrucchieri con presentazione servizi e team.",
    domain: "https://lala-hair-next.vercel.app",
    image: "/projects/lala_hair.jpg",
    alt: "Sito web salone di parrucchieri Lala Hair Studio con presentazione servizi e team — progetto Aura Web Studio",
    bg: "radial-gradient(ellipse at 55% 45%, oklch(0.2 0.02 320) 0%, #0a0208 70%)",
  },
  {
    id: "nils-automotive",
    name: "Nils Automotive",
    category: "automotive",
    descKey: "12",
    desc: "Concessionaria auto in stile Ferrari con configuratore 3D a hotspot.",
    domain: "https://nils-automotive.vercel.app",
    image: "/projects/nils_automotive.jpg",
    alt: "Sito web concessionaria auto Nils Automotive in stile Ferrari con configuratore 3D — progetto Aura Web Studio",
    bg: "radial-gradient(ellipse at 45% 35%, oklch(0.2 0.03 25) 0%, #0a0100 70%)",
  },
  {
    id: "autoservice-foppa",
    name: "Autoservice Foppa",
    category: "automotive",
    descKey: "13",
    desc: "Officina meccanica dal 1947: prenotazione tagliandi e servizi.",
    domain: "https://foppa-next.vercel.app",
    image: "/projects/autoservice_foppa.jpg",
    alt: "Sito web officina meccanica Autoservice Foppa dal 1947 con prenotazione tagliandi — progetto Aura Web Studio",
    bg: "radial-gradient(ellipse at 35% 55%, oklch(0.2 0.02 230) 0%, #02040a 70%)",
  },
  {
    id: "markz3d",
    name: "Markz3D",
    category: "other",
    descKey: "07",
    desc: "Shop online e portfolio per modding FiveM con griglie prodotto interattive.",
    domain: "https://www.markz3d.com",
    image: "/projects/markz3d.jpg",
    alt: "Sito web e shop online Markz3D per modding FiveM con griglie prodotto interattive — progetto Aura Web Studio",
    bg: "radial-gradient(ellipse at 30% 60%, oklch(0.2 0.02 150) 0%, #02070a 70%)",
  },
  {
    id: "manna-italia",
    name: "Manna Italia",
    category: "other",
    descKey: "14",
    desc: "Florovivaismo professionale dal 1979: catalogo prodotti, percorsi hobbisti/professionisti e richiesta preventivo.",
    domain: "https://manna-italia.vercel.app",
    image: "/projects/manna_italia.jpg",
    alt: "Sito web florovivaismo professionale Manna Italia dal 1979 con catalogo prodotti — progetto Aura Web Studio",
    bg: "radial-gradient(ellipse at 35% 40%, oklch(0.24 0.04 145) 0%, #010a04 70%)",
  },
  {
    id: "hotel-rosa",
    name: "Hotel Rosa Resort",
    category: "hospitality",
    descKey: "15",
    desc: "Resort 3 stelle in Val di Non: centro wellness, offerte stagionali e vista sulle Dolomiti di Brenta.",
    domain: "https://hotel-rosa.vercel.app/it",
    image: "/projects/hotel_rosa.jpg",
    alt: "Sito web resort Hotel Rosa in Val di Non con centro wellness e vista sulle Dolomiti di Brenta — progetto Aura Web Studio",
    bg: "radial-gradient(ellipse at 55% 35%, oklch(0.25 0.03 350) 0%, #0a0206 70%)",
  },
  {
    id: "schlosshof-resort",
    name: "Schlosshof Resort",
    category: "hospitality",
    descKey: "16",
    desc: "Camping 5 stelle & Charme Hotel a Lana: piscine, SPA e cucina italiana in un'esperienza editoriale.",
    domain: "https://schlosshof-resort.vercel.app/it",
    image: "/projects/schlosshof_resort.jpg",
    alt: "Sito web camping 5 stelle e charme hotel Schlosshof Resort a Lana con piscine e SPA — progetto Aura Web Studio",
    bg: "radial-gradient(ellipse at 45% 45%, oklch(0.22 0.03 230) 0%, #020508 70%)",
  },
  {
    id: "dauda-ai",
    name: "Dauda AI",
    category: "other",
    descKey: "17",
    desc: "Landing page dark mode ad alta conversione per un percorso di trading e mentorship, con accenti dorati e CTA marcate.",
    domain: "https://dauda-ai.vercel.app",
    image: "/projects/dauda_ai.jpg",
    alt: "Landing page dark mode ad alta conversione Dauda AI per trading e mentorship — progetto Aura Web Studio",
    bg: "radial-gradient(ellipse at 65% 30%, oklch(0.22 0.04 85) 0%, #0a0700 70%)",
  },
  {
    id: "pernthaler",
    name: "Pernthaler",
    category: "other",
    descKey: "18",
    desc: "Impiantistica elettrica e fotovoltaico in Alto Adige: hero fotovoltaico d'impatto e presentazione servizi aziendali.",
    domain: "https://pernthaler.vercel.app",
    image: "/projects/pernthaler.jpg",
    alt: "Sito web impiantistica elettrica e fotovoltaico Pernthaler in Alto Adige — progetto Aura Web Studio",
    bg: "radial-gradient(ellipse at 40% 50%, oklch(0.22 0.03 240) 0%, #020409 70%)",
  },
];

const categories: { key: "all" | ProjectCategory; label: string }[] = [
  { key: "all", label: "Tutti" },
  { key: "hospitality", label: "Ristorazione & Hospitality" },
  { key: "beauty", label: "Beauty & Wellness" },
  { key: "automotive", label: "Automotive" },
  { key: "other", label: "Altro" },
];

/**
 * How many projects the index shows.
 *
 * The layout is designed for eight: eight rows at this type size is very close
 * to one full screen on a laptop, which is the whole point — the section reads
 * as a single held composition rather than something you scroll through. Past
 * about ten it stops being an index and becomes a list, and the impact goes
 * with it.
 *
 * The full array above is left intact so nothing is lost; trim or reorder it
 * and this constant is the only other thing to touch.
 */
const FEATURED_LIMIT = 8;

/** Preview travel, in the same damped idiom as the custom cursor. */
const FOLLOW_DAMPING = 12;
const TILT_DAMPING = 9;
const TILT_PER_PX = 0.5;
const TILT_MAX = 14;

function categoryLabel(category: ProjectCategory) {
  return categories.find((c) => c.key === category)?.label ?? "";
}

/**
 * Selected work, as an index rather than a display case.
 *
 * What was here before was a spotlit "studio": one 280px card at a time,
 * centred in a 680px-tall box, advanced by drag or wheel. It spent an enormous
 * amount of screen on furniture — three modelled spotlights, a room, a floor —
 * and showed the actual work at roughly a twelfth of the area. With eighteen
 * projects behind a one-at-a-time carousel, most of them were never seen.
 *
 * This inverts that. The work is a typographic index: eight rows of display
 * type at the scale the masthead uses, which is the site's own voice, and the
 * imagery arrives only where the visitor is looking — a preview that tracks
 * the cursor, damped, tilting into its own direction of travel the way the
 * hero's chrome form and the site cursor both do. Nothing is decoration that
 * isn't also information: the row you are on is the one that lights up, and
 * the rest recede.
 *
 * It is also far cheaper. The studio was a full canvas with modelled geometry;
 * this is DOM text, one rAF loop that idles, and a single ~320px preview image
 * on screen at a time.
 *
 * The rows are plain anchors with real text, server-rendered — every project
 * name, category and destination is in the HTML whether or not the pointer
 * work ever runs.
 */
function ProjectsIndex({ items }: { items: Project[] }) {
  const { t } = useTranslation();
  const [active, setActive] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  // Written on every mousemove over the list, read by the frame loop — a ref
  // so pointer motion never causes a React render.
  const pointer = useRef({ x: 0, y: 0 });

  // The preview's travel. Position and tilt are written straight to the
  // element; only `active` (which row) goes through React, and that changes
  // once row crossed rather than once per frame.
  useEffect(() => {
    const el = previewRef.current;
    if (!el || active === null) return;

    /**
     * Where the preview wants to be.
     *
     * Y tracks the pointer, which is what ties it to the row you are on. X is
     * held in the empty channel between where the names stop and where the
     * category column starts, drifting with the cursor inside it.
     *
     * Two other placements were tried and are worth not repeating. Centring it
     * on the cursor put it straight over the name of the row being read, and
     * capping the names to make room truncated them at rest ("La Cave Shisha
     * Lo…") — the names are the section, so nothing may shrink them. Offsetting
     * it vertically instead cleared the active row but, at 900px of viewport,
     * had nowhere to go and flipped up over the section heading.
     *
     * So the preview is sized to the gap rather than the gap to the preview:
     * narrow enough (max 240px) to sit between a full-length name and the
     * category label at every desktop width.
     */
    const desired = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const { width, height } = el.getBoundingClientRect();
      const halfH = (height || 300) / 2;
      return {
        x: Math.min(Math.max(pointer.current.x + 200, vw * 0.64), vw * 0.72),
        y: Math.min(Math.max(pointer.current.y, halfH + 16), vh - halfH - 16),
      };
    };

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // No follow: place it once, clear of the row that was entered, and
      // leave it there.
      const at = desired();
      el.style.transform = `translate3d(${at.x}px, ${at.y}px, 0)`;
      return;
    }

    let { x, y } = desired();
    let tilt = 0;
    let last = 0;
    let raf = 0;

    const tick = (now: number) => {
      const d = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
      last = now;

      const prevX = x;
      const at = desired();
      // exp() damping, frame-rate independent — identical feel at 30 or 144Hz.
      const k = 1 - Math.exp(-FOLLOW_DAMPING * d);
      x += (at.x - x) * k;
      y += (at.y - y) * k;

      // Lean into the direction of travel, derived from the *damped* position
      // rather than the raw pointer so it inherits the smoothing instead of
      // twitching on every mouse sample.
      const target = Math.max(-TILT_MAX, Math.min(TILT_MAX, (x - prevX) * TILT_PER_PX));
      tilt += (target - tilt) * (1 - Math.exp(-TILT_DAMPING * d));

      el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${tilt}deg)`;
      raf = requestAnimationFrame(tick);
    };

    // Snap into the band on the first frame rather than flying in from
    // wherever the last hover ended.
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  const featured = items.slice(0, FEATURED_LIMIT);

  return (
    <div
      className="relative"
      onMouseMove={(e) => {
        pointer.current.x = e.clientX;
        pointer.current.y = e.clientY;
      }}
      onMouseLeave={() => setActive(null)}
    >
      {/* The rows. A hairline above each one and below the last gives the
          index its ruled-table feel without a border on every side. */}
      <ul className="border-t border-white/10">
        {featured.map((project, i) => {
          const dimmed = active !== null && active !== i;
          const lit = active === i;
          return (
            <li key={project.id} className="border-b border-white/10">
              <a
                href={project.domain ?? undefined}
                target={project.domain ? "_blank" : undefined}
                rel={project.domain ? "noreferrer" : undefined}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                aria-label={`${project.name} — ${categoryLabel(project.category)}`}
                className={`group relative block py-7 outline-none transition-opacity duration-500 md:grid md:grid-cols-[2.75rem_minmax(0,1fr)_auto_auto] md:items-center md:gap-8 md:py-8 ${
                  project.domain ? "cursor-pointer" : "cursor-default"
                } ${dimmed ? "opacity-30" : "opacity-100"}`}
              >
                {/* Mobile meta line. The name needs the full width to itself
                    below (it was being truncated to "La Cave…", which tells a
                    visitor nothing), so the number, category and arrow are
                    lifted into their own line above it. */}
                <div className="mb-3 flex items-center justify-between gap-4 md:hidden">
                  <span className="font-mono-spec text-[10px] tracking-[0.25em] text-white/40 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="font-mono-spec flex items-center gap-3 text-[10px] tracking-[0.2em] text-white/40 uppercase">
                    {categoryLabel(project.category)}
                    {project.domain && <ArrowUpRight className="h-4 w-4" />}
                  </span>
                </div>

                {/* Desktop index number. Its own grid column, so every name
                    starts on the same axis regardless of digit shapes. */}
                <span className="font-mono-spec hidden text-[11px] tracking-[0.25em] text-white/40 tabular-nums md:block">
                  {String(i + 1).padStart(2, "0")}
                </span>

                {/* Name. The whole reason this section reads at a glance: the
                    same display face and tracking as the masthead, at a size
                    that makes eight rows fill a screen. Truncated only from md
                    up, where there is a single row to stay on; below that it
                    wraps and is allowed the space to do it. */}
                <h3
                  className={`font-display text-[8vw] leading-[1.03] font-semibold tracking-tighter transition-[transform,color] duration-500 ease-out sm:text-[6vw] md:truncate md:text-[3.4vw] ${
                    lit ? "text-white md:translate-x-3" : "text-white/70"
                  }`}
                >
                  {project.name}
                </h3>

                {/* Mobile imagery, since there is no pointer to reveal it with.
                    display:none from md up, which also keeps these off the
                    network there — a lazy image with no layout box is never
                    fetched. */}
                {project.image && (
                  <div className="relative mt-4 aspect-[16/10] w-full overflow-hidden rounded-xl border border-white/10 md:hidden">
                    <Image
                      src={project.image}
                      alt={project.alt}
                      fill
                      sizes="(max-width: 767px) 100vw, 1px"
                      className="object-cover opacity-90"
                    />
                  </div>
                )}

                <span className="font-mono-spec hidden text-[10px] tracking-[0.2em] text-white/40 uppercase lg:block">
                  {categoryLabel(project.category)}
                </span>

                <span className="hidden md:block">
                  {project.domain ? (
                    <ArrowUpRight
                      className={`h-6 w-6 transition-all duration-500 ease-out ${
                        lit ? "translate-x-0.5 -translate-y-0.5 text-white" : "text-white/30"
                      }`}
                    />
                  ) : (
                    <span className="font-mono-spec text-[10px] tracking-[0.2em] text-white/25 uppercase">
                      {t("projects.comingSoon", "Presto online")}
                    </span>
                  )}
                </span>
              </a>
            </li>
          );
        })}
      </ul>

      {/*
        The preview.

        Fixed, not absolute: the pointer is in viewport coordinates and so is
        this, so the two stay locked together no matter what Lenis is doing to
        the page underneath. Positioned by transform only, on its own layer.

        Every featured image is mounted at once and cross-faded by opacity
        rather than swapped on hover — at 320px these are ~15 kB apiece, and
        mounting on demand would mean the first hover of each row waits on a
        network round trip, which is exactly the moment that has to feel
        instant. Hidden below md, where there is no pointer to follow and the
        rows carry their own thumbnails instead.
      */}
      <div
        aria-hidden
        ref={previewRef}
        className="pointer-events-none fixed top-0 left-0 z-40 hidden will-change-transform md:block"
      >
        <div
          className={`relative -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-xl border border-white/15 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.9)] transition-[opacity,scale] duration-500 ease-out ${
            active === null ? "scale-90 opacity-0" : "scale-100 opacity-100"
          }`}
          // Sized to the channel between the names and the category column,
          // not to what looks good in isolation — see `desired()` above.
          style={{ width: "clamp(170px, 16vw, 240px)", aspectRatio: "4 / 5" }}
        >
          {featured.map((project, i) =>
            project.image ? (
              <Image
                key={project.id}
                src={project.image}
                alt=""
                fill
                sizes="300px"
                className={`object-cover transition-opacity duration-300 ${
                  active === i ? "opacity-100" : "opacity-0"
                }`}
              />
            ) : null,
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        </div>
      </div>

      <p className="font-mono-spec mt-8 text-[10px] tracking-[0.3em] text-white/25 uppercase">
        {featured.length} {t("projects.caseStudies", "Aura — Case Studies")}
      </p>
    </div>
  );
}

export function Projects() {
  const { t } = useTranslation();

  return (
    <section id="projects" className="relative bg-black py-32 md:py-48">
      <div className="mx-auto max-w-[1600px] px-6 md:px-16">
        <div className="mb-16 max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-mono-spec text-muted-foreground mb-6 text-[11px] tracking-[0.35em] uppercase"
          >
            {t("projects.selectedWork", "Lavori selezionati")}
          </motion.p>
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

        <ProjectsIndex items={projects} />
      </div>
    </section>
  );
}
