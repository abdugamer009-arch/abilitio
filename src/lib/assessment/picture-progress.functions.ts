import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import type { PictureDraft } from "./picture-draft";
import type { Json } from "@/integrations/supabase/types";
import { readAll } from "../db-read";

export const savePictureDraft = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(async (input: unknown) => {
    const { progressSchema } = await import("./picture-progress.server");
    return progressSchema.parse(input);
  })
  .handler(async ({ data, context }) => {
    if (data.expectedOwner !== context.userId)
      throw new Error("Account changed; reload your draft.");
    const { verifiedPictureProgress } = await import("./picture-progress.server");
    const { draft, claim, items } = verifiedPictureProgress(data.draft);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { session, ...payload } = draft;
    const result = await supabaseAdmin.rpc("save_picture_progress", {
      _user_id: context.userId,
      _nonce: claim.nonce,
      _set_version: claim.questionSetVersion!,
      _expires_at: new Date(claim.expires).toISOString(),
      _revision: draft.revision,
      _payload: { ...payload, sessionToken: session.sessionToken } as unknown as Json,
      _items: items as unknown as Json,
    });
    if (result.error)
      throw new Error("Account draft was not saved. Check the picture assessment migration.");
    if (!result.data) throw new Error("A newer draft exists. Reload to continue.");
    return { saved: true };
  });
export const loadPictureDraft = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<PictureDraft | null> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [drafts, results] = await Promise.all([
      readAll((from, to) =>
        supabaseAdmin
          .from("picture_assessment_drafts")
          .select("*")
          .eq("user_id", context.userId)
          .gt("expires_at", new Date().toISOString())
          .order("updated_at", { ascending: false })
          .order("session_nonce")
          .range(from, to),
      ),
      readAll((from, to) =>
        supabaseAdmin
          .from("career_assessment_results")
          .select("session_nonce")
          .eq("user_id", context.userId)
          .order("id")
          .range(from, to),
      ),
    ]);
    const completed = new Set(results.map((r) => r.session_nonce));
    const { progressSchema, verifiedPictureProgress } = await import("./picture-progress.server");
    for (const row of drafts) {
      if (completed.has(row.session_nonce)) continue;
      const p = row.payload as Record<string, Json>;
      const parsed = progressSchema.safeParse({
        expectedOwner: context.userId,
        draft: { ...p, session: { sessionToken: p.sessionToken } },
      });
      if (!parsed.success) throw new Error("The saved draft is invalid.");
      const verified = verifiedPictureProgress(parsed.data.draft);
      return verified.draft;
    }
    return null;
  });
export const deletePictureDraft = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((v: unknown) => z.object({ sessionToken: z.string().min(1).max(12000) }).parse(v))
  .handler(async ({ data, context }) => {
    const { verifySession } = await import("./session.server");
    const c = verifySession(data.sessionToken);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin
      .from("picture_assessment_drafts")
      .delete()
      .eq("user_id", context.userId)
      .eq("session_nonce", c.nonce);
    if (error) throw new Error("Draft was not cleared.");
    return { deleted: true };
  });
