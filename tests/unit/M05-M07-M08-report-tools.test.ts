import { describe, it, expect } from "vitest";
import {
  historyLabel,
  filterCareers,
  initialComparison,
  chooseDistinct,
} from "@/lib/assessment/report-tools";
describe("M05 M07 M08 report controls", () => {
  it("formats history without merging labels or inventing a child score", () => {
    expect(historyLabel(1, "ISFP", "en")).toBe("Reasoning: 1/9 · Type: ISFP");
    expect(historyLabel(null, "XXXX", "en")).not.toContain("0/9");
  });
  it("filters counts with the actual result set", () => {
    expect(filterCareers([{ name: "Engineer", category: "Technology" }], "nothing")).toHaveLength(
      0,
    );
    expect(filterCareers([{ name: "Engineer", category: "Technology" }], " tech ")).toHaveLength(1);
  });
  it("preselects three saved recommendations and rejects duplicate selections", () => {
    expect(initialComparison(["a", "b", "c", "d"])).toEqual(["a", "b", "c"]);
    expect(chooseDistinct(["a", "b", "c"], 1, "a")).toEqual(["a", "b", "c"]);
    expect(initialComparison([])).toEqual(["", "", ""]);
  });
});
