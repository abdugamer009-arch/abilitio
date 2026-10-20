import { memo } from "react";
import { careerRoadmap } from "@/lib/roadmap/career-roadmap";
import { useI18n } from "@/lib/i18n";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { JourneySea } from "@/components/illustrations/JourneySea";
import { ActivityGuide } from "@/components/ActivityGuide";
import { GlowBlob } from "@/components/GlowBlob";
import { PageShell } from "@/components/PageShell";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import {
  Sparkles,
  CheckCircle2,
  Clock,
  Zap,
  Star,
  Trophy,
  ChevronRight,
  Compass,
  Map as MapIcon,
} from "lucide-react";
import {
  buildRoadmap,
  pickTrack,
  type RoadmapPhase,
  type RoadmapTrack,
} from "@/lib/roadmap/roadmap-world";
import { track as analyticsTrack, AnalyticsEvent } from "@/lib/analytics";
import { useTaskJournal } from "@/lib/roadmap/useTaskJournal";
import { useWords } from "@/lib/editorial";
import { useT } from "@/lib/i18n";

export const Route = createFileRoute("/roadmap")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, follow" },
      { title: "Roadmap World — Your Career Journey | Abilitio" },
      {
        name: "description",
        content:
          "Travel through 5 islands of personalized growth. Complete tasks, earn XP, and follow ABBI from Foundations to Mastery.",
      },
      { property: "og:title", content: "Roadmap World — Abilitio" },
      { property: "og:description", content: "Career exploration activities across five phases." },
    ],
  }),
  component: RoadmapPage,
});

