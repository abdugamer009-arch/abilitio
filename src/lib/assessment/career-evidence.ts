import type { LangText } from "./career.functions";

// Only the selected answer and its public wording are retained. Hidden option
// weights, unselected answers and the full question bank never leave the server.
export type AnswerEvidence = {
  questionId: string;
  prompt: LangText;
  answer: LangText;
};
export type DirectAnswer = AnswerEvidence & { fields: string[] };
export type CareerEvidence = { support: AnswerEvidence[]; explore: AnswerEvidence[] };
export function buildCareerEvidence(fields: string[], answers: DirectAnswer[]): CareerEvidence {
  const publicAnswer = ({ questionId, prompt, answer }: DirectAnswer): AnswerEvidence => ({
    questionId,
    prompt,
    answer,
  });
  return {
    support: answers.filter((a) => a.fields.some((f) => fields.includes(f))).map(publicAnswer),
    // These choices suggest questions to explore, not proof of incompatibility.
    explore: answers.filter((a) => !a.fields.some((f) => fields.includes(f))).map(publicAnswer),
  };
}
