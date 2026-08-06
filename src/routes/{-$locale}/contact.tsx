import { Suspense, lazy, useRef } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Users2, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Nav } from "@/components/aura/Nav";
import { Footer } from "@/components/aura/Contact";
import { pageSeo, SITE_CONFIG, localizedPath, type Locale } from "@/lib/seo";
import { SparklesCanvas } from "@/components/ui/sparkles-canvas";
import { members } from "@/lib/team-members";
import { TeamMemberCard } from "@/components/aura/TeamMemberCard";
import { useNearViewport } from "@/hooks/use-near-viewport";
// Code-split, and mounted only once it's actually approaching the viewport.
// WorldMap renders its dot grid with `dotted-map`, which drags in proj4, mgrs
// and wkt-parser — around 700 kB of geo libraries, for a decorative graphic
// well below the fold that a visitor here for the phone number may never
// reach. Statically imported it was the single largest thing on this route.
const WorldMap = lazy(() =>
  import("@/components/ui/world-map").then((m) => ({ default: m.WorldMap })),
);

// Bolzano as the studio's hub, fanning out to a worldwide set of cities —
// a deliberate "reachable anywhere" statement to pair with the h24 remote
// availability messaging above.
const BOLZANO = { lat: 46.4983, lng: 11.3548, label: "Bolzano" };
const studioDots = [
  { start: BOLZANO, end: { lat: 40.7128, lng: -74.006, label: "New York" } },
  { start: BOLZANO, end: { lat: 34.0522, lng: -118.2437, label: "Los Angeles" } },
  { start: BOLZANO, end: { lat: -34.6037, lng: -58.3816, label: "Buenos Aires" } },
  { start: BOLZANO, end: { lat: 39.9042, lng: 116.4074, label: "Pechino" } },
  { start: BOLZANO, end: { lat: 35.6762, lng: 139.6503, label: "Tokyo" } },
  { start: BOLZANO, end: { lat: -26.2041, lng: 28.0473, label: "Johannesburg" } },
  { start: BOLZANO, end: { lat: -33.8688, lng: 151.2093, label: "Sydney" } },
];

const CONTACT_SEO: Record<Locale, { title: string; description: string }> = {
  it: {
    title: "Contatti — Agenzia Web Bolzano",
    description:
      "Contatta l'agenzia web di Bolzano Aura Web Studio: telefono, email e PEC. Disponibili h24 da remoto e sempre pronti per un incontro dal vivo.",
  },
  de: {
    title: "Kontakt — Webagentur Bozen",
    description:
      "Kontaktiere die Webagentur Aura Web Studio in Bozen: Telefon, E-Mail und PEC. Rund um die Uhr remote erreichbar und jederzeit bereit für ein persönliches Treffen.",
  },
  en: {
    title: "Contact — Web Agency Bolzano",
    description:
      "Get in touch with Bolzano web agency Aura Web Studio: phone, email and certified email. Available remotely around the clock and always ready for an in-person meeting.",
  },
  es: {
    title: "Contacto — Agencia Web Bolzano",
    description:
      "Contacta con la agencia web de Bolzano Aura Web Studio: teléfono, email y PEC. Disponibles 24h en remoto y siempre listos para una reunión presencial.",
  },
};

export const Route = createFileRoute("/{-$locale}/contact")({
  head: ({ params }) => {
    const locale = (params.locale as Locale | undefined) ?? "it";
    return pageSeo({ subPath: "contact", locale, ...CONTACT_SEO[locale] });
  },
  component: ContactPage,
});

