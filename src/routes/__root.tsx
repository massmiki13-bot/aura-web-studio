import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { getLocaleFromPathname } from "../i18n";
import { Toaster } from "@/components/ui/sonner";
import { SmoothScroll } from "@/components/SmoothScroll";
import { INTRO_CURTAIN_SCRIPT } from "@/lib/boot";
import {
  rootMeta,
  rootLinks,
  buildTitle,
  SITE_CONFIG,
  generateOrganizationSchema,
  generateWebsiteSchema,
} from "../lib/seo";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          {/* Plain anchor, not <Link to>: the router's typed paths don't
              include a bare "/" now that the index route carries the
              optional {-$locale} param, and a 404 has no locale of its own
              to resolve it from anyway. */}
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          This page didn't load
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong on our end. You can try refreshing or head back home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      // Site-wide defaults; individual routes override title/description/canonical.
      { title: buildTitle() },
      { name: "description", content: SITE_CONFIG.description },
      ...rootMeta(),
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      ...rootLinks(),
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
      },
    ],
    scripts: [
      {
        // Must run before the body paints — see INTRO_CURTAIN_SCRIPT.
        children: INTRO_CURTAIN_SCRIPT,
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(generateOrganizationSchema()),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(generateWebsiteSchema()),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  // Derived from the URL (not client state), so it's identical on the server
  // render and the client hydration pass — no mismatch, no effect needed.
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const lang = getLocaleFromPathname(pathname);
  return (
    // This app hydrates the <html> element itself, and several things write to
    // it before or during hydration: the pre-paint curtain class (see
    // INTRO_CURTAIN_SCRIPT), Lenis's own classes, the intro's scroll lock.
    // None of them are React's to reconcile, but React compares the attributes
    // it rendered against what it finds — and a mismatch on the root element
    // makes it throw the server tree away and re-render the whole shell, which
    // surfaces as the root error component. Suppression here covers only this
    // element's own attributes, not its descendants.
    <html lang={lang} suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body suppressHydrationWarning>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <SmoothScroll />
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
      <Toaster theme="dark" position="bottom-right" />
    </QueryClientProvider>
  );
}
