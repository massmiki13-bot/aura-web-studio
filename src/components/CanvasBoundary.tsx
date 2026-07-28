import { Component, type ErrorInfo, type ReactNode } from "react";

/**
 * Error boundary for the decorative canvases.
 *
 * The home page runs several WebGL contexts at once — the intro, the hero's
 * shader background, the hero's chrome blob, the Spline scene. Browsers cap
 * how many can be live, drivers lose contexts under memory pressure, and
 * three.js throws when it is asked to render into one that has gone away. With
 * nothing between those canvases and the router, a single lost context takes
 * the *entire site* down to the root error component — a black page reading
 * "This page didn't load", because a background animation failed.
 *
 * That trade is never worth making. Every one of these layers is decoration:
 * if it can't run, the correct outcome is that it isn't there, on a page that
 * otherwise works. `onError` exists for layers that something else is waiting
 * on (the intro holds the page's boot gate), so a failure still releases it.
 */
export class CanvasBoundary extends Component<
  { children: ReactNode; label: string; onError?: () => void },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[${this.props.label}] disabled after an error:`, error, info.componentStack);
    this.props.onError?.();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
