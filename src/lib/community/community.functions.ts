import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { Database } from "@/integrations/supabase/types";
import { communitySlugForCareer } from "../assessment/career-engine";
import { resolveAdminStatus, ensureNotBanned, type AuthContext } from "../admin/admin.functions";

export type CommunityDTO = {
  id: string;
  slug: string;
  name: string;
  career_key: string;
  description: string;
  welcome_message: string;
  member_count: number;
};

export type CommunityMessageDTO = {
  id: string;
  community_id: string;
  user_id: string;
  content: string;
  is_pinned: boolean;
  created_at: string;
};

export type AuthorDTO = {
  user_id: string;
  name: string;
  avatar_url: string | null;
  is_admin: boolean;
};

// Single source of truth for admin status (email allow-list first, DB role as
// fallback) — the same rule the admin dashboard uses. A DB-role-only check here
// would show the moderation UI to allow-list admins and then fail their actions.
async function isAdmin(context: AuthContext): Promise<boolean> {
  const { isAdmin: admin } = await resolveAdminStatus(context);
  return admin;
}

export const getMyCommunities = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ communities: CommunityDTO[]; isAdmin: boolean }> => {
    const { supabase, userId } = context;
    const admin = await isAdmin(context);
    if (admin) {
      // Service-role read: allow-list admins may lack the DB role RLS expects.
      const { data } = await supabaseAdmin.from("communities").select("*").order("name");
      return { communities: (data ?? []) as CommunityDTO[], isAdmin: true };
    }
    const { data: memberships } = await supabase
      .from("community_members")
      .select("community_id")
      .eq("user_id", userId);
    const ids = (memberships ?? []).map((m) => m.community_id);
    if (ids.length) {
      const { data } = await supabase.from("communities").select("*").in("id", ids);
      return { communities: (data ?? []) as CommunityDTO[], isAdmin: false };
    }
    // No membership yet — self-heal for users who assessed before auto-join
    // was wired: assign from their latest result's top career match.
    const healed = await ensureCommunityFromLatestResult(supabase, userId);
    return { communities: healed ? [healed] : [], isAdmin: false };
  });

/** Assign a member row from the user's most recent career result, if any, and
 *  return the resulting community. No-op (returns null) when they have no result. */
async function ensureCommunityFromLatestResult(
  supabase: SupabaseClient<Database>,
  userId: string,
): Promise<CommunityDTO | null> {
  const { data: latest } = await supabase
    .from("career_assessment_results")
    .select("career_matches")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  const top = (
    latest?.career_matches as { key?: string; category?: string; name?: string }[] | null
  )?.[0];
  if (!top) return null;
  const { data: cid } = await supabase.rpc("assign_user_to_community_by_slug", {
    _slug: communitySlugForCareer(top),
  });
  if (!cid) return null;
  const { data } = await supabase
    .from("communities")
    .select("*")
    .eq("id", cid as string)
    .maybeSingle();
  return (data as CommunityDTO) ?? null;
}

/** Guarantee the user has a community home after their FIRST test — whichever
 *  test that is. Career-assessment takers land in their match's community;
 *  users whose first test was the (client-scored) IQ test have no career
 *  result to key on, so they join General and get re-assigned automatically
 *  when they later complete the career assessment. No-op when a membership
 *  already exists, so it never downgrades a specific community to General. */
export const ensureMyCommunity = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ joined: boolean; community: CommunityDTO | null }> => {
    const { supabase, userId } = context;
    const { data: existing } = await supabase
      .from("community_members")
      .select("community_id")
      .eq("user_id", userId)
      .maybeSingle();
    if (existing) return { joined: false, community: null };

    const healed = await ensureCommunityFromLatestResult(supabase, userId);
    if (healed) return { joined: true, community: healed };

    const { data: cid } = await supabase.rpc("assign_user_to_community_by_slug", {
      _slug: "general",
    });
    if (!cid) return { joined: false, community: null };
    const { data } = await supabase
      .from("communities")
      .select("*")
      .eq("id", cid as string)
      .maybeSingle();
    return { joined: true, community: (data as CommunityDTO) ?? null };
  });

export const getCommunityMessages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        communityId: z.string().uuid(),
        limit: z.number().int().min(1).max(200).optional(),
      })
      .parse(input),
  )
  .handler(
    async ({
      data,
      context,
    }): Promise<{ messages: CommunityMessageDTO[]; authors: AuthorDTO[] }> => {
      const { supabase } = context;
      const limit = Math.min(Math.max(data.limit ?? 100, 1), 200);
      const { data: rows, error } = await supabase
        .from("community_messages")
        .select("*")
        .eq("community_id", data.communityId)
        .order("created_at", { ascending: true })
        .limit(limit);
      if (error) throw new Error(error.message);
      const messages = (rows ?? []) as CommunityMessageDTO[];
      const ids = Array.from(new Set(messages.map((m) => m.user_id)));
      const authors = await fetchAuthors(ids);
      return { messages, authors };
    },
  );

