import { z } from "zod";

export const abbiMessageSchema = z.object({
  lang: z.enum(["en", "uz", "ru"]).default("en"),
  message: z.string().min(1).max(2000),
  ctx: z.object({
    firstName: z.string().nullable().optional(),
    mbtiType: z.string().nullable().optional(),
    iqScore: z.number().nullable().optional(),
    topCareers: z.array(z.object({ name: z.string(), match: z.number() })).optional(),
    topStrengths: z.array(z.string()).optional(),
    weaknesses: z.array(z.string()).optional(),
    ageGroup: z.enum(["child", "teen", "adult"]).nullable().optional(),
  }),
});
