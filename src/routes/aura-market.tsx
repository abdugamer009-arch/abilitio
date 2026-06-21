import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Sparkles, X, CreditCard, Wallet, Building2 } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { AuraCoin } from "@/components/aura/AuraCoin";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/aura-market")({
  head: () => ({
    meta: [
      { title: "Aura Market — Abilitio" },
      { name: "description", content: "Premium Aura Coins packages to unlock advanced AI insights, growth tools, and elite features on Abilitio." },
      { property: "og:title", content: "Aura Market — Abilitio" },
      { property: "og:description", content: "Unlock your full Abilitio experience with Aura Coins." },
    ],
  }),
  component: AuraMarketPage,
});

type Pkg = {
  key: string;
  coins: number;
  uzs: number;
  tagline: string;
  benefits: string[];
  popular?: boolean;
};

const PACKAGES: Pkg[] = [
  {
    key: "starter",
    coins: 100,
    uzs: 35_000,
    tagline: "Begin your journey",
    benefits: ["Unlock basic AI insights", "Personality analysis", "Small feature unlocks"],
  },
  {
    key: "growth",
    coins: 250,
    uzs: 70_000,
    tagline: "Most chosen by ambitious users",
    benefits: ["Full career roadmap", "Advanced AI analysis", "Growth tracking", "Best value"],
    popular: true,
  },
  {
    key: "elite",
    coins: 700,
    uzs: 150_000,
    tagline: "The complete Abilitio experience",
    benefits: [
      "Full premium experience",
      "Unlimited advanced reports",
      "AI mentor features",
      "Advanced analytics dashboard",
      "Priority future features",
    ],
  },
];

const formatUZS = (n: number) => new Intl.NumberFormat("en-US").format(n) + " UZS";

