import { z } from "zod";
import { PERSONALITY_BANK, INTEREST_BANK } from "./question-bank";
import { CHILD_PERSONALITY, CHILD_INTEREST } from "./child-questions";
import { ADULT_ACTIVITY_BANK } from "./activity-questions";
import { PICTURE_BANK } from "./picture-bank.server";
import { QUESTION_TRANSLATIONS } from "./question-translations";
import {
  verifySession,
  validateSessionSubmission,
  sessionIQAnswerKeys,
  type SessionClaims,
} from "./session.server";
import type { ClientSession, LangText, LangOpts } from "./career.functions";
import type { PictureDraft, ItemObservation } from "./picture-draft";
import { PICTURE_SET_VERSION } from "./picture-types";

const nullableChoice = z.number().int().min(0).max(3).nullable();
export const progressSchema = z.object({
  expectedOwner: z.string().uuid(),
  draft: z.object({
    session: z.object({ sessionToken: z.string().min(1).max(12000) }),
    step: z.number().int().min(0).max(29),
    screen: z.enum(["start", "question", "reasoning-intro", "part-done", "finish"]),
    answers: z.object({
      personality: z.array(z.number().int().min(1).max(5).nullable()).length(12),
      iq: z.array(nullableChoice).max(9),
      interest: z
        .array(z.array(z.string().max(150)).max(1))
        .min(9)
        .max(18),
    }),
    observations: z.record(
      z.string().max(150),
      z
        .object({
          shown: z.boolean(),
          answered: z.boolean(),
          chosenAnswer: z.string().max(150).nullable(),
          timeMs: z.number().finite().min(0).max(86400000),
        })
        .strict(),
    ),
    revision: z.number().int().min(0).max(2147483646),
    updatedAt: z.number().finite(),
  }),
});
const lp = (id: string, en: string): LangText => ({
  en,
  ru: QUESTION_TRANSLATIONS[id]?.ru?.prompt ?? en,
  uz: QUESTION_TRANSLATIONS[id]?.uz?.prompt ?? en,
});
const lo = (id: string, en: string[]): LangOpts => ({
  en,
  ru: QUESTION_TRANSLATIONS[id]?.ru?.options ?? en,
  uz: QUESTION_TRANSLATIONS[id]?.uz?.options ?? en,
});
function acceptedClaim(token: string): SessionClaims {
  const c = verifySession(token);
  if (
    ![PICTURE_SET_VERSION, "child-preferences-v1"].includes(c.questionSetVersion ?? "") ||
    c.personality.length !== 12 ||
    ![0, 9].includes(c.iq.length) ||
    c.iq.length + c.interest.length !== 18
  )
    throw new Error("invalid_session: question set");
  if (c.questionSetVersion === PICTURE_SET_VERSION && c.iq.length !== 9)
    throw new Error("invalid_session: picture count");
  if (c.questionSetVersion === "child-preferences-v1" && c.iq.length !== 0)
    throw new Error("invalid_session: child count");
  return c;
}
/** Rebuild safe wording and drawings from signed membership. Never trust stored DTO content. */
export function restorePictureSession(token: string): ClientSession {
  const c = acceptedClaim(token),
    child = c.iq.length === 0;
  return {
    sessionToken: token,
    questionSetVersion: c.questionSetVersion,
    personality: c.personality.map((id) => {
      const q = (child ? CHILD_PERSONALITY : PERSONALITY_BANK).find((q) => q.id === id);
      if (!q) throw new Error("invalid_session: preference");
      return { id, prompt: lp(id, q.prompt) };
    }),
    iq: c.iq.map((id, i) => {
      const q = PICTURE_BANK.find((q) => q.id === id);
      if (!q?.picture) throw new Error("invalid_session: picture");
      const order = c.iqOptionOrders?.[i];
      if (
        !order ||
        order.length !== q.options.length ||
        new Set(order).size !== order.length ||
        order.some((n) => !Number.isInteger(n) || n < 0 || n >= q.options.length)
      )
        throw new Error("invalid_session: picture ordering");
      const options = order.map((n) => q.picture!.options[n]);
      if (JSON.stringify(options.map((o) => o.id)) !== JSON.stringify(c.iqOptionIds?.[i]))
        throw new Error("invalid_session: picture option ids");
      return {
        id,
        prompt: q.picture.prompt,
        picture: { ...q.picture, options },
        options: Object.fromEntries(
          (["en", "ru", "uz"] as const).map((l) => [
            l,
            options.map((o) => o.figure.text?.[l] ?? o.label[l]),
          ]),
        ) as LangOpts,
      };
    }),
    interest: c.interest.map(({ id, options }) => {
      const q =
        (child ? CHILD_INTEREST : ADULT_ACTIVITY_BANK).find((q) => q.id === id) ??
        INTEREST_BANK.find((q) => q.id === id);
      if (!q) throw new Error("invalid_session: interests");
      const canonical = lo(
          id,
          q.options.map((o) => o.label),
        ),
        order = options.map((id) => q.options.findIndex((o) => o.id === id));
      if (
        order.some((i) => i < 0) ||
        new Set(order).size !== order.length ||
        order.length !== q.options.length
      )
        throw new Error("invalid_session: interest options");
      return {
        id,
        theme: q.theme,
        prompt: lp(id, q.prompt),
        options: order.map((i) => ({ id: q.options[i].id, visual: q.options[i].visual })),
        labels: Object.fromEntries(
          (["en", "ru", "uz"] as const).map((l) => [l, order.map((i) => canonical[l][i])]),
        ) as LangOpts,
      };
    }),
  };
}
export function verifiedPictureProgress(input: z.infer<typeof progressSchema>["draft"]) {
  const session = restorePictureSession(input.session.sessionToken),
    c = acceptedClaim(session.sessionToken),
    a = input.answers;
  validateSessionSubmission(c, {
    personalityQIds: session.personality.map((q) => q.id),
    personalityAnswers: a.personality.map((v) => v ?? 3),
    iqQIds: session.iq.map((q) => q.id),
    iqAnswers: a.iq.map((v) => v ?? -1),
    interestQIds: session.interest.map((q) => q.id),
    interestAnswers: a.interest,
  });
  const keys = sessionIQAnswerKeys(
    c,
    c.iq.map((id) => PICTURE_BANK.find((q) => q.id === id)!.correct),
  );
  const ids = new Set([...c.personality, ...c.iq, ...c.interest.map((q) => q.id)]);
  if (
    Object.keys(input.observations).length > 30 ||
    Object.keys(input.observations).some((id) => !ids.has(id)) ||
    Object.values(input.observations).reduce((s, o) => s + o.timeMs, 0) > 86400000
  )
    throw new Error("invalid_session: observations");
  const observations: Record<string, ItemObservation> = {};
  const items = Object.entries(input.observations).map(([id, o]) => {
    const p = c.personality.indexOf(id),
      r = c.iq.indexOf(id),
      i = c.interest.findIndex((q) => q.id === id);
    const chosen =
      p >= 0
        ? a.personality[p] === null
          ? null
          : `${id}:likert:${a.personality[p]}`
        : r >= 0
          ? a.iq[r] === null
            ? null
            : session.iq[r].picture!.options[a.iq[r]!].id
          : (a.interest[i][0] ?? null);
    if (o.chosenAnswer !== chosen || o.answered !== (chosen !== null) || (o.answered && !o.shown))
      throw new Error("invalid_session: observation answer");
    observations[id] = { ...o, timeMs: Math.round(o.timeMs) };
    const picture = r >= 0 ? session.iq[r].picture : null;
    return {
      question_id: id,
      section: p >= 0 ? "personality" : r >= 0 ? "cognitive" : "interest",
      age_group: c.iq.length ? "teen_adult" : "child",
      slot: picture?.slot ?? null,
      item_version: picture?.version ?? null,
      shown: o.shown,
      answered: o.answered,
      chosen_answer: chosen,
      time_ms: Math.round(o.timeMs),
      is_correct: r >= 0 && chosen !== null ? a.iq[r] === keys[r] : null,
    };
  });
  // Every chosen response must have an observation, not just the current page.
  for (const [index, q] of session.personality.entries())
    if (a.personality[index] !== null && !observations[q.id]?.answered)
      throw new Error("invalid_session: missing observation");
  for (const [index, q] of session.iq.entries())
    if (a.iq[index] !== null && !observations[q.id]?.answered)
      throw new Error("invalid_session: missing observation");
  for (const [index, q] of session.interest.entries())
    if (a.interest[index].length && !observations[q.id]?.answered)
      throw new Error("invalid_session: missing observation");
  const draft: PictureDraft = { ...input, session, observations };
  return { draft, claim: c, items };
}
