import type { Metadata } from "next";

import { HomePage } from "@/components/pages/HomePage";
import { HOME_TITLE, HOME_DESCRIPTION } from "@/lib/page-copy";
import { pageMetadata, SITE_CONFIG, type Locale } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({
    subPath: "",
    locale,
    // Stated absolutely rather than through the "%s — Aura Web Studio"
    // template: the Italian default already carries the brand, and the
    // translated ones are written to stand alone.
    absoluteTitle: HOME_TITLE[locale] ?? SITE_CONFIG.defaultTitle,
    description: HOME_DESCRIPTION[locale],
  });
}

export default function Page() {
  return <HomePage />;
}
