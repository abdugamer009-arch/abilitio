import { PageShell } from "@/components/PageShell";
import { useWords } from "@/lib/editorial";
import { ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { LEGAL_LAST_UPDATED } from "@/lib/constants";

/**
 * Shared chrome for long-form documents (Privacy, Terms, Methodology).
 * Keeps typography and spacing consistent across every document surface.
 */
export function LegalPage({
  title,
  intro,
  eyebrow = "Legal",
  icon: Icon = ShieldCheck,
  showUpdated = true,
  children,
}: {
  title: string;
  intro: string;
  eyebrow?: string;
  icon?: LucideIcon;
  showUpdated?: boolean;
  children: React.ReactNode;
}) {
  const w = useWords();
  return (
    <PageShell>
      <section className="relative px-6 pt-16 pb-24">
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-0" />

        <div className="relative mx-auto max-w-3xl">
          <header className="text-left">
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
              <Icon className="h-3.5 w-3.5" /> {eyebrow}
            </div>
            <h1 className="mt-5 text-5xl tracking-tight sm:text-6xl">{title}</h1>
            <p className="mt-6 max-w-xl text-base text-muted-foreground">{intro}</p>
            {showUpdated && (
              <p className="mt-3 text-xs text-muted-foreground">
                Last updated: {LEGAL_LAST_UPDATED}
              </p>
            )}
          </header>

          <p className="mt-8 text-xs text-muted-foreground">
            {w(
              "Legal text is provided in English. Contact the team with translation questions.",
              "Huquqiy matn ingliz tilida. Tarjima savollari bilan jamoaga yozing.",
              "Юридический текст на английском. По вопросам перевода обратитесь к команде.",
            )}
          </p>
          <div lang="en" className="mt-10 border-t border-border pt-10">
            <div className="space-y-8">{children}</div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

/** A numbered section within a legal document. */
export function LegalSection({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
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
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
