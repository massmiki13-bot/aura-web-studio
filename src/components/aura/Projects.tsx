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
  domain: string | null;
  image: string | null;
  alt: string;
};

const projects: Project[] = [
  {
    id: "piccola-italia",
    name: "Piccola Italia",
    category: "hospitality",
    domain: "https://namastepiccolaitalia.it",
    image: "/projects/piccola_italia.jpg",
    alt: "Sito web ristorante fusion italo-indiano Piccola Italia — progetto Aura Web Studio",
  },
  {
    id: "osteria-da-marco",
    name: "Osteria da Marco",
    category: "hospitality",
    domain: "https://osteria-da-marco.vercel.app",
    image: "/projects/osteria_da_marco.jpg",
    alt: "Sito web osteria storica a Bolzano, Osteria da Marco, con prenotazione tavolo online — progetto Aura Web Studio",
  },
  {
    id: "central-merano",
    name: "Central — Food & Beverage",
    category: "hospitality",
    domain: "https://central-merano.vercel.app",
    image: "/projects/central_merano.jpg",
    alt: "Sito web bar e ristorante Central nel centro di Merano — progetto Aura Web Studio",
  },
  {
    id: "sahal-barber",
    name: "Sahal Barber Studio",
    category: "beauty",
    domain: "https://sahal-barber-next.vercel.app",
    image: "/projects/sahal_barber.jpg",
    alt: "Sito web barbershop moderno Sahal Barber Studio con prenotazione online e galleria tagli — progetto Aura Web Studio",
  },
  {
    id: "lala-hair",
    name: "Lala Hair Studio",
    category: "beauty",
    domain: "https://lala-hair-next.vercel.app",
    image: "/projects/lala_hair.jpg",
    alt: "Sito web salone di parrucchieri Lala Hair Studio con presentazione servizi e team — progetto Aura Web Studio",
  },
  {
    id: "nils-automotive",
    name: "Nils Automotive",
    category: "automotive",
    domain: "https://nils-automotive.vercel.app",
    image: "/projects/nils_automotive.jpg",
    alt: "Sito web concessionaria auto Nils Automotive in stile Ferrari con configuratore 3D — progetto Aura Web Studio",
  },
  {
    id: "autoservice-foppa",
    name: "Autoservice Foppa",
    category: "automotive",
    domain: "https://foppa-next.vercel.app",
    image: "/projects/autoservice_foppa.jpg",
    alt: "Sito web officina meccanica Autoservice Foppa dal 1947 con prenotazione tagliandi — progetto Aura Web Studio",
  },
  {
    id: "fm-shop",
    name: "FM Shop",
    category: "other",
    domain: "https://www.fm-shop.it",
    image: "/projects/fmshop.png",
    alt: "Shop online FM Shop per asset e mappe FiveM, con catalogo prodotti e abbonamenti — progetto Aura Web Studio",
  },
  {
    id: "markz3d",
    name: "Markz3D",
    category: "other",
    domain: "https://www.markz3d.com",
    image: "/projects/markz3d.jpg",
    alt: "Sito web e shop online Markz3D per modding FiveM con griglie prodotto interattive — progetto Aura Web Studio",
  },
  {
    id: "hotel-rosa",
    name: "Hotel Rosa Resort",
    category: "hospitality",
    domain: "https://hotel-rosa.vercel.app/it",
    image: "/projects/hotel_rosa.jpg",
    alt: "Sito web resort Hotel Rosa in Val di Non con centro wellness e vista sulle Dolomiti di Brenta — progetto Aura Web Studio",
  },
  {
    id: "schlosshof-resort",
    name: "Schlosshof Resort",
    category: "hospitality",
    domain: "https://schlosshof-resort.vercel.app/it",
    image: "/projects/schlosshof_resort.jpg",
    alt: "Sito web camping 5 stelle e charme hotel Schlosshof Resort a Lana con piscine e SPA — progetto Aura Web Studio",
  },
  {
    id: "dauda-ai",
    name: "Dauda AI",
    category: "other",
    domain: "https://dauda-ai.vercel.app",
    image: "/projects/dauda_ai.jpg",
    alt: "Landing page dark mode ad alta conversione Dauda AI per trading e mentorship — progetto Aura Web Studio",
  },
  {
    id: "pernthaler",
    name: "Pernthaler",
    category: "other",
    domain: "https://pernthaler.vercel.app",
    image: "/projects/pernthaler.jpg",
    alt: "Sito web impiantistica elettrica e fotovoltaico Pernthaler in Alto Adige — progetto Aura Web Studio",
  },
];

const categories: { key: "all" | ProjectCategory; label: string }[] = [
  { key: "all", label: "Tutti" },
  { key: "hospitality", label: "Ristorazione & Hospitality" },
  { key: "beauty", label: "Beauty & Wellness" },
  { key: "automotive", label: "Automotive" },
  { key: "other", label: "Altro" },
];

/*
 * The index renders every project in the array above — there is no cap.
 *
 * It is *tuned* for around eight: eight rows at this type size is close to one
 * full screen on a laptop, which is what lets the section read as a single held
 * composition rather than something you scroll through. Past about ten it
 * becomes a list, and some of that impact goes with it. That is a known trade,
 * accepted deliberately — the alternative was a constant silently hiding the
 * tail of the array, which is how the carousel this replaced ended up with
 * eighteen projects almost nobody ever saw.
 *
 * So: the array is the list. Cutting a project means deleting it here, and
 * nothing else needs touching.
 */

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
        {items.map((project, i) => {
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

        Every project image is mounted at once and cross-faded by opacity
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
          {items.map((project, i) =>
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
        {items.length} {t("projects.caseStudies", "Aura — Case Studies")}
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
