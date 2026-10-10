import type { ReactNode } from "react";
/** Application content is always visible; story choreography is opt-in. */
export function Reveal({
  children,
  className = "",
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li";
}) {
  const Tag = as;
  return <Tag className={className}>{children}</Tag>;
}
