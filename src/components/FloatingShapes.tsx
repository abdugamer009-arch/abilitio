/**
 * Per-section soft floating accents.
 * Kept very subtle — global ambience is handled by <AmbientBackdrop />.
 */
export function FloatingShapes() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div
        className="absolute -top-16 left-1/3 h-72 w-72 rounded-full bg-primary/15 blur-3xl animate-float"
      />
      <div
        className="absolute top-1/3 right-10 h-80 w-80 rounded-full bg-accent/10 blur-3xl animate-float"
        style={{ animationDelay: "-6s" }}
      />
      <div
        className="absolute bottom-0 left-10 h-72 w-72 rounded-full bg-lavender/15 blur-3xl animate-pulse-glow"
        style={{ animationDelay: "-3s" }}
      />
    </div>
  );
}
