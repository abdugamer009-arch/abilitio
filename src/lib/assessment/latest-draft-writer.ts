import { requestWithDeadline } from "./request-deadline";

/** Local storage remains synchronous. Cloud writes keep only the newest pending
 * snapshot, with one request in flight; finishing flushes that exact snapshot. */
export class LatestDraftWriter<T> {
  private pending?: T;
  private saved?: T;
  private active?: Promise<void>;
  private timer?: ReturnType<typeof setTimeout>;
  private controller?: AbortController;
  private disposed = false;

  constructor(
    private send: (snapshot: T, signal: AbortSignal) => Promise<unknown>,
    private status: (state: "saving" | "saved" | "failed", snapshot: T) => void,
    private debounceMs = 250,
    private timeoutMs = 15_000,
  ) {}

  push(snapshot: T) {
    if (this.disposed || snapshot === this.saved) return;
    this.pending = snapshot;
    this.status("saving", snapshot);
    clearTimeout(this.timer);
    if (!this.active)
      this.timer = setTimeout(() => void this.drain().catch(() => {}), this.debounceMs);
  }

  async flush(snapshot: T) {
    if (this.disposed) throw new Error("Draft owner changed");
    this.push(snapshot);
    clearTimeout(this.timer);
    await this.drain();
  }

  private drain(): Promise<void> {
    if (this.active) return this.active;
    this.active = (async () => {
      while (this.pending !== undefined && !this.disposed) {
        const snapshot = this.pending;
        this.pending = undefined;
        if (snapshot === this.saved) continue;
        const controller = new AbortController();
        this.controller = controller;
        try {
          await requestWithDeadline(
            (signal) => this.send(snapshot, signal),
            this.timeoutMs,
            controller,
          );
          this.saved = snapshot;
          if (!this.pending && !this.disposed) this.status("saved", snapshot);
        } catch (error) {
          if (!this.disposed) this.status("failed", snapshot);
          throw error;
        } finally {
          this.controller = undefined;
        }
      }
    })().finally(() => {
      this.active = undefined;
      if (this.pending && !this.disposed)
        this.timer = setTimeout(() => void this.drain().catch(() => {}), this.debounceMs);
    });
    return this.active;
  }

  dispose() {
    this.disposed = true;
    clearTimeout(this.timer);
    this.pending = undefined;
    this.controller?.abort();
  }
}
