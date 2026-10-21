import { afterEach, expect, it, vi } from "vitest";
import { LatestDraftWriter } from "@/lib/assessment/latest-draft-writer";
afterEach(() => vi.useRealTimers());
it("replaces ninety waiting revisions with the latest and flushes before submit", async () => {
  let release!: () => void;
  const send = vi
    .fn()
    .mockImplementationOnce(
      () =>
        new Promise<void>((r) => {
          release = r;
        }),
    )
    .mockResolvedValue(undefined);
  const status = vi.fn();
  const writer = new LatestDraftWriter(send, status);
  const first = { revision: 1 };
  const flushing = writer.flush(first);
  for (let revision = 2; revision < 90; revision++) writer.push({ revision });
  const final = { revision: 90 };
  let finished = false;
  const finalFlush = writer.flush(final).then(() => {
    finished = true;
  });
  expect(send).toHaveBeenCalledTimes(1);
  expect(finished).toBe(false);
  release();
  await Promise.all([flushing, finalFlush]);
  expect(send.mock.calls.map((call) => call[0].revision)).toEqual([1, 90]);
  expect(status).toHaveBeenLastCalledWith("saved", final);
  await writer.flush(final);
  expect(send).toHaveBeenCalledTimes(2);
  writer.dispose();
});
it("reports a failed flush and permits an explicit retry without losing the snapshot", async () => {
  const send = vi.fn().mockRejectedValueOnce(new Error("offline")).mockResolvedValue(undefined);
  const status = vi.fn();
  const writer = new LatestDraftWriter(send, status);
  const snapshot = { revision: 2 };
  await expect(writer.flush(snapshot)).rejects.toThrow("offline");
  expect(status).toHaveBeenLastCalledWith("failed", snapshot);
  await writer.flush(snapshot);
  expect(status).toHaveBeenLastCalledWith("saved", snapshot);
  writer.dispose();
});
it("times out a stalled request visibly instead of holding the finish screen forever", async () => {
  vi.useFakeTimers();
  let signal!: AbortSignal;
  const send = vi.fn((_snapshot: number, value: AbortSignal) => {
    signal = value;
    return new Promise<void>(() => {});
  });
  const status = vi.fn();
  const writer = new LatestDraftWriter(send, status, 250, 15000);
  const promise = expect(writer.flush(1)).rejects.toThrow("timed out");
  await vi.advanceTimersByTimeAsync(15001);
  await promise;
  expect(signal.aborted).toBe(true);
  expect(status).toHaveBeenLastCalledWith("failed", 1);
  writer.dispose();
});
it("drops unsent revisions when the account or route changes", async () => {
  vi.useFakeTimers();
  const send = vi.fn();
  const writer = new LatestDraftWriter(send, vi.fn());
  writer.push(1);
  writer.push(2);
  writer.dispose();
  await vi.advanceTimersByTimeAsync(1000);
  expect(send).not.toHaveBeenCalled();
  await expect(writer.flush(3)).rejects.toThrow("owner changed");
});
