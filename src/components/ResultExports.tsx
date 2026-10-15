import { useEffect, useRef, useState } from "react";
import type { CareerResultDTO } from "@/lib/assessment/career.functions";
import {
  downloadLocal,
  drawWrapped,
  exportCanvas,
  makeReportPdf,
} from "@/lib/assessment/local-export";
import { workExperiment } from "@/lib/assessment/work-experiments";
import { formatReasoningScore, reasoningCaveat } from "@/lib/assessment/reasoning-copy";
import { useWords } from "@/lib/editorial";
import { useI18n } from "@/lib/i18n";
import { useUiText } from "@/lib/ui-text";
export function ResultExports({ result }: { result: CareerResultDTO }) {
  const w = useWords();
  const { lang, t } = useI18n();
  const tr = useUiText();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (preview && !dialog.current?.open) dialog.current?.showModal();
  }, [preview]);
  async function pdf() {
    setBusy(true);
    setError(false);
    try {
      const sections = [
        {
          heading: w("Your attempt", "Urinishingiz", "Ваша попытка"),
          lines: [
            new Date(result.created_at).toLocaleDateString(lang),
            formatReasoningScore(result.cognitive_score, lang),
            reasoningCaveat(lang),
            w(
              "Scores describe exploratory fit, not probability or ability.",
              "Ballar izlanish mosligini tavsiflaydi, ehtimol yoki qobiliyatni emas.",
              "Баллы описывают соответствие для знакомства, а не вероятность или способности.",
            ),
          ],
        },
        {
          heading: w(
            "Work preferences and interests",
            "Ish afzalliklari va qiziqishlar",
            "Рабочие предпочтения и интересы",
          ),
          lines: [
            ...(result.cognitive_tier === "Not assessed"
              ? []
              : [
                  tr(result.personality_type ?? "Mixed preferences"),
                  tr(result.work_style ?? "Mixed preferences"),
                ]),
            ...result.strengths.map(tr),
            ...result.improvements.map(tr),
            ...result.interests.map(
              (f) =>
                `${(t.fields as Record<string, string>)[f.key] ?? f.key}: ${Math.round(f.weight * 100)}/100`,
            ),
          ],
        },
        {
          heading: w(
            "Study subjects to research",
            "O‘rganiladigan ta’lim yo‘nalishlari",
            "Направления обучения для изучения",
          ),
          lines: result.university_matches.map((m) => tr(m.name)),
        },
        ...result.career_matches.map((c, i) => ({
          heading: `${i + 1}. ${tr(c.name)} · ${c.score}/100`,
          lines:
            i < 3
              ? [
                  ...(c.evidence?.support ?? []).map(
                    (a) => `${a.prompt[lang]} — ${a.answer[lang]}`,
                  ),
                  ...(!c.evidence?.support.length
                    ? [
                        w(
                          "Answer evidence was not retained for this direction.",
                          "Bu yo‘nalish uchun javob dalillari saqlanmagan.",
                          "Для этого направления не сохранены подтверждающие ответы.",
                        ),
                      ]
                    : []),
                  ...workExperiment(c.category, lang).examples,
                  workExperiment(c.category, lang).experiment,
                ]
              : [],
        })),
      ];
      downloadLocal(
        await makeReportPdf(
          w(
            "Your career exploration report",
            "Kasb izlanish hisobotingiz",
            "Ваш отчёт о знакомстве с профессиями",
          ),
          sections,
        ),
        "abilitio-career-report.pdf",
      );
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }
  async function card() {
    setBusy(true);
    setError(false);
    try {
      await document.fonts.ready;
      const { canvas, ctx } = exportCanvas(1200, 800);
      const font =
        getComputedStyle(document.documentElement).getPropertyValue("--font-sans").trim() ||
        "sans-serif";
      ctx.fillStyle = "#c42d18";
      ctx.font = `700 54px ${font}`;
      ctx.fillText("abilitio.", 60, 90);
      ctx.fillStyle = "#242321";
      ctx.font = `700 36px ${font}`;
      let y =
        drawWrapped(
          ctx,
          w(
            "Career directions to explore",
            "O‘rganiladigan kasb yo‘nalishlari",
            "Направления для знакомства",
          ),
          60,
          160,
          1080,
          46,
        ) + 55;
      for (const c of result.career_matches.slice(0, 3)) {
        ctx.font = `600 32px ${font}`;
        y = drawWrapped(ctx, `${tr(c.name)} · ${c.score}/100`, 60, y, 1080, 44) + 28;
      }
      ctx.font = `400 26px ${font}`;
      drawWrapped(
        ctx,
        w(
          "Exploratory fit, not ability or chances of success.",
          "Izlanish mosligi; qobiliyat yoki muvaffaqiyat ehtimoli emas.",
          "Соответствие для знакомства, а не способности или шанс успеха.",
        ),
        60,
        690,
        1080,
        34,
      );
      setPreview(canvas.toDataURL("image/png"));
    } catch {
      setError(true);
    } finally {
      setBusy(false);
    }
  }
  async function share() {
    if (!preview) return;
    setError(false);
    try {
      const blob = await (await fetch(preview)).blob();
      const file = new File([blob], "abilitio-career-card.png", { type: "image/png" });
      if (navigator.canShare?.({ files: [file] }))
        await navigator.share({ files: [file], title: "Abilitio" });
      else downloadLocal(blob, file.name);
    } catch (e) {
      if (!(e instanceof DOMException && e.name === "AbortError")) setError(true);
    }
  }
  return (
    <>
      <button className="field-button" disabled={busy} onClick={pdf}>
        {w("Download PDF", "PDF yuklash", "Скачать PDF")}
      </button>
      <button className="field-button" disabled={busy} onClick={card}>
        {w("Share Card", "Ulashish kartasi", "Карточка для отправки")}
      </button>
      {busy && (
        <span role="status">
          {w(
            "Preparing on this device…",
            "Shu qurilmada tayyorlanmoqda…",
            "Подготовка на устройстве…",
          )}
        </span>
      )}
      {error && (
        <p role="alert">
          {w(
            "Export failed. Please try again.",
            "Eksport bajarilmadi. Qayta urinib ko‘ring.",
            "Экспорт не удался. Повторите попытку.",
          )}
        </p>
      )}
      <dialog
        ref={dialog}
        className="export-preview panel p-5 max-w-xl w-[calc(100%-2rem)]"
        aria-labelledby="share-preview-title"
        onClose={() => setPreview(null)}
      >
        <h2 id="share-preview-title" className="text-xl">
          {w(
            "Preview before sharing",
            "Ulashishdan oldin ko‘rib chiqish",
            "Просмотр перед отправкой",
          )}
        </h2>
        <p className="my-3">
          {w(
            "This image stays on your device until you choose Share. Your full report is not included.",
            "Ulashishni tanlamaguningizcha rasm qurilmangizda qoladi. To‘liq hisobot kiritilmagan.",
            "Изображение остаётся на устройстве, пока вы не выберете отправку. Полный отчёт не включён.",
          )}
        </p>
        {preview && (
          <img
            src={preview}
            alt={w("Career card preview", "Kasb kartasi ko‘rinishi", "Предпросмотр карточки")}
            className="w-full"
          />
        )}
        <div className="flex flex-wrap gap-3 mt-4">
          <a
            href={preview ?? undefined}
            download="abilitio-career-card.png"
            className="field-button"
          >
            {w("Download image", "Rasm yuklash", "Скачать изображение")}
          </a>
          <button onClick={share} className="field-button">
            {w("Share", "Ulashish", "Отправить")}
          </button>
          <button onClick={() => dialog.current?.close()} className="field-button">
            {w("Close", "Yopish", "Закрыть")}
          </button>
        </div>
      </dialog>
    </>
  );
}
