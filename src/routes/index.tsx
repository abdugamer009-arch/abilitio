import { useEffect, useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { DeferredBelowFold } from "@/components/DeferredBelowFold";
import { PageShell } from "@/components/PageShell";
import { TrailDrawing, HeroAnnotation } from "@/components/design4/Artwork";
import { useArtworkMotion } from "@/components/design4/use-artwork-motion";
import { FOUNDERS, FounderPortrait } from "@/components/FounderPortrait";
import { MaskText } from "@/components/MaskText";
import { CartoonSparkle, MarkedText } from "@/components/CartoonArtwork";

import { useWords } from "@/lib/editorial";
import { pageMeta } from "@/lib/seo";
import { track, AnalyticsEvent } from "@/lib/analytics";
export const Route = createFileRoute("/")({
  headers: () => ({
    "Cache-Control": "public, max-age=0, s-maxage=300, stale-while-revalidate=86400",
  }),
  head: () =>
    pageMeta(
      "/",
      "Find a career worth trying",
      "A free 30-question career exploration profile for students. Try a real sample, compare directions and choose your first practical task.",
    ),
  component: LandingPage,
});
function LandingPage() {
  const w = useWords();
  const { ref: heroRef, playing } = useArtworkMotion();
  const [illustrationStep, setIllustrationStep] = useState(0);
  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      const hero = document.getElementById("brain-hero");
      if (
        document.documentElement.dataset.routeTransition ||
        !hero ||
        hero.getBoundingClientRect().bottom < 0
      )
        return;
      setIllustrationStep((current) => (current + 1) % 3);
    }, 2800);
    return () => clearInterval(timer);
  }, [playing]);
  return (
    <PageShell>
      <section className="studio-hero" id="brain-hero">
        <div className="field-wrap">
          <div className="hero-rail" data-hero-rule>
            <span className="micro">
              {w(
                "FOR STUDENTS / FIRST CAREER DIRECTIONS",
                "O‘QUVCHILAR UCHUN / BIRINCHI KASB YO‘NALISHI",
                "УЧЕНИКАМ / ПЕРВЫЕ КАРЬЕРНЫЕ НАПРАВЛЕНИЯ",
              )}
            </span>
            <span className="micro">ABILITIO — 01</span>
          </div>
          <div className="studio-hero-grid">
            <div className="studio-hero-copy">
              <p className="hero-tag" data-hero-detail>
                {w(
                  "The future should be a little bit bright.",
                  "Kelajak biroz yorqinroq bo‘lishi kerak.",
                  "Будущее должно быть немного светлее.",
                )}
                <HeroAnnotation />
              </p>
              <h1 data-hero-title>
                <MaskText
                  text={w(
                    "Find a career worth trying.",
                    "Sinashga arzigulik kasbni toping.",
                    "Найдите профессию для пробы.",
                  )}
                />
              </h1>
              <p className="hero-explanation" data-hero-detail>
                {w(
                  "Answer questions about your interests and preferences. Get career suggestions, reasons behind them and activities to try.",
                  "Qiziqish va afzalliklaringiz haqidagi savollarga javob bering. Kasb tavsiyalari, ularning sabablari va sinash uchun faoliyatlar oling.",
                  "Ответьте на вопросы об интересах и предпочтениях. Получите идеи профессий, объяснения и занятия для пробы.",
                )}
              </p>
              <div className="hero-proof">
                <strong data-count="30" data-hero-proof>
                  30
                </strong>
                <div>
                  <span>
                    {w(
                      "questions. One starting profile.",
                      "savol. Bitta boshlang‘ich profil.",
                      "вопросов. Один начальный профиль.",
                    )}
                  </span>
                  <small>
                    {w(
                      "Reasoning questions are included for ages 15 and older.",
                      "15 yosh va kattalar uchun mantiqiy savollar ham bor.",
                      "Задания на мышление включены с 15 лет.",
                    )}
                  </small>
                </div>
              </div>
              <div className="studio-hero-actions" data-hero-actions>
                <Link
                  to="/career-assessment"
                  className="field-button hero-complete"
                  data-magnetic
                  onClick={() => track(AnalyticsEvent.AssessmentCTA, { source: "hero" })}
                >
                  {w("Start the assessment", "Baholashni boshlang", "Начать оценку")}
                  <ArrowUpRight size={17} />
                </Link>
              </div>
              <p className="hero-access" data-hero-detail>
                <CartoonSparkle />
                {w(
                  "Answer without an account. Create a free account to view and save your full results.",
                  "Hisobsiz javob bering. To‘liq natijalarni ko‘rish va saqlash uchun bepul hisob yarating.",
                  "Отвечайте без аккаунта. Для просмотра и сохранения результатов нужен бесплатный аккаунт.",
                )}
              </p>
            </div>
            <div className="d4-hatch hero-art-shell">
              <span className="d4-hatch-layer" aria-hidden="true" />
              <div
                className="hero-instrument d4-motion"
                ref={heroRef}
                data-playing={playing}
                data-step={illustrationStep}
                data-hero-object
              >
                <CartoonSparkle />
                <div className="instrument-label">
                  <span className="micro">
                    {w(
                      "EXPLORE THE PRACTICE TOOLS",
                      "MASHQ VOSITALARINI O‘RGANING",
                      "ИНСТРУМЕНТЫ ДЛЯ ПРАКТИКИ",
                    )}
                  </span>
                  <span>×{illustrationStep + 1}</span>
                </div>
                <div className="d4-trail">
                  <TrailDrawing />
                </div>
                <div className="d4-art-footer">
                  <span className="micro">{w("ILLUSTRATION", "TASVIR", "ИЛЛЮСТРАЦИЯ")}</span>
                  <span>
                    <i />
                    {playing
                      ? w(
                          "Animated illustration",
                          "Animatsiyali tasvir",
                          "Анимированная иллюстрация",
                        )
                      : w("Static illustration", "Statik tasvir", "Статичная иллюстрация")}
                  </span>
                </div>
                <div className="instrument-signals">
                  {[
                    w("Practice", "Mashq", "Практика"),
                    w("Choose", "Tanlang", "Выберите"),
                    w("Try", "Sinang", "Попробуйте"),
                  ].map((label, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setIllustrationStep(i);
                      }}
                      aria-pressed={illustrationStep === i}
                      data-cursor="choose"
                    >
                      <span>0{i + 1}</span>
                      {label}
                      <i />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* TODO_PILOT_EVIDENCE: no adoption or outcome statistics until documented. */}
      <section
        className="founder-bridge field-wrap"
        aria-label={w(
          "Meet the founders",
          "Asoschilar bilan tanishing",
          "Знакомство с основателями",
        )}
        data-story
      >
        <div className="founder-message">
          <p className="micro">{w("OUR MOTTO", "BIZNING SHIORIMIZ", "НАШ ДЕВИЗ")}</p>
          <blockquote className="founder-copy">
            {w(
              "The future should be a little bit bright.",
              "Kelajak biroz yorqinroq bo‘lishi kerak.",
              "Будущее должно быть немного светлее.",
            )}
          </blockquote>
          <Link className="text-link founder-team-link" to="/about">
            {w("Meet our team", "Jamoamiz bilan tanishing", "Познакомьтесь с нашей командой")}
            <ArrowUpRight size={15} />
          </Link>
        </div>
        <div className="founder-pair">
          {FOUNDERS.map((founder) => (
            <figure key={founder.id}>
              <FounderPortrait founder={founder} />
              <figcaption>
                <strong>{founder.name}</strong>
                <span>{w(founder.role.en, founder.role.uz, founder.role.ru)}</span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
      <DeferredBelowFold>
        <section className="studio-access field-wrap" data-story>
          <div className="section-heading">
            <p className="micro" data-rule>
              {w("02 / ACCESS", "02 / FOYDALANISH", "02 / ДОСТУП")}
            </p>
            <h2>
              <MarkedText
                text={w("A clear way in.", "Boshlash yo‘li aniq.", "Понятный вход.")}
                mark="highlight"
                words={2}
              />
            </h2>
          </div>
          <div className="access-grid" data-panel>
            <div className="student-access">
              <CartoonSparkle />
              <p className="micro">{w("FOR STUDENTS", "O‘QUVCHILAR UCHUN", "УЧЕНИКАМ")}</p>
              <strong className="access-price">
                $0<span>{w("student tools", "o‘quvchi vositalari", "инструменты ученика")}</span>
              </strong>
              <p>
                {w(
                  "The assessment and career activities are free. Answer as a guest; create an account to view and save your results.",
                  "Baholash va kasbiy faoliyatlar bepul. Mehmon sifatida javob bering; natijani ko‘rish va saqlash uchun hisob yarating.",
                  "Оценка и занятия бесплатны. Отвечайте как гость; создайте аккаунт для просмотра и сохранения результатов.",
                )}
              </p>
              <Link to="/career-assessment" className="field-button secondary">
                {w("Start your profile", "Profilni boshlang", "Начните профиль")}
                <ArrowUpRight size={17} />
              </Link>
            </div>
            <div className="school-access">
              <p className="micro">{w("FOR SCHOOLS", "MAKTABLAR UCHUN", "ШКОЛАМ")}</p>
              <h3>{w("Bring a group.", "Guruh bilan boshlang.", "Начните с группой.")}</h3>
              <p>
                {w(
                  "Tell us the number of students, language and reports you need. Agree the trial size and price with us before registration.",
                  "Guruh, til va hisobot ehtiyojlarini muhokama qilamiz. Sinov hajmi va narxi kelishiladi.",
                  "Обсудим группу, язык и отчёты. Объём пилота и цена согласуются напрямую.",
                )}
              </p>
              <Link
                to="/contact"
                search={{ topic: "school" }}
                className="field-button"
                data-magnetic
              >
                {w("Discuss a school trial", "Maktab sinovini muhokama", "Обсудить школьный пилот")}
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </DeferredBelowFold>
    </PageShell>
  );
}
