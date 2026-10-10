import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { BrainPoster } from "./BrainPoster";
import { useMotion } from "./MotionProvider";
import { useWords } from "@/lib/editorial";
import { track, AnalyticsEvent } from "@/lib/analytics";
const BrainCanvas = lazy(() => import("./BrainCanvas"));
export function BrainScene({ signal = 0 }: { signal?: number }) {
  const { enabled } = useMotion();
  const w = useWords();
  const ref = useRef<HTMLDivElement>(null);
  const [staticMode, setStaticMode] = useState(false);
  useEffect(() => setStaticMode(new URLSearchParams(location.search).has("static")), []);
  const [load, setLoad] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (!enabled || staticMode) return;
    let timer: ReturnType<typeof setTimeout>;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        timer = setTimeout(() => {
          setProgress(10);
          import("./BrainCanvas")
            .then(() => {
              setProgress(70);
              setLoad(true);
            })
            .catch(() => {
              track(AnalyticsEvent.BrainFallback, { reason: "module" });
              setFailed(true);
              setProgress(100);
            });
        }, 300);
        obs.disconnect();
      }
    });
    if (ref.current) obs.observe(ref.current);
    return () => {
      obs.disconnect();
      clearTimeout(timer);
    };
  }, [enabled, staticMode]);
  const animate = enabled && load && !failed && !staticMode;
  return (
    <div ref={ref} data-static={staticMode ? "true" : undefined}>
      <div className="brain-frame">
        <div className="brain-poster" style={{ opacity: ready && animate ? 0 : 1 }}>
          <BrainPoster
            label={w(
              "Illustrative brain: three assessment signals",
              "Tasviriy miya: uchta baholash belgisi",
              "Иллюстрация мозга: три сигнала оценки",
            )}
            signal={signal}
          />
        </div>
        {animate && (
          <Suspense fallback={null}>
            <BrainCanvas
              signal={signal}
              onReady={() => {
                setReady(true);
                setProgress(100);
              }}
              onFailure={() => {
                track(AnalyticsEvent.BrainFallback, { reason: "renderer" });
                setFailed(true);
                setReady(false);
                setProgress(100);
              }}
            />
          </Suspense>
        )}
      </div>
      <div className="brain-caption">
        <span>
          {w(
            "ILLUSTRATION / NOT A BRAIN SCAN",
            "TASVIR / MIYA SKANI EMAS",
            "ИЛЛЮСТРАЦИЯ / НЕ СКАН МОЗГА",
          )}
        </span>
        <span aria-live="polite">
          {!enabled || failed || staticMode
            ? w("Static illustration", "Statik tasvir", "Статичная иллюстрация")
            : ready
              ? w("Animated illustration", "Animatsiyali tasvir", "Анимированная иллюстрация")
              : w("Loading illustration", "Tasvir yuklanmoqda", "Загрузка иллюстрации")}
        </span>
      </div>
      {failed && enabled && (
        <button
          className="text-link mt-4 text-xs"
          onClick={() => {
            setFailed(false);
            setReady(false);
          }}
        >
          {w("Retry animated study", "Jonli chizmani qayta sinash", "Повторить живую модель")}
        </button>
      )}
      {enabled && !ready && !failed && !staticMode && (
        <div
          className="load-track"
          role="progressbar"
          aria-label={w("Brain loading", "Miya yuklanmoqda", "Загрузка модели")}
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <span style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}
