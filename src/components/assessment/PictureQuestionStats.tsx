import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useWords } from "@/lib/editorial";
import { getPictureQuestionStats } from "@/lib/assessment/picture-stats.functions";
import type { questionStatistics } from "@/lib/assessment/picture-statistics";

export function PictureQuestionStats() {
  const w = useWords(),
    load = useServerFn(getPictureQuestionStats);
  const [data, setData] = useState<ReturnType<typeof questionStatistics> | null>(null),
    [error, setError] = useState(false),
    [revision, setRevision] = useState(0);
  useEffect(() => {
    let active = true;
    setError(false);
    load()
      .then((d) => {
        if (active) setData(d);
      })
      .catch(() => {
        if (active) setError(true);
      });
    return () => {
      active = false;
    };
  }, [load, revision]);
  const percent = (v: number | null) => (v === null ? "—" : `${v.toFixed(1)}%`);
  return (
    <section className="panel my-8 rounded-3xl p-5" aria-labelledby="picture-stats-heading">
      <h2 id="picture-stats-heading" className="text-xl font-bold">
        {w("Picture puzzle pilot", "Rasmli savollar sinovi", "Пилот задач с картинками")}
      </h2>
      <p className="my-3 text-sm">
        {w(
          "Private admin statistics. Accuracy and option percentages use answered attempts; average active time uses shown attempts. Timing comes from the browser and is approximate.",
          "Yopiq admin statistikasi. To‘g‘ri javob va variant foizlari javob berilgan urinishlardan; o‘rtacha faol vaqt ko‘rsatilgan savollardan olinadi. Brauzer vaqti taxminiy.",
          "Закрытая статистика администратора. Точность и доли вариантов — среди отвеченных попыток; среднее активное время — среди показов. Время браузера приблизительно.",
        )}
      </p>
      <button className="field-button" onClick={() => setRevision((n) => n + 1)}>
        {w("Refresh statistics", "Statistikani yangilash", "Обновить статистику")}
      </button>
      {error ? (
        <p role="alert" className="mt-4">
          {w(
            "Statistics could not load. Check access and the picture assessment migration.",
            "Statistika yuklanmadi. Ruxsat va rasmli test migratsiyasini tekshiring.",
            "Не удалось загрузить статистику. Проверьте доступ и миграцию теста.",
          )}
        </p>
      ) : !data ? (
        <p role="status">{w("Loading…", "Yuklanmoqda…", "Загрузка…")}</p>
      ) : (
        <>
          <p className="my-4 font-semibold">
            {w(
              "Students with reasoning exposure:",
              "Mantiqiy savol ko‘rgan o‘quvchilar:",
              "Учеников, видевших задачи:",
            )}{" "}
            {data.students} / 30
          </p>
          <p className="mb-4 text-sm">
            {w(
              "Pilot targets: easy 75–90%, medium 45–70%, hard 20–45%. Slot 7 uses the medium target. Any highlighted item needs review. Thirty students alone do not establish age coverage or version equivalence. General rollout stays off until approval.",
              "Sinov mezoni: oson 75–90%, o‘rtacha 45–70%, qiyin 20–45%. 7-savol o‘rtacha mezonda. Belgilangan savollarni ko‘rib chiqing. 30 o‘quvchining o‘zi yosh qamrovi va versiyalar tengligini isbotlamaydi. Tasdiqqacha ommaviy ishga tushirilmaydi.",
              "Цели: лёгкие 75–90%, средние 45–70%, сложные 20–45%. Для слота 7 — средняя цель. Выделенные задания требуют проверки. 30 учеников не доказывают охват возрастов или равенство версий. Общий запуск — после одобрения.",
            )}
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  {[
                    w(
                      "Question / set / age",
                      "Savol / to‘plam / yosh",
                      "Задание / набор / возраст",
                    ),
                    w("Shown / answered", "Ko‘rildi / javob", "Показы / ответы"),
                    w("Correct", "To‘g‘ri", "Верно"),
                    w("Average active time", "O‘rtacha faol vaqt", "Среднее активное время"),
                    w("Each answer", "Har bir javob", "Каждый вариант"),
                  ].map((h) => (
                    <th key={h} className="p-3 text-left">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.questions.map((q) => (
                  <tr
                    key={`${q.setVersion}:${q.ageGroup === "child" ? w("14 and under", "14 yosh va undan kichik", "14 лет и младше") : w("15 and older", "15 yosh va undan katta", "15 лет и старше")}:${q.id}`}
                    className={q.outsideTarget || q.distractorWins ? "bg-destructive/10" : ""}
                  >
                    <td className="border-t p-3">
                      <strong>{q.id}</strong>
                      <br />
                      {q.setVersion}
                      <br />
                      {q.ageGroup === "child"
                        ? w("14 and under", "14 yosh va undan kichik", "14 лет и младше")
                        : w("15 and older", "15 yosh va undan katta", "15 лет и старше")}
                      {q.difficulty && (
                        <>
                          {" "}
                          ·{" "}
                          {
                            {
                              easy: w("Easy", "Oson", "Легко"),
                              medium: w("Medium", "O‘rtacha", "Средне"),
                              "medium-hard": w(
                                "Medium to hard",
                                "O‘rtachadan qiyingacha",
                                "Средне–сложно",
                              ),
                              hard: w("Hard", "Qiyin", "Сложно"),
                            }[q.difficulty as "easy"]
                          }
                        </>
                      )}
                      {(q.outsideTarget || q.distractorWins) && (
                        <p>
                          {q.distractorWins
                            ? w(
                                "A wrong answer wins",
                                "Noto‘g‘ri javob ko‘proq",
                                "Неверный вариант лидирует",
                              )
                            : w(
                                "Outside pilot target",
                                "Sinov mezonidan tashqari",
                                "Вне целевого диапазона",
                              )}
                        </p>
                      )}
                    </td>
                    <td className="border-t p-3">
                      {q.shown} / {q.answered}
                    </td>
                    <td className="border-t p-3">{percent(q.percentCorrect)}</td>
                    <td className="border-t p-3">
                      {q.averageTimeMs === null ? "—" : `${(q.averageTimeMs / 1000).toFixed(1)} s`}
                    </td>
                    <td className="border-t p-3">
                      {q.options.map((o) => (
                        <p key={o.id}>
                          {o.id.split("-choice-").at(-1)}
                          {o.correct ? " ✓" : ""}: {o.chosen} ({percent(o.percent)})
                        </p>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="my-4 text-sm">
            {w(
              "Version gaps (percentage points):",
              "Versiyalar farqi (foiz punkt):",
              "Разница версий (процентные пункты):",
            )}{" "}
            {data.pairs
              .map((p) => `${p.slot}: ${p.delta === null ? "—" : p.delta.toFixed(1)}`)
              .join(" · ")}
          </p>
        </>
      )}
    </section>
  );
}
