import { Nav } from "@/components/aura/Nav";
import { Intro } from "@/components/aura/Intro";
import { Hero } from "@/components/aura/Hero";
import { Services } from "@/components/aura/Services";
import { Projects } from "@/components/aura/Projects";
import { Team } from "@/components/aura/Team";
import { Contact, Footer } from "@/components/aura/Contact";
import { CanvasBoundary } from "@/components/CanvasBoundary";

/**
 * Deliberately not a client component. It holds no state and calls no hook —
 * it is only the running order of the page — so it renders on the server and
 * the boundary falls to each section instead. Marking it "use client" would
 * pull every one of these into a single client entry for no gain.
 */
export function HomePage() {
  return (
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
      <Projects />
      <Team />
      <Contact />
      <Footer />
    </main>
  );
}
