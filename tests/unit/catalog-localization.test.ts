import { describe, expect, it } from "vitest";
import { CAREER_CATALOG, MAJOR_CATALOG } from "@/lib/assessment/catalog.server";
import { catalogLabel, catalogLabels } from "@/lib/catalog-labels";
import { guidePrompts, localizedGuideReply } from "@/lib/abbi/localized-guide";
import { CAREER_GUIDES, careerGuideReply } from "@/lib/abbi/career-guides";
import { CAREERS } from "@/lib/abbi/abbi-knowledge";

describe("localized catalog and guide", () => {
  it.each(["uz", "ru"] as const)(
    "gives specific work and practice guidance for all 17 guide careers in %s",
    (lang) => {
      expect(Object.keys(CAREER_GUIDES).sort()).toEqual(
        CAREERS.map((career) => career.name).sort(),
      );
      const index = lang === "uz" ? 0 : 1;
      for (const guide of Object.values(CAREER_GUIDES)) {
        const reply = localizedGuideReply(guide.names[index], {}, lang);
        expect(reply).toContain(guide.work[index]);
        expect(reply).toContain(guide.skills[index]);
        expect(reply).toContain(guide.activity[index]);
      }
    },
  );
  it("keeps English aliases useful and does not turn an unknown career into a fabricated guide", () => {
    expect(careerGuideReply("What does a programmer do?", "ru")).toContain("проверяет код");
    expect(careerGuideReply("Space flower inspector", "uz")).toBeNull();
  });
  it("keeps salary and university queries in their dedicated cautious branches", () => {
    expect(localizedGuideReply("Сколько зарабатывает аналитик данных?", {}, "ru")).toContain(
      "Доход зависит",
    );
    expect(
      localizedGuideReply("Dasturiy ta’minot muhandisi uchun universitet?", {}, "uz"),
    ).toContain("rasmiy havolalardan");
  });
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
