import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
const localSecret = randomBytes(32).toString("hex");
function key() {
  return (
    process.env.ASSESSMENT_SIGNING_SECRET || process.env.SUPABASE_SERVICE_ROLE_KEY || localSecret
  );
}
export type SessionClaims = {
  nonce: string;
  expires: number;
  personality: string[];
  iq: string[];
  interest: { id: string; options: string[] }[];
};
export function signSession(input: Omit<SessionClaims, "nonce" | "expires">, now = Date.now()) {
  const claim: SessionClaims = {
    ...input,
    nonce: randomBytes(16).toString("hex"),
    expires: now + 24 * 60 * 60 * 1000,
  };
  const payload = Buffer.from(JSON.stringify(claim)).toString("base64url");
  return `${payload}.${createHmac("sha256", key()).update(payload).digest("base64url")}`;
}
export function verifySession(token: string, now = Date.now()): SessionClaims {
  if (token.length > 12000) throw new Error("invalid_session");
  const [payload, signature, ...extra] = token.split(".");
  if (!payload || !signature || extra.length) throw new Error("invalid_session");
  const expected = createHmac("sha256", key()).update(payload).digest();
  const actual = Buffer.from(signature, "base64url");
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected))
    throw new Error("invalid_session");
  const claim = JSON.parse(Buffer.from(payload, "base64url").toString()) as SessionClaims;
  if (claim.expires < now) throw new Error("session_expired: please start a new assessment");
  return claim;
}
export function validateSessionSubmission(
  claim: SessionClaims,
  data: {
    personalityQIds: string[];
    iqQIds: string[];
    interestQIds: string[];
    interestAnswers: string[][];
  },
) {
  const same = (actual: string[], expected: string[]) =>
    actual.length === expected.length &&
    new Set(actual).size === actual.length &&
    actual.every((id, i) => id === expected[i]);
  if (
    !same(data.personalityQIds, claim.personality) ||
    !same(data.iqQIds, claim.iq) ||
    !same(
      data.interestQIds,
      claim.interest.map((q) => q.id),
    )
  )
    throw new Error("invalid_session: question membership");
  if (
    data.interestAnswers.length !== claim.interest.length ||
    data.interestAnswers.some(
      (picks, i) => picks.length > 1 || picks.some((id) => !claim.interest[i].options.includes(id)),
    )
  )
    throw new Error("invalid_session: option membership");
}
