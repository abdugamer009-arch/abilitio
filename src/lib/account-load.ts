export type AccountLoad<T> = {
  ownerId: string | null;
  data: T | null;
  error: string | null;
  loaded: boolean;
};

/** Cancel publication when the owning effect/account changes. */
export function loadForAccount<T>(
  ownerId: string,
  load: () => Promise<T | null>,
  publish: (state: AccountLoad<T>) => void,
): () => void {
  let active = true;
  publish({ ownerId, data: null, error: null, loaded: false });
  void (async () => {
    try {
      const data = await load();
      if (active) publish({ ownerId, data, error: null, loaded: true });
    } catch (error) {
      if (active)
        publish({
          ownerId,
          data: null,
          error: String((error as Error)?.message ?? error),
          loaded: true,
        });
    }
  })();
  return () => {
    active = false;
  };
}
