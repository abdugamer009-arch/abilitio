// UI convenience only. Server signature/expiry validation remains authoritative.
export function draftIsCurrent(token: string, now = Date.now()): boolean {
  try {
    const part = token.split(".")[0].replace(/-/g, "+").replace(/_/g, "/");
    const claim = JSON.parse(atob(part));
    // A device clock behind the server can make a fresh 24-hour token look
    // further than 24 hours away. Do not discard its answers for that reason.
    // The server still verifies the signature and its authoritative expiry.
    return (
      typeof claim.expires === "number" && Number.isFinite(claim.expires) && claim.expires > now
    );
  } catch {
    return false;
  }
}
