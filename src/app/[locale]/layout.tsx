import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import "@/styles.css";
import { fontDisplay, fontSans } from "@/lib/fonts";
import { I18nProvider } from "@/i18n/provider";
import { LANGUAGES, isLanguageCode } from "@/i18n";
import { INTRO_CURTAIN_SCRIPT } from "@/lib/boot";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CustomCursor } from "@/components/CustomCursor";
import { Toaster } from "@/components/ui/sonner";
import {
  rootMetadata,
  rootViewport,
  generateOrganizationSchema,
  generateWebsiteSchema,
} from "@/lib/seo";

/**
 * The root layout — the only one, despite living under a dynamic segment.
 *
 * There is deliberately no app/layout.tsx above this. `<html lang>` has to
 * carry the real language of the document, and a layout above the [locale]
 * segment cannot know what that is; the alternatives are reading a header
 * (which opts the whole site out of static generation) or duplicating the
 * shell per locale. Next treats the topmost layout as the root, so putting it
 * here gets a correct `lang` on a fully static page.
 *
 * Italian is reached at unprefixed URLs — "/" and "/pricing" are rewritten
 * onto this segment by @/proxy — so the URL a visitor sees never contains the
 * locale that this layout is keyed on.
 */

export const metadata = rootMetadata;
export const viewport = rootViewport;

/**
 * Every page under here is prerendered at build time, in all four languages.
 * `dynamicParams: false` closes the set: a request for a locale that is not
 * one of these is a 404 rather than an on-demand render of a language that
 * does not exist.
 */
export function generateStaticParams() {
  return LANGUAGES.map((l) => ({ locale: l.code }));
}
export const dynamicParams = false;

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLanguageCode(locale)) notFound();

  return (
    <html
      lang={locale}
      className={`${fontDisplay.variable} ${fontSans.variable}`}
      // Several things write to this element before or during hydration: the
      // pre-paint curtain class below, Lenis's own classes, the intro's scroll
      // lock, the custom cursor's `has-custom-cursor`. None of them are React's
      // to reconcile, and a mismatch on the root element is not a recoverable
      // one. Suppression covers this element's own attributes, not its subtree.
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        {/*
          The first-load curtain, and the one script that genuinely cannot wait.

          The page is server-rendered, so on a cold visit the finished hero is
          in the HTML long before React hydrates and the intro can mount.
          Without this the visitor sees the hero, then a curtain drops over it
          — which gives the whole intro away. This adds `intro-pending` to
          <html> so the shim in styles.css holds black from the first frame.

          A raw inline script as the first child of <body>, not next/script:
          the parser runs it the moment it reaches it, before any of the
          markup below has been parsed, let alone painted. That ordering is a
          property of HTML itself rather than of a loading strategy, which is
          the only guarantee strong enough for something whose whole job is to
          beat the first paint.
        */}
        <script dangerouslySetInnerHTML={{ __html: INTRO_CURTAIN_SCRIPT }} />

        <I18nProvider locale={locale}>
          <SmoothScroll />
          <CustomCursor />
          {children}
          <Toaster theme="dark" position="bottom-right" />
        </I18nProvider>

        {/* Structured data. Rendered once for the whole site, from the same
            SITE_CONFIG the metadata is built from, so the two cannot drift. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateOrganizationSchema()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateWebsiteSchema()) }}
        />
      </body>
    </html>
  );
}
