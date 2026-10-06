import type { Metadata } from "next";

import { JsonLd } from "@/components/JsonLd";
import { WorksPage } from "@/components/pages/WorksPage";
import { BREADCRUMB_LABEL, WORKS_SEO } from "@/lib/page-copy";
import { generateBreadcrumbSchema, pageMetadata, type Locale } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({ subPath: "lavori", locale, ...WORKS_SEO[locale] });
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return (
    <>
      <JsonLd
        data={generateBreadcrumbSchema(locale, [
          { name: BREADCRUMB_LABEL.lavori[locale], subPath: "lavori" },
        ])}
      />
      <WorksPage locale={locale} />
    </>
  );
}
