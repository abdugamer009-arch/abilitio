export function FloatingShapes() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-primary/30 blur-3xl animate-float" />
      <div
        className="absolute top-1/3 right-10 h-96 w-96 rounded-full bg-accent/20 blur-3xl animate-float"
        style={{ animationDelay: "-3s" }}
      />
      <div
        className="absolute bottom-0 left-10 h-80 w-80 rounded-full bg-lavender/20 blur-3xl animate-pulse-glow"
        style={{ animationDelay: "-1.5s" }}
      />
    </div>
  );
}
