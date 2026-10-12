import { describe, expect, it } from "vitest";
import { CAREER_CATALOG, MAJOR_CATALOG } from "@/lib/assessment/catalog.server";
import { catalogLabel, catalogLabels } from "@/lib/catalog-labels";
import { guidePrompts, localizedGuideReply } from "@/lib/abbi/localized-guide";

describe("localized catalog and guide", () => {
  it.each(["uz", "ru"] as const)("covers all canonical names in %s", (lang) => {
    expect(CAREER_CATALOG).toHaveLength(166);
    for (const item of [...CAREER_CATALOG, ...MAJOR_CATALOG]) {
      expect(catalogLabels[item.name]?.[lang], item.name).toBeTruthy();
      expect(catalogLabel(item.name, "en")).toBe(item.name);
    }
    expect(guidePrompts(lang)).toHaveLength(12);
  });
  it("responds to localized exam and child prompts", () => {
    expect(localizedGuideReply("Как подготовиться к IELTS?", {}, "ru")).toContain("официального");
    expect(localizedGuideReply("SAT ga qanday tayyorlanaman?", {}, "uz")).toContain("Rasmiy");
    expect(localizedGuideReply("?", { ageGroup: "child" }, "ru")).toContain("взрослым");
  });
});
