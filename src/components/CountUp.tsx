import { useEffect, useRef, useState } from "react";

type CountUpProps = {
  /** Final value to count to. */
  value: number;
  /** Animation duration in ms. */
  duration?: number;
  /** Decimal places to render. */
  decimals?: number;
  /** Optional suffix (e.g. "%"). */
  suffix?: string;
  className?: string;
};

/**
 * Counts a number up from zero when it scrolls into view. Uses rAF with an
 * ease-out curve and respects prefers-reduced-motion (renders the final
 * value instantly).
 */
export function CountUp({
  value,
  duration = 1100,
  decimals = 0,
  suffix = "",
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce || typeof IntersectionObserver === "undefined") {
      setDisplay(value);
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          obs.disconnect();
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            setDisplay(value * eased);
            if (t < 1) requestAnimationFrame(tick);
            else setDisplay(value);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}
