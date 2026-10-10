import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowUpRight, Bookmark } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { useWords } from "@/lib/editorial";
import { pageMeta } from "@/lib/seo";
export const Route = createFileRoute("/universities")({
  head: () =>
    pageMeta(
      "/universities",
      "University research notebook",
      "Build a research list using official undergraduate admissions and funding sources. No admission probability claims.",
    ),
  component: Universities,
});
/** Source-first records. No invented cutoffs, probabilities or funding eligibility. */
const records = [
  {
    name: "Harvard University",
    country: "USA",
    url: "https://college.harvard.edu/admissions",
    funding: "https://college.harvard.edu/financial-aid",
  },
  {
    name: "MIT",
    country: "USA",
    url: "https://mitadmissions.org/",
    funding: "https://sfs.mit.edu/undergraduate-students/",
  },
  {
    name: "Stanford University",
    country: "USA",
    url: "https://admission.stanford.edu/",
    funding: "https://financialaid.stanford.edu/undergrad/",
  },
  {
    name: "University of Oxford",
    country: "UK",
    url: "https://www.ox.ac.uk/admissions/undergraduate",
    funding: "https://www.ox.ac.uk/admissions/undergraduate/fees-and-funding",
  },
  {
    name: "University of Cambridge",
    country: "UK",
    url: "https://www.undergraduate.study.cam.ac.uk/",
    funding: "https://www.undergraduate.study.cam.ac.uk/fees-funding",
  },
  {
    name: "University of Toronto",
    country: "Canada",
    url: "https://future.utoronto.ca/",
    funding: "https://future.utoronto.ca/fees",
  },
  {
    name: "University of British Columbia",
    country: "Canada",
    url: "https://you.ubc.ca/",
    funding: "https://you.ubc.ca/financial-planning/",
  },
  {
    name: "National University of Singapore",
    country: "Singapore",
    url: "https://nus.edu.sg/oam/",
    funding: "https://nus.edu.sg/oam/financial-aid",
  },
];
function Universities() {
  const w = useWords();
  const [country, setCountry] = useState("");
  const [query, setQuery] = useState("");
  const [saved, setSaved] = useState<string[]>([]);
  const filtered = useMemo(
    () =>
      records.filter(
        (r) =>
          (!country || r.country === country) && r.name.toLowerCase().includes(query.toLowerCase()),
      ),
    [country, query],
  );
  return (
    <PageShell>
      <div className="field-wrap">
        <header className="field-intro">
          <p className="micro section-number">
            {w("UNIVERSITY NOTEBOOK", "UNIVERSITET DAFTARI", "ЗАПИСИ ОБ УНИВЕРСИТЕТАХ")}
          </p>
          <div>
            <h1>
              {w(
                "Research a place to learn.",
                "Ta’lim uchun joyni o‘rganing.",
                "Исследуйте место для учёбы.",
              )}
            </h1>
            <p>
              {w(
                "Start from official undergraduate sources. A test score alone cannot tell you your admission chances or what a university will cost.",
                "Rasmiy bakalavr manbalaridan boshlang. Test bali qabul ehtimoli yoki universitet xarajatini yolg‘iz aniqlay olmaydi.",
                "Начните с официальных источников бакалавриата. Балл не определяет шансы поступления или стоимость.",
              )}
            </p>
          </div>
        </header>
        <div className="sample-question mb-8">
          <p className="micro text-accent">
            {w(
              "A RESEARCH LIST, NOT AN ADMISSION FORECAST",
              "IZLANISH RO‘YXATI, QABUL BASHORATI EMAS",
              "СПИСОК ДЛЯ ИССЛЕДОВАНИЯ, НЕ ПРОГНОЗ",
            )}
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            {w(
              "Check degree level, citizenship eligibility, full annual cost and deadlines on each official site. Bookmark choices for this visit; no funding package is implied.",
              "Har bir rasmiy saytda ta’lim bosqichi, fuqarolik talabi, yillik to‘liq xarajat va muddatni tekshiring. Shu tashrif uchun tanlovlarni belgilang; moliyaviy yordam kafolatlanmaydi.",
              "Проверьте уровень, гражданство, полную стоимость и сроки на официальном сайте. Отметки сохраняются в рамках посещения; финансирование не подразумевается.",
            )}
          </p>
        </div>
        <div className="form-row mb-8">
          <label className="text-sm">
            {w("Search by name", "Nom bo‘yicha qidirish", "Поиск по названию")}
            <input
              className="w-full p-3 mt-2"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="search"
            />
          </label>
          <label className="text-sm">
            {w("Country", "Davlat", "Страна")}
            <select
              className="w-full p-3 mt-2"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="">{w("All countries", "Barcha davlatlar", "Все страны")}</option>
              {[...new Set(records.map((r) => r.country))].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>
        </div>
        <p role="status" className="micro mb-6">
          {filtered.length} / {records.length} · {saved.length}{" "}
          {w("marked", "belgilangan", "отмечено")}
        </p>
        <section
          className="editorial-list"
          aria-label={w("Universities", "Universitetlar", "Университеты")}
        >
          {filtered.map((r, i) => (
            <article key={r.name}>
              <span className="section-number">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h2 className="text-2xl">{r.name}</h2>
                <p className="micro mt-4">
                  {r.country} · {w("Undergraduate", "Bakalavr", "Бакалавриат")}
                </p>
              </div>
              <div className="flex flex-wrap items-start gap-6">
                <a className="text-link text-sm" href={r.url} target="_blank" rel="noreferrer">
                  {w("Admissions", "Qabul", "Поступление")}
                  <ArrowUpRight size={16} />
                </a>
                <a className="text-link text-sm" href={r.funding} target="_blank" rel="noreferrer">
                  {w("Costs & funding", "Xarajat va yordam", "Стоимость и помощь")}
                  <ArrowUpRight size={16} />
                </a>
                <button
                  aria-pressed={saved.includes(r.name)}
                  aria-label={`${w("Mark", "Belgilash", "Отметить")} ${r.name}`}
                  className="icon-button"
                  onClick={() =>
                    setSaved(
                      saved.includes(r.name)
                        ? saved.filter((n) => n !== r.name)
                        : [...saved, r.name],
                    )
                  }
                >
                  <Bookmark size={16} fill={saved.includes(r.name) ? "currentColor" : "none"} />
                </button>
              </div>
            </article>
          ))}
        </section>
        {!filtered.length && (
          <p className="py-8">
            {w(
              "No records match. Try another name or country.",
              "Mos ma’lumot yo‘q. Boshqa nom yoki davlatni sinang.",
              "Нет совпадений. Измените название или страну.",
            )}
          </p>
        )}
        <div className="field-section text-sm text-muted-foreground">
          {w(
            "Before applying, verify testing policies and funding terms directly with the institution. These links identify source pages, not verified eligibility for your circumstances.",
            "Arizadan oldin test va yordam shartlarini muassasa bilan tekshiring. Havolalar manbalarni ko‘rsatadi, sizning holatingizga moslik tasdig‘i emas.",
            "Перед подачей уточните тесты и финансирование в университете. Ссылки — источники, не подтверждение вашей eligibility.",
          )}
        </div>
      </div>
    </PageShell>
  );
}
