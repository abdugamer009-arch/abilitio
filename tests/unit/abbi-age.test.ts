import { expect, it } from "vitest";
import { abbiMessageSchema } from "@/lib/abbi/message-schema";
import { generateAbbiReply } from "@/lib/abbi/abbi-knowledge";

it("accepts every database age group and produces the child-friendly fallback", () => {
  for (const ageGroup of ["child", "teen", "adult", null]) {
    expect(abbiMessageSchema.safeParse({ message: "Hello", ctx: { ageGroup } }).success).toBe(true);
  }
  const request = abbiMessageSchema.parse({
    message: "I wonder about my future",
    ctx: { ageGroup: "child" },
  });
  expect(generateAbbiReply(request.message, request.ctx)).toContain("Fun things to learn");
  expect(
    abbiMessageSchema.safeParse({ message: "Hello", ctx: { ageGroup: "unknown" } }).success,
  ).toBe(false);
});
