import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { AURA_PACKAGES } from "./aura-catalog";

export type UnlockRow = { feature_key: string; unlocked_at: string };

export const getMyUnlocks = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<UnlockRow[]> => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("aura_unlocks")
      .select("feature_key, unlocked_at")
      .eq("user_id", userId)
      .order("unlocked_at", { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []) as UnlockRow[];
  });

export type PurchaseRequestRow = {
  id: string;
  package_key: string;
  coins: number;
  uzs_amount: number;
  status: "pending" | "approved" | "rejected" | "cancelled";
  contact_note: string | null;
  created_at: string;
};

export const getMyPurchaseRequests = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<PurchaseRequestRow[]> => {
    const { supabase, userId } = context;
    const { data, error } = await supabase
      .from("aura_purchase_requests")
      .select("id, package_key, coins, uzs_amount, status, contact_note, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(20);
    if (error) throw new Error(error.message);
    return (data ?? []) as PurchaseRequestRow[];
  });

export const createPurchaseRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        packageKey: z.string().min(1).max(32).regex(/^[a-z0-9_]+$/),
        contactNote: z.string().max(500).optional(),
      })
      .parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const pkg = AURA_PACKAGES.find((p) => p.key === data.packageKey);
    if (!pkg) throw new Error("invalid_package");
    const totalCoins = pkg.coins + pkg.bonus;

    const { data: row, error } = await supabase
      .from("aura_purchase_requests")
      .insert({
        user_id: userId,
        package_key: pkg.key,
        coins: totalCoins,
        uzs_amount: pkg.uzs,
        contact_note: data.contactNote ?? null,
      })
      .select("id, package_key, coins, uzs_amount, status, contact_note, created_at")
      .single();
    if (error) throw new Error(error.message);
    return row as PurchaseRequestRow;
  });

export const cancelPurchaseRequest = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const { error } = await supabase
      .from("aura_purchase_requests")
      .update({ status: "cancelled", updated_at: new Date().toISOString() })
      .eq("id", data.id)
      .eq("user_id", userId)
      .eq("status", "pending");
    if (error) throw new Error(error.message);
    return { ok: true };
  });
