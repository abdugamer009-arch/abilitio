// This supplements, never replaces, Supabase's durable provider rate limits.
// Do not retain email addresses in the throttle map or expose provider errors.
export const RECOVERY_RESPONSE = { accepted: true } as const;
export function createRecoveryRequester(
  send: (email: string) => Promise<unknown>,
  fingerprint: (email: string) => string = (email) => email,
) {
  const last = new Map<string, number>();
  return async (email: string) => {
    const normalized = email.trim().toLowerCase();
    const key = fingerprint(normalized);
    const now = Date.now();
    if (now - (last.get(key) ?? -Infinity) < 60000) return RECOVERY_RESPONSE;
    if (last.size >= 2000) for (const [k, time] of last) if (now - time >= 60000) last.delete(k);
    // Fail closed when the bounded map is full; no raw identifiers are logged.
    if (last.size >= 2000 && !last.has(key)) return RECOVERY_RESPONSE;
    last.set(key, now);
    try {
      await send(normalized);
    } catch {
      /* Same response for every provider outcome. */
    }
    return RECOVERY_RESPONSE;
  };
}
