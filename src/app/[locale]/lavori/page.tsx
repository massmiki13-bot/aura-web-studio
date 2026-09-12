import type { Metadata } from "next";

import { WorksPage } from "@/components/pages/WorksPage";
import { WORKS_SEO } from "@/lib/page-copy";
import { pageMetadata, type Locale } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({ subPath: "lavori", locale, ...WORKS_SEO[locale] });
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return <WorksPage locale={locale} />;
}
