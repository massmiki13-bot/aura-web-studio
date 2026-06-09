import { createFileRoute } from "@tanstack/react-router";
import { Nav } from "@/components/aura/Nav";
import { Hero } from "@/components/aura/Hero";
import { Projects, ProjectsMobile } from "@/components/aura/Projects";
import { Team } from "@/components/aura/Team";
import { Contact } from "@/components/aura/Contact";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aura Web Studio — Creative Digital Solutions" },
      {
        name: "description",
        content:
          "Tre menti, un unico ecosistema digitale. Studio creativo specializzato in esperienze web cinematiche, animazioni avanzate e UI/UX su misura.",
      },
      { property: "og:title", content: "Aura Web Studio — Creative Digital Solutions" },
      {
        property: "og:description",
        content:
          "Esperienze web cinematiche, animazioni 60fps e design ad alto impatto. Aura Web Studio.",
      },
      { property: "og:type", content: "website" },
      { name: "theme-color", content: "#000000" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="bg-black text-white">
      <Nav />
      <Hero />
      <div style={{ contain: "layout style paint" }}>
        <Projects />
      </div>
      <ProjectsMobile />
      <div style={{ contain: "layout style paint" }}>
        <Team />
      </div>
      <Contact />
    </main>
  );
}
