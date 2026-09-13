"use client";

import type { ReactNode } from "react";

import { useIsDesktopViewport } from "@/hooks/use-desktop-viewport";

/**
 * The one place the desktop site and the phone site part ways.
 *
 * Everything above `md` keeps rendering exactly what it rendered before this
 * split existed; everything below gets the components under
 * `@/components/mobile`. The desktop section components are not edited at all
 * — that is the whole point, and it is checkable: `git diff` against the
 * commit before the mobile rebuild must come back empty for every file under
 * `@/components/aura` and `@/components/three`.
 *
 * Renders `mobile` while the media query is still unmeasured (`null`), which
 * makes the phone version the one that ships in the server's HTML. Two
 * consequences worth knowing:
 *
 *   - Search engines and link previews read the mobile markup. Since both
 *     trees are driven from the same `@/i18n` keys, the words are identical,
 *     so this costs nothing in SEO and avoids emitting two copies of the copy
 *     (and two <h1>s) into one document.
 *   - A desktop visitor gets one swap just after hydration. The site already
 *     behaved this way — `Hero` has gated its WebGL layers on the same hook
 *     since before this change — so it is not a new class of flash, but it is
 *     why `desktop` must never be rendered alongside `mobile`.
 *
 * Both branches are passed as already-built elements rather than as component
 * types, so whichever one loses is simply never mounted: no effects, no
 * canvases, no scroll triggers.
 */
export function ViewportSwitch({ desktop, mobile }: { desktop: ReactNode; mobile: ReactNode }) {
  const isDesktop = useIsDesktopViewport();
  return <>{isDesktop === true ? desktop : mobile}</>;
}
