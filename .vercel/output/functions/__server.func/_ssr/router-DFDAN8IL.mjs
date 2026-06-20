import { Q as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { Q as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { c as createRouter, a as createRootRouteWithContext, u as useRouter, L as Link, O as Outlet, H as HeadContent, S as Scripts, b as createFileRoute, l as lazyRouteComponent } from "../_libs/tanstack__react-router.mjs";
import { r as reactExports, j as jsxRuntimeExports } from "../_libs/react.mjs";
import { i as instance } from "../_libs/i18next.mjs";
import { T as Toaster$1 } from "../_libs/sonner.mjs";
import { i as initReactI18next } from "../_libs/react-i18next.mjs";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
import "../_libs/use-sync-external-store.mjs";
const appCss = "/assets/styles-wj0wvfva.css";
function reportLovableError(error, context = {}) {
  if (typeof window === "undefined") return;
  window.__lovableEvents?.captureException?.(
    error,
    {
      source: "react_error_boundary",
      route: window.location.pathname,
      ...context
    },
    {
      mechanism: "react_error_boundary",
      handled: false,
      severity: "error"
    }
  );
}
const LANGUAGES = [
  { code: "it", label: "Italiano", short: "IT" },
  { code: "de", label: "Deutsch", short: "DE" },
  { code: "en", label: "English", short: "EN" },
  { code: "es", label: "Español", short: "ES" }
];
const DEFAULT_LANGUAGE = "it";
const LANGUAGE_STORAGE_KEY = "aura-lang";
const resources = {
  it: {
    translation: {
      nav: { home: "Home", work: "Lavori", product: "Il Prodotto", team: "Team", contact: "Contatti" },
      hero: { badge: "[ Creative Digital Solutions ]", scroll: "Scorri" },
      projects: {
        selectedWork: "// Selected Work",
        mobileTitle: "Case study cinematici.",
        project: "Progetto",
        caseStudies: "Aura — Case Studies",
        live: "live →",
        items: {
          "01": "Esperienza dark mode per uno shisha bar di lusso, con accenti dorati luminosi, overlay glassmorphici e scie di fumo 3D reattive allo scroll.",
          "02": "Estetica street-pop vibrante guidata da effetti di scroll dinamici, posate cinetiche ed esplosioni di particelle interattive.",
          "03": "Layout di lusso dark-slate impreziosito da fluide piastrelle in parallax e un menu di navigazione premium in vetro smerigliato.",
          "04": "Esperienza per un ristorante fusion italo-indiano costruita su un dark mode editoriale con accenti dorati premium e transizioni cinematiche.",
          "05": "Vetrina per beauty studio in light mode elegante con animazioni fluide, branding cosmetico custom e micro-interazioni.",
          "06": "Sofisticata interfaccia wellness in light mode con layout raffinati, animazioni fluide e un flusso di prenotazione intuitivo e senza intoppi.",
          "07": "Shop online e portfolio per modding FiveM, progettato con immersivi toni dark e blu neon, animazioni fluide e griglie prodotto interattive."
        }
      },
      product: {
        label: "// 03 — Il Prodotto",
        headingPre: "Costruiamo siti ",
        headingHighlight: "su misura",
        headingPost: ".",
        headingLine2: "Dalla landing allo shop.",
        paragraph: "Niente template. Niente compromessi. Ogni progetto nasce dalle tue esigenze: landing che converte, vetrine eleganti, e-commerce performanti o web app custom — sempre con la stessa cura cinematica.",
        morphLabel: "// scroll = morph",
        morphTitlePre: "Una sola filosofia, ",
        morphTitleHighlight: "infinite forme",
        morphParagraph: "Scrolla e guarda come la stessa interfaccia diventa landing, vetrina, shop o web app. È così che lavoriamo: una base solida, modellata su di te.",
        frames: { landing: "Landing", showcase: "Vetrina", shop: "Shop", webapp: "Web App" },
        pricingLabel: "// 03 — Piani e Prezzi",
        pricingHeadingLine1: "Soluzioni su misura.",
        pricingHeadingPre: "Piani ",
        pricingHeadingHighlight: "trasparenti",
        pricingParagraph: "Scegli il piano ideale per portare la tua presenza online a un livello superiore. Dal piccolo sito vetrina per startup ad applicazioni web enterprise customizzate, offriamo prezzi trasparenti e sviluppo d'eccellenza senza compromessi.",
        pricingCta: "Scopri i nostri piani →"
      },
      contact: {
        label: "// 04 — Get in touch",
        headingPre: "Hai in mente qualcosa di ",
        headingHighlight: "più",
        headingPost: "?",
        paragraph: "I nostri piani coprono la maggior parte delle esigenze, ma ogni progetto ambizioso ha le sue. Se cerchi una soluzione su misura, parliamone: costruiamo qualcosa di unico, pensato solo per te. Ti rispondiamo entro 24 ore.",
        callLabel: "Chiamaci",
        teamLabel: "Conosci il team",
        teamCta: "Scopri chi siamo →",
        formName: "Nome della tua attività/progetto",
        formEmail: "Email/PEC",
        formProject: "Il tuo progetto",
        btnIdle: "Lancia il progetto →",
        btnLoading: "Invio in corso…",
        btnSent: "Inviato ✓ — manda un altro",
        errFill: "Compila tutti i campi",
        errSend: "Invio non riuscito. Controlla i dati e riprova.",
        success: "Richiesta inviata. Ti rispondiamo a breve."
      },
      footer: {
        tagline: "Creative Digital Solutions · Made in Italy",
        explore: "Esplora",
        legal: "Legale",
        privacy: "Privacy & Cookie",
        terms: "Termini di Servizio"
      },
      pricing: {
        backHome: "Torna alla Home",
        title: "Piani e Prezzi",
        period: "una tantum",
        base: {
          name: "BASE",
          desc: "Ideale per iniziare e per piccoli team",
          button: "Piano Base",
          features: [
            "Sito web essenziale",
            "Design personalizzato",
            "Supporto multilingua con switch",
            "Design responsive (mobile/tablet/desktop)",
            "Sezione contatti, mappa, click-to-call e link social"
          ]
        },
        professional: {
          name: "Professional",
          desc: "Perfetto per startup e aziende in crescita",
          button: "Scegli Professional",
          features: [
            "Tutto del piano BASE, più:",
            "Dashboard di amministrazione",
            "SEO avanzata",
            "Form contatti con sistema di prenotazione integrato",
            "Sicurezza potenziata",
            "Servizio fotografico professionale — entro 200km"
          ]
        },
        premium: {
          name: "Premium",
          desc: "Per grandi aziende e team con esigenze elevate",
          button: "Scegli Premium",
          features: [
            "Tutto del piano PROFESSIONAL, più:",
            "Funzionalità e-commerce",
            "Sistema di pagamento",
            "CRM integrato",
            "Integrazione con servizi di terze parti",
            "Supporto prioritario",
            "Manutenzione GRATUITA per 1 anno"
          ]
        },
        mostPopular: "Più scelto",
        features: "FEATURES",
        maintenance: {
          badge: "Obbligatorio",
          title: "Manutenzione Mensile",
          desc: "Un canone mensile è richiesto per ogni progetto, indipendentemente dal piano scelto qui sopra. Mantiene il tuo sito sicuro, veloce e sempre aggiornato.",
          from: "da",
          perMonth: "/ mese",
          upTo: "Fino a €200,00 / mese in base a complessità e traffico.",
          included: "INCLUSO",
          items: [
            "Monitoraggio e ottimizzazione SEO",
            "Gestione dominio e hosting",
            "Conformità privacy, cookie e GDPR",
            "Aggiornamenti e monitoraggio sicurezza",
            "Backup regolari e monitoraggio uptime",
            "Aggiornamenti contenuti e supporto tecnico"
          ]
        }
      },
      team: {
        backHome: "Torna alla Home",
        label: "// Il Team",
        titlePre: "Le persone dietro ad ",
        titleHighlight: "Aura",
        subtitle: "Siamo in tre. Pochi, affiatati e ossessionati dai dettagli. Ecco chi siamo e come raggiungerci.",
        call: "Telefono",
        pec: "PEC",
        email: "Email"
      }
    }
  },
  de: {
    translation: {
      nav: { home: "Home", work: "Projekte", product: "Das Produkt", team: "Team", contact: "Kontakt" },
      hero: { badge: "[ Creative Digital Solutions ]", scroll: "Scrollen" },
      projects: {
        selectedWork: "// Ausgewählte Arbeiten",
        mobileTitle: "Filmreife Case Studies.",
        project: "Projekt",
        caseStudies: "Aura — Case Studies",
        live: "live →",
        items: {
          "01": "Dark-Mode-Erlebnis für eine luxuriöse Shisha-Bar mit leuchtenden Goldakzenten, glasartigen Overlays und scroll-reaktiven 3D-Rauchschwaden.",
          "02": "Lebendige Street-Pop-Ästhetik mit dynamischen Scroll-Effekten, kinetischen Besteck-Assets und interaktiven Partikel-Effekten.",
          "03": "Luxuriöses Dark-Slate-Layout mit sanften Parallax-Kacheln und einem edlen Navigationsmenü aus Milchglas.",
          "04": "Erlebnis für ein italienisch-indisches Fusion-Restaurant auf editorialem Dark Mode mit edlen Goldakzenten und filmischen Übergängen.",
          "05": "Eleganter Light-Mode-Auftritt für ein Beauty-Studio mit flüssigen Animationen, individuellem Kosmetik-Branding und Mikrointeraktionen.",
          "06": "Anspruchsvolle Wellness-Oberfläche im Light Mode mit raffinierten Layouts, flüssigen Animationen und einem nahtlosen, nutzerfreundlichen Buchungsablauf.",
          "07": "Online-Shop und Portfolio für FiveM-Modding mit immersiven Dark- und Neonblau-Tönen, flüssigen Animationen und interaktiven Produktrastern."
        }
      },
      product: {
        label: "// 03 — Das Produkt",
        headingPre: "Wir bauen ",
        headingHighlight: "maßgeschneiderte",
        headingPost: " Websites.",
        headingLine2: "Von der Landingpage bis zum Shop.",
        paragraph: "Keine Templates. Keine Kompromisse. Jedes Projekt entsteht aus deinen Anforderungen: Landingpages, die konvertieren, elegante Schaufenster, performante E-Commerce-Shops oder individuelle Web-Apps — immer mit derselben filmischen Sorgfalt.",
        morphLabel: "// scroll = morph",
        morphTitlePre: "Eine Philosophie, ",
        morphTitleHighlight: "unendliche Formen",
        morphParagraph: "Scrolle und sieh, wie dieselbe Oberfläche zu Landingpage, Schaufenster, Shop oder Web-App wird. So arbeiten wir: ein solides Fundament, geformt nach dir.",
        frames: { landing: "Landing", showcase: "Schaufenster", shop: "Shop", webapp: "Web-App" },
        pricingLabel: "// 03 — Pakete & Preise",
        pricingHeadingLine1: "Maßgeschneiderte Lösungen.",
        pricingHeadingPre: "Transparente ",
        pricingHeadingHighlight: "Pakete",
        pricingParagraph: "Wähle das ideale Paket, um deine Online-Präsenz auf ein neues Level zu heben. Von der kleinen Schaufenster-Website für Startups bis zu maßgeschneiderten Enterprise-Web-Apps bieten wir transparente Preise und exzellente Entwicklung ohne Kompromisse.",
        pricingCta: "Entdecke unsere Pakete →"
      },
      contact: {
        label: "// 04 — Kontakt aufnehmen",
        headingPre: "Hast du etwas ",
        headingHighlight: "Größeres",
        headingPost: " im Sinn?",
        paragraph: "Unsere Pakete decken die meisten Anforderungen ab, aber jedes ehrgeizige Projekt hat seine eigenen. Wenn du eine maßgeschneiderte Lösung suchst, lass uns reden: Wir bauen etwas Einzigartiges, nur für dich. Wir antworten innerhalb von 24 Stunden.",
        callLabel: "Ruf uns an",
        teamLabel: "Lerne das Team kennen",
        teamCta: "Erfahre, wer wir sind →",
        formName: "Name deines Unternehmens/Projekts",
        formEmail: "E-Mail/PEC",
        formProject: "Dein Projekt",
        btnIdle: "Projekt starten →",
        btnLoading: "Wird gesendet…",
        btnSent: "Gesendet ✓ — sende eine weitere",
        errFill: "Bitte alle Felder ausfüllen",
        errSend: "Senden fehlgeschlagen. Prüfe die Daten und versuche es erneut.",
        success: "Anfrage gesendet. Wir melden uns in Kürze."
      },
      footer: {
        tagline: "Creative Digital Solutions · Made in Italy",
        explore: "Entdecken",
        legal: "Rechtliches",
        privacy: "Datenschutz & Cookies",
        terms: "Nutzungsbedingungen"
      },
      pricing: {
        backHome: "Zurück zur Startseite",
        title: "Pakete & Preise",
        period: "einmalig",
        base: {
          name: "BASE",
          desc: "Ideal für den Einstieg und kleine Teams",
          button: "Base-Paket",
          features: [
            "Grundlegende Website",
            "Individuelles Design",
            "Mehrsprachigkeit mit Umschalter",
            "Responsive Design (Mobile/Tablet/Desktop)",
            "Kontaktbereich, Karte, Click-to-Call und Social-Links"
          ]
        },
        professional: {
          name: "Professional",
          desc: "Perfekt für wachsende Startups und Unternehmen",
          button: "Professional wählen",
          features: [
            "Alles aus BASE, plus:",
            "Admin-Dashboard",
            "Erweitertes SEO",
            "Kontaktformular mit integriertem Buchungssystem",
            "Erhöhte Sicherheit",
            "Professionelles Fotoshooting — innerhalb 200km"
          ]
        },
        premium: {
          name: "Premium",
          desc: "Für große Unternehmen und Teams mit hohen Ansprüchen",
          button: "Premium wählen",
          features: [
            "Alles aus PROFESSIONAL, plus:",
            "E-Commerce-Funktionalität",
            "Zahlungssystem",
            "Integriertes CRM",
            "Integration mit Drittanbieter-Diensten",
            "Priorisierter Support",
            "KOSTENLOSE Wartung für 1 Jahr"
          ]
        },
        mostPopular: "Am beliebtesten",
        features: "LEISTUNGEN",
        maintenance: {
          badge: "Erforderlich",
          title: "Monatliche Wartung",
          desc: "Ein monatlicher Beitrag ist für jedes Projekt erforderlich, unabhängig vom oben gewählten Paket. Er hält deine Website sicher, schnell und stets aktuell.",
          from: "ab",
          perMonth: "/ Monat",
          upTo: "Bis zu €200,00 / Monat je nach Umfang und Traffic.",
          included: "INKLUSIVE",
          items: [
            "SEO-Monitoring & Optimierung",
            "Domain- und Hosting-Verwaltung",
            "Datenschutz-, Cookie- und DSGVO-Konformität",
            "Sicherheitsupdates & Monitoring",
            "Regelmäßige Backups & Uptime-Monitoring",
            "Content-Updates & technischer Support"
          ]
        }
      },
      team: {
        backHome: "Zurück zur Startseite",
        label: "// Das Team",
        titlePre: "Die Menschen hinter ",
        titleHighlight: "Aura",
        subtitle: "Wir sind zu dritt. Klein, eingespielt und besessen von Details. Hier sind wir und so erreichst du uns.",
        call: "Telefon",
        pec: "PEC",
        email: "E-Mail"
      }
    }
  },
  en: {
    translation: {
      nav: { home: "Home", work: "Work", product: "The Product", team: "Team", contact: "Contact" },
      hero: { badge: "[ Creative Digital Solutions ]", scroll: "Scroll" },
      projects: {
        selectedWork: "// Selected Work",
        mobileTitle: "Cinematic case studies.",
        project: "Project",
        caseStudies: "Aura — Case Studies",
        live: "live →",
        items: {
          "01": "Luxury shisha bar dark mode experience featuring glowing gold accents, glassmorphic overlays, and scroll-reactive 3D smoke trails.",
          "02": "Vibrant street-pop aesthetic driven by dynamic scroll effects, kinetic cutlery assets, and interactive particle bursts.",
          "03": "Dark-slate luxury layout enhanced by smooth parallax tiles and a premium frosted glass navigation menu.",
          "04": "Italian-Indian fusion restaurant experience built on an editorial dark mode with premium gold accents and cinematic transitions.",
          "05": "Elegant light mode beauty studio showcase with fluid animations, custom cosmetics branding, and micro-interactions.",
          "06": "Sophisticated light mode wellness interface featuring refined layouts, fluid animations, and a seamless user-friendly booking flow.",
          "07": "FiveM modding online shop and portfolio engineered with immersive dark and neon-blue tones, fluid animations, and interactive product grids."
        }
      },
      product: {
        label: "// 03 — The Product",
        headingPre: "We build ",
        headingHighlight: "bespoke",
        headingPost: " websites.",
        headingLine2: "From landing page to shop.",
        paragraph: "No templates. No compromises. Every project starts from your needs: landing pages that convert, elegant showcases, high-performance e-commerce or custom web apps — always with the same cinematic care.",
        morphLabel: "// scroll = morph",
        morphTitlePre: "One philosophy, ",
        morphTitleHighlight: "infinite forms",
        morphParagraph: "Scroll and watch the same interface become a landing page, showcase, shop or web app. That's how we work: a solid foundation, shaped around you.",
        frames: { landing: "Landing", showcase: "Showcase", shop: "Shop", webapp: "Web App" },
        pricingLabel: "// 03 — Pricing & Plans",
        pricingHeadingLine1: "Bespoke solutions.",
        pricingHeadingPre: "Transparent ",
        pricingHeadingHighlight: "plans",
        pricingParagraph: "Choose the ideal plan to take your online presence to the next level. From a small showcase site for startups to custom enterprise web apps, we offer transparent pricing and excellence in development without compromise.",
        pricingCta: "Discover our plans →"
      },
      contact: {
        label: "// 04 — Get in touch",
        headingPre: "Got something ",
        headingHighlight: "more",
        headingPost: " in mind?",
        paragraph: "Our plans cover most needs, but every ambitious project has its own. If you're looking for a tailor-made solution, let's talk: we'll build something unique, made just for you. We reply within 24 hours.",
        callLabel: "Call us",
        teamLabel: "Meet the team",
        teamCta: "Discover who we are →",
        formName: "Name of your business/project",
        formEmail: "Email/PEC",
        formProject: "Your project",
        btnIdle: "Launch the project →",
        btnLoading: "Sending…",
        btnSent: "Sent ✓ — send another",
        errFill: "Please fill in all fields",
        errSend: "Sending failed. Check your details and try again.",
        success: "Request sent. We'll get back to you shortly."
      },
      footer: {
        tagline: "Creative Digital Solutions · Made in Italy",
        explore: "Explore",
        legal: "Legal",
        privacy: "Privacy & Cookies",
        terms: "Terms of Service"
      },
      pricing: {
        backHome: "Back to Home",
        title: "Pricing Plans",
        period: "one time",
        base: {
          name: "BASE",
          desc: "Great for getting started and for tiny teams",
          button: "Base Plan",
          features: [
            "Essential website",
            "Custom design",
            "Multi-language support with switch",
            "Responsive design (mobile/tablet/desktop)",
            "Contact section, map, click-to-call and social links"
          ]
        },
        professional: {
          name: "Professional",
          desc: "Best for growing startups and companies",
          button: "Sign up with Professional",
          features: [
            "Everything in BASE, plus:",
            "Admin dashboard",
            "Advanced SEO",
            "Contact form with integrated booking system",
            "Enhanced security",
            "Professional photo shooting — within 200km"
          ]
        },
        premium: {
          name: "Premium",
          desc: "Best for large companies and demanding teams",
          button: "Sign up with Premium",
          features: [
            "Everything in PROFESSIONAL, plus:",
            "E-commerce functionality",
            "Payment system",
            "Integrated CRM",
            "Integration with 3rd-party services",
            "Priority support",
            "FREE maintenance for 1 year"
          ]
        },
        mostPopular: "Most Popular",
        features: "FEATURES",
        maintenance: {
          badge: "Required",
          title: "Monthly Maintenance",
          desc: "A recurring monthly plan is required for every project, regardless of the package chosen above. It keeps your site secure, fast and always up to date.",
          from: "from",
          perMonth: "/ month",
          upTo: "Up to €200,00 / month depending on scope and traffic.",
          included: "INCLUDED",
          items: [
            "SEO monitoring & optimization",
            "Domain & hosting management",
            "Privacy, cookie & GDPR compliance",
            "Security updates & monitoring",
            "Regular backups & uptime monitoring",
            "Content updates & technical support"
          ]
        }
      },
      team: {
        backHome: "Back to Home",
        label: "// The Team",
        titlePre: "The people behind ",
        titleHighlight: "Aura",
        subtitle: "There are three of us. Small, tight-knit and obsessed with detail. Here's who we are and how to reach us.",
        call: "Phone",
        pec: "PEC",
        email: "Email"
      }
    }
  },
  es: {
    translation: {
      nav: { home: "Inicio", work: "Trabajos", product: "El Producto", team: "Equipo", contact: "Contacto" },
      hero: { badge: "[ Creative Digital Solutions ]", scroll: "Desplázate" },
      projects: {
        selectedWork: "// Trabajos seleccionados",
        mobileTitle: "Casos de estudio cinematográficos.",
        project: "Proyecto",
        caseStudies: "Aura — Casos de estudio",
        live: "en vivo →",
        items: {
          "01": "Experiencia en modo oscuro para un bar de shisha de lujo, con destellos dorados, superposiciones glassmorphic y estelas de humo 3D reactivas al scroll.",
          "02": "Estética street-pop vibrante impulsada por efectos de scroll dinámicos, cubiertos cinéticos y estallidos de partículas interactivos.",
          "03": "Diseño de lujo en pizarra oscura realzado con suaves mosaicos en parallax y un menú de navegación premium en vidrio esmerilado.",
          "04": "Experiencia para un restaurante de fusión italo-india construida sobre un modo oscuro editorial con destellos dorados premium y transiciones cinematográficas.",
          "05": "Escaparate de estudio de belleza en modo claro elegante con animaciones fluidas, branding cosmético a medida y microinteracciones.",
          "06": "Sofisticada interfaz de bienestar en modo claro con diseños refinados, animaciones fluidas y un flujo de reservas intuitivo y sin fricciones.",
          "07": "Tienda online y portfolio de modding FiveM, diseñada con inmersivos tonos oscuros y azul neón, animaciones fluidas y cuadrículas de producto interactivas."
        }
      },
      product: {
        label: "// 03 — El Producto",
        headingPre: "Creamos sitios ",
        headingHighlight: "a medida",
        headingPost: ".",
        headingLine2: "De la landing a la tienda.",
        paragraph: "Sin plantillas. Sin compromisos. Cada proyecto nace de tus necesidades: landings que convierten, escaparates elegantes, e-commerce de alto rendimiento o web apps a medida — siempre con el mismo cuidado cinematográfico.",
        morphLabel: "// scroll = morph",
        morphTitlePre: "Una sola filosofía, ",
        morphTitleHighlight: "infinitas formas",
        morphParagraph: "Desplázate y observa cómo la misma interfaz se convierte en landing, escaparate, tienda o web app. Así trabajamos: una base sólida, moldeada a tu medida.",
        frames: { landing: "Landing", showcase: "Escaparate", shop: "Tienda", webapp: "Web App" },
        pricingLabel: "// 03 — Planes y Precios",
        pricingHeadingLine1: "Soluciones a medida.",
        pricingHeadingPre: "Planes ",
        pricingHeadingHighlight: "transparentes",
        pricingParagraph: "Elige el plan ideal para llevar tu presencia online al siguiente nivel. Desde un pequeño sitio escaparate para startups hasta web apps enterprise personalizadas, ofrecemos precios transparentes y excelencia en el desarrollo sin compromisos.",
        pricingCta: "Descubre nuestros planes →"
      },
      contact: {
        label: "// 04 — Ponte en contacto",
        headingPre: "¿Tienes algo ",
        headingHighlight: "más",
        headingPost: " en mente?",
        paragraph: "Nuestros planes cubren la mayoría de las necesidades, pero cada proyecto ambicioso tiene las suyas. Si buscas una solución a medida, hablemos: construiremos algo único, pensado solo para ti. Respondemos en 24 horas.",
        callLabel: "Llámanos",
        teamLabel: "Conoce al equipo",
        teamCta: "Descubre quiénes somos →",
        formName: "Nombre de tu negocio/proyecto",
        formEmail: "Email/PEC",
        formProject: "Tu proyecto",
        btnIdle: "Lanza el proyecto →",
        btnLoading: "Enviando…",
        btnSent: "Enviado ✓ — envía otro",
        errFill: "Rellena todos los campos",
        errSend: "Envío fallido. Revisa los datos e inténtalo de nuevo.",
        success: "Solicitud enviada. Te responderemos en breve."
      },
      footer: {
        tagline: "Creative Digital Solutions · Made in Italy",
        explore: "Explora",
        legal: "Legal",
        privacy: "Privacidad y Cookies",
        terms: "Términos del Servicio"
      },
      pricing: {
        backHome: "Volver al Inicio",
        title: "Planes y Precios",
        period: "pago único",
        base: {
          name: "BASE",
          desc: "Ideal para empezar y para equipos pequeños",
          button: "Plan Base",
          features: [
            "Sitio web esencial",
            "Diseño personalizado",
            "Soporte multilingüe con selector",
            "Diseño responsive (móvil/tablet/escritorio)",
            "Sección de contacto, mapa, click-to-call y enlaces sociales"
          ]
        },
        professional: {
          name: "Professional",
          desc: "Ideal para startups y empresas en crecimiento",
          button: "Elegir Professional",
          features: [
            "Todo lo del plan BASE, más:",
            "Panel de administración",
            "SEO avanzado",
            "Formulario de contacto con sistema de reservas integrado",
            "Seguridad reforzada",
            "Sesión de fotos profesional — dentro de 200km"
          ]
        },
        premium: {
          name: "Premium",
          desc: "Para grandes empresas y equipos exigentes",
          button: "Elegir Premium",
          features: [
            "Todo lo del plan PROFESSIONAL, más:",
            "Funcionalidad e-commerce",
            "Sistema de pago",
            "CRM integrado",
            "Integración con servicios de terceros",
            "Soporte prioritario",
            "Mantenimiento GRATIS durante 1 año"
          ]
        },
        mostPopular: "Más popular",
        features: "CARACTERÍSTICAS",
        maintenance: {
          badge: "Obligatorio",
          title: "Mantenimiento Mensual",
          desc: "Se requiere una cuota mensual para cada proyecto, independientemente del paquete elegido arriba. Mantiene tu sitio seguro, rápido y siempre actualizado.",
          from: "desde",
          perMonth: "/ mes",
          upTo: "Hasta €200,00 / mes según alcance y tráfico.",
          included: "INCLUIDO",
          items: [
            "Monitorización y optimización SEO",
            "Gestión de dominio y hosting",
            "Cumplimiento de privacidad, cookies y RGPD",
            "Actualizaciones de seguridad y monitorización",
            "Copias de seguridad y monitorización de uptime",
            "Actualizaciones de contenido y soporte técnico"
          ]
        }
      },
      team: {
        backHome: "Volver al Inicio",
        label: "// El Equipo",
        titlePre: "Las personas detrás de ",
        titleHighlight: "Aura",
        subtitle: "Somos tres. Pocos, compenetrados y obsesionados con los detalles. Estos somos y así puedes contactarnos.",
        call: "Teléfono",
        pec: "PEC",
        email: "Email"
      }
    }
  }
};
function persistLanguage(code) {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
    } catch {
    }
  }
  void instance.changeLanguage(code);
}
function getStoredLanguage() {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored && LANGUAGES.some((l) => l.code === stored)) {
      return stored;
    }
  } catch {
  }
  return null;
}
if (!instance.isInitialized) {
  instance.use(initReactI18next).init({
    resources,
    lng: DEFAULT_LANGUAGE,
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: { escapeValue: false },
    react: { useSuspense: false }
  });
}
const Toaster = ({ ...props }) => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Toaster$1,
    {
      className: "toaster group",
      toastOptions: {
        classNames: {
          toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
        }
      },
      ...props
    }
  );
};
const SITE_CONFIG = {
  baseUrl: "https://aura-webstudio.com",
  title: "Aura Web Studio — Creative Digital Solutions Made in Italy",
  description: "Award-winning web design and development studio. We craft cinematic digital experiences for Italian hospitality, restaurants, and lifestyle brands using React, Framer Motion, and cutting-edge web technologies.",
  keywords: [
    "web design",
    "web development",
    "React",
    "Framer Motion",
    "digital agency",
    "Italy",
    "hospitality",
    "restaurant website",
    "luxury web design",
    "cinematic web experience",
    "creative digital solutions"
  ],
  author: "Aura Web Studio",
  company: "Aura Web Studio",
  companyEmail: "info@aura-webstudio.com",
  phone: "+39 345 7454180",
  social: {
    instagram: "https://instagram.com/aurawebstudio",
    behance: "https://behance.net/aurawebstudio",
    github: "https://github.com/aurawebstudio",
    twitter: "@aurawebstudio"
  },
  location: {
    country: "Italy",
    city: "Bolzano",
    region: "Trentino-Alto Adige"
  },
  locale: "it_IT",
  alternateLocales: ["en_US", "de_DE"],
  ogImage: "https://aura-webstudio.com/og-image.png",
  ogImageAlt: "Aura Web Studio - Creative Digital Solutions",
  ogImageWidth: 1200,
  ogImageHeight: 630
};
function generateMetaTags(overrides) {
  const title = overrides?.title || SITE_CONFIG.title;
  const description = overrides?.description || SITE_CONFIG.description;
  const canonical = overrides?.canonical || SITE_CONFIG.baseUrl;
  const ogImage = overrides?.ogImage || SITE_CONFIG.ogImage;
  const ogTitle = overrides?.ogTitle || title;
  const ogDescription = overrides?.ogDescription || description;
  return [
    { charSet: "utf-8" },
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover"
    },
    { httpEquiv: "x-ua-compatible", content: "ie=edge" },
    { name: "title", content: title },
    { name: "description", content: description },
    { name: "keywords", content: SITE_CONFIG.keywords.join(", ") },
    { name: "author", content: SITE_CONFIG.author },
    { name: "creator", content: SITE_CONFIG.company },
    { name: "subject", content: SITE_CONFIG.description },
    {
      name: "robots",
      content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
    },
    { name: "googlebot", content: "index, follow" },
    { name: "google-site-verification", content: "" },
    // Add your Google verification code
    { name: "msvalidate.01", content: "" },
    // Add your Bing verification code
    { name: "theme-color", content: "#000000" },
    { name: "color-scheme", content: "dark light" },
    { name: "mobile-web-app-capable", content: "yes" },
    { name: "mobile-web-app-status-bar-style", content: "black-translucent" },
    { name: "apple-mobile-web-app-capable", content: "yes" },
    { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
    { name: "apple-mobile-web-app-title", content: "Aura Studio" },
    { name: "application-name", content: "Aura Studio" },
    { name: "msapplication-starturl", content: "/" },
    { name: "msapplication-TileColor", content: "#000000" },
    { name: "msapplication-config", content: "/browserconfig.xml" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:site", content: SITE_CONFIG.social.twitter },
    { name: "twitter:creator", content: SITE_CONFIG.social.twitter },
    { name: "twitter:title", content: ogTitle },
    { name: "twitter:description", content: ogDescription },
    { name: "twitter:image", content: ogImage },
    { property: "og:type", content: overrides?.type || "website" },
    { property: "og:url", content: canonical },
    { property: "og:title", content: ogTitle },
    { property: "og:description", content: ogDescription },
    { property: "og:image", content: ogImage },
    { property: "og:image:width", content: SITE_CONFIG.ogImageWidth.toString() },
    { property: "og:image:height", content: SITE_CONFIG.ogImageHeight.toString() },
    { property: "og:image:alt", content: SITE_CONFIG.ogImageAlt },
    { property: "og:locale", content: SITE_CONFIG.locale },
    SITE_CONFIG.alternateLocales.map((locale) => ({
      property: "og:locale:alternate",
      content: locale
    }))
  ];
}
function generateLinkTags() {
  return [
    { rel: "canonical", href: SITE_CONFIG.baseUrl },
    { rel: "alternate", hrefLang: "en", href: `${SITE_CONFIG.baseUrl}/en` },
    { rel: "alternate", hrefLang: "de", href: `${SITE_CONFIG.baseUrl}/de` },
    { rel: "alternate", hrefLang: "x-default", href: SITE_CONFIG.baseUrl },
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
    { rel: "dns-prefetch", href: "https://cdn.jsdelivr.net" },
    { rel: "icon", href: "/favicon.ico", sizes: "any" },
    { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
    { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
    { rel: "manifest", href: "/manifest.webmanifest" },
    { rel: "sitemap", type: "application/xml", href: "/sitemap.xml" }
  ];
}
function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": SITE_CONFIG.baseUrl,
    name: SITE_CONFIG.company,
    url: SITE_CONFIG.baseUrl,
    email: SITE_CONFIG.companyEmail,
    telephone: SITE_CONFIG.phone,
    description: SITE_CONFIG.description,
    image: SITE_CONFIG.ogImage,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_CONFIG.baseUrl}/logo.svg`,
      width: 512,
      height: 512
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: SITE_CONFIG.location.country,
      addressRegion: SITE_CONFIG.location.region,
      addressLocality: SITE_CONFIG.location.city
    },
    areaServed: [
      { "@type": "Country", name: "Italy" },
      { "@type": "Country", name: "European Union" }
    ],
    priceRange: "$$$",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      telephone: SITE_CONFIG.phone,
      email: SITE_CONFIG.companyEmail,
      availableLanguage: ["it", "en", "de"]
    },
    sameAs: [SITE_CONFIG.social.instagram, SITE_CONFIG.social.behance, SITE_CONFIG.social.github],
    knowsLanguage: [
      { "@type": "Language", name: "Italian" },
      { "@type": "Language", name: "English" },
      { "@type": "Language", name: "German" }
    ],
    workingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00"
      }
    ]
  };
}
function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_CONFIG.company,
    url: SITE_CONFIG.baseUrl,
    description: SITE_CONFIG.description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_CONFIG.baseUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };
}
function NotFoundComponent() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-7xl font-bold text-foreground", children: "404" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-4 text-xl font-semibold text-foreground", children: "Page not found" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "The page you're looking for doesn't exist or has been moved." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-6", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
        children: "Go home"
      }
    ) })
  ] }) });
}
function ErrorComponent({ error, reset }) {
  console.error(error);
  const router2 = useRouter();
  reactExports.useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex min-h-screen items-center justify-center bg-background px-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-md text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-xl font-semibold tracking-tight text-foreground", children: "This page didn't load" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-sm text-muted-foreground", children: "Something went wrong on our end. You can try refreshing or head back home." }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-6 flex flex-wrap justify-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          onClick: () => {
            router2.invalidate();
            reset();
          },
          className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
          children: "Try again"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "a",
        {
          href: "/",
          className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
          children: "Go home"
        }
      )
    ] })
  ] }) });
}
const Route$5 = createRootRouteWithContext()({
  head: () => ({
    meta: [...generateMetaTags()],
    links: [
      {
        rel: "stylesheet",
        href: appCss
      },
      ...generateLinkTags(),
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
      }
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(generateOrganizationSchema())
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(generateWebsiteSchema())
      }
    ]
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent
});
function RootShell({ children }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("head", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(HeadContent, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("body", { children: [
      children,
      /* @__PURE__ */ jsxRuntimeExports.jsx(Scripts, {})
    ] })
  ] });
}
function RootComponent() {
  const { queryClient } = Route$5.useRouteContext();
  reactExports.useEffect(() => {
    const stored = getStoredLanguage();
    if (stored && stored !== instance.language) {
      void instance.changeLanguage(stored);
    }
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(QueryClientProvider, { client: queryClient, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, { theme: "dark", position: "bottom-right" })
  ] });
}
const $$splitComponentImporter$4 = () => import("./team-DpeyTlpb.mjs");
const Route$4 = createFileRoute("/team")({
  head: () => ({
    meta: [{
      title: "Team — Aura Web Studio"
    }, {
      name: "description",
      content: "Le persone dietro ad Aura Web Studio. Conosci il trio e contattaci direttamente: telefono, PEC ed email."
    }, ...generateMetaTags({
      title: "Team — Aura Web Studio",
      description: "Le persone dietro ad Aura Web Studio."
    })].flat()
  }),
  component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
const $$splitComponentImporter$3 = () => import("./pricing-yd_tgnSH.mjs");
const Route$3 = createFileRoute("/pricing")({
  head: () => ({
    meta: [{
      title: "Piani e Prezzi — Aura Web Studio"
    }, {
      name: "description",
      content: "Scegli il piano ideale per portare il tuo business online. Tariffe trasparenti per landing page, siti vetrina ed e-commerce custom."
    }, ...generateMetaTags({
      title: "Piani e Prezzi — Aura Web Studio",
      description: "Scegli il piano ideale per il tuo business online. Tariffe trasparenti e soluzioni su misura."
    })].flat()
  }),
  component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
const $$splitComponentImporter$2 = () => import("./auth-DpO2o6Gb.mjs");
const Route$2 = createFileRoute("/auth")({
  head: () => ({
    meta: [{
      title: "Admin Login — Aura Web Studio"
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
const $$splitComponentImporter$1 = () => import("./admin-btOgjRJK.mjs");
const Route$1 = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [{
      title: "Admin · Messaggi — Aura Web Studio"
    }, {
      name: "robots",
      content: "noindex"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
const $$splitComponentImporter = () => import("./index-CMvMe99a.mjs");
const Route = createFileRoute("/")({
  head: () => ({
    meta: [{
      title: "Aura Web Studio — Creative Digital Solutions"
    }, {
      name: "description"
    }, {
      property: "og:title",
      content: "Aura Web Studio — Creative Digital Solutions"
    }, {
      property: "og:description",
      content: "Esperienze web cinematiche, animazioni 60fps e design ad alto impatto. Aura Web Studio."
    }, {
      property: "og:type",
      content: "website"
    }, {
      name: "theme-color",
      content: "#000000"
    }]
  }),
  component: lazyRouteComponent($$splitComponentImporter, "component")
});
const TeamRoute = Route$4.update({
  id: "/team",
  path: "/team",
  getParentRoute: () => Route$5
});
const PricingRoute = Route$3.update({
  id: "/pricing",
  path: "/pricing",
  getParentRoute: () => Route$5
});
const AuthRoute = Route$2.update({
  id: "/auth",
  path: "/auth",
  getParentRoute: () => Route$5
});
const AdminRoute = Route$1.update({
  id: "/admin",
  path: "/admin",
  getParentRoute: () => Route$5
});
const IndexRoute = Route.update({
  id: "/",
  path: "/",
  getParentRoute: () => Route$5
});
const rootRouteChildren = {
  IndexRoute,
  AdminRoute,
  AuthRoute,
  PricingRoute,
  TeamRoute
};
const routeTree = Route$5._addFileChildren(rootRouteChildren)._addFileTypes();
const getRouter = () => {
  const queryClient = new QueryClient();
  const router2 = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0
  });
  return router2;
};
const router = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  getRouter
}, Symbol.toStringTag, { value: "Module" }));
export {
  LANGUAGES as L,
  persistLanguage as p,
  router as r
};
