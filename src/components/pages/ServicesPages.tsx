"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Check } from "lucide-react";
import { Nav } from "@/components/aura/Nav";
import { Footer } from "@/components/aura/Contact";
import { SparklesCanvas } from "@/components/ui/sparkles-canvas";
import { allProjects, categoryLabel } from "@/components/aura/projects-data";
import { localizedPath, type Locale } from "@/lib/seo";
import {
  SERVICES,
  SERVICES_HUB,
  SERVICES_SUBPATH,
  SERVICES_UI,
  serviceSubPath,
  type Service,
} from "@/lib/services";

/**
 * The shell every service page shares: the same atmosphere as the team and
 * pricing pages (glows, grid, sparkles), so the new pages read as part of the
 * site rather than as an SEO annex bolted on.
 */
function ServicesShell({
  backHref,
  backLabel,
  children,
}: {
  backHref: string;
  backLabel: string;
  children: ReactNode;
}) {
  return (
    <main className="min-h-screen bg-black text-white relative flex flex-col justify-between overflow-hidden">
      <Nav />

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
        <SparklesCanvas className="absolute inset-0" count={240} />
      </div>

      <div className="relative max-w-7xl mx-auto w-full px-6 md:px-16 pt-32 pb-24 z-10 flex-1">
        <div className="mb-12">
          <Link
            href={backHref}
            className="font-mono-spec -my-4 inline-flex cursor-pointer items-center gap-2 py-4 text-[10px] tracking-[0.25em] text-white/50 uppercase transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-3 w-3" /> {backLabel}
          </Link>
        </div>
        {children}
      </div>

      <Footer />
    </main>
  );
}

function Heading({ pre, highlight, lead }: { pre: string; highlight: string; lead: string }) {
  return (
    <div className="max-w-3xl mb-16 space-y-6">
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.05]"
      >
        {pre}
        <span className="text-gradient-aura italic">{highlight}</span>
      </motion.h1>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="text-white/60 text-base md:text-lg font-light max-w-2xl leading-relaxed"
      >
        {lead}
      </motion.p>
    </div>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="mb-8 flex items-baseline justify-between gap-6 border-b border-white/10 pb-5">
      <h2 className="font-display text-2xl font-bold tracking-tighter text-white md:text-3xl">
        {children}
      </h2>
    </div>
  );
}

function ServiceCards({ locale, services }: { locale: Locale; services: Service[] }) {
  const ui = SERVICES_UI[locale];
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {services.map((s) => {
        const c = s.copy[locale];
        return (
          <Link
            key={s.slug}
            href={localizedPath(locale, serviceSubPath(s.slug))}
            className="group flex flex-col justify-between gap-6 rounded-[1.25rem] border border-white/10 bg-neutral-950/80 p-7 transition-colors hover:border-white/25"
          >
            <div className="space-y-3">
              <h3 className="font-display text-xl font-bold tracking-tight text-white md:text-2xl">
                {c.name}
              </h3>
              <p className="text-sm leading-relaxed font-light text-white/55">{c.description}</p>
            </div>
            <span className="font-mono-spec inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-white/60 transition-colors group-hover:text-primary">
              {ui.discover}
            </span>
          </Link>
        );
      })}
    </div>
  );
}

function ContactCta({ locale }: { locale: Locale }) {
  const ui = SERVICES_UI[locale];
  return (
    <section className="mt-20 max-w-6xl rounded-[1.5rem] border border-white/10 bg-neutral-950/80 p-8 md:mt-28 md:p-12">
      <h2 className="font-display text-2xl font-bold tracking-tighter text-white md:text-4xl">
        {ui.ctaTitle}
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed font-light text-white/55 md:text-base">
        {ui.ctaText}
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Link
          href={localizedPath(locale, "contact")}
          className="font-mono-spec inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-black transition-opacity hover:opacity-85"
        >
          {ui.ctaContact} <ArrowUpRight className="h-3.5 w-3.5" />
        </Link>
        <Link
          href={localizedPath(locale, "pricing")}
          className="font-mono-spec inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-white/80 transition-colors hover:border-white/50"
        >
          {ui.ctaPricing}
        </Link>
      </div>
    </section>
  );
}

