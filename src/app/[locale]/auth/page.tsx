import type { Metadata } from "next";

import { AuthPage } from "@/components/pages/AuthPage";
import { pageMetadata, DEFAULT_LOCALE } from "@/lib/seo";

export function generateStaticParams() {
  return [{ locale: DEFAULT_LOCALE }];
}

export const metadata: Metadata = pageMetadata({
  title: "Accedi",
  path: "/auth",
  noindex: true,
});

export default function Page() {
  return <AuthPage />;
}
