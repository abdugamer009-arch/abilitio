import { describe, expect, it } from "vitest";
import { schoolBucket, SCHOOL_STRENGTHS } from "@/lib/schools/school-model";
describe("school summary compatibility", () => {
  it("uses the category for expanded careers and does not invent a research fallback", () => {
    expect(schoolBucket({ name: "New cybersecurity role", category: "Technology" })).toBe(
      "technology",
    );
    expect(schoolBucket({ name: "Unmapped role" })).toBeNull();
    expect(schoolBucket({ name: "Software Engineer" })).toBe("technology");
  });
  it("recognizes current persisted strength phrases", () => {
    expect(SCHOOL_STRENGTHS.some((s) => s.labels.includes("Confident communicator"))).toBe(true);
    expect(SCHOOL_STRENGTHS.some((s) => s.labels.includes("Strong analytical reasoning"))).toBe(
      true,
    );
  });
});
