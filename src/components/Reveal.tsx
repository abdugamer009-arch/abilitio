import { useEffect, useRef, useState } from "react";

type RevealProps = {
  children: React.ReactNode;
  /** Delay in ms before the reveal transition starts. */
  delay?: number;
  /** Extra classes for the wrapper. */
  className?: string;
  /** Render as a different element (default div). */
  as?: "div" | "section" | "li";
};

/**
 * Lightweight scroll-reveal. Fades + lifts content into view once,
 * using IntersectionObserver. SSR-safe and degrades to visible if
 * IntersectionObserver is unavailable.
 */
export function Reveal({ children, delay = 0, className = "", as = "div" }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    // threshold 0 (reveal as soon as any part enters) keeps this correct for
    // content taller than the viewport: a large grid can never expose 12% of
    // itself at once, so a non-zero threshold would leave it hidden forever.
    // rootMargin trims the bottom so the reveal still triggers slightly inside
    // the viewport rather than exactly at the edge.
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShown(true);
            obs.disconnect();
            break;
          }
        }
      },
      { threshold: 0, rootMargin: "0px 0px -8% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const Tag = as;
  return (
    <Tag
      ref={ref as never}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(22px)",
        filter: shown ? "blur(0)" : "blur(4px)",
        transition:
          "opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1), filter 0.7s cubic-bezier(0.16,1,0.3,1)",
        transitionDelay: `${delay}ms`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </Tag>
  );
}
