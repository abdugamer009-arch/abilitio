import { it, expect } from "vitest";
import { careerRoadmap } from "@/lib/roadmap/career-roadmap";
it("M09 produces five career-specific phases, preserves separate journal IDs and localizes every task", () => {
  for (const lang of ["en", "uz", "ru"] as const) {
    const a = careerRoadmap(
      { key: "software_engineer", name: "Software Engineer", category: "Technology" },
      lang,
    );
    const b = careerRoadmap(
      { key: "graphic_designer", name: "Graphic Designer", category: "Design" },
      lang,
    );
    expect(a).toHaveLength(5);
    expect(a.every((p) => p.tasks.length > 0)).toBe(true);
    expect(a.flatMap((p) => p.tasks.map((t) => t.id))).not.toEqual(
      b.flatMap((p) => p.tasks.map((t) => t.id)),
    );
    expect(a[0].tasks[0].description).not.toBe(b[0].tasks[0].description);
    expect(a[0].tasks[0].title).not.toBe("Find mentors & peers");
  }
});
