import { useRef } from "react";

type SpotlightCardProps = {
  children: React.ReactNode;
  className?: string;
  /** Spotlight radius in px. */
  radius?: number;
};

/**
 * Card with a soft spotlight that follows the cursor (Aceternity-style).
 * Pure CSS paint driven by two custom properties; the mousemove is
 * rAF-throttled so it stays light even on long lists.
 */
export function SpotlightCard({ children, className = "", radius = 320 }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const frame = useRef(0);

  function onMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const { clientX, clientY } = e;
    if (frame.current) return;
    frame.current = requestAnimationFrame(() => {
      frame.current = 0;
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${clientX - rect.left}px`);
      el.style.setProperty("--my", `${clientY - rect.top}px`);
    });
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={`group/spotlight relative overflow-hidden ${className}`}
      style={{ ["--spot-r" as string]: `${radius}px` }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover/spotlight:opacity-100"
        style={{
          background:
            "radial-gradient(var(--spot-r) circle at var(--mx, 50%) var(--my, 0%), oklch(0.7 0.16 290 / 0.18), transparent 65%)",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
