import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { VolumetricStudio } from "@/components/ui/volumetric-studio";

export type ProjectCategory = "hospitality" | "beauty" | "automotive" | "other";

type Project = {
  id: string;
  name: string;
  category: ProjectCategory;
  descKey: string;
  desc: string;
  domain: string | null;
  image: string | null;
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
    image: "/projects/la_cave.png",
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
    bg: "radial-gradient(ellipse at 70% 40%, oklch(0.25 0.03 95) 0%, #0a0700 70%)",
  },
  {
    id: "enoteca-aldo",
    name: "Enoteca da Aldo",
    category: "hospitality",
    descKey: "03",
    desc: "Layout di lusso dark-slate impreziosito da fluide piastrelle in parallax.",
    domain: "https://aldo-s-glass-wine-bar.vercel.app",
    image: "/projects/enoteca_da_aldo.png",
    bg: "radial-gradient(ellipse at 50% 60%, oklch(0.2 0.01 250) 0%, #02040a 70%)",
  },
  {
    id: "piccola-italia",
    name: "Piccola Italia",
    category: "hospitality",
    descKey: "04",
    desc: "Ristorante fusion italo-indiano su un dark mode editoriale con accenti premium.",
    domain: "https://namastepiccolaitalia.it",
    image: "/projects/piccola_italia.png",
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
    bg: "radial-gradient(ellipse at 60% 50%, oklch(0.2 0.02 40) 0%, #060402 70%)",
  },
  {
    id: "snail-saloon",
    name: "S.nail & Saloon",
    category: "beauty",
    descKey: "05",
    desc: "Vetrina per beauty studio in light mode elegante con branding cosmetico custom.",
    domain: "https://s-nail-beauty-studio.vercel.app",
    image: "/projects/snail&saloon.png",
    bg: "radial-gradient(ellipse at 60% 30%, oklch(0.2 0.02 340) 0%, #060106 65%)",
  },
  {
    id: "be-beauty",
    name: "Be Beauty",
    category: "beauty",
    descKey: "06",
    desc: "Interfaccia wellness raffinata con flusso di prenotazione intuitivo.",
    domain: "https://be-beauty-wellness.vercel.app",
    image: "/projects/bebeauty_saloon.png",
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
    bg: "radial-gradient(ellipse at 35% 55%, oklch(0.2 0.02 230) 0%, #02040a 70%)",
  },
  {
    id: "markz3d",
    name: "Markz3D",
    category: "other",
    descKey: "07",
    desc: "Shop online e portfolio per modding FiveM con griglie prodotto interattive.",
    domain: "https://www.markz3d.com",
    image: "/projects/markz3d.png",
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

function ProjectCard({ project }: { project: Project }) {
  const { t } = useTranslation();
  const Wrapper = project.domain ? "a" : "div";
  const wrapperProps = project.domain
    ? { href: project.domain, target: "_blank", rel: "noreferrer" }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={`group relative block w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.8)] transition-transform duration-500 hover:-translate-y-1 ${
        project.domain ? "cursor-pointer" : "cursor-default"
      }`}
      style={{ background: project.bg }}
    >
      {project.image && (
        <img
          src={project.image}
          alt={project.name}
          draggable={false}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover opacity-70 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700 ease-out"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

      <div className="absolute top-5 left-5 right-5 flex items-center justify-between font-mono-spec text-[10px] uppercase tracking-widest text-white/50">
        <span>{categories.find((c) => c.key === project.category)?.label}</span>
        {project.domain ? (
          <ArrowUpRight className="h-4 w-4 text-white/40 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
        ) : (
          <span className="text-white/30">{t("projects.comingSoon", "Presto online")}</span>
        )}
      </div>

      <div className="absolute bottom-5 left-5 right-5">
        <h3 className="font-display text-xl md:text-2xl font-semibold tracking-tight text-white mb-1.5">
          {project.name}
        </h3>
        <p className="text-white/50 text-xs md:text-sm font-light leading-relaxed line-clamp-2">
          {t(`projects.items.${project.descKey}`, project.desc)}
        </p>
      </div>
    </Wrapper>
  );
}

const DRAG_THRESHOLD = 48;
const WHEEL_THRESHOLD = 12;
const STEP_COOLDOWN = 550;

/**
 * Editorial line-arrow: a hairline that stretches toward its direction on
 * hover and ends in a small chevron, with a slow idle drift (CSS keyframes,
 * compositor-only) hinting that the deck can be flipped. Deliberately not a
 * boxed/circled arrow button — it should read as part of the studio, not UI
 * chrome.
 */
function CarouselArrow({
  dir,
  label,
  onClick,
}: {
  dir: -1 | 1;
  label: string;
  onClick: () => void;
}) {
  const isNext = dir === 1;
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      // Don't let the press reach the drag surface underneath — a click on
      // the arrow must never double as the start of a card drag.
      onPointerDown={(e) => e.stopPropagation()}
      onPointerUp={(e) => e.stopPropagation()}
      className={`group absolute top-1/2 z-10 -translate-y-1/2 cursor-pointer select-none p-4 outline-none focus-visible:rounded-full focus-visible:outline focus-visible:outline-white/40 ${
        isNext ? "-right-14 sm:-right-20 md:-right-28" : "-left-14 sm:-left-20 md:-left-28"
      }`}
    >
      <span
        className={`block transition-transform duration-300 ease-out ${
          isNext ? "group-active:translate-x-1.5" : "group-active:-translate-x-1.5"
        }`}
      >
        <span
          className={`carousel-arrow-drift flex items-center ${isNext ? "" : "flex-row-reverse"}`}
          style={{ "--drift": isNext ? "6px" : "-6px" } as React.CSSProperties}
        >
          <span className="h-px w-8 bg-white/35 transition-all duration-500 ease-out group-hover:w-14 group-hover:bg-white/90" />
          <span
            className={`h-[7px] w-[7px] rotate-45 transition-colors duration-500 ${
              isNext
                ? "-ml-[7px] border-t border-r border-white/35 group-hover:border-white/90"
                : "-mr-[7px] border-b border-l border-white/35 group-hover:border-white/90"
            }`}
          />
        </span>
      </span>
    </button>
  );
}

/**
 * The projects live inside a single spotlight-lit "studio" (VolumetricStudio):
 * one case study at a time sits front-and-center under the middle beam. A
 * leftward drag/scroll fades + slides the current card out to the left while
 * the next one slides in from the right to take its place — like flipping
 * through slides in the light, never more than one on screen.
 */
function ProjectsCarousel({ projects: items }: { projects: Project[] }) {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const locked = useRef(false);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const didDrag = useRef(false);

  const step = (dir: 1 | -1) => {
    if (locked.current) return;
    locked.current = true;
    setDirection(dir);
    setIndex((i) => (i + dir + items.length) % items.length);
    setTimeout(() => {
      locked.current = false;
    }, STEP_COOLDOWN);
  };

  const onWheel = (e: React.WheelEvent) => {
    // Only a horizontal gesture (trackpad swipe / shift-scroll) advances the
    // carousel — plain vertical scrolling must keep scrolling the page, so a
    // visitor can pass over the section without getting stuck cycling cards.
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < WHEEL_THRESHOLD) return;
    e.preventDefault();
    step(e.deltaX > 0 ? 1 : -1);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    dragStart.current = { x: e.clientX, y: e.clientY };
    didDrag.current = false;
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragStart.current) return;
    if (Math.abs(e.clientX - dragStart.current.x) > 8) didDrag.current = true;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    dragStart.current = null;
    if (Math.abs(dx) > DRAG_THRESHOLD) step(dx < 0 ? 1 : -1);
  };
  const onClickCapture = (e: React.MouseEvent) => {
    if (didDrag.current) {
      e.preventDefault();
      e.stopPropagation();
      didDrag.current = false;
    }
  };

  const active = items[index];

  return (
    <div className="relative select-none">
      <VolumetricStudio className="min-h-0 h-[560px] sm:h-[620px] md:h-[680px] rounded-3xl border border-white/10">
        <div
          onWheel={onWheel}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          onClickCapture={onClickCapture}
          className="pointer-events-auto relative h-full w-full flex items-end justify-center overflow-hidden cursor-grab active:cursor-grabbing touch-pan-y pb-12 sm:pb-16 md:pb-24"
        >
          {/* Sized slot the card animates within — also the anchor for the
              prev/next arrows so they stay centered on the card at every
              breakpoint instead of floating somewhere in the studio. */}
          <div className="relative aspect-[3/4]" style={{ width: "clamp(200px, 22vw, 280px)" }}>
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.div
                key={active.id}
                custom={direction}
                variants={{
                  enter: (dir: number) => ({ x: dir > 0 ? 140 : -140, opacity: 0 }),
                  center: { x: 0, opacity: 1 },
                  exit: (dir: number) => ({ x: dir > 0 ? -140 : 140, opacity: 0 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 260, damping: 30 },
                  opacity: { duration: 0.45 },
                }}
                className="absolute inset-0"
              >
                <ProjectCard project={active} />
              </motion.div>
            </AnimatePresence>
            <CarouselArrow
              dir={-1}
              label={t("projects.prevProject", "Progetto precedente")}
              onClick={() => step(-1)}
            />
            <CarouselArrow
              dir={1}
              label={t("projects.nextProject", "Progetto successivo")}
              onClick={() => step(1)}
            />
          </div>
        </div>
      </VolumetricStudio>

      <div className="mt-6 flex items-center justify-between">
        <p className="font-mono-spec text-[10px] uppercase tracking-[0.3em] text-white/30">
          {"// Trascina o scorri per esplorare"}
        </p>
        <p className="font-mono-spec text-[10px] uppercase tracking-[0.3em] text-white/30">
          {String(index + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
        </p>
      </div>
    </div>
  );
}

export function Projects() {
  const { t } = useTranslation();

  return (
    <section id="projects" className="relative bg-black py-32 md:py-48">
      <div className="max-w-[1600px] mx-auto px-6 md:px-16">
        <div className="mb-16 max-w-2xl">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="font-mono-spec text-[11px] uppercase tracking-[0.35em] text-muted-foreground mb-6"
          >
            {t("projects.selectedWork", "// Lavori selezionati")}
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tighter leading-[1.02]"
          >
            {t("projects.mobileTitle", "Progetti reali, per settori reali.")}
          </motion.h2>
        </div>

        <ProjectsCarousel projects={projects} />
      </div>
    </section>
  );
}

export function ProjectsMobile() {
  return null;
}
