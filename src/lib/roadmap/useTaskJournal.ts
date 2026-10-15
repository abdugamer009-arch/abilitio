import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { loadTaskJournal, saveTaskJournal } from "./tasks.functions";
import { scopedTaskState, isScopedTaskId } from "./roadmap-world";
const valid = (v: unknown): v is Record<string, boolean> =>
  Boolean(
    v &&
    typeof v === "object" &&
    !Array.isArray(v) &&
    Object.values(v).every((x) => typeof x === "boolean"),
  );
/** Serial per-user offline queue: only acknowledged values leave the queue. */
export function useTaskJournal(userId?: string) {
  const load = useServerFn(loadTaskJournal);
  const save = useServerFn(saveTaskJournal);
  const [tasks, setTasks] = useState<Record<string, boolean>>({});
  const [syncState, setSyncState] = useState<"loading" | "saved" | "local">("loading");
  const [legacyFound, setLegacyFound] = useState(false);
  const pending = useRef<Record<string, boolean>>({});
  const current = useRef(tasks);
  current.current = tasks;
  const flush = useRef<() => Promise<void>>(async () => {});
  useEffect(() => {
    pending.current = {};
    current.current = {};
    setTasks({});
    setLegacyFound(false);
    setSyncState("loading");
    if (!userId) return;
    let cancelled = false;
    let busy = false;
    let syncing = false;
    let retries = 0;
    let retryTimer: ReturnType<typeof setTimeout> | undefined;
    const retry = () => {
      if (cancelled || retryTimer) return;
      retryTimer = setTimeout(
        () => {
          retryTimer = undefined;
          void sync();
        },
        Math.min(30000, 1000 * 2 ** retries++),
      );
    };
    const cacheKey = `roadmap_tasks_v2_${userId}`;
    const queueKey = `roadmap_queue_v2_${userId}`;
    let legacy: Record<string, boolean> = {};
    const preserveUnscoped = (state: Record<string, boolean>) => {
      const unscoped = Object.fromEntries(
        Object.entries(state).filter(([id]) => !isScopedTaskId(id)),
      );
      if (!Object.keys(unscoped).length) return;
      setLegacyFound(true);
      try {
        const key = `roadmap_unscoped_backup_${userId}`;
        const previous = JSON.parse(localStorage.getItem(key) || "{}");
        localStorage.setItem(key, JSON.stringify({ ...previous, ...unscoped }));
      } catch {
        /* Remote/local original marks remain available if backup storage fails. */
      }
    };
    try {
      // Read the old format without overwriting it: its path is unknown.
      for (const key of [`roadmap_tasks_${userId}`, `roadmap_queue_${userId}`]) {
        const older = JSON.parse(localStorage.getItem(key) || "{}");
        if (valid(older)) preserveUnscoped(older);
      }
      const cache = JSON.parse(localStorage.getItem(cacheKey) || "{}");
      const queue = JSON.parse(localStorage.getItem(queueKey) || "{}");
      if (valid(cache)) {
        preserveUnscoped(cache);
        legacy = scopedTaskState(cache);
        current.current = legacy;
        setTasks(legacy);
      }
      if (valid(queue)) preserveUnscoped(queue);
      pending.current = valid(queue) ? scopedTaskState(queue) : {};
      current.current = { ...legacy, ...pending.current };
      setTasks(current.current);
    } catch {
      /* optional storage */
    }
    const storeQueue = () => {
      try {
        localStorage.setItem(queueKey, JSON.stringify(pending.current));
      } catch {
        /* still in memory */
      }
    };
    const send = async () => {
      if (busy || syncing || cancelled) return;
      busy = true;
      try {
        while (Object.keys(pending.current).length && !cancelled) {
          const batch = { ...pending.current };
          await save({ data: batch });
          if (cancelled) return;
          for (const [id, value] of Object.entries(batch))
            if (pending.current[id] === value) delete pending.current[id];
          storeQueue();
        }
        if (!cancelled) {
          retries = 0;
          setSyncState("saved");
        }
      } catch {
        if (!cancelled) {
          setSyncState("local");
          retry();
        }
      } finally {
        busy = false;
      }
    };
    flush.current = send;
    const sync = async () => {
      if (syncing || busy || cancelled) return;
      syncing = true;
      try {
        const original = await load();
        if (cancelled) return;
        preserveUnscoped(original);
        const remote = scopedTaskState(original);
        if (!Object.keys(remote).length) pending.current = { ...legacy, ...pending.current };
        const merged = { ...remote, ...pending.current };
        current.current = merged;
        setTasks(merged);
        try {
          localStorage.setItem(cacheKey, JSON.stringify(merged));
        } catch {
          /* optional storage */
        }
        storeQueue();
      } catch {
        if (!cancelled) {
          setSyncState("local");
          retry();
          return;
        }
      } finally {
        syncing = false;
      }
      await send();
    };
    void sync();
    window.addEventListener("online", sync);
    const onStorage = (event: StorageEvent) => {
      if (event.key !== queueKey || !event.newValue) return;
      try {
        const incoming: unknown = JSON.parse(event.newValue);
        if (valid(incoming)) {
          pending.current = { ...pending.current, ...scopedTaskState(incoming) };
          current.current = { ...current.current, ...pending.current };
          setTasks(current.current);
          void sync();
        }
      } catch {
        /* ignore corrupt storage from another tab */
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      cancelled = true;
      clearTimeout(retryTimer);
      flush.current = async () => {};
      window.removeEventListener("online", sync);
      window.removeEventListener("storage", onStorage);
    };
  }, [userId, load, save]);
  const persist = (next: Record<string, boolean>) => {
    const delta = Object.fromEntries(
      Object.entries(next).filter(([id, value]) => current.current[id] !== value),
    );
    current.current = next;
    setTasks(next);
    if (!userId) return;
    pending.current = { ...pending.current, ...delta };
    try {
      localStorage.setItem(`roadmap_tasks_v2_${userId}`, JSON.stringify(next));
      localStorage.setItem(`roadmap_queue_v2_${userId}`, JSON.stringify(pending.current));
    } catch {
      /* usable in memory */
    }
    setSyncState("local");
    void flush.current();
  };
  return { tasks, persist, syncState, legacyFound };
}
