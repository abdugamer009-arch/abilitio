import { useWords } from "./editorial";
import { useUiText } from "./ui-text";

/** Localize the existing server-generated insight templates without altering stored results. */
export function useSchoolInsight() {
  const w = useWords();
  const tr = useUiText();
  const bucket = (name: string) => tr(name.charAt(0).toUpperCase() + name.slice(1));
  return (text: string) => {
    let match = text.match(
      /^Your school has a strong concentration of (.+)-oriented students \((\d+)\)\.$/,
    );
    if (match)
      return w(
        text,
        `Maktabingizda ${bucket(match[1])} yo‘nalishidagi o‘quvchilar ko‘p (${match[2]}).`,
        `В вашей школе много учеников направления «${bucket(match[1])}» (${match[2]}).`,
      );
    match = text.match(/^Class (.+) shows exceptionally strong (.+) potential\.$/);
    if (match)
      return w(
        text,
        `${match[1]} sinfida ${bucket(match[2])} salohiyati ayniqsa kuchli.`,
        `Класс ${match[1]} показывает особенно сильный потенциал направления «${bucket(match[2])}».`,
      );
    match = text.match(
      /^Only (\d+)% of students have completed their assessments — encourage participation for sharper insights\.$/,
    );
    if (match)
      return w(
        text,
        `O‘quvchilarning faqat ${match[1]}% baholashni yakunlagan — aniqroq xulosalar uchun ishtirokni rag‘batlantiring.`,
        `Только ${match[1]}% учеников завершили оценки — поощряйте участие для более точных выводов.`,
      );
    return tr(text);
  };
}