export const fetchMessageAuthors = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  // Strict validation matters here: this reads via the service role, so without
  // it any signed-in user could pump arbitrary strings/volumes through a
  // profile lookup. UUID-only plus a hard cap keeps it scoped to its real job
  // (resolving authors of messages already visible to the caller).
  .inputValidator((input) =>
    z.object({ userIds: z.array(z.string().uuid()).max(100) }).parse(input),
  )
  .handler(async ({ data }): Promise<AuthorDTO[]> => {
    return fetchAuthors(data.userIds);
  });

type ProfileNameRow = { id: string; name: string | null; surname: string | null };
type StatRow = { user_id: string; avatar_url: string | null };

async function fetchAuthors(userIds: string[]): Promise<AuthorDTO[]> {
  if (!userIds.length) return [];
  const [profiles, stats, roles] = await Promise.all([
    supabaseAdmin.from("profiles").select("id, name, surname").in("id", userIds),
    supabaseAdmin.from("user_stats").select("user_id, avatar_url").in("user_id", userIds),
    supabaseAdmin.from("user_roles").select("user_id").eq("role", "admin").in("user_id", userIds),
  ]);
  const sMap = new Map<string, string | null>();
  for (const s of (stats.data ?? []) as StatRow[]) sMap.set(s.user_id, s.avatar_url);
  const adminSet = new Set<string>(
    ((roles.data ?? []) as { user_id: string }[]).map((r) => r.user_id),
  );
  return ((profiles.data ?? []) as ProfileNameRow[]).map((p) => ({
    user_id: p.id,
    name: `${p.name ?? ""} ${p.surname ?? ""}`.trim() || "Explorer",
    avatar_url: sMap.get(p.id) ?? null,
    is_admin: adminSet.has(p.id),
  }));
}

export const sendCommunityMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ communityId: z.string().uuid(), content: z.string().min(1).max(2000) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    await ensureNotBanned(userId);
    const { data: row, error } = await supabase
      .from("community_messages")
      .insert({ community_id: data.communityId, user_id: userId, content: data.content })
      .select("*")
      .single();
    if (error) throw new Error(error.message);
    return row as CommunityMessageDTO;
  });

export const deleteCommunityMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    const { userId } = context;

    // Verify ownership or admin status before deleting. Lookup + delete go
    // through the service role so admin moderation works regardless of RLS
    // (allow-list admins have no user_roles row for policies to key on).
    const { data: msg } = await supabaseAdmin
      .from("community_messages")
      .select("user_id")
      .eq("id", data.id)
      .maybeSingle();

    if (!msg) throw new Error("Message not found");

    const isOwner = (msg as { user_id: string }).user_id === userId;
    if (!isOwner && !(await isAdmin(context))) throw new Error("forbidden");

    const { error } = await supabaseAdmin.from("community_messages").delete().eq("id", data.id);
    if (error) throw new Error("Failed to delete message");
    return { ok: true };
  });

export const togglePinMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid(), pin: z.boolean() }).parse(input))
  .handler(async ({ data, context }) => {
    // App-code admin check + service-role write, replacing the admin_toggle_pin
    // RPC: that RPC gates on a user_roles DB row, which allow-list admins lack.
    if (!(await isAdmin(context))) throw new Error("forbidden");
    const { error } = await supabaseAdmin
      .from("community_messages")
      .update({ is_pinned: data.pin })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

const DEFAULT_DAILY = [
  "What skill helped you most improve your logical thinking?",
  "What is the most useful thing you learned this week?",
  "What makes a great leader?",
  "Which habit changed your career trajectory?",
  "What advice would you give your past self?",
];

export const getCommunityDailyQuestion = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ communityId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }): Promise<{ question: string; createdAt: string | null }> => {
    const { supabase } = context;
    const { data: row } = await supabase
      .from("community_daily_questions")
      .select("question, created_at")
      .eq("community_id", data.communityId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (row) {
      const r = row as { question: string; created_at: string };
      return { question: r.question, createdAt: r.created_at };
    }
    const idx = Math.floor(Date.now() / 86400000) % DEFAULT_DAILY.length;
    return { question: DEFAULT_DAILY[idx], createdAt: null };
  });

export const setCommunityDailyQuestion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ communityId: z.string().uuid(), question: z.string().min(1).max(500) }).parse(input),
  )
  .handler(async ({ data, context }) => {
    // Same pattern as togglePinMessage: the admin_set_daily_question RPC only
    // accepts DB-role admins, so check in app code and write via service role.
    if (!(await isAdmin(context))) throw new Error("forbidden");
    const { error } = await supabaseAdmin
      .from("community_daily_questions")
      .insert({ community_id: data.communityId, question: data.question });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