function RoadmapPage() {
  const t = useT();
  const { lang } = useI18n();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [careerError, setCareerError] = useState(false);
  const [careerBusy, setCareerBusy] = useState(true);
  const [retryCareer, setRetryCareer] = useState(0);
  const [topCareer, setTopCareer] = useState<{
    key: string;
    name: string;
    category: string;
  } | null>(null);
  const [activePhase, setActivePhase] = useState<RoadmapPhase["index"]>(1);
  const {
    tasks: tasksDone,
    persist: persistTasks,
    syncState,
    legacyFound,
  } = useTaskJournal(user?.id);
  const w = useWords();
  const [celebrating, setCelebrating] = useState<number | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", search: { mode: "login", next: "/roadmap" } });
  }, [loading, user, navigate]);

  // Load top career to personalize the track
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    setTopCareer(null);
    setCareerError(false);
    setCareerBusy(true);
    (async () => {
      const { data, error } = await supabase
        .from("career_assessment_results")
        .select("career_matches")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (cancelled) return;
      if (error) throw new Error("Career profile unavailable");
      const careers = (data?.career_matches ?? []) as {
        key: string;
        name: string;
        category: string;
      }[];
      setTopCareer(careers[0] ?? null);
      setCareerBusy(false);
    })().catch(() => {
      if (!cancelled) {
        setCareerError(true);
        setCareerBusy(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [user, retryCareer]);

  const track: RoadmapTrack = useMemo(() => pickTrack(topCareer?.name), [topCareer]);
  const phases = useMemo(
    () => (topCareer?.key ? careerRoadmap(topCareer, lang) : buildRoadmap(track)),
    [track, topCareer, lang],
  );

  function handleComplete(p: RoadmapPhase, taskId: string) {
    if (tasksDone[taskId]) return;
    persistTasks({ ...tasksDone, [taskId]: true });
    if (Object.keys(tasksDone).length === 0) analyticsTrack(AnalyticsEvent.FirstTask);

    // Phase completion celebration
    const allDone = p.tasks.every((t) => (t.id === taskId ? true : tasksDone[t.id]));
    if (allDone) setCelebrating(p.index);
  }

  if (careerError)
    return (
      <PageShell>
        <div className="mx-auto max-w-xl p-10" role="alert">
          <p>
            {w(
              "Could not load your career profile.",
              "Kasb profilingiz yuklanmadi.",
              "Не удалось загрузить профиль.",
            )}
          </p>
          <button
            className="mt-4 rounded-xl bg-primary px-4 py-2 text-primary-foreground"
            onClick={() => setRetryCareer((n) => n + 1)}
          >
            {w("Retry", "Qayta urinish", "Повторить")}
          </button>
        </div>
      </PageShell>
    );

  if (loading || !user || careerBusy) {
    return (
      <PageShell>
        <p role="status" className="field-wrap pt-4 text-sm text-muted-foreground">
          {syncState === "saved"
            ? w(
                "Journal saved to your account",
                "Daftar hisobingizga saqlandi",
                "Дневник сохранён в аккаунте",
              )
            : syncState === "local"
              ? w(
                  "Saved in this browser; account sync pending. Reconnect to retry.",
                  "Shu brauzerda saqlandi; hisobga ulash kutilmoqda. Ulanishni tekshiring.",
                  "Сохранено в браузере; синхронизация ожидает подключения.",
                )
              : w("Loading your journal…", "Daftar yuklanmoqda…", "Загрузка дневника…")}
        </p>
        <section className="px-6 pt-12 pb-24" aria-busy="true" aria-label={t.roadmapUi.loadingAria}>
          <div className="mx-auto max-w-5xl">
            <div className="skeleton mx-auto h-10 w-72 rounded-2xl" />
            <div className="skeleton mx-auto mt-3 h-5 w-96 max-w-full rounded-xl" />
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton h-40 rounded-3xl" />
              ))}
            </div>
          </div>
        </section>
      </PageShell>
    );
  }

  if (!topCareer)
    return (
      <PageShell>
        <section className="field-wrap py-12">
          <h1>
            {w(
              "Choose a direction first",
              "Avval yo‘nalish tanlang",
              "Сначала выберите направление",
            )}
          </h1>
          <p className="my-5">
            {w(
              "Complete an assessment to build activities around your top career. Earlier journal marks remain saved.",
              "Birinchi kasbingizga mos mashg‘ulotlar uchun testdan o‘ting. Oldingi daftar belgilari saqlanadi.",
              "Пройдите тест, чтобы подобрать занятия к первому направлению. Прежние отметки дневника сохранены.",
            )}
          </p>
          <Link to="/career-assessment" className="field-button">
            {w("Explore your direction", "Yo‘nalishni o‘rganish", "Изучить направление")}
          </Link>
        </section>
      </PageShell>
    );
  const trackLabel = {
    tech: w("Technology Path", "Texnologiya yo‘li", "Путь технологий"),
    creative: w("Creative Path", "Ijod yo‘li", "Творческий путь"),
    business: w("Business Path", "Biznes yo‘li", "Путь бизнеса"),
    science: w("Science Path", "Ilm yo‘li", "Научный путь"),
    social: w("People & Media Path", "Insonlar va media yo‘li", "Люди и медиа"),
    default: w("Career Exploration Path", "Kasb izlanish yo‘li", "Путь знакомства с профессиями"),
  }[track];
  const active = phases.find((p) => p.index === activePhase)!;

  return (
    <PageShell>
      {legacyFound && (
        <p className="field-wrap py-4 text-sm text-muted-foreground" role="status">
          {w(
            "Older progress has no recorded career direction. Those marks are preserved for review; they do not count toward this path.",
            "Oldingi natijada kasb yo‘nalishi qayd etilmagan. Belgilar ko‘rib chiqish uchun saqlanadi va bu yo‘lga qo‘shilmaydi.",
            "У прежних отметок не записано направление. Они сохранены для проверки и не учитываются в этом пути.",
          )}
        </p>
      )}
      <section className="journey-page">
        <div className="journey-wrap">
          <header className="journey-hero">
            <div className="journey-heading">
              <span className="journey-chip journey-badge">
                <MapIcon size={16} /> {t.roadmapUi.badge} · {trackLabel}
              </span>
              <h1>
                {t.roadmapUi.titleA}{" "}
                <span>
                  {t.roadmapUi.titleB}
                  <svg viewBox="0 0 300 24" preserveAspectRatio="none" aria-hidden="true">
                    <path
                      d="M4 14C40 4 70 22 110 12S180 4 220 14S280 18 296 8"
                      fill="none"
                      stroke="var(--pen-red)"
                      strokeWidth="6"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                </span>
              </h1>
              <div className="journey-description">
                <p>{t.roadmapUi.subtitle}</p>
                <img src="/illustrations/journey/arrow.svg" alt="" width="64" height="70" />
              </div>
            </div>
            <div className="journey-ticket journey-shadow-wrap">
              <span className="journey-striped-shadow" aria-hidden="true" />
              <Link to="/universities" className="journey-ticket-face">
                <span className="journey-ticket-stitch" aria-hidden="true" />
                <span className="journey-icon">
                  <img src="/illustrations/journey/graduation.svg" alt="" width="40" height="40" />
                </span>
                <span>
                  <span className="journey-ticket-label">{t.roadmapUi.findUniversity}</span>
                  <strong>{t.roadmapUi.explore}</strong>
                </span>
                <ChevronRight size={22} />
              </Link>
              <img
                className="journey-ticket-sparkle"
                src="/illustrations/journey/sparkle.svg"
                alt=""
                width="40"
                height="40"
              />
            </div>
          </header>
          <WorldMap
            phases={phases}
            activePhase={activePhase}
            setActivePhase={setActivePhase}
            tasksDone={tasksDone}
          />

          {/* Active island panel */}
          <div className="journey-panels">
            {/* Phase summary */}
            <div className="journey-summary journey-shadow-wrap">
              <span className="journey-striped-shadow" aria-hidden="true" />
              <div className="journey-summary-face">
                <div className="relative">
                  <div className="journey-island-kicker">
                    <Star className="h-3 w-3 text-accent" /> {t.roadmapUi.island} {active.index}{" "}
                    {t.roadmapUi.of5}
                  </div>
                  <h2 className="journey-phase-heading">{active.name}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{active.subtitle}</p>

                  <div className="journey-phase-dots" aria-hidden="true">
                    {phases.map((phase) => (
                      <span
                        key={phase.index}
                        className={phase.index === activePhase ? "selected" : ""}
                      />
                    ))}
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Pill icon={<Zap className="h-3 w-3" />}>
                      {active.tasks.reduce((s, t) => s + t.xp, 0)} XP
                    </Pill>
                    <Pill icon={<Clock className="h-3 w-3" />}>
                      {active.tasks.length} {t.roadmapUi.tasks}
                    </Pill>
                  </div>

                  <div className="journey-progress">
                    <div className="flex items-center gap-2 text-accent">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-sm font-medium">{t.roadmapUi.yourIsland}</span>
                    </div>
                    <PhaseProgress phase={active} tasksDone={tasksDone} />
                  </div>
                </div>
              </div>
            </div>

            {/* Task list */}
            <div className="relative">
              <div className="relative space-y-3 transition-all">
                {active.tasks.map((task, idx) => {
                  const done = !!tasksDone[task.id];
                  const isCurrent =
                    !done && active.tasks.slice(0, idx).every((t) => tasksDone[t.id]);
                  return (
                    <TaskNode
                      key={task.id}
                      task={task}
                      done={done}
                      isCurrent={isCurrent}
                      onComplete={() => handleComplete(active, task.id)}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Phase celebration */}
          {celebrating != null && (
            <CelebrationModal phaseIndex={celebrating} onClose={() => setCelebrating(null)} />
          )}
        </div>
      </section>
    </PageShell>
  );
}

/* Artwork is copied from Journey.dc.html; phase data and completion stay authoritative. */
const WorldMap = memo(function WorldMap({
  phases,
  activePhase,
  setActivePhase,
  tasksDone,
}: {
  phases: RoadmapPhase[];
  activePhase: number;
  setActivePhase: (i: RoadmapPhase["index"]) => void;
  tasksDone: Record<string, boolean>;
}) {
  const phaseWord = useT().roadmapUi.phase;
  const spots = [
    [40, 300],
    [250, 150],
    [465, 300],
    [680, 120],
    [870, 270],
  ];
  const rotations = [-2, 1.5, -1, 2, -2];
  const abbi = spots[activePhase - 1];
  return (
    <div className="journey-map journey-shadow-wrap">
      <span className="journey-striped-shadow" aria-hidden="true" />
      <div className="journey-map-face">
        <div className="journey-map-scroll">
          <div className="journey-map-canvas">
            <JourneySea />
            {phases.map((p, i) => {
              const selected = p.index === activePhase;
              const completed = p.tasks.every((task) => tasksDone[task.id]);
              return (
                <button
                  key={p.index}
                  type="button"
                  className="journey-island"
                  style={{ left: spots[i][0], top: spots[i][1] }}
                  aria-pressed={selected}
                  onClick={() => setActivePhase(p.index)}
                >
                  <span
                    className="journey-island-glow"
                    aria-hidden="true"
                    style={{ opacity: selected ? 1 : 0 }}
                  />
                  <img
                    src={`/illustrations/journey/island-${p.index}.svg`}
                    alt=""
                    width="170"
                    height="130"
                  />
                  {completed && (
                    <CheckCircle2 className="journey-island-done" aria-hidden="true" size={24} />
                  )}
                  <span
                    className="journey-island-tag"
                    style={{ transform: `translateX(-50%) rotate(${rotations[i]}deg)` }}
                  >
                    <strong>{p.name}</strong>
                    <span>
                      {phaseWord} {p.index}
                    </span>
                  </span>
                </button>
              );
            })}
            <div
              className="journey-abbi"
              aria-hidden="true"
              style={{ left: abbi[0] + 50, top: abbi[1] - 64 }}
            >
              <div>
                <img src="/illustrations/journey/abbi.svg" alt="" width="64" height="74" />
                <span className="journey-chip">ABBI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

/* =================== TASK NODE =================== */
function TaskNode({
  task,
  done,
  isCurrent,
  onComplete,
}: {
  task: { id: string; title: string; description: string; xp: number; estimate: string };
  done: boolean;
  isCurrent: boolean;
  onComplete: () => void;
}) {
  const t = useT();
  return (
    <div
      className={`journey-task journey-shadow-wrap ${done ? "is-done" : isCurrent ? "is-current" : ""}`}
    >
      <span className="journey-striped-shadow" aria-hidden="true" />
      <div className="journey-task-face">
        <span className="journey-tape" aria-hidden="true" />
        <div className="relative flex items-start gap-4">
          <span className="journey-task-icon journey-icon" aria-hidden="true">
            <img src="/illustrations/journey/terminal.svg" alt="" width="40" height="40" />
          </span>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="journey-task-title">
                {task.title}
                {done && (
                  <svg
                    className="journey-task-strike"
                    viewBox="0 0 300 20"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 12C50 4 90 16 150 9S250 5 298 10"
                      fill="none"
                      stroke="#d9381e"
                      strokeWidth="4"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                )}
              </h3>
              {isCurrent && (
                <span className="rounded-full border border-primary/30 bg-yellow text-ink px-2 py-0.5 text-sm font-medium uppercase tracking-wider text-primary">
                  {t.roadmapUi.upNext}
                </span>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{task.description}</p>
            <ActivityGuide task={task} />
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {task.xp > 0 && (
                <span className="inline-flex items-center gap-1">
                  <Zap className="h-3 w-3 text-primary" /> {task.xp} XP
                </span>
              )}
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3 w-3" /> {task.estimate}
              </span>
            </div>
          </div>
          {/* Status orb */}
          <button
            onClick={onComplete}
            disabled={done}
            className={`task-complete-button mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all
            ${
              done
                ? "border-accent bg-accent/20 text-accent"
                : isCurrent
                  ? "border-primary/60 bg-primary text-primary hover:border-transparent hover:from-primary hover:to-accent hover:text-primary-foreground"
                  : "border-border bg-background/50 text-muted-foreground"
            }
          `}
            aria-label={done ? t.roadmapUi.completed : t.roadmapUi.markComplete}
          >
            {done ? <CheckCircle2 className="h-5 w-5" /> : <Sparkles className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}

/* =================== HELPERS =================== */
function Pill({ children, icon }: { children: React.ReactNode; icon: React.ReactNode }) {
  return (
    <span className="journey-chip">
      {icon} {children}
    </span>
  );
}

function PhaseProgress({
  phase,
  tasksDone,
}: {
  phase: RoadmapPhase;
  tasksDone: Record<string, boolean>;
}) {
  const t = useT();
  const done = phase.tasks.filter((t) => tasksDone[t.id]).length;
  const pct = (done / phase.tasks.length) * 100;
  return (
    <div className="mt-3">
      <div className="mb-1.5 flex items-center justify-between text-sm text-muted-foreground">
        <span>{t.roadmapUi.progress}</span>
        <span className="tabular-nums">
          {done}/{phase.tasks.length} {t.roadmapUi.tasks}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-secondary/60">
        <div
          className="h-full rounded-full bg-card transition-all duration-700"
          style={{ width: `${pct}%`, boxShadow: "4px 4px 0 var(--ink)" }}
        />
      </div>
    </div>
  );
}

function CelebrationModal({ phaseIndex, onClose }: { phaseIndex: number; onClose: () => void }) {
  const t = useT();
  const dialog = useRef<HTMLDivElement>(null);
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const node = dialog.current;
    node?.querySelector<HTMLButtonElement>("button")?.focus();
    function keydown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close.current();
      }
      if (event.key === "Tab") {
        const buttons = node?.querySelectorAll<HTMLElement>(
          "button, a[href], input, select, textarea, [tabindex='0']",
        );
        if (!buttons?.length) return;
        const first = buttons[0],
          last = buttons[buttons.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener("keydown", keydown);
    return () => {
      document.removeEventListener("keydown", keydown);
      if (previous?.isConnected && !previous.matches(":disabled")) previous.focus();
      else {
        const related = previous?.parentElement?.querySelector<HTMLElement>(
          "summary, a[href], button:not(:disabled)",
        );
        (
          related ?? document.querySelector<HTMLElement>("main a[href], main button:not(:disabled)")
        )?.focus();
      }
    };
  }, []);
  return (
    <div className="roadmap-modal-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div
        ref={dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="roadmap-celebration-title"
        className="roadmap-modal relative w-full max-w-md overflow-hidden rounded-3xl border border-primary/30 bg-card p-8 text-center"
        style={{ boxShadow: "8px 8px 0 var(--ink)" }}
      >
        <GlowBlob className="-right-16 -top-16 h-64 w-64 opacity-60 blur-3xl" alpha={0.5} />
        <div className="relative">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-primary text-primary-foreground shadow-lg">
            <Trophy className="h-8 w-8" />
          </div>
          <h3 id="roadmap-celebration-title" className="mt-4 text-2xl font-bold tracking-tight">
            {t.roadmapUi.celebrationTitle.replace("{i}", String(phaseIndex))}
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">{t.roadmapUi.celebrationBody}</p>
          <button
            onClick={onClose}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:-translate-y-0.5"
            style={{ boxShadow: "4px 4px 0 var(--ink)" }}
          >
            {t.roadmapUi.continueJourney} <Compass className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
