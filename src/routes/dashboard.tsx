import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useEffect, useMemo, useState } from "react";
import {
  Brain,
  Calendar,
  LogOut,
  User as UserIcon,
  TrendingUp,
  Trophy,
  Heart,
  Sparkles,
  Target,
  Award,
  Zap,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  GraduationCap,
  Activity,
  BarChart3,
  Settings as SettingsIcon,
  Star,
  Languages,
  Moon,
  KeyRound,
  ChevronRight,
  Crown,
  Mail,
  Swords,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { MBTI_DESCRIPTIONS } from "@/lib/assessment/mbti-descriptions";
import { useWords } from "@/lib/editorial";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ProfilePhotoCard, resolveAvatarUrl } from "@/components/ProfilePhotoCard";
import { AbbiChat } from "@/components/AbbiChat";
import {
  SkillsSection,
  WeeklyReportSection,
  UniversitiesTabSection,
} from "@/components/dashboard/ExtraSections";
import { CountUp } from "@/components/CountUp";
import { GlowBlob } from "@/components/GlowBlob";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [{ title: "Dashboard — Abilitio" }, { name: "robots", content: "noindex, follow" }],
  }),
  component: DashboardPage,
});

type Career = { name: string; match: number; reason: string };
type Result = {
  id: string;
  iq_score: number;
  iq_level: string;
  mbti_type: string;
  top_strengths: string[];
  weaknesses?: string[];
  careers: Career[];
  created_at: string;
};

type Profile = { name: string; surname: string };
type Stats = {
  user_id: string;
  sat_score: number | null;
  ielts_band: number | null;
  study_progress: number;
  leadership_level: number;
  productivity_level: number;
  creativity_score: number;
  communication_score: number;
  emotional_intelligence: number;
  tagline: string | null;
  avatar_url: string | null;
};
type Achievement = {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  created_at: string;
};

type TabKey = "results" | "stats" | "skills" | "weekly" | "universities" | "abbi" | "settings";

