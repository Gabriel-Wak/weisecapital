"use client";

import type { ReactNode } from "react";

/** Native scroll — Lenis removed for responsive wheel/touch scrolling. */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
