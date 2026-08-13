"use client";

import {
  useRef,
  type ComponentType,
  type ReactNode,
  type MouseEvent,
  type ButtonHTMLAttributes,
} from "react";
import { motion } from "framer-motion";

interface MagneticButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  strength?: number;
  as?: "div" | "a" | "button";
  href?: string;
}

function isTouchDevice() {
  if (typeof window === "undefined") return false;
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

export function MagneticButton({
  children,
  className = "",
  strength = 0.4,
  as: As = "div",
  type = "button",
  ...rest
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  function handleMove(e: MouseEvent) {
    // Disable magnetic effect on touch devices — mouseMove fires inconsistently
    // and can leave the button stuck in a translated position
    if (isTouchDevice()) return;
    if (!ref.current || !inner.current) return;
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    inner.current.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
  }
  function reset() {
    if (inner.current) inner.current.style.transform = "translate(0,0)";
  }

  // motion.div / motion.a / motion.button have genuinely different prop types,
  // and `As` is only known at runtime — so the union cannot be resolved
  // statically. ComponentType<Record<string, unknown>> keeps the escape hatch
  // narrow: it says "some component taking arbitrary props", which is true,
  // instead of `any`, which switches type checking off for everything below.
  const Comp = motion[As] as ComponentType<Record<string, unknown>>;
  return (
    <Comp
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      className={className}
      type={As === "button" ? type : undefined}
      {...rest}
    >
      <div ref={inner} className="transition-transform duration-300 ease-out will-change-transform">
        {children}
      </div>
    </Comp>
  );
}
