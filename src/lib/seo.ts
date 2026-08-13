import type { Metadata, Viewport } from "next";

import { LANGUAGES, DEFAULT_LANGUAGE, type LanguageCode } from "@/i18n";

/**
 * SEO configuration and metadata builders — the single source of truth for
 * every tag the site puts in its head.
 *
 * This used to hand-roll arrays of meta/link descriptors for TanStack's
 * `head()`. Next resolves metadata itself: it dedupes across the layout/page
 * boundary, resolves relative URLs against `metadataBase`, and renders
 * canonical, hreflang, Open Graph and Twitter from structured fields rather
 * than from a list of tag literals. So the job here is to describe pages, not
 * to emit tags — which is why there is no longer any function returning
 * `{ meta, links }`.
 *
 * To change the production domain, set NEXT_PUBLIC_SITE_URL. robots.txt and
 * the sitemap are generated from this file (app/robots.ts, app/sitemap.ts) and
 * follow automatically — they used to be static files in /public that had to
 * be remembered separately, and drifted.
 */

/** Normalized (no trailing slash) so joins never double up. */
const RAW_BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://showoff-project.vercel.app";

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
    "Next.js",
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

export const LOCALES: readonly LanguageCode[] = LANGUAGES.map((l) => l.code);
export type Locale = LanguageCode;
export const DEFAULT_LOCALE: Locale = DEFAULT_LANGUAGE;

/** OG locale strings, keyed the way Open Graph wants them. */
const OG_LOCALE: Record<Locale, string> = {
  it: "it_IT",
  de: "de_DE",
  en: "en_US",
  es: "es_ES",
};

/** Absolute URL for a site-relative path. */
export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE_CONFIG.baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * The public path for a logical sub-path in a given locale ("" for home).
 *
 * The default locale is unprefixed — see @/proxy, which is what makes that
 * true at request time. No trailing slash on locale-home paths ("/de", not
 * "/de/"): canonical and hreflang have to name the URL that actually answers,
 * not one that redirects to it.
 */
export function localizedPath(locale: Locale, subPath = ""): string {
  const clean = subPath.replace(/^\/+/, "");
  if (locale === DEFAULT_LOCALE) return clean ? `/${clean}` : "/";
  return clean ? `/${locale}/${clean}` : `/${locale}`;
}

/**
 * Site-wide metadata, applied once in the root layout.
 *
 * Everything here is inherited by every page unless that page overrides it,
 * so none of it should ever be repeated further down the tree.
 */
export const rootMetadata: Metadata = {
  // Lets every other field in this file use site-relative paths and still
  // render as absolute URLs, which og:image and canonical both require.
  metadataBase: new URL(SITE_CONFIG.baseUrl),
  title: {
    default: SITE_CONFIG.defaultTitle,
    // Pages set a bare title ("Piani e Prezzi") and the brand is appended
    // here, so the suffix is written once rather than at every call site.
    template: `%s — ${SITE_CONFIG.titleSuffix}`,
  },
  description: SITE_CONFIG.description,
  applicationName: SITE_CONFIG.name,
  keywords: [...SITE_CONFIG.keywords],
  authors: [{ name: SITE_CONFIG.author }],
  creator: SITE_CONFIG.company,
  publisher: SITE_CONFIG.company,
  formatDetection: { telephone: false },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: SITE_CONFIG.name,
    locale: SITE_CONFIG.locale,
    alternateLocale: [...SITE_CONFIG.alternateLocales],
  },
  twitter: { card: "summary_large_image" },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", type: "image/png", sizes: "32x32" },
      { url: "/favicon-16x16.png", type: "image/png", sizes: "16x16" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Aura Studio",
    statusBarStyle: "black-translucent",
  },
  other: {
    "msapplication-TileColor": "#000000",
    "msapplication-config": "/browserconfig.xml",
  },
  ...(SITE_CONFIG.verification.google || SITE_CONFIG.verification.bing
    ? {
        verification: {
          ...(SITE_CONFIG.verification.google ? { google: SITE_CONFIG.verification.google } : {}),
          ...(SITE_CONFIG.verification.bing
            ? { other: { "msvalidate.01": SITE_CONFIG.verification.bing } }
            : {}),
        },
      }
    : {}),
};

/**
 * Viewport and theme, which Next requires as their own export rather than as
 * part of `metadata` — they are resolved on a different pass.
 */
export const rootViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#000000",
  colorScheme: "dark light",
};

export type PageSeoOptions = {
  /** Page title without the brand suffix. Omit for the homepage. */
  title?: string;
  /** Set instead of `title` to bypass the "— Aura Web Studio" template. */
  absoluteTitle?: string;
  description?: string;
  /** Site-relative path, e.g. "/privacy". Ignored when `subPath` is set. */
  path?: string;
  /**
   * Logical sub-path shared across locales ("" for home, "pricing" for
   * /pricing). When set, canonical is derived from `locale` and hreflang
   * alternates are emitted for every locale plus x-default. Only pass this for
   * pages that genuinely exist in every language.
   */
  subPath?: string;
  locale?: Locale;
  image?: string;
  type?: "website" | "article" | "profile";
  /** Private pages (admin/auth) — keeps them out of the index. */
  noindex?: boolean;
};

/** Per-page metadata: canonical, hreflang, Open Graph, Twitter, robots. */
export function pageMetadata(options: PageSeoOptions = {}): Metadata {
  const locale = options.locale ?? DEFAULT_LOCALE;
  const description = options.description ?? SITE_CONFIG.description;
  const path =
    options.subPath !== undefined ? localizedPath(locale, options.subPath) : (options.path ?? "/");
  const url = absoluteUrl(path);
  const image = absoluteUrl(options.image ?? SITE_CONFIG.ogImagePath);

  const title: Metadata["title"] = options.absoluteTitle
    ? { absolute: options.absoluteTitle }
    : (options.title ?? { absolute: SITE_CONFIG.defaultTitle });

  const languages: Record<string, string> = {};
  if (options.subPath !== undefined && !options.noindex) {
    for (const l of LOCALES) languages[l] = absoluteUrl(localizedPath(l, options.subPath));
    languages["x-default"] = absoluteUrl(localizedPath(DEFAULT_LOCALE, options.subPath));
  }

  return {
    title,
    description,
    alternates: {
      // Deliberately absent on noindex pages: advertising a canonical for a
      // page we are asking not to be indexed is a contradictory signal.
      ...(options.noindex ? {} : { canonical: url }),
      ...(Object.keys(languages).length ? { languages } : {}),
    },
    ...(options.noindex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      type: options.type ?? "website",
      url,
      title: typeof title === "string" ? `${title} — ${SITE_CONFIG.titleSuffix}` : title.absolute,
      description,
      locale: OG_LOCALE[locale],
      images: [
        {
          url: image,
          width: SITE_CONFIG.ogImageWidth,
          height: SITE_CONFIG.ogImageHeight,
          alt: SITE_CONFIG.ogImageAlt,
        },
      ],
    },
    twitter: {
      title: typeof title === "string" ? `${title} — ${SITE_CONFIG.titleSuffix}` : title.absolute,
      description,
      images: [{ url: image, alt: SITE_CONFIG.ogImageAlt }],
    },
  };
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
