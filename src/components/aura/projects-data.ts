/**
 * The project catalogue.
 *
 * Kept apart from any component because two very different things read it: the
 * home page's scroll field, which shows five, and the works page, which shows
 * all of them. One list means the two can't drift — adding a project here puts
 * it on the works page, and moving an id into FEATURED puts it on the home
 * page, with nothing else to remember.
 *
 * Source of truth for the URLs is the client's own "Archivio Siti Web" list.
 */

export type ProjectCategory =
  | "automotive"
  | "beauty"
  | "food"
  | "hotel"
  | "energy"
  | "business"
  | "legal"
  | "digital";

export type Project = {
  id: string;
  name: string;
  category: ProjectCategory;
  /** Shown on the works page, under the name. One line, in the client's terms. */
  desc: string;
  /** Live site. Null means built but not published — the card says so. */
  domain: string | null;
  /** Screenshot in /public/projects. Null renders a coloured panel instead. */
  image: string | null;
  alt: string;
};

export const categories: { key: ProjectCategory; label: string }[] = [
  { key: "food", label: "Ristorazione" },
  { key: "hotel", label: "Hotel & Ospitalità" },
  { key: "beauty", label: "Beauty & Barber" },
  { key: "automotive", label: "Automotive" },
  { key: "energy", label: "Energia & Impiantistica" },
  { key: "business", label: "Aziende & Industria" },
  { key: "legal", label: "Studi Legali" },
  { key: "digital", label: "Digital, Shop & Demo" },
];

export function categoryLabel(category: ProjectCategory) {
  return categories.find((c) => c.key === category)?.label ?? "";
}

