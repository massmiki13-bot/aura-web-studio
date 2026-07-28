import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export const LANGUAGES = [
  { code: "it", label: "Italiano", short: "IT" },
  { code: "de", label: "Deutsch", short: "DE" },
  { code: "en", label: "English", short: "EN" },
  { code: "es", label: "Español", short: "ES" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];

export const DEFAULT_LANGUAGE: LanguageCode = "it";
export const LANGUAGE_STORAGE_KEY = "aura-lang";

const resources = {
  it: {
    translation: {
      nav: {
        home: "Home",
        work: "Lavori",
        product: "Il Prodotto",
        team: "Team",
        contact: "Contatti",
      },
      intro: {
        badge: "Creative Web Studio",
        tagline: "Il tuo brand, elevato",
        skip: "Salta",
      },
      hero: {
        badge: "[ Creative Digital Solutions ]",
        scroll: "Scorri",
        actTwoTitle: "Il tuo brand, elevato.",
        actTwoSub: "Web design su misura per chi non si accontenta.",
        actTwoTitle2: "Estetica che converte.",
        actTwoSub2: "Performance, SEO e conversioni — di serie.",
      },
      services: {
        label: "// Cosa offriamo",
        caption1: "Progettiamo esperienze digitali che lasciano il segno.",
        caption2: "Valore che cresce, progetto dopo progetto.",
      },
      projects: {
        selectedWork: "// Selected Work",
        mobileTitle: "Case study cinematici.",
        prevProject: "Progetto precedente",
        nextProject: "Progetto successivo",
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
          "07": "Shop online e portfolio per modding FiveM, progettato con immersivi toni dark e blu neon, animazioni fluide e griglie prodotto interattive.",
        },
      },
      product: {
        label: "// 03 — Il Prodotto",
        headingPre: "Costruiamo siti ",
        headingHighlight: "su misura",
        headingPost: ".",
        headingLine2: "Dalla landing allo shop.",
        paragraph:
          "Niente template. Niente compromessi. Ogni progetto nasce dalle tue esigenze: landing che converte, vetrine eleganti, e-commerce performanti o web app custom — sempre con la stessa cura cinematica.",
        morphLabel: "// scroll = morph",
        morphTitlePre: "Una sola filosofia, ",
        morphTitleHighlight: "infinite forme",
        morphParagraph:
          "Scrolla e guarda come la stessa interfaccia diventa landing, vetrina, shop o web app. È così che lavoriamo: una base solida, modellata su di te.",
        frames: { landing: "Landing", showcase: "Vetrina", shop: "Shop", webapp: "Web App" },
        pricingLabel: "// 03 — Piani e Prezzi",
        pricingHeadingLine1: "Soluzioni su misura.",
        pricingHeadingPre: "Piani ",
        pricingHeadingHighlight: "trasparenti",
        pricingParagraph:
          "Scegli il piano ideale per portare la tua presenza online a un livello superiore. Dal piccolo sito vetrina per startup ad applicazioni web enterprise customizzate, offriamo prezzi trasparenti e sviluppo d'eccellenza senza compromessi.",
        pricingCta: "Scopri i nostri piani →",
      },
      contact: {
        label: "// 04 — Get in touch",
        headingPre: "Hai in mente qualcosa di ",
        headingHighlight: "più",
        headingPost: "?",
        paragraph:
          "I nostri piani coprono la maggior parte delle esigenze, ma ogni progetto ambizioso ha le sue. Se cerchi una soluzione su misura, parliamone: costruiamo qualcosa di unico, pensato solo per te. Ti rispondiamo entro 24 ore.",
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
        success: "Richiesta inviata. Ti rispondiamo a breve.",
      },
      footer: {
        tagline: "Creative Digital Solutions · Made in Italy",
        explore: "Esplora",
        legal: "Legale",
        privacy: "Privacy & Cookie",
        terms: "Termini di Servizio",
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
            "Sezione contatti, mappa, click-to-call e link social",
          ],
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
            "Servizio fotografico professionale — entro 200km",
          ],
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
            "Manutenzione GRATUITA per 1 anno",
          ],
        },
        mostPopular: "Più scelto",
        features: "FEATURES",
        maintenance: {
          badge: "Obbligatorio",
          title: "Manutenzione Mensile",
          desc: "Un canone mensile è richiesto per ogni progetto, indipendentemente dal piano scelto qui sopra. Mantiene il tuo sito sicuro, veloce e sempre aggiornato.",
          from: "da",
          perMonth: "/ mese",
          upTo: "Fino a €500,00 / mese in base a complessità e traffico.",
          included: "INCLUSO",
          items: [
            "Monitoraggio e ottimizzazione SEO",
            "Gestione dominio e hosting",
            "Conformità privacy, cookie e GDPR",
            "Aggiornamenti e monitoraggio sicurezza",
            "Backup regolari e monitoraggio uptime",
            "Aggiornamenti contenuti e supporto tecnico",
          ],
        },
      },
      team: {
        backHome: "Torna alla Home",
        label: "// Il Team",
        titlePre: "Le persone dietro ad ",
        titleHighlight: "Aura",
        subtitle:
          "Siamo in tre. Pochi, affiatati e ossessionati dai dettagli. Ecco chi siamo e come raggiungerci.",
        call: "Telefono",
        pec: "PEC",
        email: "Email",
      },
    },
  },
  de: {
    translation: {
      nav: {
        home: "Home",
        work: "Projekte",
        product: "Das Produkt",
        team: "Team",
        contact: "Kontakt",
      },
      intro: {
        badge: "Creative Web Studio",
        tagline: "Deine Marke, auf neuem Niveau",
        skip: "Überspringen",
      },
      hero: {
        badge: "[ Creative Digital Solutions ]",
        scroll: "Scrollen",
        actTwoTitle: "Deine Marke, auf neuem Niveau.",
        actTwoSub: "Maßgeschneidertes Webdesign für alle, die sich nicht zufriedengeben.",
        actTwoTitle2: "Ästhetik, die konvertiert.",
        actTwoSub2: "Performance, SEO und Conversions — serienmäßig.",
      },
      services: {
        label: "// Was wir bieten",
        caption1: "Wir gestalten digitale Erlebnisse, die Eindruck hinterlassen.",
        caption2: "Wert, der wächst — Projekt für Projekt.",
      },
      projects: {
        selectedWork: "// Ausgewählte Arbeiten",
        mobileTitle: "Filmreife Case Studies.",
        prevProject: "Vorheriges Projekt",
        nextProject: "Nächstes Projekt",
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
          "07": "Online-Shop und Portfolio für FiveM-Modding mit immersiven Dark- und Neonblau-Tönen, flüssigen Animationen und interaktiven Produktrastern.",
        },
      },
      product: {
        label: "// 03 — Das Produkt",
        headingPre: "Wir bauen ",
        headingHighlight: "maßgeschneiderte",
        headingPost: " Websites.",
        headingLine2: "Von der Landingpage bis zum Shop.",
        paragraph:
          "Keine Templates. Keine Kompromisse. Jedes Projekt entsteht aus deinen Anforderungen: Landingpages, die konvertieren, elegante Schaufenster, performante E-Commerce-Shops oder individuelle Web-Apps — immer mit derselben filmischen Sorgfalt.",
        morphLabel: "// scroll = morph",
        morphTitlePre: "Eine Philosophie, ",
        morphTitleHighlight: "unendliche Formen",
        morphParagraph:
          "Scrolle und sieh, wie dieselbe Oberfläche zu Landingpage, Schaufenster, Shop oder Web-App wird. So arbeiten wir: ein solides Fundament, geformt nach dir.",
        frames: { landing: "Landing", showcase: "Schaufenster", shop: "Shop", webapp: "Web-App" },
        pricingLabel: "// 03 — Pakete & Preise",
        pricingHeadingLine1: "Maßgeschneiderte Lösungen.",
        pricingHeadingPre: "Transparente ",
        pricingHeadingHighlight: "Pakete",
        pricingParagraph:
          "Wähle das ideale Paket, um deine Online-Präsenz auf ein neues Level zu heben. Von der kleinen Schaufenster-Website für Startups bis zu maßgeschneiderten Enterprise-Web-Apps bieten wir transparente Preise und exzellente Entwicklung ohne Kompromisse.",
        pricingCta: "Entdecke unsere Pakete →",
      },
      contact: {
        label: "// 04 — Kontakt aufnehmen",
        headingPre: "Hast du etwas ",
        headingHighlight: "Größeres",
        headingPost: " im Sinn?",
        paragraph:
          "Unsere Pakete decken die meisten Anforderungen ab, aber jedes ehrgeizige Projekt hat seine eigenen. Wenn du eine maßgeschneiderte Lösung suchst, lass uns reden: Wir bauen etwas Einzigartiges, nur für dich. Wir antworten innerhalb von 24 Stunden.",
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
        success: "Anfrage gesendet. Wir melden uns in Kürze.",
      },
      footer: {
        tagline: "Creative Digital Solutions · Made in Italy",
        explore: "Entdecken",
        legal: "Rechtliches",
        privacy: "Datenschutz & Cookies",
        terms: "Nutzungsbedingungen",
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
            "Kontaktbereich, Karte, Click-to-Call und Social-Links",
          ],
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
            "Professionelles Fotoshooting — innerhalb 200km",
          ],
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
            "KOSTENLOSE Wartung für 1 Jahr",
          ],
        },
        mostPopular: "Am beliebtesten",
        features: "LEISTUNGEN",
        maintenance: {
          badge: "Erforderlich",
          title: "Monatliche Wartung",
          desc: "Ein monatlicher Beitrag ist für jedes Projekt erforderlich, unabhängig vom oben gewählten Paket. Er hält deine Website sicher, schnell und stets aktuell.",
          from: "ab",
          perMonth: "/ Monat",
          upTo: "Bis zu €500,00 / Monat je nach Umfang und Traffic.",
          included: "INKLUSIVE",
          items: [
            "SEO-Monitoring & Optimierung",
            "Domain- und Hosting-Verwaltung",
            "Datenschutz-, Cookie- und DSGVO-Konformität",
            "Sicherheitsupdates & Monitoring",
            "Regelmäßige Backups & Uptime-Monitoring",
            "Content-Updates & technischer Support",
          ],
        },
      },
      team: {
        backHome: "Zurück zur Startseite",
        label: "// Das Team",
        titlePre: "Die Menschen hinter ",
        titleHighlight: "Aura",
        subtitle:
          "Wir sind zu dritt. Klein, eingespielt und besessen von Details. Hier sind wir und so erreichst du uns.",
        call: "Telefon",
        pec: "PEC",
        email: "E-Mail",
      },
    },
  },
  en: {
    translation: {
      nav: { home: "Home", work: "Work", product: "The Product", team: "Team", contact: "Contact" },
      intro: {
        badge: "Creative Web Studio",
        tagline: "Your brand, elevated",
        skip: "Skip",
      },
      hero: {
        badge: "[ Creative Digital Solutions ]",
        scroll: "Scroll",
        actTwoTitle: "Your brand, elevated.",
        actTwoSub: "Bespoke web design for those who won't settle.",
        actTwoTitle2: "Design that converts.",
        actTwoSub2: "Performance, SEO and conversions — built in.",
      },
      services: {
        label: "// What we offer",
        caption1: "We design digital experiences that leave a mark.",
        caption2: "Value that grows, project after project.",
      },
      projects: {
        selectedWork: "// Selected Work",
        mobileTitle: "Cinematic case studies.",
        prevProject: "Previous project",
        nextProject: "Next project",
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
          "07": "FiveM modding online shop and portfolio engineered with immersive dark and neon-blue tones, fluid animations, and interactive product grids.",
        },
      },
      product: {
        label: "// 03 — The Product",
        headingPre: "We build ",
        headingHighlight: "bespoke",
        headingPost: " websites.",
        headingLine2: "From landing page to shop.",
        paragraph:
          "No templates. No compromises. Every project starts from your needs: landing pages that convert, elegant showcases, high-performance e-commerce or custom web apps — always with the same cinematic care.",
        morphLabel: "// scroll = morph",
        morphTitlePre: "One philosophy, ",
        morphTitleHighlight: "infinite forms",
        morphParagraph:
          "Scroll and watch the same interface become a landing page, showcase, shop or web app. That's how we work: a solid foundation, shaped around you.",
        frames: { landing: "Landing", showcase: "Showcase", shop: "Shop", webapp: "Web App" },
        pricingLabel: "// 03 — Pricing & Plans",
        pricingHeadingLine1: "Bespoke solutions.",
        pricingHeadingPre: "Transparent ",
        pricingHeadingHighlight: "plans",
        pricingParagraph:
          "Choose the ideal plan to take your online presence to the next level. From a small showcase site for startups to custom enterprise web apps, we offer transparent pricing and excellence in development without compromise.",
        pricingCta: "Discover our plans →",
      },
      contact: {
        label: "// 04 — Get in touch",
        headingPre: "Got something ",
        headingHighlight: "more",
        headingPost: " in mind?",
        paragraph:
          "Our plans cover most needs, but every ambitious project has its own. If you're looking for a tailor-made solution, let's talk: we'll build something unique, made just for you. We reply within 24 hours.",
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
        success: "Request sent. We'll get back to you shortly.",
      },
      footer: {
        tagline: "Creative Digital Solutions · Made in Italy",
        explore: "Explore",
        legal: "Legal",
        privacy: "Privacy & Cookies",
        terms: "Terms of Service",
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
            "Contact section, map, click-to-call and social links",
          ],
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
            "Professional photo shooting — within 200km",
          ],
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
            "FREE maintenance for 1 year",
          ],
        },
        mostPopular: "Most Popular",
        features: "FEATURES",
        maintenance: {
          badge: "Required",
          title: "Monthly Maintenance",
          desc: "A recurring monthly plan is required for every project, regardless of the package chosen above. It keeps your site secure, fast and always up to date.",
          from: "from",
          perMonth: "/ month",
          upTo: "Up to €500,00 / month depending on scope and traffic.",
          included: "INCLUDED",
          items: [
            "SEO monitoring & optimization",
            "Domain & hosting management",
            "Privacy, cookie & GDPR compliance",
            "Security updates & monitoring",
            "Regular backups & uptime monitoring",
            "Content updates & technical support",
          ],
        },
      },
      team: {
        backHome: "Back to Home",
        label: "// The Team",
        titlePre: "The people behind ",
        titleHighlight: "Aura",
        subtitle:
          "There are three of us. Small, tight-knit and obsessed with detail. Here's who we are and how to reach us.",
        call: "Phone",
        pec: "PEC",
        email: "Email",
      },
    },
  },
  es: {
    translation: {
      nav: {
        home: "Inicio",
        work: "Trabajos",
        product: "El Producto",
        team: "Equipo",
        contact: "Contacto",
      },
      intro: {
        badge: "Creative Web Studio",
        tagline: "Tu marca, elevada",
        skip: "Saltar",
      },
      hero: {
        badge: "[ Creative Digital Solutions ]",
        scroll: "Desplázate",
        actTwoTitle: "Tu marca, elevada.",
        actTwoSub: "Diseño web a medida para quienes no se conforman.",
        actTwoTitle2: "Estética que convierte.",
        actTwoSub2: "Rendimiento, SEO y conversiones — de serie.",
      },
      services: {
        label: "// Qué ofrecemos",
        caption1: "Diseñamos experiencias digitales que dejan huella.",
        caption2: "Valor que crece, proyecto a proyecto.",
      },
      projects: {
        selectedWork: "// Trabajos seleccionados",
        mobileTitle: "Casos de estudio cinematográficos.",
        prevProject: "Proyecto anterior",
        nextProject: "Proyecto siguiente",
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
          "07": "Tienda online y portfolio de modding FiveM, diseñada con inmersivos tonos oscuros y azul neón, animaciones fluidas y cuadrículas de producto interactivas.",
        },
      },
      product: {
        label: "// 03 — El Producto",
        headingPre: "Creamos sitios ",
        headingHighlight: "a medida",
        headingPost: ".",
        headingLine2: "De la landing a la tienda.",
        paragraph:
          "Sin plantillas. Sin compromisos. Cada proyecto nace de tus necesidades: landings que convierten, escaparates elegantes, e-commerce de alto rendimiento o web apps a medida — siempre con el mismo cuidado cinematográfico.",
        morphLabel: "// scroll = morph",
        morphTitlePre: "Una sola filosofía, ",
        morphTitleHighlight: "infinitas formas",
        morphParagraph:
          "Desplázate y observa cómo la misma interfaz se convierte en landing, escaparate, tienda o web app. Así trabajamos: una base sólida, moldeada a tu medida.",
        frames: { landing: "Landing", showcase: "Escaparate", shop: "Tienda", webapp: "Web App" },
        pricingLabel: "// 03 — Planes y Precios",
        pricingHeadingLine1: "Soluciones a medida.",
        pricingHeadingPre: "Planes ",
        pricingHeadingHighlight: "transparentes",
        pricingParagraph:
          "Elige el plan ideal para llevar tu presencia online al siguiente nivel. Desde un pequeño sitio escaparate para startups hasta web apps enterprise personalizadas, ofrecemos precios transparentes y excelencia en el desarrollo sin compromisos.",
        pricingCta: "Descubre nuestros planes →",
      },
      contact: {
        label: "// 04 — Ponte en contacto",
        headingPre: "¿Tienes algo ",
        headingHighlight: "más",
        headingPost: " en mente?",
        paragraph:
          "Nuestros planes cubren la mayoría de las necesidades, pero cada proyecto ambicioso tiene las suyas. Si buscas una solución a medida, hablemos: construiremos algo único, pensado solo para ti. Respondemos en 24 horas.",
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
        success: "Solicitud enviada. Te responderemos en breve.",
      },
      footer: {
        tagline: "Creative Digital Solutions · Made in Italy",
        explore: "Explora",
        legal: "Legal",
        privacy: "Privacidad y Cookies",
        terms: "Términos del Servicio",
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
            "Sección de contacto, mapa, click-to-call y enlaces sociales",
          ],
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
            "Sesión de fotos profesional — dentro de 200km",
          ],
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
            "Mantenimiento GRATIS durante 1 año",
          ],
        },
        mostPopular: "Más popular",
        features: "CARACTERÍSTICAS",
        maintenance: {
          badge: "Obligatorio",
          title: "Mantenimiento Mensual",
          desc: "Se requiere una cuota mensual para cada proyecto, independientemente del paquete elegido arriba. Mantiene tu sitio seguro, rápido y siempre actualizado.",
          from: "desde",
          perMonth: "/ mes",
          upTo: "Hasta €500,00 / mes según alcance y tráfico.",
          included: "INCLUIDO",
          items: [
            "Monitorización y optimización SEO",
            "Gestión de dominio y hosting",
            "Cumplimiento de privacidad, cookies y RGPD",
            "Actualizaciones de seguridad y monitorización",
            "Copias de seguridad y monitorización de uptime",
            "Actualizaciones de contenido y soporte técnico",
          ],
        },
      },
      team: {
        backHome: "Volver al Inicio",
        label: "// El Equipo",
        titlePre: "Las personas detrás de ",
        titleHighlight: "Aura",
        subtitle:
          "Somos tres. Pocos, compenetrados y obsesionados con los detalles. Estos somos y así puedes contactarnos.",
        call: "Teléfono",
        pec: "PEC",
        email: "Email",
      },
    },
  },
} as const;

export function persistLanguage(code: LanguageCode) {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
    } catch {
      /* ignore */
    }
  }
  void i18n.changeLanguage(code);
}

export function getStoredLanguage(): LanguageCode | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (stored && LANGUAGES.some((l) => l.code === stored)) {
      return stored as LanguageCode;
    }
  } catch {
    /* ignore */
  }
  return null;
}

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources,
    lng: DEFAULT_LANGUAGE,
    fallbackLng: DEFAULT_LANGUAGE,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
  });
}

export default i18n;
