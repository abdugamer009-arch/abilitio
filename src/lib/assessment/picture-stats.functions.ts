import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
export const getPictureQuestionStats = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { ensureAdmin } = await import("../admin/access.server");
    await ensureAdmin(context);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { readAll } = await import("../db-read");
    const rows = await readAll((from, to) =>
      supabaseAdmin
        .from("picture_assessment_items")
        .select("*")
        .order("user_id")
        .order("session_nonce")
        .order("question_id")
        .range(from, to),
    );
    const { PICTURE_PROPOSALS } = await import("./picture-bank.server");
    const { questionStatistics } = await import("./picture-statistics");
    const { PERSONALITY_BANK, INTEREST_BANK } = await import("./question-bank");
    const { CHILD_PERSONALITY, CHILD_INTEREST } = await import("./child-questions");
    const { ADULT_ACTIVITY_BANK } = await import("./activity-questions");
    const extras: import("./picture-statistics").StatDefinition[] = [];
    for (const e of rows) {
      if (
        e.section === "cognitive" ||
        extras.some(
          (d) =>
            d.id === e.question_id &&
            d.setVersion === e.question_set_version &&
            d.ageGroup === e.age_group,
        )
      )
        continue;
      const p = [...PERSONALITY_BANK, ...CHILD_PERSONALITY].find((q) => q.id === e.question_id);
      const interest = [...INTEREST_BANK, ...CHILD_INTEREST, ...ADULT_ACTIVITY_BANK].find(
        (q) => q.id === e.question_id,
      );
      extras.push({
        id: e.question_id,
        setVersion: e.question_set_version,
        ageGroup: e.age_group,
        section: e.section,
        slot: null,
        version: null,
        difficulty: null,
        correctId: null,
        optionIds: p
          ? [1, 2, 3, 4, 5].map((v) => `${p.id}:likert:${v}`)
          : (interest?.options.map((o) => o.id) ?? []),
      });
    }
    return questionStatistics(rows, [
      ...PICTURE_PROPOSALS.map((q) => ({
        id: q.id,
        setVersion: "picture-reasoning-v1",
        slot: q.slot,
        version: q.version,
        difficulty: q.difficulty,
        correctId: q.correctAnswerId,
        optionIds: q.options.map((o) => o.id),
      })),
      ...extras,
    ]);
  });
