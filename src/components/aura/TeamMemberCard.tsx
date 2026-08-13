"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Phone, Mail, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import { roles, type TeamMember } from "@/lib/team-members";

export function TeamMemberCard({ member: m, index }: { member: TeamMember; index: number }) {
  const { t } = useTranslation();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 + index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      // Solid background instead of the shared translucent .glass utility —
      // the page-wide sparkle/grid backdrop would otherwise show (blurred)
      // through the cards.
      className="relative bg-neutral-950 rounded-[2rem] p-8 flex flex-col overflow-hidden border border-white/10"
    >
      {/* Photo */}
      <div
        className="relative aspect-square w-full rounded-2xl overflow-hidden mb-6 border border-white/10"
        style={{ background: `radial-gradient(circle at 50% 30%, ${m.accent}, #050108)` }}
      >
        {/* The container is aspect-square and already `relative`, so `fill`
            has a box to cover. Three cards across a max-w-6xl grid works out
            to roughly 360px each, full width once the grid collapses. */}
        <Image
          src={m.image}
          alt={`${m.name} ${m.surname}`}
          fill
          sizes="(min-width: 768px) 360px, 100vw"
          // The first portrait is the LCP element on /team and /contact: it is
          // the largest thing in the opening viewport on both. next/image is
          // lazy by default, which meant the browser only discovered it after
          // layout — measured at 2.1s, most of it spent not knowing the image
          // existed. `priority` emits a preload instead, so the fetch starts
          // with the document. The rest stay lazy; they are the same size but
          // never the LCP candidate, and preloading all three would only make
          // them compete with the fonts.
          priority={index === 0}
          className="object-cover"
          // A missing portrait falls back to the accent gradient painted on
          // the container behind it, rather than a broken-image icon.
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      </div>

      {/* Name & Role */}
      <h2 className="font-display text-2xl font-bold tracking-tight text-white">
        {m.name} <span className="text-white/80">{m.surname}</span>
      </h2>
      <p
        className="font-mono-spec text-[10px] uppercase tracking-widest mt-1 mb-6"
        style={{ color: m.accent }}
      >
        {roles[m.roleKey]}
      </p>

      {/* Contact info */}
      <ul className="space-y-3 mt-auto">
        <li>
          <a
            href={`tel:${m.phone.replace(/\s/g, "")}`}
            className="flex items-center gap-3 text-white/70 hover:text-primary transition-colors group"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 border border-white/10 group-hover:border-primary/40">
              <Phone className="h-3.5 w-3.5" />
            </span>
            <span className="text-sm font-light">{m.phone}</span>
          </a>
        </li>
        <li>
          <a
            href={`mailto:${m.email}`}
            className="flex items-center gap-3 text-white/70 hover:text-primary transition-colors group"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 border border-white/10 group-hover:border-primary/40">
              <Mail className="h-3.5 w-3.5" />
            </span>
            <span className="text-sm font-light break-all">{m.email}</span>
          </a>
        </li>
        <li>
          <a
            href={`mailto:${m.pec}`}
            className="flex items-center gap-3 text-white/70 hover:text-primary transition-colors group"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/5 border border-white/10 group-hover:border-primary/40">
              <FileText className="h-3.5 w-3.5" />
            </span>
            <span className="text-sm font-light break-all">
              <span className="text-white/40">{t("team.pec")}: </span>
              {m.pec}
            </span>
          </a>
        </li>
      </ul>
    </motion.div>
  );
}
