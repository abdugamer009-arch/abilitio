import { it, expect } from "vitest";
import { CAREERS, generateAbbiReply } from "@/lib/abbi/abbi-knowledge";
it("M11 does not publish unsourced compensation or demand promises", () => {
  for (const c of CAREERS) {
    expect(JSON.stringify(c)).not.toMatch(
      /High demand globally|Strong compensation|\$\d|22% growth|Always in demand|Great compensation/,
    );
  }
  expect(generateAbbiReply("salary", { ageGroup: "adult" })).not.toMatch(
    /6–18 months|share salary ranges/,
  );
});
