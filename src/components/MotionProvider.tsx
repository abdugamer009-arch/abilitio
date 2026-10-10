import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { useLocation, useRouter } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { MOTION } from "@/lib/motion";
const Context = createContext({ enabled: false, toggle: () => {} });
export const useMotion = () => useContext(Context);
/** All entrance/exit clocks, asset milestones and route listeners have one owner. */
export function MotionProvider({ children }: { children: ReactNode }) {
  const [allowed, setAllowed] = useState(false);
  const [choice, setChoice] = useState<boolean | null>(null);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(0);
  const [cursor, setCursor] = useState("");
  const location = useLocation();
  const router = useRouter();
  const { lang } = useI18n();
  const ring = useRef<HTMLDivElement>(null);
  const curtain = useRef<HTMLDivElement>(null);
  const introSeen = useRef(false);
  const active = allowed && choice !== false;
  useEffect(() => {
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    try {
      const saved = localStorage.getItem("abilitio-motion");
      if (saved) setChoice(saved === "on");
    } catch {
      /* optional storage */
    }
    const sync = () => setAllowed(!media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.motion = active ? "on" : "off";
    if (!active) {
      document.documentElement.dataset.intro = "done";
      setLoading(false);
      setReady(false);
    }
  }, [active]);
  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    let dispose = () => {};
    const first = location.pathname === "/" && !introSeen.current;
    setCompleted(0);
    if (first) setLoading(true);
    const jobs = [
      import("gsap"),
      import("gsap/ScrollTrigger"),
      import("gsap/CustomEase"),
      import("lenis"),
      document.fonts.load('800 1em "Bricolage Grotesque"'),
      document.fonts.load('500 1em "DM Sans"'),
    ];
    let settled = 0;
    Promise.all(
      jobs.map((job) =>
        job.then((value) => {
          settled++;
          if (!cancelled) setCompleted(settled);
          return value;
        }),
      ),
    )
      .then((values) => {
        if (cancelled) return;
        const { gsap } = values[0] as typeof import("gsap");
        const { ScrollTrigger } = values[1] as typeof import("gsap/ScrollTrigger");
        const { CustomEase } = values[2] as typeof import("gsap/CustomEase");
        const { default: Lenis } = values[3] as typeof import("lenis");
        gsap.registerPlugin(ScrollTrigger, CustomEase);
        CustomEase.create("studioExpo", MOTION.entrance);
        CustomEase.create("studioFlow", MOTION.transition);
        setReady(true);
        document.documentElement.dataset.intro = "done";
        introSeen.current = true;
        const fine = matchMedia("(pointer:fine)").matches;
        const lenis = fine
          ? new Lenis({
              duration: MOTION.story,
              easing: (t) => 1 - Math.pow(1 - t, 5),
              anchors: { offset: -96 },
              syncTouch: false,
            })
          : null;
        const tick = (seconds: number) => lenis?.raf(seconds * 1000);
        if (lenis) gsap.ticker.add(tick);
        lenis?.on("scroll", ScrollTrigger.update);
        let lastY = scrollY;
        let lastTime = performance.now();
        const skew = document.querySelector("[data-velocity]")
          ? gsap.quickTo("[data-velocity]", "skewY", { duration: MOTION.panel, ease: "studioExpo" })
          : () => {};
        let skewReset: ReturnType<typeof setTimeout>;
        const velocity = () => {
          const now = performance.now();
          const v = ((scrollY - lastY) / Math.max(now - lastTime, 1)) * 1000;
          lastY = scrollY;
          lastTime = now;
          const normal = Math.max(-1, Math.min(1, v / MOTION.velocityLimit));
          skew(normal * MOTION.velocitySkew);
          clearTimeout(skewReset);
          skewReset = setTimeout(() => skew(0), MOTION.quick * 1000);
          window.dispatchEvent(new CustomEvent("abilitio:velocity", { detail: normal }));
        };
        window.addEventListener("scroll", velocity, { passive: true });
        const context = gsap.context(() => {
          const hero = document.querySelector(".studio-hero");
          if (hero) {
            const timeline = gsap.timeline({ defaults: { ease: "studioExpo" } });
            timeline
              .addLabel("unseal", 0)
              .to(
                document.querySelectorAll(".intro-loader").length
                  ? ".intro-loader"
                  : { yPercent: 0 },
                { yPercent: -130, duration: MOTION.control, onComplete: () => setLoading(false) },
                "unseal",
              )
              .addLabel("rule", "unseal+=0.12")
              .fromTo(
                "[data-hero-rule]",
                { clipPath: "inset(0 100% 0 0)" },
                { clipPath: "inset(0 0% 0 0)", duration: MOTION.panel },
                "rule",
              )
              .addLabel("promise", "rule+=0.12")
              .fromTo(
                "[data-hero-title] .masked-word",
                { yPercent: 115 },
                { yPercent: 0, duration: MOTION.story, stagger: MOTION.stagger },
                "promise",
              )
              .addLabel("proof", "promise+=0.32")
              .fromTo(
                "[data-hero-proof]",
                { clipPath: "inset(100% 0 0 0)" },
                { clipPath: "inset(0% 0 0 0)", duration: MOTION.panel },
                "proof",
              )
              .addLabel("actions", "proof+=0.16")
              .fromTo(
                "[data-hero-actions]",
                { clipPath: "inset(100% 0 0 0)" },
                { clipPath: "inset(0% 0 0 0)", duration: MOTION.panel },
                "actions",
              )
              .addLabel("anatomy", "promise+=0.22")
              .fromTo(
                "[data-hero-object]",
                { clipPath: "inset(0 0 100% 0)" },
                { clipPath: "inset(0 0 0% 0)", duration: MOTION.story, ease: "studioFlow" },
                "anatomy",
              )
              .fromTo(
                "[data-hero-detail]",
                { clipPath: "inset(0 100% 0 0)" },
                { clipPath: "inset(0 0% 0 0)", duration: MOTION.panel, stagger: MOTION.stagger },
                "promise+=0.16",
              );
          } else {
            setLoading(false);
            const page = document.querySelector(".page-plane");
            const heading = document.querySelector(".field-intro h1");
            const entry = gsap.timeline().addLabel("page");
            if (page)
              entry.fromTo(
                page,
                { clipPath: "inset(0 0 100% 0)" },
                { clipPath: "inset(0 0 0% 0)", duration: MOTION.panel, ease: "studioFlow" },
                "page",
              );
            if (heading)
              entry.fromTo(
                heading,
                { clipPath: "inset(100% 0 0 0)" },
                { clipPath: "inset(0% 0 0 0)", duration: MOTION.story, ease: "studioExpo" },
                "page+=0.16",
              );
          }
          gsap.utils.toArray<HTMLElement>("[data-story]").forEach((section) => {
            const timeline = gsap
              .timeline({ scrollTrigger: { trigger: section, start: "top 86%", once: true } })
              .addLabel("index")
              .addLabel("title", "index+=0.12")
              .addLabel("surface", "title+=0.16");
            const rules = section.querySelectorAll("[data-rule]");
            const words = section.querySelectorAll(".masked-word");
            const panels = section.querySelectorAll("[data-panel]");
            if (rules.length)
              timeline.fromTo(
                rules,
                { clipPath: "inset(0 100% 0 0)" },
                { clipPath: "inset(0 0% 0 0)", duration: MOTION.panel, ease: "studioExpo" },
                "index",
              );
            if (words.length)
              timeline.fromTo(
                words,
                { yPercent: 110 },
                {
                  yPercent: 0,
                  duration: MOTION.story,
                  stagger: MOTION.stagger,
                  ease: "studioExpo",
                },
                "title",
              );
            if (panels.length)
              timeline.fromTo(
                panels,
                { clipPath: "inset(0 0 100% 0)" },
                { clipPath: "inset(0 0 0% 0)", duration: MOTION.story, ease: "studioFlow" },
                "surface",
              );
          });
          gsap.utils.toArray<HTMLElement>("[data-count]").forEach((el) => {
            const state = { value: 0 };
            const target = Number(el.dataset.count);
            gsap.to(state, {
              value: target,
              duration: MOTION.story,
              ease: "studioExpo",
              scrollTrigger: { trigger: el, start: "top 95%", once: true },
              onUpdate: () => {
                el.textContent = String(Math.round(state.value));
              },
              onComplete: () => {
                el.textContent = String(target);
              },
            });
          });
          gsap.set(curtain.current, { clipPath: "inset(100% 0 0 0)" });
        });
        const xTo = gsap.quickTo(ring.current, "x", { duration: MOTION.quick, ease: "studioExpo" });
        const yTo = gsap.quickTo(ring.current, "y", { duration: MOTION.quick, ease: "studioExpo" });
        let lastContext = "";
        const pointer = (event: PointerEvent) => {
          if (!fine || event.pointerType === "touch" || !ring.current) return;
          const target = event.target as HTMLElement;
          const kind =
            target.closest<HTMLElement>("[data-cursor]")?.dataset.cursor ||
            (target.closest("a,button") ? "open" : "");
          if (kind !== lastContext) {
            lastContext = kind;
            ring.current.dataset.context = kind;
            setCursor(kind);
          }
          ring.current.style.opacity = "1";
          xTo(event.clientX - 17);
          yTo(event.clientY - 17);
          const magnet = target.closest<HTMLElement>("[data-magnetic]");
          if (magnet) {
            const r = magnet.getBoundingClientRect();
            gsap.to(magnet, {
              x: (event.clientX - r.left - r.width / 2) * 0.08,
              y: (event.clientY - r.top - r.height / 2) * 0.12,
              duration: MOTION.control,
              ease: "studioExpo",
              overwrite: true,
            });
          }
        };
        const leave = (event: PointerEvent) => {
          const magnet = (event.target as HTMLElement).closest<HTMLElement>("[data-magnetic]");
          if (
            magnet &&
            !(event.relatedTarget instanceof Node && magnet.contains(event.relatedTarget))
          )
            gsap.to(magnet, {
              x: 0,
              y: 0,
              duration: MOTION.panel,
              ease: "studioExpo",
              overwrite: true,
            });
        };
        const hide = () => {
          if (ring.current) ring.current.style.opacity = "0";
        };
        let navigating = false;
        const navigate = (event: MouseEvent) => {
          if (
            navigating ||
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
          )
            return;
          const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>("a[href]");
          if (!anchor || anchor.target || anchor.download) return;
          const url = new URL(anchor.href);
          if (url.origin !== window.location.origin) return;
          if (url.pathname === window.location.pathname) return;
          event.preventDefault();
          event.stopPropagation();
          navigating = true;
          gsap
            .timeline()
            .addLabel("exit")
            .to(
              curtain.current,
              { clipPath: "inset(0% 0 0 0)", duration: MOTION.control, ease: "studioFlow" },
              "exit",
            )
            .to(
              ".page-plane",
              { clipPath: "inset(0 0 18% 0)", duration: MOTION.control, ease: "studioFlow" },
              "exit",
            )
            .call(
              () => {
                void router.navigate({ href: url.pathname + url.search + url.hash });
              },
              undefined,
              "exit+=0.36",
            );
        };
        document.addEventListener("pointermove", pointer, { passive: true });
        document.addEventListener("pointerout", leave);
        document.addEventListener("mouseleave", hide);
        document.addEventListener("click", navigate, true);
        ScrollTrigger.refresh();
        dispose = () => {
          context.revert();
          gsap.ticker.remove(tick);
          lenis?.destroy();
          window.removeEventListener("scroll", velocity);
          clearTimeout(skewReset);
          document.removeEventListener("pointermove", pointer);
          document.removeEventListener("pointerout", leave);
          document.removeEventListener("mouseleave", hide);
          document.removeEventListener("click", navigate, true);
          gsap.killTweensOf([curtain.current, ring.current]);
          document
            .querySelectorAll<HTMLElement>("[data-magnetic]")
            .forEach((el) => gsap.set(el, { clearProps: "transform" }));
          hide();
        };
      })
      .catch(() => {
        if (!cancelled) {
          document.documentElement.dataset.intro = "done";
          setLoading(false);
          setAllowed(false);
        }
      });
    return () => {
      cancelled = true;
      dispose();
    };
  }, [active, location.pathname, lang, router]);
  return (
    <Context.Provider
      value={{
        enabled: active && ready,
        toggle: () => {
          const next = !(active && ready);
          setChoice(next);
          try {
            localStorage.setItem("abilitio-motion", next ? "on" : "off");
          } catch {
            /* optional preference */
          }
        },
      }}
    >
      {children}
      {loading && active && (
        <div
          className="intro-loader"
          role="progressbar"
          aria-label={
            lang === "uz"
              ? "Ish maydoni yuklanmoqda"
              : lang === "ru"
                ? "Загрузка мастерской"
                : "Loading workshop"
          }
          aria-valuemin={0}
          aria-valuemax={6}
          aria-valuenow={completed}
        >
          <strong>
            ABILITIO /{" "}
            {lang === "uz" ? "TAYYORLANMOQDA" : lang === "ru" ? "ПОДГОТОВКА" : "PREPARING WORKSHOP"}
          </strong>
          <span>{completed} / 6</span>
          <i style={{ width: `${(completed / 6) * 100}%` }} />
        </div>
      )}
      <div ref={ring} className="cursor-ring" aria-hidden>
        <span>{cursor}</span>
      </div>
      <div ref={curtain} className="route-curtain" aria-hidden />
    </Context.Provider>
  );
}
