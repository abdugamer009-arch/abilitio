import { historyLabel } from "@/lib/assessment/report-tools";
import { requestPasswordRecovery } from "@/lib/auth/recovery.functions";
import { PASSWORD_RECOVERY_ENABLED, CONTACT_EMAIL } from "@/lib/constants";
import { catalogLabel } from "@/lib/catalog-labels";
import { readAllResult } from "@/lib/db-read";
import { useUiText } from "@/lib/ui-text";
import { toast } from "sonner";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useEffect, useId, useMemo, useRef, useState } from "react";
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
  Swords,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { presentationSummary } from "@/lib/assessment/summary-integrity";
import { reasoningCaveat } from "@/lib/assessment/reasoning-copy";
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
  iq_score: number | null;
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
  const { lang, t, tCareer, tTrait } = useI18n();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [results, setResults] = useState<Result[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [busy, setBusy] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [reload, setReload] = useState(0);
  const [tab, setTab] = useState<TabKey>("results");

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/auth", search: { mode: "login", next: "/dashboard" } });
      return;
    }
    let cancelled = false;
    setBusy(true);
    setLoadError(false);
    setProfile(null);
    setResults([]);
    setStats(null);
    setAchievements([]);
    (async () => {
      const responses = await Promise.all([
        supabase.from("profiles").select("name, surname").eq("id", user.id).maybeSingle(),
        readAllResult((from, to) =>
          supabase
            .from("career_assessment_results")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .order("id")
            .range(from, to),
        ),
        supabase.from("user_stats").select("*").eq("user_id", user.id).maybeSingle(),
        readAllResult((from, to) =>
          supabase
            .from("user_achievements")
            .select("*")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .order("id")
            .range(from, to),
        ),
      ]);
      if (cancelled) return;
      if (responses.some((r) => r.error)) throw new Error("Dashboard unavailable");
      const [{ data: p }, { data: r }, { data: s }, { data: a }] = responses;
      setProfile(p ?? null);
      const mapped: Result[] = ((r as unknown as Array<Record<string, unknown>>) ?? []).map(
        (row) => {
          const summary = presentationSummary({
            scoring_version: row.scoring_version as string | null,
            strengths: row.strengths as string[] | null,
            improvements: row.improvements as string[] | null,
          });
          const cog = row.cognitive_score as number | null;
          const matches =
            (row.career_matches as Array<{
              name: string;
              score: number;
              category?: string;
            }> | null) ?? [];
          return {
            id: row.id as string,
            iq_score: cog,
            mbti_type: (row.personality_type as string) ?? "—",
            top_strengths: summary.strengths,
            weaknesses: summary.improvements,
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
    })().catch(() => {
      if (!cancelled) {
        setLoadError(true);
        setBusy(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [user, loading, navigate, reload]);

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
    return "Growth Explorer";
  }, [stats]);

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

  if (loadError)
    return (
      <PageShell>
        <div className="mx-auto max-w-xl p-10" role="alert">
          <p>Could not load your dashboard.</p>
          <button
            onClick={() => setReload((n) => n + 1)}
            className="mt-4 rounded-xl bg-primary px-4 py-2 text-primary-foreground"
          >
            Retry
          </button>
        </div>
      </PageShell>
    );

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
            tagline={stats?.tagline ? tagline : catalogLabel(tagline, lang)}
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
            <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-sm font-medium text-primary">
              <Sparkles className="h-3 w-3" />{" "}
              {w("Activity level", "Faollik darajasi", "Уровень активности")} {level}
            </span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{email}</p>
          <p className="mt-3 inline-flex items-center gap-2 rounded-full bg-secondary/60 px-3 py-1 text-sm font-medium">
            <Star className="h-3.5 w-3.5 text-accent" />
            <span className="gradient-text">{tagline}</span>
          </p>

          <p className="mt-3 text-sm text-muted-foreground">
            {w(
              "Activity points come from saved assessments (50 each) and recorded achievements (25 each). A level is not a measure of skill or career readiness.",
              "Faollik ballari saqlangan baholash (50) va qayd etilgan yutuqdan (25) keladi. Daraja ko‘nikma yoki kasbga tayyorlik o‘lchovi emas.",
              "Баллы начисляются за сохранённые оценки (50) и записанные достижения (25). Уровень не измеряет навыки или готовность к профессии.",
            )}
          </p>
          {/* Level progress */}
          <div className="mt-5 max-w-md">
            <div className="mb-1.5 flex items-center justify-between text-sm text-muted-foreground">
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
    { key: "abbi", label: "ABBI Guide", icon: Sparkles },
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
              className={`dashboard-tab group relative flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl px-3 py-2.5 text-sm font-medium transition-all sm:flex-1 sm:text-sm ${
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
  t,
}: {
  results: Result[];
  latest: Result | undefined;
  tCareer: (n: string) => { name: string; reason: string };
  tTrait: (n: string) => string;
  t: ReturnType<typeof useI18n>["t"];
}) {
  const tr = useUiText();
  const { lang } = useI18n();
  const [compare, setCompare] = useState<string[]>([]);

  const w = useWords();
  if (!latest) {
    return (
      <GlassCard className="p-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
          <Brain className="h-8 w-8" />
        </div>
        <h3 className="mt-4 text-xl font-semibold">{tr("No assessment yet")}</h3>
        <p className="mt-2 text-sm text-muted-foreground">
          {tr("Take your first assessment to see your assessment profile.")}
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
          label={tr("Reasoning / 9")}
          value={latest.iq_score}
          max={9}
          hint={reasoningCaveat(lang)}
          icon={Brain}
        />
        <MetricCard
          label={tr("Personality")}
          value={tr(latest.mbti_type.includes("X") ? "Mixed preferences" : latest.mbti_type)}
          hint={w(
            "Work preferences on this attempt; not a fixed identity.",
            "Bu urinishdagi ish afzalliklari; o‘zgarmas shaxsiyat emas.",
            "Рабочие предпочтения в этой попытке, а не неизменная личность.",
          )}
          icon={Sparkles}
        />
        <MetricCard
          label={tr("Assessments")}
          value={String(results.length)}
          hint={tr("Total taken")}
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
            <SectionTitle icon={Heart}>{tr("Top Strengths")}</SectionTitle>
            {latest.top_strengths?.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {latest.top_strengths.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-primary/20 bg-mint text-ink px-3 py-1.5 text-sm font-medium"
                  >
                    {tTrait(s)}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">{tr("No data yet.")}</p>
            )}
          </GlassCard>
          <GlassCard className="p-7">
            <SectionTitle icon={Zap}>{tr("Growth Areas")}</SectionTitle>
            {latest.weaknesses?.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {latest.weaknesses.map((s) => (
                  <span
                    key={s}
                    className="rounded-full border border-accent/20 bg-card px-3 py-1.5 text-sm font-medium text-accent/80"
                  >
                    {tTrait(s)}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">
                {tr("No answer-supported growth areas recorded.")}
              </p>
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
          <p className="mt-3 text-sm text-muted-foreground">{tr("No career data yet.")}</p>
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
                <div className="text-sm font-semibold">{tr("Try Career Battles")}</div>
                <div className="text-sm text-muted-foreground">
                  {tr("Compare saved careers and practical experiments")}
                </div>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </Link>

      {/* History */}
      <GlassCard className="p-7">
        <SectionTitle icon={TrendingUp}>{tr("Assessment History")}</SectionTitle>
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
              <span>{historyLabel(r.iq_score, r.mbti_type, lang)}</span>
              <Link className="field-button" to="/career-results" search={{ resultId: r.id }}>
                {w("View result", "Natijani ko‘rish", "Открыть результат")}
              </Link>
              <label className="flex items-center gap-2 min-h-11">
                <input
                  type="checkbox"
                  checked={compare.includes(r.id)}
                  disabled={!compare.includes(r.id) && compare.length >= 2}
                  onChange={(e) =>
                    setCompare((c) =>
                      e.target.checked ? [...c, r.id] : c.filter((id) => id !== r.id),
                    )
                  }
                />
                {w("Compare attempt", "Urinishni solishtirish", "Сравнить попытку")}
              </label>
              <span className="text-muted-foreground">
                {tr("Top:")}{" "}
                <span className="font-semibold text-foreground">
                  {r.careers?.[0] ? tCareer(r.careers[0].name).name : "—"}
                </span>
              </span>
            </li>
          ))}
        </ul>
        {compare.length === 2 && (
          <section className="mt-5" aria-live="polite">
            <h3>{w("Compare attempts", "Urinishlarni solishtirish", "Сравнение попыток")}</h3>
            <p className="mt-2">
              {w(
                "Question sets, difficulty, language and method versions may differ. Changes are descriptions of attempts, not measured growth in ability.",
                "Savollar to‘plami, qiyinligi, til va usul versiyalari farq qilishi mumkin. O‘zgarishlar urinish tavsifi, qobiliyat o‘sishining o‘lchovi emas.",
                "Наборы вопросов, сложность, язык и версии метода могут отличаться. Изменения описывают попытки, а не измеренный рост способностей.",
              )}
            </p>
            <div className="grid gap-4 md:grid-cols-2 mt-4">
              {compare.map((id) => {
                const a = results.find((r) => r.id === id)!;
                return (
                  <article key={id} className="border border-border rounded-xl p-4">
                    <h4>{new Date(a.created_at).toLocaleDateString(lang)}</h4>
                    <p>{historyLabel(a.iq_score, a.mbti_type, lang)}</p>
                    <ol className="list-decimal pl-5">
                      {a.careers.slice(0, 3).map((c) => (
                        <li key={c.name}>
                          {tCareer(c.name).name}: {c.match}/100
                        </li>
                      ))}
                    </ol>
                    <Link
                      className="field-button mt-3"
                      to="/career-results"
                      search={{ resultId: id }}
                    >
                      {w("View result", "Natijani ko‘rish", "Открыть результат")}
                    </Link>
                  </article>
                );
              })}
            </div>
            <p className="mt-3">
              {w(
                "Top direction changed:",
                "Birinchi yo‘nalish o‘zgardi:",
                "Первое направление изменилось:",
              )}{" "}
              {results.find((r) => r.id === compare[0])?.careers[0]?.name ===
              results.find((r) => r.id === compare[1])?.careers[0]?.name
                ? w("No", "Yo‘q", "Нет")
                : w("Yes", "Ha", "Да")}
            </p>
            <p className="mt-3">
              {w(
                "Reasoning difference (second selected minus first):",
                "Mantiqiy natija farqi (ikkinchi tanlangan minus birinchi):",
                "Разница заданий на мышление (вторая выбранная минус первая):",
              )}{" "}
              {(() => {
                const a = results.find((r) => r.id === compare[0])!.iq_score;
                const b = results.find((r) => r.id === compare[1])!.iq_score;
                return a == null || b == null
                  ? w(
                      "Not comparable: reasoning was not assessed in one attempt.",
                      "Solishtirib bo‘lmaydi: bir urinishda mantiqiy savollar baholanmagan.",
                      "Не сравнивается: в одной попытке не было заданий на мышление.",
                    )
                  : `${b - a >= 0 ? "+" : ""}${b - a}/9`;
              })()}
            </p>
          </section>
        )}
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
  const { lang } = useI18n();
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
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-sm font-bold uppercase tracking-wider ${
            featured ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
          }`}
        >
          {featured && <Crown className="h-3 w-3" />} #{rank}{" "}
          {featured ? w("First suggestion", "Birinchi tavsiya", "Первое предложение") : ""}
        </span>
        <span className="text-2xl font-bold gradient-text tabular-nums">{career.match}/100</span>
      </div>
      <h4 className="relative mt-3 text-lg font-semibold">{tc.name}</h4>
      <p className="relative mt-2 line-clamp-3 text-sm text-muted-foreground">
        {tc.reason || catalogLabel(career.reason, lang)}
      </p>
      <div className="relative mt-4 h-1.5 overflow-hidden rounded-full bg-secondary/60">
        <div
          className="h-full rounded-full bg-primary transition-all duration-1000"
          style={{ width: `${Math.max(0, Math.min(100, career.match))}%` }}
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
  value: number | null;
  max: number;
  hint: string;
  icon: LucideIcon;
}) {
  const pct = Math.min(100, ((value ?? 0) / max) * 100);
  const circumference = 2 * Math.PI * 30;
  const offset = circumference - (pct / 100) * circumference;
  return (
    <GlassCard className="p-5 transition-all hover:-translate-y-0.5">
      <div className="flex items-center justify-between">
        <div className="text-sm uppercase tracking-wider text-muted-foreground">{label}</div>
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
            {value ?? "—"}
          </div>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-medium text-muted-foreground line-clamp-2">{hint}</div>
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
        <div className="text-sm uppercase tracking-wider text-muted-foreground">{label}</div>
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Icon className="h-3 w-3" />
        </span>
      </div>
      <div className="mt-3 text-3xl font-bold gradient-text">{value}</div>
      <div className="mt-1 line-clamp-2 text-sm text-muted-foreground">{hint}</div>
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
  const tr = useUiText();

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

  const saving = useRef(false);
  const scoreFields = useRef<HTMLDivElement>(null);
  async function saveStats() {
    if (saving.current) return;
    const invalid = [
      ...(scoreFields.current?.querySelectorAll<HTMLInputElement>("input") ?? []),
    ].find((input) => !input.validity.valid);
    if (invalid) {
      invalid.focus();
      invalid.reportValidity();
      return;
    }
    saving.current = true;
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
    } finally {
      saving.current = false;
    }
  }

  return (
    <div ref={scoreFields} className="space-y-6">
      {/* Stats grid */}
      <GlassCard className="p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SectionTitle icon={BarChart3}>
            {w("Your recorded test scores", "Qayd etilgan test ballari", "Записанные баллы тестов")}
          </SectionTitle>
          <button
            onClick={() => (editing ? saveStats() : setEditing(true))}
            className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary transition-all hover:bg-primary/20"
          >
            {editing ? (
              <>
                <Check className="h-3.5 w-3.5" />
                {tr("Save")}
              </>
            ) : (
              <>
                <Pencil className="h-3.5 w-3.5" />
                {tr("Edit Stats")}
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
                  <span className="text-sm uppercase tracking-wider text-muted-foreground">
                    {tr(f.label)}
                  </span>
                </div>
                {editing ? (
                  <input
                    type="number"
                    aria-label={tr(f.label)}
                    min={f.key === "sat_score" ? 400 : 0}
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
                      <CountUp
                        value={raw}
                        decimals={f.key === "ielts_band" ? 1 : 0}
                        suffix={f.unit ?? ""}
                        duration={1000}
                      />
                    ) : (
                      <span className="text-sm">
                        {w("Not recorded", "Qayd etilmagan", "Не записано")}
                      </span>
                    )}
                  </div>
                )}
                <p className="mt-3 text-sm text-muted-foreground">
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
              className="rounded-full border border-border px-4 py-1.5 text-sm hover:bg-secondary"
            >
              {tr("Cancel")}
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
  const tr = useUiText();

  const w = useWords();
  const pending = useRef(false);
  const titleInput = useRef<HTMLInputElement>(null);
  function validTitle() {
    if (draft.title.trim()) return true;
    titleInput.current?.focus();
    toast.error(
      w("Enter an activity title.", "Faoliyat nomini kiriting.", "Введите название занятия."),
    );
    return false;
  }
  function failed() {
    toast.error(
      w(
        "Activity was not saved. Please try again.",
        "Faoliyat saqlanmadi. Qayta urinib ko‘ring.",
        "Занятие не сохранено. Попробуйте снова.",
      ),
    );
  }
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<{ title: string; description: string }>({
    title: "",
    description: "",
  });

  async function addOne() {
    if (pending.current || !validTitle()) return;
    pending.current = true;
    try {
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
      } else failed();
    } catch {
      failed();
    } finally {
      pending.current = false;
    }
  }

  async function saveEdit(id: string) {
    if (pending.current || !validTitle()) return;
    pending.current = true;
    try {
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
      } else failed();
    } catch {
      failed();
    } finally {
      pending.current = false;
    }
  }

  async function removeOne(id: string) {
    const { error } = await supabase.from("user_achievements").delete().eq("id", id);
    if (!error) setAchievements(achievements.filter((a) => a.id !== id));
  }

  return (
    <GlassCard className="p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionTitle icon={Award}>{tr("Achievements & Activities")}</SectionTitle>
        <button
          onClick={() => {
            setAdding(true);
            setDraft({ title: "", description: "" });
          }}
          className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary transition-all hover:bg-primary/20"
        >
          <Plus className="h-3.5 w-3.5" />
          {tr("Add")}
        </button>
      </div>

      {adding && (
        <div className="mt-5 rounded-2xl border border-primary/30 bg-primary/5 p-4">
          <input
            ref={titleInput}
            aria-label={w("Activity title", "Faoliyat nomi", "Название занятия")}
            autoFocus
            placeholder={tr("e.g. Founder of NavoiUnity")}
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            className="w-full bg-transparent text-sm font-medium outline-none placeholder:text-muted-foreground/60"
          />
          <textarea
            placeholder={tr("Short description (optional)")}
            value={draft.description}
            onChange={(e) => setDraft({ ...draft, description: e.target.value })}
            className="mt-2 w-full resize-none bg-transparent text-sm text-muted-foreground outline-none placeholder:text-muted-foreground/60"
            rows={2}
          />
          <div className="mt-3 flex items-center justify-end gap-2">
            <button
              onClick={() => setAdding(false)}
              className="rounded-full border border-border px-3 py-1 text-sm hover:bg-secondary"
            >
              {tr("Cancel")}
            </button>
            <button
              onClick={addOne}
              className="rounded-full bg-primary px-3 py-1 text-sm font-medium text-primary-foreground hover:-translate-y-0.5 transition-all"
            >
              {tr("Save")}
            </button>
          </div>
        </div>
      )}

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {achievements.length === 0 && !adding && (
          <div className="col-span-full rounded-2xl border border-dashed border-border/60 p-8 text-center text-sm text-muted-foreground">
            {tr("No achievements yet. Add your first one — e.g.")}{" "}
            <span className="text-foreground">{tr('"Olympiad Participant"')}</span> {tr("or")}{" "}
            <span className="text-foreground">{tr('"Debate Club Member"')}</span>.
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
                        ref={titleInput}
                        aria-label={w("Activity title", "Faoliyat nomi", "Название занятия")}
                        value={draft.title}
                        onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                        className="w-full bg-transparent text-sm font-semibold outline-none ring-1 ring-border/60 rounded px-2 py-1 focus:ring-primary/50"
                      />
                      <textarea
                        value={draft.description}
                        onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                        className="mt-2 w-full resize-none bg-transparent text-sm outline-none ring-1 ring-border/60 rounded px-2 py-1 focus:ring-primary/50"
                        rows={2}
                      />
                    </>
                  ) : (
                    <>
                      <h4 className="truncate text-sm font-semibold">{a.title}</h4>
                      {a.description && (
                        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                          {a.description}
                        </p>
                      )}
                    </>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100">
                  {isEditing ? (
                    <>
                      <button
                        aria-label={w("Save", "Saqlash", "Сохранить")}
                        onClick={() => saveEdit(a.id)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-primary hover:bg-primary/30"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                      <button
                        aria-label={w("Cancel", "Bekor qilish", "Отмена")}
                        onClick={() => setEditingId(null)}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:bg-secondary/80"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        aria-label={w("Edit", "Tahrirlash", "Изменить")}
                        onClick={() => {
                          setEditingId(a.id);
                          setDraft({ title: a.title, description: a.description ?? "" });
                        }}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-secondary text-muted-foreground hover:bg-secondary/80"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        aria-label={w("Delete", "O‘chirish", "Удалить")}
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
  const tr = useUiText();

  const w = useWords();
  const profilePending = useRef(false);
  const resetPending = useRef(false);
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
    if (profilePending.current) return;
    if (!draft.name.trim() || !draft.surname.trim()) {
      toast.error(t.auth.errNameRequired);
      return;
    }
    profilePending.current = true;
    try {
      const updated = { name: draft.name.trim(), surname: draft.surname.trim() };
      const { error } = await supabase.from("profiles").update(updated).eq("id", userId);
      if (error) throw error;
      onProfileUpdate(updated);
      setEditing(false);
    } catch {
      toast.error(t.auth.errGeneric);
    } finally {
      profilePending.current = false;
    }
  }
  async function changePassword() {
    if (resetPending.current || !PASSWORD_RECOVERY_ENABLED) return;
    resetPending.current = true;
    setMsg(null);
    try {
      await requestPasswordRecovery({ data: { email } });
      setMsg(
        w(
          "If this address has an account, check its inbox for a recovery link.",
          "Bu manzilda hisob bo‘lsa, tiklash havolasi uchun pochtani tekshiring.",
          "Если у адреса есть аккаунт, проверьте почту для ссылки восстановления.",
        ),
      );
    } catch {
      setMsg(t.auth.errGeneric);
    } finally {
      resetPending.current = false;
    }
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
                <div className="text-sm uppercase tracking-wider text-accent">
                  {tr("Founder access")}
                </div>
                <div className="text-lg font-bold gradient-text">{tr("Open Admin Dashboard")}</div>
                <div className="text-sm text-muted-foreground">
                  {tr("Analytics and user management")}
                </div>
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
          <SectionTitle icon={UserIcon}>{tr("Profile")}</SectionTitle>
          <div className="mt-5 space-y-3">
            <Field label={tr("Email")} value={email} disabled />
            {editing ? (
              <>
                <Field
                  label={tr("First name")}
                  value={draft.name}
                  onChange={(v) => setDraft({ ...draft, name: v })}
                />
                <Field
                  label={tr("Last name")}
                  value={draft.surname}
                  onChange={(v) => setDraft({ ...draft, surname: v })}
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => {
                      setDraft({ name: profile?.name ?? "", surname: profile?.surname ?? "" });
                      setEditing(false);
                    }}
                    className="rounded-full border border-border px-4 py-1.5 text-sm hover:bg-secondary"
                  >
                    {tr("Cancel")}
                  </button>
                  <button
                    onClick={saveProfile}
                    className="rounded-full bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:-translate-y-0.5 transition-all"
                  >
                    {tr("Save")}
                  </button>
                </div>
              </>
            ) : (
              <>
                <Field label={tr("First name")} value={profile?.name ?? ""} disabled />
                <Field label={tr("Last name")} value={profile?.surname ?? ""} disabled />
                <button
                  onClick={() => setEditing(true)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary hover:bg-primary/20"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  {tr("Edit profile")}
                </button>
              </>
            )}
          </div>
        </GlassCard>

        <GlassCard className="p-7">
          <SectionTitle icon={SettingsIcon}>{tr("Preferences")}</SectionTitle>
          <div className="mt-5 space-y-4">
            <PrefRow icon={Languages} label={tr("Language")} hint={tr("Switch interface language")}>
              <LanguageSwitcher />
            </PrefRow>
            <PrefRow icon={Moon} label={tr("Appearance")} hint={tr("Light or dark theme")}>
              <ThemeToggle />
            </PrefRow>
          </div>
        </GlassCard>

        <GlassCard className="p-7">
          <SectionTitle icon={KeyRound}>{tr("Security")}</SectionTitle>
          <p className="mt-3 text-sm text-muted-foreground">
            {PASSWORD_RECOVERY_ENABLED
              ? tr("Reset your password — we'll send a secure link to your email.")
              : w(
                  `Password recovery email is not connected yet. Contact ${CONTACT_EMAIL} for help.`,
                  `Parolni tiklash emaili hali ulanmagan. Yordam uchun ${CONTACT_EMAIL} manziliga yozing.`,
                  `Письма восстановления пароля пока не подключены. Для помощи напишите на ${CONTACT_EMAIL}.`,
                )}
          </p>
          <button
            onClick={changePassword}
            disabled={!PASSWORD_RECOVERY_ENABLED}
            className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary hover:bg-primary/20"
          >
            <KeyRound className="h-3.5 w-3.5" />
            {tr("Send reset link")}
          </button>
          {msg && <p className="mt-3 text-sm text-muted-foreground">{msg}</p>}
        </GlassCard>

        <GlassCard className="p-7">
          <SectionTitle icon={LogOut}>{tr("Session")}</SectionTitle>
          <p className="mt-3 text-sm text-muted-foreground">
            {tr("Sign out from this device. Check your save status before leaving.")}
          </p>
          <button
            onClick={onLogout}
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive transition-all hover:bg-destructive/20"
          >
            <LogOut className="h-3.5 w-3.5" /> {t.dashboard.logout}
          </button>
        </GlassCard>
      </div>
    </div>
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
  const id = useId();
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1 block text-sm uppercase tracking-wider text-muted-foreground"
      >
        {label}
      </label>
      <input
        id={id}
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
          <div className="truncate text-sm text-muted-foreground">{hint}</div>
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
