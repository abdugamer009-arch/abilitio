import { describe, it, expect, vi } from "vitest";
import { createRecoveryRequester, RECOVERY_RESPONSE } from "@/lib/auth/recovery";
describe("H03 private rate-limited recovery", () => {
  it("returns the same response for an existing, missing, throttled or failed mailbox", async () => {
    vi.useFakeTimers();
    const send = vi
      .fn()
      .mockResolvedValueOnce({ error: null })
      .mockRejectedValueOnce(new Error("unknown account"));
    const request = createRecoveryRequester(send);
    expect(await request("known@example.test")).toEqual(RECOVERY_RESPONSE);
    expect(await request(" KNOWN@example.test ")).toEqual(RECOVERY_RESPONSE);
    expect(await request("missing@example.test")).toEqual(RECOVERY_RESPONSE);
    expect(send).toHaveBeenCalledTimes(2);
    await vi.advanceTimersByTimeAsync(60001);
    await request("known@example.test");
    expect(send).toHaveBeenCalledTimes(3);
    vi.useRealTimers();
  });
});
