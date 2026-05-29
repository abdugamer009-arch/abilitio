import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { TrendingUp, Brain, Target, Sparkles, ArrowUpRight } from "lucide-react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Abilitio" },
      { name: "description", content: "Your personalized talent and career intelligence dashboard." },
    ],
  }),
  component: DashboardPage,
});

const traits = [
  { label: "Cognitive", value: 91, color: "from-primary to-accent" },
  { label: "Creative", value: 88, color: "from-accent to-lavender" },
  { label: "Social", value: 76, color: "from-primary to-lavender" },
  { label: "Analytical", value: 84, color: "from-accent to-primary" },
  { label: "Empathy", value: 79, color: "from-lavender to-primary" },
  { label: "Leadership", value: 72, color: "from-primary to-accent" },
];

const careers = [
  { title: "Design Engineer", match: 94, desc: "Blend logic and aesthetics to build delightful products." },
  { title: "Research Scientist", match: 89, desc: "Explore unanswered questions in your field of curiosity." },
  { title: "Product Strategist", match: 86, desc: "Shape the direction of teams and ideas." },
  { title: "Creative Director", match: 81, desc: "Lead visual storytelling across brands and media." },
];

function DashboardPage() {
  return (
    <PageShell>
      <section className="px-6 pt-12 pb-24">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="text-xs text-muted-foreground">Welcome back</div>
              <h1 className="mt-1 text-3xl font-bold md:text-4xl">Hello, Alex <span className="gradient-text">✦</span></h1>
              <p className="mt-2 text-sm text-muted-foreground">Your talent profile is 92% complete.</p>
            </div>
            <button className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:glow-purple">
              Continue Assessment
            </button>
          </div>

          {/* KPI cards */}
          <div className="mt-8 grid gap-5 md:grid-cols-4">
            {[
              { label: "Overall Score", value: "87", icon: Sparkles, delta: "+4" },
              { label: "Talents Unlocked", value: "18", icon: Brain, delta: "+2" },
              { label: "Career Matches", value: "12", icon: Target, delta: "+3" },
              { label: "Growth", value: "+24%", icon: TrendingUp, delta: "vs last mo" },
            ].map((k) => (
              <div key={k.label} className="glass rounded-2xl p-5 hover-glow">
                <div className="flex items-center justify-between">
                  <k.icon className="h-4 w-4 text-accent" />
                  <span className="text-xs text-muted-foreground">{k.delta}</span>
                </div>
                <div className="mt-4 text-3xl font-semibold gradient-text">{k.value}</div>
                <div className="mt-1 text-xs text-muted-foreground">{k.label}</div>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            <div className="glass rounded-2xl p-6 lg:col-span-2">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Talent Distribution</h2>
                <span className="text-xs text-muted-foreground">Last 6 months</span>
              </div>
              <div className="mt-8 grid grid-cols-6 items-end gap-3" style={{ height: 180 }}>
                {traits.map((t) => (
                  <div key={t.label} className="flex flex-col items-center gap-2">
                    <div className="text-xs text-muted-foreground">{t.value}</div>
                    <div className={`w-full rounded-t-lg bg-gradient-to-t ${t.color}`} style={{ height: `${t.value}%` }} />
                    <div className="text-[10px] text-muted-foreground">{t.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-2xl p-6">
              <h2 className="font-semibold">Personality</h2>
              <div className="mt-6 space-y-4">
                {[
                  { l: "Openness", v: 88 },
                  { l: "Conscientiousness", v: 74 },
                  { l: "Extraversion", v: 62 },
                  { l: "Agreeableness", v: 81 },
                  { l: "Stability", v: 70 },
                ].map((p) => (
                  <div key={p.l}>
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">{p.l}</span>
                      <span className="text-foreground">{p.v}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary">
                      <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: `${p.v}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Career suggestions */}
          <div className="mt-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Suggested career paths</h2>
              <a href="#" className="text-xs text-accent hover:underline">View all</a>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {careers.map((c) => (
                <div key={c.title} className="glass group rounded-2xl p-6 hover-glow">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{c.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{c.desc}</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-accent" />
                  </div>
                  <div className="mt-5 flex items-center gap-3">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
                      <div className="h-full bg-gradient-to-r from-primary to-accent" style={{ width: `${c.match}%` }} />
                    </div>
                    <span className="text-xs text-accent">{c.match}% match</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Progress */}
          <div className="mt-6 glass rounded-2xl p-6">
            <h2 className="font-semibold">Progress this week</h2>
            <div className="mt-6 flex items-end justify-between gap-3" style={{ height: 100 }}>
              {[40, 55, 35, 70, 60, 85, 75].map((v, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-2">
                  <div className="w-full rounded-lg bg-gradient-to-t from-primary/30 to-accent" style={{ height: `${v}%` }} />
                  <span className="text-[10px] text-muted-foreground">{["M","T","W","T","F","S","S"][i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
