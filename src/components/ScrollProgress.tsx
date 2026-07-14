import { useEffect, useRef } from "react";

/**
 * Slim gradient bar pinned to the top edge that fills as the page scrolls.
 * Uses a transform (scaleX) updated inside a rAF, with a passive scroll
 * listener — no layout reads on the hot path, so it stays light.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement | null>(null);
  const frame = useRef(0);

  useEffect(() => {
    function update() {
      frame.current = 0;
      const el = ref.current;
      if (!el) return;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const p = max > 0 ? Math.min(1, doc.scrollTop / max) : 0;
      el.style.transform = `scaleX(${p})`;
    }
    function onScroll() {
      if (frame.current) return;
      frame.current = requestAnimationFrame(update);
    }
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 top-[env(safe-area-inset-top)] z-[60] h-0.5">
      <div
        ref={ref}
        className="h-full origin-left bg-gradient-to-r from-primary via-accent to-primary"
        style={{ transform: "scaleX(0)", boxShadow: "0 0 10px var(--glow)" }}
      />
    </div>
  );
}
