import { Nav } from "@/components/aura/Nav";
import { Intro } from "@/components/aura/Intro";
import { Hero } from "@/components/aura/Hero";
import { Services } from "@/components/aura/Services";
import { Projects } from "@/components/aura/Projects";
import { Team } from "@/components/aura/Team";
import { Contact, Footer } from "@/components/aura/Contact";
import { CanvasBoundary } from "@/components/CanvasBoundary";
import { MobileHome } from "@/components/mobile/MobileHome";
import { ViewportSwitch } from "@/components/mobile/ViewportSwitch";
import type { Locale } from "@/lib/seo";

/**
 * Still not a client component itself. `ViewportSwitch` is the only client
 * boundary here, and both branches are handed to it as already-built
 * elements, so this file stays a server component and each section keeps its
 * own boundary — marking the page "use client" would pull all of them into
 * one client entry for no gain.
 *
 * The desktop branch below is exactly what this page rendered before the
 * phone rebuild, unchanged. The split is the wrapper, not an edit.
 */
export function HomePage({ locale }: { locale: Locale }) {
  return (
    <ViewportSwitch
      mobile={<MobileHome locale={locale} />}
      desktop={
        <main className="bg-black text-white">
          {/* Renders nothing at all unless this is a fresh, full-motion visit —
              see @/lib/boot for how that's decided (and when). If its WebGL
              sequence fails, the boundary drops it and opens the boot gate by
              hand, so the page behind it is released rather than left curtained. */}
          <CanvasBoundary label="intro" releaseBootGateOnError>
            <Intro />
          </CanvasBoundary>
          <Nav />
          <Hero />
          <Services />
          <Projects locale={locale} />
          <Team />
          <Contact />
          <Footer />
        </main>
      }
    />
  );
}
