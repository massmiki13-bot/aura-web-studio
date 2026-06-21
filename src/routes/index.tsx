import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/aura/Nav";
import { Hero } from "@/components/aura/Hero";
import { Projects, ProjectsMobile } from "@/components/aura/Projects";
import { Team } from "@/components/aura/Team";
import { Contact, Footer } from "@/components/aura/Contact";
import { pageSeo } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () =>
    pageSeo({
      path: "/",
      description:
        "Studio creativo di web design e sviluppo: esperienze web cinematiche, animazioni a 60fps e design ad alto impatto per brand italiani dell'hospitality e del lifestyle.",
    }),
  component: Index,
});

function Index() {
  return (
    <main className="bg-black text-white">
      <Nav />
      <Hero />
      <Projects />
      <ProjectsMobile />
      <Team />
      <Contact />
      <Footer />
    </main>
  );
}
