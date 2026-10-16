import { z } from "zod";

export const authSearchSchema = z.object({
  // Query strings are external input; a stale or malformed mode must not crash SSR.
  mode: z.enum(["login", "signup", "recovery"]).optional().default("login").catch("login"),
  // Post-login destination. Restricted to same-site paths: "/x" but not "//x"
  // (protocol-relative) — anything else could bounce a fresh login to an
  // attacker-chosen site via a crafted link.
  next: z
    .string()
    .refine(
      (value) =>
        value.startsWith("/") &&
        !value.startsWith("//") &&
        !value.includes("\\") &&
        [...value].every((char) => char.charCodeAt(0) >= 32 && char.charCodeAt(0) !== 127),
    )
    .optional()
    .catch(undefined),
});
