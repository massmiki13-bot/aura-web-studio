import type { ProjectCategory } from "@/components/aura/projects-data";
import type { Locale } from "@/lib/seo";

/**
 * The service landing pages — /servizi and /servizi/<slug>.
 *
 * These exist for search: the rest of the site answers "who is Aura", these
 * answer what a prospect actually types ("sito web hotel Alto Adige",
 * "Webdesign Restaurant Südtirol"). Each one is a real page with its own
 * copy, FAQ and the matching projects from the portfolio, not a doorway page
 * with the city name swapped.
 *
 * Kept in plain data, like page-copy.ts, because the metadata (server) and
 * the page body (client) both read it.
 *
 * Wording note: Aura is a shared name for three self-employed professionals,
 * not a company — the copy says "tre professionisti", never "agenzia" or
 * "società".
 */

export type ServiceSlug =
  | "siti-web-hotel"
  | "siti-web-ristoranti"
  | "siti-web-aziende"
  | "e-commerce";

export type ServiceCopy = {
  /** <title>, without the brand suffix. */
  title: string;
  description: string;
  /** Short name used on cards, breadcrumbs and links. */
  name: string;
  h1: string;
  h1Highlight: string;
  lead: string;
  sections: { h2: string; body: string[] }[];
  points: { title: string; text: string }[];
  faqs: { q: string; a: string }[];
};

export type Service = {
  slug: ServiceSlug;
  /** Portfolio categories shown as proof under the copy. */
  categories: ProjectCategory[];
  copy: Record<Locale, ServiceCopy>;
};

export const SERVICES_SUBPATH = "servizi";

export function serviceSubPath(slug: ServiceSlug) {
  return `${SERVICES_SUBPATH}/${slug}`;
}

/** Interface strings shared by the hub and every service page. */
export const SERVICES_UI: Record<
  Locale,
  {
    navLabel: string;
    backHome: string;
    backServices: string;
    whatYouGet: string;
    projects: string;
    projectsLead: string;
    allProjects: string;
    faq: string;
    ctaTitle: string;
    ctaText: string;
    ctaContact: string;
    ctaPricing: string;
    discover: string;
    otherServices: string;
  }
> = {
  it: {
    navLabel: "Servizi",
    backHome: "Torna alla Home",
    backServices: "Tutti i servizi",
    whatYouGet: "Cosa è incluso",
    projects: "Progetti realizzati",
    projectsLead: "Alcuni siti che abbiamo già messo online in questo settore.",
    allProjects: "Vedi tutti i lavori →",
    faq: "Domande frequenti",
    ctaTitle: "Parliamo del tuo progetto",
    ctaText:
      "Raccontaci cosa ti serve: ti rispondiamo entro 24 ore con un'idea concreta e un preventivo chiaro.",
    ctaContact: "Contattaci",
    ctaPricing: "Vedi i prezzi",
    discover: "Scopri il servizio →",
    otherServices: "Altri servizi",
  },
  de: {
    navLabel: "Leistungen",
    backHome: "Zurück zur Startseite",
    backServices: "Alle Leistungen",
    whatYouGet: "Was enthalten ist",
    projects: "Umgesetzte Projekte",
    projectsLead: "Einige Webseiten, die wir in dieser Branche bereits online gebracht haben.",
    allProjects: "Alle Projekte ansehen →",
    faq: "Häufige Fragen",
    ctaTitle: "Sprechen wir über dein Projekt",
    ctaText:
      "Erzähl uns, was du brauchst: Wir antworten innerhalb von 24 Stunden mit einer konkreten Idee und einem klaren Angebot.",
    ctaContact: "Kontakt aufnehmen",
    ctaPricing: "Preise ansehen",
    discover: "Mehr erfahren →",
    otherServices: "Weitere Leistungen",
  },
  en: {
    navLabel: "Services",
    backHome: "Back to Home",
    backServices: "All services",
    whatYouGet: "What's included",
    projects: "Projects delivered",
    projectsLead: "Some of the websites we have already launched in this sector.",
    allProjects: "See all work →",
    faq: "Frequently asked questions",
    ctaTitle: "Let's talk about your project",
    ctaText:
      "Tell us what you need: we reply within 24 hours with a concrete idea and a clear quote.",
    ctaContact: "Get in touch",
    ctaPricing: "See pricing",
    discover: "Explore the service →",
    otherServices: "Other services",
  },
  es: {
    navLabel: "Servicios",
    backHome: "Volver al inicio",
    backServices: "Todos los servicios",
    whatYouGet: "Qué incluye",
    projects: "Proyectos realizados",
    projectsLead: "Algunas webs que ya hemos publicado en este sector.",
    allProjects: "Ver todos los trabajos →",
    faq: "Preguntas frecuentes",
    ctaTitle: "Hablemos de tu proyecto",
    ctaText:
      "Cuéntanos qué necesitas: respondemos en 24 horas con una idea concreta y un presupuesto claro.",
    ctaContact: "Contáctanos",
    ctaPricing: "Ver precios",
    discover: "Ver el servicio →",
    otherServices: "Otros servicios",
  },
};

/** The /servizi hub. */
export const SERVICES_HUB: Record<
  Locale,
  {
    title: string;
    description: string;
    h1: string;
    h1Highlight: string;
    lead: string;
    body: string[];
  }
