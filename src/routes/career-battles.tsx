import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { PageShell } from "@/components/PageShell";
import { useWords } from "@/lib/editorial";
import { pageMeta } from "@/lib/seo";
import { useAuth } from "@/lib/auth-context";
import { getCareerDirectory, getMyCareerResult } from "@/lib/assessment/career.functions";
import { initialComparison, chooseDistinct } from "@/lib/assessment/report-tools";
import { workExperiment } from "@/lib/assessment/work-experiments";
import { useUiText } from "@/lib/ui-text";
import { useI18n } from "@/lib/i18n";
export const Route = createFileRoute("/career-battles")({
  head: () =>
    pageMeta(
      "/career-battles",
      "Compare the work",
      "Compare saved career recommendations and practical experiments.",
    ),
  component: Compare,
});
function Compare() {
  const w = useWords();
  const tr = useUiText();
  const { lang } = useI18n();
  const { user, loading } = useAuth();
  const directory = useServerFn(getCareerDirectory);
  const result = useServerFn(getMyCareerResult);
  const [choices, setChoices] = useState<{ key: string; name: string; category: string }[]>([]);
  const [selected, setSelected] = useState<string[]>(["", "", ""]);
  const [error, setError] = useState(false);
  const [busy, setBusy] = useState(true);
  useEffect(() => {
    if (loading) return;
    let live = true;
    setBusy(true);
    setChoices([]);
    setSelected(["", "", ""]);
    setError(false);
    Promise.all([directory(), user ? result({ data: {} }) : Promise.resolve(null)])
      .then(([all, saved]) => {
        if (!live) return;
        const merged = [...(saved?.career_matches ?? []), ...all].filter(
          (c, i, a) => a.findIndex((d) => d.key === c.key) === i,
        );
        setChoices(merged);
        setSelected(initialComparison(saved?.career_matches.map((c) => c.key) ?? []));
        setBusy(false);
      })
      .catch(() => {
        if (live) {
          setError(true);
          setBusy(false);
        }
      });
    return () => {
      live = false;
    };
  }, [directory, result, user, loading]);
  return (
    <PageShell>
      <div className="field-wrap">
        <header className="field-intro">
          <p className="micro section-number">
            {w("CAREER COMPARISON", "KASB SOLISHTIRISH", "СРАВНЕНИЕ ПРОФЕССИЙ")}
          </p>
          <div>
            <h1>{w("Compare the work.", "Ishni solishtiring.", "Сравните работу.")}</h1>
            <p>
              {w(
                "Start with your three saved recommendations, or choose from the career catalogue. Examples describe fields of work; check the actual role locally.",
                "Uchta saqlangan tavsiyangizdan boshlang yoki kasblar katalogidan tanlang. Misollar ish sohalarini tavsiflaydi; haqiqiy rolni mahalliy tekshiring.",
                "Начните с трёх сохранённых рекомендаций или выберите из каталога. Примеры описывают области работы; уточняйте реальную роль на месте.",
              )}
            </p>
          </div>
        </header>
        {busy && (
          <p role="status">
            {w("Loading careers…", "Kasblar yuklanmoqda…", "Загрузка профессий…")}
          </p>
        )}
        {error && (
          <p role="alert">
            {w(
              "Could not load careers. Reload to retry.",
              "Kasblar yuklanmadi. Qayta yuklang.",
              "Не удалось загрузить профессии. Обновите страницу.",
            )}
          </p>
        )}
        {!busy && !error && (
          <>
            <div className="grid gap-4 md:grid-cols-3">
              {selected.map((key, i) => (
                <label key={i} className="text-base">
                  {w("Direction", "Yo‘nalish", "Направление")} {i + 1}
                  <select
                    className="mt-2 w-full p-3"
                    value={key}
                    onChange={(e) => setSelected((s) => chooseDistinct(s, i, e.target.value))}
                  >
                    <option value="">
                      {w("Choose a career", "Kasb tanlang", "Выберите профессию")}
                    </option>
                    {choices
                      .filter((c) => c.key === key || !selected.includes(c.key))
                      .map((c) => (
                        <option key={c.key} value={c.key}>
                          {tr(c.name)}
                        </option>
                      ))}
                  </select>
                </label>
              ))}
            </div>
            {!selected.some(Boolean) && (
              <p className="my-6" role="status">
                {w(
                  "Choose two or three careers above to compare their work and try a small experiment.",
                  "Ishni solishtirish va kichik tajriba uchun yuqoridan ikki yoki uch kasb tanlang.",
                  "Выберите выше две или три профессии, чтобы сравнить работу и попробовать небольшой опыт.",
                )}
              </p>
            )}
            <section className="grid gap-4 md:grid-cols-3 my-8">
              {selected.filter(Boolean).map((key) => {
                const c = choices.find((c) => c.key === key)!;
                const guide = workExperiment(c.category, lang);
                return (
                  <article key={key} className="sample-question min-w-0">
                    <h2 className="text-2xl break-words">{tr(c.name)}</h2>
                    <p>{tr(c.category)}</p>
                    <h3 className="mt-4 text-lg">
                      {w(
                        "Work examples (illustrative)",
                        "Ish namunalari (misollar)",
                        "Примеры работы (иллюстрации)",
                      )}
                    </h3>
                    <ul className="list-disc pl-5">
                      {guide.examples.map((e) => (
                        <li key={e}>{e}</li>
                      ))}
                    </ul>
                    <h3 className="mt-4 text-lg">
                      {w("Try this week", "Bu hafta sinang", "Попробуйте на этой неделе")}
                    </h3>
                    <p>{guide.experiment}</p>
                    <h3 className="mt-4 text-lg">
                      {w(
                        "Prerequisites to explore",
                        "O‘rganiladigan asoslar",
                        "Подготовка для изучения",
                      )}
                    </h3>
                    <p>{guide.prerequisite}</p>
                  </article>
                );
              })}
            </section>
          </>
        )}
      </div>
    </PageShell>
  );
}
