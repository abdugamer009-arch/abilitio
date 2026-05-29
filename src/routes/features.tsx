import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { Brain, LineChart, Compass, ShieldCheck, Sparkles, Users, Target, BookOpen, Zap } from "lucide-react";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — Abilitio" },
      { name: "description", content: "Talent discovery, AI analytics, career mapping, and parent insights — all in one beautiful platform." },
    ],
  }),
  component: FeaturesPage,
});

const groups = [
  {
    title: "Discover",
    items: [
      { icon: Brain, title: "Adaptive Assessment", desc: "Questions that evolve with your answers." },
      { icon: Target, title: "24 Talent Dimensions", desc: "From abstract reasoning to emotional intelligence." },
      { icon: Sparkles, title: "Personality Insights", desc: "Understand your inner motivations." },
    ],
  },
  {
    title: "Analyze",
    items: [
      { icon: LineChart, title: "Live Dashboards", desc: "Visualize strengths in real time." },
      { icon: Zap, title: "AI Recommendations", desc: "Updated as you grow and learn." },
      { icon: BookOpen, title: "Reports & Exports", desc: "Beautiful PDF reports for schools." },
    ],
  },
  {
    title: "Grow",
    items: [
      { icon: Compass, title: "Career Mapping", desc: "Explore matched paths and roles." },
      { icon: Users, title: "Parent Dashboard", desc: "Empower parents to nurture talent." },
      { icon: ShieldCheck, title: "Private & Secure", desc: "Encrypted end-to-end, always." },
    ],
  },
];

function FeaturesPage() {
  return (
    <PageShell>
      <section className="px-6 pt-20 pb-12 text-center">
        <div className="text-xs uppercase tracking-widest text-accent">Features</div>
        <h1 className="mt-3 text-4xl font-bold md:text-6xl">Built for <span className="gradient-text">curious minds</span></h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          Every feature in Abilitio is designed to feel calm, premium, and trustworthy — so students can focus on what matters.
        </p>
      </section>

      {groups.map((g) => (
        <section key={g.title} className="px-6 py-12">
          <div className="mx-auto max-w-6xl">
            <h2 className="mb-8 text-2xl font-semibold">{g.title}</h2>
            <div className="grid gap-5 md:grid-cols-3">
              {g.items.map((f) => (
                <div key={f.title} className="glass rounded-2xl p-6 hover-glow">
                  <f.icon className="h-5 w-5 text-accent" />
                  <h3 className="mt-4 font-semibold">{f.title}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </PageShell>
  );
}
