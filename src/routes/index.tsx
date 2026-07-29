import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/aura/Nav";
import { Intro } from "@/components/aura/Intro";
import { Hero } from "@/components/aura/Hero";
import { Services } from "@/components/aura/Services";
import { Projects } from "@/components/aura/Projects";
import { Team } from "@/components/aura/Team";
import { Contact, Footer } from "@/components/aura/Contact";
import { CanvasBoundary } from "@/components/CanvasBoundary";
import { markBootReady } from "@/lib/boot";
import { pageSeo } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    pageSeo({
      path: "/",
      description:
        "Web design a Bolzano e sviluppo siti web in Alto Adige: esperienze digitali cinematiche, animazioni a 60fps e design ad alto impatto per brand italiani dell'hospitality e del lifestyle.",
    }),
  component: Index,
});

function Index() {
  return (
    <main className="bg-black text-white">
      {/* Renders nothing at all unless this is a fresh, full-motion visit —
          see @/lib/boot for how that's decided (and when). If its WebGL
          sequence fails, the boundary drops it and opens the boot gate by
          hand, so the page behind it is released rather than left curtained. */}
      <CanvasBoundary label="intro" onError={markBootReady}>
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
