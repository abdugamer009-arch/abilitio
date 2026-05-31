import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Brain, Compass, LineChart, Sparkles, Target, Users, Zap, ShieldCheck, Star } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { FloatingShapes } from "@/components/FloatingShapes";
import { GradientDivider } from "@/components/GradientDivider";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Abilitio — Discover Your True Potential" },
      { name: "description", content: "AI-powered assessments that reveal natural talents, strengths, and career paths for students and parents." },
    ],
  }),
  component: LandingPage,
});

const steps = [
  { icon: Brain, title: "Take the Assessment", desc: "A short, science-backed quiz that adapts to you." },
  { icon: Zap, title: "AI Analyzes You", desc: "Our model maps cognitive, social, and creative strengths." },
  { icon: Compass, title: "Discover Your Path", desc: "Personalized career routes and growth plans." },
];

const features = [
  { icon: Target, title: "Talent Discovery", desc: "Identify innate abilities across 24 dimensions." },
  { icon: LineChart, title: "Live Analytics", desc: "Beautiful dashboards that update as you grow." },
  { icon: Compass, title: "Career Mapping", desc: "Curated paths matched to your unique profile." },
  { icon: Users, title: "Parent Insights", desc: "Help parents nurture strengths with clarity." },
  { icon: ShieldCheck, title: "Private by Design", desc: "Your data is encrypted and never sold." },
  { icon: Sparkles, title: "Adaptive AI", desc: "Recommendations improve with every interaction." },
];

const testimonials = [
  { name: "Maya R.", role: "Parent", quote: "Abilitio gave our daughter direction when she felt lost. The clarity is remarkable." },
  { name: "Daniel K.", role: "Student, 16", quote: "I finally see what I'm good at — and what I could become." },
  { name: "Dr. Lin", role: "School Counselor", quote: "The most thoughtful talent tool I've used in a decade." },
];

const faqs = [
  { q: "How accurate is the AI assessment?", a: "Our model is trained on validated psychometric research and refined with over 100,000 assessments." },
  { q: "Is Abilitio suitable for any age?", a: "Yes — we tailor the experience for students aged 10–22, with separate parent insights." },
  { q: "Is my data safe?", a: "All data is end-to-end encrypted. We never share or sell personal information." },
  { q: "How long does an assessment take?", a: "Around 15 minutes. You can pause and resume anytime." },
];

function LandingPage() {
  return (
    <PageShell>
      {/* Hero */}
      <section className="relative px-6 pt-24 pb-32 text-center">
        <FloatingShapes />
        <div className="mx-auto max-w-4xl animate-fade-up">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border/60 bg-secondary/40 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur">
            <Sparkles className="h-3 w-3 text-accent" />
            Now powered by next-gen talent AI
          </div>
          <h1 className="text-5xl font-bold tracking-tight md:text-7xl">
            Discover Your <span className="gradient-text">True Potential</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
            AI-powered assessments that reveal your natural talents, hidden strengths, and the career paths where you'll truly thrive.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/assessment"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground transition-all hover:glow-purple"
            >
              Start Assessment
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/features"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-7 py-3.5 text-sm font-medium backdrop-blur transition-colors hover:bg-secondary"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-6">
        <GradientDivider />
      </div>

      {/* How it works */}
      <Section id="how" eyebrow="How it works" title="Three steps to clarity">
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((s, i) => (
            <div key={s.title} className="glass hover-glow rounded-2xl p-8">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent">
                <s.icon className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="text-xs text-muted-foreground">Step {i + 1}</div>
              <h3 className="mt-1 text-xl font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Features */}
      <Section eyebrow="Features" title="Everything you need to grow">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="glass rounded-2xl p-6 hover-glow">
              <f.icon className="h-5 w-5 text-accent" />
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* AI Analytics Preview */}
      <Section eyebrow="Analytics" title="See your mind, visualized">
        <div className="glass rounded-3xl p-8 md:p-12">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <h3 className="text-2xl font-semibold">Real-time talent intelligence</h3>
              <p className="mt-3 text-muted-foreground">
                A living dashboard of who you are — cognitive style, creative range, social strengths and the careers that match.
              </p>
              <Link to="/dashboard" className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-accent hover:underline">
                Explore the dashboard <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <AnalyticsPreview />
          </div>
        </div>
      </Section>

      {/* Career paths */}
      <Section eyebrow="Career Paths" title="Where you could thrive">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { title: "Design Engineer", match: 94 },
            { title: "Research Scientist", match: 89 },
            { title: "Product Strategist", match: 86 },
          ].map((c) => (
            <div key={c.title} className="glass rounded-2xl p-6 hover-glow">
              <div className="text-xs text-muted-foreground">Recommended</div>
              <h3 className="mt-1 text-lg font-semibold">{c.title}</h3>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Match</span>
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
      <Section eyebrow="Loved by families" title="Stories from our community">
        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="glass rounded-2xl p-6">
              <div className="flex gap-0.5 text-accent">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
              <blockquote className="mt-4 text-sm leading-relaxed text-foreground/90">"{t.quote}"</blockquote>
              <figcaption className="mt-4 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{t.name}</span> · {t.role}
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section eyebrow="FAQ" title="Questions, answered">
        <div className="mx-auto max-w-3xl space-y-3">
          {faqs.map((f) => (
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
          <h2 className="text-3xl font-bold md:text-5xl">Ready to meet your potential?</h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">Take your first assessment in under 15 minutes.</p>
          <Link
            to="/assessment"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground hover:glow-purple"
          >
            Start Assessment <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </PageShell>
  );
}

function Section({ id, eyebrow, title, children }: { id?: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <div className="text-xs uppercase tracking-widest text-accent">{eyebrow}</div>
          <h2 className="mt-3 text-3xl font-bold md:text-4xl">{title}</h2>
        </div>
        {children}
      </div>
    </section>
  );
}

function AnalyticsPreview() {
  const bars = [82, 68, 91, 54, 76, 88];
  return (
    <div className="glass rounded-2xl p-6">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Talent Profile</span>
        <span className="text-accent">Live</span>
      </div>
      <div className="mt-6 flex h-40 items-end justify-between gap-3">
        {bars.map((b, i) => (
          <div key={i} className="flex-1 rounded-t-lg bg-gradient-to-t from-primary/40 to-accent" style={{ height: `${b}%` }} />
        ))}
      </div>
      <div className="mt-6 grid grid-cols-3 gap-3 text-center text-xs">
        {[{ l: "Cognitive", v: "91" }, { l: "Creative", v: "88" }, { l: "Social", v: "76" }].map((s) => (
          <div key={s.l} className="rounded-lg bg-secondary/60 py-3">
            <div className="text-base font-semibold gradient-text">{s.v}</div>
            <div className="text-muted-foreground">{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
