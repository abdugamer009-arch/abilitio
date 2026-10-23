import { useEffect, useRef, useState } from "react";
import { useMotion } from "../MotionProvider";
/** Each looping illustration has its own visibility clock; no route listener. */
export function useArtworkMotion() {
  const ref = useRef<HTMLDivElement>(null);
  const { enabled } = useMotion();
  const [visible, setVisible] = useState(false);
  const [awake, setAwake] = useState(true);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting));
    observer.observe(node);
    const sync = () => setAwake(!document.hidden);
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);
  return { ref, playing: enabled && visible && awake };
}
