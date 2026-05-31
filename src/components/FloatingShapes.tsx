export function FloatingShapes() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-32 left-1/4 h-[28rem] w-[28rem] rounded-full bg-primary/15 dark:bg-primary/30 blur-[120px] animate-float" />
      <div
        className="absolute top-1/3 right-0 h-[32rem] w-[32rem] rounded-full bg-accent/10 dark:bg-accent/20 blur-[140px] animate-float"
        style={{ animationDelay: "-3s" }}
      />
      <div
        className="absolute bottom-0 left-0 h-[26rem] w-[26rem] rounded-full bg-lavender/15 dark:bg-lavender/20 blur-[130px] animate-pulse-glow"
        style={{ animationDelay: "-1.5s" }}
      />
    </div>
  );
}
