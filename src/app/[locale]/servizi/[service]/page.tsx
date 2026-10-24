import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/JsonLd";
import { ServiceDetailPage } from "@/components/pages/ServicesPages";
import {
  SITE_CONFIG,
  absoluteUrl,
  generateBreadcrumbSchema,
  localizedPath,
  pageMetadata,
  type Locale,
} from "@/lib/seo";
import {
  SERVICES,
  SERVICES_SUBPATH,
  SERVICES_UI,
  getService,
  serviceSubPath,
} from "@/lib/services";

type Props = { params: Promise<{ locale: Locale; service: string }> };

export function generateStaticParams() {
  return SERVICES.map((s) => ({ service: s.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, service } = await params;
  const s = getService(service);
  if (!s) return {};
  const { title, description } = s.copy[locale];
  return pageMetadata({ subPath: serviceSubPath(s.slug), locale, title, description });
}

export default async function Page({ params }: Props) {
  const { locale, service } = await params;
  const s = getService(service);
  if (!s) notFound();
  const c = s.copy[locale];
  const url = absoluteUrl(localizedPath(locale, serviceSubPath(s.slug)));

  return (
    <>
      <JsonLd
        data={generateBreadcrumbSchema(locale, [
          { name: SERVICES_UI[locale].navLabel, subPath: SERVICES_SUBPATH },
          { name: c.name, subPath: serviceSubPath(s.slug) },
        ])}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: c.name,
          description: c.description,
          url,
          serviceType: c.name,
          provider: { "@id": `${SITE_CONFIG.baseUrl}/#organization` },
          areaServed: [
            { "@type": "City", name: "Bolzano" },
            { "@type": "AdministrativeArea", name: "Alto Adige / Südtirol" },
            { "@type": "Country", name: "Italia" },
          ],
          inLanguage: locale,
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: c.faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
      <ServiceDetailPage locale={locale} service={s} />
    </>
  );
}
