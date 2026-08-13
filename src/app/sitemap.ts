import type { MetadataRoute } from "next";

import { LOCALES, DEFAULT_LOCALE, absoluteUrl, localizedPath } from "@/lib/seo";

/**
 * The sitemap, generated rather than hand-maintained.
 *
 * public/sitemap.xml used to be a static file listing these URLs by hand. It
 * drifted — a static file has no way to know that a locale was added or a
 * route renamed. Built from the same LOCALES and localizedPath() the pages and
 * their canonicals come from, it cannot disagree with them.
 *
 * Each entry carries the full hreflang cluster in `alternates.languages`,
 * which is the machine-readable form of the same relationship the pages state
 * in their <link rel="alternate"> tags. Search engines accept either; stating
 * both is what makes the cluster unambiguous.
 *
 * Private routes (/admin, /auth) and /privacy are absent on purpose: the first
 * two are noindex, and the third is a single-language legal page with no
 * alternates and no reason to compete for crawl budget.
 */

/** Logical sub-paths that exist, translated, in every locale. */
const ROUTES = [
  { subPath: "", priority: 1.0, changeFrequency: "monthly" as const },
  { subPath: "pricing", priority: 0.9, changeFrequency: "monthly" as const },
  { subPath: "team", priority: 0.7, changeFrequency: "yearly" as const },
  { subPath: "contact", priority: 0.8, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return ROUTES.flatMap((route) => {
    const languages = Object.fromEntries(
      LOCALES.map((l) => [l, absoluteUrl(localizedPath(l, route.subPath))]),
    );

    return LOCALES.map((locale) => ({
      url: absoluteUrl(localizedPath(locale, route.subPath)),
      lastModified,
      changeFrequency: route.changeFrequency,
      // The default locale is the one that should rank; the translations are
      // alternates of it, not competitors with it.
      priority: locale === DEFAULT_LOCALE ? route.priority : route.priority - 0.1,
      alternates: { languages },
    }));
  });
}