function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const { t, tCareer, tTrait, tIqLevel } = useI18n();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [busy, setBusy] = useState(true);
  const [tab, setTab] = useState<TabKey>("results");

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/auth", search: { mode: "login", next: "/dashboard" } });
      return;
    }
    (async () => {
      const [{ data: p }, { data: r }, { data: s }, { data: a }] = await Promise.all([
        supabase.from("profiles").select("name, surname").eq("id", user.id).maybeSingle(),
        supabase
          .from("career_assessment_results")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
        supabase.from("user_stats").select("*").eq("user_id", user.id).maybeSingle(),
        supabase
          .from("user_achievements")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
      ]);
      setProfile(p ?? null);
      const mapped: Result[] = ((r as unknown as Array<Record<string, unknown>>) ?? []).map(
        (row) => {
          const cog = (row.cognitive_score as number | null) ?? 0;
          const matches =
            (row.career_matches as Array<{
              name: string;
              score: number;
              category?: string;
            }> | null) ?? [];
          return {
            id: row.id as string,
            iq_score: cog,
            iq_level: (row.cognitive_tier as string) ?? "—",
            mbti_type: (row.personality_type as string) ?? "—",
            top_strengths: (row.strengths as string[]) ?? [],
            weaknesses: (row.improvements as string[]) ?? [],
            careers: matches.map((c) => ({
              name: c.name,
              match: Math.round(c.score),
              reason: c.category ?? "",
            })),
            created_at: row.created_at as string,
          };
        },
      );
      setResults(mapped);
      setStats((s as unknown as Stats) ?? null);
      setAchievements((a as unknown as Achievement[]) ?? []);
      setBusy(false);
    })();
  }, [user, loading, navigate]);

  const latest = results[0];
  const fullName =
    `${profile?.name ?? ""} ${profile?.surname ?? ""}`.trim() ||
    user?.email?.split("@")[0] ||
    "Explorer";
  const initials = useMemo(() => {
    const parts = fullName.split(" ").filter(Boolean);
    return ((parts[0]?.[0] ?? "A") + (parts[1]?.[0] ?? "")).toUpperCase();
  }, [fullName]);

  const tagline = useMemo(() => {
    if (stats?.tagline) return stats.tagline;
    if (!latest) return "Future Builder";
    const m = latest.mbti_type;
    if (m?.startsWith("INT") || m?.startsWith("ENT")) return "Analytical Thinker";
    if (m?.includes("F")) return "Creative Strategist";
    return "Growth Explorer";
  }, [stats, latest]);

  // level derives from activity: assessments + achievements
  const activityXp = results.length * 50 + achievements.length * 25;
  const level = Math.max(1, Math.floor(activityXp / 100) + 1);
  const levelProgress = Math.min(100, ((activityXp % 100) / 100) * 100);

  if (loading || busy) {
    return (
      <PageShell>
        <section className="relative px-4 pt-10 pb-24 sm:px-6">
          <div aria-hidden className="bg-grid pointer-events-none absolute inset-0" />
          <div className="relative mx-auto max-w-6xl">
            <div className="skeleton h-44 rounded-[2rem]" />
            <div className="mt-8 skeleton h-12 rounded-2xl" />
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="skeleton h-28 rounded-3xl" />
              ))}
            </div>
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <div className="skeleton h-56 rounded-3xl" />
              <div className="skeleton h-56 rounded-3xl" />
            </div>
            <span className="sr-only">{t.dashboard.loading}</span>
          </div>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      {/* Ambient violet glow */}
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[600px] overflow-hidden">
        <div
          className="absolute left-1/2 top-[-200px] h-[700px] w-[1100px] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
          style={{
            background: "var(--yellow)",
          }}
        />
      </div>

      <section className="relative px-4 pt-10 pb-24 sm:px-6">
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-6xl">
          {/* PROFILE HEADER */}
          <ProfileHeader
            fullName={fullName}
            email={user?.email ?? ""}
            initials={initials}
            avatarUrl={stats?.avatar_url ?? null}
            level={level}
            levelProgress={levelProgress}
            tagline={tagline}
          />

          {/* HORIZONTAL TABS */}
          <TabBar tab={tab} setTab={setTab} />

          {/* CONTENT */}
          <div className="mt-8 animate-fade-in" key={tab}>
            {tab === "results" && (
              <ResultsSection
                results={results}
                latest={latest}
                tCareer={tCareer}
                tTrait={tTrait}
                tIqLevel={tIqLevel}
                t={t}
              />
            )}
            {tab === "stats" && user && (
              <StatsSection
                userId={user.id}
                stats={stats}
                setStats={setStats}
                achievements={achievements}
                setAchievements={setAchievements}
              />
            )}
            {tab === "skills" && <SkillsSection stats={stats} mbti={latest?.mbti_type} />}
            {tab === "weekly" && <WeeklyReportSection mbti={latest?.mbti_type} />}
            {tab === "universities" && <UniversitiesTabSection />}
            {tab === "abbi" && <AbbiChat />}
            {tab === "settings" && (
              <SettingsSection
                onLogout={async () => {
                  await signOut();
                  navigate({ to: "/" });
                }}
                email={user?.email ?? ""}
                profile={profile}
                userId={user?.id ?? ""}
                onProfileUpdate={setProfile}
                stats={stats}
                setStats={setStats}
                initials={initials}
                t={t}
              />
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

/* ============================================================ */
/* PROFILE HEADER                                                */
/* ============================================================ */
function ProfileHeader({
  fullName,
  email,
  initials,
  avatarUrl,
  level,
  levelProgress,
  tagline,
}: {
  fullName: string;
  email: string;
  initials: string;
  avatarUrl: string | null;
  level: number;
  levelProgress: number;
  tagline: string;
}) {
  const w = useWords();
  const [resolvedAvatar, setResolvedAvatar] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;
    resolveAvatarUrl(avatarUrl).then((u) => {
      if (!cancelled) setResolvedAvatar(u);
    });
    return () => {
      cancelled = true;
    };
  }, [avatarUrl]);

  return (
    <div
      className="relative overflow-hidden rounded-[2rem] border border-border/60 bg-card p-6  sm:p-8"
      style={{ boxShadow: "4px 4px 0 var(--ink)" }}
    >
      {/* gradient orbs */}
      <GlowBlob className="-right-20 -top-20 h-80 w-80 opacity-50 blur-3xl" alpha={0.5} />
      <div
        className="pointer-events-none absolute -bottom-32 -left-20 h-72 w-72 rounded-full opacity-40 blur-3xl"
        style={{
          background: "var(--yellow)",
        }}
      />

      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
        {/* Avatar */}
        <div className="relative shrink-0">
          <div className="absolute -inset-1 rounded-3xl bg-card opacity-70 blur-md transition-opacity group-hover:opacity-100" />
          <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden cartoon-avatar rounded-3xl bg-primary text-3xl font-bold text-primary-foreground shadow-2xl sm:h-28 sm:w-28">
            {resolvedAvatar ? (
              <img
                src={resolvedAvatar}
                alt={fullName}
                decoding="async"
                className="h-full w-full object-cover"
              />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <div className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-card shadow-lg">
            <Crown className="h-3.5 w-3.5 text-primary-foreground" />
          </div>
        </div>

        {/* Identity */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="truncate text-2xl font-bold tracking-tight sm:text-3xl">{fullName}</h1>
            <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-medium text-primary">
              <Sparkles className="h-3 w-3" />{" "}
              {w("Activity level", "Faollik darajasi", "Уровень активности")} {level}
            </span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{email}</p>
          <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-secondary/60 px-3 py-1 text-sm font-medium">
            <Star className="h-3.5 w-3.5 text-accent" />
            <span className="gradient-text">{tagline}</span>
          </p>

          <p className="mt-3 text-xs text-muted-foreground">
            {w(
              "Activity points come from saved assessments (50 each) and recorded achievements (25 each). A level is not a measure of skill or career readiness.",
              "Faollik ballari saqlangan baholash (50) va qayd etilgan yutuqdan (25) keladi. Daraja ko‘nikma yoki kasbga tayyorlik o‘lchovi emas.",
              "Баллы начисляются за сохранённые оценки (50) и записанные достижения (25). Уровень не измеряет навыки или готовность к профессии.",
            )}
          </p>
          {/* Level progress */}
          <div className="mt-5 max-w-md">
            <div className="mb-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
              <span>
                {w("Activity toward level", "Keyingi faollik darajasi", "До уровня активности")}{" "}
                {level + 1}
              </span>
              <span className="font-medium tabular-nums">{Math.round(levelProgress)}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-secondary/60">
              <div
                className="h-full rounded-full bg-card transition-all duration-700"
                style={{
                  width: `${levelProgress}%`,
                  boxShadow: "4px 4px 0 var(--ink)",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================ */
/* TAB BAR                                                       */
/* ============================================================ */
function TabBar({ tab, setTab }: { tab: TabKey; setTab: (t: TabKey) => void }) {
  const w = useWords();
  const tabs: { key: TabKey; label: string; icon: LucideIcon }[] = [
    { key: "results", label: w("Results", "Natijalar", "Результаты"), icon: Brain },
    { key: "stats", label: w("Test scores", "Test ballari", "Баллы тестов"), icon: BarChart3 },
    { key: "skills", label: w("Activities", "Faoliyatlar", "Занятия"), icon: Trophy },
    { key: "weekly", label: w("Recorded activity", "Qaydlar", "Активность"), icon: TrendingUp },
    {
      key: "universities",
      label: w("Universities", "Universitetlar", "Университеты"),
      icon: GraduationCap,
    },
    { key: "abbi", label: "ABBI AI", icon: Sparkles },
    { key: "settings", label: w("Settings", "Sozlamalar", "Настройки"), icon: SettingsIcon },
  ];
  return (
    <div className="mt-8 overflow-x-auto">
      <div className="inline-flex min-w-full gap-1 rounded-2xl border border-border/60 bg-secondary/30 p-1.5  sm:gap-2">
        {tabs.map((tt) => {
          const active = tab === tt.key;
          const Icon = tt.icon;
          return (
            <button
              key={tt.key}
              onClick={() => setTab(tt.key)}
              aria-pressed={active}
              className={`dashboard-tab group relative flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-3 py-2.5 text-[12px] font-medium transition-all sm:flex-1 sm:text-sm ${
                active ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {active && (
                <span
                  className="absolute inset-0 rounded-xl bg-primary transition-all"
                  style={{
                    boxShadow: "4px 4px 0 var(--ink)",
                  }}
                />
              )}
              <Icon
                className={`relative h-4 w-4 transition-colors ${active ? "text-primary-foreground" : ""}`}
              />
              <span className="relative hidden sm:inline">{tt.label}</span>
              <span className="relative sm:hidden">{tt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================ */
/* SECTION 1: RESULTS                                            */
/* ============================================================ */
function ResultsSection({
  results,
  latest,
  tCareer,
  tTrait,
  tIqLevel,
  t,
}: {
  results: Result[];
  latest: Result | undefined;
  tCareer: (n: string) => { name: string; reason: string };
  tTrait: (n: string) => string;
  tIqLevel: (l: string) => string;
  t: ReturnType<typeof useI18n>["t"];
}) {
  const w = useWords();
  if (!latest) {
    return (
      <GlassCard className="p-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <Brain className="h-8 w-8" />
        </div>
        <h3 className="mt-4 text-xl font-semibold">No assessment yet</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Take your first assessment to see your assessment profile.
        </p>
        <Link
          to="/assessment"
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:-translate-y-0.5 transition-all"
        >
          {t.dashboard.startFirst} <ChevronRight className="h-4 w-4" />
        </Link>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top metrics row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricRing
          label="Reasoning / 10"
          value={latest.iq_score}
          max={10}
          hint={tIqLevel(latest.iq_level)}
          icon={Brain}
        />
        <MetricCard
          label="Personality"
          value={latest.mbti_type}
          hint={MBTI_DESCRIPTIONS[latest.mbti_type] ?? "Unique mind"}
          icon={Sparkles}
        />
        <MetricCard
          label="Assessments"
          value={String(results.length)}
          hint="Total taken"
          icon={Activity}
        />
        <MetricCard
          label={w("Exploration fit", "Izlanish mosligi", "Соответствие для пробы")}
          value={latest.careers?.[0] ? `${latest.careers[0].match}/100` : "—"}
          hint={latest.careers?.[0] ? tCareer(latest.careers[0].name).name : "—"}
          icon={Target}
        />
      </div>

      {/* Cognitive bars + Strengths/Weaknesses */}
      <div className="settings-grid grid gap-6 lg:grid-cols-2">
        <GlassCard className="p-7">
          <SectionTitle icon={Brain}>
            {w("About your reasoning score", "Mantiq ballingiz haqida", "О вашем балле мышления")}
          </SectionTitle>
          <p className="mt-4 text-sm text-muted-foreground">
            {w(
              "One overall score from nine reasoning questions. We do not measure logic, analytical thinking and pattern recognition separately. It is not an IQ score or a measure of your future potential.",
              "To‘qqizta mantiq savolidan bitta umumiy ball. Mantiq, tahlil va naqshni topishni alohida o‘lchamaymiz. Bu IQ yoki kelajak imkoniyatingiz o‘lchovi emas.",
              "Один общий балл по девяти вопросам. Логика, анализ и поиск закономерностей отдельно не измеряются. Это не IQ и не оценка будущего потенциала.",
            )}
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            {w(
              "Your personality summary describes your answers today. Preferences can change; a type is not a fixed identity.",
              "Shaxsiyat xulosasi bugungi javoblaringizni tasvirlaydi. Afzallik o‘zgarishi mumkin; tur doimiy shaxsiyat emas.",
              "Описание личности отражает сегодняшние ответы. Предпочтения меняются; тип не определяет вас навсегда.",
            )}
          </p>
        </GlassCard>

        <div className="grid gap-6">
          <GlassCard className="p-7">
            <SectionTitle icon={Heart}>Top Strengths</SectionTitle>
            {latest.top_strengths?.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {latest.top_strengths.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-primary/20 bg-mint text-ink px-3 py-1.5 text-xs font-medium"
                  >
                    {tTrait(s)}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">No data yet.</p>
            )}
          </GlassCard>
          <GlassCard className="p-7">
            <SectionTitle icon={Zap}>Growth Areas</SectionTitle>
            {latest.weaknesses?.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {latest.weaknesses.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-accent/20 bg-card px-3 py-1.5 text-xs font-medium text-accent/80"
                  >
                    {tTrait(s)}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">All round excellence.</p>
            )}
          </GlassCard>
        </div>
      </div>

      {/* Career matches */}
      <GlassCard className="p-7">
        <SectionTitle icon={Trophy}>
          {w("Careers to explore", "O‘rganish uchun kasblar", "Профессии для исследования")}
        </SectionTitle>
        <p className="mt-3 text-sm text-muted-foreground">
          {w(
            "Fit scores compare your answers with career profiles on a 0–100 scale. They are not percentages, success probabilities or proof of ability. Start with the reasons, then try the work.",
            "0–100 moslik balli javoblaringizni kasb profillari bilan solishtiradi. Bu foiz, muvaffaqiyat ehtimoli yoki qobiliyat isboti emas. Sabablarni o‘qing, so‘ng ishni sinang.",
            "Баллы 0–100 сравнивают ответы с профилями профессий. Это не проценты, вероятность успеха или доказательство способностей. Изучите причины и попробуйте работу.",
          )}
        </p>
        {latest.careers?.length ? (
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {latest.careers.slice(0, 3).map((c, i) => (
              <CareerCard
                key={c.name}
                career={c}
                rank={i + 1}
                featured={i === 0}
                tCareer={tCareer}
              />
            ))}
          </div>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">No career data yet.</p>
        )}
      </GlassCard>

      {/* Career Battles CTA */}
      <Link to="/career-battles" className="group block">
        <div className="relative overflow-hidden rounded-2xl border border-primary/30 bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50">
          <GlowBlob className="-right-8 -top-8 h-32 w-32 opacity-30 blur-3xl" />
          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Swords className="h-5 w-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">Try Career Battles</div>
                <div className="text-xs text-muted-foreground">
                  Compare your top careers side-by-side with AI insights
                </div>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Link>

      {/* History */}
      <GlassCard className="p-7">
        <SectionTitle icon={TrendingUp}>Assessment History</SectionTitle>
        <ul className="mt-5 space-y-2">
          {results.map((r, i) => (
            <li
              key={r.id}
              className={`flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3 text-sm transition-all hover:border-primary/30 hover:bg-secondary/50 ${i === 0 ? "border-primary/30 bg-mint text-ink" : "border-border/60 bg-secondary/30"}`}
            >
              <span className="inline-flex items-center gap-2 text-muted-foreground">
                {i === 0 ? (
                  <span className="relative flex h-2 w-2 shrink-0">
                    <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-50" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                  </span>
                ) : (
                  <Calendar className="h-3.5 w-3.5" />
                )}
                {new Date(r.created_at).toLocaleDateString()}
              </span>
              <span className="text-muted-foreground">
                Reasoning / 10 <span className="font-semibold text-foreground">{r.iq_score}</span>
              </span>
              <span className="text-muted-foreground">
                Type <span className="font-semibold text-foreground">{r.mbti_type}</span>
              </span>
              <span className="text-muted-foreground">
                Top:{" "}
                <span className="font-semibold text-foreground">
                  {r.careers?.[0] ? tCareer(r.careers[0].name).name : "—"}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </GlassCard>
    </div>
  );
}

function CareerCard({
  career,
  rank,
  featured,
  tCareer,
}: {
  career: Career;
  rank: number;
  featured?: boolean;
  tCareer: (n: string) => { name: string; reason: string };
}) {
  const w = useWords();
  const tc = tCareer(career.name);
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border p-5 transition-all hover:-translate-y-1 ${
        featured
          ? "border-primary/40 bg-card lg:col-span-1 lg:row-span-1"
          : "border-border/60 bg-secondary/30"
      }`}
      style={featured ? { boxShadow: "4px 4px 0 var(--ink)" } : undefined}
    >
      {featured && (
        <GlowBlob className="-right-10 -top-10 h-32 w-32 opacity-60 blur-2xl" alpha={0.5} />
      )}
      <div className="relative flex items-center justify-between">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
            featured ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
          }`}
        >
          {featured && <Crown className="h-3 w-3" />} #{rank}{" "}
          {featured ? w("First suggestion", "Birinchi tavsiya", "Первое предложение") : ""}
        </span>
        <span className="text-2xl font-bold gradient-text tabular-nums">{career.match}/100</span>
      </div>
      <h4 className="relative mt-3 text-lg font-semibold">{tc.name}</h4>
      <p className="relative mt-2 line-clamp-3 text-xs text-muted-foreground">
        {tc.reason || career.reason}
      </p>
      <div className="relative mt-4 h-1.5 overflow-hidden rounded-full bg-secondary/60">
        <div
          className="h-full rounded-full bg-primary transition-all duration-1000"
          style={{ width: `${career.match}/100` }}
        />
      </div>
    </div>
  );
}

function MetricRing({
  label,
  value,
  max,
  hint,
  icon: Icon,
}: {
  label: string;
  value: number;
  max: number;
  hint: string;
  icon: LucideIcon;
}) {
  const pct = Math.min(100, (value / max) * 100);
  const circumference = 2 * Math.PI * 30;
  const offset = circumference - (pct / 100) * circumference;
  return (
    <GlassCard className="p-5 transition-all hover:-translate-y-0.5">
      <div className="flex items-center justify-between">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Icon className="h-3 w-3" />
        </span>
      </div>
      <div className="mt-3 flex items-center gap-4">
        <div className="relative h-20 w-20">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 70 70">
            <circle cx="35" cy="35" r="30" fill="none" stroke="var(--mint-solid)" strokeWidth="5" />
            <circle
              cx="35"
              cy="35"
              r="30"
              fill="none"
              stroke="var(--mint-solid)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              style={{
                transition: "stroke-dashoffset 1.2s ease-out",
                filter: "none",
              }}
            />
            <defs></defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-xl font-bold tabular-nums">
            {value}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[11px] font-medium text-muted-foreground line-clamp-2">{hint}</div>
        </div>
      </div>
    </GlassCard>
  );
}

function MetricCard({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint: string;
  icon: LucideIcon;
}) {
  return (
    <GlassCard className="p-5 transition-all hover:-translate-y-0.5">
      <div className="flex items-center justify-between">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Icon className="h-3 w-3" />
        </span>
      </div>
      <div className="mt-3 text-3xl font-bold gradient-text">{value}</div>
      <div className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">{hint}</div>
    </GlassCard>
  );
}

/* ============================================================ */
/* SECTION 2: STATS                                              */
/* ============================================================ */
const STAT_FIELDS: {
  key: keyof Stats;
  label: string;
  icon: LucideIcon;
  unit?: string;
  max?: number;
}[] = [
  { key: "sat_score", label: "SAT Score", icon: GraduationCap, max: 1600 },
  { key: "ielts_band", label: "IELTS Band", icon: Languages, max: 9 },
];

function StatsSection({
  userId,
  stats,
  setStats,
  achievements,
  setAchievements,
}: {
  userId: string;
  stats: Stats | null;
  setStats: (s: Stats) => void;
  achievements: Achievement[];
  setAchievements: (a: Achievement[]) => void;
}) {
  const w = useWords();
  const [saveError, setSaveError] = useState(false);
  const [editing, setEditing] = useState(false);
  const empty: Stats = {
    user_id: userId,
    sat_score: null,
    ielts_band: null,
    study_progress: 0,
    leadership_level: 0,
    productivity_level: 0,
    creativity_score: 0,
    communication_score: 0,
    emotional_intelligence: 0,
    tagline: null,
    avatar_url: null,
  };
  const current = stats ?? empty;
  const [draft, setDraft] = useState<Stats>(current);

  useEffect(() => {
    setDraft(current); /* eslint-disable-next-line */
  }, [stats]);

  async function saveStats() {
    const payload = { ...draft, user_id: userId };
    setSaveError(false);
    try {
      const { data, error } = await supabase.from("user_stats").upsert(payload).select().single();
      if (!error && data) {
        setStats(data as unknown as Stats);
        setEditing(false);
      } else setSaveError(true);
    } catch {
      setSaveError(true);
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats grid */}
      <GlassCard className="p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SectionTitle icon={BarChart3}>
            {w("Your recorded test scores", "Qayd etilgan test ballari", "Записанные баллы тестов")}
          </SectionTitle>
          <button
            onClick={() => (editing ? saveStats() : setEditing(true))}
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary transition-all hover:bg-primary/20"
          >
            {editing ? (
              <>
                <Check className="h-3.5 w-3.5" /> Save
              </>
            ) : (
              <>
                <Pencil className="h-3.5 w-3.5" /> Edit Stats
              </>
            )}
          </button>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          {w(
            "SAT and IELTS results entered by you; Abilitio has not verified them. No score means not recorded, not zero ability. Older personal ratings are retained in your data but are no longer shown as measurements.",
            "SAT va IELTS ballarini o‘zingiz kiritasiz; Abilitio tekshirmagan. Ball yo‘qligi — qayd yo‘q, qobiliyat nol emas. Eski shaxsiy baholar ma’lumotda qoladi, o‘lchov sifatida ko‘rsatilmaydi.",
            "SAT и IELTS введены вами и не проверены Abilitio. Отсутствие балла означает отсутствие записи, не нулевые способности. Старые личные рейтинги сохранены в данных, но не показываются как измерения.",
          )}
        </p>
        {saveError && (
          <p role="alert" className="mt-4">
            {w(
              "Scores were not saved. Please try again.",
              "Ballar saqlanmadi. Qayta urinib ko‘ring.",
              "Баллы не сохранены. Попробуйте снова.",
            )}
          </p>
        )}
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {STAT_FIELDS.map((f) => {
            const Icon = f.icon;
            const raw = draft[f.key] as number | null;
            return (
              <div
                key={String(f.key)}
                className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-4 transition-all hover:border-primary/30 hover:-translate-y-0.5"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Icon className="h-3 w-3" />
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {f.label}
                  </span>
                </div>
                {editing ? (
                  <input
                    type="number"
                    aria-label={f.label}
                    min={0}
                    max={f.max}
                    step={f.key === "ielts_band" ? 0.5 : 1}
                    value={raw ?? ""}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        [f.key]: e.target.value === "" ? null : Number(e.target.value),
                      } as Stats)
                    }
                    className="mt-3 w-full bg-transparent text-2xl font-bold outline-none ring-1 ring-border/60 rounded-lg px-2 py-1 focus:ring-primary/50"
                  />
                ) : (
                  <div className="mt-3 text-2xl font-bold gradient-text tabular-nums">
                    {raw !== null ? (
                      <CountUp value={raw} suffix={f.unit ?? ""} duration={1000} />
                    ) : (
                      <span className="text-sm">
                        {w("Not recorded", "Qayd etilmagan", "Не записано")}
                      </span>
                    )}
                  </div>
                )}
                <p className="mt-3 text-xs text-muted-foreground">
                  {w("Scale", "Shkala", "Шкала")}: {f.max} ·{" "}
                  {w("Entered by you", "O‘zingiz kiritgan", "Введено вами")}
                </p>
              </div>
            );
          })}
        </div>
        {editing && (
          <div className="mt-5 flex items-center justify-end gap-2">
            <button
              onClick={() => {
                setDraft(current);
                setEditing(false);
              }}
              className="rounded-full border border-border px-4 py-1.5 text-xs hover:bg-secondary"
            >
              Cancel
            </button>
          </div>
        )}
      </GlassCard>

      {/* Achievements */}
      <AchievementsBlock
        userId={userId}
        achievements={achievements}
        setAchievements={setAchievements}
      />
    </div>
  );
}

function AchievementsBlock({
  userId,
  achievements,
  setAchievements,
}: {
  userId: string;
  achievements: Achievement[];
  setAchievements: (a: Achievement[]) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<{ title: string; description: string }>({
    title: "",
    description: "",
  });

  async function addOne() {
    if (!draft.title.trim()) return;
    const { data, error } = await supabase
      .from("user_achievements")
      .insert({
        user_id: userId,
        title: draft.title.trim(),
        description: draft.description.trim() || null,
      })
      .select()
      .single();
    if (!error && data) {
      setAchievements([data as unknown as Achievement, ...achievements]);
      setDraft({ title: "", description: "" });
      setAdding(false);
    }
  }

  async function saveEdit(id: string) {
    const { data, error } = await supabase
      .from("user_achievements")
      .update({ title: draft.title.trim(), description: draft.description.trim() || null })
      .eq("id", id)
      .select()
      .single();
    if (!error && data) {
      setAchievements(
        achievements.map((a) => (a.id === id ? (data as unknown as Achievement) : a)),
      );
      setEditingId(null);
    }
  }

  async function removeOne(id: string) {
    const { error } = await supabase.from("user_achievements").delete().eq("id", id);
    if (!error) setAchievements(achievements.filter((a) => a.id !== id));
  }

  return (
    <GlassCard className="p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionTitle icon={Award}>Achievements & Activities</SectionTitle>
        <button
          onClick={() => {
            setAdding(true);
            setDraft({ title: "", description: "" });
          }}
          className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary transition-all hover:bg-primary/20"
        >
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </div>

      {adding && (
        <div className="mt-5 rounded-2xl border border-primary/30 bg-primary/5 p-4">
          <input
            autoFocus
            placeholder="e.g. Founder of NavoiUnity"
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground/60"
          />
          <textarea
            placeholder="Short description (optional)"
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            className="mt-2 w-full resize-none bg-transparent text-xs text-muted-foreground outline-none placeholder:text-muted-foreground/60"
            rows={2}
          />
          <div className="mt-3 flex items-center justify-end gap-2">
            <button
              onClick={() => setAdding(false)}
              className="rounded-full border border-border px-3 py-1 text-[11px] hover:bg-secondary"
            >
              Cancel
            </button>
            <button
              onClick={addOne}
              className="rounded-full bg-primary px-3 py-1 text-[11px] font-medium text-primary-foreground hover:-translate-y-0.5 transition-all"
            >
              Save
            </button>
          </div>
        </div>
      )}

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {achievements.length === 0 && !adding && (
          <div className="col-span-full rounded-2xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
            No achievements yet. Add your first one — e.g.{" "}
            <span className="text-foreground">"Olympiad Participant"</span> or{" "}
            <span className="text-foreground">"Debate Club Member"</span>.
          </div>
        )}
        {achievements.map((a) => {
          const isEditing = editingId === a.id;
          return (
            <div
              key={a.id}
              className="group relative overflow-hidden rounded-2xl border border-border/60 bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/30"
            >
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                  <Trophy className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  {isEditing ? (
                    <>
                      <input
                        value={draft.title}
                        onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                        className="w-full bg-transparent text-sm font-semibold outline-none ring-1 ring-border/60 rounded px-2 py-1 focus:ring-primary/50"
                      />
                      <textarea
                        value={draft.description}
                        onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                        className="mt-2 w-full resize-none bg-transparent text-xs outline-none ring-1 ring-border/60 rounded px-2 py-1 focus:ring-primary/50"
                        rows={2}
                      />
                    </>
                  ) : (
                    <>
                      <h4 className="truncate text-sm font-semibold">{a.title}</h4>
                      {a.description && (
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                          {a.description}
                        </p>
                      )}
                    </>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  {isEditing ? (
                    <>
                      <button
                        onClick={() => saveEdit(a.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-primary hover:bg-primary/30"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:bg-secondary/80"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingId(a.id);
                          setDraft({ title: a.title, description: a.description ?? "" });
                        }}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:bg-secondary/80"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => removeOne(a.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}

/* ============================================================ */
/* SECTION 4: SETTINGS                                           */
/* ============================================================ */

/* ============================================================ */
/* SECTION 4: SETTINGS                                           */
/* ============================================================ */
function SettingsSection({
  onLogout,
  email,
  profile,
  userId,
  onProfileUpdate,
  stats,
  setStats,
  initials,
  t,
}: {
  onLogout: () => Promise<void>;
  email: string;
  profile: Profile | null;
  userId: string;
  onProfileUpdate: (p: Profile) => void;
  stats: Stats | null;
  setStats: (s: Stats) => void;
  initials: string;
  t: ReturnType<typeof useI18n>["t"];
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<Profile>({
    name: profile?.name ?? "",
    surname: profile?.surname ?? "",
  });
  const [msg, setMsg] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!userId) return;
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle()
      .then(({ data }) => setIsAdmin(!!data));
  }, [userId]);

  async function saveProfile() {
    const { error } = await supabase
      .from("profiles")
      .update({ name: draft.name, surname: draft.surname })
      .eq("id", userId);
    if (!error) {
      onProfileUpdate(draft);
      setEditing(false);
    }
  }

  async function changePassword() {
    setMsg(null);
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) setMsg(error.message);
    else setMsg("Password reset link sent to your email.");
  }

  return (
    <div className="space-y-6">
      {isAdmin && (
        <Link
          to="/admin"
          className="group relative block overflow-hidden rounded-3xl border border-primary/40 bg-card p-6  transition-all hover:-translate-y-0.5"
          style={{ boxShadow: "4px 4px 0 var(--ink)" }}
        >
          <GlowBlob className="-right-10 -top-10 h-40 w-40 opacity-50 blur-3xl" alpha={0.5} />
          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                <Crown className="h-6 w-6" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-accent">Founder access</div>
                <div className="text-lg font-bold gradient-text">Open Admin Dashboard</div>
                <div className="text-xs text-muted-foreground">Analytics and user management</div>
              </div>
            </div>
            <ChevronRight className="h-5 w-5 text-primary transition-transform group-hover:translate-x-1" />
          </div>
        </Link>
      )}
      <ProfilePhotoCard
        userId={userId}
        avatarPath={stats?.avatar_url ?? null}
        initials={initials}
        onChange={(newPath) => {
          const base: Stats = stats ?? {
            user_id: userId,
            sat_score: null,
            ielts_band: null,
            study_progress: 0,
            leadership_level: 0,
            productivity_level: 0,
            creativity_score: 0,
            communication_score: 0,
            emotional_intelligence: 0,
            tagline: null,
            avatar_url: null,
          };
          setStats({ ...base, avatar_url: newPath });
        }}
      />
      <div className="settings-grid grid gap-6 lg:grid-cols-2">
        <GlassCard className="p-7">
          <SectionTitle icon={UserIcon}>Profile</SectionTitle>
          <div className="mt-5 space-y-3">
            <Field label="Email" value={email} disabled />
            {editing ? (
              <>
                <Field
                  label="First name"
                  value={draft.name}
                  onChange={(v) => setDraft({ ...draft, name: v })}
                />
                <Field
                  label="Last name"
                  value={draft.surname}
                  onChange={(v) => setDraft({ ...draft, surname: v })}
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => {
                      setDraft({ name: profile?.name ?? "", surname: profile?.surname ?? "" });
                      setEditing(false);
                    }}
                    className="rounded-full border border-border px-4 py-1.5 text-xs hover:bg-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveProfile}
                    className="rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground hover:-translate-y-0.5 transition-all"
                  >
                    Save
                  </button>
                </div>
              </>
            ) : (
              <>
                <Field label="First name" value={profile?.name ?? ""} disabled />
                <Field label="Last name" value={profile?.surname ?? ""} disabled />
                <button
                  onClick={() => setEditing(true)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary hover:bg-primary/20"
                >
                  <Pencil className="h-3.5 w-3.5" /> Edit profile
                </button>
              </>
            )}
          </div>
        </GlassCard>

        <GlassCard className="p-7">
          <SectionTitle icon={SettingsIcon}>Preferences</SectionTitle>
          <div className="mt-5 space-y-4">
            <PrefRow icon={Languages} label="Language" hint="Switch interface language">
              <LanguageSwitcher />
            </PrefRow>
            <PrefRow icon={Moon} label="Appearance" hint="Light or dark theme">
              <ThemeToggle />
            </PrefRow>
            <WeeklyEmailToggle userId={userId} />
          </div>
        </GlassCard>

        <GlassCard className="p-7">
          <SectionTitle icon={KeyRound}>Security</SectionTitle>
          <p className="mt-3 text-sm text-muted-foreground">
            Reset your password — we'll send a secure link to your email.
          </p>
          <button
            onClick={changePassword}
            className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary hover:bg-primary/20"
          >
            <KeyRound className="h-3.5 w-3.5" /> Send reset link
          </button>
          {msg && <p className="mt-3 text-xs text-muted-foreground">{msg}</p>}
        </GlassCard>

        <GlassCard className="p-7">
          <SectionTitle icon={LogOut}>Session</SectionTitle>
          <p className="mt-3 text-sm text-muted-foreground">
            Sign out from this device. Check your save status before leaving.
          </p>
          <button
            onClick={onLogout}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-destructive/30 bg-destructive/10 px-4 py-2 text-xs font-medium text-destructive transition-all hover:bg-destructive/20"
          >
            <LogOut className="h-3.5 w-3.5" /> {t.dashboard.logout}
          </button>
        </GlassCard>
      </div>
    </div>
  );
}

function WeeklyEmailToggle({ userId }: { userId: string }) {
  const key = `pref_weekly_email_${userId}`;
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem(key) === "true";
  });
  function toggle() {
    const next = !enabled;
    setEnabled(next);
    if (typeof window !== "undefined") localStorage.setItem(key, String(next));
  }
  return (
    <PrefRow
      icon={Mail}
      label="Weekly digest email"
      hint="Activate in Lovable integrations to enable sending"
    >
      <button
        onClick={toggle}
        aria-pressed={enabled}
        className={`cartoon-switch relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-300 focus-visible:outline-none ${enabled ? "bg-primary" : "bg-secondary"}`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform ${enabled ? "translate-x-4" : "translate-x-0"}`}
        />
      </button>
    </PrefRow>
  );
}

function Field({
  label,
  value,
  disabled,
  onChange,
}: {
  label: string;
  value: string;
  disabled?: boolean;
  onChange?: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <input
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full rounded-xl border border-border/60 bg-secondary/30 px-3 py-2 text-sm outline-none transition-all focus:border-primary/50 focus:bg-secondary/50 disabled:opacity-60"
      />
    </div>
  );
}

function PrefRow({
  icon: Icon,
  label,
  hint,
  children,
}: {
  icon: LucideIcon;
  label: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <div className="pref-row flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-secondary/30 p-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">{label}</div>
          <div className="truncate text-[11px] text-muted-foreground">{hint}</div>
        </div>
      </div>
      <div className="pref-control shrink-0">{children}</div>
    </div>
  );
}

/* ============================================================ */
/* SHARED                                                        */
/* ============================================================ */
function GlassCard({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-3xl border border-border/60 bg-card  ${className}`}
      style={{ boxShadow: "4px 4px 0 var(--ink)" }}
    >
      {children}
    </div>
  );
}

function SectionTitle({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  return (
    <h2 className="flex items-center gap-2 text-base font-semibold">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Icon className="h-3.5 w-3.5" />
      </span>
      {children}
    </h2>
  );
}
