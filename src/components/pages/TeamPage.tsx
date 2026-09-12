"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Nav } from "@/components/aura/Nav";
import { Footer } from "@/components/aura/Contact";
import { localizedPath, type Locale } from "@/lib/seo";
import { SparklesCanvas } from "@/components/ui/sparkles-canvas";
import { members, collaborators } from "@/lib/team-members";
import { TeamMemberCard } from "@/components/aura/TeamMemberCard";
import { CollaboratorCard } from "@/components/aura/CollaboratorCard";

export function TeamPage({ locale }: { locale: Locale }) {
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

      {/* Ambient grid + sparkles + soft white light wash across the whole
          page (not just the header), same treatment as the pricing page but
          stretched full-height with a gentle top/bottom fade instead of a
          tight radial mask. */}
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
            href={homeHref}
            className="font-mono-spec -my-4 inline-flex cursor-pointer items-center gap-2 py-4 text-[10px] tracking-[0.25em] text-white/50 uppercase transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-3 w-3" /> {t("team.backHome")}
          </Link>
        </div>

        {/* Header */}
        <div className="max-w-3xl mb-20 space-y-6">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-mono-spec text-[10px] uppercase tracking-[0.3em] text-primary"
          >
            {t("team.label")}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.05]"
          >
            {t("team.titlePre")}
            <span className="text-gradient-aura italic">{t("team.titleHighlight")}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-white/50 text-base md:text-lg font-light max-w-2xl leading-relaxed"
          >
            {t("team.subtitle")}
          </motion.p>
        </div>

        {/* Members Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl">
          {members.map((m, index) => (
            <TeamMemberCard key={`${m.name}-${index}`} member={m} index={index} />
          ))}
        </div>

        {/* The people who work with the studio without having founded it.
            Its own section under the trio, with its own heading, rather than
            two more cards in the grid above — the distinction is real and the
            page should say so. */}
        {collaborators.length > 0 && (
          <section className="mt-20 max-w-6xl md:mt-28">
            <div className="mb-8 flex items-baseline justify-between gap-6 border-b border-white/10 pb-5">
              <h2 className="font-display text-2xl font-bold tracking-tighter text-white md:text-3xl">
                {t("team.collaborators", "Collaboratori")}
              </h2>
            </div>

            <p className="mb-8 max-w-xl text-sm leading-relaxed font-light text-white/50 md:text-base">
              {t(
                "team.collaboratorsLead",
                "Chi lavora con noi sui progetti, oltre confine e oltre lo studio.",
              )}
            </p>

            <div className="grid gap-5 lg:grid-cols-2">
              {collaborators.map((c, index) => (
                <CollaboratorCard key={`${c.name}-${index}`} person={c} index={index} />
              ))}
            </div>
          </section>
        )}
      </div>

      <Footer />
    </main>
  );
}
