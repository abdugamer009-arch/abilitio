import { createFileRoute, Link } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { AuraCoin } from "@/components/aura/AuraCoin";
import { useAura } from "@/components/aura/AuraProvider";
import { useAuth } from "@/lib/auth-context";
import { Flame, Sparkles, TrendingUp, Lock } from "lucide-react";

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

          {/* Placeholder for shop */}
          <div className="mt-16 glass relative overflow-hidden rounded-3xl p-10 text-center">
            <div className="absolute inset-0 opacity-50"
                 style={{ background: "radial-gradient(60% 50% at 50% 0%, oklch(0.65 0.18 295 / 0.18), transparent 70%)" }} />
            <Lock className="relative mx-auto h-5 w-5 text-primary" />
            <h3 className="relative mt-4 text-xl font-semibold tracking-tight">Aura Store opens soon</h3>
            <p className="relative mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              The premium store, unlockable features, and Aura Coin packages arrive in the next release.
            </p>
            {!user && (
              <Link
                to="/auth"
                search={{ mode: "login" }}
                className="relative mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:glow-purple"
              >
                Sign in to start earning
              </Link>
            )}
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
