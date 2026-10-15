import { ResultExports } from "@/components/ResultExports";
import { z } from "zod";
import { filterCareers } from "@/lib/assessment/report-tools";
import "@/styles/assessment.css";
import { CommunityChoice } from "@/components/CommunityChoice";
import { CareerReasons } from "@/components/CareerReasons";
import { readResultProfile, resetAttempt } from "@/lib/assessment/attempt-profile";
import { applyResultRules } from "@/lib/assessment/result-rules";
import { useUiText } from "@/lib/ui-text";
import { loadForAccount, type AccountLoad } from "@/lib/account-load";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PageShell } from "@/components/PageShell";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useAuth } from "@/lib/auth-context";
import { useWords } from "@/lib/editorial";
import { getMyCareerResult, type CareerResultDTO } from "@/lib/assessment/career.functions";
import { scoringMethodology } from "@/lib/assessment/scoring-config";
import { formatReasoningScore, reasoningCaveat } from "@/lib/assessment/reasoning-copy";

import { Reveal } from "@/components/Reveal";
import { GlowBlob } from "@/components/GlowBlob";
import { CountUp } from "@/components/CountUp";
import {
  Brain,
  Target,
  Sparkles,
  Trophy,
  GraduationCap,
  RefreshCw,
  TrendingUp,
  Lightbulb,
} from "lucide-react";
import { useT, useI18n } from "@/lib/i18n";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from "recharts";

export const Route = createFileRoute("/career-results")({
  validateSearch: z.object({ resultId: z.string().uuid().optional().catch(undefined) }),
  head: () => ({
    meta: [
      { title: "Your Career Profile — Abilitio" },
      { name: "robots", content: "noindex, follow" },
    ],
  }),
  component: CareerResultsPage,
});

