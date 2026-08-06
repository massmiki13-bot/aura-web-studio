import { useEffect, useState } from "react";

/**
 * A DOM node for full-screen overlays to portal into, deliberately *not*
 * `document.body`.
 *
 * This app hydrates `<html>` itself, so `<body>` is a React-rendered element
 * with React-owned children (the route tree, then `<Scripts />` — see
 * routes/__root.tsx). Portalling into a container React also reconciles is the
 * classic source of `NotFoundError: Failed to execute 'insertBefore' on 'Node'`:
 * React computes an insertion anchor from its fiber tree, but the portal has
 * meanwhile added and removed siblings React never recorded, so the anchor it
 * reaches for is no longer a child of `<body>`. It throws, the error escapes to
 * the root error boundary, and the whole page is replaced by "This page didn't
 * load" — which is what the mobile menu was intermittently doing on the home
 * page, where GSAP's pin-spacer perturbs that same child list.
 *
 * The container is created imperatively, once, and appended after the elements
 * React owns. React only ever reconciles *inside* it, never the `<body>` child
 * list — so there is nothing left for the two to disagree about.
 */
const ROOT_ID = "aura-overlay-root";

export function useOverlayRoot(): HTMLElement | null {
  const [root, setRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    let el = document.getElementById(ROOT_ID);
    if (!el) {
      el = document.createElement("div");
      el.id = ROOT_ID;
      // Not a layout participant: overlays inside it position themselves
      // `fixed`, and a zero-size static wrapper keeps it out of flow entirely.
      document.body.appendChild(el);
    }
    setRoot(el);
    // Deliberately never removed — it is shared by every overlay on the page
    // and costs one empty div.
  }, []);

  return root;
}
