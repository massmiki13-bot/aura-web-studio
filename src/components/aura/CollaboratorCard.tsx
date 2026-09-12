"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Phone, Mail } from "lucide-react";

import { roles, type Collaborator } from "@/lib/team-members";

/**
 * A collaborator.
 *
 * Deliberately not the founder card at a smaller size. That one is a portrait
 * above a stack of contact rows, sized to hold its own in a grid of three; one
 * of those alone on a row would read as a founder the page forgot to finish.
 *
 * This is a row instead: a small square portrait beside the name and the two
 * ways to reach them. It sits under the trio without competing with it, and it
 * keeps working when the list is one person or five.
 */
export function CollaboratorCard({ person: c, index }: { person: Collaborator; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col gap-6 rounded-[1.5rem] border border-white/10 bg-neutral-950 p-6 sm:flex-row sm:items-center sm:p-7"
    >
      <div className="relative size-24 shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 sm:size-28">
        <Image
          src={c.image}
          alt={`${c.name} ${c.surname}`}
          fill
          sizes="112px"
          className="object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <h3 className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
          {c.name} <span className="text-white/80">{c.surname}</span>
        </h3>
        <p className="font-mono-spec mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] tracking-widest text-white/45 uppercase">
          {roles[c.roleKey] ?? c.roleKey}
          <span aria-hidden className="h-3 w-px bg-white/15" />
          {c.based}
        </p>

        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3">
          <a
            href={`tel:${c.phone.replace(/\s+/g, "")}`}
            className="group inline-flex items-center gap-2.5 text-sm text-white/60 transition-colors hover:text-white"
          >
            <Phone className="h-3.5 w-3.5 shrink-0 text-white/35 transition-colors group-hover:text-white" />
            {c.phone}
          </a>
          <a
            href={`mailto:${c.email}`}
            className="group inline-flex min-w-0 items-center gap-2.5 text-sm text-white/60 transition-colors hover:text-white"
          >
            <Mail className="h-3.5 w-3.5 shrink-0 text-white/35 transition-colors group-hover:text-white" />
            <span className="truncate">{c.email}</span>
          </a>
        </div>
      </div>
    </motion.div>
  );
}
