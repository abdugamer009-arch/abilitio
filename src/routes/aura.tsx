import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { PageShell } from "@/components/PageShell";
import { AuraCoin } from "@/components/aura/AuraCoin";
import { useAura } from "@/components/aura/AuraProvider";
import { useAuth } from "@/lib/auth-context";
import { Flame, Sparkles, TrendingUp, ArrowRight, Check } from "lucide-react";
import { getMyUnlocks } from "@/lib/aura-store.functions";
import { AURA_FEATURES } from "@/lib/aura-catalog";

export const Route = createFileRoute("/aura")({
  head: () => ({
    meta: [
      { title: "Aura Coins — Abilitio" },
      { name: "description", content: "Your premium Aura Coin balance, streak, and unlocks inside Abilitio." },
    ],
  }),
  component: AuraPage,
});

function AuraPage() {
  const { user } = useAuth();
  const { wallet, isLoading } = useAura();
  const getUnlocksFn = useServerFn(getMyUnlocks);
  const unlocksQ = useQuery({
    queryKey: ["aura", "unlocks"],
    queryFn: () => getUnlocksFn(),
    enabled: !!user,
  });
  const ownedKeys = new Set((unlocksQ.data ?? []).map((u) => u.feature_key));
  const ownedFeatures = AURA_FEATURES.filter((f) => ownedKeys.has(f.key));

  return (
    <PageShell>
      <section className="px-6 pt-12 pb-24">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <div className="relative flex h-24 w-24 items-center justify-center">
              <span
                className="pointer-events-none absolute inset-0 rounded-full opacity-70 blur-2xl animate-pulse-glow"
                style={{ background: "radial-gradient(circle, oklch(0.65 0.20 295 / 0.55), transparent 70%)" }}
              />
              <AuraCoin size={84} />
            </div>
            <p className="mt-6 text-xs uppercase tracking-[0.22em] text-muted-foreground">Aura Coins</p>
            <h1 className="mt-3 text-5xl font-semibold tracking-tight md:text-6xl">
              {user ? (
                <span className="gradient-text tabular-nums">{(wallet?.balance ?? 0).toLocaleString()}</span>
              ) : (
                <span className="gradient-text">Sign in</span>
              )}
            </h1>
            <p className="mt-3 max-w-md text-sm text-muted-foreground">
              Earn Aura Coins as you grow. Spend them to unlock advanced personalized insights inside Abilitio.
            </p>
          </div>

          {/* Stat strip */}
          {user && (
            <div className="mt-12 grid gap-4 md:grid-cols-3">
              <StatCard
                icon={<Sparkles className="h-4 w-4" />}
                label="Lifetime earned"
                value={(wallet?.lifetime_earned ?? 0).toLocaleString()}
              />
              <StatCard
                icon={<Flame className="h-4 w-4" />}
                label="Login streak"
                value={`${wallet?.streak_days ?? 0} day${(wallet?.streak_days ?? 0) === 1 ? "" : "s"}`}
              />
              <StatCard
                icon={<TrendingUp className="h-4 w-4" />}
                label="Total spent"
                value={(wallet?.lifetime_spent ?? 0).toLocaleString()}
              />
            </div>
          )}

          {/* Earn ways */}
          <div className="mt-16">
            <h2 className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Ways to earn</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {EARN_WAYS.map((w) => (
                <div key={w.label} className="glass flex items-center justify-between rounded-2xl px-5 py-4">
                  <div>
                    <div className="text-sm font-medium">{w.label}</div>
                    <div className="text-xs text-muted-foreground">{w.hint}</div>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-semibold gradient-text tabular-nums">
                    <AuraCoin size={16} animated={false} /> +{w.amount}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Owned unlocks */}
          {user && ownedFeatures.length > 0 && (
            <div className="mt-16">
              <h2 className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Your unlocks</h2>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {ownedFeatures.map((f) => (
                  <div key={f.key} className="glass flex items-center justify-between rounded-2xl px-5 py-4">
                    <div>
                      <div className="text-sm font-medium">{f.name}</div>
                      <div className="text-xs text-muted-foreground">{f.tagline}</div>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-primary/15 px-2.5 py-1 text-[10px] uppercase tracking-wider text-primary">
                      <Check className="h-3 w-3" /> Owned
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Store CTA */}
          <div className="mt-16 glass relative overflow-hidden rounded-3xl p-10 text-center">
            <div
              className="absolute inset-0 opacity-60"
              style={{ background: "radial-gradient(60% 50% at 50% 0%, oklch(0.65 0.18 295 / 0.22), transparent 70%)" }}
            />
            <Sparkles className="relative mx-auto h-5 w-5 text-primary" />
            <h3 className="relative mt-4 text-2xl font-semibold tracking-tight">The Aura Store</h3>
            <p className="relative mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Unlock premium reports, advanced cognitive breakdowns, and your personal AI mentor — or top up with coin packages.
            </p>
            <Link
              to={user ? "/aura/store" : "/auth"}
              {...(!user ? { search: { mode: "login" as const } } : {})}
              className="relative mt-6 inline-flex items-center gap-1.5 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:glow-purple"
            >
              {user ? "Enter the store" : "Sign in to start earning"} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {isLoading && user && (
            <p className="mt-8 text-center text-xs text-muted-foreground">Loading your wallet…</p>
          )}
        </div>
      </section>
    </PageShell>
  );
}

const EARN_WAYS = [
  { label: "Complete an assessment", hint: "Full IQ + personality + interests", amount: 20 },
  { label: "Daily login", hint: "Open Abilitio each day", amount: 5 },
  { label: "7-day streak bonus", hint: "Keep your streak alive", amount: 25 },
  { label: "Retake an assessment", hint: "Track how you've grown", amount: 5 },
  { label: "Share your results", hint: "Send your profile to a friend", amount: 10 },
  { label: "Finish a roadmap step", hint: "Inside your growth plan", amount: 20 },
];

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="glass rounded-3xl p-6">
      <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        <span className="text-primary">{icon}</span> {label}
      </div>
      <div className="mt-3 text-3xl font-semibold tabular-nums gradient-text">{value}</div>
    </div>
  );
}
