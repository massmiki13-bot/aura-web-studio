/**
 * SEO Configuration & Utilities
 * Single source of truth for all metadata across the site.
 *
 * To change the production domain later, set VITE_SITE_URL in Vercel
 * (e.g. https://www.your-domain.com) — no code change needed. The static
 * public/robots.txt and public/sitemap.xml must be updated to match.
 */

import { LANGUAGES, DEFAULT_LANGUAGE, type LanguageCode } from "@/i18n";

type MetaDescriptor =
  | { title: string }
  | { name: string; content: string }
  | { property: string; content: string }
  | { charSet: string }
  | { httpEquiv: string; content: string };

type LinkDescriptor = {
  rel: string;
  href: string;
  [key: string]: string | undefined;
};

/** Normalize the base URL (strip trailing slash) so joins never double-up. */
const RAW_BASE_URL =
  (import.meta.env.VITE_SITE_URL as string | undefined) ?? "https://showoff-project.vercel.app";

export const SITE_CONFIG = {
  baseUrl: RAW_BASE_URL.replace(/\/+$/, ""),
  name: "Aura Web Studio",
  /** Title shown for the homepage and used as the brand suffix on subpages. */
  defaultTitle: "Aura Web Studio — Web Design a Bolzano & Sviluppo Siti Web Premium",
  titleSuffix: "Aura Web Studio",
  description:
    "Agenzia di web design a Bolzano: sviluppiamo siti web professionali ed esperienze digitali cinematiche per hospitality, ristoranti e brand di lusso, in Alto Adige e in tutta Italia.",
  shortDescription:
    "Web design a Bolzano — agenzia digitale premium per hospitality e brand italiani",
  keywords: [
    "web design Bolzano",
    "sviluppo siti web Alto Adige",
    "agenzia web design premium",
    "prezzi siti web professionali Bolzano",
    "agenzia web Bolzano contatti",
    "web design",
    "sviluppo web",
    "agenzia digitale",
    "siti per ristoranti",
    "siti hospitality",
    "web design di lusso",
    "esperienze web cinematiche",
    "React",
    "Framer Motion",
    "Italia",
  ],
  author: "Aura Web Studio",
  company: "Aura Web Studio",
  companyEmail: "info@aura-webstudio.com",
  phone: "+39 334 1924697",
  social: {
    instagram: "https://instagram.com/aurawebstudio",
    behance: "https://behance.net/aurawebstudio",
    github: "https://github.com/aurawebstudio",
    linkedin: "https://www.linkedin.com/in/michele-massardi-a72a38425/",
  },
  location: {
    country: "IT",
    city: "Bolzano",
    region: "Trentino-Alto Adige",
    street: "Via Maso della Pieve",
  },
  locale: "it_IT",
  alternateLocales: ["en_US", "de_DE", "es_ES"],
  ogImagePath: "/og-image.png",
  ogImageAlt: "Aura Web Studio — Web Design a Bolzano",
  ogImageWidth: 1200,
  ogImageHeight: 630,
  /** Search Console verification tokens — leave empty to omit the tag entirely. */
  verification: {
    google: "",
    bing: "",
  },
} as const;

/** Absolute URL for a site-relative path. */
export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_CONFIG.baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

/** Build a page title with the brand suffix (homepage uses the default title). */
export function buildTitle(pageTitle?: string): string {
  if (!pageTitle) return SITE_CONFIG.defaultTitle;
  return `${pageTitle} — ${SITE_CONFIG.titleSuffix}`;
}

/**
 * Site-wide meta that belong in the document head exactly once.
 * Used only by the root route — never duplicate these per page.
 */
