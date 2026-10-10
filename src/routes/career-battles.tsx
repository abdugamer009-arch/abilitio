import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { useWords } from "@/lib/editorial";
import { pageMeta } from "@/lib/seo";
export const Route = createFileRoute("/career-battles")({
  head: () =>
    pageMeta(
      "/career-battles",
      "Compare the work",
      "Compare career activities and small experiments without unsourced salary or demand rankings.",
    ),
  component: Compare,
});
function Compare() {
  const w = useWords();
  const choices = [
    {
      name: w("Software engineering", "Dasturiy injiniring", "Разработка ПО"),
      work: w(
        "Build and maintain software; debug, review and test changes.",
        "Dastur yaratish va yuritish; xatolarni topish, tekshirish va sinash.",
        "Создание и поддержка ПО; отладка, ревью и тесты.",
      ),
      experiment: w(
        "Make a small tool for a real problem and ask one person to use it.",
        "Haqiqiy muammo uchun kichik vosita yarating va bir kishiga sinating.",
        "Создайте инструмент для реальной задачи и дайте одному человеку попробовать.",
      ),
    },
    {
      name: w("Research", "Tadqiqot", "Исследование"),
      work: w(
        "Form a question, gather evidence, examine uncertainty and explain a finding.",
        "Savol tuzish, dalil yig‘ish, noaniqlikni tekshirish va xulosani tushuntirish.",
        "Вопрос, сбор доказательств, проверка неопределённости и объяснение вывода.",
      ),
      experiment: w(
        "Investigate a public dataset and write one page about what it does not establish.",
        "Ochiq ma’lumotni tahlil qiling va u nimani isbotlamasligi haqida bir sahifa yozing.",
        "Исследуйте открытые данные и напишите страницу об их ограничениях.",
      ),
    },
    {
      name: w("Design", "Dizayn", "Дизайн"),
      work: w(
        "Understand a user's problem, explore alternatives and test a proposed solution.",
        "Foydalanuvchi muammosini tushunish, variantlar yaratish va yechim sinash.",
        "Понять задачу пользователя, исследовать варианты и проверить решение.",
      ),
      experiment: w(
        "Observe someone using an everyday object, redesign one detail and test it.",
        "Kundalik buyumdan foydalanishni kuzating, bir detalni o‘zgartiring va sinang.",
        "Наблюдайте за использованием предмета, измените деталь и проверьте.",
      ),
    },
    {
      name: w("Education", "Ta’lim", "Образование"),
      work: w(
        "Explain difficult ideas, plan practice and respond to learners' needs.",
        "Murakkab g‘oyalarni tushuntirish, mashq rejalash va o‘quvchi ehtiyojiga javob berish.",
        "Объяснять сложные идеи, планировать практику и учитывать потребности учеников.",
      ),
      experiment: w(
        "Teach a ten-minute lesson, ask for feedback and revise the explanation.",
        "O‘n daqiqalik dars o‘ting, fikr so‘rang va tushuntirishni yangilang.",
        "Проведите десятиминутный урок, соберите отзывы и улучшите объяснение.",
      ),
    },
  ];
  const [a, setA] = useState(0);
  const [b, setB] = useState(1);
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
                "Titles hide the daily activities. Choose two directions and a small experiment in each. These summaries are illustrative, not labor-market forecasts.",
                "Lavozim nomi kundalik ishni yashiradi. Ikki yo‘nalish va har birida kichik tajriba tanlang. Bu izohlar namuna, bozor bashorati emas.",
                "Названия скрывают ежедневные занятия. Выберите два направления и опыт для каждого. Это примеры, не прогноз рынка.",
              )}
            </p>
          </div>
        </header>
        <div className="form-row mb-8">
          {[
            [a, setA, w("First direction", "Birinchi yo‘nalish", "Первое направление")],
            [b, setB, w("Compare with", "Solishtirish", "Сравнить с")],
          ].map(([value, set, label], i) => (
            <label className="text-sm" key={i} htmlFor={`career-${i}`}>
              {label as string}
              <select
                id={`career-${i}`}
                className="mt-2 w-full p-3"
                value={value as number}
                onChange={(e) => (set as (n: number) => void)(Number(e.target.value))}
              >
                {choices.map((c, j) => (
                  <option key={j} value={j}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
        <section className="form-row field-section field-rule">
          {[a, b].map((index, i) => (
            <article key={i} className="sample-question">
              <p className="micro section-number">
                0{i + 1} / {w("DIRECTION", "YO‘NALISH", "НАПРАВЛЕНИЕ")}
              </p>
              <h2 className="text-4xl mt-6">{choices[index].name}</h2>
              <p className="text-muted-foreground mt-6">{choices[index].work}</p>
              <p className="micro text-accent mt-8">{w("TRY THIS", "BUNI SINANG", "ПОПРОБУЙТЕ")}</p>
              <p className="mt-4">{choices[index].experiment}</p>
            </article>
          ))}
        </section>
        <p className="text-muted-foreground text-sm">
          {w(
            "Pay, qualifications and demand depend on the country, role and year. Research those with a local professional and official labor sources before deciding.",
            "Daromad, malaka va talab davlat, rol va yilga bog‘liq. Qarordan oldin mahalliy mutaxassis va rasmiy manbalarda tekshiring.",
            "Оплата, квалификация и спрос зависят от страны, роли и года. Уточните их у местного специалиста и официальных источников.",
          )}
        </p>
        <Link className="field-button my-12" to="/career-assessment">
          {w("Explore your profile", "Profilingizni o‘rganing", "Исследуйте свой профиль")}
          <ArrowUpRight size={16} />
        </Link>
      </div>
    </PageShell>
  );
}
