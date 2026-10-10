import { useEffect } from "react";
import { BrainPoster } from "./BrainPoster";
/** The illustration now uses the supplied cartoon SVG, with no WebGL renderer. */
export default function BrainCanvas({
  signal = 0,
  onReady,
}: {
  signal?: number;
  onReady?: () => void;
  onFailure?: () => void;
}) {
  useEffect(() => {
    onReady?.();
  }, [onReady]);
  return <BrainPoster signal={signal} />;
}