function AuraMarketPage() {
  const [selected, setSelected] = useState<Pkg | null>(null);
  const [method, setMethod] = useState<string>("card");
  const [confirmed, setConfirmed] = useState(false);

  return (
    <PageShell>
      {/* Ambient gradient */}
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[80vh] overflow-hidden">
        <div className="absolute left-1/2 top-[-10%] h-[60rem] w-[60rem] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,oklch(0.55_0.22_295_/_0.28),transparent_70%)] blur-3xl" />
      </div>

      <section className="mx-auto max-w-6xl px-4 pt-16 pb-10 sm:pt-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border/70 bg-secondary/40 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground backdrop-blur">
            <Sparkles className="h-3 w-3 text-primary" /> Aura Market
          </div>
          <h1 className="mt-5 text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
            Fuel your{" "}
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              next breakthrough
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-pretty text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            Aura Coins are Abilitio's internal premium currency — used to unlock deeper AI insights,
            personalized growth tools, and elite features designed to help you become your best self.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24">
        <div className="grid gap-6 md:grid-cols-3 md:gap-7">
          {PACKAGES.map((pkg) => (
            <PackageCard key={pkg.key} pkg={pkg} onBuy={() => { setSelected(pkg); setConfirmed(false); setMethod("card"); }} />
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-muted-foreground">
          Aura Coins are an internal virtual currency for the Abilitio ecosystem. Not cryptocurrency. Non-refundable.
        </p>
      </section>

      <PurchaseModal
        pkg={selected}
        method={method}
        onMethod={setMethod}
        confirmed={confirmed}
        onConfirm={() => setConfirmed(true)}
        onClose={() => setSelected(null)}
      />
    </PageShell>
  );
}

function PackageCard({ pkg, onBuy }: { pkg: Pkg; onBuy: () => void }) {
  const isPopular = !!pkg.popular;
  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-3xl border p-7 transition-all duration-500",
        "bg-gradient-to-b from-card/80 to-card/40 backdrop-blur-xl",
        "hover:-translate-y-1.5",
        isPopular
          ? "border-primary/50 shadow-[0_20px_70px_-20px_var(--glow)] md:scale-[1.04]"
          : "border-border/60 hover:border-primary/40 hover:shadow-[0_20px_60px_-25px_var(--glow)]",
      )}
    >
      {/* Glow ring on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ boxShadow: "inset 0 0 0 1px oklch(0.65 0.22 295 / 0.35)" }}
      />

      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-primary to-accent px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-foreground shadow-[0_8px_24px_-8px_var(--glow)]">
            <Sparkles className="h-3 w-3" /> Most Popular
          </span>
        </div>
      )}

      <div className="flex items-center gap-3">
        <AuraCoin size={42} animated={isPopular} />
        <div>
          <div className="text-2xl font-semibold tracking-tight">{pkg.coins.toLocaleString()}</div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Aura Coins</div>
        </div>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">{pkg.tagline}</p>

      <div className="mt-6 flex items-baseline gap-2">
        <span className="text-3xl font-semibold tracking-tight">{formatUZS(pkg.uzs)}</span>
      </div>
      <div className="mt-1 text-xs text-muted-foreground">
        ≈ {Math.round(pkg.uzs / pkg.coins).toLocaleString()} UZS per coin
      </div>

      <div className="my-6 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <ul className="space-y-3">
        {pkg.benefits.map((b) => (
          <li key={b} className="flex items-start gap-3 text-sm">
            <span className={cn(
              "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full",
              isPopular
                ? "bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-[0_2px_8px_-2px_var(--glow)]"
                : "bg-gradient-to-br from-primary to-accent text-primary-foreground",
            )}>
              <Check className="h-3 w-3" strokeWidth={3} />
            </span>
            <span className="text-foreground/90">{b}</span>
          </li>
        ))}
      </ul>

      <div className="mt-8 pt-2">
        <button
          onClick={onBuy}
          className={cn(
            "relative w-full overflow-hidden rounded-2xl px-5 py-3.5 text-sm font-semibold transition-all duration-300",
            "bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] bg-left text-primary-foreground",
            "hover:bg-right hover:shadow-[0_15px_45px_-12px_var(--glow)] hover:-translate-y-0.5",
            "active:translate-y-0",
          )}
        >
          Buy Aura Coins
        </button>
      </div>
    </div>
  );
}

const METHODS = [
  { key: "card", label: "Credit / Debit Card", icon: CreditCard, desc: "Visa, Mastercard, UzCard" },
  { key: "humo", label: "Humo / UzCard", icon: Wallet, desc: "Local bank cards" },
  { key: "bank", label: "Bank Transfer", icon: Building2, desc: "Manual confirmation" },
];

function PurchaseModal({
  pkg, method, onMethod, confirmed, onConfirm, onClose,
}: {
  pkg: Pkg | null;
  method: string;
  onMethod: (m: string) => void;
  confirmed: boolean;
  onConfirm: () => void;
  onClose: () => void;
}) {
  return (
    <Dialog open={!!pkg} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-md overflow-hidden rounded-3xl border-border/60 bg-gradient-to-b from-card to-background p-0">
        {pkg && (
          <div className="relative">
            <div className="pointer-events-none absolute inset-x-0 -top-24 h-48 bg-[radial-gradient(closest-side,oklch(0.6_0.22_295_/_0.35),transparent_70%)] blur-2xl" />

            <div className="relative p-7">
              {confirmed ? (
                <div className="py-6 text-center animate-fade-in">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent shadow-[0_15px_45px_-12px_var(--glow)]">
                    <Check className="h-8 w-8 text-primary-foreground" strokeWidth={3} />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold">Request received</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    We'll confirm your <span className="text-foreground font-medium">{pkg.coins} Aura Coins</span> purchase shortly.
                    A team member will reach out with payment instructions.
                  </p>
                  <Button onClick={onClose} className="mt-6 w-full rounded-xl">Done</Button>
                </div>
              ) : (
                <>
                  <DialogHeader>
                    <DialogTitle className="text-xl">Confirm purchase</DialogTitle>
                    <DialogDescription>Choose how you'd like to pay.</DialogDescription>
                  </DialogHeader>

                  <div className="mt-5 rounded-2xl border border-border/60 bg-secondary/30 p-4">
                    <div className="flex items-center gap-3">
                      <AuraCoin size={36} />
                      <div className="flex-1">
                        <div className="text-base font-semibold">{pkg.coins.toLocaleString()} Aura Coins</div>
                        <div className="text-xs text-muted-foreground">{pkg.tagline}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold">{formatUZS(pkg.uzs)}</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5">
                    <div className="mb-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Payment method</div>
                    <div className="space-y-2">
                      {METHODS.map((m) => {
                        const Icon = m.icon;
                        const active = method === m.key;
                        return (
                          <button
                            key={m.key}
                            onClick={() => onMethod(m.key)}
                            className={cn(
                              "flex w-full items-center gap-3 rounded-2xl border p-3.5 text-left transition-all",
                              active
                                ? "border-primary/60 bg-primary/5 shadow-[0_8px_28px_-12px_var(--glow)]"
                                : "border-border/60 hover:border-primary/40 hover:bg-secondary/40",
                            )}
                          >
                            <span className={cn(
                              "flex h-9 w-9 items-center justify-center rounded-xl",
                              active ? "bg-gradient-to-br from-primary to-accent text-primary-foreground" : "bg-secondary text-foreground",
                            )}>
                              <Icon className="h-4 w-4" />
                            </span>
                            <div className="flex-1">
                              <div className="text-sm font-medium">{m.label}</div>
                              <div className="text-xs text-muted-foreground">{m.desc}</div>
                            </div>
                            <span className={cn(
                              "h-4 w-4 rounded-full border-2 transition-all",
                              active ? "border-transparent bg-gradient-to-br from-primary to-accent shadow-[0_0_6px_-1px_var(--glow)]" : "border-border",
                            )} />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
                    <div>
                      <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Total</div>
                      <div className="text-xl font-semibold">{formatUZS(pkg.uzs)}</div>
                    </div>
                    <button
                      onClick={onConfirm}
                      className="rounded-2xl bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] bg-left px-6 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:bg-right hover:shadow-[0_15px_45px_-12px_var(--glow)] hover:-translate-y-0.5"
                    >
                      Confirm
                    </button>
                  </div>

                  <p className="mt-3 text-center text-[11px] text-muted-foreground">
                    UI preview — no real payment will be processed.
                  </p>
                </>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