> = {
  it: {
    title: "Servizi Web Design Bolzano — Siti per Hotel, Ristoranti e Aziende",
    description:
      "Siti web su misura a Bolzano e in Alto Adige: siti per hotel, ristoranti, aziende e professionisti, e-commerce. Design premium, SEO e prenotazioni online.",
    h1: "Siti web su misura per ",
    h1Highlight: "ogni settore.",
    lead: "Progettiamo e sviluppiamo siti web a Bolzano e in tutto l'Alto Adige, con un approccio diverso per ogni tipo di attività: un hotel ha bisogno di prenotazioni dirette, un ristorante di farsi trovare e riempire i tavoli, un'azienda di trasmettere fiducia e generare contatti.",
    body: [
      "Aura Web Studio è il nome sotto cui lavorano tre professionisti indipendenti tra design e sviluppo. Ogni progetto parte da zero: niente template, niente temi riciclati. Scriviamo il codice su misura con tecnologie moderne come Next.js e React, così il sito è veloce, sicuro e pronto per Google fin dal primo giorno.",
      "Ogni sito include design responsive per smartphone, ottimizzazione SEO di base, versioni multilingua quando servono (italiano, tedesco, inglese) e la messa online sul tuo dominio. Qui sotto trovi i servizi principali: scegli quello più vicino alla tua attività per vedere come lavoriamo e i progetti già realizzati.",
    ],
  },
  de: {
    title: "Leistungen Webdesign Bozen — Webseiten für Hotels, Restaurants und Unternehmen",
    description:
      "Maßgeschneiderte Webseiten in Bozen und Südtirol: für Hotels, Restaurants, Unternehmen und Freiberufler sowie Onlineshops. Premium-Design, SEO und Online-Buchung.",
    h1: "Maßgeschneiderte Webseiten für ",
    h1Highlight: "jede Branche.",
    lead: "Wir gestalten und entwickeln Webseiten in Bozen und ganz Südtirol, mit einem eigenen Ansatz für jede Art von Betrieb: Ein Hotel braucht Direktbuchungen, ein Restaurant muss gefunden werden und die Tische füllen, ein Unternehmen muss Vertrauen schaffen und Anfragen generieren.",
    body: [
      "Aura Web Studio ist der gemeinsame Name von drei selbstständigen Profis aus Design und Entwicklung. Jedes Projekt beginnt bei null: keine Templates, keine wiederverwendeten Themes. Wir programmieren individuell mit modernen Technologien wie Next.js und React – die Webseite ist schnell, sicher und vom ersten Tag an bereit für Google.",
      "Jede Webseite umfasst responsives Design für Smartphones, grundlegende SEO-Optimierung, mehrsprachige Versionen bei Bedarf (Deutsch, Italienisch, Englisch) und die Veröffentlichung auf deiner Domain. Unten findest du unsere wichtigsten Leistungen – wähle die, die zu deinem Betrieb passt.",
    ],
  },
  en: {
    title: "Web Design Services Bolzano — Websites for Hotels, Restaurants and Businesses",
    description:
      "Bespoke websites in Bolzano and South Tyrol: for hotels, restaurants, businesses and professionals, plus e-commerce. Premium design, SEO and online booking.",
    h1: "Bespoke websites for ",
    h1Highlight: "every sector.",
    lead: "We design and build websites in Bolzano and across South Tyrol, with a different approach for every kind of business: a hotel needs direct bookings, a restaurant needs to be found and fill its tables, a company needs to build trust and generate enquiries.",
    body: [
      "Aura Web Studio is the shared name of three independent professionals in design and development. Every project starts from scratch: no templates, no recycled themes. We write custom code with modern technologies such as Next.js and React, so your site is fast, secure and ready for Google from day one.",
      "Every website includes responsive design for smartphones, core SEO, multilingual versions when needed (Italian, German, English) and launch on your own domain. Below are our main services: pick the one closest to your business.",
    ],
  },
  es: {
    title: "Servicios de Diseño Web Bolzano — Webs para Hoteles, Restaurantes y Empresas",
    description:
      "Webs a medida en Bolzano y el Alto Adigio: para hoteles, restaurantes, empresas y profesionales, y tiendas online. Diseño premium, SEO y reservas online.",
    h1: "Webs a medida para ",
    h1Highlight: "cada sector.",
    lead: "Diseñamos y desarrollamos webs en Bolzano y en todo el Alto Adigio, con un enfoque distinto para cada tipo de negocio: un hotel necesita reservas directas, un restaurante necesita que lo encuentren y llenar mesas, una empresa necesita generar confianza y contactos.",
    body: [
      "Aura Web Studio es el nombre compartido de tres profesionales independientes de diseño y desarrollo. Cada proyecto empieza de cero: sin plantillas ni temas reciclados. Escribimos código a medida con tecnologías modernas como Next.js y React, para que tu web sea rápida, segura y esté lista para Google desde el primer día.",
      "Cada web incluye diseño responsive, SEO básico, versiones multilingües cuando hacen falta (italiano, alemán, inglés) y la publicación en tu dominio. Abajo tienes nuestros servicios principales.",
    ],
  },
};

