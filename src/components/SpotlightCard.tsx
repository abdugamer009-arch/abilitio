import type { ReactNode } from "react";
/** Compatibility wrapper: editorial panels no longer have decorative spotlights. */
export function SpotlightCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
  radius?: number;
}) {
  return <div className={className}>{children}</div>;
}
