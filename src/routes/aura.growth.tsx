import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { PageShell } from "@/components/PageShell";
import { AuraCoin } from "@/components/aura/AuraCoin";
import { useAura } from "@/components/aura/AuraProvider";
import { useAuth } from "@/lib/auth-context";
import { ACHIEVEMENTS, SKILL_NODES, currentMilestone } from "@/lib/aura-growth";
import {
  evaluateAchievements,
  getMyAchievements,
  getMyGrowthState,
} from "@/lib/aura-growth.functions";
import { Flame, Lock, Check, ArrowRight } from "lucide-react";
import { SpotlightCard } from "@/components/SpotlightCard";
import { toast } from "sonner";

export const Route = createFileRoute("/aura/growth")({
  head: () => ({
    meta: [
      { title: "Growth — Abilitio" },
      {
        name: "description",
        content: "Track your Aura skill tree, achievements, streaks, and milestones across Abilitio.",
      },
    ],
  }),
  component: AuraGrowthPage,
});

const QK_ACH = ["aura", "achievements"] as const;
const QK_STATE = ["aura", "growth-state"] as const;

function AuraGrowthPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { pushLocalReward } = useAura();
  const getAchFn = useServerFn(getMyAchievements);
  const getStateFn = useServerFn(getMyGrowthState);
  const evaluateFn = useServerFn(evaluateAchievements);

  const achQ = useQuery({ queryKey: QK_ACH, queryFn: () => getAchFn(), enabled: !!user });
  const stateQ = useQuery({ queryKey: QK_STATE, queryFn: () => getStateFn(), enabled: !!user });

  // Auto-evaluate on visit
  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await evaluateFn();
        if (cancelled) return;
        if (res.newlyUnlocked.length > 0) {
          for (const u of res.newlyUnlocked) {
            const meta = ACHIEVEMENTS.find((a) => a.key === u.key);
            pushLocalReward({
              amount: u.reward,
              label: meta ? `🏆 ${meta.name}` : `Achievement unlocked`,
              bonus: true,
            });
          }
          if (res.totalReward > 0) {
            toast.success(`${res.newlyUnlocked.length} achievement${res.newlyUnlocked.length === 1 ? "" : "s"} unlocked`, {
              description: `+${res.totalReward} Aura Coins awarded`,
            });
          }
          queryClient.invalidateQueries({ queryKey: QK_ACH });
          queryClient.invalidateQueries({ queryKey: QK_STATE });
          queryClient.invalidateQueries({ queryKey: ["aura", "wallet"] });
        }
      } catch (e) {
        console.error("evaluateAchievements failed", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, evaluateFn, queryClient, pushLocalReward]);

  const state = stateQ.data;
  const ownedAch = new Set((achQ.data ?? []).map((a) => a.achievement_key));
  const lifetimeEarned = state?.lifetimeEarned ?? 0;
  const streakDays = state?.streakDays ?? 0;
  const milestone = currentMilestone(lifetimeEarned);

  return (
    <PageShell>
      <section className="px-6 pt-12 pb-24">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="flex flex-col items-center text-center animate-fade-up">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary">
              <Flame className="h-3 w-3" /> Aura Growth
            </span>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
              <span className="gradient-text">Your Aura Path</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground">
              Every step of your growth shapes a unique constellation. Build streaks, complete assessments, unlock
              insights — and watch your Aura evolve.
            </p>
          </div>

          {/* Milestone hero */}
          {user && (
            <div className="mt-12 glass relative overflow-hidden rounded-3xl p-8 md:p-10">
              <div
                className="absolute inset-0 opacity-60"
                style={{
                  background:
                    "radial-gradient(60% 60% at 50% 0%, oklch(0.65 0.20 295 / 0.25), transparent 70%)",
                }}
              />
              <div className="relative grid gap-6 md:grid-cols-[auto,1fr] md:items-center">
                <div className="relative mx-auto flex h-28 w-28 items-center justify-center">
                  <span
                    className="pointer-events-none absolute inset-0 rounded-full opacity-80 blur-2xl animate-pulse-glow"
                    style={{ background: "radial-gradient(circle, oklch(0.65 0.20 295 / 0.6), transparent 70%)" }}
                  />
                  <AuraCoin size={96} />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Current rank</p>
                  <h2 className="mt-1 text-3xl font-semibold tracking-tight">
                    <span className="gradient-text">{milestone.current.name}</span>
                  </h2>
                  <p className="mt-1 text-xs text-muted-foreground">{milestone.current.aura}</p>
                  {milestone.next ? (
                    <>
                      <div className="mt-5 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          {lifetimeEarned.toLocaleString()} / {milestone.next.threshold.toLocaleString()} XP
                        </span>
                        <span className="text-muted-foreground">
                          Next: <span className="text-foreground">{milestone.next.name}</span>
                        </span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted/40">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary via-fuchsia-400 to-primary transition-all"
                          style={{ width: `${milestone.progress * 100}%`, boxShadow: "0 0 10px oklch(0.65 0.22 295 / 0.5)" }}
                        />
                      </div>
                    </>
                  ) : (
                    <p className="mt-5 text-xs text-primary">Maximum rank reached. You're radiant.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Skill tree */}
          {user && state && (
            <div className="mt-16">
              <h2 className="mb-1 flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                <span className="h-px w-6 rounded-full bg-gradient-to-r from-transparent via-primary to-accent opacity-70" />
                Skill tree
                <span className="h-px flex-1 rounded-full bg-gradient-to-r from-accent/30 to-transparent opacity-40" />
              </h2>
              <p className="mt-1 text-lg font-medium">Five paths of growth</p>
              <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {SKILL_NODES.map((node) => {
                  const xp = node.derive(state);
                  const pct = Math.min(1, xp / node.xpToMaster);
                  const mastered = pct >= 1;
                  const Icon = node.icon;
                  return (
                    <SpotlightCard
                      key={node.key}
                      className="glass relative overflow-hidden rounded-3xl p-6 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover-glow"
                    >
                      {mastered && (
                        <div
                          className="absolute inset-0 opacity-50"
                          style={{
                            background:
                              "radial-gradient(60% 60% at 50% 0%, oklch(0.7 0.22 295 / 0.25), transparent 70%)",
                          }}
                        />
                      )}
                      <div className="relative flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-all ${
                              mastered ? "bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_4px_16px_-6px_var(--glow)]" : "bg-muted/30 text-muted-foreground"
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="text-base font-semibold tracking-tight">{node.name}</h3>
                            <p className="text-xs text-muted-foreground">{node.tagline}</p>
                          </div>
                        </div>
                        {mastered && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2 py-0.5 text-[10px] uppercase tracking-wider text-primary">
                            <Check className="h-3 w-3" /> Mastered
                          </span>
                        )}
                      </div>
                      <div className="relative mt-5 flex items-center justify-between text-xs">
                        <span className="tabular-nums text-muted-foreground">
                          {Math.min(xp, node.xpToMaster).toLocaleString()} / {node.xpToMaster.toLocaleString()} XP
                        </span>
                        <span className="tabular-nums text-foreground">{Math.round(pct * 100)}%</span>
                      </div>
                      <div className="relative mt-2 h-1.5 overflow-hidden rounded-full bg-muted/40">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-fuchsia-400 transition-all"
                          style={{ width: `${pct * 100}%`, boxShadow: "0 0 8px oklch(0.65 0.22 295 / 0.4)" }}
                        />
                      </div>
                    </SpotlightCard>
                  );
                })}
              </div>
            </div>
          )}

          {/* Streak ladder */}
          {user && (
            <div className="mt-16">
              <h2 className="flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">
                <span className="h-px w-6 rounded-full bg-gradient-to-r from-transparent via-primary to-accent opacity-70" />
                Streak
                <span className="h-px flex-1 rounded-full bg-gradient-to-r from-accent/30 to-transparent opacity-40" />
              </h2>
              <div className="mt-4 glass rounded-3xl p-6 md:p-8">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_6px_24px_-8px_var(--glow)]">
                    <Flame className="h-7 w-7" />
                  </div>
                  <div>
                    <div className="text-3xl font-semibold tabular-nums gradient-text">
                      {streakDays} day{streakDays === 1 ? "" : "s"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {streakDays >= 7
                        ? `Next bonus in ${7 - (streakDays % 7 || 7)} day${(7 - (streakDays % 7 || 7)) === 1 ? "" : "s"}`
                        : `${7 - streakDays} day${7 - streakDays === 1 ? "" : "s"} to your first 7-day bonus`}
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-1.5">
                  {Array.from({ length: 14 }).map((_, i) => {
                    const filled = i < streakDays;
                    const milestone = (i + 1) % 7 === 0;
                    return (
                      <div
                        key={i}
                        className={`h-8 flex-1 min-w-[24px] rounded-md transition-all ${
                          filled
                            ? milestone
                              ? "bg-gradient-to-b from-primary to-fuchsia-400 shadow-[0_0_12px_oklch(0.65_0.2_295/0.6)]"
                              : "bg-primary/70"
                            : "bg-muted/40"
                        }`}
                        title={`Day ${i + 1}`}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Achievements */}
          <div className="mt-16">
            <h2 className="flex items-center gap-3 text-xs uppercase tracking-[0.22em] text-muted-foreground">
              <span className="h-px w-6 rounded-full bg-gradient-to-r from-transparent via-primary to-accent opacity-70" />
              Achievements
              <span className="h-px flex-1 rounded-full bg-gradient-to-r from-accent/30 to-transparent opacity-40" />
            </h2>
            <p className="mt-1 text-lg font-medium">
              {user ? `${ownedAch.size} / ${ACHIEVEMENTS.length} unlocked` : `${ACHIEVEMENTS.length} to earn`}
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {ACHIEVEMENTS.map((a) => {
                const owned = ownedAch.has(a.key);
                const Icon = a.icon;
                return (
                  <SpotlightCard
                    key={a.key}
                    className={`glass rounded-2xl p-5 transition-all ${owned ? "hover:-translate-y-0.5 hover:border-primary/30 hover-glow" : "opacity-60"}`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
                          owned ? "bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_4px_14px_-6px_var(--glow)]" : "bg-muted/30 text-muted-foreground"
                        }`}
                      >
                        {owned ? <Icon className="h-5 w-5" /> : <Lock className="h-4 w-4" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-sm font-semibold">{a.name}</h3>
                          <span className="inline-flex items-center gap-1 text-xs gradient-text tabular-nums">
                            <AuraCoin size={12} animated={false} /> +{a.reward}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-muted-foreground">{a.description}</p>
                      </div>
                    </div>
                  </SpotlightCard>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 flex flex-col items-center gap-3 text-center">
            {user ? (
              <Link
                to="/aura/store"
                className="cta-sheen relative overflow-hidden inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-accent px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-[0_6px_20px_-6px_var(--glow)] hover:-translate-y-0.5 transition-all"
              >
                Spend in the Aura Store <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <Link
                to="/auth"
                search={{ mode: "login" }}
                className="cta-sheen relative overflow-hidden inline-flex rounded-full bg-gradient-to-r from-primary to-accent px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-[0_6px_20px_-6px_var(--glow)] hover:-translate-y-0.5 transition-all"
              >
                Sign in to start your path
              </Link>
            )}
            <Link to="/aura" className="text-xs text-muted-foreground hover:text-foreground">
              ← Back to Aura
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
