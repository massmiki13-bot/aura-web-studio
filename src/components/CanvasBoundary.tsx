"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

import { markBootReady } from "@/lib/boot";

/**
 * Error boundary for the decorative canvases.
 *
 * The home page runs several WebGL contexts at once — the intro, the hero's
 * shader background, the hero's chrome blob, the Spline scene. Browsers cap
 * how many can be live, drivers lose contexts under memory pressure, and
 * three.js throws when it is asked to render into one that has gone away. With
 * nothing between those canvases and the router, a single lost context takes
 * the *entire page* down to the error boundary — a black page reading
 * "This page didn't load", because a background animation failed.
 *
 * That trade is never worth making. Every one of these layers is decoration:
 * if it can't run, the correct outcome is that it isn't there, on a page that
 * otherwise works.
 *
 * `releaseBootGateOnError` covers the one layer something else waits on: the
 * intro holds the page's boot gate, so if it dies the gate has to be opened by
 * hand or the whole site stays behind a black curtain. It is a boolean rather
 * than the callback it used to be because the only caller is now a server
 * component, and functions do not cross that boundary — a prop that cannot be
 * serialized is a build error, not a runtime surprise.
 */
export class CanvasBoundary extends Component<
  { children: ReactNode; label: string; releaseBootGateOnError?: boolean },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(`[${this.props.label}] disabled after an error:`, error, info.componentStack);
    if (this.props.releaseBootGateOnError) markBootReady();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