export function rootMeta(): MetaDescriptor[] {
  const meta: MetaDescriptor[] = [
    { charSet: "utf-8" },
    {
      name: "viewport",
      content: "width=device-width, initial-scale=1, viewport-fit=cover",
    },
    { name: "keywords", content: SITE_CONFIG.keywords.join(", ") },
    { name: "author", content: SITE_CONFIG.author },
    { name: "creator", content: SITE_CONFIG.company },
    { name: "publisher", content: SITE_CONFIG.company },
    {
      name: "robots",
      content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    },
    { name: "googlebot", content: "index, follow" },
    { name: "theme-color", content: "#000000" },
    { name: "color-scheme", content: "dark light" },
    { name: "format-detection", content: "telephone=no" },
    { name: "application-name", content: SITE_CONFIG.name },
    { name: "apple-mobile-web-app-capable", content: "yes" },
    { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
    { name: "apple-mobile-web-app-title", content: "Aura Studio" },
    { name: "mobile-web-app-capable", content: "yes" },
    { name: "msapplication-TileColor", content: "#000000" },
    { name: "msapplication-config", content: "/browserconfig.xml" },
    // Open Graph / Twitter site-level
    { property: "og:site_name", content: SITE_CONFIG.name },
    { property: "og:locale", content: SITE_CONFIG.locale },
    ...SITE_CONFIG.alternateLocales.map((locale) => ({
      property: "og:locale:alternate",
      content: locale,
    })),
    { name: "twitter:card", content: "summary_large_image" },
  ];

  if (SITE_CONFIG.verification.google) {
    meta.push({ name: "google-site-verification", content: SITE_CONFIG.verification.google });
  }
  if (SITE_CONFIG.verification.bing) {
    meta.push({ name: "msvalidate.01", content: SITE_CONFIG.verification.bing });
  }

  return meta;
}

/** Site-wide link tags (icons, manifest, preconnect). Canonical is per-page, not here. */
export function rootLinks(): LinkDescriptor[] {
  return [
    { rel: "icon", href: "/favicon.ico", sizes: "any" },
    { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
    { rel: "icon", href: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
    { rel: "icon", href: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    { rel: "apple-touch-icon", href: "/apple-touch-icon.png", sizes: "180x180" },
    { rel: "manifest", href: "/manifest.webmanifest" },
    { rel: "preconnect", href: "https://fonts.googleapis.com" },
    { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
    { rel: "sitemap", type: "application/xml", href: "/sitemap.xml" },
  ];
}

/** Locales with a real, fully-translated content route (see src/i18n). Privacy/admin/auth stay IT-only. */
export const LOCALES: readonly LanguageCode[] = LANGUAGES.map((l) => l.code);
export type Locale = LanguageCode;
export const DEFAULT_LOCALE: Locale = DEFAULT_LANGUAGE;

/**
 * Build the locale-prefixed path for a logical sub-path ("" for home, no leading slash).
 * No trailing slash on locale-home paths (e.g. "/de", not "/de/") — the router
 * strips trailing slashes with a 307, and canonical/hreflang must point at the
 * final URL, not a redirecting one.
 */
export function localizedPath(locale: Locale, subPath = ""): string {
  const clean = subPath.replace(/^\/+/, "");
  if (locale === DEFAULT_LOCALE) return clean ? `/${clean}` : "/";
  return clean ? `/${locale}/${clean}` : `/${locale}`;
}

export type PageSeoOptions = {
  /** Page-specific title (without brand suffix). Omit for the homepage. */
  title?: string;
  description?: string;
  /** Site-relative path, e.g. "/pricing". Drives canonical + og:url. Ignored when `subPath` is set. */
  path?: string;
  /**
   * Logical sub-path shared across locales ("" for home, "pricing" for /pricing).
   * When set, `path`/canonical are derived from `locale` automatically and hreflang
   * alternates are emitted for every entry in LOCALES plus x-default. Only pass this
   * for pages that actually have translated content at every locale.
   */
  subPath?: string;
  locale?: Locale;
  /** Absolute or site-relative image. Defaults to the site OG image. */
  image?: string;
  type?: "website" | "article" | "profile";
  /** Set true for private pages (admin/auth) to keep them out of the index. */
  noindex?: boolean;
};

/**
 * Per-page meta + links. Returns everything a route's `head()` needs:
 * canonical, og/twitter, page title & description, robots noindex when set,
 * and hreflang alternates when `subPath` is set.
 */
export function pageSeo(options: PageSeoOptions = {}): {
  meta: MetaDescriptor[];
  links: LinkDescriptor[];
} {
  const locale = options.locale ?? DEFAULT_LOCALE;
  const title = buildTitle(options.title);
  const description = options.description ?? SITE_CONFIG.description;
  const path =
    options.subPath !== undefined ? localizedPath(locale, options.subPath) : (options.path ?? "/");
  const url = absoluteUrl(path);
  const image = absoluteUrl(options.image ?? SITE_CONFIG.ogImagePath);
  const type = options.type ?? "website";

  const meta: MetaDescriptor[] = [
    { title },
    { name: "description", content: description },
    { property: "og:type", content: type },
    { property: "og:url", content: url },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: image },
    { property: "og:image:width", content: String(SITE_CONFIG.ogImageWidth) },
    { property: "og:image:height", content: String(SITE_CONFIG.ogImageHeight) },
    { property: "og:image:alt", content: SITE_CONFIG.ogImageAlt },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: image },
    { name: "twitter:image:alt", content: SITE_CONFIG.ogImageAlt },
  ];

  if (options.noindex) {
    // Override the site-wide index directive for private pages.
    meta.push({ name: "robots", content: "noindex, nofollow" });
  }

  const links: LinkDescriptor[] = options.noindex
    ? [] // Don't advertise a canonical for pages we don't want indexed.
    : [{ rel: "canonical", href: url }];

  if (options.subPath !== undefined && !options.noindex) {
    for (const l of LOCALES) {
      links.push({
        rel: "alternate",
        // `hrefLang`, not `hreflang`: React does pass the lowercase form
        // through to the HTML, but it logs an "Invalid DOM property" error
        // for it on every single page load. The rendered attribute is
        // identical either way — HTML attribute names are case-insensitive.
        hrefLang: l,
        href: absoluteUrl(localizedPath(l, options.subPath)),
      });
    }
    links.push({
      rel: "alternate",
      hrefLang: "x-default",
      href: absoluteUrl(localizedPath(DEFAULT_LOCALE, options.subPath)),
    });
  }

  return { meta, links };
}

/** JSON-LD: the studio as a LocalBusiness / professional service. */
export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_CONFIG.baseUrl}/#organization`,
    name: SITE_CONFIG.company,
    url: SITE_CONFIG.baseUrl,
    email: SITE_CONFIG.companyEmail,
    telephone: SITE_CONFIG.phone,
    description: SITE_CONFIG.description,
    image: absoluteUrl(SITE_CONFIG.ogImagePath),
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/logo.svg"),
      width: 512,
      height: 512,
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: SITE_CONFIG.location.country,
      addressRegion: SITE_CONFIG.location.region,
      addressLocality: SITE_CONFIG.location.city,
      streetAddress: SITE_CONFIG.location.street,
    },
    areaServed: [
      { "@type": "Country", name: "Italy" },
      { "@type": "AdministrativeArea", name: "European Union" },
    ],
    priceRange: "€€€",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: SITE_CONFIG.phone,
      email: SITE_CONFIG.companyEmail,
      availableLanguage: ["it", "en", "de", "es"],
    },
    sameAs: [
      SITE_CONFIG.social.instagram,
      SITE_CONFIG.social.behance,
      SITE_CONFIG.social.github,
      SITE_CONFIG.social.linkedin,
    ],
    knowsLanguage: ["it", "en", "de", "es"],
    knowsAbout: [
      "Web design",
      "Sviluppo siti web",
      "Esperienze web 3D e interattive",
      "Animazioni e motion design",
      "Siti web per hospitality e ristorazione",
      "Ottimizzazione SEO",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Servizi Aura Web Studio",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Web design su misura",
            description:
              "Progettazione e design di siti web editoriali e cinematici per brand italiani.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Sviluppo siti web",
            description:
              "Sviluppo front-end con React, animazioni Framer Motion ed esperienze 3D interattive.",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Siti web per hospitality e ristorazione",
            description:
              "Siti su misura per hotel, ristoranti e brand lifestyle in Alto Adige e in Italia.",
          },
        },
      ],
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
  };
}

/** JSON-LD: the website entity, linked to the organization as publisher. */
export function generateWebsiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_CONFIG.baseUrl}/#website`,
    name: SITE_CONFIG.name,
    url: SITE_CONFIG.baseUrl,
    description: SITE_CONFIG.description,
    inLanguage: ["it", "en", "de", "es"],
    publisher: { "@id": `${SITE_CONFIG.baseUrl}/#organization` },
  };
}
