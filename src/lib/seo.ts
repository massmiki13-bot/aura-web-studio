/**
 * SEO Configuration & Utilities
 * Centralized SEO metadata for consistent configuration across the site
 */

export const SITE_CONFIG = {
  baseUrl: "https://aura-webstudio.com",
  title: "Aura Web Studio — Creative Digital Solutions Made in Italy",
  description:
    "Award-winning web design and development studio. We craft cinematic digital experiences for Italian hospitality, restaurants, and lifestyle brands using React, Framer Motion, and cutting-edge web technologies.",
  shortDescription: "Creative web design & development for Italian hospitality brands",
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
    "creative digital solutions",
  ],
  author: "Aura Web Studio",
  company: "Aura Web Studio",
  companyEmail: "info@aura-webstudio.com",
  phone: "+39 345 7454180",
  social: {
    instagram: "https://instagram.com/aurawebstudio",
    behance: "https://behance.net/aurawebstudio",
    github: "https://github.com/aurawebstudio",
    twitter: "@aurawebstudio",
  },
  location: {
    country: "Italy",
    city: "Bolzano",
    region: "Trentino-Alto Adige",
  },
  locale: "it_IT",
  alternateLocales: ["en_US", "de_DE"],
  ogImage: "https://aura-webstudio.com/og-image.png",
  ogImageAlt: "Aura Web Studio - Creative Digital Solutions",
  ogImageWidth: 1200,
  ogImageHeight: 630,
  twitterHandle: "@aurawebstudio",
};

/**
 * Generate head metadata for a page
 */
export function generateMetaTags(overrides?: {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  type?: "website" | "article" | "profile";
}) {
  const title = overrides?.title || SITE_CONFIG.title;
  const description = overrides?.description || SITE_CONFIG.description;
  const canonical = overrides?.canonical || SITE_CONFIG.baseUrl;
  const ogImage = overrides?.ogImage || SITE_CONFIG.ogImage;
  const ogTitle = overrides?.ogTitle || title;
  const ogDescription = overrides?.ogDescription || description;

  return [
    { charSet: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
    { httpEquiv: "x-ua-compatible", content: "ie=edge" },
    { name: "title", content: title },
    { name: "description", content: description },
    { name: "keywords", content: SITE_CONFIG.keywords.join(", ") },
    { name: "author", content: SITE_CONFIG.author },
    { name: "creator", content: SITE_CONFIG.company },
    { name: "subject", content: SITE_CONFIG.description },
    {
      name: "robots",
      content: "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1",
    },
    { name: "googlebot", content: "index, follow" },
    { name: "google-site-verification", content: "" }, // Add your Google verification code
    { name: "msvalidate.01", content: "" }, // Add your Bing verification code
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
      content: locale,
    })),
  ];
}

/**
 * Generate link tags for head (favicon, preconnect, etc.)
 */
export function generateLinkTags() {
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
    { rel: "sitemap", type: "application/xml", href: "/sitemap.xml" },
  ];
}

/**
 * Generate JSON-LD structured data for Organization
 */
export function generateOrganizationSchema() {
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
      height: 512,
    },
    address: {
      "@type": "PostalAddress",
      addressCountry: SITE_CONFIG.location.country,
      addressRegion: SITE_CONFIG.location.region,
      addressLocality: SITE_CONFIG.location.city,
    },
    areaServed: [
      { "@type": "Country", name: "Italy" },
      { "@type": "Country", name: "European Union" },
    ],
    priceRange: "$$$",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Customer Service",
      telephone: SITE_CONFIG.phone,
      email: SITE_CONFIG.companyEmail,
      availableLanguage: ["it", "en", "de"],
    },
    sameAs: [SITE_CONFIG.social.instagram, SITE_CONFIG.social.behance, SITE_CONFIG.social.github],
    knowsLanguage: [
      { "@type": "Language", name: "Italian" },
      { "@type": "Language", name: "English" },
      { "@type": "Language", name: "German" },
    ],
    workingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
  };
}

/**
 * Generate JSON-LD for WebSite with search action
 */
export function generateWebsiteSchema() {
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
        urlTemplate: `${SITE_CONFIG.baseUrl}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Get canonical URL for a page
 */
export function getCanonical(path: string): string {
  return `${SITE_CONFIG.baseUrl}${path}`;
}
