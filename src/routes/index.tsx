import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Brain, Compass, LineChart, Sparkles, Target, Users, Zap, ShieldCheck, Star } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { ParticleConstellation } from "@/components/ParticleConstellation";
import { GradientDivider } from "@/components/GradientDivider";
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
        <ParticleConstellation />
        <div key={t.hero.titleA} className="relative z-10 mx-auto max-w-5xl animate-fade-up">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/40 px-5 py-2 text-sm text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-accent" />
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
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-9 py-4 text-base font-medium text-primary-foreground transition-all hover:glow-purple lg:px-10 lg:py-5 lg:text-lg"
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
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6">
        <GradientDivider />
      </div>


      {/* How it works */}
      <Section id="how" eyebrow={t.steps.eyebrow} title={t.steps.title}>
        <div className="grid gap-6 md:grid-cols-3">
          {t.steps.items.map((s, i) => {
            const Icon = stepIcons[i];
            return (
              <div key={s.title} className="glass hover-glow rounded-2xl p-8">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
                  <Icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="text-xs text-muted-foreground">{t.steps.step} {i + 1}</div>
                <h3 className="mt-1 text-xl font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              </div>
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
              <div key={f.title} className="glass rounded-2xl p-6 hover-glow">
                <Icon className="h-5 w-5 text-accent" />
                <h3 className="mt-4 font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
              </div>
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
            <div key={c.title} className="glass rounded-2xl p-6 hover-glow">
              <div className="text-xs text-muted-foreground">{t.careersSec.recommended}</div>
              <h3 className="mt-1 text-lg font-semibold">{c.title}</h3>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{t.careersSec.match}</span>
                <span className="text-accent font-medium">{c.match}%</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-secondary overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: `${c.match}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Testimonials */}
      <Section eyebrow={t.testimonials.eyebrow} title={t.testimonials.title}>
        <div className="grid gap-5 md:grid-cols-3">
          {t.testimonials.items.map((tt) => (
            <figure key={tt.name} className="glass rounded-2xl p-6">
              <div className="flex gap-0.5 text-accent">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <blockquote className="mt-4 text-sm leading-relaxed text-foreground/90">"{tt.quote}"</blockquote>
              <figcaption className="mt-4 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{tt.name}</span> · {tt.role}
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section eyebrow={t.faq.eyebrow} title={t.faq.title}>
        <div className="mx-auto max-w-3xl space-y-3">
          {t.faq.items.map((f) => (
            <details key={f.q} className="glass group rounded-2xl p-6 [&_summary::-webkit-details-marker]:hidden">
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
        <div className="mx-auto max-w-4xl glass rounded-3xl p-12 text-center glow-purple">
          <h2 className="text-3xl font-bold md:text-5xl">{t.finalCta.title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{t.finalCta.desc}</p>
          <Link
            to="/assessment"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground hover:glow-purple"
          >
            {t.finalCta.cta} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </PageShell>
  );
}

function Section({ id, eyebrow, title, children }: { id?: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="px-6 py-24 lg:py-28">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-14 text-center">
          <div className="text-xs uppercase tracking-widest text-accent">{eyebrow}</div>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl lg:text-5xl">{title}</h2>
        </div>
        {children}
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
          <div key={i} className="flex-1 rounded-t-lg bg-gradient-to-t from-primary/40 to-accent" style={{ height: `${b}%` }} />
        ))}
      </div>
      <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs">
        {[{ l: t.analytics.cognitive, v: "91" }, { l: t.analytics.creative, v: "88" }, { l: t.analytics.social, v: "76" }].map((s) => (
          <div key={s.l} className="rounded-lg bg-secondary/60 py-3">
            <div className="text-base font-semibold gradient-text">{s.v}</div>
            <div className="text-muted-foreground">{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
