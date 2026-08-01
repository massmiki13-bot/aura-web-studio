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
import { pageSeo, type Locale } from "@/lib/seo";

// Home overrides the default <title> per locale — every other route always
// passes an explicit title, but the homepage normally falls back to
// SITE_CONFIG.defaultTitle (Italian), so non-IT locales need their own.
// No "Aura Web Studio — " prefix here: buildTitle() already appends the
// brand as a suffix for any explicit title, same as every other route.
const HOME_TITLE: Partial<Record<Locale, string>> = {
  de: "Webdesign in Bozen & Premium Webseiten-Entwicklung",
  en: "Web Design in Bolzano & Premium Website Development",
  es: "Diseño Web en Bolzano y Desarrollo Web Premium",
};

const HOME_DESCRIPTION: Record<Locale, string> = {
  it: "Web design a Bolzano e sviluppo siti web in Alto Adige: esperienze digitali cinematiche, animazioni a 60fps e design ad alto impatto per brand italiani dell'hospitality e del lifestyle.",
  de: "Webdesign in Bozen und Webseiten-Entwicklung in Südtirol: kinematische digitale Erlebnisse, 60-fps-Animationen und Webdesign mit hoher Wirkung für Marken aus Hotellerie und Lifestyle.",
  en: "Web design in Bolzano and website development in South Tyrol: cinematic digital experiences, 60fps animations and high-impact design for hospitality and lifestyle brands.",
  es: "Diseño web en Bolzano y desarrollo de sitios web en el Alto Adigio: experiencias digitales cinematográficas, animaciones a 60fps y diseño de alto impacto para marcas de hospitality y lifestyle.",
};

export const Route = createFileRoute("/{-$locale}/")({
  head: ({ params }) => {
    const locale = (params.locale as Locale | undefined) ?? "it";
    return pageSeo({
      subPath: "",
      locale,
      title: HOME_TITLE[locale],
      description: HOME_DESCRIPTION[locale],
    });
  },
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
