import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import { FloatingShapes } from "@/components/FloatingShapes";
import { GlowBlob } from "@/components/GlowBlob";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/success-stories")({
  head: () => ({
    meta: [
      { title: "Success Stories — Abilitio" },
      {
        name: "description",
        content:
          "Real student stories from Abilitio, published as members share them.",
      },
    ],
  }),
  component: SuccessPage,
});

function SuccessPage() {
  const t = useT();
  return (
    <PageShell>
      <section className="relative px-4 pt-16 pb-24 sm:px-6">
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-0" />
        <FloatingShapes />
        <div className="relative mx-auto max-w-5xl">
          <header className="mb-10 text-center animate-fade-up">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary">
              <Sparkles className="h-3 w-3" /> {t.storiesPage.badge}
            </span>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              {t.storiesPage.title}
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">{t.storiesPage.subtitle}</p>
          </header>

          {/* Four invented students used to sit here — fabricated names and
              outcomes ("SAT 1490 -> MIT-style scholarship") shown as success
              stories, under a note admitting none of them were real. Inventing
              student outcomes is the least defensible thing on a launch site
              aimed at students and schools, so the page now says plainly that
              there are none yet and invites the first real one. */}
          <Reveal className="mx-auto max-w-xl">
            <div className="relative overflow-hidden rounded-3xl border border-dashed border-primary/30 bg-gradient-to-br from-primary/5 via-secondary/30 to-background/40 p-10 text-center">
              <GlowBlob className="left-1/2 top-0 h-32 w-64 -translate-x-1/2 opacity-30 blur-3xl" />
              <div className="relative">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_8px_24px_-8px_var(--glow)]">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{t.storiesPage.shareTitle}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t.storiesPage.shareBody}</p>
                <Link
                  to="/contact"
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:-translate-y-0.5 hover:shadow-[0_10px_28px_-10px_var(--glow)]"
                >
                  {t.storiesPage.shareCta}
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
