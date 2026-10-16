import { describe, expect, it } from "vitest";
import { authSearchSchema } from "@/lib/auth/search";

describe("R01 resilient authentication links", () => {
  it.each([undefined, "register", "", "unknown", 1, null, ["signup"]])(
    "falls back to login for an unsupported mode %j",
    (mode) => expect(authSearchSchema.parse({ mode }).mode).toBe("login"),
  );
  it.each(["login", "signup", "recovery"])("retains supported mode %s", (mode) => {
    expect(authSearchSchema.parse({ mode }).mode).toBe(mode);
  });
  it.each(["//evil.invalid", "https://evil.invalid", "/\\evil.invalid", "/\nattack", "/\u007f"])(
    "rejects unsafe next destination %j",
    (next) => expect(authSearchSchema.parse({ next }).next).toBeUndefined(),
  );
  it("preserves a same-site result destination and ignores unrelated parameters", () => {
    expect(
      authSearchSchema.parse({ mode: "signup", next: "/career-results", utm_source: "test" }),
    ).toEqual({ mode: "signup", next: "/career-results" });
  });
});
