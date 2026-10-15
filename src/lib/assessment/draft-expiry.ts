// UI convenience only. Server signature/expiry validation remains authoritative.
export function draftIsCurrent(token: string, now = Date.now()): boolean {
  try {
    const part = token.split(".")[0].replace(/-/g, "+").replace(/_/g, "/");
    const claim = JSON.parse(atob(part));
    return (
      typeof claim.expires === "number" &&
      Number.isFinite(claim.expires) &&
      claim.expires > now &&
      claim.expires <= now + 24 * 60 * 60 * 1000
    );
  } catch {
    return false;
  }
}
