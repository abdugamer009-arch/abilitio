import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Brain,
  Compass,
  Sparkles,
  Zap,
  ShieldCheck,
  Star,
  Swords,
  ChevronDown,
} from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { ParticleConstellation } from "@/components/ParticleConstellation";
import { GradientDivider } from "@/components/GradientDivider";
import { TrustMarquee } from "@/components/TrustMarquee";
import { GlowBlob } from "@/components/GlowBlob";
import { Reveal } from "@/components/Reveal";
import { SpotlightCard } from "@/components/SpotlightCard";
import { CountUp } from "@/components/CountUp";
import { GhostSticker } from "@/components/Stickers";
import { BrainScene } from "@/components/BrainScene";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Abilitio — Discover Your True Potential" },
      {
        name: "description",
        content:
          "AI-powered assessments that reveal natural talents, strengths, and career paths for students and parents.",
      },
    ],
  }),
  component: LandingPage,
});

const stepIcons = [Brain, Zap, Compass];

function LandingPage() {
  const t = useT();

  return (
    <PageShell>
      {/* The brain is a fixed layer behind the whole page, not a hero element,
          so it keeps turning as the page is read. It mounts client-side only
          and skips itself entirely on touch/narrow/reduced-motion. */}
      <BrainScene />

      {/* Hero — one left-aligned column. The right side is deliberately empty:
          that is where the brain shows through, so the copy and the artwork
          share the fold without competing for the same space. */}
      <section className="relative px-6 pt-24 pb-28 sm:pt-32 sm:pb-36 lg:pt-40 lg:pb-44">
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 z-0" />
        <ParticleConstellation />
        <div className="relative z-10 mx-auto grid max-w-[1200px] items-center gap-14 lg:grid-cols-2 lg:gap-16">
        <div key={t.hero.titleA} className="animate-fade-up">
          <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-primary/30 bg-primary/8 px-5 py-2 text-sm text-primary/90 backdrop-blur shadow-[0_0_20px_-8px_var(--glow)]">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gradient-to-br from-primary to-accent" />
            </span>
            {t.hero.badge}
          </div>
          {/* Lowercase via CSS rather than in the copy, so all three languages
              get it and screen readers still receive the original casing. */}
          <h1 className="text-balance lowercase text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-[76px] lg:leading-[1.06]">
            {t.hero.titleA} <span className="gradient-text">{t.hero.titleB}</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-muted-foreground sm:mt-7 sm:text-xl lg:text-[21px] lg:leading-relaxed">
            {t.hero.subtitle}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              to="/assessment"
              className="cta-sheen group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-9 py-4 text-base font-medium text-primary-foreground shadow-[0_10px_36px_-10px_var(--glow)] transition-all hover:-translate-y-0.5 lg:px-10 lg:py-5 lg:text-lg"
            >
              {t.hero.cta}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/features"
              className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-9 py-4 text-base font-medium text-primary backdrop-blur transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:bg-primary/15 hover:shadow-[0_8px_24px_-10px_oklch(0.55_0.22_295_/_0.3)] lg:px-10 lg:py-5 lg:text-lg"
            >
              {t.hero.learnMore}
            </Link>
          </div>

          {/* Honest trust signals */}
          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 fill-accent text-accent" /> {t.common.freeToStart}
            </span>
            <span className="hidden h-3 w-px bg-border sm:block" aria-hidden />
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-accent" /> {t.common.noCreditCard}
            </span>
            <span className="hidden h-3 w-px bg-border sm:block" aria-hidden />
            <span className="inline-flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-accent" /> 30-question AI assessment
            </span>
          </div>

        </div>

        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6">
        <GradientDivider />
      </div>

      {/* Trust marquee */}
      <TrustMarquee />

      <div className="mx-auto max-w-6xl px-6">
        <GradientDivider />
      </div>

      {/* Stats row */}
      <Reveal className="mx-auto max-w-4xl px-6 py-8">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { value: 30, suffix: "", label: "Questions per session" },
            { value: 16, suffix: "", label: "Personality types mapped" },
            { value: 3, suffix: "", label: "Dimensions: mind, traits, interests" },
            { value: 5, suffix: " min", label: "Average completion time" },
          ].map((s) => (
            <div
              key={s.label}
              className="glass rounded-2xl p-5 text-center transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_8px_24px_-10px_oklch(0.55_0.22_295_/_0.3)]"
            >
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
                  <div className="text-xs text-muted-foreground">
                    {t.steps.step} {i + 1}
                  </div>
                  <h3 className="mt-1 text-xl font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
                </SpotlightCard>
              </Reveal>
            );
          })}
        </div>
      </Section>

      {/* The six-card "Features" grid used to sit here. It restated the two
          sections either side of it (Analytics, Career Paths) and claimed "24
          dimensions" where the hero strip on this same page says 3. The
          dedicated /features page carries this content instead. */}

      {/* The standalone "Analytics" section stood here purely to show the
          talent-profile card. That card is now in the hero, where it does the
          same job three screens earlier, so the section had nothing left to
          say that the hero doesn't. */}

      {/* Career paths */}
      <Section eyebrow={t.careersSec.eyebrow} title={t.careersSec.title}>
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { title: "Design Engineer", match: 94 },
            { title: "Research Scientist", match: 89 },
            { title: "Product Strategist", match: 86 },
          ].map((c) => (
            <SpotlightCard
              key={c.title}
              className="glass rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_oklch(0.55_0.22_295_/_0.35)]"
            >
              <div className="text-xs text-muted-foreground">{t.careersSec.recommended}</div>
              <h3 className="mt-1 text-lg font-semibold">{c.title}</h3>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{t.careersSec.match}</span>
                <span className="font-semibold gradient-text">
                  <CountUp value={c.match} suffix="%" duration={1200} />
                </span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-secondary/60 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent"
                  style={{ width: `${c.match}%`, boxShadow: "0 0 8px oklch(0.65 0.22 295 / 0.4)" }}
                />
              </div>
            </SpotlightCard>
          ))}
        </div>
      </Section>

      {/* Career Battles */}
      <Section eyebrow="Career Intelligence" title="Which path fits you best?">
        <div className="grid gap-5 md:grid-cols-2">
          {[
            {
              a: { name: "Software Engineer", salary: "$70k → $250k", demand: 95, emoji: "💻" },
              b: { name: "Data Scientist", salary: "$80k → $230k", demand: 90, emoji: "📊" },
            },
            {
              a: { name: "Doctor", salary: "$200k → $500k+", demand: 88, emoji: "🩺" },
              b: { name: "Psychologist", salary: "$60k → $180k", demand: 72, emoji: "🧠" },
            },
          ].map((battle, i) => (
            <div
              key={i}
              className="group relative overflow-hidden glass rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_-20px_oklch(0.55_0.22_295_/_0.4)]"
            >
              <GlowBlob className="-right-10 -top-10 h-32 w-32 opacity-20 blur-3xl transition-opacity duration-300 group-hover:opacity-40" />
              <div className="relative flex items-center justify-between gap-4">
                <div className="flex-1 text-center">
                  <div className="text-3xl">{battle.a.emoji}</div>
                  <div className="mt-2 text-sm font-semibold">{battle.a.name}</div>
                  <div className="mt-1 text-[11px] text-muted-foreground">{battle.a.salary}</div>
                  <div className="mt-2 h-1.5 rounded-full bg-secondary/60 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                      style={{ width: `${battle.a.demand}%` }}
                    />
                  </div>
                  <div className="mt-1 text-[10px] text-primary">{battle.a.demand}% demand</div>
                </div>
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_4px_14px_-4px_var(--glow)]">
                    <Swords className="h-4 w-4" />
                  </div>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    vs
                  </span>
                </div>
                <div className="flex-1 text-center">
                  <div className="text-3xl">{battle.b.emoji}</div>
                  <div className="mt-2 text-sm font-semibold">{battle.b.name}</div>
                  <div className="mt-1 text-[11px] text-muted-foreground">{battle.b.salary}</div>
                  <div className="mt-2 h-1.5 rounded-full bg-secondary/60 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-accent/70 to-primary/70"
                      style={{ width: `${battle.b.demand}%` }}
                    />
                  </div>
                  <div className="mt-1 text-[10px] text-primary">{battle.b.demand}% demand</div>
                </div>
              </div>
              <Link
                to="/career-battles"
                className="relative mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-xs font-medium text-primary transition-all hover:border-primary/50 hover:bg-primary/15 hover:-translate-y-0.5 hover:shadow-[0_6px_16px_-6px_oklch(0.55_0.22_295_/_0.3)]"
              >
                See full comparison <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link
            to="/career-battles"
            className="cta-sheen relative overflow-hidden inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-[0_6px_20px_-6px_var(--glow)] hover:-translate-y-0.5 transition-all"
          >
            <Swords className="h-4 w-4" /> Explore All Career Battles
          </Link>
        </div>
      </Section>

      {/* A three-card testimonial wall used to sit here. The quotes were
          invented people ("Maya R., Parent" / "Dr. Lin, School Counselor")
          shown with five-star ratings, under a footnote admitting they were
          illustrative. Fabricated social proof is worse than none on a launch
          page; /success-stories still carries this content, clearly labelled. */}

      {/* FAQ */}
      <Section eyebrow={t.faq.eyebrow} title={t.faq.title}>
        <div className="mx-auto max-w-3xl space-y-3">
          {t.faq.items.map((f) => (
            <details
              key={f.q}
              className="glass group rounded-2xl p-6 transition-all duration-300 hover:border-primary/20 open:border-primary/20 open:bg-gradient-to-br open:from-primary/5 open:to-secondary/30 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-medium">
                {f.q}
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-all duration-300 group-open:border-primary/40 group-open:bg-gradient-to-br group-open:from-primary group-open:to-accent group-open:text-primary-foreground group-open:shadow-[0_2px_8px_-2px_var(--glow)]">
                  <ChevronDown className="h-3.5 w-3.5 transition-transform duration-300 group-open:rotate-180" />
                </span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
            </details>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <section className="relative px-6 py-24">
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="absolute left-1/2 top-1/2 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-[120px]"
            style={{
              background: "radial-gradient(ellipse, oklch(0.6 0.22 290 / 0.5), transparent 65%)",
            }}
          />
        </div>
        <Reveal className="mx-auto max-w-4xl">
          <div
            className="glass relative rounded-3xl p-12 text-center"
            style={{ boxShadow: "0 0 80px -20px oklch(0.6 0.22 295 / 0.4)" }}
          >
            <div
              aria-hidden
              className="bg-grid pointer-events-none absolute inset-0 overflow-hidden rounded-3xl"
            />
            {/* One last sticker peeling off the closing card. */}
            <GhostSticker className="-top-6 -right-4 z-20" rotate={13} size={44} />
            <div className="relative">
              <h2 className="lowercase text-3xl font-bold md:text-5xl">{t.finalCta.title}</h2>
              <p className="mx-auto mt-4 max-w-xl text-muted-foreground">{t.finalCta.desc}</p>
              <Link
                to="/assessment"
                className="cta-sheen relative mt-8 inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-primary to-accent px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-[0_8px_28px_-8px_var(--glow)] hover:-translate-y-0.5 transition-all"
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

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id?: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="px-6 py-20 lg:py-24">
      {/* Left-aligned section heads. Centring every block made each section
          read as its own poster; a single left edge running down the page
          gives the sections one shared spine instead. */}
      <div className="mx-auto max-w-[1200px]">
        <Reveal className="mb-12">
          <div className="text-xs uppercase tracking-widest text-accent">{eyebrow}</div>
          <div
            aria-hidden
            className="mt-2 h-px w-8 rounded-full bg-gradient-to-r from-accent/60 to-transparent"
          />
          <h2 className="mt-4 lowercase text-3xl font-bold md:text-4xl lg:text-[44px]">{title}</h2>
        </Reveal>
        <Reveal delay={120}>{children}</Reveal>
      </div>
    </section>
  );
}