export const SERVICES: Service[] = [
  {
    slug: "siti-web-hotel",
    categories: ["hotel"],
    copy: {
      it: {
        title: "Siti Web per Hotel in Alto Adige — Prenotazioni Dirette",
        description:
          "Siti web per hotel, B&B, residence e campeggi in Alto Adige: design premium, booking engine integrato, multilingua IT/DE/EN e SEO per aumentare le prenotazioni dirette.",
        name: "Siti web per hotel",
        h1: "Siti web per hotel che portano ",
        h1Highlight: "prenotazioni dirette.",
        lead: "Realizziamo siti per hotel, B&B, residence, agriturismi e campeggi in Alto Adige e Trentino. L'obiettivo è uno solo: far scegliere la tua struttura e farla prenotare direttamente dal tuo sito, senza lasciare il 15–20% di commissione ai portali.",
        sections: [
          {
            h2: "Perché un hotel ha bisogno di un sito su misura",
            body: [
              "Chi prenota una vacanza confronta decine di strutture in pochi minuti, quasi sempre dallo smartphone. Le foto, la velocità di caricamento e la chiarezza delle informazioni decidono se resta sul tuo sito o torna su Booking. Un sito costruito su misura racconta l'atmosfera della tua struttura, il territorio intorno e ciò che ti rende diverso, invece di sembrare uguale a mille altri.",
              "In Alto Adige c'è un dettaglio in più: i tuoi ospiti parlano italiano, tedesco e inglese. Per questo ogni sito per hotel che realizziamo nasce multilingua, con testi pensati per ogni mercato e non semplicemente tradotti.",
            ],
          },
          {
            h2: "Prenotazioni dirette e booking engine",
            body: [
              "Colleghiamo il sito al tuo motore di prenotazione (come quelli già usati dagli hotel altoatesini) oppure prepariamo un modulo di richiesta disponibilità semplice e veloce. Camere, prezzi, offerte stagionali e pacchetti sono sempre in primo piano, con pulsanti di prenotazione visibili in ogni pagina.",
              'Lavoriamo anche sulla visibilità: struttura SEO per le ricerche locali ("hotel Merano con spa", "campeggio Lana"), dati strutturati per Google e collegamento con il profilo Google Business della struttura.',
            ],
          },
        ],
        points: [
          {
            title: "Design fotografico",
            text: "Gallerie e video che mostrano camere, spa e panorami al meglio.",
          },
          {
            title: "Multilingua IT · DE · EN",
            text: "Testi curati per ogni mercato, con hreflang corretti per Google.",
          },
          {
            title: "Booking engine",
            text: "Integrazione con il tuo sistema di prenotazione o richiesta disponibilità.",
          },
          {
            title: "Offerte e pacchetti",
            text: "Sezioni per offerte stagionali, eventi e last minute, facili da aggiornare.",
          },
          {
            title: "SEO locale",
            text: "Ottimizzazione per le ricerche della tua zona e dati strutturati per hotel.",
          },
          {
            title: "Velocità su mobile",
            text: "Caricamento rapido anche con molte foto, dove si decide la prenotazione.",
          },
        ],
        faqs: [
          {
            q: "Quanto costa un sito web per un hotel?",
            a: "Dipende dal numero di camere, lingue e integrazioni. I nostri piani partono da 2.000 €; un sito per hotel multilingua con booking engine rientra di solito nel piano Professional o Premium. Ti facciamo un preventivo preciso dopo una prima chiamata.",
          },
          {
            q: "Potete collegare il mio motore di prenotazione attuale?",
            a: "Sì. Integriamo il booking engine che usi già, così le disponibilità restano gestite in un unico posto e il cliente prenota senza lasciare il tuo sito.",
          },
          {
            q: "In quanto tempo è pronto il sito?",
            a: "Per un sito hotel servono di solito dalle 3 alle 6 settimane, in base ai contenuti (foto, testi, lingue) e alle integrazioni richieste.",
          },
          {
            q: "Il sito sarà in tedesco e in inglese?",
            a: "Sì, ogni sito per hotel nasce multilingua. Curiamo le versioni italiana, tedesca e inglese, e possiamo aggiungerne altre se lavori con mercati specifici.",
          },
        ],
      },
      de: {
        title: "Hotel-Webseiten in Südtirol — Mehr Direktbuchungen",
        description:
          "Webseiten für Hotels, B&Bs, Residences und Campingplätze in Südtirol: Premium-Design, integrierte Buchungsmaschine, mehrsprachig DE/IT/EN und SEO für mehr Direktbuchungen.",
        name: "Webseiten für Hotels",
        h1: "Hotel-Webseiten, die ",
        h1Highlight: "Direktbuchungen bringen.",
        lead: "Wir gestalten Webseiten für Hotels, B&Bs, Residences, Urlaub auf dem Bauernhof und Campingplätze in Südtirol und im Trentino. Das Ziel ist klar: Gäste sollen sich für deinen Betrieb entscheiden und direkt auf deiner Webseite buchen – ohne 15–20 % Provision an Buchungsportale.",
        sections: [
          {
            h2: "Warum ein Hotel eine maßgeschneiderte Webseite braucht",
            body: [
              "Wer einen Urlaub bucht, vergleicht in wenigen Minuten Dutzende Unterkünfte – fast immer auf dem Smartphone. Bilder, Ladezeit und klare Informationen entscheiden, ob der Gast bleibt oder zu Booking zurückkehrt. Eine individuelle Webseite erzählt die Atmosphäre deines Hauses, die Umgebung und das, was dich besonders macht.",
              "In Südtirol kommt eines hinzu: Deine Gäste sprechen Deutsch, Italienisch und Englisch. Deshalb ist jede Hotel-Webseite, die wir umsetzen, von Anfang an mehrsprachig – mit Texten, die für jeden Markt geschrieben und nicht bloß übersetzt sind.",
            ],
          },
          {
            h2: "Direktbuchungen und Buchungsmaschine",
            body: [
              "Wir binden deine Buchungsmaschine ein oder erstellen ein schnelles Anfrageformular. Zimmer, Preise, saisonale Angebote und Pauschalen stehen immer im Vordergrund, mit sichtbaren Buchungsbuttons auf jeder Seite.",
              "Dazu kommt die Sichtbarkeit: SEO-Struktur für lokale Suchanfragen („Hotel Meran mit Spa“, „Camping Lana“), strukturierte Daten für Google und die Verbindung mit deinem Google-Unternehmensprofil.",
            ],
          },
        ],
        points: [
          {
            title: "Fotografisches Design",
            text: "Galerien und Videos, die Zimmer, Spa und Panorama perfekt zeigen.",
          },
          {
            title: "Mehrsprachig DE · IT · EN",
            text: "Texte für jeden Markt, mit korrekten hreflang-Angaben für Google.",
          },
          {
            title: "Buchungsmaschine",
            text: "Integration deines Buchungssystems oder Verfügbarkeitsanfrage.",
          },
          {
            title: "Angebote und Pauschalen",
            text: "Bereiche für Saisonangebote, Events und Last Minute, leicht zu pflegen.",
          },
          {
            title: "Lokales SEO",
            text: "Optimierung für Suchanfragen in deiner Region und strukturierte Hoteldaten.",
          },
          {
            title: "Schnell am Smartphone",
            text: "Kurze Ladezeiten auch mit vielen Bildern – dort fällt die Buchungsentscheidung.",
          },
        ],
        faqs: [
          {
            q: "Was kostet eine Webseite für ein Hotel?",
            a: "Das hängt von Zimmeranzahl, Sprachen und Integrationen ab. Unsere Pakete beginnen bei 2.000 €; eine mehrsprachige Hotel-Webseite mit Buchungsmaschine liegt meist im Professional- oder Premium-Paket. Nach einem ersten Gespräch erhältst du ein genaues Angebot.",
          },
          {
            q: "Könnt ihr meine bestehende Buchungsmaschine einbinden?",
            a: "Ja. Wir integrieren das Buchungssystem, das du bereits nutzt – die Verfügbarkeiten bleiben an einem Ort und der Gast bucht, ohne deine Webseite zu verlassen.",
          },
          {
            q: "Wie lange dauert die Umsetzung?",
            a: "Eine Hotel-Webseite braucht in der Regel 3 bis 6 Wochen, je nach Inhalten (Fotos, Texte, Sprachen) und Integrationen.",
          },
          {
            q: "Ist die Webseite auf Deutsch, Italienisch und Englisch?",
            a: "Ja, jede Hotel-Webseite ist von Anfang an mehrsprachig. Weitere Sprachen ergänzen wir gern für spezielle Märkte.",
          },
        ],
      },
      en: {
        title: "Hotel Websites in South Tyrol — More Direct Bookings",
        description:
          "Websites for hotels, B&Bs, residences and campsites in South Tyrol: premium design, integrated booking engine, multilingual IT/DE/EN and SEO to grow direct bookings.",
        name: "Hotel websites",
        h1: "Hotel websites that bring ",
        h1Highlight: "direct bookings.",
        lead: "We build websites for hotels, B&Bs, residences, farm stays and campsites in South Tyrol and Trentino. The goal is simple: get guests to choose your property and book directly on your site, instead of leaving 15–20% commission to booking portals.",
        sections: [
          {
            h2: "Why a hotel needs a bespoke website",
            body: [
              "Travellers compare dozens of properties in minutes, almost always on a smartphone. Photos, loading speed and clear information decide whether they stay on your site or go back to Booking. A bespoke website conveys the atmosphere of your property and the area around it, instead of looking like a thousand others.",
              "In South Tyrol your guests speak Italian, German and English, so every hotel website we build is multilingual from the start, with copy written for each market.",
            ],
          },
          {
            h2: "Direct bookings and booking engine",
            body: [
              "We connect your booking engine or build a fast availability request form. Rooms, rates, seasonal offers and packages stay front and centre, with booking buttons on every page — plus local SEO, structured data and your Google Business Profile.",
            ],
          },
        ],
        points: [
          {
            title: "Photographic design",
            text: "Galleries and video that show rooms, spa and views at their best.",
          },
          {
            title: "Multilingual IT · DE · EN",
            text: "Copy for each market, with correct hreflang for Google.",
          },
          {
            title: "Booking engine",
            text: "Integration with your booking system or an availability request.",
          },
          {
            title: "Offers and packages",
            text: "Seasonal offers, events and last-minute deals, easy to update.",
          },
          {
            title: "Local SEO",
            text: "Optimised for searches in your area, with hotel structured data.",
          },
          {
            title: "Fast on mobile",
            text: "Quick loading even with many photos — where bookings are decided.",
          },
        ],
        faqs: [
          {
            q: "How much does a hotel website cost?",
            a: "It depends on rooms, languages and integrations. Our plans start at €2,000; a multilingual hotel site with a booking engine usually falls in the Professional or Premium plan.",
          },
          {
            q: "Can you connect my current booking engine?",
            a: "Yes. We integrate the booking system you already use, so availability stays in one place and guests book without leaving your site.",
          },
          {
            q: "How long does it take?",
            a: "A hotel website usually takes 3 to 6 weeks, depending on content and integrations.",
          },
        ],
      },
      es: {
        title: "Webs para Hoteles en el Alto Adigio — Más Reservas Directas",
        description:
          "Webs para hoteles, B&B, residencias y campings en el Alto Adigio: diseño premium, motor de reservas integrado, multilingüe y SEO para aumentar las reservas directas.",
        name: "Webs para hoteles",
        h1: "Webs para hoteles que traen ",
        h1Highlight: "reservas directas.",
        lead: "Creamos webs para hoteles, B&B, residencias, agroturismos y campings en el Alto Adigio y el Trentino. El objetivo: que los huéspedes elijan tu alojamiento y reserven directamente en tu web, sin dejar un 15–20 % de comisión a los portales.",
        sections: [
          {
            h2: "Por qué un hotel necesita una web a medida",
            body: [
              "Quien reserva unas vacaciones compara decenas de alojamientos en minutos, casi siempre desde el móvil. Las fotos, la velocidad y la claridad deciden si se queda en tu web o vuelve a Booking. Una web a medida transmite la atmósfera de tu alojamiento y del territorio.",
              "En el Alto Adigio tus huéspedes hablan italiano, alemán e inglés: por eso cada web de hotel que hacemos es multilingüe desde el inicio.",
            ],
          },
          {
            h2: "Reservas directas y motor de reservas",
            body: [
              "Conectamos tu motor de reservas o creamos un formulario de disponibilidad rápido. Habitaciones, tarifas, ofertas y paquetes siempre visibles, con SEO local, datos estructurados y tu perfil de Google Business.",
            ],
          },
        ],
        points: [
          {
            title: "Diseño fotográfico",
            text: "Galerías y vídeos que muestran habitaciones, spa y paisajes.",
          },
          {
            title: "Multilingüe IT · DE · EN",
            text: "Textos para cada mercado, con hreflang correcto.",
          },
          {
            title: "Motor de reservas",
            text: "Integración con tu sistema de reservas o solicitud de disponibilidad.",
          },
          {
            title: "Ofertas y paquetes",
            text: "Ofertas de temporada, eventos y last minute, fáciles de actualizar.",
          },
          {
            title: "SEO local",
            text: "Optimización para búsquedas de tu zona y datos estructurados.",
          },
          { title: "Rápida en el móvil", text: "Carga rápida incluso con muchas fotos." },
        ],
        faqs: [
          {
            q: "¿Cuánto cuesta una web para un hotel?",
            a: "Depende de habitaciones, idiomas e integraciones. Nuestros planes empiezan en 2.000 €; una web de hotel multilingüe con motor de reservas suele estar en el plan Professional o Premium.",
          },
          {
            q: "¿Podéis conectar mi motor de reservas actual?",
            a: "Sí. Integramos el sistema que ya usas, para que el huésped reserve sin salir de tu web.",
          },
          {
            q: "¿Cuánto se tarda?",
            a: "Una web de hotel suele necesitar de 3 a 6 semanas, según contenidos e integraciones.",
          },
        ],
      },
    },
  },
  {
    slug: "siti-web-ristoranti",
    categories: ["food"],
    copy: {
      it: {
        title: "Siti Web per Ristoranti a Bolzano — Menu, Prenotazioni e SEO",
        description:
          "Siti web per ristoranti, pizzerie, bar ed enoteche a Bolzano e in Alto Adige: menu digitale, prenotazione tavoli online, Google Maps e SEO locale per riempire i tavoli.",
        name: "Siti web per ristoranti",
        h1: "Siti web per ristoranti che ",
        h1Highlight: "riempiono i tavoli.",
        lead: 'Realizziamo siti per ristoranti, pizzerie, osterie, bar, enoteche e locali a Bolzano, Merano e in tutto l\'Alto Adige. Un sito pensato per chi cerca "dove mangiare" dal telefono: menu chiaro, foto che fanno venire fame e un pulsante per prenotare o chiamare subito.',
        sections: [
          {
            h2: "Farsi trovare quando qualcuno cerca dove mangiare",
            body: [
              "La maggior parte dei clienti sceglie un ristorante cercando su Google o su Maps, spesso a pochi minuti da quando vuole sedersi a tavola. Per questo un sito per ristorante deve caricarsi in un attimo, mostrare subito menu, orari e posizione, e far prenotare in due tocchi.",
              'Curiamo la SEO locale ("ristorante Bolzano centro", "pizzeria Merano", "enoteca Alto Adige"), i dati strutturati con orari e tipo di cucina e il collegamento con il profilo Google Business, così il ristorante compare nel posto giusto con le informazioni giuste.',
            ],
          },
          {
            h2: "Menu digitale, prenotazioni ed eventi",
            body: [
              "Il menu è una pagina vera, leggibile e indicizzabile da Google, non un PDF sfocato. Puoi aggiornare piatti, prezzi e carta dei vini quando vuoi. Integriamo la prenotazione tavoli online, il pulsante WhatsApp o la chiamata diretta, e sezioni per serate a tema, eventi e menu del giorno.",
            ],
          },
        ],
        points: [
          {
            title: "Menu online",
            text: "Menu e carta vini sempre aggiornati, leggibili e trovabili su Google.",
          },
          {
            title: "Prenotazione tavoli",
            text: "Modulo, WhatsApp o sistema di prenotazione integrato.",
          },
          {
            title: "SEO locale e Maps",
            text: "Orari, posizione e cucina ottimizzati per le ricerche nella tua città.",
          },
          {
            title: "Foto che vendono",
            text: "Piatti e locale in primo piano, con caricamento veloce.",
          },
          { title: "Eventi e serate", text: "Sezioni per eventi, degustazioni e menu stagionali." },
          {
            title: "Multilingua",
            text: "Italiano, tedesco e inglese per clienti locali e turisti.",
          },
        ],
        faqs: [
          {
            q: "Quanto costa un sito per un ristorante?",
            a: "Un sito per ristorante con menu e prenotazioni parte di solito dal piano Base (2.000 €). Se servono più lingue, eventi o integrazioni particolari si passa al Professional. Il preventivo è sempre chiaro prima di iniziare.",
          },
          {
            q: "Posso aggiornare il menu da solo?",
            a: "Sì, prepariamo il sito in modo che menu, prezzi ed eventi si possano aggiornare facilmente. Se preferisci, ce ne occupiamo noi.",
          },
          {
            q: "Il sito aiuta a comparire su Google Maps?",
            a: "Il sito lavora insieme al profilo Google Business: con dati coerenti, SEO locale e dati strutturati aumenta la probabilità di comparire nelle ricerche locali e su Maps.",
          },
        ],
      },
      de: {
        title: "Webseiten für Restaurants in Bozen — Speisekarte, Reservierung, SEO",
        description:
          "Webseiten für Restaurants, Pizzerien, Bars und Vinotheken in Bozen und Südtirol: digitale Speisekarte, Online-Tischreservierung, Google Maps und lokales SEO.",
        name: "Webseiten für Restaurants",
        h1: "Restaurant-Webseiten, die ",
        h1Highlight: "die Tische füllen.",
        lead: "Wir gestalten Webseiten für Restaurants, Pizzerien, Gasthäuser, Bars, Vinotheken und Lokale in Bozen, Meran und ganz Südtirol. Gemacht für Gäste, die am Handy suchen, wo sie essen gehen: klare Speisekarte, Bilder, die Appetit machen, und ein Button zum sofortigen Reservieren oder Anrufen.",
        sections: [
          {
            h2: "Gefunden werden, wenn jemand ein Restaurant sucht",
            body: [
              "Die meisten Gäste wählen ein Restaurant über Google oder Maps – oft nur Minuten, bevor sie sich an den Tisch setzen wollen. Eine Restaurant-Webseite muss deshalb sofort laden, Speisekarte, Öffnungszeiten und Lage direkt zeigen und das Reservieren mit zwei Klicks ermöglichen.",
              "Wir kümmern uns um lokales SEO („Restaurant Bozen Zentrum“, „Pizzeria Meran“, „Vinothek Südtirol“), strukturierte Daten mit Öffnungszeiten und Küche sowie die Verbindung mit deinem Google-Unternehmensprofil.",
            ],
          },
          {
            h2: "Digitale Speisekarte, Reservierungen und Events",
            body: [
              "Die Speisekarte ist eine echte, lesbare und von Google indexierbare Seite – kein unscharfes PDF. Gerichte, Preise und Weinkarte lassen sich jederzeit anpassen. Dazu Online-Tischreservierung, WhatsApp-Button oder Direktanruf und Bereiche für Themenabende, Events und Tagesmenüs.",
            ],
          },
        ],
        points: [
          {
            title: "Speisekarte online",
            text: "Speise- und Weinkarte immer aktuell, lesbar und bei Google auffindbar.",
          },
          {
            title: "Tischreservierung",
            text: "Formular, WhatsApp oder integriertes Reservierungssystem.",
          },
          {
            title: "Lokales SEO und Maps",
            text: "Öffnungszeiten, Lage und Küche optimiert für Suchen in deiner Stadt.",
          },
          {
            title: "Bilder, die verkaufen",
            text: "Gerichte und Lokal im Mittelpunkt, mit schneller Ladezeit.",
          },
          {
            title: "Events und Abende",
            text: "Bereiche für Events, Verkostungen und saisonale Menüs.",
          },
          {
            title: "Mehrsprachig",
            text: "Deutsch, Italienisch und Englisch für Einheimische und Touristen.",
          },
        ],
        faqs: [
          {
            q: "Was kostet eine Restaurant-Webseite?",
            a: "Eine Restaurant-Webseite mit Speisekarte und Reservierung beginnt meist beim Basis-Paket (2.000 €). Für mehrere Sprachen, Events oder besondere Integrationen wählt man das Professional-Paket.",
          },
          {
            q: "Kann ich die Speisekarte selbst ändern?",
            a: "Ja, wir bauen die Webseite so, dass Speisekarte, Preise und Events einfach aktualisiert werden können – oder wir übernehmen das für dich.",
          },
          {
            q: "Hilft die Webseite bei Google Maps?",
            a: "Die Webseite arbeitet mit deinem Google-Unternehmensprofil zusammen: Mit stimmigen Daten, lokalem SEO und strukturierten Daten steigen die Chancen, in lokalen Suchen und auf Maps zu erscheinen.",
          },
        ],
      },
      en: {
        title: "Restaurant Websites in Bolzano — Menu, Bookings and SEO",
        description:
          "Websites for restaurants, pizzerias, bars and wine bars in Bolzano and South Tyrol: digital menu, online table booking, Google Maps and local SEO.",
        name: "Restaurant websites",
        h1: "Restaurant websites that ",
        h1Highlight: "fill the tables.",
        lead: "We build websites for restaurants, pizzerias, bars and wine bars in Bolzano, Merano and across South Tyrol — made for people searching on their phone for where to eat: a clear menu, mouth-watering photos and a button to book or call straight away.",
        sections: [
          {
            h2: "Get found when people search for where to eat",
            body: [
              "Most diners choose a restaurant on Google or Maps, often minutes before they want to sit down. A restaurant site has to load instantly, show menu, opening hours and location, and allow booking in two taps — backed by local SEO, structured data and your Google Business Profile.",
              "Your menu becomes a real, indexable page rather than a blurry PDF, easy to update, with table booking, WhatsApp or direct call, and sections for events and daily specials.",
            ],
          },
        ],
        points: [
          {
            title: "Online menu",
            text: "Menu and wine list always up to date and findable on Google.",
          },
          { title: "Table booking", text: "Form, WhatsApp or an integrated booking system." },
          {
            title: "Local SEO and Maps",
            text: "Hours, location and cuisine optimised for local searches.",
          },
          { title: "Photos that sell", text: "Dishes and venue up front, with fast loading." },
        ],
        faqs: [
          {
            q: "How much does a restaurant website cost?",
            a: "A restaurant website with menu and bookings usually starts from the Base plan (€2,000); more languages or integrations move it to Professional.",
          },
          {
            q: "Can I update the menu myself?",
            a: "Yes, the site is built so menu, prices and events are easy to update — or we can do it for you.",
          },
        ],
      },
      es: {
        title: "Webs para Restaurantes en Bolzano — Carta, Reservas y SEO",
        description:
          "Webs para restaurantes, pizzerías, bares y vinotecas en Bolzano y el Alto Adigio: carta digital, reserva de mesas online, Google Maps y SEO local.",
        name: "Webs para restaurantes",
        h1: "Webs para restaurantes que ",
        h1Highlight: "llenan las mesas.",
        lead: "Creamos webs para restaurantes, pizzerías, bares y vinotecas en Bolzano, Merano y todo el Alto Adigio, pensadas para quien busca dónde comer desde el móvil: carta clara, fotos que abren el apetito y un botón para reservar o llamar.",
        sections: [
          {
            h2: "Que te encuentren cuando buscan dónde comer",
            body: [
              "La mayoría de los clientes elige restaurante en Google o Maps, a menudo minutos antes de sentarse. La web debe cargar al instante, mostrar carta, horarios y ubicación y permitir reservar en dos toques, con SEO local, datos estructurados y tu perfil de Google Business.",
              "La carta es una página real e indexable, no un PDF borroso, fácil de actualizar, con reserva de mesas, WhatsApp y secciones para eventos.",
            ],
          },
        ],
        points: [
          {
            title: "Carta online",
            text: "Carta y vinos siempre actualizados y visibles en Google.",
          },
          {
            title: "Reserva de mesas",
            text: "Formulario, WhatsApp o sistema de reservas integrado.",
          },
          {
            title: "SEO local y Maps",
            text: "Horarios, ubicación y cocina optimizados para búsquedas locales.",
          },
          { title: "Fotos que venden", text: "Platos y local en primer plano, con carga rápida." },
        ],
        faqs: [
          {
            q: "¿Cuánto cuesta una web para un restaurante?",
            a: "Una web con carta y reservas suele partir del plan Base (2.000 €); con más idiomas o integraciones, del Professional.",
          },
          {
            q: "¿Puedo actualizar la carta yo mismo?",
            a: "Sí, la web está pensada para actualizar carta, precios y eventos fácilmente, o lo hacemos nosotros.",
          },
        ],
      },
    },
  },
  {
    slug: "siti-web-aziende",
    categories: ["business", "energy", "automotive", "legal", "beauty"],
    copy: {
      it: {
        title: "Siti Web per Aziende e Professionisti a Bolzano",
        description:
          "Siti web aziendali e per professionisti a Bolzano e in Alto Adige: siti vetrina su misura per aziende, studi legali, officine, saloni e artigiani, ottimizzati per Google e per generare contatti.",
        name: "Siti web per aziende e professionisti",
        h1: "Siti web per aziende che ",
        h1Highlight: "generano contatti.",
        lead: "Realizziamo siti vetrina e siti aziendali per imprese, artigiani, studi legali, officine, parrucchieri e professionisti a Bolzano, Laives, Merano e in tutto l'Alto Adige. Un sito che spiega in pochi secondi cosa fai, perché fidarsi di te e come contattarti.",
        sections: [
          {
            h2: "Il sito come primo biglietto da visita",
            body: [
              "Prima di chiamarti, quasi tutti i potenziali clienti guardano il tuo sito. Se è lento, datato o confuso, scelgono un concorrente. Un sito aziendale su misura presenta servizi, lavori realizzati, certificazioni e recensioni in modo chiaro, e accompagna il visitatore fino alla richiesta di preventivo.",
              "Lavoriamo con aziende di settori molto diversi: industria ed energia, automotive e officine, studi legali, beauty e barber. Ogni sito parte da come i tuoi clienti cercano e scelgono, non da un modello preconfezionato.",
            ],
          },
          {
            h2: "Pensato per Google e per le richieste di contatto",
            body: [
              'Ogni pagina servizio è ottimizzata per le ricerche della tua zona ("officina Laives", "avvocato Bolzano", "impianti fotovoltaici Alto Adige"), con titoli, testi e dati strutturati corretti. Moduli di contatto semplici, pulsante di chiamata e WhatsApp, prenotazione appuntamenti quando serve.',
              "Il sito è tuo: dominio, contenuti e codice restano di tua proprietà, e ti seguiamo anche dopo la messa online per aggiornamenti e nuove sezioni.",
            ],
          },
        ],
        points: [
          {
            title: "Sito vetrina su misura",
            text: "Servizi, chi siamo, lavori e contatti con un design curato.",
          },
          {
            title: "Generazione contatti",
            text: "Moduli, chiamata, WhatsApp e richiesta preventivo in evidenza.",
          },
          {
            title: "Prenotazione online",
            text: "Appuntamenti, tagliandi o consulenze prenotabili dal sito.",
          },
          {
            title: "SEO locale",
            text: "Pagine ottimizzate per le ricerche nella tua città e nel tuo settore.",
          },
          { title: "Multilingua", text: "Italiano e tedesco per tutto il mercato altoatesino." },
          {
            title: "Assistenza continua",
            text: "Aggiornamenti e nuove sezioni anche dopo il lancio.",
          },
        ],
        faqs: [
          {
            q: "Quanto costa un sito vetrina per un'azienda?",
            a: "Il piano Base parte da 2.000 € e copre un sito vetrina completo; per più pagine servizio, lingue o funzioni (prenotazioni, area riservata) si passa al Professional (4.500 €) o al Premium.",
          },
          {
            q: "Il sito sarà ottimizzato per Google?",
            a: "Sì: struttura delle pagine, titoli, descrizioni, velocità, dati strutturati e sitemap sono inclusi in ogni progetto.",
          },
          {
            q: "Chi è il proprietario del sito?",
            a: "Tu. Dominio, testi, immagini e codice restano di tua proprietà.",
          },
        ],
      },
      de: {
        title: "Webseiten für Unternehmen und Freiberufler in Bozen",
        description:
          "Firmenwebseiten in Bozen und Südtirol: individuelle Webseiten für Unternehmen, Kanzleien, Werkstätten, Salons und Handwerker – optimiert für Google und neue Anfragen.",
        name: "Webseiten für Unternehmen",
        h1: "Firmenwebseiten, die ",
        h1Highlight: "Anfragen bringen.",
        lead: "Wir erstellen Firmenwebseiten für Unternehmen, Handwerker, Kanzleien, Werkstätten, Friseure und Freiberufler in Bozen, Leifers, Meran und ganz Südtirol. Eine Webseite, die in wenigen Sekunden zeigt, was du machst, warum man dir vertrauen kann und wie man dich erreicht.",
        sections: [
          {
            h2: "Die Webseite als erste Visitenkarte",
            body: [
              "Bevor sie anrufen, schauen sich fast alle potenziellen Kunden deine Webseite an. Ist sie langsam, veraltet oder unübersichtlich, entscheiden sie sich für die Konkurrenz. Eine maßgeschneiderte Firmenwebseite stellt Leistungen, Referenzen und Bewertungen klar dar und führt den Besucher bis zur Anfrage.",
              "Wir arbeiten für ganz unterschiedliche Branchen: Industrie und Energie, Automotive und Werkstätten, Kanzleien, Beauty und Barber. Jede Webseite beginnt damit, wie deine Kunden suchen und entscheiden.",
            ],
          },
          {
            h2: "Gemacht für Google und für Anfragen",
            body: [
              "Jede Leistungsseite ist für Suchanfragen in deiner Region optimiert („Werkstatt Leifers“, „Rechtsanwalt Bozen“, „Photovoltaik Südtirol“). Einfache Kontaktformulare, Anruf- und WhatsApp-Button, Terminbuchung wenn nötig. Domain, Inhalte und Code gehören dir.",
            ],
          },
        ],
        points: [
          {
            title: "Individuelle Firmenwebseite",
            text: "Leistungen, Über uns, Referenzen und Kontakt mit hochwertigem Design.",
          },
          {
            title: "Neue Anfragen",
            text: "Formulare, Anruf, WhatsApp und Angebotsanfrage gut sichtbar.",
          },
          {
            title: "Online-Terminbuchung",
            text: "Termine, Services oder Beratungen direkt über die Webseite.",
          },
          {
            title: "Lokales SEO",
            text: "Seiten optimiert für Suchen in deiner Stadt und Branche.",
          },
          {
            title: "Zweisprachig",
            text: "Deutsch und Italienisch für den gesamten Südtiroler Markt.",
          },
          { title: "Laufende Betreuung", text: "Updates und neue Bereiche auch nach dem Launch." },
        ],
        faqs: [
          {
            q: "Was kostet eine Firmenwebseite?",
            a: "Das Basis-Paket beginnt bei 2.000 € für eine vollständige Firmenwebseite; für mehr Seiten, Sprachen oder Funktionen gibt es Professional (4.500 €) und Premium.",
          },
          {
            q: "Ist die Webseite für Google optimiert?",
            a: "Ja: Seitenstruktur, Titel, Beschreibungen, Ladezeit, strukturierte Daten und Sitemap sind in jedem Projekt enthalten.",
          },
          {
            q: "Wem gehört die Webseite?",
            a: "Dir. Domain, Texte, Bilder und Code bleiben dein Eigentum.",
          },
        ],
      },
      en: {
        title: "Websites for Businesses and Professionals in Bolzano",
        description:
          "Business websites in Bolzano and South Tyrol: bespoke sites for companies, law firms, garages, salons and craftsmen, optimised for Google and for enquiries.",
        name: "Business websites",
        h1: "Business websites that ",
        h1Highlight: "generate enquiries.",
        lead: "We build business websites for companies, craftsmen, law firms, garages, salons and professionals in Bolzano and across South Tyrol — a site that shows in seconds what you do, why people can trust you and how to reach you.",
        sections: [
          {
            h2: "Your website is your first impression",
            body: [
              "Almost every prospect looks at your website before calling. A bespoke business site presents services, work and reviews clearly and leads visitors to an enquiry, with local SEO, contact forms, call and WhatsApp buttons and online booking when needed. Domain, content and code remain yours.",
            ],
          },
        ],
        points: [
          {
            title: "Bespoke showcase site",
            text: "Services, about, work and contact with a refined design.",
          },
          { title: "Lead generation", text: "Forms, call, WhatsApp and quote requests up front." },
          { title: "Local SEO", text: "Pages optimised for searches in your city and sector." },
          { title: "Ongoing support", text: "Updates and new sections after launch." },
        ],
        faqs: [
          {
            q: "How much does a business website cost?",
            a: "The Base plan starts at €2,000 for a complete showcase site; Professional (€4,500) and Premium cover more pages, languages and features.",
          },
          { q: "Who owns the website?", a: "You do. Domain, copy, images and code remain yours." },
        ],
      },
      es: {
        title: "Webs para Empresas y Profesionales en Bolzano",
        description:
          "Webs corporativas en Bolzano y el Alto Adigio: webs a medida para empresas, despachos, talleres, salones y artesanos, optimizadas para Google y para captar contactos.",
        name: "Webs para empresas",
        h1: "Webs para empresas que ",
        h1Highlight: "generan contactos.",
        lead: "Creamos webs corporativas para empresas, artesanos, despachos de abogados, talleres, peluquerías y profesionales en Bolzano y todo el Alto Adigio: una web que explica en segundos qué haces, por qué confiar en ti y cómo contactarte.",
        sections: [
          {
            h2: "Tu web es tu primera impresión",
            body: [
              "Casi todos los clientes potenciales miran tu web antes de llamar. Una web a medida presenta servicios, trabajos y reseñas con claridad y lleva al visitante hasta la solicitud de presupuesto, con SEO local, formularios, botón de llamada y WhatsApp. El dominio, el contenido y el código son tuyos.",
            ],
          },
        ],
        points: [
          {
            title: "Web corporativa a medida",
            text: "Servicios, quiénes somos, trabajos y contacto.",
          },
          {
            title: "Captación de contactos",
            text: "Formularios, llamada, WhatsApp y presupuesto visibles.",
          },
          { title: "SEO local", text: "Páginas optimizadas para tu ciudad y tu sector." },
          {
            title: "Soporte continuo",
            text: "Actualizaciones y nuevas secciones tras el lanzamiento.",
          },
        ],
        faqs: [
          {
            q: "¿Cuánto cuesta una web corporativa?",
            a: "El plan Base parte de 2.000 € para una web completa; Professional (4.500 €) y Premium cubren más páginas, idiomas y funciones.",
          },
          {
            q: "¿De quién es la web?",
            a: "Tuya. Dominio, textos, imágenes y código son de tu propiedad.",
          },
        ],
      },
    },
  },
  {
    slug: "e-commerce",
    categories: ["digital"],
    copy: {
      it: {
        title: "E-commerce su Misura a Bolzano — Negozi Online Professionali",
        description:
          "Sviluppo e-commerce su misura a Bolzano e in Alto Adige: negozi online veloci, pagamenti sicuri, gestione prodotti e spedizioni, SEO per le schede prodotto e multilingua.",
        name: "E-commerce su misura",
        h1: "E-commerce su misura che ",
        h1Highlight: "vendono davvero.",
        lead: "Sviluppiamo negozi online per aziende, produttori e brand dell'Alto Adige che vogliono vendere in Italia e all'estero. Un e-commerce veloce, facile da usare dal telefono e costruito attorno ai tuoi prodotti, non a un tema standard.",
        sections: [
          {
            h2: "Un negozio online costruito per convertire",
            body: [
              "In un e-commerce ogni secondo di caricamento e ogni passaggio in più nel checkout fanno perdere vendite. Progettiamo schede prodotto chiare, filtri utili, carrello e pagamento in pochi passaggi, con pagamenti sicuri (carta, PayPal, Apple Pay e Google Pay) e gestione di spedizioni e ordini.",
              "Prodotti tipici, vino, artigianato, moda o prodotti tecnici: ogni catalogo ha esigenze diverse, e il negozio viene costruito su quelle.",
            ],
          },
          {
            h2: "Visibilità e vendite all'estero",
            body: [
              "Ottimizziamo categorie e schede prodotto per Google, con dati strutturati per prezzo e disponibilità. Il negozio può essere multilingua (italiano, tedesco, inglese) per raggiungere i clienti del Nord Europa e i turisti che hanno conosciuto i tuoi prodotti in Alto Adige.",
            ],
          },
        ],
        points: [
          {
            title: "Catalogo su misura",
            text: "Schede prodotto, varianti, filtri e ricerca pensati per il tuo catalogo.",
          },
          {
            title: "Pagamenti sicuri",
            text: "Carta, PayPal, Apple Pay e Google Pay con checkout veloce.",
          },
          {
            title: "Ordini e spedizioni",
            text: "Gestione ordini, stati e spedizioni semplice da usare.",
          },
          {
            title: "SEO prodotti",
            text: "Categorie e prodotti ottimizzati per comparire su Google.",
          },
          { title: "Multilingua", text: "Vendi in italiano, tedesco e inglese." },
          {
            title: "Prestazioni",
            text: "Caricamento rapido su mobile, dove avviene la maggior parte degli acquisti.",
          },
        ],
        faqs: [
          {
            q: "Quanto costa un e-commerce su misura?",
            a: "Un e-commerce rientra di solito nel piano Premium (da 7.000 €), perché il costo dipende da numero di prodotti, integrazioni e lingue. Per cataloghi piccoli valutiamo anche soluzioni più leggere.",
          },
          {
            q: "Posso gestire prodotti e ordini da solo?",
            a: "Sì, hai un pannello per aggiungere prodotti, aggiornare prezzi e disponibilità e seguire gli ordini.",
          },
          {
            q: "Quali metodi di pagamento si possono attivare?",
            a: "Carte di credito e debito, PayPal, Apple Pay, Google Pay e bonifico, a seconda delle tue esigenze.",
          },
        ],
      },
      de: {
        title: "Individuelle Onlineshops in Bozen — Professioneller E-Commerce",
        description:
          "Individuelle Onlineshops in Bozen und Südtirol: schnelle Shops, sichere Zahlungen, Produkt- und Versandverwaltung, SEO für Produktseiten und mehrsprachig.",
        name: "Onlineshops nach Maß",
        h1: "Onlineshops nach Maß, die ",
        h1Highlight: "wirklich verkaufen.",
        lead: "Wir entwickeln Onlineshops für Unternehmen, Produzenten und Marken aus Südtirol, die in Italien und im Ausland verkaufen wollen. Ein schneller E-Commerce, einfach am Smartphone zu bedienen und rund um deine Produkte gebaut – nicht um ein Standard-Theme.",
        sections: [
          {
            h2: "Ein Onlineshop, der konvertiert",
            body: [
              "Im E-Commerce kostet jede Sekunde Ladezeit und jeder zusätzliche Schritt im Checkout Umsatz. Wir gestalten klare Produktseiten, sinnvolle Filter, Warenkorb und Bezahlung in wenigen Schritten, mit sicheren Zahlungen (Karte, PayPal, Apple Pay, Google Pay) und Bestell- und Versandverwaltung.",
              "Südtiroler Spezialitäten, Wein, Handwerk, Mode oder technische Produkte: Jeder Katalog hat eigene Anforderungen, und der Shop wird darauf aufgebaut.",
            ],
          },
          {
            h2: "Sichtbarkeit und Verkauf im Ausland",
            body: [
              "Wir optimieren Kategorien und Produktseiten für Google, mit strukturierten Daten für Preis und Verfügbarkeit. Der Shop kann mehrsprachig sein (Deutsch, Italienisch, Englisch), um Kunden in ganz Europa zu erreichen.",
            ],
          },
        ],
        points: [
          {
            title: "Katalog nach Maß",
            text: "Produktseiten, Varianten, Filter und Suche für deinen Katalog.",
          },
          {
            title: "Sichere Zahlungen",
            text: "Karte, PayPal, Apple Pay und Google Pay mit schnellem Checkout.",
          },
          {
            title: "Bestellungen und Versand",
            text: "Einfache Verwaltung von Bestellungen und Versand.",
          },
          { title: "Produkt-SEO", text: "Kategorien und Produkte optimiert für Google." },
          { title: "Mehrsprachig", text: "Verkaufe auf Deutsch, Italienisch und Englisch." },
          {
            title: "Performance",
            text: "Schnelle Ladezeiten am Smartphone, wo die meisten Käufe stattfinden.",
          },
        ],
        faqs: [
          {
            q: "Was kostet ein individueller Onlineshop?",
            a: "Ein Onlineshop liegt meist im Premium-Paket (ab 7.000 €), da der Aufwand von Produktanzahl, Integrationen und Sprachen abhängt. Für kleine Kataloge prüfen wir auch schlankere Lösungen.",
          },
          {
            q: "Kann ich Produkte und Bestellungen selbst verwalten?",
            a: "Ja, du erhältst ein Panel, um Produkte anzulegen, Preise und Verfügbarkeit zu ändern und Bestellungen zu verfolgen.",
          },
        ],
      },
      en: {
        title: "Custom E-commerce in Bolzano — Professional Online Stores",
        description:
          "Custom e-commerce development in Bolzano and South Tyrol: fast online stores, secure payments, product and shipping management, product SEO and multilingual.",
        name: "Custom e-commerce",
        h1: "Custom online stores that ",
        h1Highlight: "actually sell.",
        lead: "We build online stores for South Tyrolean businesses, producers and brands that want to sell in Italy and abroad — fast, easy to use on mobile and built around your products rather than a stock theme.",
        sections: [
          {
            h2: "An online store built to convert",
            body: [
              "Every second of loading and every extra checkout step costs sales. We design clear product pages, useful filters and a short checkout with secure payments (card, PayPal, Apple Pay, Google Pay), plus order and shipping management, product SEO with structured data, and multilingual stores to reach customers across Europe.",
            ],
          },
        ],
        points: [
          {
            title: "Tailored catalogue",
            text: "Product pages, variants, filters and search built for your range.",
          },
          {
            title: "Secure payments",
            text: "Card, PayPal, Apple Pay and Google Pay with fast checkout.",
          },
          { title: "Product SEO", text: "Categories and products optimised for Google." },
          { title: "Multilingual", text: "Sell in Italian, German and English." },
        ],
        faqs: [
          {
            q: "How much does a custom online store cost?",
            a: "An online store usually falls in the Premium plan (from €7,000), depending on products, integrations and languages.",
          },
        ],
      },
      es: {
        title: "E-commerce a Medida en Bolzano — Tiendas Online Profesionales",
        description:
          "Desarrollo de e-commerce a medida en Bolzano y el Alto Adigio: tiendas rápidas, pagos seguros, gestión de productos y envíos, SEO de producto y multilingüe.",
        name: "E-commerce a medida",
        h1: "Tiendas online a medida que ",
        h1Highlight: "venden de verdad.",
        lead: "Desarrollamos tiendas online para empresas, productores y marcas del Alto Adigio que quieren vender en Italia y en el extranjero: rápidas, fáciles de usar en el móvil y construidas alrededor de tus productos.",
        sections: [
          {
            h2: "Una tienda online pensada para convertir",
            body: [
              "Cada segundo de carga y cada paso extra en el checkout cuesta ventas. Diseñamos fichas de producto claras, filtros útiles y un checkout corto con pagos seguros (tarjeta, PayPal, Apple Pay, Google Pay), gestión de pedidos y envíos, SEO de producto y tiendas multilingües.",
            ],
          },
        ],
        points: [
          {
            title: "Catálogo a medida",
            text: "Fichas, variantes, filtros y búsqueda para tu catálogo.",
          },
          { title: "Pagos seguros", text: "Tarjeta, PayPal, Apple Pay y Google Pay." },
          { title: "SEO de producto", text: "Categorías y productos optimizados para Google." },
          { title: "Multilingüe", text: "Vende en italiano, alemán e inglés." },
        ],
        faqs: [
          {
            q: "¿Cuánto cuesta una tienda online a medida?",
            a: "Una tienda online suele estar en el plan Premium (desde 7.000 €), según productos, integraciones e idiomas.",
          },
        ],
      },
    },
  },
];

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
