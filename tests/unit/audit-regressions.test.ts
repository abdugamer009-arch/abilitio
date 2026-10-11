import { describe, expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { loadForAccount, type AccountLoad } from "@/lib/account-load";
import { rememberSavedAssessment } from "@/lib/assessment/saved-attempt";
import { resultInterestProfile } from "@/lib/assessment/result-interest-profile";
import {
  scoreInterests,
  deriveRiasecFromInterests,
  hollandCode,
} from "@/lib/assessment/career-engine";
import { IQ_BANK, getIQCorrect, getInterestRiasec } from "@/lib/assessment/question-bank";
import { loadOwnedSchool } from "@/lib/schools/owned-school";

const tick = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

describe("audit regressions", () => {
  it("ignores a delayed previous-account result and clears old data while loading", async () => {
    let resolveA!: (value: string) => void;
    let resolveB!: (value: string) => void;
    const a = new Promise<string>((resolve) => {
      resolveA = resolve;
    });
    const b = new Promise<string>((resolve) => {
      resolveB = resolve;
    });
    let state: AccountLoad<string> | null = null;
    const publish = (next: AccountLoad<string>) => {
      state = next;
    };
    const cancelA = loadForAccount("A", () => a, publish);
    cancelA();
    loadForAccount("B", () => b, publish);
    expect(state).toEqual({ ownerId: "B", data: null, error: null, loaded: false });
    resolveB("B profile");
    await tick();
    resolveA("A profile");
    await tick();
    expect(state).toEqual({ ownerId: "B", data: "B profile", error: null, loaded: true });
  });

  it("ignores stale errors and resets an error for a fresh load", async () => {
    const publish = vi.fn();
    let reject!: (error: Error) => void;
    const old = new Promise<string>((_, r) => {
      reject = r;
    });
    const cancel = loadForAccount("A", () => old, publish);
    cancel();
    loadForAccount("B", async () => "B profile", publish);
    reject(new Error("A failed"));
    await tick();
    expect(publish.mock.calls.at(-1)?.[0]).toEqual({
      ownerId: "B",
      data: "B profile",
      error: null,
      loaded: true,
    });
    loadForAccount(
      "B",
      async () => {
        throw new Error("network");
      },
      publish,
    );
    await tick();
    expect(publish.mock.calls.at(-1)?.[0].error).toBe("network");
    loadForAccount("B", async () => "recovered", publish);
    expect(publish.mock.calls.at(-1)?.[0]).toEqual({
      ownerId: "B",
      data: null,
      error: null,
      loaded: false,
    });
    await tick();
    expect(publish.mock.calls.at(-1)?.[0].error).toBeNull();
  });

  it("keeps a successful save usable despite blocked or full browser storage", () => {
    const removeItem = vi.fn();
    expect(() =>
      rememberSavedAssessment(
        "saved",
        "draft",
        () => ({
          setItem() {
            throw new Error("quota");
          },
        }),
        () => ({ removeItem }),
      ),
    ).not.toThrow();
    expect(removeItem).toHaveBeenCalledWith("draft");
    const blocked = () => {
      throw new Error("storage access denied");
    };
    expect(() => rememberSavedAssessment("saved", "draft", blocked, blocked)).not.toThrow();
  });

  it("grades six primes correctly without changing old signed question keys", () => {
    const primes = Array.from({ length: 19 }, (_, i) => i + 11).filter((n) =>
      Array.from({ length: n - 2 }, (_, i) => i + 2).every((d) => n % d !== 0),
    );
    const q = IQ_BANK.find((q) => q.id === "iq135_v2")!;
    expect(primes).toEqual([11, 13, 17, 19, 23, 29]);
    expect(q.options[getIQCorrect(q.id)!]).toBe(String(primes.length));
    expect(getIQCorrect("iq135")).toBe(2);
    expect(IQ_BANK.some((q) => q.id === "iq135")).toBe(false);
  });

  it("preserves the exact dominant interest across save/reload instead of projecting it twice", () => {
    const ids = [
      "o2_camera",
      "m1_clay",
      "e1_fire",
      "d1_guitar",
      "s2_square",
      "p2_organic",
      "a1_dolphin",
      "l2_zigzag",
      "c1_fresh",
    ];
    const scored = scoreInterests(ids.map((id) => getInterestRiasec(id)!));
    expect(hollandCode(scored.riasec)[0]).toBe("A");
    expect(hollandCode(deriveRiasecFromInterests(scored.interests))[0]).toBe("E");
    const loaded = resultInterestProfile(
      JSON.parse(JSON.stringify(scored.riasec)),
      scored.interests,
    );
    expect(loaded.riasec_profile).toEqual(scored.riasec);
    expect(loaded.holland_code[0]).toBe("A");
    expect(loaded.riasec_is_estimated).toBe(false);
    expect(resultInterestProfile(null, scored.interests).riasec_is_estimated).toBe(true);
    expect(resultInterestProfile({ R: 99 }, scored.interests).riasec_is_estimated).toBe(true);
  });

  it("limits school selection before maybeSingle and uses deterministic newest ordering", async () => {
    const query = {
      select: vi.fn(),
      eq: vi.fn(),
      order: vi.fn(),
      limit: vi.fn(),
      maybeSingle: vi.fn(),
    };
    for (const method of [query.select, query.eq, query.order, query.limit])
      method.mockReturnValue(query);
    query.maybeSingle.mockImplementation(async () =>
      query.limit.mock.calls.at(-1)?.[0] === 1
        ? { data: { id: "newest-school" }, error: null }
        : { data: null, error: { message: "multiple schools" } },
    );
    const from = vi.fn().mockReturnValue(query);
    const client = { from } as unknown as SupabaseClient<Database>;
    expect(await loadOwnedSchool(client, "principal")).toEqual({ id: "newest-school" });
    expect(query.eq).toHaveBeenCalledWith("owner_user_id", "principal");
    expect(query.order.mock.calls).toEqual([
      ["created_at", { ascending: false }],
      ["id", { ascending: false }],
    ]);
    query.maybeSingle.mockResolvedValueOnce({ data: null, error: null });
    await expect(loadOwnedSchool(client, "outsider")).rejects.toThrow("not_principal");
    query.maybeSingle.mockResolvedValueOnce({ data: null, error: { message: "offline" } });
    await expect(loadOwnedSchool(client, "principal")).rejects.toThrow("offline");
  });
});
