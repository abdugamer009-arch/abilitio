import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  awardAura,
  claimDailyLogin,
  getAuraWallet,
  unlockFeature,
  type AuraEarnKey,
  type WalletDTO,
} from "@/lib/aura.functions";
import { useAuth } from "@/lib/auth-context";

type Reward = { id: string; amount: number; label: string; bonus?: boolean };

type AuraCtx = {
  wallet: WalletDTO | null;
  isLoading: boolean;
  award: (reasonKey: AuraEarnKey) => Promise<void>;
  unlock: (featureKey: string, price: number) => Promise<{ ok: boolean; reason?: string }>;
  rewards: Reward[];
  dismissReward: (id: string) => void;
  pushLocalReward: (r: Omit<Reward, "id">) => void;
};

const Ctx = createContext<AuraCtx>({
  wallet: null,
  isLoading: false,
  award: async () => {},
  unlock: async () => ({ ok: false }),
  rewards: [],
  dismissReward: () => {},
  pushLocalReward: () => {},
});

const QK_WALLET = ["aura", "wallet"] as const;

export function AuraProvider({ children }: { children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const getWalletFn = useServerFn(getAuraWallet);
  const awardFn = useServerFn(awardAura);
  const unlockFn = useServerFn(unlockFeature);
  const claimDailyFn = useServerFn(claimDailyLogin);

  const [rewards, setRewards] = useState<Reward[]>([]);

  const pushReward = useCallback((r: Omit<Reward, "id">) => {
    const id = Math.random().toString(36).slice(2);
    setRewards((prev) => [...prev, { ...r, id }]);
    // auto-dismiss
    setTimeout(() => setRewards((prev) => prev.filter((x) => x.id !== id)), 4200);
  }, []);

  const dismissReward = useCallback((id: string) => {
    setRewards((prev) => prev.filter((x) => x.id !== id));
  }, []);

  const walletQuery = useQuery({
    queryKey: QK_WALLET,
    queryFn: () => getWalletFn(),
    enabled: !!user && !authLoading,
    staleTime: 30_000,
  });

  // Daily-login claim once per session per user
  useEffect(() => {
    if (!user || authLoading) return;
    const key = `aura_daily_${user.id}_${new Date().toISOString().slice(0, 10)}`;
    if (typeof window === "undefined" || sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    (async () => {
      try {
        const res = await claimDailyFn();
        if (res.amount > 0) {
          queryClient.setQueryData(QK_WALLET, res.wallet);
          pushReward({
            amount: res.amount,
            label: res.bonus ? `${res.streak}-day streak bonus` : `Day ${res.streak} login`,
            bonus: res.bonus,
          });
        }
      } catch (e) {
        console.error("claimDailyLogin failed", e);
      }
    })();
  }, [user, authLoading, claimDailyFn, queryClient, pushReward]);

  const awardMut = useMutation({
    mutationFn: (reasonKey: AuraEarnKey) => awardFn({ data: { reasonKey } }),
    onSuccess: (res) => {
      queryClient.setQueryData(QK_WALLET, res.wallet);
      pushReward({ amount: res.amount, label: res.label });
      queryClient.invalidateQueries({ queryKey: ["aura", "growth-state"] });
    },
  });

  const unlockMut = useMutation({
    mutationFn: ({ featureKey, price }: { featureKey: string; price: number }) =>
      unlockFn({ data: { featureKey, price } }),
    onSuccess: (res) => {
      queryClient.setQueryData(QK_WALLET, res.wallet);
      queryClient.invalidateQueries({ queryKey: ["aura", "unlocks"] });
      queryClient.invalidateQueries({ queryKey: ["aura", "growth-state"] });
    },
  });

  const value: AuraCtx = {
    wallet: walletQuery.data ?? null,
    isLoading: walletQuery.isLoading,
    award: async (k) => { await awardMut.mutateAsync(k); },
    unlock: async (featureKey, price) => {
      try {
        await unlockMut.mutateAsync({ featureKey, price });
        return { ok: true };
      } catch (e: unknown) {
        const msg = e instanceof Error ? e.message : "unknown";
        return { ok: false, reason: msg.includes("insufficient_balance") ? "insufficient_balance" : msg };
      }
    },
    rewards,
    dismissReward,
    pushLocalReward: pushReward,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useAura = () => useContext(Ctx);
