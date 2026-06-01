import { useAura } from "./AuraProvider";
import { AuraCoin } from "./AuraCoin";
import { Sparkles, Flame } from "lucide-react";

export function AuraRewardToaster() {
  const { rewards, dismissReward } = useAura();

  return (
    <div className="pointer-events-none fixed inset-x-0 top-24 z-[60] flex flex-col items-center gap-3 px-4">
      {rewards.map((r) => (
        <button
          key={r.id}
          onClick={() => dismissReward(r.id)}
          className="pointer-events-auto group relative flex items-center gap-3 rounded-full border border-primary/30 bg-background/70 px-5 py-3 shadow-[0_18px_60px_-20px_oklch(0.55_0.20_295_/_0.5)] backdrop-blur-xl animate-aura-reward"
          style={{ minWidth: 240 }}
        >
          <span
            className="pointer-events-none absolute inset-0 rounded-full opacity-70"
            style={{
              background:
                "radial-gradient(120% 120% at 0% 50%, oklch(0.65 0.20 295 / 0.18), transparent 60%)",
            }}
          />
          <span className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-accent/20">
            {r.bonus ? <Flame className="h-4 w-4 text-primary" /> : <AuraCoin size={22} />}
          </span>
          <span className="relative flex flex-col text-left">
            <span className="flex items-center gap-1.5 text-[13px] font-semibold tracking-tight">
              <Sparkles className="h-3 w-3 text-primary" />
              +{r.amount} Aura Coins
            </span>
            <span className="text-[11px] text-muted-foreground">{r.label}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
