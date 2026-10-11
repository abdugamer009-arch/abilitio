import { describe, expect, it } from "vitest";
import { readAll } from "@/lib/db-read";

describe("database pagination", () => {
  it("reads beyond API row limits", async () => {
    const rows = Array.from({ length: 1201 }, (_, id) => ({ id }));
    const result = await readAll(async (from, to) => ({
      data: rows.slice(from, to + 1),
      error: null,
    }));
    expect(result).toEqual(rows);
  });
  it("rejects a failed later page rather than returning partial totals", async () => {
    await expect(
      readAll(async (from) =>
        from
          ? { data: null, error: { message: "offline" } }
          : { data: Array(500).fill(1), error: null },
      ),
    ).rejects.toThrow("offline");
  });
});
