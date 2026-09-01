/**
 * Flat illustrated stickers, treated as physical objects placed on the page.
 *
 * Deliberately not system icons: they carry no meaning, never sit on a grid,
 * and are always rotated a few degrees so they read as peel-and-stick rather
 * than UI. Each is a solid fill with a dark outline and no drop shadow — the
 * flatness is what sells "sticker" against the glass surfaces around them.
 *
 * The fills are decoration-only accents and are intentionally kept out of the
 * design tokens: nothing functional should ever be coloured from this file.
 */

const OUTLINE = "#171717";

/** Decoration-only palette. Never promote these to buttons, links or state. */
export const STICKER_FILL = {
  sky: "#3b82f6",
  bubblegum: "#ff66cf",
  sprout: "#22c55e",
  marker: "#ff6f1e",
} as const;

type StickerProps = {
  /** Absolute-position utilities, e.g. "-top-6 right-10". */
  className?: string;
  /** Degrees of tilt. Keep between 5 and 15 so it stays hand-placed. */
  rotate?: number;
  size?: number;
};

function Wrap({
  className = "",
  rotate = 8,
  size = 44,
  children,
}: StickerProps & { children: React.ReactNode }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute select-none ${className}`}
      style={{ transform: `rotate(${rotate}deg)`, width: size, height: size }}
    >
      <svg viewBox="0 0 48 48" width={size} height={size} fill="none">
        {children}
      </svg>
    </span>
  );
}

export function BoltSticker(props: StickerProps) {
  return (
    <Wrap {...props}>
      <path
        d="M27 4 11 27h11l-3 17 18-24H26l4-16Z"
        fill={STICKER_FILL.sky}
        stroke={OUTLINE}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
    </Wrap>
  );
}

export function HeartSticker(props: StickerProps) {
  return (
    <Wrap {...props}>
      <path
        d="M24 41S6 30 6 18.5C6 12 11 8 16 8c3.5 0 6.5 2 8 4.5C25.5 10 28.5 8 32 8c5 0 10 4 10 10.5C42 30 24 41 24 41Z"
        fill={STICKER_FILL.bubblegum}
        stroke={OUTLINE}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      <circle cx="18" cy="21" r="2.6" fill={OUTLINE} />
      <circle cx="30" cy="21" r="2.6" fill={OUTLINE} />
      <path d="M20 28c2.4 2 5.6 2 8 0" stroke={OUTLINE} strokeWidth={2.2} strokeLinecap="round" />
    </Wrap>
  );
}

export function StarSticker(props: StickerProps) {
  return (
    <Wrap {...props}>
      <path
        d="M24 5c1.8 9.6 8.6 16.4 18.2 18.2C32.6 25 25.8 31.8 24 41.4 22.2 31.8 15.4 25 5.8 23.2 15.4 21.4 22.2 14.6 24 5Z"
        fill={STICKER_FILL.marker}
        stroke={OUTLINE}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
    </Wrap>
  );
}

export function GhostSticker(props: StickerProps) {
  return (
    <Wrap {...props}>
      <path
        d="M9 41V21a15 15 0 0 1 30 0v20l-5-4-5 4-5-4-5 4-5-4Z"
        fill={STICKER_FILL.sprout}
        stroke={OUTLINE}
        strokeWidth={2.5}
        strokeLinejoin="round"
      />
      <circle cx="18" cy="21" r="2.6" fill={OUTLINE} />
      <circle cx="30" cy="21" r="2.6" fill={OUTLINE} />
    </Wrap>
  );
}

/**
 * Hand-drawn connector. A single wobbling stroke with an open arrowhead —
 * no fill, no perfect curve — running from a caption to the thing it labels.
 */
export function HandArrow({
  className = "",
  color = "currentColor",
}: {
  className?: string;
  color?: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 120 78"
      fill="none"
      className={`pointer-events-none absolute ${className}`}
    >
      <path
        d="M6 7c14 2 27 9 34 20 5 8 6 18 3 27 9-6 20-9 31-8"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
      <path
        d="M66 41c3.5 1.6 6.5 3.8 8.5 6.6M74 46c-.6 3.4-2.4 6.4-5 8.6"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </svg>
  );
}
