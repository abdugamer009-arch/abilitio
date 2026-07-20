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
 *
 * Deliberately fades opacity + transform only — no blur filter. A blur
 * transition forces a costly per-frame repaint and, on a fast scroll, leaves
 * content looking unrendered ("textures not loading") until it settles. We also
 * release `will-change` once the transition ends so revealed sections don't
 * each sit on their own compositor layer forever, and skip the effect entirely
 * for reduced-motion users.
 */
export function Reveal({ children, delay = 0, className = "", as = "div" }: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [shown, setShown] = useState(false);
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || typeof IntersectionObserver === "undefined") {
      setShown(true);
      setSettled(true);
      return;
    }

    // threshold 0 (reveal as soon as any part enters) keeps this correct for
    // content taller than the viewport: a large grid can never expose 12% of
    // itself at once, so a non-zero threshold would leave it hidden forever.
    // A positive bottom rootMargin starts the reveal a little before the
    // element reaches the viewport edge, so a quick flick doesn't catch it
    // still mid-fade.
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
      { threshold: 0, rootMargin: "0px 0px 12% 0px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const Tag = as;
  return (
    <Tag
      ref={ref as never}
      className={className}
      onTransitionEnd={() => setSettled(true)}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(20px)",
        transition:
          "opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)",
        transitionDelay: `${delay}ms`,
        // Only promote to a layer while actually animating; release afterwards.
        willChange: settled ? "auto" : "opacity, transform",
      }}
    >
      {children}
    </Tag>
  );
}
