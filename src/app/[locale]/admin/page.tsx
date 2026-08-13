import type { Metadata } from "next";

import { AdminPage } from "@/components/pages/AdminPage";
import { pageMetadata, DEFAULT_LOCALE } from "@/lib/seo";

/**
 * The back office. Italian only, noindex, and entirely client-rendered — it
 * reads a Supabase session that lives in browser storage, so there is nothing
 * for the server to render but the shell. Under TanStack this was `ssr: false`
 * on the route; here it falls out of the page body being a client component
 * with all of its data fetched in an effect.
 */
export function generateStaticParams() {
  return [{ locale: DEFAULT_LOCALE }];
}

export const metadata: Metadata = pageMetadata({
  title: "Admin · Richieste",
  path: "/admin",
  noindex: true,
});

export default function Page() {
  return <AdminPage />;
}
