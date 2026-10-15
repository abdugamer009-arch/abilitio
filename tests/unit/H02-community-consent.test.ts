import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
describe("H02 membership write boundaries", () => {
  it("does not invoke membership writes during assessment save or community reads", () => {
    const assessment = readFileSync("src/lib/assessment/career.functions.ts", "utf8");
    const community = readFileSync("src/lib/community/community.functions.ts", "utf8");
    expect(assessment).not.toContain("assign_user_to_community_by_slug");
    const read = community.slice(
      community.indexOf("export const getMyCommunities"),
      community.indexOf("export const getCommunityMessages"),
    );
    expect(read).not.toContain(".rpc(");
    expect(read).not.toContain("ensureCommunityFromLatestResult");
  });
});
