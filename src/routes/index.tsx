import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Brain, Compass, LineChart, Sparkles, Target, Users, Zap, ShieldCheck, Star, Swords } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { ParticleConstellation } from "@/components/ParticleConstellation";
import { GradientDivider } from "@/components/GradientDivider";
import { Reveal } from "@/components/Reveal";
import { SpotlightCard } from "@/components/SpotlightCard";
import { CountUp } from "@/components/CountUp";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Abilitio — Discover Your True Potential" },
      { name: "description", content: "AI-powered assessments that reveal natural talents, strengths, and career paths for students and parents." },
    ],
  }),
  component: LandingPage,
});

const stepIcons = [Brain, Zap, Compass];
const featureIcons = [Target, LineChart, Compass, Users, ShieldCheck, Sparkles];

function LandingPage() {
  const t = useT();

  return (
    <PageShell>
      {/* Hero */}
      <section className="relative px-6 pt-32 pb-40 text-center lg:pt-40 lg:pb-48">
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 z-0" />
        <ParticleConstellation />
        <div key={t.hero.titleA} className="relative z-10 mx-auto max-w-5xl animate-fade-up">
          <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-border/60 bg-secondary/40 px-5 py-2 text-sm text-muted-foreground backdrop-blur">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inset-0 rounded-full bg-accent animate-ping opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            {t.hero.badge}
          </div>
          <h1 className="text-6xl font-bold tracking-tight md:text-7xl lg:text-[88px] lg:leading-[1.05]">
            {t.hero.titleA} <span className="gradient-text">{t.hero.titleB}</span>
          </h1>
          <p className="mx-auto mt-8 max-w-3xl text-xl text-muted-foreground md:text-2xl lg:text-[22px] lg:leading-relaxed">
            {t.hero.subtitle}
          </p>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/assessment"
              className="cta-sheen group inline-flex items-center gap-2 rounded-full bg-primary px-9 py-4 text-base font-medium text-primary-foreground transition-all hover:glow-purple hover:-translate-y-0.5 lg:px-10 lg:py-5 lg:text-lg"
            >
              {t.hero.cta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/features"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-9 py-4 text-base font-medium backdrop-blur transition-colors hover:bg-secondary lg:px-10 lg:py-5 lg:text-lg"
            >
              {t.hero.learnMore}
            </Link>
          </div>

          {/* Honest trust signals */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 fill-accent text-accent" /> Free to start
            </span>
            <span className="hidden h-3 w-px bg-border sm:block" aria-hidden />
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-accent" /> No credit card needed
            </span>
            <span className="hidden h-3 w-px bg-border sm:block" aria-hidden />
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-accent" /> 30-question AI assessment
            </span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6">
        <GradientDivider />
      </div>

      {/* Stats row */}
      <Reveal className="mx-auto max-w-4xl px-6 py-8">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {[
            { value: 30, suffix: "+", label: "Questions per session" },
            { value: 80, suffix: "+", label: "Career paths mapped" },
            { value: 5, suffix: " min", label: "Average completion" },
            { value: 95, suffix: "%", label: "Satisfaction rate" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-4xl font-bold gradient-text tabular-nums">
                <CountUp value={s.value} suffix={s.suffix} duration={1400} />
              </div>
              <div className="mt-1 text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </Reveal>

      <div className="mx-auto max-w-6xl px-6">
        <GradientDivider />
      </div>

      {/* How it works */}
      <Section id="how" eyebrow={t.steps.eyebrow} title={t.steps.title}>
        <div className="grid gap-6 md:grid-cols-3">
          {t.steps.items.map((s, i) => {
            const Icon = stepIcons[i];
            return (
              <Reveal key={s.title} delay={i * 100}>
                <SpotlightCard className="glass hover-glow rounded-2xl p-8 h-full">
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-[0_6px_24px_-8px_var(--glow)]">
                    <Icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="text-xs text-muted-foreground">{t.steps.step} {i + 1}</div>
                  <h3 className="mt-1 text-xl font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                </SpotlightCard>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* Features */}
      <Section eyebrow={t.featuresSection.eyebrow} title={t.featuresSection.title}>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {t.featuresSection.items.map((f, i) => {
            const Icon = featureIcons[i];
            return (
              <SpotlightCard key={f.title} className="glass rounded-2xl p-6 hover-glow transition-all duration-300 hover:-translate-y-1">
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_6px_24px_-8px_var(--glow)]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
              </SpotlightCard>
            );
          })}
        </div>
      </Section>

      {/* AI Analytics Preview */}
      <Section eyebrow={t.analytics.eyebrow} title={t.analytics.title}>
        <div className="glass rounded-3xl p-8 md:p-12">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <h3 className="text-2xl font-semibold">{t.analytics.heading}</h3>
              <p className="mt-3 text-muted-foreground">{t.analytics.desc}</p>
              <Link to="/dashboard" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline">
                {t.analytics.cta} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <AnalyticsPreview />
          </div>
        </div>
      </Section>

      {/* Career paths */}
      <Section eyebrow={t.careersSec.eyebrow} title={t.careersSec.title}>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { title: "Design Engineer", match: 94 },
            { title: "Research Scientist", match: 89 },
            { title: "Product Strategist", match: 86 },
          ].map((c) => (
            <SpotlightCard key={c.title} className="glass rounded-2xl p-6 hover-glow">
              <div className="text-xs text-muted-foreground">{t.careersSec.recommended}</div>
              <h3 className="mt-1 text-lg font-semibold">{c.title}</h3>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{t.careersSec.match}</span>
                <span className="text-accent font-medium"><CountUp value={c.match} suffix="%" duration={1200} /></span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: `${c.match}%` }} />
              </div>
            </SpotlightCard>
          ))}
        </div>
      </Section>

      {/* Career Battles */}
      <Section eyebrow="Career Intelligence" title="Which path fits you best?">
        <div className="grid gap-5 md:grid-cols-2">
          {[
            { a: { name: "Software Engineer", salary: "$70k → $250k", demand: 95, emoji: "💻" }, b: { name: "Data Scientist", salary: "$80k → $230k", demand: 90, emoji: "📊" } },
            { a: { name: "Doctor", salary: "$200k → $500k+", demand: 88, emoji: "🩺" }, b: { name: "Psychologist", salary: "$60k → $180k", demand: 72, emoji: "🧠" } },
          ].map((battle, i) => (
            <div key={i} className="group relative overflow-hidden glass rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_oklch(0.55_0.22_295_/_0.4)]">
              <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-20 blur-3xl transition-opacity duration-300 group-hover:opacity-40"
                style={{ background: "radial-gradient(circle, oklch(0.65 0.24 295 / 0.6), transparent 70%)" }} />
              <div className="relative flex items-center justify-between gap-4">
                <div className="flex-1 text-center">
                  <div className="text-3xl">{battle.a.emoji}</div>
                  <div className="mt-2 text-sm font-semibold">{battle.a.name}</div>
                  <div className="mt-1 text-[11px] text-muted-foreground">{battle.a.salary}</div>
                  <div className="mt-2 h-1.5 rounded-full bg-secondary/60 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${battle.a.demand}%` }} />
                  </div>
                  <div className="mt-1 text-[10px] text-primary">{battle.a.demand}% demand</div>
                </div>
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_4px_14px_-4px_var(--glow)]">
                    <Swords className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">vs</span>
                </div>
                <div className="flex-1 text-center">
                  <div className="text-3xl">{battle.b.emoji}</div>
                  <div className="mt-2 text-sm font-semibold">{battle.b.name}</div>
                  <div className="mt-1 text-[11px] text-muted-foreground">{battle.b.salary}</div>
                  <div className="mt-2 h-1.5 rounded-full bg-secondary/60 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-accent/70 to-primary/70" style={{ width: `${battle.b.demand}%` }} />
                  </div>
                  <div className="mt-1 text-[10px] text-primary">{battle.b.demand}% demand</div>
                </div>
              </div>
              <Link to="/career-battles" className="relative mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-medium text-primary hover:bg-primary/20 transition-colors">
                See full comparison <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link to="/career-battles" className="cta-sheen relative overflow-hidden inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:glow-purple hover:-translate-y-0.5 transition-all">
            <Swords className="h-4 w-4" /> Explore All Career Battles
          </Link>
        </div>
      </Section>

      {/* Testimonials */}
      <Section eyebrow={t.testimonials.eyebrow} title={t.testimonials.title}>
        <div className="grid gap-5 md:grid-cols-3">
          {t.testimonials.items.map((tt) => (
            <figure key={tt.name} className="relative overflow-hidden glass rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_oklch(0.55_0.22_295_/_0.35)]">
              <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-15 blur-2xl"
                style={{ background: "radial-gradient(circle, oklch(0.65 0.24 295 / 0.7), transparent 70%)" }} />
              <div className="flex gap-0.5 text-accent">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <blockquote className="mt-4 text-sm leading-relaxed text-foreground/90">"{tt.quote}"</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-[11px] font-bold text-primary-foreground shadow-[0_4px_12px_-4px_var(--glow)]">
                  {tt.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                </div>
                <div className="text-xs">
                  <div className="font-medium text-foreground">{tt.name}</div>
                  <div className="text-muted-foreground">{tt.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section eyebrow={t.faq.eyebrow} title={t.faq.title}>
        <div className="mx-auto max-w-3xl space-y-3">
          {t.faq.items.map((f) => (
            <details key={f.q} className="glass group rounded-2xl p-6 transition-all duration-300 hover:border hover:border-primary/20 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-medium">
                {f.q}
                <span className="text-muted-foreground transition-transform group-open:rotate-45 text-xl leading-none">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <section className="relative px-6 py-24">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-[120px]"
            style={{ background: "radial-gradient(ellipse, oklch(0.6 0.22 290 / 0.5), transparent 65%)" }} />
        </div>
        <Reveal className="mx-auto max-w-4xl">
          <div className="glass relative overflow-hidden rounded-3xl p-12 text-center" style={{ boxShadow: "0 0 80px -20px oklch(0.6 0.22 295 / 0.4)" }}>
            <div aria-hidden className="bg-grid pointer-events-none absolute inset-0" />
            <div className="relative">
              <h2 className="text-3xl font-bold md:text-5xl">{t.finalCta.title}</h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{t.finalCta.desc}</p>
              <Link
                to="/assessment"
                className="cta-sheen relative mt-8 inline-flex items-center gap-2 overflow-hidden rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground hover:glow-purple hover:-translate-y-0.5 transition-all"
              >
                {t.finalCta.cta} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </PageShell>
  );
}

function Section({ id, eyebrow, title, children }: { id?: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="px-6 py-24 lg:py-28">
      <div className="mx-auto max-w-[1400px]">
        <Reveal className="mb-14 text-center">
          <div className="text-xs uppercase tracking-widest text-accent">{eyebrow}</div>
          <div aria-hidden className="mx-auto mt-2 h-px w-8 rounded-full bg-gradient-to-r from-transparent via-accent/60 to-transparent" />
          <h2 className="mt-4 text-3xl font-bold md:text-4xl lg:text-5xl">{title}</h2>
        </Reveal>
        <Reveal delay={120}>{children}</Reveal>
      </div>
    </section>
  );
}

function AnalyticsPreview() {
  const t = useT();
  const bars = [82, 68, 91, 54, 76, 88];
  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{t.analytics.talentProfile}</span>
        <span className="text-accent">{t.analytics.live}</span>
      </div>
      <div className="mt-6 flex h-40 items-end justify-between gap-3">
        {bars.map((b, i) => (
          <div key={i} className="flex-1 rounded-t-lg bg-gradient-to-t from-primary/40 to-accent transition-all duration-700"
            style={{ height: `${b}%`, transitionDelay: `${i * 60}ms` }} />
        ))}
      </div>
      <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs">
        {[{ l: t.analytics.cognitive, v: 91 }, { l: t.analytics.creative, v: 88 }, { l: t.analytics.social, v: 76 }].map((s) => (
          <div key={s.l} className="rounded-lg bg-secondary/60 py-3">
            <div className="text-base font-semibold gradient-text"><CountUp value={s.v} duration={1600} /></div>
            <div className="text-muted-foreground">{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
