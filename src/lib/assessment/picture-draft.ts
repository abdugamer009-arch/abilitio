import type { ClientSession } from "./career.functions";
import { draftIsCurrent } from "./draft-expiry";
import { PICTURE_SET_VERSION } from "./picture-types";
export type PictureAnswers = {
  personality: (number | null)[];
  iq: (number | null)[];
  interest: string[][];
};
export type ItemObservation = {
  shown: boolean;
  answered: boolean;
  chosenAnswer: string | null;
  timeMs: number;
};
export type PictureDraft = {
  session: ClientSession;
  step: number;
  screen: "start" | "question" | "reasoning-intro" | "part-done" | "finish";
  answers: PictureAnswers;
  observations: Record<string, ItemObservation>;
  revision: number;
  updatedAt: number;
};
export const pictureDraftKey = (owner: string | null) =>
  `abilitio.picture-draft.v1:${owner ?? "guest"}`;
export function emptyPictureDraft(session: ClientSession): PictureDraft {
  return {
    session,
    step: 0,
    screen: "question",
    answers: {
      personality: Array(12).fill(null),
      iq: Array(session.iq.length).fill(null),
      interest: session.interest.map(() => []),
    },
    observations: Object.fromEntries(
      [...session.personality, ...session.iq, ...session.interest].map((q) => [
        q.id,
        { shown: false, answered: false, chosenAnswer: null, timeMs: 0 },
      ]),
    ),
    revision: 0,
    updatedAt: Date.now(),
  };
}
export function validPictureDraft(value: unknown): value is PictureDraft {
  try {
    const d = value as PictureDraft,
      s = d.session,
      a = d.answers;
    if (
      !s ||
      !draftIsCurrent(s.sessionToken) ||
      !["start", "question", "reasoning-intro", "part-done", "finish"].includes(d.screen) ||
      !Number.isInteger(d.step) ||
      d.step < 0 ||
      d.step > 29 ||
      !Number.isInteger(d.revision) ||
      d.revision < 0 ||
      !Number.isFinite(d.updatedAt)
    )
      return false;
    if (
      s.personality.length !== 12 ||
      s.iq.length + s.interest.length !== 18 ||
      ![0, 9].includes(s.iq.length)
    )
      return false;
    if (s.iq.length && s.questionSetVersion !== PICTURE_SET_VERSION) return false;
    const localized = (v: unknown) =>
      !!v &&
      typeof v === "object" &&
      ["en", "ru", "uz"].every((l) => typeof (v as Record<string, unknown>)[l] === "string");
    if (
      !s.personality.every((q) => typeof q.id === "string" && localized(q.prompt)) ||
      !s.iq.every(
        (q) =>
          localized(q.prompt) &&
          q.picture &&
          [3, 4].includes(q.picture.options.length) &&
          ["en", "ru", "uz"].every(
            (l) => q.options[l as "en"].length === q.picture!.options.length,
          ),
      ) ||
      !s.interest.every(
        (q) =>
          localized(q.prompt) &&
          q.options.length > 0 &&
          ["en", "ru", "uz"].every((l) => q.labels[l as "en"].length === q.options.length),
      )
    )
      return false;
    if (
      a.personality.length !== 12 ||
      a.iq.length !== s.iq.length ||
      a.interest.length !== s.interest.length
    )
      return false;
    if (
      !a.personality.every((v) => v === null || (Number.isInteger(v) && v >= 1 && v <= 5)) ||
      !a.iq.every(
        (v, i) => v === null || (Number.isInteger(v) && v >= 0 && v < s.iq[i].options.en.length),
      ) ||
      !a.interest.every(
        (v, i) =>
          Array.isArray(v) &&
          v.length <= 1 &&
          v.every((id) => s.interest[i].options.some((o) => o.id === id)),
      )
    )
      return false;
    return (
      !!d.observations &&
      typeof d.observations === "object" &&
      Object.values(d.observations).every(
        (o) =>
          typeof o.shown === "boolean" &&
          typeof o.answered === "boolean" &&
          (o.chosenAnswer === null || typeof o.chosenAnswer === "string") &&
          Number.isFinite(o.timeMs) &&
          o.timeMs >= 0 &&
          o.timeMs <= 86400000,
      )
    );
  } catch {
    return false;
  }
}
