import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { PageShell } from "@/components/PageShell";
import { AuraCoin } from "@/components/aura/AuraCoin";
import { useAura } from "@/components/aura/AuraProvider";
import { useAuth } from "@/lib/auth-context";
import { AURA_FEATURES, AURA_PACKAGES, formatUZS, type UnlockFeature, type CoinPackage } from "@/lib/aura-catalog";
import {
  cancelPurchaseRequest,
  createPurchaseRequest,
  getMyPurchaseRequests,
  getMyUnlocks,
} from "@/lib/aura-store.functions";
import { Check, Lock, Sparkles, Crown, Zap, X, Clock } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/aura/store")({
  head: () => ({
    meta: [
      { title: "Aura Store — Abilitio" },
      { name: "description", content: "Unlock premium Abilitio features with Aura Coins, or top up with coin packages." },
    ],
  }),
  component: AuraStorePage,
});

const QK_UNLOCKS = ["aura", "unlocks"] as const;
const QK_PURCHASES = ["aura", "purchases"] as const;

function AuraStorePage() {
  const { user } = useAuth();
  const { wallet, unlock } = useAura();
  const queryClient = useQueryClient();
  const getUnlocksFn = useServerFn(getMyUnlocks);
  const getPurchasesFn = useServerFn(getMyPurchaseRequests);
  const createReqFn = useServerFn(createPurchaseRequest);
  const cancelReqFn = useServerFn(cancelPurchaseRequest);

  const unlocksQ = useQuery({ queryKey: QK_UNLOCKS, queryFn: () => getUnlocksFn(), enabled: !!user });
  const purchasesQ = useQuery({ queryKey: QK_PURCHASES, queryFn: () => getPurchasesFn(), enabled: !!user });

  const ownedKeys = new Set((unlocksQ.data ?? []).map((u) => u.feature_key));
  const balance = wallet?.balance ?? 0;

  const [busyKey, setBusyKey] = useState<string | null>(null);
  const [pkgBusy, setPkgBusy] = useState<string | null>(null);

  async function handleUnlock(f: UnlockFeature) {
    if (!user) return;
    if (ownedKeys.has(f.key)) return;
    setBusyKey(f.key);
    const res = await unlock(f.key, f.price);
    setBusyKey(null);
    if (res.ok) {
      toast.success(`${f.name} unlocked`);
      queryClient.invalidateQueries({ queryKey: QK_UNLOCKS });
    } else if (res.reason === "insufficient_balance") {
      toast.error("Not enough Aura Coins", { description: "Top up below to continue." });
    } else {
      toast.error("Could not unlock", { description: res.reason });
    }
  }

  async function handleBuyPackage(p: CoinPackage) {
    if (!user) return;
    setPkgBusy(p.key);
    try {
      await createReqFn({ data: { packageKey: p.key } });
      toast.success("Purchase request received", {
        description: "Our team will contact you shortly to complete payment.",
      });
      queryClient.invalidateQueries({ queryKey: QK_PURCHASES });
    } catch (e) {
      toast.error("Could not submit request", { description: e instanceof Error ? e.message : "Try again" });
    } finally {
      setPkgBusy(null);
    }
  }

  async function handleCancel(id: string) {
    try {
      await cancelReqFn({ data: { id } });
      queryClient.invalidateQueries({ queryKey: QK_PURCHASES });
    } catch (e) {
      toast.error("Could not cancel", { description: e instanceof Error ? e.message : "Try again" });
    }
  }

  return (
    <PageShell>
      <section className="px-6 pt-12 pb-24">
        <div className="mx-auto max-w-6xl">
          {/* Header */}
          <div className="flex flex-col items-center text-center">
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Aura Store</p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
              <span className="gradient-text">Spend. Unlock. Grow.</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground">
              Use Aura Coins to unlock premium insights, or top up with a coin package to accelerate your journey.
            </p>

            {user && (
              <div className="mt-6 inline-flex items-center gap-2 rounded-full glass px-5 py-2">
                <AuraCoin size={18} animated={false} />
                <span className="text-sm text-muted-foreground">Balance:</span>
                <span className="text-sm font-semibold tabular-nums gradient-text">
                  {balance.toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {/* Premium Unlocks */}
          <div className="mt-16">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Premium unlocks</h2>
                <p className="mt-1 text-lg font-medium">Spend Aura Coins to unlock</p>
              </div>
              <Link to="/aura" className="text-xs text-muted-foreground hover:text-foreground">
                ← Back to Aura
              </Link>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {AURA_FEATURES.map((f) => {
                const owned = ownedKeys.has(f.key);
                const affordable = balance >= f.price;
                const busy = busyKey === f.key;
                return (
                  <article
                    key={f.key}
                    className="glass group relative flex flex-col rounded-3xl p-6 transition-all hover:-translate-y-0.5"
                  >
                    {f.tier === "elite" && (
                      <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-primary">
                        <Crown className="h-3 w-3" /> Elite
                      </span>
                    )}
                    {f.tier === "growth" && (
                      <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-accent-foreground/80">
                        <Zap className="h-3 w-3" /> Growth
                      </span>
                    )}

                    <h3 className="text-lg font-semibold tracking-tight">{f.name}</h3>
                    <p className="mt-1 text-xs text-primary/80">{f.tagline}</p>
                    <p className="mt-4 text-sm text-muted-foreground leading-relaxed flex-1">{f.description}</p>

                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-sm font-semibold gradient-text tabular-nums">
                        <AuraCoin size={16} animated={false} /> {f.price}
                      </div>
                      {owned ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-3 py-1.5 text-xs font-medium text-primary">
                          <Check className="h-3.5 w-3.5" /> Unlocked
                        </span>
                      ) : (
                        <button
                          onClick={() => handleUnlock(f)}
                          disabled={!user || !affordable || busy}
                          className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground transition-all hover:glow-purple disabled:opacity-40 disabled:hover:shadow-none"
                        >
                          {busy ? "Unlocking…" : !user ? "Sign in" : !affordable ? "Need more" : "Unlock"}
                        </button>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Coin Packages */}
          <div className="mt-20">
            <h2 className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Top up</h2>
            <p className="mt-1 text-lg font-medium">Aura Coin packages</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Prices in Uzbek Som (UZS). Submit a request and our team will contact you to complete payment.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {AURA_PACKAGES.map((p) => {
                const total = p.coins + p.bonus;
                const busy = pkgBusy === p.key;
                return (
                  <article
                    key={p.key}
                    className={`glass relative flex flex-col rounded-3xl p-5 ${
                      p.popular ? "ring-1 ring-primary/40" : ""
                    }`}
                  >
                    {p.popular && (
                      <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-primary px-2.5 py-0.5 text-[10px] uppercase tracking-wider text-primary-foreground">
                        Popular
                      </span>
                    )}
                    <div className="flex items-center justify-center">
                      <div className="relative flex h-14 w-14 items-center justify-center">
                        <span
                          className="pointer-events-none absolute inset-0 rounded-full opacity-60 blur-xl"
                          style={{ background: "radial-gradient(circle, oklch(0.65 0.20 295 / 0.45), transparent 70%)" }}
                        />
                        <AuraCoin size={48} animated={false} />
                      </div>
                    </div>
                    <div className="mt-3 text-center">
                      <div className="text-2xl font-semibold tabular-nums gradient-text">
                        {total.toLocaleString()}
                      </div>
                      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Aura Coins</div>
                      {p.bonus > 0 && (
                        <div className="mt-1 text-[11px] text-primary">
                          includes +{p.bonus} bonus
                        </div>
                      )}
                    </div>
                    <div className="mt-4 text-center text-sm font-medium">{formatUZS(p.uzs)}</div>
                    {p.highlight && (
                      <div className="mt-1 text-center text-[11px] text-muted-foreground">{p.highlight}</div>
                    )}
                    <button
                      onClick={() => handleBuyPackage(p)}
                      disabled={!user || busy}
                      className="mt-4 w-full rounded-full bg-primary px-3 py-2 text-xs font-medium text-primary-foreground transition-all hover:glow-purple disabled:opacity-40"
                    >
                      {busy ? "Submitting…" : !user ? "Sign in" : "Request"}
                    </button>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Purchase history */}
          {user && (purchasesQ.data?.length ?? 0) > 0 && (
            <div className="mt-20">
              <h2 className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Your requests</h2>
              <div className="mt-4 space-y-2">
                {purchasesQ.data!.map((r) => (
                  <div
                    key={r.id}
                    className="glass flex items-center justify-between gap-4 rounded-2xl px-5 py-3 text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <StatusBadge status={r.status} />
                      <div>
                        <div className="font-medium capitalize">{r.package_key}</div>
                        <div className="text-xs text-muted-foreground">
                          {r.coins.toLocaleString()} coins • {formatUZS(r.uzs_amount)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {new Date(r.created_at).toLocaleDateString()}
                      </span>
                      {r.status === "pending" && (
                        <button
                          onClick={() => handleCancel(r.id)}
                          className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                        >
                          <X className="h-3 w-3" /> Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!user && (
            <div className="mt-16 text-center">
              <Link
                to="/auth"
                search={{ mode: "login" }}
                className="inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:glow-purple"
              >
                Sign in to access the store
              </Link>
            </div>
          )}
        </div>
      </section>
    </PageShell>
  );
}

function StatusBadge({ status }: { status: "pending" | "approved" | "rejected" | "cancelled" }) {
  const map = {
    pending: { icon: <Clock className="h-3 w-3" />, label: "Pending", cls: "bg-primary/15 text-primary" },
    approved: { icon: <Check className="h-3 w-3" />, label: "Approved", cls: "bg-emerald-500/15 text-emerald-400" },
    rejected: { icon: <X className="h-3 w-3" />, label: "Rejected", cls: "bg-destructive/15 text-destructive" },
    cancelled: { icon: <X className="h-3 w-3" />, label: "Cancelled", cls: "bg-muted text-muted-foreground" },
  }[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wider ${map.cls}`}>
      {map.icon} {map.label}
    </span>
  );
}

// Suppress unused warnings for icons reserved for future tiers
void Sparkles;
void Lock;
