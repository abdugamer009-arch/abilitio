import { signSession } from "@/lib/assessment/session.server";
import { restorePictureSession } from "@/lib/assessment/picture-progress.server";
import { describe, expect, it } from "vitest";
import {
  CHILD_INTEREST,
  LEGACY_CHILD_INTEREST,
  CHILD_TRANSLATIONS,
} from "@/lib/assessment/child-questions";
import { getInterestRiasec, pickSessionQuestions } from "@/lib/assessment/question-bank";

describe("REQUEST-08: varied child activities without changing historical answers", () => {
  it("has a distinct answer set for every question, localized with balanced weights", () => {
    expect(CHILD_INTEREST).toHaveLength(20);
    const labels = CHILD_INTEREST.flatMap((q) => q.options.map((o) => o.label));
    expect(new Set(labels).size).toBe(120);
    for (const q of CHILD_INTEREST) {
      expect(
        new Set(q.options.map((o) => (o.visual.kind === "icon" ? o.visual.icon : ""))).size,
      ).toBe(6);
      expect(q.options.map((o) => o.riasec)).toEqual(
        ["R", "I", "A", "S", "E", "C"].map((d) => ({ [d]: 3 })),
      );
      for (const lang of ["ru", "uz"] as const) {
        const translated = CHILD_TRANSLATIONS[q.id][lang];
        expect(translated.prompt).toBeTruthy();
        expect(translated.options).toHaveLength(6);
        expect(translated.options!.every(Boolean)).toBe(true);
      }
    }
  });
  it("restores old signed sessions with their original labels and accepts new sessions", () => {
    for (const [version, pool] of [
      ["child-preferences-v1", LEGACY_CHILD_INTEREST],
      ["child-preferences-v2", CHILD_INTEREST],
    ] as const) {
      const selected = pickSessionQuestions("child", true);
      const interest = pool.slice(0, 18);
      const token = signSession({
        questionSetVersion: version,
        personality: selected.personality.map((q) => q.id),
        iq: [],
        iqOptionOrders: [],
        iqOptionIds: [],
        interest: interest.map((q) => ({ id: q.id, options: q.options.map((o) => o.id) })),
      });
      const restored = restorePictureSession(token);
      expect(restored.interest[0].labels.en).toEqual(interest[0].options.map((o) => o.label));
      expect(restored.questionSetVersion).toBe(version);
    }
  });
  it("retains every original option ID and score while selecting only the new pool", () => {
    expect(LEGACY_CHILD_INTEREST[0].id).toBe("ci1");
    expect(LEGACY_CHILD_INTEREST[0].options[0].label).toBe("Build a toy house");
    for (const q of [...LEGACY_CHILD_INTEREST, ...CHILD_INTEREST])
      for (const o of q.options) expect(getInterestRiasec(o.id)).toEqual(o.riasec);
    const session = pickSessionQuestions("child", true);
    expect(session.iq).toHaveLength(0);
    expect(session.interest).toHaveLength(18);
    expect(session.interest.every((q) => q.id.startsWith("ci_v2_"))).toBe(true);
  });
});
