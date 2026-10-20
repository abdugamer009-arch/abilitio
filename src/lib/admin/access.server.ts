import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
type DbClient = SupabaseClient<Database>;

export type AuthContext = { supabase: DbClient; userId: string; claims?: { email?: string } };

/** Database roles are authoritative across actions, RLS, badges and Realtime. */
export async function resolveAdminStatus(
  context: AuthContext,
): Promise<{ isAdmin: boolean; email: string | null }> {
  const { data, error } = await context.supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", context.userId)
    .eq("role", "admin")
    .maybeSingle();
  if (error) throw new Error("Could not verify administrator access");
  return { isAdmin: Boolean(data), email: context.claims?.email ?? null };
}

export async function ensureAdmin(context: AuthContext) {
  const { isAdmin } = await resolveAdminStatus(context);
  if (!isAdmin) throw new Error("forbidden");
}

/** Protected writes require a successful moderation lookup. */
export async function ensureNotBanned(userId: string): Promise<void> {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("is_banned")
    .eq("id", userId)
    .maybeSingle();
  if (error || !data) throw new Error("Account status is unavailable. Please retry.");
  if (data.is_banned) throw new Error("account_banned");
}
