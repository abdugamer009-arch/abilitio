import { useEffect, useRef, type RefObject } from "react";
import { useRouter } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-context";

const EASE = "cubic-bezier(0.76,0,0.24,1)";
const frame = () => new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

/** One persistent compositor curtain. Page effects never own navigation. */
export function useRouteTransition(curtain: RefObject<HTMLDivElement | null>, enabled: boolean) {
  const router = useRouter();
  const { user } = useAuth();
  const preferences = useRef({ enabled, owner: user?.id });
  useEffect(() => {
    preferences.current = { enabled, owner: user?.id };
    if (!user) void import("@/lib/dashboard/preload").then((m) => m.clearDashboardPreload());
  }, [enabled, user]);

  useEffect(() => {
    const layer = curtain.current;
    if (!layer) return;
    let disposed = false;
    let serial = 0;
    let animation: Animation | undefined;
    let internal = false;
    const outgoing = new Set<HTMLElement>();
    const restoreOutgoing = () => {
      outgoing.forEach((page) => {
        page.style.removeProperty("content-visibility");
        page.style.removeProperty("contain-intrinsic-block-size");
      });
      outgoing.clear();
    };
    const root = document.documentElement;
    const pausedTargets = new Set<Element>();
    const pauseLoops = () => {
      for (const item of document.getAnimations()) {
        if (
          item.effect instanceof KeyframeEffect &&
          item.effect.getTiming().iterations === Infinity &&
          item.effect.target instanceof Element
        ) {
          item.effect.target.setAttribute("data-route-paused", "");
          pausedTargets.add(item.effect.target);
        }
      }
    };
    const resumeLoops = () => {
      pausedTargets.forEach((target) => target.removeAttribute("data-route-paused"));
      pausedTargets.clear();
    };
    const positions = new Map<string, { x: number; y: number }>();
    const positionKey = (state: { __TSR_key?: string }, href: string) => state.__TSR_key ?? href;
    const savePosition = () =>
      positions.set(positionKey(router.history.location.state, router.history.location.href), {
        x: scrollX,
        y: scrollY,
      });
    const warm = (href: string) => {
      const url = new URL(href, location.href);
      if (url.origin !== location.origin) return Promise.resolve();
      const code = router.preloadRoute({
        to: url.pathname,
        search: Object.fromEntries(url.searchParams),
      });
      const owner = preferences.current.owner;
      const data =
        url.pathname === "/dashboard" && owner
          ? import("@/lib/dashboard/preload").then((m) => m.preloadDashboard(owner))
          : Promise.resolve();
      return Promise.allSettled([code, data]).then(() => undefined);
    };
    const eligible = (event: Event) => {
      const anchor =
        event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!anchor || anchor.download || (anchor.target && anchor.target !== "_self")) return null;
      const url = new URL(anchor.href);
      return url.origin === location.origin &&
        (url.pathname !== location.pathname || !!root.dataset.routeTransition)
        ? url
        : null;
    };
    const prefetch = (event: Event) => {
      const url = eligible(event);
      if (url) void warm(url.href);
    };
    const signal = (phase: string) => {
      root.dataset.routeTransition = phase;
      window.dispatchEvent(new CustomEvent("abilitio:transition-phase", { detail: phase }));
    };
    const finish = (id: number) => {
      if (id !== serial) return;
      animation?.cancel();
      resumeLoops();
      restoreOutgoing();
      layer.style.removeProperty("will-change");
      layer.style.removeProperty("opacity");
      layer.style.removeProperty("transform");
      delete root.dataset.routeTransition;
      delete root.dataset.routeHistory;
      window.dispatchEvent(new Event("abilitio:transition-end"));
    };
    const move = async (keyframes: Keyframe[], duration: number) => {
      animation?.cancel();
      animation = layer.animate(keyframes, { duration, easing: EASE, fill: "forwards" });
      try {
        await animation.finished;
      } catch {
        /* replaced by a newer navigation */
      }
    };
    const cover = async () => {
      const id = ++serial;
      const previousPage = document.querySelector<HTMLElement>(".page-plane");
      const previousHeight = previousPage?.getBoundingClientRect().height;
      const fade = !preferences.current.enabled;
      // Read current compositor position once, only on interruption.
      const from = root.dataset.routeTransition
        ? getComputedStyle(layer).transform
        : "translateY(100%)";
      animation?.cancel();
      pauseLoops();
      layer.style.willChange = "transform";
      signal("covering");
      await move(
        fade
          ? [
              { transform: "none", opacity: 0 },
              { transform: "none", opacity: 1 },
            ]
          : [{ transform: from }, { transform: "translateY(0%)" }],
        60,
      );
      if (id === serial) {
        signal("covered");
        const page = document.querySelector<HTMLElement>(".page-plane");
        if (page) {
          // Release the covered outgoing layout in its own frame, before React
          // removes its DOM. This does not animate or move the page itself.
          outgoing.add(page);
          if (previousHeight)
            page.style.setProperty("contain-intrinsic-block-size", `${previousHeight}px`);
          page.style.removeProperty("clip-path");
          page.style.contentVisibility = "hidden";
          await frame();
          await frame();
        }
      }
      return { id, fade };
    };
    const reveal = async (
      id: number,
      fade: boolean,
      position?: { x: number; y: number },
      hash?: string,
    ) => {
      if (id !== serial || disposed) return;
      // Data commits stay behind the old intrinsic height; a skeleton must not
      // remove the scrollbar before the fully populated page is ready.
      while (id === serial && !disposed && document.querySelector("[data-route-pending]"))
        await frame();
      if (id !== serial || disposed) return;
      restoreOutgoing();
      // IO supplies fresh viewport geometry without a forced layout read. If a
      // preceding row shrank, reveal the newly visible row before moving again.
      while (id === serial && !disposed) {
        while (
          id === serial &&
          !disposed &&
          document.querySelector("[data-route-check]:not([data-route-checked])")
        )
          await frame();
        if (id !== serial || disposed) return;
        const nodes = [...document.querySelectorAll("[data-route-check]")];
        if (!nodes.length) break;
        const revealed = await new Promise<boolean>((resolve) => {
          const observer = new IntersectionObserver((entries) => {
            let any = false;
            if (id === serial && !disposed)
              for (const entry of entries) {
                if (entry.isIntersecting && entry.target.isConnected) {
                  any = true;
                  entry.target.dispatchEvent(new Event("abilitio:render-deferred"));
                }
              }
            observer.disconnect();
            resolve(any);
          });
          nodes.forEach((node) => observer.observe(node));
        });
        if (!revealed) break;
      }
      if (id !== serial || disposed) return;
      if (position) window.scrollTo({ left: position.x, top: position.y, behavior: "instant" });
      if (hash) {
        let anchor = hash.slice(1);
        try {
          anchor = decodeURIComponent(anchor);
        } catch {
          /* preserve malformed fragment */
        }
        document.getElementById(anchor)?.scrollIntoView({ behavior: "instant" });
      }
      signal("revealing");
      await move(
        fade
          ? [
              { transform: "none", opacity: 1 },
              { transform: "none", opacity: 0 },
            ]
          : [{ transform: "translateY(0%)" }, { transform: "translateY(-100%)" }],
        fade ? 60 : 120,
      );
      finish(id);
    };
    const click = (event: MouseEvent) => {
      if (
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.defaultPrevented
      )
        return;
      const url = eligible(event);
      if (!url) return;
      savePosition();
      event.preventDefault();
      event.stopPropagation();
      // Code and data start with the curtain, never after its cover tween.
      const prepared = warm(url.href);
      const taskId = serial + 1;
      void (async () => {
        const { id, fade } = await cover();
        await prepared;
        if (id !== serial || disposed) return;
        internal = true;
        try {
          await router.navigate({ href: url.pathname + url.search + url.hash });
        } finally {
          internal = false;
        }
        if (id !== serial) return;
        // Router owns restoration. Force its scroll to be immediate under cover.
        await reveal(id, fade, url.hash ? undefined : { x: 0, y: 0 }, url.hash);
      })().catch(() => finish(taskId));
    };
    // History blockers delay the route commit, not the browser's scroll cache.
    // Internal link navigations already covered the screen before reaching here.
    const unblock = router.history.block({
      enableBeforeUnload: false,
      blockerFn: async ({ currentLocation, nextLocation, action }) => {
        if (internal || disposed || action === "PUSH" || action === "REPLACE") return false;
        if (
          new URL(nextLocation.href, location.href).pathname ===
          new URL(currentLocation.href, location.href).pathname
        )
          return false;
        positions.set(positionKey(currentLocation.state, currentLocation.href), {
          x: scrollX,
          y: scrollY,
        });
        const position = ["BACK", "FORWARD", "GO"].includes(action)
          ? positions.get(positionKey(nextLocation.state, nextLocation.href))
          : { x: 0, y: 0 };
        if (["BACK", "FORWARD", "GO"].includes(action)) root.dataset.routeHistory = "true";
        const prepared = warm(nextLocation.href);
        const { id, fade } = await cover();
        await prepared;
        if (id !== serial || disposed) return true;
        const unsubscribe = router.subscribe("onResolved", () => {
          unsubscribe();
          void reveal(id, fade, position);
        });
        return false;
      },
    });
    const visibility = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) entry.target.removeAttribute("data-motion-offscreen");
        else entry.target.setAttribute("data-motion-offscreen", "");
      }
    });
    const observeLoops = () => {
      if (root.dataset.routeTransition) return;
      visibility.disconnect();
      for (const item of document.getAnimations()) {
        if (
          item.effect instanceof KeyframeEffect &&
          item.effect.getTiming().iterations === Infinity &&
          item.effect.target instanceof Element
        )
          visibility.observe(item.effect.target);
      }
    };
    const observeTimer = window.setTimeout(observeLoops, 1600);
    const observeAfterTransition = () => window.setTimeout(observeLoops, 50);
    window.addEventListener("abilitio:transition-end", observeAfterTransition);
    const pauseNewLoop = (event: AnimationEvent) => {
      if (!(event.target instanceof Element)) return;
      if (root.dataset.routeTransition) {
        event.target.setAttribute("data-route-paused", "");
        pausedTargets.add(event.target);
      } else if (
        event.target
          .getAnimations()
          .some((item) => item.effect?.getTiming().iterations === Infinity)
      ) {
        visibility.observe(event.target);
      }
    };
    document.addEventListener("animationstart", pauseNewLoop, true);
    document.addEventListener("pointerover", prefetch, { passive: true });
    document.addEventListener("focusin", prefetch);
    document.addEventListener("touchstart", prefetch, { passive: true });
    document.addEventListener("click", click, true);
    const preloadMain = () => {
      if (disposed) return;
      void ["/methodology", "/dashboard", "/about", "/for-schools", "/universities"].reduce(
        (job, href) => job.then(() => (disposed ? undefined : warm(href))).then(() => undefined),
        Promise.resolve(),
      );
    };
    const idle = window.requestIdleCallback
      ? window.requestIdleCallback(preloadMain, { timeout: 3000 })
      : window.setTimeout(preloadMain, 1500);
    return () => {
      visibility.disconnect();
      window.clearTimeout(observeTimer);
      window.removeEventListener("abilitio:transition-end", observeAfterTransition);
      disposed = true;
      serial++;
      animation?.cancel();
      resumeLoops();
      restoreOutgoing();
      layer.style.removeProperty("will-change");
      delete root.dataset.routeTransition;
      delete root.dataset.routeHistory;
      if (window.cancelIdleCallback) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      unblock();
      document.removeEventListener("animationstart", pauseNewLoop, true);
      document.removeEventListener("pointerover", prefetch);
      document.removeEventListener("focusin", prefetch);
      document.removeEventListener("touchstart", prefetch);
      document.removeEventListener("click", click, true);
    };
  }, [curtain, router]);
}
