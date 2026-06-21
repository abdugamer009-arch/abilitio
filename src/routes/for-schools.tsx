import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Reveal } from "@/components/Reveal";
import { SpotlightCard } from "@/components/SpotlightCard";
import { GraduationCap, BarChart3, Users, Sparkles, Shield, ArrowRight, Check } from "lucide-react";

export const Route = createFileRoute("/for-schools")({
  head: () => ({
    meta: [
      { title: "For Schools — Abilitio" },
      { name: "description", content: "AI talent discovery for schools: identify student strengths and build specialized classes from real assessment data." },
      { property: "og:title", content: "Abilitio for Schools" },
      { property: "og:description", content: "Discover student talent and design specialized classes with AI-powered analytics." },
    ],
  }),
  component: ForSchoolsPage,
});

const PLANS = [
  { name: "Starter", limit: "Up to 100 students", price: "Free", features: ["School dashboard", "Class analytics", "Talent distribution"] },
  { name: "Professional", limit: "Up to 500 students", price: "Contact us", features: ["Everything in Starter", "Specialized class generator", "PDF reports", "Teacher accounts"], highlight: true },
  { name: "Enterprise", limit: "Unlimited students", price: "Contact us", features: ["Everything in Professional", "Priority support", "Custom integrations", "Strategic AI insights"] },
];

function ForSchoolsPage() {
  return (
    <PageShell>
      <section className="relative px-6 pt-20 pb-12">
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-5xl text-center animate-fade-up">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
            <GraduationCap className="h-3.5 w-3.5" /> Built for Schools
          </div>
          <h1 className="mt-6 text-4xl font-bold tracking-tight md:text-6xl">
            <span className="gradient-text">Discover student talent.</span><br />
            Build specialized classes.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground md:text-lg">
            Abilitio for Schools gives principals and academic directors a complete picture of every student's
            cognitive profile, interests, and career fit — then helps design data-driven specialized classes.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/school/register" className="cta-sheen relative inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-all hover:glow-purple overflow-hidden">
              Register your school <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/school/join" className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-6 py-3 text-sm font-medium transition-all hover:bg-secondary">
              Join as a student
            </Link>
          </div>
        </div>
      </section>

      <section className="px-6 pb-12">
        <Reveal className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
          {[
            { icon: BarChart3, title: "Premium Analytics", body: "Talent distribution, career fit, IQ insights — visualized for every class." },
            { icon: Users, title: "Class Intelligence", body: "Compare classes, find leaders, surface hidden strengths automatically." },
            { icon: Sparkles, title: "AI Class Builder", body: "Generate specialized engineering, business, medical, and creative classes from assessment data." },
          ].map((f) => (
            <SpotlightCard key={f.title} className="glass rounded-2xl p-6">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_6px_24px_-8px_var(--glow)]">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </SpotlightCard>
          ))}
        </Reveal>
      </section>

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-5xl">
          <Reveal className="mb-8 text-center">
            <h2 className="text-2xl font-bold md:text-3xl">School subscription plans</h2>
            <p className="mt-2 text-sm text-muted-foreground">Choose the tier that fits your institution.</p>
          </Reveal>
          <Reveal delay={100} className="grid gap-5 md:grid-cols-3">
            {PLANS.map((p) => (
              <div key={p.name} className={`glass rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1 ${p.highlight ? "ring-1 ring-primary/40 shadow-[0_20px_60px_-30px_var(--glow)]" : "hover-glow"}`}>
                {p.highlight && <div className="mb-3 inline-flex rounded-full bg-primary/15 px-2.5 py-0.5 text-[11px] font-medium text-primary">Most popular</div>}
                <div className="text-sm text-muted-foreground">{p.name}</div>
                <div className="mt-1 text-2xl font-bold gradient-text">{p.price}</div>
                <div className="mt-1 text-xs text-muted-foreground">{p.limit}</div>
                <ul className="mt-5 space-y-2 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent/20">
                        <Check className="h-2.5 w-2.5 text-accent" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Reveal>
          <div className="mt-10 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5" /> Student data is private and visible only to your school's principal.
          </div>
        </div>
      </section>
    </PageShell>
  );
}
