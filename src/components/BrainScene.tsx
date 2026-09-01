import { lazy, Suspense, useEffect, useState } from "react";

/**
 * Client-only mount point for the 3D brain background.
 *
 * The scene itself lives in BrainCanvas and is reached through React.lazy, so
 * @react-three/fiber is never pulled into the server bundle. That matters:
 * imported eagerly, R3F's react-reconciler has no working React internals in
 * the SSR runtime and throws "Cannot read properties of null (reading
 * 'useMemo')" inside CanvasImpl, which drops the entire page to an error
 * boundary rather than just losing the decoration.
 *
 * The gate below is deliberately a state flag rather than a `typeof window`
 * check: it guarantees the server and the first client render agree (both
 * null), so hydration matches and the canvas only appears on a later commit.
 */
const BrainCanvas = lazy(() => import("./BrainCanvas"));

export function BrainScene() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <Suspense fallback={null}>
      <BrainCanvas />
    </Suspense>
  );
}
