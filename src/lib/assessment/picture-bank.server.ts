import data from "./picture-bank.server.json";
import { publicPicture, type PictureProposal } from "./picture-rules";
import type { CognitiveQ } from "./career-assessment";
import { PICTURE_SET_VERSION } from "./picture-types";

export const PICTURE_PROPOSALS = data as unknown as PictureProposal[];
export const PICTURE_BANK: CognitiveQ[] = PICTURE_PROPOSALS.map((q) => ({
  id: q.id,
  section: "cognitive",
  prompt: q.questionLine.en,
  options: q.options.map((o, i) => o.value.text?.en ?? `Picture ${i + 1}`),
  correct: q.options.findIndex((o) => o.id === q.correctAnswerId),
  ageGroups: ["teen_adult"],
  trait: q.type,
  similarityGroup: `picture-slot-${q.slot}`,
  picture: publicPicture(q),
  questionSetVersion: PICTURE_SET_VERSION,
}));

export function pickPictureQuestions(random: () => number = Math.random): CognitiveQ[] {
  return Array.from({ length: 9 }, (_, i) => {
    const variants = PICTURE_BANK.filter((q) => q.picture!.slot === i + 1);
    if (variants.length !== 2) throw new Error("assessment_content_incomplete: picture slot");
    return variants[random() < 0.5 ? 0 : 1];
  });
}
