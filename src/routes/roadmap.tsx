import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { ActivityGuide } from "@/components/ActivityGuide";
import { PageShell } from "@/components/PageShell";
import { GlowBlob } from "@/components/GlowBlob";
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
  GraduationCap,
} from "lucide-react";
import {
  buildRoadmap,
  pickTrack,
  TRACK_LABEL,
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
      { property: "og:description", content: "AI-personalized career journey across 5 islands." },
    ],
  }),
  component: RoadmapPage,
});

function RoadmapPage() {
  const t = useT();
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [topCareer, setTopCareer] = useState<string | null>(null);
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
    (async () => {
      const { data } = await supabase
        .from("career_assessment_results")
        .select("career_matches")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      const careers = (data?.career_matches ?? []) as { name: string }[];
      setTopCareer(careers[0]?.name ?? null);
    })();
  }, [user]);

  const track: RoadmapTrack = useMemo(() => pickTrack(topCareer ?? undefined), [topCareer]);
  const phases = useMemo(() => buildRoadmap(track), [track]);

  function handleComplete(p: RoadmapPhase, taskId: string) {
    if (tasksDone[taskId]) return;
    persistTasks({ ...tasksDone, [taskId]: true });
    if (Object.keys(tasksDone).length === 0) analyticsTrack(AnalyticsEvent.FirstTask);

    // Phase completion celebration
    const allDone = p.tasks.every((t) => (t.id === taskId ? true : tasksDone[t.id]));
    if (allDone) setCelebrating(p.index);
  }

  if (loading || !user) {
    return (
      <PageShell>
        <p role="status" className="field-wrap pt-4 text-xs text-muted-foreground">
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
      {/* Ambient backdrop */}
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[700px] overflow-hidden">
        <div
          className="absolute left-1/2 top-[-220px] h-[800px] w-[1200px] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
          style={{
            background: "var(--graph-paper)",
          }}
        />
        <div
          className="absolute -bottom-40 right-[-200px] h-[500px] w-[800px] rounded-full opacity-40 blur-3xl"
          style={{
            background: "var(--graph-paper)",
          }}
        />
      </div>

      <section className="relative px-4 pt-10 pb-24 sm:px-6">
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-6xl">
          {/* Header */}
          <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between animate-fade-up">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary">
                <MapIcon className="h-3 w-3" /> {t.roadmapUi.badge} · {TRACK_LABEL[track]}
              </span>
              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                {t.roadmapUi.titleA} <span className="gradient-text">{t.roadmapUi.titleB}</span>
              </h1>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">{t.roadmapUi.subtitle}</p>
            </div>
            <Link
              to="/universities"
              className="inline-flex items-center gap-2 rounded-2xl border border-primary/30 bg-primary px-4 py-3 -md transition-all hover:-translate-y-0.5"
              style={{ boxShadow: "4px 4px 0 var(--ink)" }}
            >
              <GraduationCap className="h-7 w-7 text-primary" />
              <div className="text-left">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  {t.roadmapUi.findUniversity}
                </div>
                <div className="text-lg font-bold gradient-text">{t.roadmapUi.explore}</div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </header>

          {/* World map */}
          <div className="mt-8">
            <WorldMap
              phases={phases}
              activePhase={activePhase}
              setActivePhase={setActivePhase}
              tasksDone={tasksDone}
            />
          </div>

          {/* Active island panel */}
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_2fr]">
            {/* Phase summary */}
            <div
              className="relative overflow-hidden rounded-3xl border border-border/60 bg-card p-7 "
              style={{ boxShadow: "4px 4px 0 var(--ink)" }}
            >
              <GlowBlob className="-right-16 -top-16 h-48 w-48 opacity-50 blur-3xl" alpha={0.45} />
              <div className="relative">
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
                  <Star className="h-3 w-3 text-accent" /> {t.roadmapUi.island} {active.index}{" "}
                  {t.roadmapUi.of5}
                </div>
                <h2 className="mt-2 text-2xl font-bold tracking-tight">{active.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{active.subtitle}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Pill icon={<Zap className="h-3 w-3" />}>
                    {active.tasks.reduce((s, t) => s + t.xp, 0)} XP
                  </Pill>
                  <Pill icon={<Clock className="h-3 w-3" />}>
                    {active.tasks.length} {t.roadmapUi.tasks}
                  </Pill>
                </div>

                <div className="mt-6 rounded-2xl border border-accent/30 bg-accent/5 p-5">
                  <div className="flex items-center gap-2 text-accent">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-sm font-medium">{t.roadmapUi.yourIsland}</span>
                  </div>
                  <PhaseProgress phase={active} tasksDone={tasksDone} />
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

/* =================== WORLD MAP =================== */
function WorldMap({
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
  // Island positions on a 1000×400 viewBox
  const positions: Record<number, { x: number; y: number }> = {
    1: { x: 110, y: 280 },
    2: { x: 290, y: 180 },
    3: { x: 500, y: 250 },
    4: { x: 720, y: 150 },
    5: { x: 900, y: 240 },
  };

  // Find ABBI position: at current active phase
  const abbiPhase = activePhase;
  const abbiPos = positions[abbiPhase];

  return (
    <div
      className="roadmap-world relative overflow-hidden rounded-3xl border border-border/60 bg-card p-2 sm:p-4"
      style={{ boxShadow: "4px 4px 0 var(--ink)" }}
    >
      {/* sky gradient + stars */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background: "var(--graph-paper)",
          }}
        />
        {[...Array(30)].map((_, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white/40"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 60}%`,
              width: `${1 + (i % 3)}px`,
              height: `${1 + (i % 3)}px`,
              opacity: 0.2 + (i % 5) / 10,
            }}
          />
        ))}
      </div>

      <svg viewBox="0 0 1000 400" className="relative w-full" style={{ aspectRatio: "1000/400" }}>
        {/* Curved travel path */}
        <path
          d="M 110 280 Q 200 180, 290 180 T 500 250 T 720 150 T 900 240"
          fill="none"
          stroke="var(--ink)"
          strokeWidth="3"
          strokeDasharray="2 8"
          strokeLinecap="round"
        />

        {/* Islands */}
        {phases.map((p) => {
          const pos = positions[p.index];
          const completed = p.tasks.every((t) => tasksDone[t.id]);
          const active = activePhase === p.index;
          return (
            <g
              key={p.index}
              transform={`translate(${pos.x}, ${pos.y})`}
              className="cursor-pointer"
              onClick={() => setActivePhase(p.index)}
            >
              {/* Glow when active or completed */}
              {(active || completed) && (
                <circle r={50} fill={completed ? "var(--mint)" : "var(--yellow)"} />
              )}
              {/* Island ellipse */}
              <ellipse
                cx="0"
                cy="6"
                rx="42"
                ry="14"
                fill="var(--mint)"
                stroke="var(--ink)"
                strokeWidth="3"
              />
              <path
                d="M -38 0 Q -30 -22, 0 -25 Q 32 -22, 38 0 Z"
                fill="var(--butter)"
                stroke="var(--ink)"
                strokeWidth="3"
              />
              {/* Peak */}
              <path
                d="M -8 -22 Q 0 -38, 8 -22 Z"
                fill="var(--pink)"
                stroke="var(--ink)"
                strokeWidth="3"
              />

              {/* Check for completed */}
              {completed && (
                <g transform="translate(0,-8)">
                  <circle r="10" fill="var(--mint-solid)" />
                  <path
                    d="M -4 0 L -1 3 L 5 -3"
                    stroke="var(--illustration-ink)"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              )}

              {/* Label */}
              <text
                x="0"
                y="40"
                textAnchor="middle"
                className="select-none"
                fontSize="13"
                fontWeight="600"
                fill="var(--foreground)"
              >
                {p.name}
              </text>
              <text x="0" y="56" textAnchor="middle" fontSize="10" fill="var(--foreground)">
                {phaseWord} {p.index}
              </text>
            </g>
          );
        })}

        {/* ABBI companion */}
        <g
          transform={`translate(${abbiPos.x}, ${abbiPos.y - 50})`}
          style={{ transition: "transform 600ms cubic-bezier(0.16,1,0.3,1)" }}
        >
          <circle r="14" fill="var(--illustration-ink)" />
          <circle r="9" fill="var(--yellow)" />
          <circle r="9" fill="var(--yellow)" />
          {/* eyes */}
          <circle cx="-2.5" cy="-1" r="1.3" fill="var(--illustration-ink)" />
          <circle cx="2.5" cy="-1" r="1.3" fill="var(--illustration-ink)" />
          {/* smile */}
          <path
            d="M -2.5 2.5 Q 0 4, 2.5 2.5"
            stroke="var(--illustration-ink)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
          />
          <text
            x="0"
            y="-18"
            textAnchor="middle"
            fontSize="12"
            fontWeight="800"
            fill="var(--foreground)"
          >
            ABBI
          </text>
        </g>
      </svg>
    </div>
  );
}

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
      className={`group relative overflow-hidden rounded-2xl border p-5  transition-all
        ${
          done
            ? "border-accent/40 bg-accent/5"
            : isCurrent
              ? "border-primary/40 bg-card"
              : "border-border/60 bg-secondary/20"
        }
      `}
      style={done ? { boxShadow: "4px 4px 0 var(--ink)" } : undefined}
    >
      {isCurrent && (
        <GlowBlob className="-right-16 -top-16 h-40 w-40 opacity-60 blur-3xl" alpha={0.4} />
      )}
      <div className="relative flex items-start gap-4">
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

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={`text-sm font-semibold ${done ? "line-through text-muted-foreground" : ""}`}
            >
              {task.title}
            </h3>
            {isCurrent && (
              <span className="rounded-full border border-primary/30 bg-yellow text-ink px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary">
                {t.roadmapUi.upNext}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{task.description}</p>
          <ActivityGuide task={task} />
          <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Zap className="h-3 w-3 text-primary" /> {task.xp} XP
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3 w-3" /> {task.estimate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =================== HELPERS =================== */
function Pill({ children, icon }: { children: React.ReactNode; icon: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-white text-ink px-3 py-1 text-[11px] font-medium">
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
      <div className="mb-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
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
      if (previous?.isConnected) previous.focus();
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
