import { describe, it, expect, vi } from "vitest";
// @ts-expect-error Standalone operational JavaScript tool.
import { cleanup } from "../../scripts/cleanup-qa.mjs";
const manifest = {
  ownerId: "11111111-1111-4111-8111-111111111111",
  resultIds: ["22222222-2222-4222-8222-222222222222"],
  communityIds: [],
};
describe("V06 exact-owner QA cleanup", () => {
  it("dry runs without a delete and refuses unconfirmed or non-owned IDs", async () => {
    const remove = vi.fn();
    const q = {
      select: vi.fn(),
      eq: vi.fn(),
      in: vi.fn().mockResolvedValue({ data: [{ id: manifest.resultIds[0] }], error: null }),
      delete: remove,
    };
    q.select.mockReturnValue(q);
    q.eq.mockReturnValue(q);
    const client = { from: () => q };
    expect((await cleanup(client, manifest)).mode).toBe("dry-run");
    expect(remove).not.toHaveBeenCalled();
    await expect(cleanup(client, manifest, true, "")).rejects.toThrow(/confirmation/);
    expect(remove).not.toHaveBeenCalled();
    q.in.mockResolvedValue({ data: [], error: null });
    await expect(cleanup(client, manifest)).rejects.toThrow(/no deletions/);
  });
});
