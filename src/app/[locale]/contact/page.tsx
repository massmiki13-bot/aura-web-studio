import type { Metadata } from "next";

import { JsonLd } from "@/components/JsonLd";
import { ContactPage } from "@/components/pages/ContactPage";
import { BREADCRUMB_LABEL, CONTACT_SEO } from "@/lib/page-copy";
import { generateBreadcrumbSchema, pageMetadata, type Locale } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({ subPath: "contact", locale, ...CONTACT_SEO[locale] });
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return (
    <>
      <JsonLd
        data={generateBreadcrumbSchema(locale, [
          { name: BREADCRUMB_LABEL.contact[locale], subPath: "contact" },
        ])}
      />
      <ContactPage locale={locale} />
    </>
  );
}
