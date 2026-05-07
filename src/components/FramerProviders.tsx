"use client";

import { MotionConfig } from "framer-motion";

export function FramerProviders({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      {children}
    </MotionConfig>
  );
}
