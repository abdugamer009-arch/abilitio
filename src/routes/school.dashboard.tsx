import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useServerFn } from "@tanstack/react-start";
import {
  getPrincipalDashboard,
  generateSpecializedClasses,
  listSpecializedClasses,
  type PrincipalDashboardDTO,
  type SpecializedClassDTO,
} from "@/lib/schools/schools.functions";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Users,
  GraduationCap,
  Trophy,
  Sparkles,
  Lightbulb,
  FileText,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/school/dashboard")({
  head: () => ({
    meta: [
      { title: "Principal Dashboard — Abilitio" },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: PrincipalDashboard,
});

const COLORS = [
  "#a855f7",
  "#8b5cf6",
  "#7c3aed",
  "#6d28d9",
  "#c084fc",
  "#d8b4fe",
  "#9333ea",
  "#a78bfa",
];

function PrincipalDashboard() {
  const t = useT();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const fetchDashboard = useServerFn(getPrincipalDashboard);
  const generate = useServerFn(generateSpecializedClasses);
  const listSpec = useServerFn(listSpecializedClasses);

  const [data, setData] = useState<PrincipalDashboardDTO | null>(null);
  const [specClasses, setSpecClasses] = useState<SpecializedClassDTO[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/auth", search: { mode: "login", next: "/school/dashboard" } });
      return;
    }
    Promise.all([fetchDashboard(), listSpec()])
      .then(([d, s]) => {
        setData(d);
        setSpecClasses(s.classes);
      })
      .catch((e) => setErr(String(e?.message ?? "")));
  }, [user, loading, navigate, fetchDashboard, listSpec]);

  async function onGenerate() {
    setGenerating(true);
    try {
      await generate();
      const s = await listSpec();
      setSpecClasses(s.classes);
    } finally {
      setGenerating(false);
    }
  }

  if (err?.includes("not_principal")) {
    return (
      <PageShell>
        <div className="mx-auto max-w-md px-6 pt-32 text-center">
          <h1 className="text-2xl font-bold">{t.school.notPrincipalTitle}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{t.school.notPrincipalBody}</p>
          <Link
            to="/school/register"
            className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm text-primary-foreground hover:glow-purple"
          >
            {t.school.registerSchool}
          </Link>
        </div>
      </PageShell>
    );
  }

  if (!data) {
    return (
      <PageShell>
        <section
          className="px-6 pt-12 pb-24"
          aria-busy="true"
          aria-label={t.school.loadingDashboard}
        >
          <div className="mx-auto max-w-6xl">
            <div className="skeleton h-10 w-72 rounded-2xl" />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton h-24 rounded-3xl" />
              ))}
            </div>
            <div className="skeleton mt-6 h-80 rounded-3xl" />
          </div>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="px-6 pt-16 pb-24">
        <div className="mx-auto max-w-6xl">
          <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs text-primary">
                <GraduationCap className="h-3.5 w-3.5" /> {t.school.principalDashboard}
              </div>
              <h1 className="mt-3 text-3xl font-bold gradient-text">{data.school.name}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                {t.school.code}{" "}
                <span className="font-mono text-foreground">{data.school.code}</span> ·{" "}
                {t.school.plan}{" "}
                <span className="capitalize text-foreground">{data.school.plan}</span>
              </p>
            </div>
            <Link
              to="/school/report"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-4 py-2 text-sm hover:bg-secondary"
            >
              <FileText className="h-4 w-4" /> {t.school.schoolReport}
            </Link>
          </header>

          {/* Stat cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <StatCard icon={Users} label={t.school.totalStudents} value={data.totals.students} />
            <StatCard
              icon={GraduationCap}
              label={t.school.totalClasses}
              value={data.totals.classes}
            />
            <StatCard
              icon={Trophy}
              label={t.school.assessmentsCompleted}
              value={data.totals.completed}
            />
            <StatCard
              icon={Sparkles}
              label={t.school.completionRate}
              value={`${data.totals.completionRate}%`}
            />
          </div>

          {/* Charts */}
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="glass rounded-3xl p-6">
              <h3 className="text-sm font-semibold">{t.school.talentDistribution}</h3>
              <p className="text-xs text-muted-foreground">{t.school.talentDistributionSub}</p>
              <div className="mt-4 h-72">
                <ResponsiveContainer>
                  <BarChart data={data.bucketDistribution}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      fontSize={11}
                      allowDecimals={false}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: 12,
                      }}
                    />
                    <Bar dataKey="count" fill="#a855f7" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="glass rounded-3xl p-6">
              <h3 className="text-sm font-semibold">{t.school.topCareerMatches}</h3>
              <p className="text-xs text-muted-foreground">{t.school.topCareerMatchesSub}</p>
              <div className="mt-4 h-72">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={data.careerDistribution.slice(0, 8)}
                      dataKey="count"
                      nameKey="name"
                      outerRadius={90}
                      innerRadius={50}
                    >
                      {data.careerDistribution.slice(0, 8).map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: 12,
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Class breakdown */}
          <div className="mt-6 glass rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">{t.school.classAnalytics}</h3>
                <p className="text-xs text-muted-foreground">{t.school.classAnalyticsSub}</p>
              </div>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              {data.classBreakdown.map((c) => (
                <div
                  key={c.classId}
                  className="rounded-2xl border border-border bg-secondary/30 p-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">
                      {t.school.classLabel} {c.className}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {c.total} {t.school.students}
                    </div>
                  </div>
                  <div className="mt-3 space-y-1.5">
                    {c.buckets
                      .filter((b) => b.count > 0)
                      .slice(0, 5)
                      .map((b) => (
                        <div key={b.bucket} className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">{b.label}</span>
                          <span className="font-medium">{b.count}</span>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
              {!data.classBreakdown.length && (
                <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                  {t.school.noClasses}
                </div>
              )}
            </div>
          </div>

          {/* Top talents */}
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.topTalents
              .filter((talent) => talent.students.length)
              .map((talent) => (
                <div key={talent.dimension} className="glass rounded-2xl p-5">
                  <h4 className="text-xs font-semibold text-primary">{talent.dimension}</h4>
                  <ul className="mt-3 space-y-1.5 text-sm">
                    {talent.students.map((s) => (
                      <li key={s.user_id} className="flex items-center justify-between">
                        <span>{s.name}</span>
                        {talent.dimension.includes("Analytical") && (
                          <span className="text-xs text-muted-foreground">{s.score}/10</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>

          {/* AI Insights */}
          <div className="mt-6 glass rounded-3xl p-6">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold">{t.school.aiInsights}</h3>
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              {data.insights.map((i, idx) => (
                <li
                  key={idx}
                  className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-3 text-foreground/90"
                >
                  {i}
                </li>
              ))}
            </ul>
          </div>

          {/* Specialized classes */}
          <div className="mt-6 glass rounded-3xl p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold">{t.school.classCreator}</h3>
                <p className="text-xs text-muted-foreground">{t.school.classCreatorSub}</p>
              </div>
              <button
                onClick={onGenerate}
                disabled={generating}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm text-primary-foreground hover:glow-purple disabled:opacity-60"
              >
                {generating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                {t.school.generateClasses}
              </button>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {specClasses.map((s) => (
                <div
                  key={s.id}
                  className="rounded-2xl border border-primary/20 bg-secondary/20 p-5"
                >
                  <div className="text-sm font-semibold">{s.title}</div>
                  <p className="mt-1 text-xs text-muted-foreground">{s.reason}</p>
                  <div className="mt-3 text-xs font-medium text-primary">
                    {t.school.recommendedStudents}
                  </div>
                  <ul className="mt-2 space-y-1 text-sm">
                    {s.students.slice(0, 8).map((st) => (
                      <li key={st.user_id}>· {st.name}</li>
                    ))}
                    {s.students.length > 8 && (
                      <li className="text-xs text-muted-foreground">
                        + {s.students.length - 8} {t.school.moreSuffix}
                      </li>
                    )}
                  </ul>
                </div>
              ))}
              {!specClasses.length && (
                <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground md:col-span-2">
                  {t.school.noSpecialized}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string | number;
}) {
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="mt-2 text-2xl font-bold gradient-text">{value}</div>
    </div>
  );
}
