import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import type { Database } from "@/integrations/supabase/types";

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

async function isAdmin(supabase: SupabaseClient<Database>, userId: string): Promise<boolean> {
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId).eq("role", "admin").maybeSingle();
  return !!data;
}

export const getMyCommunities = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<{ communities: CommunityDTO[]; isAdmin: boolean }> => {
    const { supabase, userId } = context;
    const admin = await isAdmin(supabase, userId);
    if (admin) {
      const { data } = await supabase.from("communities").select("*").order("name");
      return { communities: (data ?? []) as CommunityDTO[], isAdmin: true };
    }
    const { data: memberships } = await supabase
      .from("community_members")
      .select("community_id")
      .eq("user_id", userId);
    const ids = (memberships ?? []).map((m: any) => m.community_id);
    if (!ids.length) return { communities: [], isAdmin: false };
    const { data } = await supabase.from("communities").select("*").in("id", ids);
    return { communities: (data ?? []) as CommunityDTO[], isAdmin: false };
  });

export const assignMyCommunity = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { careerKey: string }) => input)
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { data: cid, error } = await supabase.rpc("assign_user_to_community", { _career_key: data.careerKey });
    if (error) throw new Error(error.message);
    return { communityId: cid as unknown as string };
  });

export const getCommunityMessages = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { communityId: string; limit?: number }) => input)
  .handler(async ({ data, context }): Promise<{ messages: CommunityMessageDTO[]; authors: AuthorDTO[] }> => {
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
  });

export const fetchMessageAuthors = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { userIds: string[] }) => input)
  .handler(async ({ data, context }): Promise<AuthorDTO[]> => {
    return fetchAuthors(data.userIds);
  });

async function fetchAuthors(userIds: string[]): Promise<AuthorDTO[]> {
  if (!userIds.length) return [];
  const [profiles, stats, roles] = await Promise.all([
    supabaseAdmin.from("profiles").select("id, name, surname").in("id", userIds),
    supabaseAdmin.from("user_stats").select("user_id, avatar_url").in("user_id", userIds),
    supabaseAdmin.from("user_roles").select("user_id").eq("role", "admin").in("user_id", userIds),
  ]);
  const sMap = new Map<string, string | null>();
  for (const s of stats.data ?? []) sMap.set((s as any).user_id, (s as any).avatar_url);
  const adminSet = new Set<string>((roles.data ?? []).map((r: any) => r.user_id));
  return (profiles.data ?? []).map((p: any) => ({
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
    const { supabase, userId } = context;

    // Verify ownership or admin role before deleting
    const { data: msg } = await supabase
      .from("community_messages")
      .select("user_id")
      .eq("id", data.id)
      .maybeSingle();

    if (!msg) throw new Error("Message not found");

    const isOwner = (msg as { user_id: string }).user_id === userId;
    if (!isOwner) {
      const { data: role } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      if (!role) throw new Error("forbidden");
    }

    const { error } = await supabase.from("community_messages").delete().eq("id", data.id);
    if (error) throw new Error("Failed to delete message");
    return { ok: true };
  });

export const togglePinMessage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ id: z.string().uuid(), pin: z.boolean() }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { error } = await supabase.rpc("admin_toggle_pin", { _msg: data.id, _pin: data.pin });
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
  .inputValidator((input: { communityId: string }) => input)
  .handler(async ({ data, context }): Promise<{ question: string; createdAt: string | null }> => {
    const { supabase } = context;
    const { data: row } = await supabase
      .from("community_daily_questions")
      .select("question, created_at")
      .eq("community_id", data.communityId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (row) return { question: (row as any).question, createdAt: (row as any).created_at };
    const idx = Math.floor(Date.now() / 86400000) % DEFAULT_DAILY.length;
    return { question: DEFAULT_DAILY[idx], createdAt: null };
  });

export const setCommunityDailyQuestion = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ communityId: z.string().uuid(), question: z.string().min(1).max(500) }).parse(input))
  .handler(async ({ data, context }) => {
    const { supabase } = context;
    const { error } = await supabase.rpc("admin_set_daily_question", { _community: data.communityId, _q: data.question });
    if (error) throw new Error(error.message);
    return { ok: true };
  });
