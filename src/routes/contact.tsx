import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { PageShell } from "@/components/PageShell";
import { useWords } from "@/lib/editorial";
import { CONTACT_EMAIL, CONTACT_PHONE } from "@/lib/constants";
import { pageMeta } from "@/lib/seo";
export const Route = createFileRoute("/contact")({
  validateSearch: (search: Record<string, unknown>): { topic?: string } => ({
    topic: search.topic === "school" ? "school" : undefined,
  }),
  head: () =>
    pageMeta(
      "/contact",
      "Talk to the team",
      "Ask about the assessment or plan a school pilot with Abilitio.",
    ),
  component: Contact,
});
const ENDPOINT = "https://formspree.io/f/mqejjovw";
function Contact() {
  const w = useWords();
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [school, setSchool] = useState(Route.useSearch().topic === "school");
  const [copy, setCopy] = useState(false);
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fields = new FormData(form);
    if (fields.get("website")) return;
    setStatus("sending");
    setError("");
    try {
      const response = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          ...Object.fromEntries(fields),
          _subject: school ? "Abilitio school pilot inquiry" : "Abilitio contact",
        }),
      });
      if (!response.ok) throw new Error("submission_failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setError(
        w(
          "Your message was not sent. Try again or email us directly.",
          "Xabar yuborilmadi. Qayta urining yoki bevosita email yozing.",
          "Сообщение не отправлено. Повторите или напишите на почту.",
        ),
      );
    }
  }
  return (
    <PageShell>
      <div className="field-wrap">
        <header className="field-intro">
          <p className="micro section-number">
            {w("CONTACT / SCHOOL TRIALS", "ALOQA / MAKTAB SINOVLARI", "КОНТАКТЫ / ПИЛОТЫ")}
          </p>
          <div>
            <h1>{w("Start a conversation.", "Suhbatni boshlang.", "Начните разговор.")}</h1>
            <p>
              {w(
                "Tell us what you are trying to understand. For a school, tell us the number of students and the language you need.",
                "Nimani tushunmoqchi ekaningizni ayting. Maktab uchun sinov hajmi va tilini yozing.",
                "Расскажите о вашем вопросе. Для школы укажите масштаб и язык пилота.",
              )}
            </p>
          </div>
        </header>
        <section className="field-section field-rule contact-layout">
          <aside>
            <p className="micro">{w("DIRECT CONTACT", "BEVOSITA ALOQA", "ПРЯМОЙ КОНТАКТ")}</p>
            <a className="text-link mt-6 break-all" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
            <button
              className="block text-sm mt-4 text-muted-foreground"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(CONTACT_EMAIL);
                  setCopy(true);
                } catch {
                  setError(
                    w(
                      "Select and copy the email address above.",
                      "Yuqoridagi emailni belgilang va nusxalang.",
                      "Выделите и скопируйте адрес выше.",
                    ),
                  );
                }
              }}
            >
              {copy
                ? w("Copied", "Nusxalandi", "Скопировано")
                : w("Copy address", "Manzilni nusxalash", "Копировать адрес")}
            </button>
            <a className="text-link mt-8" href={`tel:${CONTACT_PHONE.replace(/\s/g, "")}`}>
              {CONTACT_PHONE}
            </a>
            <p className="text-sm text-muted-foreground mt-8">
              {w(
                "Your message goes to our team. A school inquiry begins with agreeing the number of students, reports and price; it does not create a subscription.",
                "Xabaringiz jamoamizga boradi. Maktab so‘rovi hajmni muhokama qilishdan boshlanadi, obuna yaratmaydi.",
                "Сообщение получит команда. Запрос школы начинает обсуждение условий и не создаёт подписку.",
              )}
            </p>
          </aside>
          <div>
            {status === "success" ? (
              <div role="status" className="sample-result">
                <Check size={24} />
                <h2 className="text-4xl mt-6">
                  {w("Message received.", "Xabar qabul qilindi.", "Сообщение получено.")}
                </h2>
                <p className="mt-4">
                  {w(
                    "The team will reply to the address you provided.",
                    "Jamoa ko‘rsatgan manzilingizga javob beradi.",
                    "Команда ответит на указанный адрес.",
                  )}
                </p>
                <button className="text-link mt-6" onClick={() => setStatus("idle")}>
                  {w("Send another message", "Yana xabar yuborish", "Отправить ещё")}
                </button>
              </div>
            ) : (
              <form onSubmit={submit}>
                <label>
                  {w("I am writing about", "Mavzu", "Тема")}
                  <select
                    name="topic"
                    value={school ? "school" : "assessment"}
                    onChange={(e) => setSchool(e.target.value === "school")}
                  >
                    <option value="assessment">
                      {w("The assessment / my account", "Baholash / hisobim", "Оценка / аккаунт")}
                    </option>
                    <option value="school">
                      {w("A school trial", "Maktab sinovi", "Пилот для школы")}
                    </option>
                  </select>
                </label>
                <div className="form-row">
                  <label>
                    {w("Your name", "Ismingiz", "Ваше имя")}
                    <input name="name" minLength={2} maxLength={100} autoComplete="name" required />
                  </label>
                  <label>
                    {w("Email", "Email", "Почта")}
                    <input
                      name="email"
                      type="email"
                      maxLength={200}
                      autoComplete="email"
                      required
                    />
                  </label>
                </div>
                {school && (
                  <>
                    <div className="form-row">
                      <label>
                        {w("Institution", "Muassasa", "Учреждение")}
                        <input name="institution" required maxLength={150} />
                      </label>
                      <label>
                        {w("Your role", "Lavozimingiz", "Ваша роль")}
                        <input name="role" required maxLength={100} />
                      </label>
                    </div>
                    <div className="form-row">
                      <label>
                        {w(
                          "Proposed student count",
                          "Taxminiy o‘quvchi soni",
                          "Количество учеников",
                        )}
                        <input name="students" type="number" min={1} max={100000} required />
                      </label>
                      <label>
                        {w("Preferred language", "Til", "Язык")}
                        <select name="language">
                          <option value="Uzbek">{w("Uzbek", "O‘zbekcha", "Узбекский")}</option>
                          <option value="English">{w("English", "Inglizcha", "Английский")}</option>
                          <option value="Russian">{w("Russian", "Ruscha", "Русский")}</option>
                        </select>
                      </label>
                    </div>
                  </>
                )}
                <label>
                  {w("Your question", "Savolingiz", "Ваш вопрос")}
                  <textarea name="message" minLength={5} maxLength={2000} rows={6} required />
                </label>
                <div hidden aria-hidden>
                  <label>
                    Website
                    <input name="website" tabIndex={-1} autoComplete="off" />
                  </label>
                </div>
                <p className="text-xs text-muted-foreground">
                  {w(
                    "Avoid including student names or assessment answers.",
                    "O‘quvchi ismlari yoki baholash javoblarini yubormang.",
                    "Не включайте имена учеников и ответы на вопросы.",
                  )}
                </p>
                {error && (
                  <p role="alert" className="field-error">
                    {error}
                  </p>
                )}
                <button className="field-button justify-self-start" disabled={status === "sending"}>
                  {status === "sending"
                    ? w("Sending…", "Yuborilmoqda…", "Отправка…")
                    : w("Send message", "Xabar yuborish", "Отправить")}
                  <ArrowUpRight size={18} />
                </button>
              </form>
            )}
            {error && status === "success" && <p role="alert">{error}</p>}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
