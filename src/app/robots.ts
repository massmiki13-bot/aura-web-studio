import type { MetadataRoute } from "next";

import { IS_INDEXABLE, absoluteUrl } from "@/lib/seo";

/**
 * robots.txt, generated from the same SITE_CONFIG as everything else — so the
 * sitemap URL it advertises follows the domain automatically instead of being
 * a string in a static file that someone has to remember to update.
 */
export default function robots(): MetadataRoute.Robots {
  // Preview and development deployments: closed to every crawler, and no
  // sitemap advertised. The pages also send noindex (see rootMetadata) —
  // this stops them being fetched in the first place.
  if (!IS_INDEXABLE) return { rules: [{ userAgent: "*", disallow: "/" }] };

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Neither is indexable anyway (both send noindex), but saying so here
        // spends no crawl budget discovering that.
        disallow: ["/admin", "/auth"],
      },
    ],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/").replace(/\/$/, ""),
  };
}
