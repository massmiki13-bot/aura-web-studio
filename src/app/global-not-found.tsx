import type { Metadata } from "next";

import "@/styles.css";
import { fontDisplay, fontSans } from "@/lib/fonts";
import { NotFoundPage } from "@/components/pages/NotFoundPage";
import { DEFAULT_LOCALE } from "@/lib/seo";

/**
 * The 404 for a URL that matched no route at all.
 *
 * app/[locale]/not-found.tsx cannot serve this case: it renders *inside* the
 * locale layout, and a request that never resolved to a locale segment has no
 * layout to render inside. Next hands those to this file instead, which is why
 * it builds the whole document — <html>, <body>, fonts and stylesheet — rather
 * than just a fragment.
 *
 * Italian, unconditionally. There is no locale to read off a URL that didn't
 * match one, and guessing from Accept-Language would make this page dynamic
 * for the sake of a message the visitor is about to navigate away from.
 */
export const metadata: Metadata = {
  title: "Pagina non trovata — Aura Web Studio",
  robots: { index: false, follow: false },
};

export default function GlobalNotFound() {
  return (
    <html lang={DEFAULT_LOCALE} className={`${fontDisplay.variable} ${fontSans.variable}`}>
      <body>
        <NotFoundPage />
      </body>
    </html>
  );
}
