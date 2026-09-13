"use client";

import { Suspense, lazy, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, Users2, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Nav } from "@/components/aura/Nav";
import { Footer } from "@/components/aura/Contact";
import { SITE_CONFIG, localizedPath, type Locale } from "@/lib/seo";
import { SparklesCanvas } from "@/components/ui/sparkles-canvas";
import { members } from "@/lib/team-members";
import { TeamMemberCard } from "@/components/aura/TeamMemberCard";
import { useNearViewport } from "@/hooks/use-near-viewport";
// Code-split, and mounted only once it's actually approaching the viewport.
// The two plates carry about 110 kB of path data between them — cheap for
// what they are, but still not something to put in the entry chunk of a page
// somebody opens for the phone number.
const NetworkMap = lazy(() =>
  import("@/components/aura/NetworkMap").then((m) => ({ default: m.NetworkMap })),
);

export function ContactPage({ locale }: { locale: Locale }) {
  const { t } = useTranslation();
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
        {/* On a phone the sparkle layer is one screen tall, not the whole page.
         *
         * `inset-0` here spans the full document — 4,670px on a 375px-wide
         * phone — which gave the canvas a 750×8,440 backing store: 6.3
         * megapixels cleared and repainted on every animation frame, on the
         * device least able to afford it. And because the layer covered the
         * entire page it was always intersecting, so the observer that is
         * supposed to pause the loop never once did.
         *
         * The dots are ambient texture behind the header; below the first
         * screen they sit under opaque content and nobody has ever seen
         * them. `md:` restores the original box, so the desktop rendering
         * is unchanged. */}
        <SparklesCanvas
          className="absolute inset-x-0 top-0 !h-[100svh] md:inset-0 md:!h-full"
          count={320}
        />
      </div>

      <div className="relative max-w-7xl mx-auto w-full px-6 md:px-16 pt-32 pb-24 z-10 flex-1">
        {/* Back Button */}
        <div className="mb-12">
          <Link
            href={homeHref}
            className="font-mono-spec -my-4 inline-flex cursor-pointer items-center gap-2 py-4 text-[10px] tracking-[0.25em] text-white/50 uppercase transition-colors hover:text-primary"
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
          <LazyNetworkMap />
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
 * The map, deferred twice over: the chunk is only fetched when the graphic
 * nears the viewport, and the box it will fill is reserved at roughly its
 * final height so nothing below it jumps when it arrives.
 */
function LazyNetworkMap() {
  const ref = useRef<HTMLDivElement>(null);
  const { mounted } = useNearViewport(ref, 600);

  return (
    <div ref={ref}>
      {mounted ? (
        <Suspense fallback={<MapPlaceholder />}>
          <NetworkMap />
        </Suspense>
      ) : (
        <MapPlaceholder />
      )}
    </div>
  );
}

function MapPlaceholder() {
  return <div className="min-h-[520px] w-full rounded-2xl border border-white/10 bg-neutral-950" />;
}
