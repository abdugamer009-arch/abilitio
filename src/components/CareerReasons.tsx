import { useI18n } from "@/lib/i18n";
import { useWords } from "@/lib/editorial";
import type { CareerEvidence } from "@/lib/assessment/career-evidence";
import { workExperiment } from "@/lib/assessment/work-experiments";
export function CareerReasons({
  category,
  evidence,
}: {
  category: string;
  evidence?: CareerEvidence;
}) {
  const { lang } = useI18n();
  const w = useWords();
  const guide = workExperiment(category, lang);
  return (
    <details className="career-reasons mt-4 text-sm">
      <summary className="cursor-pointer py-3 font-semibold">
        {w(
          "Reasons & a small experiment",
          "Sabablar va kichik tajriba",
          "Причины и небольшой опыт",
        )}
      </summary>
      <h4 className="mt-3 font-semibold">
        {w(
          "Your supporting answers",
          "Qo‘llab-quvvatlovchi javoblaringiz",
          "Ваши подтверждающие ответы",
        )}
      </h4>
      {evidence?.support.length ? (
        <ul className="list-disc pl-5">
          {evidence.support.map((a) => (
            <li key={a.questionId}>
              <span>{a.prompt[lang]}</span>
              <br />
              <q>{a.answer[lang]}</q>
            </li>
          ))}
        </ul>
      ) : (
        <p>
          {w(
            "No retained answer-level support for this direction. Explore it without assuming a fit.",
            "Bu yo‘nalish uchun javob dalillari saqlanmagan. Moslik deb qabul qilmasdan o‘rganing.",
            "Для этого направления не сохранены подтверждающие ответы. Изучайте его, не предполагая соответствия.",
          )}
        </p>
      )}
      <h4 className="mt-4 font-semibold">
        {w(
          "Possible mismatches to explore",
          "Tekshiriladigan mumkin bo‘lgan nomosliklar",
          "Возможные несовпадения для проверки",
        )}
      </h4>
      <p>
        {w(
          "A different choice is a question to explore, not a reason to rule out a career. Skills and working conditions were not assessed.",
          "Boshqa tanlov kasbni rad etish sababi emas, tekshiriladigan savoldir. Ko‘nikma va ish sharoiti baholanmagan.",
          "Другой выбор — повод разобраться, а не исключить профессию. Навыки и условия труда не оценивались.",
        )}
      </p>
      {evidence?.explore.length ? (
        <ul className="list-disc pl-5">
          {evidence.explore.slice(0, 2).map((a) => (
            <li key={a.questionId}>
              {a.prompt[lang]} — <q>{a.answer[lang]}</q>
            </li>
          ))}
        </ul>
      ) : null}
      <h4 className="mt-4 font-semibold">
        {w(
          "Work examples in this field (illustrative)",
          "Bu sohadagi ish namunalari (misollar)",
          "Примеры работы в этой области (иллюстрации)",
        )}
      </h4>
      <ul className="list-disc pl-5">
        {guide.examples.map((e) => (
          <li key={e}>{e}</li>
        ))}
      </ul>
      <h4 className="mt-4 font-semibold">
        {w("Try this week", "Bu hafta sinang", "Попробуйте на этой неделе")}
      </h4>
      <p>{guide.experiment}</p>
    </details>
  );
}
