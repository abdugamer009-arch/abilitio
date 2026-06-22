import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { GlowBlob } from "@/components/GlowBlob";
import { useAuth } from "@/lib/auth-context";
import { useAura } from "@/components/aura/AuraProvider";
import { AuraCoin } from "@/components/aura/AuraCoin";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Lock, Sparkles, CheckCircle2, Clock, Zap, Star, Trophy,
  ChevronRight, Compass, Map as MapIcon, Cloud,
} from "lucide-react";
import { awardAura, type WalletDTO } from "@/lib/aura.functions";
import { buildRoadmap, pickTrack, TRACK_LABEL, type RoadmapPhase, type RoadmapTrack } from "@/lib/roadmap-world";

export const Route = createFileRoute("/roadmap")({
  head: () => ({
    meta: [
      { title: "Roadmap World — Your Premium Career Journey | Abilitio" },
      { name: "description", content: "Travel through 5 islands of personalized growth. Unlock phases with Aura Coins, complete tasks, and follow ABBI from Foundations to Mastery." },
      { property: "og:title", content: "Roadmap World — Abilitio" },
      { property: "og:description", content: "Premium AI-personalized career journey across 5 islands." },
    ],
  }),
  component: RoadmapPage,
});

const QK_UNLOCKS = ["aura", "unlocks"] as const;

function RoadmapPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { wallet, unlock, pushLocalReward } = useAura();
  const awardFn = useServerFn(awardAura);
  const queryClient = useQueryClient();

  const [topCareer, setTopCareer] = useState<string | null>(null);
  const [activePhase, setActivePhase] = useState<RoadmapPhase["index"]>(1);
  const [tasksDone, setTasksDone] = useState<Record<string, boolean>>({});
  const [celebrating, setCelebrating] = useState<number | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth", search: { mode: "login", next: "/roadmap" } });
  }, [loading, user, navigate]);

  // Load top career to personalize the track
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("assessment_results")
        .select("careers")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      const careers = (data?.careers ?? []) as { name: string }[];
      setTopCareer(careers[0]?.name ?? null);
    })();
  }, [user]);

  // Load unlocked phases
  const unlocksQ = useQuery({
    queryKey: QK_UNLOCKS,
    enabled: !!user,
    queryFn: async () => {
      if (!user) return [] as string[];
      const { data } = await supabase
        .from("aura_unlocks").select("feature_key").eq("user_id", user.id);
      return ((data ?? []) as { feature_key: string }[]).map((r) => r.feature_key);
    },
  });
  const unlockedKeys = new Set(unlocksQ.data ?? []);

  // Per-user task completion (localStorage v1)
  useEffect(() => {
    if (!user || typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(`roadmap_tasks_${user.id}`);
      setTasksDone(raw ? JSON.parse(raw) : {});
    } catch { setTasksDone({}); }
  }, [user]);

  function persistTasks(next: Record<string, boolean>) {
    setTasksDone(next);
    if (!user || typeof window === "undefined") return;
    localStorage.setItem(`roadmap_tasks_${user.id}`, JSON.stringify(next));
  }

  const track: RoadmapTrack = useMemo(() => pickTrack(topCareer ?? undefined), [topCareer]);
  const phases = useMemo(() => buildRoadmap(track), [track]);

  async function handleUnlock(p: RoadmapPhase) {
    if (!wallet || wallet.balance < p.price) {
      pushLocalReward({ amount: 0, label: `Need ${p.price} Aura to unlock ${p.name}` });
      return;
    }
    const res = await unlock(p.key, p.price);
    if (res.ok) {
      queryClient.invalidateQueries({ queryKey: QK_UNLOCKS });
      pushLocalReward({ amount: -p.price, label: `Unlocked ${p.name}`, bonus: true });
    } else if (res.reason === "insufficient_balance") {
      pushLocalReward({ amount: 0, label: "Not enough Aura — visit the Market" });
    }
  }

  async function handleComplete(p: RoadmapPhase, taskId: string) {
    if (tasksDone[taskId]) return;
    persistTasks({ ...tasksDone, [taskId]: true });

    // Award roadmap step coins (server-validated reason key)
    try {
      const res = await awardFn({ data: { reasonKey: "roadmap_step" } });
      queryClient.setQueryData(["aura", "wallet"], res.wallet as WalletDTO);
    } catch (e) {
      console.error("awardAura failed", e);
    }

    // Phase completion celebration
    const allDone = p.tasks.every((t) => (t.id === taskId ? true : tasksDone[t.id]));
    if (allDone) setCelebrating(p.index);
  }

  if (loading || !user) {
    return (
      <PageShell>
        <div className="px-6 pt-32 text-center text-sm text-muted-foreground">Loading your world…</div>
      </PageShell>
    );
  }

  const active = phases.find((p) => p.index === activePhase)!;
  const activeUnlocked = unlockedKeys.has(active.key);
  const balance = wallet?.balance ?? 0;

  return (
    <PageShell>
      {/* Ambient backdrop */}
      <div className="pointer-events-none fixed inset-x-0 top-0 -z-10 h-[700px] overflow-hidden">
        <div
          className="absolute left-1/2 top-[-220px] h-[800px] w-[1200px] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
          style={{ background: "radial-gradient(ellipse, oklch(0.55 0.22 295 / 0.35), transparent 60%)" }}
        />
        <div
          className="absolute -bottom-40 right-[-200px] h-[500px] w-[800px] rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, oklch(0.70 0.18 320 / 0.4), transparent 70%)" }}
        />
      </div>

      <section className="relative px-4 pt-10 pb-24 sm:px-6">
        <div aria-hidden className="bg-grid pointer-events-none absolute inset-0" />
        <div className="relative mx-auto max-w-6xl">
          {/* Header */}
          <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between animate-fade-up">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary">
                <MapIcon className="h-3 w-3" /> Roadmap World · {TRACK_LABEL[track]}
              </span>
              <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Your <span className="gradient-text">Career Journey</span>
              </h1>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                Travel from <strong>Foundations</strong> to <strong>Mastery</strong> across five islands.
                Follow ABBI, complete tasks, earn XP and Aura, and unlock your future.
              </p>
            </div>
            <Link
              to="/aura-market"
              className="inline-flex items-center gap-2 rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 to-accent/10 px-4 py-3 backdrop-blur-md transition-all hover:-translate-y-0.5"
              style={{ boxShadow: "0 10px 30px -10px oklch(0.55 0.22 295 / 0.4)" }}
            >
              <AuraCoin size={28} />
              <div className="text-left">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Your Aura</div>
                <div className="text-lg font-bold tabular-nums gradient-text">{balance.toLocaleString()}</div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Link>
          </header>

          {/* World map */}
          <div className="mt-8">
            <WorldMap
              phases={phases}
              unlockedKeys={unlockedKeys}
              activePhase={activePhase}
              setActivePhase={setActivePhase}
              tasksDone={tasksDone}
            />
          </div>

          {/* Active island panel */}
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_2fr]">
            {/* Phase summary */}
            <div
              className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-secondary/40 via-background/60 to-background/40 p-7 backdrop-blur-xl"
              style={{ boxShadow: "0 20px 60px -20px oklch(0.55 0.22 295 / 0.35)" }}
            >
              <GlowBlob className="-right-16 -top-16 h-48 w-48 opacity-50 blur-3xl" alpha={0.45} />
              <div className="relative">
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-muted-foreground">
                  <Star className="h-3 w-3 text-accent" /> Island {active.index} of 5
                </div>
                <h2 className="mt-2 text-2xl font-bold tracking-tight">{active.name}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{active.subtitle}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <Pill icon={<Zap className="h-3 w-3" />}>
                    {active.tasks.reduce((s, t) => s + t.xp, 0)} XP
                  </Pill>
                  <Pill icon={<AuraCoin size={12} />}>
                    {active.tasks.reduce((s, t) => s + t.coins, 0)} Aura
                  </Pill>
                  <Pill icon={<Clock className="h-3 w-3" />}>{active.tasks.length} tasks</Pill>
                </div>

                {!activeUnlocked ? (
                  <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-5">
                    <div className="flex items-center gap-2 text-primary">
                      <Lock className="h-4 w-4" />
                      <span className="text-sm font-medium">Locked Island</span>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Unlock this phase to reveal personalized tasks and let ABBI guide you forward.
                    </p>
                    <button
                      onClick={() => handleUnlock(active)}
                      disabled={balance < active.price}
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-br from-primary to-accent px-5 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                      style={{ boxShadow: "0 10px 28px -10px oklch(0.55 0.22 295 / 0.6)" }}
                    >
                      <AuraCoin size={16} /> Unlock for {active.price} Aura
                    </button>
                    {balance < active.price && (
                      <Link to="/aura-market" className="mt-3 block text-center text-[11px] text-primary hover:underline">
                        Need {active.price - balance} more → Get Aura
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="mt-6 rounded-2xl border border-accent/30 bg-accent/5 p-5">
                    <div className="flex items-center gap-2 text-accent">
                      <CheckCircle2 className="h-4 w-4" />
                      <span className="text-sm font-medium">Island Unlocked</span>
                    </div>
                    <PhaseProgress phase={active} tasksDone={tasksDone} />
                  </div>
                )}
              </div>
            </div>

            {/* Task list */}
            <div className="relative">
              {!activeUnlocked && <LockedFog />}
              <div
                className={`relative space-y-3 transition-all ${!activeUnlocked ? "blur-sm" : ""}`}
              >
                {active.tasks.map((task, idx) => {
                  const done = !!tasksDone[task.id];
                  const isCurrent = activeUnlocked && !done &&
                    active.tasks.slice(0, idx).every((t) => tasksDone[t.id]);
                  return (
                    <TaskNode
                      key={task.id}
                      task={task}
                      done={done}
                      isCurrent={isCurrent}
                      onComplete={() => activeUnlocked && handleComplete(active, task.id)}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Phase celebration */}
          {celebrating != null && (
            <CelebrationModal
              phaseIndex={celebrating}
              onClose={() => setCelebrating(null)}
            />
          )}
        </div>
      </section>
    </PageShell>
  );
}

/* =================== WORLD MAP =================== */
function WorldMap({
  phases, unlockedKeys, activePhase, setActivePhase, tasksDone,
}: {
  phases: RoadmapPhase[];
  unlockedKeys: Set<string>;
  activePhase: number;
  setActivePhase: (i: RoadmapPhase["index"]) => void;
  tasksDone: Record<string, boolean>;
}) {
  // Island positions on a 1000×400 viewBox
  const positions: Record<number, { x: number; y: number }> = {
    1: { x: 110, y: 280 },
    2: { x: 290, y: 180 },
    3: { x: 500, y: 250 },
    4: { x: 720, y: 150 },
    5: { x: 900, y: 240 },
  };

  // Find ABBI position: at current active phase (or first incomplete in unlocked)
  const abbiPhase = activePhase;
  const abbiPos = positions[abbiPhase];

  return (
    <div
      className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-b from-secondary/30 via-background/50 to-background/30 p-2 backdrop-blur-xl sm:p-4"
      style={{ boxShadow: "0 30px 80px -30px oklch(0.55 0.22 295 / 0.45)" }}
    >
      {/* sky gradient + stars */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.35 0.12 295 / 0.25) 0%, transparent 60%)",
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
              opacity: 0.2 + ((i % 5) / 10),
            }}
          />
        ))}
      </div>

      <svg viewBox="0 0 1000 400" className="relative w-full" style={{ aspectRatio: "1000/400" }}>
        <defs>
          <linearGradient id="pathGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="oklch(0.65 0.22 295)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="oklch(0.70 0.18 320)" stopOpacity="0.7" />
          </linearGradient>
          <radialGradient id="islandFill" cx="50%" cy="40%">
            <stop offset="0%" stopColor="oklch(0.55 0.18 295)" />
            <stop offset="100%" stopColor="oklch(0.28 0.10 290)" />
          </radialGradient>
          <radialGradient id="islandLocked" cx="50%" cy="40%">
            <stop offset="0%" stopColor="oklch(0.35 0.05 290)" />
            <stop offset="100%" stopColor="oklch(0.20 0.04 285)" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Curved travel path */}
        <path
          d="M 110 280 Q 200 180, 290 180 T 500 250 T 720 150 T 900 240"
          fill="none"
          stroke="url(#pathGrad)"
          strokeWidth="3"
          strokeDasharray="2 8"
          strokeLinecap="round"
        />

        {/* Islands */}
        {phases.map((p) => {
          const pos = positions[p.index];
          const unlocked = unlockedKeys.has(p.key);
          const completed = unlocked && p.tasks.every((t) => tasksDone[t.id]);
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
                <circle
                  r={50}
                  fill={completed ? "oklch(0.75 0.18 150 / 0.25)" : "oklch(0.65 0.24 295 / 0.3)"}
                  filter="url(#glow)"
                />
              )}
              {/* Island ellipse */}
              <ellipse
                cx="0" cy="6" rx="42" ry="14"
                fill="oklch(0.20 0.04 285 / 0.6)"
              />
              <path
                d="M -38 0 Q -30 -22, 0 -25 Q 32 -22, 38 0 Z"
                fill={unlocked ? "url(#islandFill)" : "url(#islandLocked)"}
                stroke={active ? "oklch(0.75 0.20 295)" : "oklch(0.45 0.10 295 / 0.5)"}
                strokeWidth={active ? 2 : 1}
              />
              {/* Peak */}
              <path d="M -8 -22 Q 0 -38, 8 -22 Z" fill={unlocked ? "oklch(0.70 0.16 295)" : "oklch(0.35 0.05 290)"} />

              {/* Lock icon for locked, check for completed */}
              {!unlocked && (
                <g transform="translate(0,-8)">
                  <circle r="9" fill="oklch(0.18 0.03 285 / 0.85)" stroke="oklch(0.55 0.10 295)" strokeWidth="1" />
                  <path d="M -2.5 -1 L -2.5 -3 A 2.5 2.5 0 0 1 2.5 -3 L 2.5 -1 M -3.5 -1 L 3.5 -1 L 3.5 4 L -3.5 4 Z" fill="oklch(0.75 0.10 295)" stroke="none" />
                </g>
              )}
              {completed && (
                <g transform="translate(0,-8)">
                  <circle r="10" fill="oklch(0.55 0.18 150)" />
                  <path d="M -4 0 L -1 3 L 5 -3" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              )}

              {/* Label */}
              <text
                x="0" y="40"
                textAnchor="middle"
                className="select-none"
                fontSize="13"
                fontWeight="600"
                fill={active ? "oklch(0.92 0.02 295)" : "oklch(0.75 0.04 295)"}
              >
                {p.name}
              </text>
              <text
                x="0" y="56"
                textAnchor="middle"
                fontSize="10"
                fill="oklch(0.65 0.04 295)"
              >
                Phase {p.index}
              </text>

              {/* Fog overlay for locked future islands */}
              {!unlocked && (
                <g opacity="0.45" className="pointer-events-none">
                  <ellipse cx="-8" cy="-6" rx="28" ry="14" fill="oklch(0.85 0.02 295 / 0.5)" />
                  <ellipse cx="14" cy="-2" rx="22" ry="10" fill="oklch(0.85 0.02 295 / 0.4)" />
                </g>
              )}
            </g>
          );
        })}

        {/* ABBI companion */}
        <g transform={`translate(${abbiPos.x}, ${abbiPos.y - 50})`} style={{ transition: "transform 600ms cubic-bezier(0.16,1,0.3,1)" }}>
          <circle r="14" fill="oklch(0.65 0.24 295 / 0.35)" filter="url(#glow)" />
          <circle r="9" fill="oklch(0.75 0.20 295)" />
          <circle r="9" fill="url(#pathGrad)" />
          {/* eyes */}
          <circle cx="-2.5" cy="-1" r="1.3" fill="white" />
          <circle cx="2.5" cy="-1" r="1.3" fill="white" />
          {/* smile */}
          <path d="M -2.5 2.5 Q 0 4, 2.5 2.5" stroke="white" strokeWidth="0.8" fill="none" strokeLinecap="round" />
          <text x="0" y="-18" textAnchor="middle" fontSize="9" fontWeight="600" fill="oklch(0.85 0.04 295)">
            ABBI
          </text>
        </g>
      </svg>
    </div>
  );
}

