import { requestWithDeadline } from "@/lib/assessment/request-deadline";
import { LatestDraftWriter } from "@/lib/assessment/latest-draft-writer";
import { ActivityPicture } from "./ActivityPicture";
import "@/styles/picture-assessment.css";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { ArrowLeft, ArrowRight, Check, X, Pause, Play } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { useI18n, useT } from "@/lib/i18n";
import { useWords } from "@/lib/editorial";
import { useMotion } from "@/components/MotionProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AssessmentProfileChooser } from "@/components/AssessmentProfileChooser";
import {
  EMPTY_PROFILE,
  validProfile,
  rememberResultProfile,
  type AttemptProfile,
} from "@/lib/assessment/attempt-profile";
import { rememberSavedAssessment } from "@/lib/assessment/saved-attempt";
import { startProfileSessions, submitCareerAssessment } from "@/lib/assessment/career.functions";
import {
  loadPictureDraft,
  savePictureDraft,
  deletePictureDraft,
} from "@/lib/assessment/picture-progress.functions";
import {
  emptyPictureDraft,
  pictureDraftKey,
  validPictureDraft,
  type PictureDraft,
} from "@/lib/assessment/picture-draft";
import { PictureFigure } from "./PictureFigure";
import { figureDescription } from "@/lib/assessment/picture-descriptions";
import { AssessmentAbbi } from "./AssessmentAbbi";

