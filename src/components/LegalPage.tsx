import { PageShell } from "@/components/PageShell";
import { FloatingShapes } from "@/components/FloatingShapes";
import { ShieldCheck } from "lucide-react";
import { LEGAL_LAST_UPDATED } from "@/lib/constants";

/**
 * Shared chrome for long-form legal documents (Privacy, Terms).
 * Keeps typography and spacing consistent across every legal surface.
 */
export function LegalPage({
  title,
  intro,
  children,
}: {
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  return (
    <PageShell>
      <section className="relative px-6 pt-16 pb-24">
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-0" />
        <FloatingShapes />
        <div className="relative mx-auto max-w-3xl">
          <header className="animate-fade-up text-center">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
              <ShieldCheck className="h-3.5 w-3.5" /> Legal
            </div>
            <h1 className="mt-5 text-3xl font-bold tracking-tight gradient-text sm:text-4xl">{title}</h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">{intro}</p>
            <p className="mt-3 text-xs text-muted-foreground">Last updated: {LEGAL_LAST_UPDATED}</p>
          </header>

          <div className="glass mt-10 rounded-3xl p-7 sm:p-10">
            <div className="space-y-8">{children}</div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

/** A numbered section within a legal document. */
export function LegalSection({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold text-foreground">{heading}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </section>
  );
}

/** A consistent bulleted list for legal content. */
export function LegalList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2.5">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-br from-primary to-accent" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
