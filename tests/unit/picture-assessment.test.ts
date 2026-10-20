import { describe, expect, it } from "vitest";
import {
  PICTURE_PROPOSALS,
  PICTURE_BANK,
  pickPictureQuestions,
} from "@/lib/assessment/picture-bank.server";
import practiceData from "@/lib/assessment/picture-practice.json";
import {
  solvePicture,
  foldNet,
  validCubeView,
  publicPicture,
  type PictureProposal,
} from "@/lib/assessment/picture-rules";
import { pickSessionQuestions, getIQCorrect, IQ_BANK } from "@/lib/assessment/question-bank";
import {
  signSession,
  verifySession,
  sessionIQAnswerKeys,
  validateSessionSubmission,
} from "@/lib/assessment/session.server";
import {
  restorePictureSession,
  verifiedPictureProgress,
  progressSchema,
} from "@/lib/assessment/picture-progress.server";
import { emptyPictureDraft, validPictureDraft } from "@/lib/assessment/picture-draft";
import { pictureAssessmentEnabled } from "@/lib/assessment/picture-config.server";
import { formatReasoningScore } from "@/lib/assessment/reasoning-copy";
import { questionStatistics, type PictureStatEvent } from "@/lib/assessment/picture-statistics";

function permutations<T>(a: T[]): T[][] {
  return a.length <= 1
    ? [a]
    : a.flatMap((v, i) => permutations(a.filter((_, j) => j !== i)).map((rest) => [v, ...rest]));
}
function issued(child = false) {
  const s = pickSessionQuestions(child ? "child" : "teen_adult", true);
  const token = signSession({
    questionSetVersion: child ? "child-preferences-v1" : "picture-reasoning-v1",
    personality: s.personality.map((q) => q.id),
    iq: s.iq.map((q) => q.id),
    iqOptionOrders: s.iq.map((q) => q.optionOrder!),
    iqOptionIds: child ? [] : s.iq.map((q) => q.picture!.options.map((o) => o.id)),
    interest: s.interest.map((q) => ({ id: q.id, options: q.options.map((o) => o.id) })),
  });
  return { s, token, session: restorePictureSession(token) };
}
describe("approved original picture question set", () => {
  it("has exactly two versions of each slot and four disjoint practice items", () => {
    expect(PICTURE_BANK).toHaveLength(18);
    expect(practiceData).toHaveLength(4);
    for (let slot = 1; slot <= 9; slot++)
      expect(PICTURE_PROPOSALS.filter((q) => q.slot === slot).map((q) => q.version)).toEqual([
        "a",
        "b",
      ]);
    expect(pickPictureQuestions(() => 0).map((q) => q.picture!.slot)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9,
    ]);
    expect(pickPictureQuestions(() => 0.99).every((q) => q.picture!.version === "b")).toBe(true);
    for (const q of practiceData)
      expect([...PICTURE_BANK, ...IQ_BANK].some((i) => i.id === q.id)).toBe(false);
  });
  for (const q of [...PICTURE_PROPOSALS, ...(practiceData as unknown as PictureProposal[])]) {
    it(`${q.id}: exactly one rule-valid answer in every order, with a reason for every distractor`, () => {
      expect(q.options).toHaveLength(q.slot === 9 ? 3 : 4);
      for (const options of permutations(q.options))
        expect(solvePicture({ ...q, options })).toEqual([q.correctAnswerId]);
      for (const o of q.options)
        if (o.id !== q.correctAnswerId) expect(q.wrongAnswerExplanations[o.id]).toBeTruthy();
      for (const l of ["en", "ru", "uz"] as const) expect(q.questionLine[l]).toBeTruthy();
      const dto = JSON.stringify(publicPicture(q));
      expect(dto).not.toMatch(
        /"(correct|correctAnswerId|semantic|premises|dotOutside|normals|start|step|two|kinds|fills|ruleExplanation|wrongAnswerExplanations)":/,
      );
    });
  }
  it("folds six distinct face normals and permits exactly 24 proper cube views", () => {
    const normals = foldNet(PICTURE_PROPOSALS.find((q) => q.slot === 7)!.figureData.netCells!);
    let valid = 0;
    for (let t = 0; t < 6; t++)
      for (let f = 0; f < 6; f++)
        for (let r = 0; r < 6; r++) if (validCubeView(normals, [t, f, r])) valid++;
    expect(valid).toBe(24);
    expect(() =>
      foldNet([
        [0, 0],
        [1, 0],
        [2, 0],
        [3, 0],
        [4, 0],
        [5, 0],
      ]),
    ).toThrow();
  });
  it("selects one version per slot while preserving preferences, interests and child counts", () => {
    const { s, token, session } = issued();
    expect(s.personality).toHaveLength(12);
    expect(s.interest).toHaveLength(9);
    expect(s.iq.map((q) => q.picture!.slot)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    expect(s.iq.at(-1)!.options).toHaveLength(3);
    const keys = sessionIQAnswerKeys(
      verifySession(token),
      s.iq.map((q) => getIQCorrect(q.id)!),
    );
    expect(keys).toEqual(s.iq.map((q) => q.correct));
    expect(session.iq.map((q) => q.picture!.options.map((o) => o.id))).toEqual(
      s.iq.map((q) => q.picture!.options.map((o) => o.id)),
    );
    expect(JSON.stringify(session)).not.toMatch(
      /"(correct|riasec|direction|axis|correctAnswerId|ruleExplanation)":/,
    );
    const child = issued(true).session;
    expect(child.iq).toHaveLength(0);
    expect(child.interest).toHaveLength(18);
    expect(child.personality).toHaveLength(12);
    expect(getIQCorrect("c1")).toBe(2);
    expect(getIQCorrect("iq135")).not.toBeNull();
    expect(getIQCorrect("iq135_v2")).toBe(3);
  });
  it("rejects a fourth answer on a three-answer item and signed option ID tampering", () => {
    const { s, token } = issued(),
      claim = verifySession(token);
    const submission = {
      personalityQIds: claim.personality,
      iqQIds: claim.iq,
      iqAnswers: Array(9).fill(0),
      interestQIds: claim.interest.map((q) => q.id),
      interestAnswers: claim.interest.map((q) => [q.options[0]]),
    };
    expect(() => validateSessionSubmission(claim, submission)).not.toThrow();
    submission.iqAnswers[8] = 3;
    expect(() => validateSessionSubmission(claim, submission)).toThrow("membership");
    const forged = signSession({
      ...claim,
      iqOptionIds: s.iq.map((q) => q.picture!.options.map((o) => o.id + "-other")),
    });
    expect(() => restorePictureSession(forged)).toThrow("option ids");
  });
  it("validates complete durable progress and derives correctness only on the server", () => {
    const { session } = issued(),
      d = emptyPictureDraft(session);
    expect(validPictureDraft(d)).toBe(true);
    d.answers.personality[0] = 4;
    const id = session.personality[0].id;
    d.observations[id] = {
      shown: true,
      answered: true,
      chosenAnswer: `${id}:likert:4`,
      timeMs: 1234,
    };
    const input = progressSchema.parse({
      expectedOwner: "00000000-0000-4000-8000-000000000001",
      draft: d,
    });
    const verified = verifiedPictureProgress(input.draft);
    expect(verified.items[0].is_correct).toBeNull();
    expect(verified.items[0].time_ms).toBe(1234);
    const copied = structuredClone(input.draft);
    copied.observations[id].chosenAnswer = "foreign";
    expect(() => verifiedPictureProgress(copied)).toThrow("observation answer");
    copied.observations = {};
    expect(() => verifiedPictureProgress(copied)).toThrow("missing observation");
    expect(validPictureDraft({ ...d, step: 30 })).toBe(false);
    expect(validPictureDraft({ ...d, answers: { ...d.answers, iq: Array(9).fill(9) } })).toBe(
      false,
    );
  });
  it("keeps rollout off unless explicitly configured, with a separate production approval", () => {
    expect(pictureAssessmentEnabled({})).toBe(false);
    expect(
      pictureAssessmentEnabled({ ASSESSMENT_PICTURE_ENABLED: "true", NODE_ENV: "development" }),
    ).toBe(true);
    expect(
      pictureAssessmentEnabled({ ASSESSMENT_PICTURE_ENABLED: "true", NODE_ENV: "production" }),
    ).toBe(false);
    expect(
      pictureAssessmentEnabled({
        ASSESSMENT_PICTURE_ENABLED: "true",
        ASSESSMENT_PICTURE_ROLLOUT_APPROVED: "true",
        NODE_ENV: "production",
      }),
    ).toBe(true);
  });
  it("shows the requested new-set scale without reinterpreting historical counts", () => {
    for (const lang of ["en", "ru", "uz"] as const) {
      expect(formatReasoningScore(7, lang, "picture-reasoning-v1")).toContain("7.8 / 10");
      expect(formatReasoningScore(7, lang, "legacy-question-set-unknown")).not.toContain("/ 10");
    }
  });
  it("keeps honest denominators, unobserved data, version gaps and distractor flags", () => {
    const defs = PICTURE_PROPOSALS.map((q) => ({
      id: q.id,
      setVersion: "picture-reasoning-v1",
      slot: q.slot,
      version: q.version,
      difficulty: q.difficulty,
      correctId: q.correctAnswerId,
      optionIds: q.options.map((o) => o.id),
    }));
    expect(
      questionStatistics([], defs).questions.every(
        (q) => q.percentCorrect === null && q.averageTimeMs === null,
      ),
    ).toBe(true);
    const q = defs[0],
      event: PictureStatEvent = {
        user_id: "student",
        session_nonce: "a",
        question_id: q.id,
        question_set_version: q.setVersion,
        section: "cognitive",
        age_group: "teen_adult",
        slot: q.slot,
        item_version: q.version,
        shown: true,
        answered: true,
        chosen_answer: q.correctId,
        time_ms: 2000,
        is_correct: true,
      };
    const wrong = q.optionIds.find((id) => id !== q.correctId)!;
    const stats = questionStatistics(
      [
        event,
        { ...event, session_nonce: "b", chosen_answer: wrong, is_correct: false, time_ms: 4000 },
        { ...event, session_nonce: "c", chosen_answer: wrong, is_correct: false },
        {
          ...event,
          session_nonce: "d",
          answered: false,
          chosen_answer: null,
          is_correct: null,
          time_ms: 0,
        },
        event,
      ],
      defs,
    );
    const first = stats.questions.find((s) => s.id === q.id)!;
    expect(first.shown).toBe(4);
    expect(first.answered).toBe(3);
    expect(first.percentCorrect).toBeCloseTo(100 / 3);
    expect(first.averageTimeMs).toBe(2000);
    expect(first.distractorWins).toBe(true);
    expect(first.outsideTarget).toBe(true);
    expect(stats.students).toBe(1);
    expect(stats.pairs[0].delta).toBeNull();
  });
});
