/**
 * Infinite scrolling strip of universities available in the University
 * Explorer — pure CSS transform animation (GPU only). The list is duplicated
 * so the scroll feels seamless. University names are proper nouns.
 *
 * The caption is load-bearing, not decoration: an unlabelled row of "MIT ·
 * Harvard · Oxford" directly under the hero reads as an endorsement we don't
 * have. Naming what the list actually is keeps it honest. The strip also used
 * to mix in our own feature names ("AI-Powered", "IQ Profiling"), which said
 * nothing about trust and made the row incoherent.
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
    <div className="w-full">
      <p className="mb-3 text-center text-[11px] uppercase tracking-widest text-muted-foreground/60">
        {t.marquee.caption}
      </p>
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
    </div>
  );
}