function CareerResultsPage() {
  const { resultId } = Route.useSearch();
  const translate = useUiText();
  const tr = (value: string | null) => (value == null ? "—" : translate(value));
  const t = useT();
  const { lang } = useI18n();
  const w = useWords();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const fetchResult = useServerFn(getMyCareerResult);
  const [resultState, setResultState] = useState<AccountLoad<CareerResultDTO>>({
    ownerId: null,
    data: null,
    error: null,
    loaded: false,
  });
  const [showAllCareers, setShowAllCareers] = useState(false);
  const [careerSearch, setCareerSearch] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: "/auth", search: { mode: "login", next: "/career-results" } });
      return;
    }
    return loadForAccount(user.id, () => fetchResult({ data: { resultId } }), setResultState);
  }, [user, loading, navigate, fetchResult, resultId]);

  const ownsResult = !loading && resultState.ownerId === user?.id;
  const rawResult = ownsResult ? resultState.data : null;
  const profile = rawResult && user ? readResultProfile(rawResult.id, user.id) : null;
  const childResult = rawResult?.cognitive_tier === "Not assessed";
  const r =
    rawResult && profile?.gender
      ? {
          ...rawResult,
          career_matches: applyResultRules(rawResult.career_matches, profile.gender, lang),
        }
      : rawResult;
  const err = ownsResult ? resultState.error : null;
  const loaded = ownsResult && resultState.loaded;

  if (!user) return null;
  if (err)
    return (
      <div className="assessment-flow assessment-result">
        <PageShell>
          <div className="px-6 pt-32 text-center text-sm text-destructive">{err}</div>
        </PageShell>
      </div>
    );

  // Still fetching — show a skeleton instead of a misleading empty state
  if (!loaded) {
    return (
      <div className="assessment-flow assessment-result">
        <PageShell>
          <section className="px-6 pt-12 pb-20">
            <div className="mx-auto max-w-5xl">
              <div className="skeleton h-10 w-72 rounded-2xl" />
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="skeleton h-44 rounded-3xl" />
                ))}
              </div>
              <div className="mt-6 skeleton h-64 rounded-3xl" />
            </div>
          </section>
        </PageShell>
      </div>
    );
  }

  if (!r) {
    return (
      <div className="assessment-flow assessment-result">
        <PageShell>
          <div className="px-6 pt-32 text-center">
            <p className="text-sm text-muted-foreground">{t.careerResults.noResult}</p>
            <Link
              to="/career-assessment"
              className="mt-4 inline-flex rounded-full bg-primary px-6 py-2 text-sm text-primary-foreground hover:-translate-y-0.5 transition-all"
            >
              {t.careerResults.takeAssessment}
            </Link>
          </div>
        </PageShell>
      </div>
    );
  }

  const filteredCareers = filterCareers(r.career_matches, careerSearch, (v) => tr(v));
  const fieldLabel = (k: string) => (t.fields as Record<string, string>)[k] ?? k;
  const archetype = r.holland_code?.[0]
    ? (t.riasec.archetypes as Record<string, string>)[r.holland_code[0]]
    : null;

  const RIASEC_ORDER = ["R", "I", "A", "S", "E", "C"] as const;
  const riasec = (r.riasec_profile ?? {}) as Record<string, number>;
  const radarData = RIASEC_ORDER.map((k) => ({
    dim: (t.riasec.dims as Record<string, string>)[k] ?? k,
    value: Math.round((riasec[k] ?? 0) * 100),
  }));
  const hasRiasec = RIASEC_ORDER.some((k) => (riasec[k] ?? 0) > 0);

  return (
    <div className="assessment-flow assessment-result">
      <PageShell>
        <style>{`
        @media print {
          nav, footer { display: none !important; }
          section { padding-top: 1rem !important; }
          body::after { content: "Generated by Abilitio — abilitio-xt4n.vercel.app"; position: fixed; bottom: 0.5cm; right: 1cm; font-size: 9pt; color: var(--muted-foreground); }
        }
      `}</style>

        <section className="relative px-6 pt-12 pb-20 print:pt-4">
          <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 print:hidden" />
          <div className="relative mx-auto max-w-5xl">
            <header className="mb-8 flex flex-wrap items-end justify-between gap-4 print:hidden">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-sm text-primary">
                  <Sparkles className="h-3.5 w-3.5" /> {t.careerResults.eyebrow}
                </div>
                <h1 className="mt-3 text-4xl font-bold gradient-text">
                  {childResult
                    ? w(
                        "Ideas to try",
                        "Sinab ko‘rish uchun g‘oyalar",
                        "Идеи, которые можно попробовать",
                      )
                    : t.careerResults.title}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {w("Generated", "Yaratilgan", "Создано")}{" "}
                  {new Date(r.created_at).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <ResultExports result={r} />
                <button
                  onClick={() => {
                    resetAttempt();
                    void navigate({ to: "/career-assessment" });
                  }}
                  className="field-button text-sm"
                >
                  <RefreshCw className="h-4 w-4" />
                  {t.careerResults.retake}
                </button>
              </div>
            </header>

            {childResult && (
              <p className="panel mb-6 rounded-2xl p-5 text-sm">
                {w(
                  "These are ideas for things you might enjoy. Try drawing a story, building a toy, or exploring nature with someone you trust. Your interests can change as you grow.",
                  "Bular senga yoqishi mumkin bo‘lgan mashg‘ulotlar. Hikoya rasmini chiz, o‘yinchoq qur yoki ishongan insoning bilan tabiatni kuzat. Ulg‘ayganing sari qiziqishlaring o‘zgarishi mumkin.",
                  "Это идеи занятий, которые могут тебе понравиться. Нарисуй историю, построй игрушку или изучай природу с человеком, которому доверяешь. Твои интересы могут меняться.",
                )}
              </p>
            )}
            {/* Top: personality + cognitive + interests */}
            <div className="grid gap-4 md:grid-cols-3">
              <Card
                icon={<Brain className="h-4 w-4" />}
                title={
                  childResult
                    ? w(
                        "How you like to play",
                        "Qanday o‘ynashni yoqtirasan",
                        "Как тебе нравится играть",
                      )
                    : t.careerResults.personalityType
                }
              >
                {childResult ? (
                  <p className="text-sm">
                    {w(
                      "You can enjoy playing with friends and playing on your own. Try different games and see what you like.",
                      "Do‘stlaring bilan ham, yolg‘iz ham o‘ynashni yoqtirishing mumkin. Turli o‘yinlarni sinab ko‘r.",
                      "Можно любить играть с друзьями и в одиночку. Пробуй разные игры и узнавай, что тебе нравится.",
                    )}
                  </p>
                ) : (
                  <>
                    <div className="text-4xl font-bold gradient-text">
                      {tr(
                        r.summary_unverified || r.personality_type?.includes("X")
                          ? "Mixed preferences"
                          : r.personality_type,
                      )}
                    </div>
                    {r.personality_type?.includes("X") && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        {w(
                          "Some answers balance both preferences. We leave those axes open rather than assign a personality type.",
                          "Ba’zi javoblarda ikki afzallik muvozanatli. Bu yo‘nalishlarni ochiq qoldiramiz va shaxsiyat turini belgilamaymiz.",
                          "Часть ответов сбалансирована между двумя предпочтениями. Мы оставляем эти направления открытыми и не назначаем тип личности.",
                        )}
                      </p>
                    )}
                    <ul className="mt-3 space-y-1 text-sm text-muted-foreground">
                      <li>
                        <span className="text-foreground/80">{t.careerResults.work}:</span>{" "}
                        {tr(r.work_style)}
                      </li>
                      <li>
                        <span className="text-foreground/80">{t.careerResults.leadership}:</span>{" "}
                        {tr(r.leadership_style)}
                      </li>
                      <li>
                        <span className="text-foreground/80">{t.careerResults.learning}:</span>{" "}
                        {tr(r.learning_style)}
                      </li>
                      <li>
                        <span className="text-foreground/80">{t.careerResults.team}:</span>{" "}
                        {tr(r.team_style)}
                      </li>
                    </ul>
                    {r.summary_unverified && (
                      <p className="mt-3 rounded-xl border border-primary/20 bg-primary/5 p-3 text-sm leading-relaxed">
                        {w(
                          "This earlier report did not retain answer-level evidence. Retake the assessment for checked strengths and work styles.",
                          "Bu oldingi hisobotda javoblar bo‘yicha dalillar saqlanmagan. Tekshirilgan kuchli tomonlar va ish uslubi uchun baholashni qayta o‘ting.",
                          "В этом раннем отчёте не сохранились данные по отдельным ответам. Пройдите оценку снова для проверенных сильных сторон и стиля работы.",
                        )}
                      </p>
                    )}
                  </>
                )}
              </Card>
              <Card
                icon={<Target className="h-4 w-4" />}
                title={
                  childResult
                    ? w("Play and discover", "O‘yna va kashf qil", "Играй и узнавай")
                    : w(
                        "Reasoning on this attempt",
                        "Bu urinishdagi mantiq",
                        "Результат заданий в этой попытке",
                      )
                }
              >
                {childResult ? (
                  <p className="text-sm">
                    {w(
                      "You answered about what you enjoy. There were no ability or maths questions.",
                      "Sen yoqtirgan narsalaring haqida javob berding. Qobiliyat yoki matematika savollari bo‘lmadi.",
                      "Ты рассказал о том, что тебе нравится. Вопросов на способности или математику не было.",
                    )}
                  </p>
                ) : (
                  <>
                    <div className="text-4xl font-bold gradient-text">
                      <CountUp
                        value={r.cognitive_score ?? 0}
                        decimals={(r.cognitive_score ?? 0) % 1 === 0 ? 0 : 1}
                      />
                      /9
                    </div>
                    <div className="mt-2 text-sm font-medium">
                      {formatReasoningScore(r.cognitive_score, lang)}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{reasoningCaveat(lang)}</p>
                  </>
                )}
              </Card>
              <Card icon={<Sparkles className="h-4 w-4" />} title={t.careerResults.topInterests}>
                {archetype && (
                  <div className="mb-3">
                    <div className="text-2xl font-bold gradient-text leading-tight">
                      {archetype}
                    </div>
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {r.holland_code.map((d) => (
                        <span
                          key={d}
                          className="rounded-full border border-primary/25 bg-primary/8 px-2 py-0.5 text-sm font-medium text-primary"
                        >
                          {(t.riasec.dims as Record<string, string>)[d] ?? d}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                <ul className="assessment-interest-list space-y-1.5 text-sm">
                  {r.interests.slice(0, 6).map((i, idx) => (
                    <li key={i.key} className="flex items-center justify-between gap-2">
                      <span>{fieldLabel(i.key)}</span>
                      <div className="h-1.5 w-24 shrink-0 rounded-full bg-secondary/60 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-[width] duration-700 ease-out"
                          style={{
                            width: `${Math.round(i.weight * 100)}%`,
                            transitionDelay: `${idx * 80}ms`,
                          }}
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              </Card>
            </div>

            {/* Strengths / improvements / skills */}
            {!childResult && (
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                <Card
                  icon={<TrendingUp className="h-4 w-4" />}
                  title={w(
                    "What your answers suggest",
                    "Javoblaringiz nimani ko‘rsatadi",
                    "Что показывают ваши ответы",
                  )}
                >
                  {!r.strengths.some((s) => !s.startsWith("Mixed signals:")) && (
                    <p className="text-sm text-muted-foreground">
                      {w(
                        "No clear strength signal from this attempt. Try an activity and reflect on what felt natural.",
                        "Bu urinishda aniq kuchli tomon belgisi yo‘q. Bir faoliyatni sinab, nima tabiiy tuyulganini o‘ylang.",
                        "В этой попытке нет явного сигнала сильной стороны. Попробуйте занятие и подумайте, что давалось естественно.",
                      )}
                    </p>
                  )}
                  <ul className="space-y-1.5 text-sm">
                    {r.strengths
                      .filter((s) => !s.startsWith("Mixed signals:"))
                      .map((s) => (
                        <li key={s} className="flex items-start gap-2">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                          {tr(s)}
                        </li>
                      ))}
                  </ul>
                  {r.strengths.some((s) => s.startsWith("Mixed signals:")) && (
                    <p className="mt-3 rounded-xl border border-primary/20 bg-primary/5 p-3 text-sm leading-relaxed">
                      <strong>
                        {w("Mixed signals", "Aralash belgilar", "Смешанные сигналы")}
                        {": "}
                      </strong>
                      {w(
                        "Some answers point in different directions. Try a related activity before drawing a conclusion.",
                        "Baʼzi javoblar turli yo‘nalishlarni ko‘rsatadi. Xulosa qilishdan oldin tegishli faoliyatni sinab ko‘ring.",
                        "Некоторые ответы указывают на разные предпочтения. Попробуйте подходящее занятие, прежде чем делать вывод.",
                      )}
                    </p>
                  )}
                </Card>
                <Card
                  icon={<Lightbulb className="h-4 w-4" />}
                  title={t.careerResults.areasToImprove}
                >
                  <ul className="space-y-1.5 text-sm">
                    {r.improvements.map((s) => (
                      <li key={s} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-card" />
                        {tr(s)}
                      </li>
                    ))}
                  </ul>
                </Card>
                <Card
                  icon={<Sparkles className="h-4 w-4" />}
                  title={t.careerResults.skillsToDevelop}
                >
                  <ul className="space-y-1.5 text-sm">
                    {r.recommended_skills.map((s) => (
                      <li key={s} className="flex items-start gap-2">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {tr(s)}
                      </li>
                    ))}
                  </ul>
                </Card>
              </div>
            )}

            {/* Interest orientation — RIASEC radar */}
            {hasRiasec && (
              <Reveal className="panel mt-6 block rounded-3xl p-6">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <Sparkles className="h-3.5 w-3.5" />
                  </span>
                  <h3 className="text-sm font-semibold">{t.careerResults.interestProfile}</h3>
                </div>
                <div className="assessment-interest-summary mt-2 grid items-center gap-4 md:grid-cols-2">
                  <div className="interest-radar h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData} outerRadius="72%">
                        <PolarGrid stroke="var(--ink)" />
                        <PolarAngleAxis
                          dataKey="dim"
                          tick={{ fill: "var(--muted-foreground)", fontSize: 16 }}
                        />
                        <Radar
                          dataKey="value"
                          stroke="var(--ink)"
                          fill="var(--mint)"
                          fillOpacity={0.28}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    {r.riasec_is_estimated && (
                      <p className="mb-3 text-sm text-muted-foreground">
                        {w(
                          "Estimated from an older result. Take a new assessment for the exact interest profile.",
                          "Eski natijadan taxmin qilingan. Aniq qiziqish profili uchun yangi baholashdan o‘ting.",
                          "Оценка по старому результату. Пройдите новую оценку для точного профиля интересов.",
                        )}
                      </p>
                    )}
                    {archetype && (
                      <div className="text-2xl font-bold gradient-text leading-tight">
                        {archetype}
                      </div>
                    )}
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {r.holland_code.map((d) => (
                        <span
                          key={d}
                          className="rounded-full border border-primary/25 bg-primary/8 px-2 py-0.5 text-sm font-medium text-primary"
                        >
                          {(t.riasec.dims as Record<string, string>)[d] ?? d}
                        </span>
                      ))}
                    </div>
                    <ul className="mt-4 space-y-1.5">
                      {radarData.map((d) => (
                        <li key={d.dim} className="flex items-center justify-between gap-3 text-sm">
                          <span className="text-muted-foreground">{d.dim}</span>
                          <div className="flex flex-1 items-center gap-2">
                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary/60">
                              <div
                                className="h-full rounded-full bg-primary"
                                style={{ width: `${d.value}%` }}
                              />
                            </div>
                            <span className="w-8 shrink-0 text-right text-sm tabular-nums text-foreground/70">
                              {d.value}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            )}

            <p className="mt-6 text-sm text-muted-foreground">
              {w(
                "This profile summarizes your answers today. Work and activity preferences are descriptions, not a diagnosis or proof of skill. Your preferences may change.",
                "Profil bugungi javoblaringiz xulosasi. Ish va mashg‘ulot afzalliklari tavsif, tashxis yoki ko‘nikma isboti emas. Afzalliklaringiz o‘zgarishi mumkin.",
                "Профиль отражает сегодняшние ответы. Рабочие предпочтения и интерес к занятиям — описания, не диагноз и не доказательство навыков. Предпочтения могут меняться.",
              )}
            </p>
            {/* Career matches */}
            <Reveal className="panel mt-6 block rounded-3xl p-6">
              <div className="flex items-center gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Trophy className="h-3.5 w-3.5" />
                </span>
                <h3 className="text-sm font-semibold">{t.careerResults.topCareers}</h3>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                {w(
                  "Exploration fit: 0–100 compares your answers with career profiles. It is not a percentage, chance of success or proof of ability. Review the reasons and try an activity before deciding.",
                  "Izlanish mosligi: 0–100 javoblaringizni kasb profillari bilan solishtiradi. Bu foiz, muvaffaqiyat ehtimoli yoki qobiliyat isboti emas. Qaror oldidan sabablarni o‘qing va faoliyatni sinang.",
                  "Соответствие для пробы: 0–100 сравнивает ответы с профилями профессий. Это не проценты, шанс успеха или доказательство способностей. Изучите причины и попробуйте занятие.",
                )}
              </p>
              <p
                className="mt-3 text-sm text-muted-foreground"
                role="status"
                data-evidence-coverage={r.evidence_coverage}
              >
                {r.evidence_coverage === "direct"
                  ? w(
                      "Evidence: direct activities and subjects, with limited certainty from one sitting.",
                      "Dalil: aniq mashg‘ulot va fanlar; bir urinish natijasi cheklangan.",
                      "Основа: конкретные занятия и предметы; вывод по одной попытке ограничен.",
                    )
                  : w(
                      "Limited evidence: this report used older visual choices or predates the current method. Try a new assessment for activity-based suggestions.",
                      "Cheklangan dalil: bu hisobot eski vizual tanlovlardan foydalangan yoki hozirgi usuldan oldin yaratilgan. Mashg‘ulotlarga asoslangan tavsiyalar uchun yangi testni sinang.",
                      "Основа ограничена: в этом отчёте использованы прежние визуальные выборы или прежний метод. Пройдите тест заново для подсказок на основе занятий.",
                    )}
              </p>
              <details className="mt-3 text-sm text-muted-foreground">
                <summary className="cursor-pointer text-foreground">
                  {w(
                    childResult ? "Where your ideas come from" : "How career ranking works",
                    childResult ? "G‘oyalar qayerdan keladi" : "Kasblar tartibi qanday tuziladi",
                    childResult ? "Откуда берутся идеи" : "Как формируется рейтинг профессий",
                  )}
                </summary>
                <p className="mt-2">
                  {childResult
                    ? w(
                        "Your ideas come from the games and activities you chose. No maths or ability score is used. These are things to explore, and you can try something new whenever you like.",
                        "G‘oyalar sen tanlagan o‘yinlar va mashg‘ulotlardan kelib chiqadi. Matematika yoki qobiliyat bali ishlatilmaydi. Bular sinab ko‘rish uchun g‘oyalar, xohlagan payting yangi narsani sinab ko‘r.",
                        "Идеи основаны на выбранных играх и занятиях. Баллы за математику или способности не используются. Это занятия для знакомства, и ты всегда можешь попробовать что-то новое.",
                      )
                    : scoringMethodology("teen_adult", lang)}
                </p>
              </details>
              <label className="mt-4 block text-sm">
                {w(
                  "Search all career matches",
                  "Barcha kasb mosliklaridan qidirish",
                  "Поиск по всем профессиям",
                )}
                <input
                  type="search"
                  value={careerSearch}
                  onChange={(event) => setCareerSearch(event.target.value)}
                  className="mt-2 w-full p-3"
                />
              </label>
              <p role="status" className="mt-2 text-sm text-muted-foreground">
                {filteredCareers.length}{" "}
                {w("careers compared", "kasb solishtirildi", "профессий сравнено")}
              </p>
              {filteredCareers.length === 0 && (
                <div role="status" className="my-4">
                  <p>
                    {w(
                      `No careers match '${careerSearch}'`,
                      `'${careerSearch}' bo‘yicha kasb topilmadi`,
                      `По запросу '${careerSearch}' профессий не найдено`,
                    )}
                  </p>
                  <button className="field-button mt-3" onClick={() => setCareerSearch("")}>
                    {w("Clear search", "Qidiruvni tozalash", "Сбросить поиск")}
                  </button>
                </div>
              )}
              <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {filteredCareers
                  .slice(0, showAllCareers || careerSearch ? undefined : 15)
                  .map((m) => (
                    <div
                      key={m.key}
                      className="rounded-2xl border border-border bg-secondary/30 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-secondary/50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold">{tr(m.name)}</div>
                        <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-sm font-medium text-primary">
                          <CountUp value={m.score} suffix="/100" />
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{tr(m.category)}</p>
                      {m.matchFields && m.matchFields.length > 0 && (
                        <div className="mt-2 flex flex-wrap items-center gap-1">
                          <span className="text-sm text-muted-foreground">
                            {t.careerResults.alignedWith}:
                          </span>
                          {m.matchFields.map((f) => (
                            <span
                              key={f}
                              className="rounded-full border border-accent/25 bg-accent/8 px-1.5 py-0.5 text-sm font-medium text-accent"
                            >
                              {fieldLabel(f)}
                            </span>
                          ))}
                        </div>
                      )}
                      {m.major && (
                        <p className="mt-2 flex items-center gap-1.5 text-sm">
                          <GraduationCap className="h-3.5 w-3.5 shrink-0 text-accent" />
                          <span className="text-muted-foreground">
                            {t.careerResults.studyMajor}:
                          </span>
                          <span className="font-medium text-foreground">{tr(m.major)}</span>
                        </p>
                      )}
                      <CareerReasons category={m.category} evidence={m.evidence} />
                      <div className="mt-2 h-1.5 rounded-full bg-secondary/60">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{
                            width: `${Math.max(0, Math.min(100, m.score))}%`,
                            boxShadow: "4px 4px 0 var(--ink)",
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
              {r.career_matches.length > 15 && !careerSearch && (
                <button
                  type="button"
                  className="text-link mt-5"
                  aria-expanded={showAllCareers}
                  onClick={() => setShowAllCareers((value) => !value)}
                >
                  {showAllCareers
                    ? w("Show top 15", "Eng mos 15 tasini ko‘rsatish", "Показать лучшие 15")
                    : w(
                        `Show all ${r.career_matches.length} careers`,
                        `Barcha ${r.career_matches.length} kasbni ko‘rsatish`,
                        `Показать все ${r.career_matches.length} профессий`,
                      )}
                </button>
              )}
            </Reveal>

            <Reveal className="panel mt-6 rounded-lg p-6">
              <h2 className="text-2xl">{t.careerResults.topMajors}</h2>
              <ul className="mt-4 space-y-4">
                {r.university_matches.map((m) => (
                  <li key={m.key}>
                    <strong>{tr(m.name)}</strong>
                    <span className="ml-4 text-sm text-muted-foreground">{tr(m.category)}</span>
                  </li>
                ))}
              </ul>
              <Link className="text-link mt-6 text-sm" to="/universities">
                {t.nav.universities}
              </Link>
            </Reveal>
            <CommunityChoice key={user.id} ownerId={user.id} />
          </div>
        </section>
      </PageShell>
    </div>
  );
}

function Card({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="result-detail-card group relative panel rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-primary/30">
      <GlowBlob className="-right-8 -top-8 h-24 w-24 opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-40" />
      <div className="relative flex items-center gap-2.5">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          {icon}
        </span>
        <h3 className="text-sm font-semibold uppercase tracking-wide">{title}</h3>
      </div>
      <div className="relative mt-3">{children}</div>
    </div>
  );
}
