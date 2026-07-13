import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Trophy } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import { FloatingShapes } from "@/components/FloatingShapes";
import { GlowBlob } from "@/components/GlowBlob";
import { SUCCESS_STORIES } from "@/lib/abbi-extras";

export const Route = createFileRoute("/success-stories")({
  head: () => ({ meta: [
    { title: "Success Stories — Abilitio" },
    { name: "description", content: "Real stories from students who discovered their strengths and found their direction with Abilitio." },
  ] }),
  component: SuccessPage,
});

function SuccessPage() {
  return (
    <PageShell>
      <section className="relative px-4 pt-16 pb-24 sm:px-6">
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-0" />
        <FloatingShapes />
        <div className="relative mx-auto max-w-5xl">
          <header className="mb-10 text-center animate-fade-up">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary">
              <Sparkles className="h-3 w-3" /> Real Journeys
            </span>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Success Stories</h1>
            <p className="mt-2 text-sm text-muted-foreground">Abilitio members sharing how assessments, roadmaps, and community changed their trajectory.</p>
          </header>

          <Reveal className="grid gap-5 md:grid-cols-2">
            {SUCCESS_STORIES.map((s) => (
              <article key={s.name}
                className="group relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-secondary/40 to-background/40 p-6 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-primary/40"
                style={{ boxShadow: "0 10px 30px -15px oklch(0.55 0.22 295 / 0.4)" }}>
                <GlowBlob className="-right-10 -top-10 h-32 w-32 opacity-30 blur-3xl" />
                <div className="relative flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-base font-bold text-primary-foreground shadow-lg">
                    {s.initials}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-semibold">{s.name}</h3>
                    <p className="mt-0.5 text-sm font-medium text-foreground/90">{s.title}</p>
                  </div>
                </div>
                <p className="relative mt-4 text-sm leading-relaxed text-muted-foreground">{s.story}</p>
                <div className="relative mt-5 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary">
                  <Trophy className="h-3 w-3" /> {s.badge}
                </div>
              </article>
            ))}
          </Reveal>

          <Reveal>
            <div className="mt-10 relative overflow-hidden rounded-3xl border border-dashed border-primary/30 bg-gradient-to-br from-primary/5 via-secondary/30 to-background/40 p-10 text-center">
              <GlowBlob className="left-1/2 top-0 h-32 w-64 -translate-x-1/2 opacity-30 blur-3xl" />
              <div className="relative">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_8px_24px_-8px_var(--glow)]">
                  <Sparkles className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">Have a story to share?</h3>
                <p className="mt-2 text-sm text-muted-foreground">Story submissions open soon — get featured on this page.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
