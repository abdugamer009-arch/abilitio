import { z } from "zod";
import type { Career, Major } from "./career-engine";

const traits = z.record(z.number().finite().nonnegative());
const common = {
  key: z.string().min(1),
  name: z.string().min(1),
  category: z.string().min(1),
  required_traits: traits,
  required_profile: z.array(z.string()),
  required_interests: z.array(z.string()),
};
const careersSchema = z
  .array(z.object({ ...common, demand_score: z.number().finite() }).passthrough())
  .min(1);
const majorsSchema = z
  .array(z.object({ ...common, related_career_keys: z.array(z.string()) }).passthrough())
  .min(1);

export function validateCatalog(
  careers: unknown,
  majors: unknown,
): { careers: Career[]; majors: Major[] } {
  const c = careersSchema.safeParse(careers);
  const m = majorsSchema.safeParse(majors);
  if (!c.success || !m.success)
    throw new Error("Assessment catalog is unavailable. Please retry later.");
  return { careers: c.data as Career[], majors: m.data as Major[] };
}