function ContactPage() {
  const { t } = useTranslation();
  const { locale } = Route.useParams();
  const homeHref = localizedPath((locale as Locale | undefined) ?? "it", "");

  return (
    <main className="min-h-screen bg-black text-white relative flex flex-col justify-between overflow-hidden">
      <Nav />

      {/* Background Atmosphere */}
      <div className="absolute inset-0 noise-bg opacity-30 pointer-events-none" />
      <div className="overflow-hidden absolute inset-0 opacity-40 pointer-events-none">
        <div
          className="absolute top-[-10%] left-[-20%] w-[600px] h-[600px] rounded-full blur-[150px]"
          style={{ background: "var(--glow-cyan)" }}
        />
        <div
          className="absolute bottom-[10%] right-[-25%] w-[700px] h-[700px] rounded-full blur-[180px]"
          style={{ background: "var(--glow-purple)" }}
        />
      </div>

      <div
        className="absolute inset-0 overflow-hidden pointer-events-none z-0"
        style={{
          maskImage: "linear-gradient(to bottom, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 45% at 50% 12%, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.05) 45%, transparent 75%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.09) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "70px 80px",
          }}
        />
        <SparklesCanvas className="absolute inset-0" count={320} />
      </div>

      <div className="relative max-w-7xl mx-auto w-full px-6 md:px-16 pt-32 pb-24 z-10 flex-1">
        {/* Back Button */}
        <div className="mb-12">
          <Link
            to={homeHref}
            className="inline-flex items-center gap-2 font-mono-spec text-[10px] uppercase tracking-[0.25em] text-white/50 hover:text-primary transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3 w-3" /> {t("contactPage.backHome")}
          </Link>
        </div>

        {/* Header */}
        <div className="max-w-3xl mb-14 space-y-6">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-mono-spec text-[10px] uppercase tracking-[0.3em] text-primary"
          >
            {t("contactPage.label")}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.05]"
          >
            {t("contactPage.titlePre")}
            <span className="text-gradient-aura italic">{t("contactPage.titleHighlight")}</span>
            {t("contactPage.titlePost")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-white/50 text-base md:text-lg font-light max-w-2xl leading-relaxed"
          >
            {t("contactPage.subtitle")}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex items-center gap-2 font-mono-spec text-[11px] uppercase tracking-[0.25em] text-white/40"
          >
            <MapPin className="h-3.5 w-3.5 text-primary" />
            {SITE_CONFIG.location.street} · {SITE_CONFIG.location.city}
          </motion.p>
        </div>

        {/* Availability Banner — solid background, no .glass translucency,
            so the pledge reads as a confident, premium statement rather
            than blending into the page behind it. */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="relative bg-neutral-950 rounded-[2rem] border border-white/10 p-8 md:p-10 mb-16 max-w-6xl overflow-hidden"
        >
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-white/[0.06] to-transparent pointer-events-none" />
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />

          <span className="relative inline-block px-3 py-1 mb-6 text-[10px] font-mono-spec uppercase tracking-widest text-white/90 bg-white/10 rounded-full border border-white/20 backdrop-blur-md">
            {t("contactPage.availabilityBadge")}
          </span>

          <div className="relative grid md:grid-cols-2 gap-8 items-start">
            <div className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/5 border border-white/10 text-primary">
                <Clock className="h-4.5 w-4.5" />
              </span>
              <div>
                <h2 className="font-display text-xl md:text-2xl font-bold tracking-tight text-white mb-2">
                  {t("contactPage.availabilityTitle")}
                </h2>
              </div>
            </div>
            <div className="flex gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/5 border border-white/10 text-primary">
                <Users2 className="h-4.5 w-4.5" />
              </span>
              <p className="text-white/60 text-sm md:text-base font-light leading-relaxed">
                {t("contactPage.availabilityDesc")}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Map — where the studio is based and reaches */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16 max-w-6xl"
        >
          <h2 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-white mb-3">
            {t("contactPage.mapTitle")}
          </h2>
          <p className="text-white/50 text-sm md:text-base font-light leading-relaxed max-w-2xl mb-8">
            {t("contactPage.mapCaption")}
          </p>
          <LazyWorldMap />
        </motion.div>

        {/* Founders Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl">
          {members.map((m, index) => (
            <TeamMemberCard key={`${m.name}-${index}`} member={m} index={index} />
          ))}
        </div>
      </div>

      <Footer />
    </main>
  );
}

/**
 * The world map, deferred twice over: the chunk is only fetched when the
 * graphic nears the viewport, and the box it will fill is reserved at exactly
 * its final aspect ratio so nothing below it shifts when it arrives.
 */
function LazyWorldMap() {
  const ref = useRef<HTMLDivElement>(null);
  const { mounted } = useNearViewport(ref, 600);

  return (
    <div ref={ref} className="rounded-[2rem] border border-white/10 p-2 bg-neutral-950">
      {mounted ? (
        <Suspense fallback={<WorldMapPlaceholder />}>
          <WorldMap dots={studioDots} lineColor="oklch(0.85 0.18 200)" />
        </Suspense>
      ) : (
        <WorldMapPlaceholder />
      )}
    </div>
  );
}

// Same box the real map occupies at every breakpoint — see WorldMap's root.
function WorldMapPlaceholder() {
  return (
    <div className="w-full aspect-[2/1] md:aspect-[2.5/1] lg:aspect-[2/1] rounded-2xl bg-black" />
  );
}
