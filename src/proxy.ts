import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LANGUAGE, PREFIXED_LANGUAGES } from "@/i18n";

/**
 * Locale routing, and the reason the app tree can be a single `[locale]`
 * segment while the URLs stay what they have always been.
 *
 * Italian is the default and lives unprefixed: "/", "/pricing", "/team". The
 * other three carry a prefix: "/de/pricing", "/en/team". Those URLs are
 * already indexed, already in the sitemap, and already carry whatever ranking
 * this site has — so they are the fixed point of this migration, not something
 * to be tidied into a uniform "/it/..." scheme.
 *
 * Two rules make that work:
 *
 * 1. An unprefixed path is *rewritten* (not redirected) onto its Italian
 *    equivalent. "/pricing" is served by /it/pricing while the address bar,
 *    the canonical tag and every link keep saying "/pricing".
 * 2. An explicit "/it/..." path is *redirected*, permanently, to the
 *    unprefixed form. Without this the same page would answer on two URLs,
 *    which is the duplicate content the unprefixed scheme exists to avoid.
 *
 * Anything already carrying a real prefix falls through untouched.
 */

// `/it`, `/it/`, `/it/anything` — but not `/italy`.
const EXPLICIT_DEFAULT = new RegExp(`^/${DEFAULT_LANGUAGE}(?=/|$)`);
const PREFIXED = new RegExp(`^/(?:${PREFIXED_LANGUAGES.join("|")})(?=/|$)`);

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (EXPLICIT_DEFAULT.test(pathname)) {
    const url = request.nextUrl.clone();
    // Strip the prefix. "/it" alone leaves an empty string, which is not a
    // valid path — it has to become "/".
    url.pathname = pathname.replace(EXPLICIT_DEFAULT, "") || "/";
    // 308, not 307: this is a permanent fact about the URL scheme, and a
    // permanent redirect is what consolidates link equity onto the canonical
    // form rather than leaving it split.
    return NextResponse.redirect(url, 308);
  }

  if (PREFIXED.test(pathname)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LANGUAGE}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  /**
   * Everything except the build output, the metadata routes and any request
   * that already names a file.
   *
   * The file-extension exclusion is what keeps /favicon.ico, /og-image.png and
   * the project photography out of here: matched, they would be rewritten to
   * /it/og-image.png and 404. Route handlers that Next generates from
   * app/robots.ts and app/sitemap.ts are named explicitly for the same reason
   * — they live at the site root, not under a locale.
   */
  matcher: ["/((?!_next/|api/|robots\\.txt|sitemap\\.xml|manifest\\.webmanifest|.*\\.[\\w]+$).*)"],
};