const emptyObservation = () => ({ shown: false, answered: false, chosenAnswer: null, timeMs: 0 });
function questionAt(d: PictureDraft) {
  if (d.step < 12) return { kind: "p" as const, index: d.step, q: d.session.personality[d.step] };
  if (d.step < 12 + d.session.iq.length)
    return { kind: "c" as const, index: d.step - 12, q: d.session.iq[d.step - 12] };
  return {
    kind: "i" as const,
    index: d.step - 12 - d.session.iq.length,
    q: d.session.interest[d.step - 12 - d.session.iq.length],
  };
}
function Face({ index }: { index: number }) {
  const colors = ["#ff7a66", "#fde0dc", "#fff", "#d6f5e0", "#45c97a"];
  return (
    <svg className="picture-face" viewBox="0 0 44 44" aria-hidden="true">
      <circle cx="22" cy="22" r="19" fill={colors[index]} stroke="#1d1b16" strokeWidth="2.6" />
      <circle cx="16" cy="18" r="2.6" fill="#1d1b16" />
      <circle cx="28" cy="18" r="2.6" fill="#1d1b16" />
      {index === 4 ? (
        <path d="M13 26Q22 37 31 26Z" fill="white" stroke="#1d1b16" strokeWidth="2.6" />
      ) : (
        <path
          d={["M14 33Q22 25 30 33", "M15 32Q22 28 29 32", "M15 30H29", "M15 28Q22 33 29 28"][index]}
          fill="none"
          stroke="#1d1b16"
          strokeWidth="2.6"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

function AssessmentCard({ children, className = "", ...props }: React.HTMLAttributes<HTMLElement>) {
  return (
    <div className="picture-card-shell">
      <span className="picture-card-hatch" aria-hidden="true" />
      <section className={`picture-card ${className}`} {...props}>
        {children}
      </section>
    </div>
  );
}

export function PictureAssessment() {
  const { user, loading } = useAuth(),
    { lang, setLang } = useI18n(),
    t = useT(),
    w = useWords();
  const { enabled: motion, toggle: toggleMotion } = useMotion();
  const navigate = useNavigate(),
    start = useServerFn(startProfileSessions),
    submit = useServerFn(submitCareerAssessment);
  const loadCloud = useServerFn(loadPictureDraft),
    saveCloud = useServerFn(savePictureDraft),
    deleteCloud = useServerFn(deletePictureDraft);
  const [draft, setDraft] = useState<PictureDraft | null>(null),
    [profile, setProfile] = useState<AttemptProfile>(EMPTY_PROFILE);
  const [ready, setReady] = useState(false),
    [started, setStarted] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState<string | null>(null);
  const [localFailed, setLocalFailed] = useState(false),
    [cloudStatus, setCloudStatus] = useState<"idle" | "saving" | "saved" | "failed">("idle");
  const live = useRef<PictureDraft | null>(null),
    owner = useRef<string | null>(null),
    hydrated = useRef(false),
    request = useRef(0),
    writer = useRef<LatestDraftWriter<PictureDraft> | null>(null);
  const clock = useRef<{ id: string; since: number } | null>(null),
    heading = useRef<HTMLHeadingElement>(null),
    guard = useRef(false);
  const deviceSaved = useRef(true);
  const writeLocal = useCallback((d: PictureDraft) => {
    try {
      localStorage.setItem(pictureDraftKey(owner.current), JSON.stringify(d));
      deviceSaved.current = true;
      setLocalFailed(false);
    } catch {
      deviceSaved.current = false;
      setLocalFailed(true);
    }
  }, []);
  const commit = useCallback(
    (update: (d: PictureDraft) => PictureDraft) => {
      const old = live.current;
      if (!old) return;
      const observations = { ...old.observations };
      if (clock.current) {
        const elapsed = Math.max(0, performance.now() - clock.current.since);
        const o = observations[clock.current.id] ?? emptyObservation();
        observations[clock.current.id] = { ...o, timeMs: Math.min(86400000, o.timeMs + elapsed) };
        clock.current.since = performance.now();
      }
      const next = {
        ...update({ ...old, observations }),
        revision: old.revision + 1,
        updatedAt: Date.now(),
      };
      live.current = next;
      setDraft(next);
      writeLocal(next);
    },
    [writeLocal],
  );

  // A durable draft stores answers only; demographic choices stay tab-local.
  useEffect(() => {
    if (loading) return;
    const generation = ++request.current;
    let cancelled = false;
    hydrated.current = false;
    writer.current?.dispose();
    writer.current = user
      ? new LatestDraftWriter(
          (snapshot, signal) =>
            saveCloud({ data: { expectedOwner: user.id, draft: snapshot }, signal }),
          (status) => {
            if (!cancelled && request.current === generation) setCloudStatus(status);
          },
        )
      : null;
    owner.current = user?.id ?? null;
    clock.current = null;
    live.current = null;
    setDraft(null);
    setStarted(false);
    setReady(false);
    setCloudStatus("idle");
    setError(null);
    let local: PictureDraft | null = null;
    try {
      const own = localStorage.getItem(pictureDraftKey(owner.current));
      const raw = own ?? (user ? localStorage.getItem(pictureDraftKey(null)) : null);
      const parsed = JSON.parse(raw ?? "null");
      if (validPictureDraft(parsed)) local = parsed;
      if (local && user && !own) {
        localStorage.setItem(pictureDraftKey(user.id), JSON.stringify(local));
        localStorage.removeItem(pictureDraftKey(null));
      }
      const p = JSON.parse(
        sessionStorage.getItem(`abilitio.picture-profile:${owner.current ?? "guest"}`) ??
          sessionStorage.getItem("abilitio.picture-profile:guest") ??
          "null",
      );
      setProfile(
        validProfile(p)
          ? p
          : {
              gender: null,
              ageGroup: local ? (local.session.iq.length ? "teen_adult" : "child") : null,
            },
      );
    } catch {
      setProfile(EMPTY_PROFILE);
    }
    if (local) {
      live.current = local;
      setDraft(local);
    }
    const initial = local;
    (async () => {
      try {
        if (user) {
          const remote = await requestWithDeadline((signal) => loadCloud({ signal }));
          if (cancelled || request.current !== generation) return;
          // Never overwrite an answer made while the recovery request was in flight.
          if (
            remote &&
            validPictureDraft(remote) &&
            live.current === initial &&
            (!initial || remote.updatedAt > initial.updatedAt)
          ) {
            live.current = remote;
            setDraft(remote);
            writeLocal(remote);
            setProfile((p) => ({
              ...p,
              ageGroup: remote.session.iq.length ? "teen_adult" : "child",
            }));
          }
        }
      } catch {
        if (!cancelled && request.current === generation) setCloudStatus("failed");
      } finally {
        if (!cancelled && request.current === generation) {
          hydrated.current = true;
          setReady(true);
        }
      }
    })();
    return () => {
      cancelled = true;
      writer.current?.dispose();
      hydrated.current = false;
    };
  }, [loading, user, loadCloud, saveCloud, writeLocal]);

  // Superseded snapshots never queue network requests. The final save flushes
  // the latest snapshot before grading, retaining server revision protection.
  useEffect(() => {
    if (draft && user && hydrated.current) writer.current?.push(draft);
  }, [draft, user]);

  useEffect(() => {
    if (!validProfile(profile)) return;
    try {
      sessionStorage.setItem(
        `abilitio.picture-profile:${user?.id ?? "guest"}`,
        JSON.stringify(profile),
      );
    } catch {
      /* optional profile styling */
    }
  }, [profile, user?.id]);
  const current = draft ? questionAt(draft) : null;
  const questionId = current?.q.id;
  useEffect(() => {
    clock.current = null;
    if (!started || !draft || draft.screen !== "question" || !questionId) return;
    if (!document.hidden) clock.current = { id: questionId, since: performance.now() };
    commit((d) => ({
      ...d,
      observations: {
        ...d.observations,
        [questionId]: { ...(d.observations[questionId] ?? emptyObservation()), shown: true },
      },
    }));
    heading.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "instant" });
    return () => {
      clock.current = null;
    };
    // Timing is attached to the visible item, not each answer render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [started, draft?.screen, questionId]);
  useEffect(() => {
    const visibility = () => {
      commit((d) => d);
      clock.current = document.hidden
        ? null
        : live.current?.screen === "question" && started
          ? { id: questionAt(live.current).q.id, since: performance.now() }
          : null;
    };
    const leave = () => {
      commit((d) => d);
      clock.current = null;
    };
    document.addEventListener("visibilitychange", visibility);
    window.addEventListener("pagehide", leave);
    return () => {
      document.removeEventListener("visibilitychange", visibility);
      window.removeEventListener("pagehide", leave);
    };
  }, [commit, started]);

  async function begin() {
    if (guard.current || !validProfile(profile)) return;
    guard.current = true;
    setBusy(true);
    setError(null);
    try {
      if (!live.current) {
        const sessions = await start();
        const d = emptyPictureDraft(sessions[profile.ageGroup!]);
        live.current = d;
        setDraft(d);
        writeLocal(d);
      }
      setStarted(true);
    } catch {
      setError(
        w(
          "Questions could not load. Please retry.",
          "Savollar yuklanmadi. Qayta urinib ko‘ring.",
          "Не удалось загрузить вопросы. Попробуйте снова.",
        ),
      );
    } finally {
      guard.current = false;
      setBusy(false);
    }
  }
  const selected =
    current && draft
      ? current.kind === "p"
        ? draft.answers.personality[current.index]
        : current.kind === "c"
          ? draft.answers.iq[current.index]
          : draft.answers.interest[current.index][0]
      : null;
  const canNext = selected !== null && selected !== undefined;
  function choose(value: number | string) {
    if (!current || busy) return;
    commit((d) => {
      const c = questionAt(d),
        answers = {
          personality: [...d.answers.personality],
          iq: [...d.answers.iq],
          interest: d.answers.interest.map((a) => [...a]),
        };
      let chosen: string;
      if (c.kind === "p") {
        answers.personality[c.index] = Number(value);
        chosen = `${c.q.id}:likert:${value}`;
      } else if (c.kind === "c") {
        answers.iq[c.index] = Number(value);
        chosen = c.q.picture!.options[Number(value)].id;
      } else {
        answers.interest[c.index] = [String(value)];
        chosen = String(value);
      }
      return {
        ...d,
        answers,
        observations: {
          ...d.observations,
          [c.q.id]: {
            ...(d.observations[c.q.id] ?? emptyObservation()),
            shown: true,
            answered: true,
            chosenAnswer: chosen,
          },
        },
      };
    });
  }
  function next() {
    if (!canNext || busy || !draft) return;
    commit((d) => {
      const c = questionAt(d);
      const v =
        c.kind === "p"
          ? d.answers.personality[c.index]
          : c.kind === "c"
            ? d.answers.iq[c.index]
            : d.answers.interest[c.index][0];
      if (v === null || v === undefined) return d;
      const boundary = d.step === 11 || (d.session.iq.length > 0 && d.step === 20);
      return {
        ...d,
        screen: d.step === 29 ? "finish" : boundary ? "part-done" : "question",
        step: boundary || d.step === 29 ? d.step : d.step + 1,
      };
    });
  }
  function back() {
    if (busy) return;
    commit((d) => ({
      ...d,
      screen: "question",
      step:
        d.screen === "question"
          ? Math.max(0, d.step - 1)
          : d.screen === "reasoning-intro"
            ? 11
            : d.step,
    }));
    if (draft?.step === 0 && draft.screen === "question") setStarted(false);
  }
  function continuePart() {
    commit((d) => ({
      ...d,
      screen:
        d.step === 11 && d.session.iq.length > 0 && d.screen === "part-done"
          ? "reasoning-intro"
          : "question",
      step:
        d.step === 11 && d.session.iq.length > 0 && d.screen === "part-done" ? d.step : d.step + 1,
    }));
  }
  async function exit() {
    if (busy) return;
    commit((d) => d);
    setBusy(true);
    try {
      if (user && live.current) await writer.current!.flush(live.current);
      if (!deviceSaved.current && !user) throw new Error("storage");
      await navigate({ to: "/" });
    } catch {
      setError(
        w(
          "Saving failed. Your test is still open; retry Save and exit.",
          "Saqlanmadi. Test ochiq turibdi; saqlashni qayta bosing.",
          "Не удалось сохранить. Тест открыт; повторите сохранение.",
        ),
      );
    } finally {
      setBusy(false);
    }
  }
  async function finish() {
    if (guard.current || !draft) return;
    commit((d) => d);
    if (!user) {
      await navigate({ to: "/auth", search: { mode: "signup", next: "/career-assessment" } });
      return;
    }
    guard.current = true;
    setBusy(true);
    setError(null);
    try {
      const d = live.current!;
      await writer.current!.flush(d);
      // Completing an attempt must not race an older queued draft write.
      const result = await requestWithDeadline((signal) =>
        submit({
          signal,
          data: {
            sessionToken: d.session.sessionToken,
            personalityQIds: d.session.personality.map((q) => q.id),
            personalityAnswers: d.answers.personality.map((v) => v ?? 3),
            iqQIds: d.session.iq.map((q) => q.id),
            iqAnswers: d.answers.iq.map((v) => v ?? -1),
            interestQIds: d.session.interest.map((q) => q.id),
            interestAnswers: d.answers.interest,
          },
        }),
      );
      rememberSavedAssessment(result.id, pictureDraftKey(user.id));
      rememberResultProfile(result.id, user.id, profile);
      // The acknowledged result is authoritative. Optional draft cleanup must
      // never delay showing it; recovery already excludes completed nonces.
      void deleteCloud({ data: { sessionToken: d.session.sessionToken } }).catch(() => {});
      try {
        localStorage.removeItem(pictureDraftKey(user.id));
        localStorage.removeItem(pictureDraftKey(null));
      } catch {
        /* optional cleanup */
      }
      await navigate({ to: "/career-results" });
    } catch {
      setError(
        w(
          "Your result was not saved. Please retry; your answers remain here.",
          "Natija saqlanmadi. Qayta urinib ko‘ring; javoblar shu yerda.",
          "Результат не сохранён. Повторите попытку; ответы остаются здесь.",
        ),
      );
    } finally {
      guard.current = false;
      setBusy(false);
    }
  }
  function keyboard(e: KeyboardEvent<HTMLDivElement>) {
    if (
      !started ||
      busy ||
      !draft ||
      draft.screen !== "question" ||
      !current ||
      e.repeat ||
      e.altKey ||
      e.ctrlKey ||
      e.metaKey
    )
      return;
    const target = e.target as HTMLElement;
    if (!target.closest(".picture-main")) return;
    if (
      target.closest("select,textarea,[contenteditable=true]") ||
      (target.tagName === "INPUT" && (target as HTMLInputElement).type !== "radio")
    )
      return;
    const number = /^[1-5]$/.test(e.key)
      ? Number(e.key)
      : /^[a-d]$/i.test(e.key)
        ? e.key.toUpperCase().charCodeAt(0) - 64
        : 0;
    const count =
      current.kind === "p"
        ? 5
        : current.kind === "c"
          ? current.q.options[lang].length
          : current.q.options.length;
    if (number && number <= count) {
      e.preventDefault();
      choose(
        current.kind === "p"
          ? number
          : current.kind === "c"
            ? number - 1
            : current.q.options[number - 1].id,
      );
    } else if (e.key === "Enter" && target.tagName !== "BUTTON" && target.tagName !== "A") {
      e.preventDefault();
      next();
    }
  }
  const labels = [
    w("Work preferences", "Ish afzalliklari", "Предпочтения"),
    ...(draft?.session.iq.length === 0 || (!draft && profile.ageGroup === "child")
      ? []
      : [w("Reasoning", "Mantiq", "Мышление")]),
    w("Interests", "Qiziqishlar", "Интересы"),
  ];
  const part =
    draft && started
      ? draft.screen === "finish"
        ? labels.length
        : draft.screen === "reasoning-intro"
          ? 1
          : draft.screen === "part-done"
            ? draft.step === 11
              ? 1
              : labels.length - 1
            : draft.step < 12
              ? 0
              : draft.session.iq.length && draft.step < 21
                ? 1
                : labels.length - 1
      : -1;
  const likert = [
    t.careerAssessment.likert1,
    t.careerAssessment.likert2,
    t.careerAssessment.likert3,
    t.careerAssessment.likert4,
    t.careerAssessment.likert5,
  ];
  const saveNotice = localFailed
    ? w(
        "Device saving failed. Keep this tab open.",
        "Qurilmaga saqlanmadi. Bu oynani ochiq qoldiring.",
        "Сохранение на устройстве не работает. Не закрывайте вкладку.",
      )
    : cloudStatus === "failed"
      ? w(
          "Account saving failed. Retry below; your device copy remains.",
          "Hisobga saqlanmadi. Qayta urinib ko‘ring; qurilmadagi nusxa bor.",
          "Сохранение в аккаунт не удалось. Повторите; копия на устройстве остаётся.",
        )
      : cloudStatus === "saving"
        ? w("Saving to your account…", "Hisobingizga saqlanmoqda…", "Сохраняем в аккаунт…")
        : user && cloudStatus === "saved"
          ? w(
              "Saved to your account and this device.",
              "Hisobingiz va shu qurilmaga saqlandi.",
              "Сохранено в аккаунте и на устройстве.",
            )
          : w(
              "Saved on this device. Resume within 24 hours.",
              "Shu qurilmaga saqlandi. 24 soat ichida davom eting.",
              "Сохранено на устройстве. Вернитесь в течение 24 часов.",
            );
  return (
    <div
      className="picture-assessment page-plane"
      data-motion={motion ? "on" : "off"}
      onKeyDown={keyboard}
    >
      <header className="picture-header">
        <div className="picture-header-inner">
          <Link to="/" className="picture-brand" aria-label="Abilitio">
            <svg width="32" height="32" viewBox="0 0 40 40" aria-hidden="true">
              <path
                d="M19.5 4L36 34H3Z"
                fill="#ffd93d"
                stroke="#1d1b16"
                strokeWidth="3"
                strokeLinejoin="round"
              />
              <path
                d="M19.5 4V22L12.5 34M19.5 22L26.5 34"
                fill="none"
                stroke="#1d1b16"
                strokeWidth="3"
              />
            </svg>
            abilitio<b>.</b>
          </Link>
          <ol
            className="picture-parts"
            aria-label={w("Test parts", "Test qismlari", "Части теста")}
          >
            {labels.map((label, i) => (
              <li
                key={label}
                className={`picture-part ${i === part ? "picture-part-current" : i < part ? "picture-part-done" : ""}`}
                aria-current={i === part ? "step" : undefined}
              >
                {i < part ? <Check size={15} aria-hidden="true" /> : <span>{i + 1} ·</span>}
                {label}
              </li>
            ))}
          </ol>
          <div className="picture-header-tools">
            <select
              className="picture-language"
              aria-label={t.common.language}
              value={lang}
              onChange={(e) => setLang(e.target.value as typeof lang)}
            >
              <option value="en">ENG</option>
              <option value="ru">RU</option>
              <option value="uz">UZ</option>
            </select>
            <button
              className="picture-secondary picture-icon-button"
              onClick={toggleMotion}
              aria-pressed={motion}
              aria-label={w("Motion", "Harakat", "Анимация")}
            >
              {motion ? <Pause size={17} /> : <Play size={17} />}
            </button>
            <ThemeToggle />
            <button
              className="picture-secondary picture-icon-button"
              aria-label={w("Save and exit", "Saqlash va chiqish", "Сохранить и выйти")}
              onClick={exit}
              disabled={busy}
            >
              <X size={18} />
            </button>
          </div>
        </div>
      </header>
      <main className="picture-main" id="main">
        {!ready || loading ? (
          <div className="picture-card" role="status">
            {t.common.loading}
          </div>
        ) : !started ? (
          <AssessmentCard>
            <div className="picture-intro-row">
              <div>
                <h1>
                  <span style={{ color: "#d9381e" }}>30</span>
                  {w(
                    " questions. One starting profile.",
                    " ta savol. Boshlang‘ich profilingiz.",
                    " вопросов. Ваш первый профиль.",
                  )}
                </h1>
                <p>
                  {w(
                    profile.ageGroup === "child"
                      ? "Work preferences and interests."
                      : "Work preferences, reasoning and interests.",
                    profile.ageGroup === "child"
                      ? "Ish afzalliklari va qiziqishlar."
                      : "Ish afzalliklari, mantiq va qiziqishlar.",
                    profile.ageGroup === "child"
                      ? "Предпочтения и интересы."
                      : "Предпочтения, мышление и интересы.",
                  )}
                </p>
              </div>
              <AssessmentAbbi />
            </div>
            <div className="picture-composition">
              <div>
                <strong>12</strong>
                {labels[0]}
              </div>
              {profile.ageGroup !== "child" && (
                <div>
                  <strong>9</strong>
                  {w("picture puzzles", "rasmli savol", "задач с картинками")}
                </div>
              )}
              <div>
                <strong>{profile.ageGroup === "child" ? 18 : 9}</strong>
                {labels.at(-1)}
              </div>
            </div>
            {(!draft || validProfile(profile)) && (
              <AssessmentProfileChooser
                profile={profile}
                disabled={!!draft || busy}
                onChange={setProfile}
              />
            )}
            {draft && !validProfile(profile) && (
              <div className="picture-profile-resume">
                <p>
                  {w(
                    "Choose your profile to continue. Your answers are kept.",
                    "Davom etish uchun profilingizni tanlang. Javoblar saqlangan.",
                    "Выберите профиль для продолжения. Ответы сохранены.",
                  )}
                </p>
                <AssessmentProfileChooser
                  profile={profile}
                  disabled={busy}
                  onChange={(p) =>
                    setProfile({ ...p, ageGroup: draft.session.iq.length ? "teen_adult" : "child" })
                  }
                />
              </div>
            )}
            <p className="picture-honesty">
              {w(
                "This is not a clinical diagnosis, certified IQ score or career verdict. We do not convert it into IQ.",
                "Bu klinik tashxis, tasdiqlangan IQ bali yoki kasbiy hukm emas. Biz natijani IQ ga aylantirmaymiz.",
                "Это не клинический диагноз, сертифицированный балл IQ или вердикт о карьере. Мы не переводим результат в IQ.",
              )}
            </p>
            <p className="picture-honesty">
              {user
                ? w(
                    "Your answers save to this device and your account.",
                    "Javoblar shu qurilma va hisobingizga saqlanadi.",
                    "Ответы сохраняются на устройстве и в аккаунте.",
                  )
                : w(
                    "Start without an account. Sign in to view and save your results.",
                    "Hisobsiz boshlang. Natijani ko‘rish va saqlash uchun kiring.",
                    "Начните без аккаунта. Войдите для просмотра и сохранения результатов.",
                  )}
            </p>
            {error && (
              <p className="picture-error" role="alert">
                {error}
              </p>
            )}
            <div className="picture-actions">
              <button
                className="picture-primary"
                disabled={busy || !validProfile(profile)}
                onClick={begin}
              >
                {busy
                  ? t.common.loading
                  : draft
                    ? w("Continue", "Davom etish", "Продолжить")
                    : w("Start the assessment", "Testni boshlash", "Начать тест")}
                <ArrowRight size={18} />
              </button>
              {draft && (
                <button
                  className="picture-secondary"
                  disabled={busy}
                  onClick={async () => {
                    if (user) {
                      try {
                        await deleteCloud({ data: { sessionToken: draft.session.sessionToken } });
                      } catch {
                        setError(
                          w(
                            "Could not reset the account draft. Retry.",
                            "Hisobdagi urinish tozalanmadi. Qayta urining.",
                            "Не удалось сбросить черновик. Повторите.",
                          ),
                        );
                        return;
                      }
                    }
                    try {
                      localStorage.removeItem(pictureDraftKey(owner.current));
                    } catch {
                      /* optional */
                    }
                    live.current = null;
                    setDraft(null);
                    setProfile(EMPTY_PROFILE);
                  }}
                >
                  {w("Restart", "Qayta boshlash", "Начать заново")}
                </button>
              )}
            </div>
          </AssessmentCard>
        ) : draft && current ? (
          <>
            <p className="picture-save-status" role="status">
              {saveNotice}{" "}
              {cloudStatus === "failed" && (
                <button className="text-link" onClick={() => commit((d) => d)}>
                  {w("Retry", "Qayta urinish", "Повторить")}
                </button>
              )}
            </p>
            {draft.screen === "question" ? (
              <>
                <div className="picture-progress">
                  <span>
                    {labels[part]} · {current.index + 1} /{" "}
                    {current.kind === "p"
                      ? 12
                      : current.kind === "c"
                        ? 9
                        : draft.session.interest.length}
                  </span>
                  <div className="picture-dots" aria-hidden="true">
                    {Array.from(
                      {
                        length:
                          current.kind === "p"
                            ? 12
                            : current.kind === "c"
                              ? 9
                              : draft.session.interest.length,
                      },
                      (_, i) => (
                        <i
                          key={i}
                          data-state={
                            i < current.index ? "done" : i === current.index ? "current" : "next"
                          }
                        />
                      ),
                    )}
                  </div>
                </div>
                <AssessmentCard key={questionId}>
                  <h2 ref={heading} tabIndex={-1} id="picture-question">
                    {current.q.prompt[lang]}
                  </h2>
                  {current.kind === "p" && (
                    <p className="picture-no-right">
                      {w(
                        "No right or wrong answers here.",
                        "Bu yerda to‘g‘ri yoki noto‘g‘ri javob yo‘q.",
                        "Здесь нет правильных и неправильных ответов.",
                      )}
                    </p>
                  )}
                  {current.kind === "c" && current.q.picture && (
                    <div className="picture-figure">
                      <PictureFigure figure={current.q.picture.figure} lang={lang} />
                    </div>
                  )}
                  <fieldset
                    className={`picture-answers ${current.kind === "p" ? "picture-faces" : ""}`}
                    aria-labelledby="picture-question"
                    disabled={busy}
                  >
                    <legend className="sr-only">
                      {w("Choose one answer", "Bitta javob tanlang", "Выберите один ответ")}
                    </legend>
                    {current.kind === "p"
                      ? likert.map((label, i) => (
                          <label key={i}>
                            <input
                              className="sr-only"
                              type="radio"
                              name={questionId}
                              checked={selected === i + 1}
                              onChange={() => choose(i + 1)}
                            />
                            <span className="picture-answer">
                              <Face index={i} />
                              <span>{label}</span>
                            </span>
                          </label>
                        ))
                      : current.kind === "c"
                        ? current.q.picture?.options.map((o, i) => (
                            <label key={o.id}>
                              <input
                                className="sr-only"
                                type="radio"
                                name={questionId}
                                aria-label={`${"ABCD"[i]}. ${o.figure.text?.[lang] ?? figureDescription(o.figure, lang)}`}
                                checked={selected === i}
                                onChange={() => choose(i)}
                              />
                              <span className="picture-answer">
                                <span className="picture-answer-letter" aria-hidden="true">
                                  {"ABCD"[i]}
                                </span>
                                <PictureFigure figure={o.figure} lang={lang} />
                              </span>
                            </label>
                          ))
                        : current.q.options.map((o, i) => (
                            <label key={o.id}>
                              <input
                                className="sr-only"
                                type="radio"
                                name={questionId}
                                checked={selected === o.id}
                                onChange={() => choose(o.id)}
                              />
                              <span className="picture-answer">
                                <span className="picture-interest-art" aria-hidden="true">
                                  <ActivityPicture caption={current.q.labels.en[i]} />
                                </span>
                                <span>{current.q.labels[lang][i]}</span>
                                {selected === o.id && (
                                  <Check className="picture-check" aria-hidden="true" />
                                )}
                              </span>
                            </label>
                          ))}
                  </fieldset>
                  <div className="picture-actions">
                    <button className="picture-secondary" onClick={back} disabled={busy}>
                      <ArrowLeft size={18} />
                      {t.careerAssessment.back}
                    </button>
                    <button className="picture-primary" disabled={!canNext || busy} onClick={next}>
                      {t.careerAssessment.next}
                      <ArrowRight size={18} />
                    </button>
                  </div>
                </AssessmentCard>
              </>
            ) : draft.screen === "reasoning-intro" ? (
              <AssessmentCard>
                <div className="picture-intro-row">
                  <div>
                    <span className="picture-part picture-part-current">
                      {w("Part 2 of 3", "3 qismdan 2-qism", "Часть 2 из 3")}
                    </span>
                    <h1 style={{ marginTop: 22 }}>{w("Reasoning", "Mantiq", "Мышление")}</h1>
                    <p>
                      {w(
                        "9 picture puzzles. No numbers, no formulas, no timer.",
                        "9 ta rasmli savol. Sonlar, formulalar va taymer yo‘q.",
                        "9 задач с картинками. Без чисел, формул и таймера.",
                      )}
                    </p>
                  </div>
                  <AssessmentAbbi />
                </div>
                <ul className="picture-tips">
                  <li>{w("Look for the rule", "Qoidani toping", "Ищите правило")}</li>
                  <li>{w("Pick one answer", "Bitta javob tanlang", "Выберите один ответ")}</li>
                  <li>{w("You can go back", "Orqaga qaytish mumkin", "Можно вернуться назад")}</li>
                </ul>
                <div className="picture-actions">
                  <button className="picture-secondary" onClick={back}>
                    {t.careerAssessment.back}
                  </button>
                  <button className="picture-primary" onClick={continuePart}>
                    {w("Start", "Boshlash", "Начать")}
                    <ArrowRight size={18} />
                  </button>
                </div>
              </AssessmentCard>
            ) : draft.screen === "part-done" ? (
              <AssessmentCard className="picture-celebrate">
                <div className="picture-intro-row">
                  <AssessmentAbbi celebrate />
                  <div>
                    <h1>{w("Part done!", "Qism tugadi!", "Часть готова!")}</h1>
                    <p>
                      {draft.step === 11 && draft.session.iq.length
                        ? w("Next: Reasoning", "Keyingi qism: Mantiq", "Далее: Мышление")
                        : w("Next: Interests", "Keyingi qism: Qiziqishlar", "Далее: Интересы")}
                    </p>
                    <div className="picture-actions">
                      <button className="picture-secondary" onClick={back}>
                        {t.careerAssessment.back}
                      </button>
                      <button className="picture-primary" onClick={continuePart}>
                        {w("Continue", "Davom etish", "Продолжить")}
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </AssessmentCard>
            ) : (
              <AssessmentCard className="picture-finish">
                <div className="picture-intro-row">
                  <AssessmentAbbi celebrate />
                  <div>
                    <h1>
                      {w("Your answers are ready.", "Javoblaringiz tayyor.", "Ваши ответы готовы.")}
                    </h1>
                    <p>
                      {user
                        ? w(
                            "Save your answers to build your starting profile.",
                            "Boshlang‘ich profilingizni yaratish uchun javoblarni saqlang.",
                            "Сохраните ответы, чтобы получить первый профиль.",
                          )
                        : w(
                            "Sign in to build and save your starting profile.",
                            "Boshlang‘ich profilni yaratish va saqlash uchun kiring.",
                            "Войдите, чтобы получить и сохранить первый профиль.",
                          )}
                    </p>
                    <div className="picture-actions">
                      <button className="picture-secondary" onClick={back} disabled={busy}>
                        {t.careerAssessment.back}
                      </button>
                      <button className="picture-primary" onClick={finish} disabled={busy}>
                        {busy
                          ? t.common.loading
                          : user
                            ? w("See my results", "Natijalarim", "Мои результаты")
                            : w(
                                "Sign in for results",
                                "Natija uchun kirish",
                                "Войти для результатов",
                              )}
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </AssessmentCard>
            )}
            {error && (
              <p className="picture-error" role="alert">
                {error}
              </p>
            )}
          </>
        ) : null}
      </main>
    </div>
  );
}
