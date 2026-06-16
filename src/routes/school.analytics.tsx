import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/lib/auth-context";
import { getSchoolCareerOverview, type SchoolCareerOverviewDTO } from "@/lib/career.functions";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import { Users, GraduationCap, Sparkles, Brain, AlertTriangle, Lightbulb, Wand2 } from "lucide-react";

export const Route = createFileRoute("/school/analytics")({
  head: () => ({ meta: [{ title: "School Analytics — Abilitio" }] }),
  component: SchoolAnalytics,
});

const COLORS = ["#a855f7","#8b5cf6","#7c3aed","#6d28d9","#c084fc","#d8b4fe","#9333ea","#a78bfa"];

function SchoolAnalytics() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const fetchOverview = useServerFn(getSchoolCareerOverview);
  const [d, setD] = useState<SchoolCareerOverviewDTO | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate({ to: "/auth", search: { mode: "login", next: "/school/analytics" } }); return; }
    fetchOverview().then(setD).catch((e) => setErr(String(e?.message ?? "")));
  }, [user, loading, navigate, fetchOverview]);

  if (err?.includes("not_principal")) {
    return (
      <PageShell>
        <div className="mx-auto max-w-md px-6 pt-32 text-center">
          <h1 className="text-2xl font-bold">Principal access required</h1>
          <Link to="/school/register" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground hover:glow-purple">Register your school</Link>
        </div>
      </PageShell>
    );
  }
  if (!d) return <PageShell><div className="px-6 pt-32 text-center text-sm text-muted-foreground">Loading analytics…</div></PageShell>;

  const atRisk = d.students.filter((s) => s.class_name && s.top_career && !s.class_name.toLowerCase().includes(s.top_career.name.split(" ")[0].toLowerCase()) && s.top_career.score >= 75).slice(0, 8);

  return (
    <PageShell>
      <section className="px-6 pt-12 pb-24">
        <div className="mx-auto max-w-6xl">
          <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
                <GraduationCap className="h-3.5 w-3.5" /> School Analytics
              </div>
              <h1 className="mt-3 text-3xl font-bold gradient-text">Talent Intelligence Dashboard</h1>
            </div>
            <div className="flex gap-2">
              <Link to="/school/class-builder" className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground hover:glow-purple"><Wand2 className="h-4 w-4" />AI Class Builder</Link>
              <Link to="/school/dashboard" className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:bg-secondary/50">School Overview</Link>
            </div>
          </header>

          <div className="grid gap-4 md:grid-cols-4">
            <Stat icon={Users} label="Total Students" value={d.totalStudents} />
            <Stat icon={Sparkles} label="Assessments Completed" value={d.completed} />
            <Stat icon={Brain} label="Personality Types" value={d.personalityDistribution.length} />
            <Stat icon={GraduationCap} label="University Tracks" value={d.universityDistribution.length} />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Glass title="Career Distribution" subtitle="Students by top career category">
              <div className="h-72">
                <ResponsiveContainer>
                  <BarChart data={d.careerDistribution.slice(0, 10)}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} allowDecimals={false} />
                    <Tooltip contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                    <Bar dataKey="count" fill="#a855f7" radius={[6,6,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Glass>

            <Glass title="Personality Distribution" subtitle="MBTI types across school">
              <div className="h-72">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={d.personalityDistribution.slice(0, 8)} dataKey="count" nameKey="type" outerRadius={90} innerRadius={50}>
                      {d.personalityDistribution.slice(0, 8).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Glass>

            <Glass title="Cognitive Tier Distribution" subtitle="Cognitive ability tiers">
              <div className="h-64">
                <ResponsiveContainer>
                  <BarChart data={d.cognitiveDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="tier" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} allowDecimals={false} />
                    <Tooltip contentStyle={{ background: "hsl(var(--background))", border: "1px solid hsl(var(--border))", borderRadius: 12 }} />
                    <Bar dataKey="count" fill="#7c3aed" radius={[6,6,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Glass>

            <Glass title="University Major Interest" subtitle="Most-recommended majors">
              <ul className="space-y-2 text-sm">
                {d.universityDistribution.map((m) => (
                  <li key={m.name} className="flex items-center justify-between rounded-xl bg-secondary/30 px-3 py-2">
                    <span>{m.name}</span>
                    <span className="text-xs font-medium text-primary">{m.count}</span>
                  </li>
                ))}
                {!d.universityDistribution.length && <li className="text-xs text-muted-foreground">No data yet.</li>}
              </ul>
            </Glass>
          </div>

          {/* Heatmap */}
          <div className="glass mt-6 rounded-3xl p-6">
            <h3 className="text-sm font-semibold">Student Talent Heatmap</h3>
            <p className="text-xs text-muted-foreground">Class × career-category density</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {d.classHeatmap.map((row) => (
                <div key={row.className} className="rounded-2xl border border-border bg-secondary/30 p-4">
                  <div className="text-sm font-semibold">Class {row.className}</div>
                  <ul className="mt-2 space-y-1.5">
                    {Object.entries(row.buckets).sort((a, b) => b[1] - a[1]).map(([cat, n]) => (
                      <li key={cat} className="flex items-center gap-2 text-xs">
                        <span className="w-32 truncate">{cat}</span>
                        <div className="h-2 flex-1 rounded-full bg-secondary"><div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, n * 18)}%` }} /></div>
                        <span className="w-6 text-right text-muted-foreground">{n}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {!d.classHeatmap.length && <div className="rounded-2xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground md:col-span-2">No class data yet.</div>}
            </div>
          </div>

          {/* At-risk */}
          <div className="glass mt-6 rounded-3xl p-6">
            <div className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-primary" /><h3 className="text-sm font-semibold">At-Risk Talent Misalignment</h3></div>
            <p className="text-xs text-muted-foreground">Students whose current class may not match their strongest career direction.</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {atRisk.length ? atRisk.map((s) => (
                <div key={s.user_id} className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4">
                  <div className="text-sm font-semibold">{s.name}</div>
                  <div className="mt-1 text-xs text-muted-foreground">Currently: <span className="text-foreground/80">{s.class_name}</span></div>
                  <div className="text-xs">Recommended: <span className="text-primary font-medium">{s.top_career?.name}</span> · {s.top_career?.score}% confidence</div>
                </div>
              )) : <div className="rounded-2xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground md:col-span-2">No misalignments detected.</div>}
            </div>
          </div>

          {/* AI Insights */}
          <div className="glass mt-6 rounded-3xl p-6">
            <div className="flex items-center gap-2"><Lightbulb className="h-4 w-4 text-primary" /><h3 className="text-sm font-semibold">AI Insights</h3></div>
            <ul className="mt-3 space-y-2 text-sm">
              {d.careerDistribution[0] && (
                <li className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
                  Your school shows strong <strong>{d.careerDistribution[0].name}</strong> orientation with {d.careerDistribution[0].count} top matches.
                </li>
              )}
              {d.personalityDistribution[0] && (
                <li className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
                  Dominant personality type: <strong>{d.personalityDistribution[0].type}</strong> ({d.personalityDistribution[0].count} students).
                </li>
              )}
              {d.cognitiveDistribution[0] && (
                <li className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3">
                  Most students fall in the <strong>{d.cognitiveDistribution.sort((a, b) => b.count - a.count)[0].tier}</strong> cognitive tier.
                </li>
              )}
            </ul>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function Stat({ icon: Icon, label, value }: { icon: any; label: string; value: string | number }) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between"><span className="text-xs text-muted-foreground">{label}</span><Icon className="h-4 w-4 text-primary" /></div>
      <div className="mt-2 text-2xl font-bold gradient-text">{value}</div>
    </div>
  );
}

function Glass({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-3xl p-6">
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}
