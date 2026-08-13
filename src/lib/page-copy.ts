import type { Locale } from "@/lib/seo";

/**
 * Per-locale title and description for every indexed route.
 *
 * These used to sit at the top of each route file, next to the component they
 * described. They are gathered here instead because the component and the
 * metadata now live on opposite sides of the server/client boundary: the page
 * body is a client component, `generateMetadata` runs on the server, and a
 * client module imported for its constants would drag the whole component into
 * the server graph to get them.
 *
 * Titles are written *without* the brand — the "— Aura Web Studio" suffix is
 * applied once by the title template in rootMetadata. The home page is the
 * exception and states its title absolutely, because SITE_CONFIG.defaultTitle
 * already carries the brand and is Italian-only.
 */
export type SeoCopy = { title: string; description: string };

/**
 * The homepage's own titles. Italian is absent on purpose: it falls through to
 * SITE_CONFIG.defaultTitle, which is the canonical brand title for the site.
 */
export const HOME_TITLE: Partial<Record<Locale, string>> = {
  de: "Webdesign in Bozen & Premium Webseiten-Entwicklung",
  en: "Web Design in Bolzano & Premium Website Development",
  es: "Diseño Web en Bolzano y Desarrollo Web Premium",
};

export const HOME_DESCRIPTION: Record<Locale, string> = {
  it: "Web design a Bolzano e sviluppo siti web in Alto Adige: esperienze digitali cinematiche, animazioni a 60fps e design ad alto impatto per brand italiani dell'hospitality e del lifestyle.",
  de: "Webdesign in Bozen und Webseiten-Entwicklung in Südtirol: kinematische digitale Erlebnisse, 60-fps-Animationen und Webdesign mit hoher Wirkung für Marken aus Hotellerie und Lifestyle.",
  en: "Web design in Bolzano and website development in South Tyrol: cinematic digital experiences, 60fps animations and high-impact design for hospitality and lifestyle brands.",
  es: "Diseño web en Bolzano y desarrollo de sitios web en el Alto Adigio: experiencias digitales cinematográficas, animaciones a 60fps y diseño de alto impacto para marcas de hospitality y lifestyle.",
};

export const PRICING_SEO: Record<Locale, SeoCopy> = {
  it: {
    title: "Prezzi Siti Web Professionali Bolzano",
    description:
      "Prezzi trasparenti per siti web professionali a Bolzano: landing page, siti vetrina ed e-commerce custom. Scegli il piano ideale per portare il tuo business online.",
  },
  de: {
    title: "Preise Professionelle Webseiten Bozen",
    description:
      "Transparente Preise für professionelle Webseiten in Bozen: Landingpages, Website-Baukästen und individuelle E-Commerce-Lösungen. Wähle den idealen Plan für dein Business online.",
  },
  en: {
    title: "Professional Website Pricing Bolzano",
    description:
      "Transparent pricing for professional websites in Bolzano: landing pages, showcase sites and custom e-commerce. Choose the ideal plan to bring your business online.",
  },
  es: {
    title: "Precios de Sitios Web Profesionales Bolzano",
    description:
      "Precios transparentes para sitios web profesionales en Bolzano: landing pages, sitios vetrina y e-commerce a medida. Elige el plan ideal para llevar tu negocio online.",
  },
};

export const TEAM_SEO: Record<Locale, SeoCopy> = {
  it: {
    title: "Team — Agenzia Web Design Bolzano",
    description:
      "Le persone dietro Aura Web Studio, agenzia di web design a Bolzano. Conosci il trio e contattaci direttamente: telefono, PEC ed email.",
  },
  de: {
    title: "Team — Webdesign-Agentur Bozen",
    description:
      "Die Menschen hinter Aura Web Studio, Webdesign-Agentur in Bozen. Lerne das Trio kennen und kontaktiere uns direkt: Telefon, PEC und E-Mail.",
  },
  en: {
    title: "Team — Web Design Agency Bolzano",
    description:
      "The people behind Aura Web Studio, web design agency in Bolzano. Meet the trio and get in touch directly: phone, certified email and email.",
  },
  es: {
    title: "Equipo — Agencia de Diseño Web Bolzano",
    description:
      "Las personas detrás de Aura Web Studio, agencia de diseño web en Bolzano. Conoce al trío y contáctanos directamente: teléfono, PEC y email.",
  },
};

export const CONTACT_SEO: Record<Locale, SeoCopy> = {
  it: {
    title: "Contatti — Agenzia Web Bolzano",
    description:
      "Contatta l'agenzia web di Bolzano Aura Web Studio: telefono, email e PEC. Disponibili h24 da remoto e sempre pronti per un incontro dal vivo.",
  },
  de: {
    title: "Kontakt — Webagentur Bozen",
    description:
      "Kontaktiere die Webagentur Aura Web Studio in Bozen: Telefon, E-Mail und PEC. Rund um die Uhr remote erreichbar und jederzeit bereit für ein persönliches Treffen.",
  },
  en: {
    title: "Contact — Web Agency Bolzano",
    description:
      "Get in touch with Bolzano web agency Aura Web Studio: phone, email and certified email. Available remotely around the clock and always ready for an in-person meeting.",
  },
  es: {
    title: "Contacto — Agencia Web Bolzano",
    description:
      "Contacta con la agencia web de Bolzano Aura Web Studio: teléfono, email y PEC. Disponibles 24h en remoto y siempre listos para una reunión presencial.",
  },
};
