/**
 * Translation data and the locale vocabulary. Deliberately free of side
 * effects: this module is imported by server components, route metadata and
 * the sitemap, and it used to initialise a shared i18next singleton at import
 * time. A singleton is the one thing that cannot exist here — concurrent
 * requests in different languages would race each other through it — so the
 * instance is built per render by @/i18n/provider instead, and this file is
 * only ever data.
 */

export const LANGUAGES = [
  { code: "it", label: "Italiano", short: "IT" },
  { code: "de", label: "Deutsch", short: "DE" },
  { code: "en", label: "English", short: "EN" },
  { code: "es", label: "Español", short: "ES" },
] as const;

export type LanguageCode = (typeof LANGUAGES)[number]["code"];

export const DEFAULT_LANGUAGE: LanguageCode = "it";

const resources = {
  it: {
    translation: {
      nav: {
        work: "Lavori",
        product: "Il Prodotto",
        pricing: "Prezzi",
        team: "Team",
        contact: "Contatti",
      },
      intro: {
        badge: "Creative Web Studio",
        tagline: "Il tuo brand, elevato",
        skip: "Salta",
      },
      hero: {
        badge: "Creative Digital Solutions",
        scroll: "Scorri",
        actTwoTitle: "Il tuo brand, elevato.",
        actTwoSub: "Web design su misura per chi non si accontenta.",
        actTwoTitle2: "Estetica che converte.",
        actTwoSub2: "Performance, SEO e conversioni — di serie.",
      },
      services: {
        steps: [
          { title: "Ogni progetto parte da una pagina bianca." },
          { title: "Il dettaglio non è un extra. È il lavoro." },
          { title: "Valore che cresce, progetto dopo progetto." },
        ],
        mobileItems: [
          {
            title: "Design su misura",
            desc: "Ogni sito nasce dalle tue esigenze, mai da un template.",
          },
          {
            title: "Esperienze 3D",
            desc: "Scene interattive integrate nel codice, non semplice decorazione.",
          },
          {
            title: "SEO & Performance",
            desc: "Architettura tecnica pensata per essere trovata e veloce.",
          },
          {
            title: "Multilingua",
            desc: "Il tuo sito parla la lingua dei tuoi clienti, ovunque siano.",
          },
        ],
      },
      projects: {
        mobileTitle: "Case study cinematici.",
        caseStudies: "Aura — Case Studies",
        visit: "Visita il sito",
        comingSoon: "Presto online",
        previous: "Progetto precedente",
        next: "Progetto successivo",
        seeAll: "Vedi tutti i lavori",
        allTitle: "I nostri lavori",
        pageIntro:
          "Ogni progetto nasce su misura: nessun template, codice scritto per il brand che lo porta.",
        backHome: "Torna alla home",
        bySector: "Progetti per settore",
        projectsLabel: "progetti",
        ctaLine: "Il prossimo potrebbe essere il tuo.",
        ctaAction: "Parliamo del tuo progetto",
        sectorsLabel: "settori",
        onlineLabel: "online",
      },
      product: {
        headingPre: "Costruiamo siti ",
        headingHighlight: "su misura",
        headingPost: ".",
        headingLine2: "Dalla landing allo shop.",
        paragraph:
          "Niente template. Niente compromessi. Ogni progetto nasce dalle tue esigenze: landing che converte, vetrine eleganti, e-commerce performanti o web app custom — sempre con la stessa cura cinematica.",
        morphParagraph:
          "Scrolla e guarda come la stessa interfaccia diventa landing, vetrina, shop o web app. È così che lavoriamo: una base solida, modellata su di te.",
        pricingHeadingLine1: "Soluzioni su misura.",
        pricingHeadingPre: "Piani ",
        pricingHeadingHighlight: "trasparenti",
        pricingParagraph:
          "Scegli il piano ideale per portare la tua presenza online a un livello superiore. Dal piccolo sito vetrina per startup ad applicazioni web enterprise customizzate, offriamo prezzi trasparenti e sviluppo d'eccellenza senza compromessi.",
        pricingCta: "Scopri i nostri piani →",
      },
      contact: {
        headingPre: "Hai in mente qualcosa di ",
        headingHighlight: "più",
        headingPost: "?",
        paragraph:
          "I nostri piani coprono la maggior parte delle esigenze, ma ogni progetto ambizioso ha le sue. Se cerchi una soluzione su misura, parliamone: costruiamo qualcosa di unico, pensato solo per te. Ti rispondiamo entro 24 ore.",
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
        failHelp:
          "Non siamo riusciti a registrare la richiesta. Il testo che hai scritto non è perso: mandacelo direttamente, ti rispondiamo lo stesso.",
        failMail: "Invia per email",
        success: "Richiesta inviata. Ti rispondiamo a breve.",
      },
      footer: {
        tagline: "Creative Digital Solutions · Made in Italy",
        explore: "Esplora",
        legal: "Legale",
        privacy: "Privacy & Cookie",
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
        plusMaintenance: "+ €50,00/mese di manutenzione obbligatoria",
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
        modal: {
          title: "Richiedi un preventivo",
          subtitle:
            "Lascia i tuoi dati: ti ricontattiamo entro 24 ore per definire ogni dettaglio.",
          planLabel: "Piano selezionato",
          formName: "Nome e Cognome",
          formPhone: "Numero di cellulare",
          formContact: "Email o PEC",
          formMessage: "Descrivi brevemente la tua richiesta",
          customizeToggle: "Proponi un budget diverso",
          priceLabel: "Budget proposto",
          btnIdle: "Invia richiesta →",
          btnLoading: "Invio in corso…",
          btnSent: "Richiesta inviata ✓",
          errFill: "Compila tutti i campi obbligatori",
          errSend: "Invio non riuscito. Riprova.",
          success: "Richiesta inviata! Ti contatteremo entro 24 ore.",
        },
      },
      team: {
        collaborators: "Collaboratori",
        collaboratorsLead: "Chi lavora con noi sui progetti, oltre confine e oltre lo studio.",
        backHome: "Torna alla Home",
        titlePre: "Le persone dietro ad ",
        titleHighlight: "Aura",
        subtitle:
          "Siamo in tre. Pochi, affiatati e ossessionati dai dettagli. Ecco chi siamo e come raggiungerci.",
        pec: "PEC",
      },
      contactPage: {
        backHome: "Torna alla Home",
        titlePre: "Parla direttamente con ",
        titleHighlight: "Aura",
        titlePost: ".",
        subtitle:
          "Nessun centralino, nessun modulo anonimo: qui trovi i contatti diretti dei tre fondatori. Rispondiamo rapidamente, di persona o da remoto.",
        availabilityBadge: "Sempre disponibili",
        availabilityTitle: "Operativi h24, da remoto.",
        availabilityDesc:
          "Scrivici o chiamaci in qualsiasi momento: monitoriamo i contatti costantemente e rispondiamo rapidamente. Se preferisci parlarne di persona, siamo sempre disponibili per un incontro dal vivo — anche più di uno, finché il progetto non è chiaro al 100%.",
        mapTitle: "Con sede a Bolzano, operativi ovunque.",
        mapItaly: "Italia",
        mapSouthTyrol: "Alto Adige",
        mapSouthTyrolCaption:
          "Casa. La maggior parte dei siti che abbiamo costruito sta entro un’ora di macchina da qui.",
        mapWorld: "Mondo",
        mapSwipe: "Scorri →",
        mapBase: "Base operativa",
        mapReach: "Dove arriviamo",
        mapProject: "progetto",
        mapRemote: "Da remoto",
        mapItalyCaption: "Ogni punto è una città dove un sito che abbiamo costruito è online.",
        mapWorldCaption: "Lavoriamo da remoto: il fuso orario non è mai stato il problema.",
        mapCaption:
          "Il nostro studio nasce in Alto Adige, ma lavoriamo da remoto con clienti in tutto il mondo — sempre disponibili anche per un incontro dal vivo quando serve.",
      },
    },
  },
  de: {
    translation: {
      nav: {
        work: "Projekte",
        product: "Das Produkt",
        pricing: "Preise",
        team: "Team",
        contact: "Kontakt",
      },
      intro: {
        badge: "Creative Web Studio",
        tagline: "Deine Marke, auf neuem Niveau",
        skip: "Überspringen",
      },
      hero: {
        badge: "Creative Digital Solutions",
        scroll: "Scrollen",
        actTwoTitle: "Deine Marke, auf neuem Niveau.",
        actTwoSub: "Maßgeschneidertes Webdesign für alle, die sich nicht zufriedengeben.",
        actTwoTitle2: "Ästhetik, die konvertiert.",
        actTwoSub2: "Performance, SEO und Conversions — serienmäßig.",
      },
      services: {
        steps: [
          { title: "Jedes Projekt beginnt mit einem leeren Blatt." },
          { title: "Das Detail ist kein Extra. Es ist die Arbeit." },
          { title: "Wert, der wächst — Projekt für Projekt." },
        ],
        mobileItems: [
          {
            title: "Maßgeschneidertes Design",
            desc: "Jede Website entsteht aus deinen Anforderungen, nie aus einer Vorlage.",
          },
          {
            title: "3D-Erlebnisse",
            desc: "Interaktive Szenen direkt im Code integriert, keine bloße Dekoration.",
          },
          {
            title: "SEO & Performance",
            desc: "Technische Architektur, damit du gefunden wirst und alles schnell läuft.",
          },
          {
            title: "Mehrsprachig",
            desc: "Deine Website spricht die Sprache deiner Kunden, wo auch immer sie sind.",
          },
        ],
      },
      projects: {
        mobileTitle: "Filmreife Case Studies.",
        caseStudies: "Aura — Case Studies",
        visit: "Website ansehen",
        comingSoon: "Bald online",
        previous: "Vorheriges Projekt",
        next: "Nächstes Projekt",
        seeAll: "Alle Arbeiten ansehen",
        allTitle: "Unsere Arbeiten",
        pageIntro:
          "Jedes Projekt entsteht maßgeschneidert: keine Templates, Code für die Marke, die ihn trägt.",
        backHome: "Zurück zur Startseite",
        bySector: "Projekte nach Branche",
        projectsLabel: "Projekte",
        ctaLine: "Das nächste könnte deines sein.",
        ctaAction: "Sprechen wir über dein Projekt",
        sectorsLabel: "Branchen",
        onlineLabel: "online",
      },
      product: {
        headingPre: "Wir bauen ",
        headingHighlight: "maßgeschneiderte",
        headingPost: " Websites.",
        headingLine2: "Von der Landingpage bis zum Shop.",
        paragraph:
          "Keine Templates. Keine Kompromisse. Jedes Projekt entsteht aus deinen Anforderungen: Landingpages, die konvertieren, elegante Schaufenster, performante E-Commerce-Shops oder individuelle Web-Apps — immer mit derselben filmischen Sorgfalt.",
        morphParagraph:
          "Scrolle und sieh, wie dieselbe Oberfläche zu Landingpage, Schaufenster, Shop oder Web-App wird. So arbeiten wir: ein solides Fundament, geformt nach dir.",
        pricingHeadingLine1: "Maßgeschneiderte Lösungen.",
        pricingHeadingPre: "Transparente ",
        pricingHeadingHighlight: "Pakete",
        pricingParagraph:
          "Wähle das ideale Paket, um deine Online-Präsenz auf ein neues Level zu heben. Von der kleinen Schaufenster-Website für Startups bis zu maßgeschneiderten Enterprise-Web-Apps bieten wir transparente Preise und exzellente Entwicklung ohne Kompromisse.",
        pricingCta: "Entdecke unsere Pakete →",
      },
      contact: {
        headingPre: "Hast du etwas ",
        headingHighlight: "Größeres",
        headingPost: " im Sinn?",
        paragraph:
          "Unsere Pakete decken die meisten Anforderungen ab, aber jedes ehrgeizige Projekt hat seine eigenen. Wenn du eine maßgeschneiderte Lösung suchst, lass uns reden: Wir bauen etwas Einzigartiges, nur für dich. Wir antworten innerhalb von 24 Stunden.",
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
        failHelp:
          "Wir konnten die Anfrage nicht speichern. Dein Text ist nicht verloren: schick ihn uns direkt, wir antworten trotzdem.",
        failMail: "Per E-Mail senden",
        success: "Anfrage gesendet. Wir melden uns in Kürze.",
      },
      footer: {
        tagline: "Creative Digital Solutions · Made in Italy",
        explore: "Entdecken",
        legal: "Rechtliches",
        privacy: "Datenschutz & Cookies",
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
        plusMaintenance: "+ €50,00/Monat obligatorische Wartung",
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
        modal: {
          title: "Angebot anfordern",
          subtitle:
            "Hinterlasse deine Daten: wir melden uns innerhalb von 24 Stunden, um alle Details zu klären.",
          planLabel: "Gewähltes Paket",
          formName: "Vor- und Nachname",
          formPhone: "Handynummer",
          formContact: "E-Mail oder PEC",
          formMessage: "Beschreibe kurz dein Anliegen",
          customizeToggle: "Anderes Budget vorschlagen",
          priceLabel: "Vorgeschlagenes Budget",
          btnIdle: "Anfrage senden →",
          btnLoading: "Wird gesendet…",
          btnSent: "Anfrage gesendet ✓",
          errFill: "Bitte alle Pflichtfelder ausfüllen",
          errSend: "Senden fehlgeschlagen. Bitte versuche es erneut.",
          success: "Anfrage gesendet! Wir melden uns innerhalb von 24 Stunden.",
        },
      },
      team: {
        collaborators: "Mitarbeiter",
        collaboratorsLead:
          "Wer mit uns an den Projekten arbeitet — über die Grenze und über das Studio hinaus.",
        backHome: "Zurück zur Startseite",
        titlePre: "Die Menschen hinter ",
        titleHighlight: "Aura",
        subtitle:
          "Wir sind zu dritt. Klein, eingespielt und besessen von Details. Hier sind wir und so erreichst du uns.",
        pec: "PEC",
      },
      contactPage: {
        backHome: "Zurück zur Startseite",
        titlePre: "Sprich direkt mit ",
        titleHighlight: "Aura",
        titlePost: ".",
        subtitle:
          "Keine Zentrale, kein anonymes Formular: hier findest du die direkten Kontakte der drei Gründer. Wir antworten schnell, persönlich oder aus der Ferne.",
        availabilityBadge: "Immer erreichbar",
        availabilityTitle: "Rund um die Uhr erreichbar, remote.",
        availabilityDesc:
          "Schreib oder ruf uns jederzeit an: wir überwachen unsere Kontakte ständig und antworten schnell. Wenn du lieber persönlich sprichst, sind wir jederzeit für ein Treffen vor Ort verfügbar — auch mehrmals, bis das Projekt zu 100% klar ist.",
        mapTitle: "Mit Sitz in Bozen, überall einsatzbereit.",
        mapItaly: "Italien",
        mapSouthTyrol: "Südtirol",
        mapSouthTyrolCaption:
          "Zuhause. Die meisten Websites, die wir gebaut haben, liegen keine Autostunde von hier entfernt.",
        mapWorld: "Welt",
        mapSwipe: "Wischen →",
        mapBase: "Standort",
        mapReach: "Wohin wir kommen",
        mapProject: "Projekt",
        mapRemote: "Remote",
        mapItalyCaption:
          "Jeder Punkt ist eine Stadt, in der eine von uns gebaute Website online ist.",
        mapWorldCaption: "Wir arbeiten remote: die Zeitzone war noch nie das Problem.",
        mapCaption:
          "Unser Studio ist in Südtirol zuhause, aber wir arbeiten remote mit Kunden auf der ganzen Welt — und sind jederzeit auch für ein persönliches Treffen verfügbar, wenn es hilft.",
      },
    },
  },
  en: {
    translation: {
      nav: {
        work: "Work",
        product: "The Product",
        pricing: "Pricing",
        team: "Team",
        contact: "Contact",
      },
      intro: {
        badge: "Creative Web Studio",
        tagline: "Your brand, elevated",
        skip: "Skip",
      },
      hero: {
        badge: "Creative Digital Solutions",
        scroll: "Scroll",
        actTwoTitle: "Your brand, elevated.",
        actTwoSub: "Bespoke web design for those who won't settle.",
        actTwoTitle2: "Design that converts.",
        actTwoSub2: "Performance, SEO and conversions — built in.",
      },
      services: {
        steps: [
          { title: "Every project starts from a blank page." },
          { title: "The detail isn't an extra. It's the work." },
          { title: "Value that grows, project after project." },
        ],
        mobileItems: [
          {
            title: "Custom Design",
            desc: "Every site is built from your needs, never from a template.",
          },
          {
            title: "3D Experiences",
            desc: "Interactive scenes built into the code, not just decoration.",
          },
          {
            title: "SEO & Performance",
            desc: "Technical architecture built to be found and to be fast.",
          },
          {
            title: "Multi-language",
            desc: "Your site speaks your customers' language, wherever they are.",
          },
        ],
      },
      projects: {
        mobileTitle: "Cinematic case studies.",
        caseStudies: "Aura — Case Studies",
        visit: "Visit the site",
        comingSoon: "Coming soon",
        previous: "Previous project",
        next: "Next project",
        seeAll: "See all our work",
        allTitle: "Our work",
        pageIntro:
          "Every project is built to measure: no templates, code written for the brand that carries it.",
        backHome: "Back to home",
        bySector: "Projects by sector",
        projectsLabel: "projects",
        ctaLine: "The next one could be yours.",
        ctaAction: "Let's talk about your project",
        sectorsLabel: "sectors",
        onlineLabel: "live",
      },
      product: {
        headingPre: "We build ",
        headingHighlight: "bespoke",
        headingPost: " websites.",
        headingLine2: "From landing page to shop.",
        paragraph:
          "No templates. No compromises. Every project starts from your needs: landing pages that convert, elegant showcases, high-performance e-commerce or custom web apps — always with the same cinematic care.",
        morphParagraph:
          "Scroll and watch the same interface become a landing page, showcase, shop or web app. That's how we work: a solid foundation, shaped around you.",
        pricingHeadingLine1: "Bespoke solutions.",
        pricingHeadingPre: "Transparent ",
        pricingHeadingHighlight: "plans",
        pricingParagraph:
          "Choose the ideal plan to take your online presence to the next level. From a small showcase site for startups to custom enterprise web apps, we offer transparent pricing and excellence in development without compromise.",
        pricingCta: "Discover our plans →",
      },
      contact: {
        headingPre: "Got something ",
        headingHighlight: "more",
        headingPost: " in mind?",
        paragraph:
          "Our plans cover most needs, but every ambitious project has its own. If you're looking for a tailor-made solution, let's talk: we'll build something unique, made just for you. We reply within 24 hours.",
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
        failHelp:
          "We could not record your request. What you wrote is not lost: send it to us directly and we will answer all the same.",
        failMail: "Send by email",
        success: "Request sent. We'll get back to you shortly.",
      },
      footer: {
        tagline: "Creative Digital Solutions · Made in Italy",
        explore: "Explore",
        legal: "Legal",
        privacy: "Privacy & Cookies",
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
        plusMaintenance: "+ €50,00/month mandatory maintenance",
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
        modal: {
          title: "Request a Quote",
          subtitle:
            "Leave your details: we'll get back to you within 24 hours to sort out every detail.",
          planLabel: "Selected plan",
          formName: "Full Name",
          formPhone: "Phone number",
          formContact: "Email or PEC",
          formMessage: "Briefly describe your request",
          customizeToggle: "Propose a different budget",
          priceLabel: "Proposed budget",
          btnIdle: "Send request →",
          btnLoading: "Sending…",
          btnSent: "Request sent ✓",
          errFill: "Please fill in all required fields",
          errSend: "Failed to send. Please try again.",
          success: "Request sent! We'll contact you within 24 hours.",
        },
      },
      team: {
        collaborators: "Collaborators",
        collaboratorsLead:
          "The people who work with us on projects, beyond the border and beyond the studio.",
        backHome: "Back to Home",
        titlePre: "The people behind ",
        titleHighlight: "Aura",
        subtitle:
          "There are three of us. Small, tight-knit and obsessed with detail. Here's who we are and how to reach us.",
        pec: "PEC",
      },
      contactPage: {
        backHome: "Back to Home",
        titlePre: "Talk directly to ",
        titleHighlight: "Aura",
        titlePost: ".",
        subtitle:
          "No switchboard, no anonymous form: here are the direct contacts of the three founders. We reply quickly, in person or remotely.",
        availabilityBadge: "Always available",
        availabilityTitle: "Available 24/7, remotely.",
        availabilityDesc:
          "Message or call us anytime: we monitor our contacts constantly and reply quickly. If you'd rather talk in person, we're always available for a face-to-face meeting — more than one if needed, until the project is 100% clear.",
        mapTitle: "Based in Bolzano, reachable everywhere.",
        mapItaly: "Italy",
        mapSouthTyrol: "South Tyrol",
        mapSouthTyrolCaption:
          "Home. Most of the sites we have built are within an hour’s drive of here.",
        mapWorld: "World",
        mapSwipe: "Swipe →",
        mapBase: "Home base",
        mapReach: "Where we reach",
        mapProject: "project",
        mapRemote: "Remote",
        mapItalyCaption: "Every dot is a town where a site we built is live.",
        mapWorldCaption: "We work remotely: the time zone has never been the problem.",
        mapCaption:
          "Our studio is rooted in South Tyrol, but we work remotely with clients around the world — always available for a face-to-face meeting too, whenever it helps.",
      },
    },
  },
  es: {
    translation: {
      nav: {
        work: "Trabajos",
        product: "El Producto",
        pricing: "Precios",
        team: "Equipo",
        contact: "Contacto",
      },
      intro: {
        badge: "Creative Web Studio",
        tagline: "Tu marca, elevada",
        skip: "Saltar",
      },
      hero: {
        badge: "Creative Digital Solutions",
        scroll: "Desplázate",
        actTwoTitle: "Tu marca, elevada.",
        actTwoSub: "Diseño web a medida para quienes no se conforman.",
        actTwoTitle2: "Estética que convierte.",
        actTwoSub2: "Rendimiento, SEO y conversiones — de serie.",
      },
      services: {
        steps: [
          { title: "Cada proyecto empieza desde una página en blanco." },
          { title: "El detalle no es un extra. Es el trabajo." },
          { title: "Valor que crece, proyecto a proyecto." },
        ],
        mobileItems: [
          {
            title: "Diseño a medida",
            desc: "Cada sitio nace de tus necesidades, nunca de una plantilla.",
          },
          {
            title: "Experiencias 3D",
            desc: "Escenas interactivas integradas en el código, no solo decoración.",
          },
          {
            title: "SEO y Rendimiento",
            desc: "Arquitectura técnica pensada para ser encontrada y ser rápida.",
          },
          {
            title: "Multiidioma",
            desc: "Tu sitio habla el idioma de tus clientes, estén donde estén.",
          },
        ],
      },
      projects: {
        mobileTitle: "Case studies cinematográficos.",
        caseStudies: "Aura — Case Studies",
        visit: "Visitar el sitio",
        comingSoon: "Próximamente",
        previous: "Proyecto anterior",
        next: "Proyecto siguiente",
        seeAll: "Ver todos los trabajos",
        allTitle: "Nuestros trabajos",
        pageIntro:
          "Cada proyecto nace a medida: sin plantillas, código escrito para la marca que lo lleva.",
        backHome: "Volver al inicio",
        bySector: "Proyectos por sector",
        projectsLabel: "proyectos",
        ctaLine: "El próximo podría ser el tuyo.",
        ctaAction: "Hablemos de tu proyecto",
        sectorsLabel: "sectores",
        onlineLabel: "online",
      },
      product: {
        headingPre: "Creamos sitios ",
        headingHighlight: "a medida",
        headingPost: ".",
        headingLine2: "De la landing a la tienda.",
        paragraph:
          "Sin plantillas. Sin compromisos. Cada proyecto nace de tus necesidades: landings que convierten, escaparates elegantes, e-commerce de alto rendimiento o web apps a medida — siempre con el mismo cuidado cinematográfico.",
        morphParagraph:
          "Desplázate y observa cómo la misma interfaz se convierte en landing, escaparate, tienda o web app. Así trabajamos: una base sólida, moldeada a tu medida.",
        pricingHeadingLine1: "Soluciones a medida.",
        pricingHeadingPre: "Planes ",
        pricingHeadingHighlight: "transparentes",
        pricingParagraph:
          "Elige el plan ideal para llevar tu presencia online al siguiente nivel. Desde un pequeño sitio escaparate para startups hasta web apps enterprise personalizadas, ofrecemos precios transparentes y excelencia en el desarrollo sin compromisos.",
        pricingCta: "Descubre nuestros planes →",
      },
      contact: {
        headingPre: "¿Tienes algo ",
        headingHighlight: "más",
        headingPost: " en mente?",
        paragraph:
          "Nuestros planes cubren la mayoría de las necesidades, pero cada proyecto ambicioso tiene las suyas. Si buscas una solución a medida, hablemos: construiremos algo único, pensado solo para ti. Respondemos en 24 horas.",
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
        failHelp:
          "No hemos podido registrar la solicitud. Lo que has escrito no se pierde: mándanoslo directamente y te respondemos igual.",
        failMail: "Enviar por email",
        success: "Solicitud enviada. Te responderemos en breve.",
      },
      footer: {
        tagline: "Creative Digital Solutions · Made in Italy",
        explore: "Explora",
        legal: "Legal",
        privacy: "Privacidad y Cookies",
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
        plusMaintenance: "+ €50,00/mes de mantenimiento obligatorio",
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
        modal: {
          title: "Solicitar presupuesto",
          subtitle: "Déjanos tus datos: te contactaremos en 24 horas para definir cada detalle.",
          planLabel: "Plan seleccionado",
          formName: "Nombre y Apellido",
          formPhone: "Número de móvil",
          formContact: "Email o PEC",
          formMessage: "Describe brevemente tu solicitud",
          customizeToggle: "Proponer un presupuesto diferente",
          priceLabel: "Presupuesto propuesto",
          btnIdle: "Enviar solicitud →",
          btnLoading: "Enviando…",
          btnSent: "Solicitud enviada ✓",
          errFill: "Completa todos los campos obligatorios",
          errSend: "Error al enviar. Inténtalo de nuevo.",
          success: "¡Solicitud enviada! Te contactaremos en 24 horas.",
        },
      },
      team: {
        collaborators: "Colaboradores",
        collaboratorsLead:
          "Quienes trabajan con nosotros en los proyectos, más allá de la frontera y del estudio.",
        backHome: "Volver al Inicio",
        titlePre: "Las personas detrás de ",
        titleHighlight: "Aura",
        subtitle:
          "Somos tres. Pocos, compenetrados y obsesionados con los detalles. Estos somos y así puedes contactarnos.",
        pec: "PEC",
      },
      contactPage: {
        backHome: "Volver al Inicio",
        titlePre: "Habla directamente con ",
        titleHighlight: "Aura",
        titlePost: ".",
        subtitle:
          "Sin centralita, sin formularios anónimos: aquí tienes los contactos directos de los tres fundadores. Respondemos rápido, en persona o a distancia.",
        availabilityBadge: "Siempre disponibles",
        availabilityTitle: "Disponibles 24/7, a distancia.",
        availabilityDesc:
          "Escríbenos o llámanos cuando quieras: supervisamos los contactos constantemente y respondemos rápido. Si prefieres hablar en persona, siempre estamos disponibles para una reunión presencial — más de una si hace falta, hasta que el proyecto esté 100% claro.",
        mapTitle: "Con sede en Bolzano, disponibles en todas partes.",
        mapItaly: "Italia",
        mapSouthTyrol: "Alto Adigio",
        mapSouthTyrolCaption:
          "Casa. La mayoría de los sitios que hemos construido están a menos de una hora en coche de aquí.",
        mapWorld: "Mundo",
        mapSwipe: "Desliza →",
        mapBase: "Base operativa",
        mapReach: "Hasta dónde llegamos",
        mapProject: "proyecto",
        mapRemote: "En remoto",
        mapItalyCaption:
          "Cada punto es una ciudad donde un sitio que hemos construido está online.",
        mapWorldCaption: "Trabajamos en remoto: la zona horaria nunca ha sido el problema.",
        mapCaption:
          "Nuestro estudio nace en el Alto Adigio, pero trabajamos a distancia con clientes de todo el mundo — siempre disponibles también para una reunión presencial cuando haga falta.",
      },
    },
  },
} as const;

export { resources };

/** Every locale that has a prefix in the URL — i.e. all but the default. */
export const PREFIXED_LANGUAGES = LANGUAGES.filter((l) => l.code !== DEFAULT_LANGUAGE).map(
  (l) => l.code,
);

export function isLanguageCode(value: string | undefined): value is LanguageCode {
  return !!value && LANGUAGES.some((l) => l.code === value);
}

/** Derive the active locale from a pathname like "/de/pricing" (falls back to the default). */
export function getLocaleFromPathname(pathname: string): LanguageCode {
  const code = /^\/([a-z]{2})(?:\/|$)/.exec(pathname)?.[1];
  return isLanguageCode(code) ? code : DEFAULT_LANGUAGE;
}
