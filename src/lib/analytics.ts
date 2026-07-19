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
  AssessmentStarted: "assessment_started",
  AssessmentCompleted: "assessment_completed",
  IqStarted: "iq_test_started",
  IqCompleted: "iq_test_completed",
  SignedUp: "signed_up",
  SchoolRegistered: "school_registered",
} as const;
