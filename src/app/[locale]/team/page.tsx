import type { Metadata } from "next";

import { JsonLd } from "@/components/JsonLd";
import { TeamPage } from "@/components/pages/TeamPage";
import { BREADCRUMB_LABEL, TEAM_SEO } from "@/lib/page-copy";
import { generateBreadcrumbSchema, pageMetadata, type Locale } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return pageMetadata({ subPath: "team", locale, type: "profile", ...TEAM_SEO[locale] });
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  return (
    <>
      <JsonLd
        data={generateBreadcrumbSchema(locale, [
          { name: BREADCRUMB_LABEL.team[locale], subPath: "team" },
        ])}
      />
      <TeamPage locale={locale} />
    </>
  );
}
