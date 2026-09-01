import { useEffect, useRef, useState } from "react";

/**
 * Stylised brain for the hero — a top-down silhouette with folded gyri and
 * synapse pulses travelling along them.
 *
 * Chosen over a data-looking card on purpose: the hero previously showed a
 * mock "talent profile" with invented scores, which reads as real results to
 * a first-time visitor. This says "we map how you think" without asserting
 * any number.
 *
 * Built as one inline SVG so there is no image request, it scales cleanly,
 * and it inherits the page's own colour tokens. The right half is the left
 * half mirrored, so every path is authored once.
 */

/** Outer silhouette of one hemisphere; mirrored for the other side. */
const HEMISPHERE =
  "M120 22C95 22 74 35 65 55 46 59 33 76 35 95 22 106 18 125 27 141 18 156 23 176 38 184 41 205 58 219 78 216 90 231 108 235 120 227Z";

/** Gyri. Each doubles as a motion track for a synapse pulse. */
const FOLDS = [
  "M104 44C86 51 80 67 89 79",
  "M76 68C61 75 59 92 72 101",
  "M99 97C82 104 78 121 91 131",
  "M64 120C51 129 53 147 66 153",
  "M95 150C80 159 78 175 91 183",
  "M70 178C61 192 72 206 87 205",
];

/** Where the pulses sit still and glow, at fold junctions. */
const NODES = [
  [89, 79],
  [72, 101],
  [91, 131],
  [66, 153],
  [91, 183],
];

export function BrainVisual({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    // Only animate while on screen. The pulses are cheap, but there is no
    // reason to keep a dozen SMIL timelines running under the fold.
    const io = new IntersectionObserver(
      ([entry]) => setAnimate(entry.isIntersecting),
      { threshold: 0 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Ambient wash behind the silhouette, matching the page's glow language. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, oklch(0.62 0.22 295 / 0.55), transparent 70%)",
        }}
      />

      <svg
        viewBox="0 0 240 250"
        role="img"
        aria-label="Illustration of a brain with signals travelling along its folds"
        className="relative w-full"
      >
        <defs>
          <linearGradient id="brain-stroke" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.78 0.14 295)" />
            <stop offset="100%" stopColor="oklch(0.62 0.22 300)" />
          </linearGradient>
          <linearGradient id="brain-fill" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="oklch(0.62 0.22 295 / 0.20)" />
            <stop offset="100%" stopColor="oklch(0.55 0.20 300 / 0.04)" />
          </linearGradient>
          <filter id="brain-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="3.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {FOLDS.map((d, i) => (
            <path key={i} id={`fold-${i}`} d={d} />
          ))}
        </defs>

        {/* Both hemispheres: the group is drawn once, then mirrored about x=120. */}
        {[false, true].map((mirrored) => (
          <g
            key={String(mirrored)}
            transform={mirrored ? "translate(240,0) scale(-1,1)" : undefined}
          >
            <path
              d={HEMISPHERE}
              fill="url(#brain-fill)"
              stroke="url(#brain-stroke)"
              strokeWidth={2.4}
              strokeLinejoin="round"
            />
            {FOLDS.map((d, i) => (
              <path
                key={i}
                d={d}
                fill="none"
                stroke="url(#brain-stroke)"
                strokeWidth={1.9}
                strokeLinecap="round"
                opacity={0.62}
              />
            ))}
            {NODES.map(([cx, cy], i) => (
              <circle key={i} cx={cx} cy={cy} r={2.6} fill="oklch(0.85 0.12 295)">
                {animate && (
                  <animate
                    attributeName="opacity"
                    values="0.25;1;0.25"
                    dur="2.8s"
                    begin={`${i * 0.45}s`}
                    repeatCount="indefinite"
                  />
                )}
              </circle>
            ))}
            {/* Synapse pulses running the length of each fold. */}
            {animate &&
              FOLDS.map((_, i) => (
                <circle key={i} r={3.1} fill="oklch(0.92 0.10 295)" filter="url(#brain-glow)">
                  <animateMotion
                    dur={`${3.4 + i * 0.35}s`}
                    begin={`${i * 0.55}s`}
                    repeatCount="indefinite"
                    rotate="auto"
                  >
                    <mpath href={`#fold-${i}`} />
                  </animateMotion>
                  <animate
                    attributeName="opacity"
                    values="0;1;1;0"
                    keyTimes="0;0.15;0.85;1"
                    dur={`${3.4 + i * 0.35}s`}
                    begin={`${i * 0.55}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              ))}
          </g>
        ))}

        {/* Central fissure, drawn last so it sits above both halves. */}
        <path
          d="M120 22V227"
          stroke="url(#brain-stroke)"
          strokeWidth={2.2}
          strokeLinecap="round"
          opacity={0.85}
        />
      </svg>
    </div>
  );
}
