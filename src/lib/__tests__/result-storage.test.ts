import { describe, expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { persistAssessmentResult } from "../assessment/result-storage.server";

const input = { user_id: "test-owner", session_nonce: "signed-attempt" };
const row = { id: "saved-result", ...input, cognitive_score: 6 };
function database(
  insert: { data: typeof row | null; error: { code: string; message: string } | null },
  read = { data: row as typeof row | null, error: null as { message: string } | null },
) {
  const query = {
    insert: vi.fn(),
    select: vi.fn(),
    eq: vi.fn(),
    single: vi.fn().mockResolvedValue(insert),
    maybeSingle: vi.fn().mockResolvedValue(read),
  };
  for (const method of [query.insert, query.select, query.eq]) method.mockReturnValue(query);
  const from = vi.fn().mockReturnValue(query);
  return { client: { from } as unknown as SupabaseClient<Database>, from, query };
}
describe("assessment result storage", () => {
  it("returns the server-saved result without a second query", async () => {
    const db = database({ data: row, error: null });
    expect(await persistAssessmentResult(db.client, input)).toEqual(row);
    expect(db.query.insert).toHaveBeenCalledWith(input);
    expect(db.from).toHaveBeenCalledTimes(1);
  });
  it("recovers a retry after a saved response was lost, scoped to owner and attempt", async () => {
    const db = database({ data: null, error: { code: "23505", message: "duplicate" } });
    expect(await persistAssessmentResult(db.client, input)).toEqual(row);
    expect(db.query.eq.mock.calls).toEqual([
      ["user_id", "test-owner"],
      ["session_nonce", "signed-attempt"],
    ]);
    expect(db.query.insert).toHaveBeenCalledTimes(1);
  });
  it("does not treat an unrelated unique conflict as a successful save", async () => {
    const db = database(
      { data: null, error: { code: "23505", message: "other constraint" } },
      { data: null, error: null },
    );
    await expect(persistAssessmentResult(db.client, input)).rejects.toThrow("other constraint");
  });
  it("does not bypass a missing migration by dropping the nonce or using owner writes", async () => {
    const db = database({
      data: null,
      error: { code: "PGRST204", message: "session_nonce missing from schema cache" },
    });
    await expect(persistAssessmentResult(db.client, input)).rejects.toThrow("session_nonce");
    expect(db.from).toHaveBeenCalledTimes(1);
    expect(db.query.insert).toHaveBeenCalledWith(input);
  });
  it("does not claim success when reading an existing attempt fails", async () => {
    const db = database(
      { data: null, error: { code: "23505", message: "duplicate" } },
      { data: null, error: { message: "read failed" } },
    );
    await expect(persistAssessmentResult(db.client, input)).rejects.toThrow("duplicate");
  });
});
