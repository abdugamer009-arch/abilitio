import type { AgeGroup } from "./career-assessment";

export type Gender = "male" | "female";
export type AttemptProfile = { gender: Gender | null; ageGroup: AgeGroup | null };
export const EMPTY_PROFILE: AttemptProfile = { gender: null, ageGroup: null };
export const DRAFT_KEY = "abilitio.career_assessment.progress.v4";
export const LEGACY_DRAFT_KEY = "abilitio.career_assessment.progress.v3";
const RESULT_PROFILE_KEY = "abilitio.assessment.result-profile";
let memoryResult: { resultId: string; ownerId: string; profile: AttemptProfile } | null = null;

export function readAttemptDraft(): string | null {
  try {
    const current = sessionStorage.getItem(DRAFT_KEY);
    if (current) return current;
  } catch {
    /* Try an existing pre-feature draft when session storage is blocked. */
  }
  try {
    return localStorage.getItem(LEGACY_DRAFT_KEY);
  } catch {
    return null;
  }
}

export function validProfile(value: unknown): value is AttemptProfile {
  if (!value || typeof value !== "object") return false;
  const p = value as AttemptProfile;
  return (
    ["male", "female"].includes(p.gender ?? "") &&
    ["child", "teen_adult"].includes(p.ageGroup ?? "")
  );
}
export function rememberResultProfile(resultId: string, ownerId: string, profile: AttemptProfile) {
  memoryResult = { resultId, ownerId, profile: { ...profile } };
  try {
    sessionStorage.setItem(RESULT_PROFILE_KEY, JSON.stringify({ resultId, ownerId, profile }));
    sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    /* Storage is optional; profile is never sent to the server. */
  }
}
export function readResultProfile(resultId: string, ownerId: string): AttemptProfile | null {
  const matchingMemory =
    memoryResult?.resultId === resultId && memoryResult?.ownerId === ownerId
      ? memoryResult.profile
      : null;
  try {
    const saved = JSON.parse(sessionStorage.getItem(RESULT_PROFILE_KEY) ?? "null") ?? memoryResult;
    return saved?.resultId === resultId && saved?.ownerId === ownerId && validProfile(saved.profile)
      ? saved.profile
      : null;
  } catch {
    return matchingMemory;
  }
}
export function resetAttempt() {
  memoryResult = null;
  try {
    sessionStorage.removeItem(DRAFT_KEY);
    sessionStorage.removeItem(RESULT_PROFILE_KEY);
  } catch {
    /* optional */
  }
  try {
    localStorage.removeItem(LEGACY_DRAFT_KEY);
  } catch {
    /* optional legacy cleanup */
  }
}
