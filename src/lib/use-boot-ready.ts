"use client";

import { useEffect, useState } from "react";

import {
  armFailsafe,
  introWillPlay,
  isBootReady,
  onBootReady,
  openGateAfterFirstPaint,
} from "@/lib/boot";

/**
 * Subscribes a component to the boot gate. Starts false on the server and on
 * the hydration pass, then flips once — so the heavy children simply aren't in
 * the tree until it's their turn.
 *
 * Split out of @/lib/boot so that module can stay React-free and importable
 * from the root layout, which is a server component and needs the pre-paint
 * curtain script out of it.
 */
export function useBootReady(): boolean {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!isBootReady()) {
      // No curtain to hide behind: open on our own, just after first paint.
      if (introWillPlay()) armFailsafe();
      else openGateAfterFirstPaint();
    }
    return onBootReady(() => setOpen(true));
  }, []);
  return open;
}