export const allProjects: Project[] = [
  // — Aziende & Industria ——————————————————————————————————————————————
  {
    id: "bullman",
    name: "BULLMAN",
    category: "business",
    desc: "Notebook e tablet rugged militari. Restyling completo con animazioni di scroll cinematiche.",
    domain: "https://bullman.vercel.app/",
    image: "/projects/bullman.webp",
    alt: "Sito web BULLMAN, notebook e tablet rugged professionali, restyling con animazioni cinematiche — progetto Aura Web Studio",
  },
  {
    id: "manna-italia",
    name: "Manna Italia",
    category: "business",
    desc: "Substrati, concimi e macchinari per il florovivaismo professionale. Azienda dal 1979, bilingue IT/DE.",
    domain: "https://manna-redesign.vercel.app/",
    image: "/projects/manna_redesign.webp",
    alt: "Sito web Manna Italia, azienda di concimi e substrati per florovivaismo professionale ad Andriano — progetto Aura Web Studio",
  },
  {
    id: "rdd-servizi",
    name: "RDD Servizi",
    category: "business",
    desc: "Pulizie industriali e drone cleaning. Variante avorio e oro con galleria interventi.",
    domain: "https://rdd-servizi-white.vercel.app/",
    image: "/projects/rdd_servizi.webp",
    alt: "Sito web RDD Servizi, pulizie industriali e drone cleaning a Cremona — progetto Aura Web Studio",
  },
  {
    id: "unci",
    name: "UNCI — Cavalieri d'Italia",
    category: "business",
    desc: "Unione Nazionale Cavalieri d'Italia. Redesign istituzionale multipagina in stile tricolore.",
    domain: "https://remodel-sito-unci.vercel.app/",
    image: "/projects/unci.webp",
    alt: "Sito web UNCI Unione Nazionale Cavalieri d'Italia, redesign istituzionale — progetto Aura Web Studio",
  },

  // — Energia & Impiantistica ——————————————————————————————————————————
  {
    id: "pernthaler",
    name: "Pernthaler",
    category: "energy",
    desc: "Impiantistica elettrica e fotovoltaico in Alto Adige. Home in stile editoriale, bilingue IT/DE.",
    domain: "https://pernthaler-premium.vercel.app/",
    image: "/projects/pernthaler_premium.webp",
    alt: "Sito web Pernthaler, impiantistica elettrica e fotovoltaico in Alto Adige — progetto Aura Web Studio",
  },

  // — Hotel & Ospitalità ————————————————————————————————————————————————
  {
    id: "schlosshof-resort",
    name: "Schlosshof Resort",
    category: "hotel",
    desc: "Camping 5 stelle e charme hotel a Lana, tra Merano e Bolzano. Piscine, SPA e prenotazione online.",
    domain: "https://schlosshof-resort.vercel.app/it",
    image: "/projects/schlosshof_resort.webp",
    alt: "Sito web Schlosshof Resort, camping 5 stelle e charme hotel a Lana con piscine e SPA — progetto Aura Web Studio",
  },
  {
    id: "hotel-rosa",
    name: "Hotel Rosa Resort",
    category: "hotel",
    desc: "Resort in Val di Non con centro wellness e vista sulle Dolomiti di Brenta.",
    domain: "https://hotel-rosa.vercel.app/it",
    image: "/projects/hotel_rosa.webp",
    alt: "Sito web Hotel Rosa Resort in Val di Non con centro wellness e vista sulle Dolomiti di Brenta — progetto Aura Web Studio",
  },
  {
    id: "lady-maria",
    name: "Lady Maria",
    category: "hotel",
    desc: "Hotel con motore di prenotazione integrato e presentazione delle camere.",
    domain: "https://ladymaria-hotel.vercel.app/it",
    image: "/projects/lady_maria.webp",
    alt: "Sito web Hotel Lady Maria con prenotazione camere online — progetto Aura Web Studio",
  },

  // — Ristorazione ——————————————————————————————————————————————————————
  {
    id: "piccola-italia",
    name: "Piccola Italia",
    category: "food",
    desc: "Ristorante fusion italo-indiano a Bolzano. Atmosfera dark e prenotazione tavolo.",
    domain: "https://namastepiccolaitalia.it/",
    image: "/projects/piccola_italia.webp",
    alt: "Sito web ristorante fusion italo-indiano Piccola Italia a Bolzano — progetto Aura Web Studio",
  },
  {
    id: "osteria-da-marco",
    name: "Osteria da Marco",
    category: "food",
    desc: "Osteria di cucina tipica nel centro di Bolzano, con prenotazione tavolo online.",
    domain: "https://osteria-da-marco-pied.vercel.app/it",
    image: "/projects/osteria_da_marco.webp",
    alt: "Sito web Osteria da Marco, cucina tipica nel centro di Bolzano — progetto Aura Web Studio",
  },
  {
    id: "central-merano",
    name: "Central — Food & Beverage",
    category: "food",
    desc: "Bar e ristorante nel centro di Merano. Storia, menù e galleria.",
    domain: "https://central-merano.vercel.app",
    image: "/projects/central_merano.webp",
    alt: "Sito web Central, bar e ristorante Food & Beverage nel centro di Merano — progetto Aura Web Studio",
  },
  {
    id: "la-cave",
    name: "La Cave Shisha Lounge",
    category: "food",
    desc: "Shisha bar di lusso a Bolzano. Dark mode con accenti dorati e overlay glassmorphici.",
    domain: "https://la-cave-eosin.vercel.app/",
    image: "/projects/la_cave.webp",
    alt: "Sito web La Cave, shisha bar di lusso a Bolzano in dark mode con accenti dorati — progetto Aura Web Studio",
  },
  {
    id: "enoteca-da-aldo",
    name: "Enoteca da Aldo",
    category: "food",
    desc: "Enoteca e bar degustazione. Layout dark-slate con piastrelle in parallax.",
    // Il deployment Vercel di questo progetto non risponde più
    // (DEPLOYMENT_NOT_FOUND, verificato il 12/09/2026). Lo screenshot è quello
    // originale; rimetti l'URL qui appena il sito torna online.
    domain: null,
    image: "/projects/enoteca_da_aldo.webp",
    alt: "Sito web Enoteca da Aldo, enoteca e wine bar di degustazione — progetto Aura Web Studio",
  },
  {
    id: "la-vineria",
    name: "La Vineria di Montepulciano",
    category: "food",
    desc: "Vineria toscana con carta dei vini e racconto del territorio.",
    domain: "https://la-vineria-di-montepulciano.vercel.app/it",
    image: "/projects/la_vineria.webp",
    alt: "Sito web La Vineria di Montepulciano, vineria toscana con carta dei vini — progetto Aura Web Studio",
  },
  {
    id: "kernerhof",
    name: "Kernerhof",
    category: "food",
    desc: "Cantina ed enoteca a Bolzano. Presentazione delle etichette e degustazioni.",
    domain: "https://kernerhof.vercel.app/",
    image: "/projects/kernerhof.webp",
    alt: "Sito web Kernerhof, cantina ed enoteca a Bolzano con degustazioni — progetto Aura Web Studio",
  },
  {
    id: "poke-city",
    name: "Poké City",
    category: "food",
    desc: "Poke bowls a Bolzano. Menù configurabile e ordine rapido.",
    domain: "https://pokecity-gold.vercel.app/",
    image: "/projects/poke_city.webp",
    alt: "Sito web Poké City, poke bowls a Bolzano con menù configurabile — progetto Aura Web Studio",
  },

  // — Beauty & Barber ————————————————————————————————————————————————————
  {
    id: "lala-hair",
    name: "LALA Hair Studio",
    category: "beauty",
    desc: "Salone di parrucchieri a Merano. Servizi, team e prenotazione.",
    domain: "https://lala-hair-next.vercel.app",
    image: "/projects/lala_hair.webp",
    alt: "Sito web LALA Hair Studio, salone di parrucchieri a Merano — progetto Aura Web Studio",
  },
  {
    id: "sahal-barber",
    name: "Sahal Barber Studio",
    category: "beauty",
    desc: "Barber studio a Merano. Prenotazione online e galleria tagli.",
    domain: "https://sahal-barber-next.vercel.app",
    image: "/projects/sahal_barber.webp",
    alt: "Sito web Sahal Barber Studio a Merano con prenotazione online e galleria tagli — progetto Aura Web Studio",
  },
  {
    id: "s-nails",
    name: "S. Nails & Salon",
    category: "beauty",
    desc: "Beauty e nail care a Bolzano. Listino servizi e contatto diretto.",
    domain: "https://s-nail-beauty-studio.vercel.app/",
    image: "/projects/s_nails.webp",
    alt: "Sito web S. Nails & Salon, centro beauty e nail care a Bolzano — progetto Aura Web Studio",
  },
  {
    id: "chicpokystyle",
    name: "ChicPokyStyle",
    category: "beauty",
    desc: "Barber studio a Pola, Croazia. Identità grafica e prenotazione.",
    domain: "https://chicpokystyle.vercel.app/",
    image: "/projects/chicpokystyle.webp",
    alt: "Sito web ChicPokyStyle, barber studio a Pola in Croazia — progetto Aura Web Studio",
  },

  // — Automotive ————————————————————————————————————————————————————————
  {
    id: "nils-automotive",
    name: "NILS Automotive",
    category: "automotive",
    desc: "Lubrificanti e manutenzione auto. Restyling in stile Ferrari con configuratore 3D.",
    domain: "https://nils-automotive.vercel.app/",
    image: "/projects/nils_automotive.webp",
    alt: "Sito web NILS Automotive, lubrificanti auto con configuratore 3D in stile Ferrari — progetto Aura Web Studio",
  },
  {
    id: "autoservice-foppa",
    name: "Autoservice Foppa",
    category: "automotive",
    desc: "Officina meccanica a Laives dal 1947. Centro autoglas e prenotazione tagliandi.",
    domain: "https://foppa-next.vercel.app",
    image: "/projects/autoservice_foppa.webp",
    alt: "Sito web Autoservice Foppa, officina meccanica a Laives dal 1947 con prenotazione tagliandi — progetto Aura Web Studio",
  },
  {
    id: "abigio",
    name: "ABIGIO",
    category: "automotive",
    desc: "Ricambi auto, moto e nautica. Start-up con hero a video e catalogo multipagina.",
    domain: "https://abigio.vercel.app/",
    image: "/projects/abigio.webp",
    alt: "Sito web ABIGIO, ricambi auto moto e nautica con catalogo multipagina — progetto Aura Web Studio",
  },

  // — Studi Legali ——————————————————————————————————————————————————————
  {
    id: "studio-legale-conte",
    name: "Studio Legale Conte",
    category: "legal",
    desc: "Studio legale a Bolzano, bilingue IT/DE. Competenze, avvocati e primo contatto.",
    domain: "https://studio-legale-conte.vercel.app/",
    image: "/projects/studio_legale_conte.webp",
    alt: "Sito web Studio Legale Conte a Bolzano, bilingue italiano e tedesco — progetto Aura Web Studio",
  },
  {
    id: "lorenza-lombardi",
    name: "Avv. Lorenza Lombardi",
    category: "legal",
    desc: "Studio legale a Milano. Aree di competenza e richiesta di consulenza.",
    domain: "https://lorenza-lombardi.vercel.app/",
    image: "/projects/lorenza_lombardi.webp",
    alt: "Sito web dell'avvocato Lorenza Lombardi, studio legale a Milano — progetto Aura Web Studio",
  },

  // — Digital, Shop & Demo ——————————————————————————————————————————————
  {
    id: "markz3d",
    name: "MXC Store — Markz3D",
    category: "digital",
    desc: "Shop professionale di asset e mappe per server roleplay, con griglie prodotto interattive.",
    domain: "https://www.markz3d.com/",
    image: "/projects/markz3d.webp",
    alt: "Shop online MXC Store Markz3D per asset e mappe di server roleplay — progetto Aura Web Studio",
  },
  {
    id: "dauda-ai",
    name: "DAUDA AI",
    category: "digital",
    desc: "Landing ad alta conversione per bot di trading Forex e Crypto. Nero e oro.",
    domain: "https://dauda-ai.vercel.app",
    image: "/projects/dauda_ai.webp",
    alt: "Landing page DAUDA AI per bot di trading Forex e Crypto in stile nero e oro — progetto Aura Web Studio",
  },
  {
    id: "sport-id",
    name: "SportID",
    category: "digital",
    desc: "Ecosistema digitale sportivo con prenotazioni e hero in Three.js.",
    domain: "https://sportid-two.vercel.app/",
    image: "/projects/sport_id.webp",
    alt: "Sito web SportID, ecosistema digitale sportivo con prenotazioni e hero 3D — progetto Aura Web Studio",
  },
  {
    id: "aurelia-boat",
    name: "Aurelia Boat",
    category: "digital",
    desc: "Barca in 3D completamente interagibile, esplorabile direttamente nel browser.",
    domain: "https://deploy-roan-nine-18.vercel.app/",
    image: "/projects/aurelia_boat.webp",
    alt: "Configuratore 3D interattivo di una barca esplorabile nel browser — progetto Aura Web Studio",
  },
  {
    id: "animejs-clone",
    name: "Anime.js Clone",
    category: "digital",
    desc: "Mirror della homepage di anime.js con effetto 3D radar/HUD guidato dallo scroll.",
    domain: "https://animejs-clone-nine.vercel.app/",
    image: "/projects/animejs_clone.webp",
    alt: "Clone della homepage di anime.js con effetto 3D radar e HUD su scroll — progetto Aura Web Studio",
  },
];

/**
 * The five the home page puts on screen, in order.
 *
 * Five and not thirteen because the home field gives each project a full
 * screen and a stop: at thirteen that was eleven screens of scroll for one
 * section, and a visitor who wants the whole catalogue is better served by a
 * page that shows it all at once. These five are the range — industry,
 * agriculture, energy, hospitality, professional — rather than the newest.
 */
const FEATURED_IDS = [
  "bullman",
  "manna-italia",
  "pernthaler",
  "schlosshof-resort",
  "studio-legale-conte",
] as const;

export const featuredProjects: Project[] = FEATURED_IDS.map((id) => {
  const found = allProjects.find((p) => p.id === id);
  if (!found) throw new Error(`featuredProjects: no project with id "${id}"`);
  return found;
});
