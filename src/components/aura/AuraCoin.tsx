import { cn } from "@/lib/utils";

/**
 * Aura Coin — the platform's premium virtual currency mark.
 * Elegant double-ring orbital glyph with a soft inner gradient.
 * NOT crypto. Internal currency only.
 */
export function AuraCoin({
  size = 22,
  className,
  animated = true,
}: {
  size?: number;
  className?: string;
  animated?: boolean;
}) {
  return (
    <span
      className={cn("relative inline-flex shrink-0 items-center justify-center", className)}
      style={{ width: size, height: size }}
      aria-hidden
    >
      {animated && (
        <span
          className="pointer-events-none absolute inset-0 rounded-full opacity-60 blur-md animate-pulse-glow"
          style={{
            background:
              "radial-gradient(circle, oklch(0.72 0.18 295 / 0.55), transparent 70%)",
          }}
        />
      )}
      <svg
        viewBox="0 0 32 32"
        width={size}
        height={size}
        className="relative drop-shadow-[0_2px_6px_oklch(0.55_0.20_295_/_0.35)]"
      >
        <defs>
          <linearGradient id="aura-coin-face" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.78 0.12 295)" />
            <stop offset="55%" stopColor="oklch(0.58 0.20 295)" />
            <stop offset="100%" stopColor="oklch(0.38 0.15 290)" />
          </linearGradient>
          <linearGradient id="aura-coin-rim" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.92 0.04 295)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="oklch(0.55 0.16 295)" stopOpacity="0.6" />
          </linearGradient>
        </defs>
        {/* outer rim */}
        <circle cx="16" cy="16" r="14" fill="url(#aura-coin-face)" />
        <circle cx="16" cy="16" r="14" fill="none" stroke="url(#aura-coin-rim)" strokeWidth="1.2" />
        {/* inner ring */}
        <circle cx="16" cy="16" r="9" fill="none" stroke="oklch(0.95 0.02 295 / 0.55)" strokeWidth="0.9" />
        {/* soft inner highlight */}
        <circle cx="12" cy="11" r="3.4" fill="oklch(0.98 0.02 295 / 0.35)" />
        {/* glyph — abstract "A" / spark */}
        <path
          d="M16 9.5 L20.3 22 L18.4 22 L17.4 19.2 L14.6 19.2 L13.6 22 L11.7 22 Z M15.1 17.7 L16.9 17.7 L16 14.7 Z"
          fill="oklch(0.98 0.02 295 / 0.92)"
        />
      </svg>
    </span>
  );
}
