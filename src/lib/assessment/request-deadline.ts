/** A failed connection must leave a retryable screen, not an endless wait.
 * Aborting delivery does not undo server writes; submission nonce idempotency
 * remains authoritative when a response arrives late or the user retries. */
export async function requestWithDeadline<T>(
  request: (signal: AbortSignal) => Promise<T>,
  timeoutMs = 15_000,
  controller = new AbortController(),
  timeoutMessage = "Draft save timed out",
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      request(controller.signal),
      new Promise<never>((_, reject) => {
        timer = setTimeout(() => {
          controller.abort();
          reject(new Error(timeoutMessage));
        }, timeoutMs);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}
