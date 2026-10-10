/**
 * Provider-agnostic, privacy-friendly analytics.
 *
 * It is a complete no-op until VITE_PLAUSIBLE_DOMAIN is set, so nothing loads,
 * ships, or fires without an explicit opt-in. We default to Plausible (cookieless,
 * GDPR-friendly — a good fit for a product serving minors), but `track()` simply
 * calls whatever analytics global is present, so swapping providers is trivial.
 *
 * Usage:
 *   initAnalytics();                      // once, on app mount
 *   track("assessment_completed");        // at funnel milestones
 */

const DOMAIN = import.meta.env.VITE_PLAUSIBLE_DOMAIN as string | undefined;
const SRC =
  (import.meta.env.VITE_PLAUSIBLE_SRC as string | undefined) ?? "https://plausible.io/js/script.js";

declare global {
  interface Window {
    plausible?: (
      event: string,
      opts?: { props?: Record<string, string | number | boolean> },
    ) => void;
  }
}

let initialized = false;

/** Inject the analytics script. Safe to call repeatedly; no-op without a domain. */
export function initAnalytics() {
  if (initialized || typeof window === "undefined" || !DOMAIN) return;
  initialized = true;
  const s = document.createElement("script");
  s.defer = true;
  s.setAttribute("data-domain", DOMAIN);
  s.src = SRC;
  document.head.appendChild(s);
  // Collect browser vitals only after analytics is explicitly configured.
  // No answers, account IDs or URL queries are sent.
  import("web-vitals")
    .then(({ onCLS, onINP, onLCP }) => {
      const report = (metric: { name: string; value: number; rating: string }) =>
        track("web_vital", {
          metric: metric.name,
          value: Math.round(metric.value * 1000) / 1000,
          rating: metric.rating,
          route: location.pathname,
        });
      onCLS(report);
      onINP(report);
      onLCP(report);
    })
    .catch(() => {
      /* measurement is optional */
    });
}

/** Record a funnel event. Never throws, never blocks — analytics must not break the app. */
export function track(event: string, props?: Record<string, string | number | boolean>) {
  if (typeof window === "undefined") return;
  try {
    window.plausible?.(event, props ? { props } : undefined);
  } catch {
    /* swallow — a failed analytics call should never affect the user */
  }
}

/** Named funnel events — one source of truth so call sites can't drift on spelling. */
export const AnalyticsEvent = {
  AssessmentCTA: "assessment_cta",
  AuthReturned: "auth_returned",
  ResultSaved: "result_saved",
  AssessmentStarted: "assessment_started",
  AssessmentCompleted: "assessment_completed",
  SignedUp: "signed_up",
  AssessmentStage: "assessment_stage",
  FirstTask: "first_task_completed",
  BrainFallback: "brain_fallback",
  SchoolRegistered: "school_registered",
} as const;