/* =================== TASK NODE =================== */
function TaskNode({
  task, done, isCurrent, onComplete,
}: {
  task: { id: string; title: string; description: string; xp: number; coins: number; estimate: string };
  done: boolean;
  isCurrent: boolean;
  onComplete: () => void;
}) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border p-5 backdrop-blur-xl transition-all
        ${done
          ? "border-accent/40 bg-accent/5"
          : isCurrent
          ? "border-primary/40 bg-gradient-to-br from-primary/10 via-secondary/30 to-background/40"
          : "border-border/60 bg-secondary/20"}
      `}
      style={done ? { boxShadow: "0 0 30px -10px oklch(0.75 0.18 150 / 0.4)" } : undefined}
    >
      {isCurrent && (
        <GlowBlob className="-right-16 -top-16 h-40 w-40 opacity-60 blur-3xl" alpha={0.4} />
      )}
      <div className="relative flex items-start gap-4">
        {/* Status orb */}
        <button
          onClick={onComplete}
          disabled={done}
          className={`mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all
            ${done
              ? "border-accent bg-accent/20 text-accent"
              : isCurrent
              ? "border-primary/60 bg-gradient-to-br from-primary/15 to-accent/10 text-primary hover:border-transparent hover:from-primary hover:to-accent hover:text-primary-foreground hover:shadow-[0_0_16px_-4px_var(--glow)]"
              : "border-border bg-background/50 text-muted-foreground"}
          `}
          aria-label={done ? "Completed" : "Mark complete"}
        >
          {done ? <CheckCircle2 className="h-5 w-5" /> : <Sparkles className="h-4 w-4" />}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className={`text-sm font-semibold ${done ? "line-through text-muted-foreground" : ""}`}>
              {task.title}
            </h3>
            {isCurrent && (
              <span className="rounded-full border border-primary/30 bg-gradient-to-r from-primary/15 to-accent/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-primary shadow-[0_0_8px_-2px_var(--glow)]">
                Up next · ABBI is here
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{task.description}</p>
          <div className="mt-3 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
            <span className="inline-flex items-center gap-1"><Zap className="h-3 w-3 text-primary" /> {task.xp} XP</span>
            <span className="inline-flex items-center gap-1"><AuraCoin size={12} /> {task.coins} Aura</span>
            <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {task.estimate}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =================== HELPERS =================== */
function Pill({ children, icon }: { children: React.ReactNode; icon: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-gradient-to-r from-primary/10 to-accent/5 px-3 py-1 text-[11px] font-medium">
      {icon} {children}
    </span>
  );
}

function PhaseProgress({ phase, tasksDone }: { phase: RoadmapPhase; tasksDone: Record<string, boolean> }) {
  const done = phase.tasks.filter((t) => tasksDone[t.id]).length;
  const pct = (done / phase.tasks.length) * 100;
  return (
    <div className="mt-3">
      <div className="mb-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>Progress</span>
        <span className="tabular-nums">{done}/{phase.tasks.length} tasks</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-secondary/60">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary via-accent to-primary transition-all duration-700"
          style={{ width: `${pct}%`, boxShadow: "0 0 12px oklch(0.65 0.22 295 / 0.6)" }}
        />
      </div>
    </div>
  );
}

function LockedFog() {
  return (
    <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center rounded-2xl">
      <div className="rounded-full border border-primary/30 bg-background/60 px-5 py-2 text-xs font-medium backdrop-blur-md">
        <Cloud className="mr-2 inline h-3.5 w-3.5 text-primary" />
        Hidden in mist — unlock this island to reveal your tasks
      </div>
    </div>
  );
}

function CelebrationModal({ phaseIndex, onClose }: { phaseIndex: number; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
      <div
        className="relative w-full max-w-md overflow-hidden rounded-3xl border border-primary/30 bg-gradient-to-br from-secondary/80 via-background to-background/80 p-8 text-center backdrop-blur-xl"
        style={{ boxShadow: "0 30px 80px -20px oklch(0.55 0.22 295 / 0.6)" }}
      >
        <GlowBlob className="-right-16 -top-16 h-64 w-64 opacity-60 blur-3xl" alpha={0.5} />
        <div className="relative">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-lg">
            <Trophy className="h-8 w-8" />
          </div>
          <h3 className="mt-4 text-2xl font-bold tracking-tight">Island {phaseIndex} Complete!</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            ABBI is proud. You've earned a new badge and the next island is yours to explore.
          </p>
          <button
            onClick={onClose}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-primary to-accent px-6 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:-translate-y-0.5"
            style={{ boxShadow: "0 10px 28px -10px oklch(0.55 0.22 295 / 0.6)" }}
          >
            Continue your journey <Compass className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
