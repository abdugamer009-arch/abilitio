import { describe, it, expect } from "vitest";
import {
  signSession,
  verifySession,
  validateSessionSubmission,
} from "../assessment/session.server";
const questions = {
  personality: ["p1", "p2"],
  iq: ["i1", "i2"],
  interest: [{ id: "v1", options: ["a", "b"] }],
};
const answer = {
  personalityQIds: questions.personality,
  iqQIds: questions.iq,
  interestQIds: ["v1"],
  interestAnswers: [["a"]],
};
describe("assessment session integrity", () => {
  it("accepts only the signed delivered question set", () => {
    const token = signSession(questions);
    expect(() => validateSessionSubmission(verifySession(token), answer)).not.toThrow();
  });
  it("rejects signature tampering", () => {
    const token = signSession(questions);
    const [p, s] = token.split(".");
    expect(() => verifySession(`${p}.${s.slice(0, -3)}aaa`)).toThrow();
  });
  it("rejects an expired attempt", () =>
    expect(() => verifySession(signSession(questions, 0), 25 * 60 * 60 * 1000)).toThrow(
      "session_expired",
    ));
  it("rejects duplicated cognitive IDs", () =>
    expect(() =>
      validateSessionSubmission(verifySession(signSession(questions)), {
        ...answer,
        iqQIds: ["i1", "i1"],
      }),
    ).toThrow());
  it("rejects options belonging to another question", () =>
    expect(() =>
      validateSessionSubmission(verifySession(signSession(questions)), {
        ...answer,
        interestAnswers: [["other"]],
      }),
    ).toThrow());
});
