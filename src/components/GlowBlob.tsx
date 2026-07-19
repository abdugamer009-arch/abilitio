/**
 * GlowBlob — the soft violet radial glow used behind cards, headers, and CTAs.
 *
 * Encapsulates the repeated `radial-gradient(circle, oklch(0.65 0.24 295 / α), transparent 70%)`
 * decoration so position, size, opacity, and blur stay in `className` while the
 * gradient strength is controlled with the `alpha` prop.
 *
 * Example:
 *   <GlowBlob className="-right-10 -top-10 h-32 w-32 opacity-30 blur-3xl" alpha={0.6} />
 */
export function GlowBlob({ className, alpha = 0.6 }: { className?: string; alpha?: number }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute rounded-full ${className ?? ""}`}
      style={{
        background: `radial-gradient(circle, oklch(0.65 0.24 295 / ${alpha}), transparent 70%)`,
      }}
    />
  );
}
