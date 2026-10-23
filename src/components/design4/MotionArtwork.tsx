import type { ReactNode } from "react";
import { useArtworkMotion } from "./use-artwork-motion";
export function MotionArtwork({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const { ref, playing } = useArtworkMotion();
  return (
    <div ref={ref} className={`d4-motion ${className}`} data-playing={playing}>
      {children}
    </div>
  );
}
