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
        tagline: "Fatti scegliere prima ancora di parlare",
        skip: "Salta",
      },
      hero: {
        badge: "Creative Digital Solutions",
        scroll: "Scorri",
        actTwoTitle: "Fatti scegliere prima ancora di parlare.",
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
      apps: {
        label: "// App su misura",
        titlePre: "Costruiamo ",
        titleHighlight: "app su misura",
        titlePost: ", con l'AI dentro.",
        steps: [
          {
            title: "Niente template, niente moduli preconfezionati.",
            desc: "L'app parte da come lavori davvero: funzioni, passaggi e vincoli sono i tuoi, non quelli di un prodotto nato per qualcun altro.",
          },
          {
            title: "Ogni funzione è costruita su richiesta.",
            desc: "Quello che ti serve viene sviluppato, quello che non ti serve non esiste. L'app resta semplice da usare perché contiene solo il tuo lavoro.",
          },
          {
            title: "Un agente AI dentro l'app, non incollato sopra.",
            desc: "Non un chatbot in un angolo: l'agente lavora sui tuoi dati e ti risponde nel punto esatto in cui ti serve, dentro l'app.",
          },
          {
            title: "Dal telefono al desktop, con i tuoi dati che restano tuoi.",
            desc: "Un'unica base pensata per essere usata ovunque lavori, senza che i tuoi dati finiscano dentro il prodotto di qualcun altro.",
          },
        ],
        cta: "Parliamo della tua app",
        note: "Sviluppo su richiesta, dalla prima riga di codice.",
        backHome: "Torna alla Home",
        heroLead:
          "Progettiamo e sviluppiamo applicazioni su misura, con un agente AI che vive dentro l'app e lavora sui tuoi dati. Nessun template adattato: ogni funzione nasce da come lavori tu.",
        ctaSecondary: "Vedi i piani",
        processLabel: "// Come lavoriamo",
        processTitle: "Dalla prima chiamata all'app che usi ogni giorno.",
        process: [
          {
            title: "Guardiamo come lavori oggi",
            desc: "Prima di scrivere una riga di codice capiamo i tuoi passaggi reali, dove perdi tempo e cosa non si può toccare. L'app si costruisce su questo, non su un'idea generica del tuo settore.",
          },
          {
            title: "Decidiamo insieme cosa serve davvero",
            desc: "Scegliamo le funzioni una per una. Quello che non ti serve resta fuori: è ciò che tiene l'app semplice da usare anche fra due anni.",
          },
          {
            title: "Costruiamo, e tu la usi mentre cresce",
            desc: "Ti consegniamo una versione funzionante presto e la facciamo evolvere con te. Vedi i progressi e correggi la rotta prima che sia costoso farlo.",
          },
          {
            title: "Resta tua, e continuiamo a seguirla",
            desc: "Codice e dati sono tuoi. Noi restiamo per manutenzione, aggiornamenti e nuove funzioni, al ritmo che decidi tu.",
          },
        ],
        agentLabel: "// L'agente dentro",
        agentTitle: "Un agente AI dentro l'app, non incollato sopra.",
        agentLead:
          "Non è un chatbot in un angolo dello schermo che risponde a domande generiche. È un agente che conosce i tuoi dati e il contesto in cui ti trovi, e che fa il lavoro al posto tuo dove ti servirebbe più tempo.",
        agentPoints: [
          {
            title: "Lavora sui tuoi dati",
            desc: "Legge quello che c'è già nell'app — clienti, ordini, documenti, storico — invece di chiederti di ripetergli tutto ogni volta.",
          },
          {
            title: "Prepara il lavoro al posto tuo",
            desc: "Compila, riassume, controlla e propone: tu correggi e confermi, invece di partire ogni volta da una pagina vuota.",
          },
          {
            title: "Risponde nel punto in cui sei",
            desc: "Vive dentro la schermata su cui stai lavorando e tiene il contesto, così non devi spiegargli dove ti trovi.",
          },
          {
            title: "Segue le tue regole",
            desc: "Impara il tuo modo di fare le cose e i tuoi vincoli, e resta dentro quelli. Decidi tu cosa può fare da solo e cosa deve passare da te.",
          },
        ],
        buildLabel: "// Cosa possiamo costruire",
        buildTitle: "Un'app per il lavoro che hai, non per quello medio del settore.",
        buildItems: [
          {
            title: "Gestionali interni",
            desc: "Il centro del tuo lavoro quotidiano: anagrafiche, pratiche, stati di avanzamento e tutto quello che oggi vive in fogli di calcolo sparsi.",
          },
          {
            title: "Prenotazioni e agende",
            desc: "Calendari, disponibilità e conferme automatiche, con le regole del tuo modo di lavorare e non quelle di un servizio generico.",
          },
          {
            title: "Magazzino e ordini",
            desc: "Carichi, scarichi, fornitori e scorte sotto controllo, con gli avvisi quando qualcosa sta per finire.",
          },
          {
            title: "Portali per i tuoi clienti",
            desc: "Un'area dove i tuoi clienti trovano documenti, stato dei lavori e richieste, senza scriverti per ogni aggiornamento.",
          },
          {
            title: "Dashboard e report",
            desc: "I numeri che contano davvero, letti in un colpo d'occhio e pronti da esportare quando servono a qualcun altro.",
          },
          {
            title: "Automazioni con AI",
            desc: "I passaggi ripetitivi affidati all'agente: documenti, email, controlli e riassunti preparati e messi in coda per la tua approvazione.",
          },
        ],
        buildNote: "// Questi sono esempi. L'app viene costruita sul tuo caso.",
        ctaTitle: "Raccontaci come lavori. Al resto pensiamo noi.",
        ctaLead:
          "Una chiamata basta per capire se ha senso costruirla e cosa serve davvero. Nessun preventivo a scatola chiusa.",
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
        collaboratorsLead: "Chi collabora con noi sui progetti, anche oltre confine.",
        backHome: "Torna alla Home",
        titlePre: "Le persone dietro ad ",
        titleHighlight: "Aura",
        subtitle:
          "Tre liberi professionisti che lavorano sotto lo stesso nome. Nessuna società in mezzo: scegli la persona e parli direttamente con chi farà il lavoro.",
        pec: "PEC",
        vat: "P. IVA",
        independent:
          "Aura è un marchio condiviso, non una società e non uno studio associato. Ognuno di noi ha la propria partita IVA, lavora in autonomia, fattura in proprio e risponde del proprio lavoro.",
      },
      contactPage: {
        backHome: "Torna alla Home",
        titlePre: "Parla direttamente con ",
        titleHighlight: "Aura",
        titlePost: ".",
        subtitle:
          "Nessun centralino, nessun modulo anonimo: qui trovi i contatti diretti dei tre professionisti. Scrivi o chiama la persona che preferisci, ti risponde direttamente lei.",
        independent:
          "Ogni progetto ha un solo referente fra noi tre: è la persona con cui firmi, che ti fattura con la propria partita IVA e che risponde del lavoro. Non c’è un’azienda da contattare, ci siamo noi.",
        availabilityBadge: "Sempre disponibili",
        availabilityTitle: "Operativi h24, da remoto.",
        availabilityDesc:
          "Scrivici o chiamaci in qualsiasi momento: monitoriamo i contatti costantemente e rispondiamo rapidamente. Se preferisci parlarne di persona, siamo sempre disponibili per un incontro dal vivo — anche più di uno, finché il progetto non è chiaro al 100%.",
        mapTitle: "Da Bolzano, operativi ovunque.",
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
          "Siamo nati in Alto Adige e lavoriamo da remoto con clienti in tutto il mondo — sempre disponibili anche per un incontro dal vivo quando serve.",
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
        tagline: "Überzeuge, bevor du ein Wort sagst",
        skip: "Überspringen",
      },
      hero: {
        badge: "Creative Digital Solutions",
        scroll: "Scrollen",
        actTwoTitle: "Überzeuge, bevor du ein Wort sagst.",
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
      apps: {
        label: "// Apps nach Mass",
        titlePre: "Wir bauen ",
        titleHighlight: "Apps nach Mass",
        titlePost: " — mit KI darin.",
        steps: [
          {
            title: "Keine Templates, keine vorgefertigten Module.",
            desc: "Die App geht von deiner tatsächlichen Arbeitsweise aus: Funktionen, Abläufe und Grenzen sind deine, nicht die eines Produkts für jemand anderen.",
          },
          {
            title: "Jede Funktion wird auf Anfrage gebaut.",
            desc: "Was du brauchst, wird entwickelt; was du nicht brauchst, gibt es nicht. Die App bleibt einfach, weil sie nur deine Arbeit enthält.",
          },
          {
            title: "Ein KI-Agent in der App, nicht obendrauf geklebt.",
            desc: "Kein Chatbot in der Ecke: Der Agent arbeitet mit deinen Daten und antwortet genau dort, wo du ihn brauchst — in der App.",
          },
          {
            title: "Vom Handy bis zum Desktop, und deine Daten bleiben deine.",
            desc: "Eine einzige Basis, überall einsetzbar, ohne dass deine Daten im Produkt eines anderen landen.",
          },
        ],
        cta: "Sprechen wir über deine App",
        note: "Entwicklung auf Anfrage, ab der ersten Zeile Code.",
        backHome: "Zur Startseite",
        heroLead:
          "Wir entwerfen und entwickeln massgeschneiderte Anwendungen, mit einem KI-Agenten, der in der App lebt und mit deinen Daten arbeitet. Kein angepasstes Template: Jede Funktion entsteht aus deiner Arbeitsweise.",
        ctaSecondary: "Preise ansehen",
        processLabel: "// Wie wir arbeiten",
        processTitle: "Vom ersten Gespräch zur App, die du täglich benutzt.",
        process: [
          {
            title: "Wir schauen, wie du heute arbeitest",
            desc: "Vor der ersten Zeile Code verstehen wir deine echten Abläufe, wo Zeit verloren geht und was unantastbar ist. Darauf wird die App gebaut, nicht auf eine allgemeine Vorstellung deiner Branche.",
          },
          {
            title: "Wir entscheiden gemeinsam, was wirklich gebraucht wird",
            desc: "Wir wählen die Funktionen einzeln aus. Was du nicht brauchst, bleibt draussen — genau das hält die App auch in zwei Jahren noch einfach.",
          },
          {
            title: "Wir bauen, und du benutzt sie schon währenddessen",
            desc: "Du bekommst früh eine lauffähige Version und wir entwickeln sie mit dir weiter. Du siehst den Fortschritt und korrigierst den Kurs, bevor es teuer wird.",
          },
          {
            title: "Sie bleibt deine, und wir bleiben dran",
            desc: "Code und Daten gehören dir. Wir bleiben für Wartung, Updates und neue Funktionen — in dem Takt, den du vorgibst.",
          },
        ],
        agentLabel: "// Der Agent darin",
        agentTitle: "Ein KI-Agent in der App, nicht obendrauf geklebt.",
        agentLead:
          "Kein Chatbot in der Ecke, der allgemeine Fragen beantwortet. Ein Agent, der deine Daten und deinen Kontext kennt und die Arbeit dort übernimmt, wo dir am meisten Zeit fehlt.",
        agentPoints: [
          {
            title: "Arbeitet mit deinen Daten",
            desc: "Er liest, was ohnehin in der App steht — Kunden, Aufträge, Dokumente, Historie — statt sich alles jedes Mal neu erklären zu lassen.",
          },
          {
            title: "Bereitet die Arbeit für dich vor",
            desc: "Er füllt aus, fasst zusammen, prüft und schlägt vor: Du korrigierst und bestätigst, statt jedes Mal vor einer leeren Seite zu sitzen.",
          },
          {
            title: "Antwortet genau dort, wo du bist",
            desc: "Er lebt in der Ansicht, an der du gerade arbeitest, und behält den Kontext — du musst ihm nicht erklären, wo du stehst.",
          },
          {
            title: "Hält sich an deine Regeln",
            desc: "Er lernt deine Arbeitsweise und deine Grenzen und bleibt darin. Du entscheidest, was er allein darf und was über dich läuft.",
          },
        ],
        buildLabel: "// Was wir bauen können",
        buildTitle: "Eine App für deine Arbeit, nicht für den Durchschnitt der Branche.",
        buildItems: [
          {
            title: "Interne Verwaltungssysteme",
            desc: "Das Zentrum deines Alltags: Stammdaten, Vorgänge, Status und alles, was heute in verstreuten Tabellen lebt.",
          },
          {
            title: "Buchungen und Kalender",
            desc: "Termine, Verfügbarkeiten und automatische Bestätigungen — nach deinen Regeln, nicht nach denen eines Standarddienstes.",
          },
          {
            title: "Lager und Bestellungen",
            desc: "Zugänge, Abgänge, Lieferanten und Bestände im Griff, mit Hinweis, wenn etwas zur Neige geht.",
          },
          {
            title: "Portale für deine Kunden",
            desc: "Ein Bereich, in dem deine Kunden Dokumente, Projektstand und Anfragen finden, ohne dir für jedes Update zu schreiben.",
          },
          {
            title: "Dashboards und Auswertungen",
            desc: "Die Zahlen, auf die es ankommt, auf einen Blick und exportbereit, wenn sie jemand anderes braucht.",
          },
          {
            title: "Automatisierungen mit KI",
            desc: "Wiederkehrende Schritte übernimmt der Agent: Dokumente, E-Mails, Prüfungen und Zusammenfassungen, vorbereitet und zur Freigabe bereitgelegt.",
          },
        ],
        buildNote: "// Das sind Beispiele. Gebaut wird auf deinen Fall.",
        ctaTitle: "Erzähl uns, wie du arbeitest. Um den Rest kümmern wir uns.",
        ctaLead:
          "Ein Gespräch reicht, um zu sehen, ob es sich lohnt und was wirklich gebraucht wird. Kein Angebot ins Blaue.",
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
        collaboratorsLead: "Wer mit uns an den Projekten arbeitet, auch über die Grenze hinaus.",
        backHome: "Zurück zur Startseite",
        titlePre: "Die Menschen hinter ",
        titleHighlight: "Aura",
        subtitle:
          "Drei Freiberufler, die unter demselben Namen arbeiten. Keine Gesellschaft dazwischen: Du wählst die Person und sprichst direkt mit der, die die Arbeit macht.",
        pec: "PEC",
        vat: "USt-IdNr.",
        independent:
          "Aura ist eine gemeinsame Marke, keine Gesellschaft und keine Bürogemeinschaft. Jeder von uns hat seine eigene Umsatzsteuernummer, arbeitet eigenständig, stellt selbst Rechnungen und haftet für die eigene Arbeit.",
      },
      contactPage: {
        backHome: "Zurück zur Startseite",
        titlePre: "Sprich direkt mit ",
        titleHighlight: "Aura",
        titlePost: ".",
        subtitle:
          "Keine Zentrale, kein anonymes Formular: hier findest du die direkten Kontakte der drei Freiberufler. Schreib oder ruf die Person an, die du willst — sie antwortet dir selbst.",
        independent:
          "Jedes Projekt hat genau einen Ansprechpartner von uns dreien: die Person, mit der du den Vertrag schliesst, die mit ihrer eigenen Umsatzsteuernummer abrechnet und für die Arbeit haftet. Es gibt kein Unternehmen, das du kontaktierst — es gibt uns.",
        availabilityBadge: "Immer erreichbar",
        availabilityTitle: "Rund um die Uhr erreichbar, remote.",
        availabilityDesc:
          "Schreib oder ruf uns jederzeit an: wir überwachen unsere Kontakte ständig und antworten schnell. Wenn du lieber persönlich sprichst, sind wir jederzeit für ein Treffen vor Ort verfügbar — auch mehrmals, bis das Projekt zu 100% klar ist.",
        mapTitle: "Von Bozen aus, überall einsatzbereit.",
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
          "Wir sind in Südtirol zuhause, arbeiten aber remote mit Kunden auf der ganzen Welt — und sind jederzeit auch für ein persönliches Treffen verfügbar, wenn es hilft.",
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
        tagline: "Get chosen before you say a word",
        skip: "Skip",
      },
      hero: {
        badge: "Creative Digital Solutions",
        scroll: "Scroll",
        actTwoTitle: "Get chosen before you say a word.",
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
      apps: {
        label: "// Custom apps",
        titlePre: "We build ",
        titleHighlight: "custom apps",
        titlePost: ", with the AI inside.",
        steps: [
          {
            title: "No templates, no prepackaged modules.",
            desc: "The app starts from how you actually work: the features, the steps and the constraints are yours, not those of a product built for someone else.",
          },
          {
            title: "Every feature is built on request.",
            desc: "What you need gets developed; what you don't need isn't there. The app stays simple to use because it only contains your work.",
          },
          {
            title: "An AI agent inside the app, not pasted on top.",
            desc: "Not a chatbot in the corner: the agent works on your data and answers exactly where you need it, inside the app.",
          },
          {
            title: "From phone to desktop, and your data stays yours.",
            desc: "One base, made to be used wherever you work, with nothing of yours ending up inside somebody else's product.",
          },
        ],
        cta: "Let's talk about your app",
        note: "Built on request, from the first line of code.",
        backHome: "Back home",
        heroLead:
          "We design and build custom applications, with an AI agent that lives inside the app and works on your data. No adapted template: every feature comes from the way you work.",
        ctaSecondary: "See the plans",
        processLabel: "// How we work",
        processTitle: "From the first call to the app you use every day.",
        process: [
          {
            title: "We look at how you work today",
            desc: "Before a line of code we learn your real steps, where the time goes and what cannot be touched. The app is built on that, not on a generic idea of your industry.",
          },
          {
            title: "We decide together what is actually needed",
            desc: "We pick the features one by one. What you don't need stays out — that is what keeps the app simple to use two years from now.",
          },
          {
            title: "We build, and you use it as it grows",
            desc: "You get a working version early and we evolve it with you. You see the progress and correct course before doing so gets expensive.",
          },
          {
            title: "It stays yours, and we stay with it",
            desc: "The code and the data are yours. We stay on for maintenance, updates and new features, at the pace you set.",
          },
        ],
        agentLabel: "// The agent inside",
        agentTitle: "An AI agent inside the app, not pasted on top.",
        agentLead:
          "Not a chatbot in the corner answering generic questions. An agent that knows your data and the context you are in, and does the work where you most need the time back.",
        agentPoints: [
          {
            title: "Works on your data",
            desc: "It reads what is already in the app — clients, orders, documents, history — instead of asking you to explain it all over again.",
          },
          {
            title: "Prepares the work for you",
            desc: "It fills in, summarises, checks and proposes: you correct and confirm, instead of starting from an empty page every time.",
          },
          {
            title: "Answers where you are",
            desc: "It lives in the screen you are working on and keeps the context, so you never have to tell it where you are.",
          },
          {
            title: "Follows your rules",
            desc: "It learns how you do things and the limits you set, and stays inside them. You decide what it can do alone and what goes through you.",
          },
        ],
        buildLabel: "// What we can build",
        buildTitle: "An app for the work you actually have, not the industry average.",
        buildItems: [
          {
            title: "Internal management tools",
            desc: "The centre of your working day: records, jobs, progress and everything that lives in scattered spreadsheets today.",
          },
          {
            title: "Bookings and calendars",
            desc: "Availability, scheduling and automatic confirmations, run by your rules rather than those of a generic service.",
          },
          {
            title: "Stock and orders",
            desc: "Incoming, outgoing, suppliers and stock under control, with a warning before something runs out.",
          },
          {
            title: "Portals for your clients",
            desc: "A place where your clients find documents, job status and requests, without writing to you for every update.",
          },
          {
            title: "Dashboards and reports",
            desc: "The numbers that actually matter, readable at a glance and ready to export when somebody else needs them.",
          },
          {
            title: "AI automations",
            desc: "The repetitive steps handed to the agent: documents, emails, checks and summaries, prepared and queued for your approval.",
          },
        ],
        buildNote: "// These are examples. The app gets built around your case.",
        ctaTitle: "Tell us how you work. We'll take care of the rest.",
        ctaLead:
          "One call is enough to see whether it is worth building and what is actually needed. No quote in the dark.",
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
        collaboratorsLead: "The people who work with us on projects, across the border too.",
        backHome: "Back to Home",
        titlePre: "The people behind ",
        titleHighlight: "Aura",
        subtitle:
          "Three self-employed professionals working under one name. No company in between: pick the person and you talk straight to whoever does the work.",
        pec: "PEC",
        vat: "VAT no.",
        independent:
          "Aura is a shared name, not a company and not a partnership. Each of us has their own VAT number, works independently, invoices in their own name and answers for their own work.",
      },
      contactPage: {
        backHome: "Back to Home",
        titlePre: "Talk directly to ",
        titleHighlight: "Aura",
        titlePost: ".",
        subtitle:
          "No switchboard, no anonymous form: here are the direct contacts of the three professionals. Write to or call whoever you prefer — they answer you themselves.",
        independent:
          "Every project has a single point of contact among the three of us: the person you sign with, who invoices under their own VAT number and answers for the work. There is no company to contact — there is us.",
        availabilityBadge: "Always available",
        availabilityTitle: "Available 24/7, remotely.",
        availabilityDesc:
          "Message or call us anytime: we monitor our contacts constantly and reply quickly. If you'd rather talk in person, we're always available for a face-to-face meeting — more than one if needed, until the project is 100% clear.",
        mapTitle: "From Bolzano, reachable everywhere.",
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
          "We are rooted in South Tyrol, but we work remotely with clients around the world — always available for a face-to-face meeting too, whenever it helps.",
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
        tagline: "Que te elijan antes de decir una palabra",
        skip: "Saltar",
      },
      hero: {
        badge: "Creative Digital Solutions",
        scroll: "Desplázate",
        actTwoTitle: "Que te elijan antes de decir una palabra.",
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
      apps: {
        label: "// Apps a medida",
        titlePre: "Creamos ",
        titleHighlight: "apps a medida",
        titlePost: ", con la IA dentro.",
        steps: [
          {
            title: "Sin plantillas, sin módulos prefabricados.",
            desc: "La app parte de cómo trabajas de verdad: las funciones, los pasos y los límites son los tuyos, no los de un producto pensado para otro.",
          },
          {
            title: "Cada función se construye a petición.",
            desc: "Lo que necesitas se desarrolla; lo que no necesitas no existe. La app sigue siendo sencilla porque solo contiene tu trabajo.",
          },
          {
            title: "Un agente de IA dentro de la app, no pegado encima.",
            desc: "No es un chatbot en una esquina: el agente trabaja con tus datos y responde justo donde lo necesitas, dentro de la app.",
          },
          {
            title: "Del móvil al escritorio, y tus datos siguen siendo tuyos.",
            desc: "Una única base pensada para usarse donde trabajes, sin que tus datos acaben dentro del producto de otro.",
          },
        ],
        cta: "Hablemos de tu app",
        note: "Desarrollo a petición, desde la primera línea de código.",
        backHome: "Volver al inicio",
        heroLead:
          "Diseñamos y desarrollamos aplicaciones a medida, con un agente de IA que vive dentro de la app y trabaja con tus datos. Ninguna plantilla adaptada: cada función nace de cómo trabajas tú.",
        ctaSecondary: "Ver los planes",
        processLabel: "// Cómo trabajamos",
        processTitle: "De la primera llamada a la app que usas cada día.",
        process: [
          {
            title: "Miramos cómo trabajas hoy",
            desc: "Antes de la primera línea de código entendemos tus pasos reales, dónde se pierde el tiempo y qué no se puede tocar. La app se construye sobre eso, no sobre una idea genérica de tu sector.",
          },
          {
            title: "Decidimos juntos qué hace falta de verdad",
            desc: "Elegimos las funciones una a una. Lo que no necesitas se queda fuera: es lo que mantiene la app sencilla también dentro de dos años.",
          },
          {
            title: "Construimos, y tú la usas mientras crece",
            desc: "Te entregamos pronto una versión funcional y la hacemos evolucionar contigo. Ves el avance y corriges el rumbo antes de que salga caro.",
          },
          {
            title: "Sigue siendo tuya, y seguimos a tu lado",
            desc: "El código y los datos son tuyos. Nosotros nos quedamos para mantenimiento, actualizaciones y nuevas funciones, al ritmo que marques.",
          },
        ],
        agentLabel: "// El agente dentro",
        agentTitle: "Un agente de IA dentro de la app, no pegado encima.",
        agentLead:
          "No es un chatbot en una esquina que responde preguntas genéricas. Es un agente que conoce tus datos y el contexto en el que estás, y que hace el trabajo donde más falta te hace el tiempo.",
        agentPoints: [
          {
            title: "Trabaja con tus datos",
            desc: "Lee lo que ya está en la app — clientes, pedidos, documentos, histórico — en vez de pedirte que se lo expliques todo cada vez.",
          },
          {
            title: "Prepara el trabajo por ti",
            desc: "Rellena, resume, comprueba y propone: tú corriges y confirmas, en lugar de empezar siempre desde una página en blanco.",
          },
          {
            title: "Responde justo donde estás",
            desc: "Vive en la pantalla en la que estás trabajando y mantiene el contexto, así no tienes que explicarle dónde te encuentras.",
          },
          {
            title: "Sigue tus reglas",
            desc: "Aprende tu forma de hacer las cosas y tus límites, y se queda dentro. Tú decides qué puede hacer solo y qué pasa por ti.",
          },
        ],
        buildLabel: "// Qué podemos construir",
        buildTitle: "Una app para el trabajo que tienes, no para la media del sector.",
        buildItems: [
          {
            title: "Gestión interna",
            desc: "El centro de tu día a día: fichas, expedientes, estados de avance y todo lo que hoy vive en hojas de cálculo dispersas.",
          },
          {
            title: "Reservas y agendas",
            desc: "Calendarios, disponibilidad y confirmaciones automáticas, con las reglas de tu forma de trabajar y no las de un servicio genérico.",
          },
          {
            title: "Almacén y pedidos",
            desc: "Entradas, salidas, proveedores y existencias bajo control, con avisos cuando algo está a punto de acabarse.",
          },
          {
            title: "Portales para tus clientes",
            desc: "Un espacio donde tus clientes encuentran documentos, estado de los trabajos y solicitudes, sin escribirte por cada novedad.",
          },
          {
            title: "Paneles e informes",
            desc: "Los números que de verdad importan, de un vistazo y listos para exportar cuando los necesita otra persona.",
          },
          {
            title: "Automatizaciones con IA",
            desc: "Los pasos repetitivos los asume el agente: documentos, correos, comprobaciones y resúmenes, preparados y en cola para tu aprobación.",
          },
        ],
        buildNote: "// Estos son ejemplos. La app se construye sobre tu caso.",
        ctaTitle: "Cuéntanos cómo trabajas. Del resto nos ocupamos nosotros.",
        ctaLead:
          "Basta una llamada para ver si merece la pena construirla y qué hace falta de verdad. Sin presupuestos a ciegas.",
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
          "Quienes colaboran con nosotros en los proyectos, también más allá de la frontera.",
        backHome: "Volver al Inicio",
        titlePre: "Las personas detrás de ",
        titleHighlight: "Aura",
        subtitle:
          "Tres profesionales autónomos que trabajan bajo el mismo nombre. Sin ninguna empresa de por medio: eliges a la persona y hablas directamente con quien hará el trabajo.",
        pec: "PEC",
        vat: "NIF/IVA",
        independent:
          "Aura es una marca compartida, no una sociedad ni un despacho asociado. Cada uno de nosotros tiene su propio número de IVA, trabaja de forma autónoma, factura por su cuenta y responde de su propio trabajo.",
      },
      contactPage: {
        backHome: "Volver al Inicio",
        titlePre: "Habla directamente con ",
        titleHighlight: "Aura",
        titlePost: ".",
        subtitle:
          "Sin centralita, sin formularios anónimos: aquí tienes los contactos directos de los tres profesionales. Escribe o llama a quien prefieras: te responde esa misma persona.",
        independent:
          "Cada proyecto tiene un único responsable entre los tres: la persona con la que firmas, que te factura con su propio número de IVA y que responde del trabajo. No hay una empresa a la que llamar: estamos nosotros.",
        availabilityBadge: "Siempre disponibles",
        availabilityTitle: "Disponibles 24/7, a distancia.",
        availabilityDesc:
          "Escríbenos o llámanos cuando quieras: supervisamos los contactos constantemente y respondemos rápido. Si prefieres hablar en persona, siempre estamos disponibles para una reunión presencial — más de una si hace falta, hasta que el proyecto esté 100% claro.",
        mapTitle: "Desde Bolzano, disponibles en todas partes.",
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
          "Nacimos en el Alto Adigio, pero trabajamos a distancia con clientes de todo el mundo — siempre disponibles también para una reunión presencial cuando haga falta.",
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
