import { z } from "zod";
import { deriveRiasecFromInterests, hollandCode } from "./career-engine";

const dimension = z.number().finite().min(0).max(1);
const profileSchema = z.object({
  R: dimension,
  I: dimension,
  A: dimension,
  S: dimension,
  E: dimension,
  C: dimension,
});

/** Exact for new saved results; explicitly estimated for historical rows. */
export function resultInterestProfile(
  storedProfile: unknown,
  interests: { key: string; weight: number }[],
) {
  const parsed = profileSchema.safeParse(storedProfile);
  const riasec_profile = parsed.success ? parsed.data : deriveRiasecFromInterests(interests);
  return {
    riasec_profile,
    holland_code: hollandCode(riasec_profile),
    riasec_is_estimated: !parsed.success,
  };
}
