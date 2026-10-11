import { describe, expect, it } from "vitest";
import { validateCatalog } from "../assessment/catalog";

describe("assessment catalog", () => {
  it("rejects missing or empty catalogs before a result can be saved", () => {
    expect(() => validateCatalog(null, [])).toThrow("unavailable");
    expect(() => validateCatalog([], [])).toThrow("unavailable");
  });
  it("rejects malformed matching weights", () => {
    expect(() => validateCatalog([{ key: "x", demand_score: NaN }], [{}])).toThrow("unavailable");
  });
});
