import type { Metadata } from "next";

import { ContactPage } from "@/components/pages/ContactPage";
import { CONTACT_SEO } from "@/lib/page-copy";
import { pageMetadata, type Locale } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({ subPath: "contact", locale, ...CONTACT_SEO[locale] });
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return <ContactPage locale={locale} />;
}
