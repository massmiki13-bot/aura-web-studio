import type { Metadata } from "next";

import { TeamPage } from "@/components/pages/TeamPage";
import { TEAM_SEO } from "@/lib/page-copy";
import { pageMetadata, type Locale } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({ subPath: "team", locale, type: "profile", ...TEAM_SEO[locale] });
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return <TeamPage locale={locale} />;
}
