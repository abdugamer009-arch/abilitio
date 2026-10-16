import { useWords } from "@/lib/editorial";

/** The child flow differs from the older-student composition shown in public examples. */
export function AssessmentAgeNote() {
  const w = useWords();
  return (
    <p data-assessment-age-note className="mt-4 text-sm text-muted-foreground">
      {w(
        "14 and under: 12 simple preference questions and 18 activity choices, with no reasoning score.",
        "14 yosh va undan kichiklar: 12 oddiy afzallik savoli va 18 mashg‘ulot tanlovi; mantiqiy fikrlash bali berilmaydi.",
        "До 14 лет включительно: 12 простых вопросов о предпочтениях и 18 выборов занятий, без оценки мышления.",
      )}
    </p>
  );
}
