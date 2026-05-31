import { cn } from "@/lib/utils";

interface GradientDividerProps {
  className?: string;
  /** Add a soft blurred glow halo around the line. */
  glow?: boolean;
}

/**
 * Thin Monica AI–style horizontal gradient line.
 * Soft purple → blue → cyan, fading at the edges.
 * Works in both light and dark mode via design tokens.
 */
export function GradientDivider({ className, glow = true }: GradientDividerProps) {
  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className={cn(
        glow ? "gradient-divider-glow" : "gradient-divider",
        "my-10",
        className,
      )}
    />
  );
}
