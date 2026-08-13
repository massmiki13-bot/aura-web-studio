import type { Metadata } from "next";

import { PricingPage } from "@/components/pages/PricingPage";
import { PRICING_SEO } from "@/lib/page-copy";
import { pageMetadata, type Locale } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({ subPath: "pricing", locale, ...PRICING_SEO[locale] });
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return <PricingPage locale={locale} />;
}
