import { FounderCrown } from "@/components/design4/Artwork";
import { DeferredBelowFold } from "@/components/DeferredBelowFold";
import { dashboardResult } from "@/lib/dashboard/history";
import { displayDate } from "@/lib/display-date";
import { historyLabel } from "@/lib/assessment/report-tools";
import { requestPasswordRecovery } from "@/lib/auth/recovery.functions";
import { PASSWORD_RECOVERY_ENABLED, CONTACT_EMAIL } from "@/lib/constants";
import { catalogLabel } from "@/lib/catalog-labels";
import { consumeDashboard, requestDashboardHistory } from "@/lib/dashboard/preload";
import { useUiText } from "@/lib/ui-text";
import { toast } from "sonner";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import {
  lazy,
  Suspense,
  startTransition,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Brain,
  Mail,
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
  Languages,
  Moon,
  KeyRound,
  ChevronRight,
  Crown,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { reasoningCaveat } from "@/lib/assessment/reasoning-copy";
import { useWords } from "@/lib/editorial";
import { useI18n } from "@/lib/i18n";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ProfilePhotoCard, resolveAvatarUrl } from "@/components/ProfilePhotoCard";
const loadAbbiChat = () => import("@/components/AbbiChat");
const AbbiChat = lazy(() => loadAbbiChat().then((m) => ({ default: m.AbbiChat })));
import {
  SkillsSection,
  WeeklyReportSection,
  UniversitiesTabSection,
} from "@/components/dashboard/ExtraSections";
import { CountUp } from "@/components/CountUp";
import { GlowBlob } from "@/components/GlowBlob";
import {
  CameraDrawing,
  ReasoningInfoDrawing,
  StrengthsHeartDrawing,
  CareersCompassDrawing,
  HistoryChartDrawing,
  ProfileDrawing,
  PreferencesDrawing,
  LanguageDrawing,
  MoonDrawing,
  MailDrawing,
  ResultsTabDrawing,
  ScoresTabDrawing,
  ActivitiesTabDrawing,
  RecordedTabDrawing,
  UniversitiesTabDrawing,
  AbbiTabDrawing,
  SettingsTabDrawing,
  ReasoningDrawing,
  PersonalityDrawing,
  AssessmentsDrawing,
  FitDrawing,
  StripedCard,
  Tape,
  Sparkle,
  StampStar,
  FinishFlag,
  Pushpin,
  MedalDrawing,
  LaptopDrawing,
  LightningDrawing,
  SwordsDrawing,
  ArrowDrawing,
  SatDrawing,
  IeltsDrawing,
} from "@/components/dashboard/StudentPieces";

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
  const [resultTotal, setResultTotal] = useState(0);
  const [historyError, setHistoryError] = useState(false);
  const generation = useRef(0);
  const historyBusy = useRef(false);
  const historyOffset = useRef(-1);
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
    const version = ++generation.current;
    historyBusy.current = false;
    historyOffset.current = -1;
    setHistoryError(false);
    setResultTotal(0);
    setBusy(true);
    setLoadError(false);
    setProfile(null);
    setResults([]);
    setStats(null);
    setAchievements([]);
    (async () => {
      const responses = await consumeDashboard(user.id);
      if (cancelled) return;
      if (responses.some((r) => r.error)) throw new Error("Dashboard unavailable");
      const [{ data: p }, { data: r }, { data: s }, { data: a }] = responses;
      const mapped = ((r as unknown as Array<Record<string, unknown>>) ?? []).map(dashboardResult);
      startTransition(() => {
        setProfile(p ?? null);
        setResults(mapped);
        setResultTotal(responses[1].count ?? mapped.length);
        setStats((s as unknown as Stats) ?? null);
        setAchievements((a as unknown as Achievement[]) ?? []);
        setBusy(false);
      });
    })().catch(() => {
      if (!cancelled) {
        setLoadError(true);
        setBusy(false);
      }
    });
    return () => {
      cancelled = true;
      generation.current = version + 1;
    };
  }, [user, loading, navigate, reload]);

  const loadHistory = useCallback(async () => {
    if (
      !user ||
      historyBusy.current ||
      historyOffset.current === results.length ||
      results.length >= resultTotal
    )
      return;
    const version = generation.current;
    historyBusy.current = true;
    historyOffset.current = results.length;
    setHistoryError(false);
    try {
      const response = await requestDashboardHistory(user.id, results.length);
      if (response.error || !response.data) throw new Error("History unavailable");
      if (version !== generation.current) return;
      const rows = (response.data as unknown as Record<string, unknown>[]).map(dashboardResult);
      startTransition(() => {
        setResults((current) => [
          ...current,
          ...rows.filter((r) => !current.some((old) => old.id === r.id)),
        ]);
        setResultTotal(response.count ?? resultTotal);
      });
    } catch {
      if (version === generation.current) {
        historyOffset.current = -1;
        setHistoryError(true);
      }
    } finally {
      if (version === generation.current) historyBusy.current = false;
    }
  }, [user, results.length, resultTotal]);

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
  const activityXp = resultTotal * 50 + achievements.length * 25;
  const level = Math.max(1, Math.floor(activityXp / 100) + 1);
  const levelProgress = Math.min(100, ((activityXp % 100) / 100) * 100);

  if (loading || busy) {
    return (
      <PageShell>
        <section data-route-pending className="relative px-4 pt-10 pb-24 sm:px-6">
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
      <section className="student-dashboard">
        <div className="student-wrap">
          {/* PROFILE HEADER */}
          <ProfileHeader
            fullName={fullName}
            email={user?.email ?? ""}
            initials={initials}
            avatarUrl={stats?.avatar_url ?? null}
            level={level}
            levelProgress={levelProgress}
            tagline={stats?.tagline ? tagline : catalogLabel(tagline, lang)}
            onPhoto={() => setTab("settings")}
          />

          {/* HORIZONTAL TABS */}
          <TabBar tab={tab} setTab={setTab} />

          {/* CONTENT */}
          <Suspense fallback={null}>
            <div className={`d4-dashboard-board d4-board-${tab}`} key={tab}>
              {tab === "results" && (
                <ResultsSection
                  results={results}
                  total={resultTotal}
                  loadMore={loadHistory}
                  historyError={historyError}
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
          </Suspense>
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
  onPhoto,
}: {
  fullName: string;
  email: string;
  initials: string;
  avatarUrl: string | null;
  level: number;
  levelProgress: number;
  tagline: string;
  onPhoto: () => void;
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
    <StripedCard className="student-profile">
      <Sparkle className="student-profile-sparkle" />
      <div className="student-profile-layout">
        <div className="student-polaroid">
          <Tape />
          <div className="student-avatar">
            {resolvedAvatar ? (
              <img src={resolvedAvatar} alt={fullName} decoding="async" />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <button
            type="button"
            className="student-camera"
            onClick={onPhoto}
            aria-label={w("Change photo", "Rasmni o‘zgartirish", "Изменить фото")}
          >
            <CameraDrawing />
          </button>
        </div>
        <div className="student-identity">
          <div className="student-name-row">
            <h1>{fullName}</h1>
            <p className="student-stamp">
              <StampStar />
              {tagline}
            </p>
            <span className="student-chip student-level">
              <Sparkles size={15} />
              {w("Activity level", "Faollik darajasi", "Уровень активности")} {level}
            </span>
          </div>
          <p className="student-email">{email}</p>

          <p className="mt-3 text-sm text-muted-foreground">
            {w(
              "Activity points come from saved assessments (50 each) and recorded achievements (25 each). A level is not a measure of skill or career readiness.",
              "Faollik ballari saqlangan baholash (50) va qayd etilgan yutuqdan (25) keladi. Daraja ko‘nikma yoki kasbga tayyorlik o‘lchovi emas.",
              "Баллы начисляются за сохранённые оценки (50) и записанные достижения (25). Уровень не измеряет навыки или готовность к профессии.",
            )}
          </p>

          <div className="student-level-progress">
            <div className="student-progress-label">
              <span>
                {w("Activity toward level", "Keyingi faollik darajasi", "До уровня активности")}{" "}
                {level + 1}
              </span>
              <span>{Math.round(levelProgress)}%</span>
            </div>
            <div className="student-progress-row">
              <div className="student-striped-bar">
                <div style={{ width: `${levelProgress}%` }} />
              </div>
              <FinishFlag />
            </div>
          </div>
        </div>
      </div>
    </StripedCard>
  );
}

/* ============================================================ */
/* TAB BAR                                                       */
/* ============================================================ */
function TabBar({ tab, setTab }: { tab: TabKey; setTab: (t: TabKey) => void }) {
  const w = useWords();
  const tabs: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] =
    [
      { key: "results", label: w("Results", "Natijalar", "Результаты"), icon: ResultsTabDrawing },
      {
        key: "stats",
        label: w("Test scores", "Test ballari", "Баллы тестов"),
        icon: ScoresTabDrawing,
      },
      {
        key: "skills",
        label: w("Activities", "Faoliyatlar", "Занятия"),
        icon: ActivitiesTabDrawing,
      },
      {
        key: "weekly",
        label: w("Recorded activity", "Qaydlar", "Активность"),
        icon: RecordedTabDrawing,
      },
      {
        key: "universities",
        label: w("Universities", "Universitetlar", "Университеты"),
        icon: UniversitiesTabDrawing,
      },
      { key: "abbi", label: "ABBI Guide", icon: AbbiTabDrawing },
      {
        key: "settings",
        label: w("Settings", "Sozlamalar", "Настройки"),
        icon: SettingsTabDrawing,
      },
    ];
  return (
    <nav className="student-tabs" aria-label={w("Dashboard", "Boshqaruv paneli", "Личный кабинет")}>
      {tabs.map(({ key, label, icon: Icon }) => (
        <button
          type="button"
          key={key}
          onPointerEnter={() => {
            if (key === "abbi") void loadAbbiChat();
          }}
          onFocus={() => {
            if (key === "abbi") void loadAbbiChat();
          }}
          onTouchStart={() => {
            if (key === "abbi") void loadAbbiChat();
          }}
          onClick={() => startTransition(() => setTab(key))}
          aria-pressed={tab === key}
          className="student-tab"
        >
          <Icon />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}

/* ============================================================ */
/* SECTION 1: RESULTS                                            */
/* ============================================================ */
function ResultsSection({
  results,
  total,
  loadMore,
  historyError,
  latest,
  tCareer,
  tTrait,
  t,
}: {
  results: Result[];
  total: number;
  loadMore: () => Promise<void>;
  historyError: boolean;
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
    <div className="student-results">
      {/* Top metrics row */}
      <div className="student-metrics">
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
          value={String(total)}
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

      <DeferredBelowFold>
        {/* Cognitive bars + Strengths/Weaknesses */}
        <div className="student-details">
          <GlassCard className="student-ruled">
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
            <GlassCard className="student-strengths">
              <MedalDrawing className="student-medal" />
              <SectionTitle icon={Heart}>{tr("Top Strengths")}</SectionTitle>
              {latest.top_strengths?.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {latest.top_strengths.map((s) => (
                    <span key={s} className="student-chip student-strength-chip">
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
                      className="rounded-full border border-accent/20 bg-card px-3 py-1.5 text-sm font-medium text-foreground"
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
      </DeferredBelowFold>
      <DeferredBelowFold>
        {/* Career matches */}
        <GlassCard className="student-careers">
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
            <div className="student-career-grid">
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
      </DeferredBelowFold>
      <DeferredBelowFold>
        {/* Career Battles CTA */}
        <Link to="/career-battles" className="student-battles">
          <span className="student-icon-tile">
            <SwordsDrawing />
          </span>
          <span className="student-battles-copy">
            <strong>{tr("Try Career Battles")}</strong>
            <span>{tr("Compare saved careers and practical experiments")}</span>
          </span>
          <LightningDrawing className="student-lightning" />
          <span className="student-round-arrow">
            <ArrowDrawing />
          </span>
        </Link>
      </DeferredBelowFold>
      <DeferredBelowFold>
        {/* History */}
        <GlassCard className="p-7">
          <SectionTitle icon={TrendingUp}>{tr("Assessment History")}</SectionTitle>
          <ul className="student-history">
            {results.map((r, i) => (
              <li
                key={r.id}
                className={`student-history-entry ${i === 0 ? "student-history-latest" : ""}`}
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
                  {displayDate(r.created_at)}
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
          {results.length < total && <HistoryTail loadMore={loadMore} failed={historyError} />}
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
      </DeferredBelowFold>
    </div>
  );
}

function HistoryTail({ loadMore, failed }: { loadMore: () => Promise<void>; failed: boolean }) {
  const target = useRef<HTMLDivElement>(null);
  const tr = useUiText();
  useEffect(() => {
    if (failed || !target.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void loadMore();
      },
      { rootMargin: "200px" },
    );
    observer.observe(target.current);
    return () => observer.disconnect();
  }, [loadMore, failed]);
  return (
    <div ref={target} role={failed ? "alert" : undefined}>
      {failed && <button onClick={() => void loadMore()}>{tr("Retry")}</button>}
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
    <article className={`student-career ${featured ? "student-career-featured" : ""}`}>
      <span className="student-career-ribbon">
        {featured && <Crown size={16} />} #{rank}{" "}
        {featured ? w("First suggestion", "Birinchi tavsiya", "Первое предложение") : ""}
      </span>
      <div className="student-career-heading">
        <LaptopDrawing />
        <h4>{tc.name}</h4>
        <span>{career.match}/100</span>
      </div>
      <p>{tc.reason || catalogLabel(career.reason, lang)}</p>
      <div className="student-striped-bar">
        <div style={{ width: `${Math.max(0, Math.min(100, career.match))}%` }} />
      </div>
    </article>
  );
}

function MetricRing({
  label,
  value,
  max,
  hint,
}: {
  label: string;
  value: number | null;
  max: number;
  hint: string;
  icon: LucideIcon;
}) {
  const pct = Math.min(100, ((value ?? 0) / max) * 100);
  const circumference = 2 * Math.PI * 42;
  return (
    <GlassCard className="student-metric student-reasoning">
      <Pushpin />
      <div className="student-metric-label">
        <span>{label}</span>
        <span className="student-icon-tile">
          <ReasoningDrawing />
        </span>
      </div>
      <div className="student-ring-row">
        <div className="student-ring">
          <svg width="112" height="112" viewBox="0 0 112 112" aria-hidden="true">
            <circle
              cx="56"
              cy="56"
              r="42"
              fill="var(--card)"
              stroke="var(--card)"
              strokeWidth="12"
            />
            <circle
              cx="56"
              cy="56"
              r="42"
              fill="none"
              stroke="#45c97a"
              strokeWidth="12"
              strokeDasharray={`${(pct / 100) * circumference} ${circumference}`}
              transform="rotate(-90 56 56)"
            />
            <circle cx="56" cy="56" r="49" fill="none" stroke="var(--ink)" strokeWidth="3" />
            <circle cx="56" cy="56" r="35" fill="none" stroke="var(--ink)" strokeWidth="3" />
            <circle
              cx="57.5"
              cy="54.5"
              r="50.5"
              fill="none"
              stroke="var(--ink)"
              strokeWidth="1.5"
              opacity="0.45"
            />
          </svg>
          <span>{value ?? "—"}</span>
        </div>
      </div>
      <p className="student-reasoning-hint">{hint}</p>
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
    <GlassCard className="student-metric">
      <Pushpin color="#8fb0ff" />
      <div className="student-metric-label">
        <span>{label}</span>
        <span className="student-icon-tile">
          {Icon === Sparkles ? (
            <PersonalityDrawing />
          ) : Icon === Activity ? (
            <AssessmentsDrawing />
          ) : (
            <FitDrawing />
          )}
        </span>
      </div>
      <div className="student-metric-value">{value}</div>
      <p>{hint}</p>
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
    <div ref={scoreFields} className="student-scores space-y-6">
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
        <div className="student-tickets">
          {STAT_FIELDS.map((f) => {
            const raw = draft[f.key] as number | null;
            return (
              <div
                key={String(f.key)}
                className={`student-ticket ${f.key === "sat_score" ? "student-sat" : "student-ielts"}`}
              >
                <div className="student-ticket-stub">
                  {f.key === "sat_score" ? <SatDrawing /> : <IeltsDrawing />}
                </div>
                <span className="student-notch student-notch-top" aria-hidden="true" />
                <span className="student-notch student-notch-bottom" aria-hidden="true" />
                <div className="student-ticket-body">
                  <div className="flex items-center justify-between">
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
                    <div className="student-ticket-value">
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
                  {f.key === "sat_score" ? (
                    <div className="student-ruler" aria-hidden="true">
                      <div
                        style={{
                          width: `${Math.max(0, Math.min(100, ((raw ?? 0) / 1600) * 100))}%`,
                        }}
                      />
                    </div>
                  ) : (
                    <div className="student-ielts-dots" aria-hidden="true">
                      {Array.from({ length: 9 }, (_, i) => (
                        <span
                          key={i}
                          style={{
                            background:
                              raw != null && raw >= i + 1
                                ? "#45c97a"
                                : raw != null && raw > i
                                  ? "linear-gradient(90deg,#45c97a 50%,var(--card) 50%)"
                                  : "var(--card)",
                          }}
                        />
                      ))}
                    </div>
                  )}
                  <p className="mt-3 text-sm text-muted-foreground">
                    {w("Scale", "Shkala", "Шкала")}: {f.max} ·{" "}
                    {w("Entered by you", "O‘zingiz kiritgan", "Введено вами")}
                  </p>
                </div>
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
          className="d4-admin-ticket group relative block rounded-3xl border border-primary/40 bg-card p-6 hover:-translate-y-0.5"
          style={{ boxShadow: "4px 4px 0 var(--ink)" }}
        >
          <GlowBlob className="-right-10 -top-10 h-40 w-40 opacity-50 blur-3xl" alpha={0.5} />
          <span className="d4-ticket-notch d4-ticket-notch-top" aria-hidden="true" />
          <span className="d4-ticket-notch d4-ticket-notch-bottom" aria-hidden="true" />
          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg">
                <FounderCrown />
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
      <div className="student-settings-grid">
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
            <PrefRow
              icon={Mail}
              label={tr("Weekly digest email")}
              hint={tr("Activate in Lovable integrations to enable sending")}
            >
              <button
                type="button"
                className="student-digest"
                role="switch"
                aria-label={tr("Weekly digest email")}
                aria-checked={false}
                disabled
              >
                <span />
              </button>
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
  const Drawing = Icon === Languages ? LanguageDrawing : Icon === Moon ? MoonDrawing : MailDrawing;
  return (
    <div className="student-pref-row">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Drawing />
        </div>
        <div className="min-w-0">
          <div className="student-pref-label">{label}</div>
          <div className="student-pref-hint">{hint}</div>
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
  return <StripedCard className={className}>{children}</StripedCard>;
}

function SectionTitle({ icon: Icon, children }: { icon: LucideIcon; children: React.ReactNode }) {
  const Drawing =
    Icon === BarChart3
      ? ScoresTabDrawing
      : Icon === Brain
        ? ReasoningInfoDrawing
        : Icon === Heart
          ? StrengthsHeartDrawing
          : Icon === Trophy
            ? CareersCompassDrawing
            : Icon === TrendingUp
              ? HistoryChartDrawing
              : Icon === UserIcon
                ? ProfileDrawing
                : Icon === SettingsIcon
                  ? PreferencesDrawing
                  : null;
  return (
    <h2 className="student-section-title">
      <span className="student-icon-tile">
        {Drawing ? <Drawing /> : <Icon className="h-3.5 w-3.5" />}
      </span>
      {children}
    </h2>
  );
}
