import type { Metadata } from "next";

import { JsonLd } from "@/components/JsonLd";
import { ServicesHubPage } from "@/components/pages/ServicesPages";
import { generateBreadcrumbSchema, pageMetadata, type Locale } from "@/lib/seo";
import { SERVICES_HUB, SERVICES_SUBPATH, SERVICES_UI } from "@/lib/services";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const { title, description } = SERVICES_HUB[locale];
  return pageMetadata({ subPath: SERVICES_SUBPATH, locale, title, description });
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return (
    <>
      <JsonLd
        data={generateBreadcrumbSchema(locale, [
          { name: SERVICES_UI[locale].navLabel, subPath: SERVICES_SUBPATH },
        ])}
      />
      <ServicesHubPage locale={locale} />
    </>
  );
}
