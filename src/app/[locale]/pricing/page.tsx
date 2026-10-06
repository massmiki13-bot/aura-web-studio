import type { Metadata } from "next";

import { JsonLd } from "@/components/JsonLd";
import { PricingPage } from "@/components/pages/PricingPage";
import { BREADCRUMB_LABEL, PRICING_SEO } from "@/lib/page-copy";
import { generateBreadcrumbSchema, pageMetadata, type Locale } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({ subPath: "pricing", locale, ...PRICING_SEO[locale] });
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return (
    <>
      <JsonLd
        data={generateBreadcrumbSchema(locale, [
          { name: BREADCRUMB_LABEL.pricing[locale], subPath: "pricing" },
        ])}
      />
      <PricingPage locale={locale} />
    </>
  );
}
