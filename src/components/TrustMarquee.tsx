/**
 * Infinite scrolling trust strip — pure CSS transform animation (GPU only).
 * The list is duplicated so the scroll feels seamless. University names are
 * proper nouns and stay as-is; concept items come from i18n.
 */
import { useT } from "@/lib/i18n";

const DOT = <span className="mx-4 h-1 w-1 rounded-full bg-primary/40 shrink-0" aria-hidden />;

export function TrustMarquee() {
  const t = useT();
  const items = [
    "MIT",
    "Harvard",
    "Oxford",
    "Stanford",
    "Cambridge",
    t.marquee.mbti,
    t.marquee.iq,
    t.marquee.career,
    t.marquee.ai,
    t.marquee.sat,
    t.marquee.ielts,
    "NUS Singapore",
    "ETH Zürich",
    "Toronto",
    "UCL",
    "KAIST",
  ];
  const row = items.map((label, i) => (
    <span key={i} className="inline-flex shrink-0 items-center">
      <span className="text-xs font-medium text-muted-foreground/70 whitespace-nowrap">
        {label}
      </span>
      {DOT}
    </span>
  ));

  return (
    <div className="relative w-full overflow-hidden py-4" aria-hidden>
      {/* Fade edges */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-20 z-10"
        style={{ background: "linear-gradient(to right, var(--color-background), transparent)" }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-20 z-10"
        style={{ background: "linear-gradient(to left, var(--color-background), transparent)" }}
      />

      <div className="flex animate-marquee" style={{ willChange: "transform" }}>
        {/* Duplicate for seamless loop */}
        {row}
        {row}
      </div>
    </div>
  );
}
