import type { Metadata } from "next";

import { PrivacyPage } from "@/components/pages/PrivacyPage";
import { pageMetadata, DEFAULT_LOCALE } from "@/lib/seo";

/**
 * Italian only. The policy is a legal document that exists in one language,
 * so there is no /de/privacy to generate — and with `dynamicParams: false`
 * inherited from the root layout, asking for one is a 404 rather than an
 * Italian page served under a German URL.
 *
 * That also means no `subPath`, so no hreflang cluster is emitted: there are
 * no alternates to point at.
 */
export function generateStaticParams() {
  return [{ locale: DEFAULT_LOCALE }];
}

export const metadata: Metadata = pageMetadata({
  title: "Privacy e Cookie Policy",
  path: "/privacy",
  description:
    "Informativa sulla privacy e sui cookie di Aura Web Studio, ai sensi del Regolamento UE 2016/679 (GDPR).",
});

export default function Page() {
  return <PrivacyPage />;
}
