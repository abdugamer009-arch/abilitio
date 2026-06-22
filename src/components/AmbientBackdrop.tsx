/**
 * Global atmospheric backdrop — Monica/Linear-style.
 * All animations use transform + opacity only (GPU compositor, zero layout cost).
 * will-change: transform promotes each orb to its own layer ahead of time.
 */
export function AmbientBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Top-center primary violet wash */}
      <div
        className="absolute left-1/2 top-[-20%] h-[60vh] w-[120vw] -translate-x-1/2 rounded-[50%] opacity-[0.55] animate-drift"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.6 0.18 290 / 0.35), oklch(0.55 0.16 280 / 0.12) 45%, transparent 70%)",
          filter: "blur(60px)",
          willChange: "transform",
        }}
      />

      {/* Horizontal atmospheric sweep */}
      <div
        className="absolute left-0 right-0 top-[72%] h-[220px] -translate-y-1/2 opacity-25"
        style={{
          background: "var(--gradient-line)",
          filter: "blur(90px)",
        }}
      />

      {/* Lower-left lavender drift */}
      <div
        className="absolute -bottom-32 left-[-10%] h-[55vh] w-[70vw] rounded-full opacity-40 animate-drift"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.72 0.13 295 / 0.28), transparent 65%)",
          filter: "blur(80px)",
          animationDelay: "-8s",
          willChange: "transform",
        }}
      />

      {/* Lower-right deep violet */}
      <div
        className="absolute -bottom-40 right-[-10%] h-[50vh] w-[60vw] rounded-full opacity-35 animate-drift"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.55 0.17 275 / 0.3), transparent 70%)",
          filter: "blur(90px)",
          animationDelay: "-14s",
          willChange: "transform",
        }}
      />

      {/* Aurora accent — top-right cyan-indigo whisper */}
      <div
        className="absolute -right-[15%] top-[5%] h-[50vh] w-[55vw] rounded-full animate-aurora"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.68 0.14 260 / 0.18), oklch(0.72 0.12 240 / 0.08) 50%, transparent 70%)",
          filter: "blur(100px)",
          animationDelay: "-10s",
          willChange: "transform, opacity",
        }}
      />

      {/* Aurora accent — mid-left soft rose-violet */}
      <div
        className="absolute left-[-8%] top-[35%] h-[45vh] w-[50vw] rounded-full animate-aurora"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.7 0.12 310 / 0.14), transparent 65%)",
          filter: "blur(110px)",
          animationDelay: "-22s",
          willChange: "transform, opacity",
        }}
      />
    </div>
  );
}
