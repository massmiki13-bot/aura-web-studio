import type { Metadata } from "next";

import { JsonLd } from "@/components/JsonLd";
import { AppsPage } from "@/components/pages/AppsPage";
import { APPS_SEO, BREADCRUMB_LABEL } from "@/lib/page-copy";
import { generateBreadcrumbSchema, pageMetadata, type Locale } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({ subPath: "app", locale, ...APPS_SEO[locale] });
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return (
    <>
      <JsonLd
        data={generateBreadcrumbSchema(locale, [
          { name: BREADCRUMB_LABEL.app[locale], subPath: "app" },
        ])}
      />
      <AppsPage locale={locale} />
    </>
  );
}
