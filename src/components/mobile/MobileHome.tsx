"use client";

import { Contact, Footer } from "@/components/aura/Contact";
import { Nav } from "@/components/aura/Nav";
import { MobileHero, MobileHeroCoda } from "@/components/mobile/home/Hero";
import { MobileProducts } from "@/components/mobile/home/Product";
import { MobileProjects } from "@/components/mobile/home/Projects";
import { MobileServices } from "@/components/mobile/home/Services";
import { MobileWorkStrip } from "@/components/mobile/home/WorkStrip";
import type { Locale } from "@/lib/seo";

/**
 * The phone home page: same sections, same words, same order as the desktop.
 *
 * Two things are deliberately absent and one is deliberately shared.
 *
 * `Intro` is gone. It is the WebGL boot sequence — a curtain the visitor
 * waits behind — and on a phone it accounted for 2,436px of the 9,959px page
 * while showing no content at all. A phone visitor arriving from a search
 * result wants the headline, not an overture.
 *
 * The desktop `Hero`, `Services`, `Projects` and `Team` are not rendered
 * here, which is what lets their files stay untouched: the phone gets purpose
 * -built sections instead of desktop sections with their best parts disabled.
 *
 * `Nav`, `Contact` and `Footer` ARE the desktop components, on purpose. They
 * are already built responsively, the contact form carries the Supabase
 * submission and its fallback, and duplicating that logic to restyle a border
 * radius would be how a working form quietly stops working.
 */
export function MobileHome({ locale }: { locale: Locale }) {
  return (
    <main className="bg-black text-white">
      <Nav />
      <MobileHero />
      <MobileHeroCoda />
      <MobileWorkStrip />
      <MobileServices />
      <MobileProjects locale={locale} />
      <MobileProducts locale={locale} />
      <Contact />
      <Footer />
    </main>
  );
}
