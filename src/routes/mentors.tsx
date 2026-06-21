import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Briefcase, Star, Calendar } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import { MENTORS } from "@/lib/abbi-extras";

export const Route = createFileRoute("/mentors")({
  head: () => ({ meta: [{ title: "Mentors — Abilitio" }] }),
  component: MentorsPage,
});

function MentorsPage() {
  return (
    <PageShell>
      <section className="relative px-4 pt-16 pb-24 sm:px-6">
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-6xl">
          <header className="mb-10 text-center animate-fade-up">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary">
              <Sparkles className="h-3 w-3" /> Career Mentors
            </span>
            <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Learn from people already there</h1>
            <p className="mt-2 text-sm text-muted-foreground">Curated mentors aligned with the careers ABBI recommends.</p>
          </header>

          <Reveal className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {MENTORS.map((m) => (
              <article key={m.name}
                className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-secondary/40 to-background/40 p-6 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-primary/40"
                style={{ boxShadow: "0 10px 30px -15px oklch(0.55 0.22 295 / 0.4)" }}>
                <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-30 blur-3xl"
                  style={{ background: "radial-gradient(circle, oklch(0.65 0.24 295 / 0.6), transparent 70%)" }} />
                <div className="relative flex items-center gap-4">
                  <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 ring-1 ring-primary/30 text-2xl shadow-[0_6px_20px_-8px_var(--glow)]">
                    <span className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: "radial-gradient(circle at 50% 50%, oklch(0.65 0.24 295 / 0.15), transparent 70%)" }} />
                    {m.emoji}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{m.name}</h3>
                    <p className="text-xs text-muted-foreground">{m.profession}</p>
                  </div>
                </div>
                <div className="relative mt-5 space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-start gap-2"><Briefcase className="mt-0.5 h-3.5 w-3.5 text-primary" /><span>{m.experience}</span></div>
                  <div className="flex items-start gap-2"><Star className="mt-0.5 h-3.5 w-3.5 text-primary" /><span>{m.specialization}</span></div>
                </div>
                <blockquote className="relative mt-5 flex-1 rounded-2xl border border-primary/20 bg-primary/5 p-4 text-sm italic text-foreground/90">
                  "{m.advice}"
                </blockquote>
                <div className="relative mt-4">
                  {m.bookingUrl ? (
                    <a
                      href={m.bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:glow-purple"
                    >
                      <Calendar className="h-4 w-4" /> Book a Session
                    </a>
                  ) : (
                    <div className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-border/40 bg-secondary/20 px-4 py-2.5 text-xs text-muted-foreground/60 cursor-not-allowed">
                      <Calendar className="h-3.5 w-3.5" /> Booking opens soon
                    </div>
                  )}
                </div>
              </article>
            ))}
          </Reveal>
        </div>
      </section>
    </PageShell>
  );
}