export function ServicesHubPage({ locale }: { locale: Locale }) {
  const ui = SERVICES_UI[locale];
  const hub = SERVICES_HUB[locale];
  return (
    <ServicesShell backHref={localizedPath(locale, "")} backLabel={ui.backHome}>
      <Heading pre={hub.h1} highlight={hub.h1Highlight} lead={hub.lead} />

      <div className="mb-16 max-w-3xl space-y-5">
        {hub.body.map((p, i) => (
          <p key={i} className="text-sm leading-relaxed font-light text-white/55 md:text-base">
            {p}
          </p>
        ))}
      </div>

      <section className="max-w-6xl">
        <ServiceCards locale={locale} services={SERVICES} />
      </section>

      <ContactCta locale={locale} />
    </ServicesShell>
  );
}

export function ServiceDetailPage({ locale, service }: { locale: Locale; service: Service }) {
  const ui = SERVICES_UI[locale];
  const c = service.copy[locale];
  const projects = allProjects.filter((p) => service.categories.includes(p.category)).slice(0, 6);
  const others = SERVICES.filter((s) => s.slug !== service.slug);

  return (
    <ServicesShell backHref={localizedPath(locale, SERVICES_SUBPATH)} backLabel={ui.backServices}>
      <Heading pre={c.h1} highlight={c.h1Highlight} lead={c.lead} />

      <div className="max-w-3xl space-y-14">
        {c.sections.map((s) => (
          <section key={s.h2} className="space-y-5">
            <h2 className="font-display text-2xl font-bold tracking-tighter text-white md:text-3xl">
              {s.h2}
            </h2>
            {s.body.map((p, i) => (
              <p key={i} className="text-sm leading-relaxed font-light text-white/60 md:text-base">
                {p}
              </p>
            ))}
          </section>
        ))}
      </div>

      <section className="mt-20 max-w-6xl md:mt-28">
        <SectionTitle>{ui.whatYouGet}</SectionTitle>
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {c.points.map((pt) => (
            <li
              key={pt.title}
              className="rounded-[1.25rem] border border-white/10 bg-neutral-950/80 p-6"
            >
              <div className="flex items-center gap-3">
                <Check className="h-4 w-4 shrink-0 text-primary" />
                <h3 className="font-display text-base font-bold tracking-tight text-white">
                  {pt.title}
                </h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed font-light text-white/55">{pt.text}</p>
            </li>
          ))}
        </ul>
      </section>

      {projects.length > 0 && (
        <section className="mt-20 max-w-6xl md:mt-28">
          <SectionTitle>{ui.projects}</SectionTitle>
          <p className="mb-8 max-w-xl text-sm leading-relaxed font-light text-white/50 md:text-base">
            {ui.projectsLead}
          </p>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <li
                key={p.id}
                className="rounded-[1.25rem] border border-white/10 bg-neutral-950/80 p-6"
              >
                <p className="font-mono-spec text-[10px] uppercase tracking-[0.25em] text-white/40">
                  {categoryLabel(p.category)}
                </p>
                <h3 className="mt-2 font-display text-lg font-bold tracking-tight text-white">
                  {p.name}
                </h3>
                {locale === "it" && (
                  <p className="mt-2 text-sm leading-relaxed font-light text-white/55">{p.desc}</p>
                )}
              </li>
            ))}
          </ul>
          <Link
            href={localizedPath(locale, "lavori")}
            className="font-mono-spec mt-8 inline-flex text-[10px] uppercase tracking-[0.25em] text-white/60 transition-colors hover:text-primary"
          >
            {ui.allProjects}
          </Link>
        </section>
      )}

      <section className="mt-20 max-w-4xl md:mt-28">
        <SectionTitle>{ui.faq}</SectionTitle>
        <div className="divide-y divide-white/10">
          {c.faqs.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-6 font-display text-base font-bold tracking-tight text-white md:text-lg">
                <h3>{f.q}</h3>
                <span className="text-white/40 transition-transform group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed font-light text-white/55 md:text-base">
                {f.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      <section className="mt-20 max-w-6xl md:mt-28">
        <SectionTitle>{ui.otherServices}</SectionTitle>
        <ServiceCards locale={locale} services={others} />
      </section>

      <ContactCta locale={locale} />
    </ServicesShell>
  );
}
