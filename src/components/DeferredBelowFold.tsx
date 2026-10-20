import { startTransition, useEffect, useRef, useState, type ReactNode } from "react";

/** Keep above-the-fold content and history restoration immediate. Only new,
 * offscreen route sections wait until the curtain has finished moving. */
export function DeferredBelowFold({ children }: { children: ReactNode }) {
  const placeholder = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(
    () =>
      typeof document === "undefined" ||
      !document.documentElement.dataset.routeTransition ||
      !!document.documentElement.dataset.routeHistory ||
      !!location.hash,
  );
  useEffect(() => {
    if (ready) return;
    if (!document.documentElement.dataset.routeTransition) {
      setReady(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) startTransition(() => setReady(true));
      else placeholder.current?.setAttribute("data-route-checked", "true");
      observer.disconnect();
    });
    if (placeholder.current) observer.observe(placeholder.current);
    const renderVisible = () => {
      placeholder.current?.removeAttribute("data-route-checked");
      startTransition(() => setReady(true));
    };
    const node = placeholder.current;
    node?.addEventListener("abilitio:render-deferred", renderVisible);
    let timer: ReturnType<typeof setTimeout>;
    const reveal = () => {
      timer = setTimeout(() => startTransition(() => setReady(true)), 0);
    };
    window.addEventListener("abilitio:transition-end", reveal, { once: true });
    return () => {
      observer.disconnect();
      node?.removeEventListener("abilitio:render-deferred", renderVisible);
      clearTimeout(timer);
      window.removeEventListener("abilitio:transition-end", reveal);
    };
  }, [ready]);
  return ready ? (
    children
  ) : (
    <div ref={placeholder} data-route-check aria-hidden style={{ minHeight: 1000 }} />
  );
}
