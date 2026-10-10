import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowUpRight } from "lucide-react";
import { getMyGrowthState, type GrowthState } from "@/lib/assessment/growth.functions";
import { useWords } from "@/lib/editorial";
export function SkillsSection(_props: { stats: unknown; mbti?: string | null }) {
  const w = useWords();
  return (
    <section className="panel p-8">
      <h2 className="text-3xl">
        {w("Skills need evidence", "Ko‘nikma dalil talab qiladi", "Навыкам нужны доказательства")}
      </h2>
      <p className="text-muted-foreground mt-4">
        {w(
          "An assessment describes preferences; it does not measure skill growth. Try a roadmap activity, record what you made, and reflect on what needs practice.",
          "Baholash afzallikni ko‘rsatadi, ko‘nikma o‘sishini o‘lchamaydi. Yo‘l xaritasi faoliyatini sinang va xulosangizni qayd eting.",
          "Оценка описывает предпочтения, не рост навыков. Попробуйте занятие, запишите результат и выводы.",
        )}
      </p>
      <Link className="text-link mt-6" to="/roadmap">
        {w("Open your roadmap", "Yo‘l xaritasini ochish", "Открыть маршрут")}
        <ArrowUpRight size={16} />
      </Link>
    </section>
  );
}
export function WeeklyReportSection(_props: { mbti?: string | null }) {
  const w = useWords();
  const fn = useServerFn(getMyGrowthState);
  const [data, setData] = useState<GrowthState | null>(null);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let alive = true;
    setError(false);
    fn()
      .then((d) => {
        if (alive) setData(d);
      })
      .catch(() => {
        if (alive) setError(true);
      });
    return () => {
      alive = false;
    };
  }, [fn, retry]);
  return (
    <section className="panel p-8">
      <h2 className="text-3xl">
        {w("Your recorded activity", "Qayd etilgan faoliyatingiz", "Записанная активность")}
      </h2>
      {error ? (
        <div role="alert" className="mt-6">
          <p>
            {w(
              "Activity could not be loaded. Locally queued tasks appear after synchronization.",
              "Faoliyat yuklanmadi. Mahalliy navbatdagi vazifalar ulashdan keyin ko‘rinadi.",
              "Не удалось загрузить активность. Локальные задачи появятся после синхронизации.",
            )}
          </p>
          <button className="text-link mt-4" onClick={() => setRetry(retry + 1)}>
            {w("Retry", "Qayta urinish", "Повторить")}
          </button>
        </div>
      ) : !data ? (
        <p className="mt-6" role="status">
          {w("Loading…", "Yuklanmoqda…", "Загрузка…")}
        </p>
      ) : (
        <dl className="grid sm:grid-cols-3 gap-8 mt-8">
          {[
            [
              w("Assessments saved", "Saqlangan baholashlar", "Сохранённые оценки"),
              data.assessmentsCompleted,
            ],
            [
              w("Tasks marked complete", "Bajarilgan vazifalar", "Завершённые задачи"),
              data.tasksCompleted,
            ],
            [
              w("Tasks this week (UTC)", "Hafta vazifalari (UTC)", "Задачи за неделю (UTC)"),
              data.tasksThisWeek,
            ],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs text-muted-foreground">{label}</dt>
              <dd className="text-4xl mt-4">{value}</dd>
            </div>
          ))}
        </dl>
      )}
      <p className="text-xs text-muted-foreground mt-8">
        {w(
          "Completion is self-reported. These counts do not claim improvement in intelligence, communication or leadership.",
          "Bajarilganlikni o‘zingiz belgilaysiz. Sonlar aql, muloqot yoki yetakchilik o‘sishini da’vo qilmaydi.",
          "Выполнение отмечает сам пользователь. Числа не означают рост интеллекта, общения или лидерства.",
        )}
      </p>
    </section>
  );
}
export function QuickLinks() {
  const w = useWords();
  return (
    <nav
      aria-label={w("Exploration tools", "Izlanish vositalari", "Инструменты")}
      className="flex flex-wrap gap-6"
    >
      {[
        ["/universities", w("Universities", "Universitetlar", "Университеты")],
        ["/career-battles", w("Compare careers", "Kasblarni solishtirish", "Сравнить профессии")],
        ["/roadmap", w("Roadmap", "Yo‘l xaritasi", "Маршрут")],
      ].map(([to, label]) => (
        <Link className="text-link" key={to} to={to}>
          {label}
          <ArrowUpRight size={16} />
        </Link>
      ))}
    </nav>
  );
}
export function UniversitiesTabSection() {
  const w = useWords();
  return (
    <section className="panel p-8">
      <h2 className="text-3xl">
        {w(
          "University research notebook",
          "Universitet izlanish daftari",
          "Исследование университетов",
        )}
      </h2>
      <p className="text-muted-foreground mt-4">
        {w(
          "Use official undergraduate admissions and funding sources. A score is not an admission forecast.",
          "Rasmiy bakalavr qabul va yordam manbalaridan foydalaning. Ball qabul bashorati emas.",
          "Используйте официальные источники. Балл — не прогноз поступления.",
        )}
      </p>
      <Link className="field-button mt-6" to="/universities">
        {w("Open notebook", "Daftarni ochish", "Открыть записи")}
      </Link>
    </section>
  );
}
