import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { CountUp } from "@/components/CountUp";
import { GlowBlob } from "@/components/GlowBlob";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";
import { Sparkles, TrendingUp, GraduationCap, Users, Swords, Trophy, BookOpen, ChevronRight } from "lucide-react";
import { getMyGrowthState } from "@/lib/growth.functions";
import { deriveSkillSnapshots, deriveWeeklyReport, type SkillSnapshot } from "@/lib/abbi-extras";

type StatsLite = {
  leadership_level?: number; communication_score?: number; creativity_score?: number;
  emotional_intelligence?: number; productivity_level?: number;
} | null;

/* ─────────────── Skills tab ─────────────── */
export function SkillsSection({ stats, mbti: _mbti }: { stats: StatsLite; mbti?: string | null }) {
  const fn = useServerFn(getMyGrowthState);
  const [skills, setSkills] = useState<SkillSnapshot[] | null>(null);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const g = await fn();
        if (cancel) return;
        setSkills(deriveSkillSnapshots({
          assessmentsCompleted: g.assessmentsCompleted,
          stats,
        }));
      } catch (err) { console.warn("[ExtraSections]", err); }
    })();
    return () => { cancel = true; };
  }, [fn, stats]);

  return (
    <div className="space-y-6">
      <div className="glass rounded-3xl p-7">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">Skill Levels</h3>
            <p className="mt-1 text-xs text-muted-foreground">XP grows as you assess and stay consistent.</p>
          </div>
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_3px_10px_-3px_var(--glow)]"><Sparkles className="h-4 w-4" /></span>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {(skills ?? Array.from({ length: 7 })).map((s: SkillSnapshot | undefined, i) =>
            s ? (
              <div key={s.key} className="group relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-secondary/30 to-background/40 p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-[0_8px_24px_-10px_oklch(0.55_0.22_295_/_0.3)]">
                <GlowBlob className="-right-6 -top-6 h-16 w-16 opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-40" alpha={0.8} />
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{s.emoji}</span>
                    <span className="font-medium">{s.label}</span>
                  </div>
                  <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                    Level {s.level}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span><CountUp value={s.xp} className="tabular-nums" /> XP</span>
                  <span className="tabular-nums"><CountUp value={s.progress} suffix="%" /> to next</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-secondary/60">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-primary transition-all duration-700"
                    style={{ width: `${s.progress}%`, boxShadow: "0 0 10px oklch(0.65 0.22 295 / 0.5)" }} />
                </div>
              </div>
            ) : (
              <div key={i} className="h-32 rounded-2xl border border-border/40 bg-secondary/20 animate-pulse" />
            )
          )}
        </div>
      </div>

      <QuickLinks />
    </div>
  );
}

/* ─────────────── Weekly Report tab ─────────────── */
export function WeeklyReportSection({ mbti }: { mbti?: string | null }) {
  const fn = useServerFn(getMyGrowthState);
  const [report, setReport] = useState<ReturnType<typeof deriveWeeklyReport> | null>(null);

  useEffect(() => {
    let cancel = false;
    (async () => {
      try {
        const g = await fn();
        if (cancel) return;
        setReport(deriveWeeklyReport({
          assessmentsCompleted: g.assessmentsCompleted,
          mbti,
        }));
      } catch (err) { console.warn("[ExtraSections]", err); }
    })();
    return () => { cancel = true; };
  }, [fn, mbti]);

  if (!report) {
    return <div className="glass h-64 rounded-3xl animate-pulse" />;
  }

  return (
    <div className="space-y-6">
      <div className="glass rounded-3xl p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{report.week}</p>
            <h3 className="mt-1 text-xl font-semibold">Your Weekly Growth Report</h3>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary">
            <Sparkles className="h-3 w-3" /> ABBI insight
          </span>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <Metric icon={Trophy} label="Tasks Completed" value={String(report.tasksCompleted)} />
          <Metric icon={TrendingUp} label="Roadmap Progress" value={`${report.roadmapProgress}%`} />
          <Metric icon={Sparkles} label="Assessments Taken" value={report.assessmentsCompleted.toLocaleString()} />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-border/60 bg-secondary/30 p-5">
            <div className="text-sm font-semibold">Skill movement</div>
            <div className="mt-4 h-44">
              <ResponsiveContainer>
                <BarChart data={report.improvements}>
                  <CartesianGrid stroke="oklch(0.30 0.04 295 / 0.3)" strokeDasharray="3 3" />
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: "oklch(0.70 0.04 295)" }} />
                  <YAxis tick={{ fontSize: 10, fill: "oklch(0.70 0.04 295)" }} />
                  <Tooltip contentStyle={{ background: "oklch(0.18 0.04 295)", border: "1px solid oklch(0.30 0.04 295)", borderRadius: 12 }} />
                  <Bar dataKey="delta" fill="oklch(0.65 0.24 295)" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="rounded-2xl border border-border/60 bg-secondary/30 p-5">
            <div className="text-sm font-semibold">ABBI suggests</div>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {report.suggestions.map((s, i) => (
                <li key={i} className="flex items-start gap-2 rounded-xl border border-border/60 bg-background/30 px-3 py-2">
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded bg-gradient-to-br from-primary to-accent text-primary-foreground"><Sparkles className="h-2.5 w-2.5" /></span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <QuickLinks />
    </div>
  );
}

function Metric({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-gradient-to-br from-secondary/40 to-background/40 p-4">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_2px_8px_-2px_var(--glow)]"><Icon className="h-3 w-3" /></span>
      </div>
      <div className="mt-2 text-2xl font-bold gradient-text">{value}</div>
    </div>
  );
}

/* ─────────────── Universities tab + cross-page quick links ─────────────── */
export function QuickLinks() {
  const items = [
    { to: "/universities", label: "University Explorer", desc: "Find your future school", icon: GraduationCap },
    { to: "/mentors", label: "Mentors", desc: "Learn from those who made it", icon: Users },
    { to: "/career-battles", label: "Career Battles", desc: "Compare careers side-by-side", icon: Swords },
    { to: "/success-stories", label: "Success Stories", desc: "Real Abilitio journeys", icon: BookOpen },
  ];
  return (
    <div className="glass rounded-3xl p-6">
      <div className="text-sm font-semibold">Explore more</div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <Link key={it.to} to={it.to}
            className="group flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-gradient-to-br from-secondary/30 to-background/40 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_8px_24px_-10px_oklch(0.55_0.22_295_/_0.3)]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_4px_14px_-4px_var(--glow)]">
                <it.icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-medium">{it.label}</div>
                <div className="truncate text-[11px] text-muted-foreground">{it.desc}</div>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>
    </div>
  );
}

export function UniversitiesTabSection() {
  return (
    <div className="space-y-6">
      <div className="glass relative overflow-hidden rounded-3xl p-8 text-center">
        <GlowBlob className="left-1/2 top-0 h-40 w-72 -translate-x-1/2 opacity-20 blur-3xl" alpha={0.8} />
        <div className="relative">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_8px_30px_-10px_var(--glow)]">
            <GraduationCap className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-xl font-semibold">University Explorer</h3>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Filter universities by SAT, IELTS, country, and major. ABBI ranks fit and scholarships.
          </p>
          <Link to="/universities"
            className="cta-sheen relative mt-6 inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-primary to-accent px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-[0_6px_20px_-6px_var(--glow)] hover:-translate-y-0.5 transition-all">
            Open University Explorer <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
      <QuickLinks />
    </div>
  );
}
