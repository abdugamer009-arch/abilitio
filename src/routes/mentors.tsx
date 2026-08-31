import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles, Calendar } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/mentors")({
  head: () => ({
    meta: [
      { title: "Mentors — Abilitio" },
      {
        name: "description",
        content:
          "Abilitio is building a mentor network matched to the careers your assessment surfaces. The programme opens soon.",
      },
    ],
  }),
  component: MentorsPage,
});

function MentorsPage() {
  const t = useT();
  return (
    <PageShell>
      <section className="relative px-4 pt-16 pb-24 sm:px-6">
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-6xl">
          <header className="mb-10 text-center animate-fade-up">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary">
              <Sparkles className="h-3 w-3" /> {t.mentorsPage.badge}
            </span>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              {t.mentorsPage.title}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">{t.mentorsPage.subtitle}</p>
          </header>

          {/* This page used to render eight invented mentors — fabricated names,
              employment history ("9 years at Google") and quotes, each with a
              dead "Booking opens soon" button, under a note admitting they
              weren't real. Made-up professionals are a credibility risk on a
              launch site, so the page now states plainly where the programme
              is and offers the one action that actually works. */}
          <Reveal className="mx-auto max-w-xl">
            <div className="rounded-3xl border border-border/60 bg-secondary/30 p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_8px_24px_-8px_var(--glow)]">
                <Calendar className="h-5 w-5" />
              </div>
              <p className="mt-5 text-sm text-muted-foreground">{t.mentorsPage.note}</p>
              <Link
                to="/contact"
                className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_28px_-10px_var(--glow)]"
              >
                {t.mentorsPage.cta}
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
