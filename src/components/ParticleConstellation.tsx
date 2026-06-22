import { useEffect, useRef } from "react";

/**
 * Lightweight, on-brand constellation field for the hero.
 * - Violet/lavender palette that matches the design system
 * - Connecting lines between nearby nodes (the "constellation")
 * - Subtle cursor gravity for a living, premium feel
 * - Pauses when offscreen or tab is hidden; respects reduced-motion
 * Tuned to stay light ("like air") even on modest hardware.
 */

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

const LINK_DIST = 130;
const LINK_DIST_SQ = LINK_DIST * LINK_DIST;

/** Fewer nodes on small screens keeps the link-drawing cheap on mobile. */
function nodeCountFor(width: number): number {
  if (width < 480) return 45;
  if (width < 768) return 70;
  if (width < 1280) return 95;
  return 110;
}

export function ParticleConstellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    let isDark = document.documentElement.classList.contains("dark");
    const palette = () =>
      isDark
        ? { dot: "167,139,250", line: "139,124,246", lineMax: 0.16, dotMax: 0.7 }
        : { dot: "109,40,217", line: "124,92,255", lineMax: 0.1, dotMax: 0.45 };
    let colors = palette();

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let nodes: Node[] = [];
    let animId = 0;
    let running = false;
    const mouse = { x: -9999, y: -9999, active: false };

    function resize() {
      if (!canvas) return;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function makeNodes() {
      nodes = Array.from({ length: nodeCountFor(w) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        size: 1 + Math.random() * 2,
        alpha: 0.25 + Math.random() * 0.5,
      }));
    }

    function draw() {
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);

      // Links first (drawn under the dots)
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK_DIST_SQ) {
            const t = 1 - d2 / LINK_DIST_SQ;
            ctx.strokeStyle = `rgba(${colors.line},${(t * colors.lineMax).toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
        // faint line to cursor for interactivity
        if (mouse.active) {
          const dx = a.x - mouse.x;
          const dy = a.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK_DIST_SQ * 1.6) {
            const t = 1 - d2 / (LINK_DIST_SQ * 1.6);
            ctx.strokeStyle = `rgba(${colors.line},${(t * colors.lineMax * 1.5).toFixed(3)})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
        }
      }

      // Dots
      for (const n of nodes) {
        ctx.fillStyle = `rgba(${colors.dot},${(n.alpha * colors.dotMax).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function step() {
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -20) n.x = w + 20;
        if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20;
        if (n.y > h + 20) n.y = -20;

        // gentle cursor gravity
        if (mouse.active) {
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK_DIST_SQ * 1.6 && d2 > 1) {
            const f = 0.0009;
            n.vx += dx * f;
            n.vy += dy * f;
          }
        }
        // damping so cursor gravity never accelerates forever
        n.vx *= 0.992;
        n.vy *= 0.992;
        // keep a minimum drift
        if (Math.abs(n.vx) < 0.04) n.vx += (Math.random() - 0.5) * 0.04;
        if (Math.abs(n.vy) < 0.04) n.vy += (Math.random() - 0.5) * 0.04;
      }
      draw();
      animId = requestAnimationFrame(step);
    }

    function start() {
      if (running || reduceMotion) return;
      running = true;
      animId = requestAnimationFrame(step);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(animId);
    }

    function onMouse(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouse.active = x >= 0 && y >= 0 && x <= w && y <= h;
      mouse.x = x;
      mouse.y = y;
    }
    function onLeave() {
      mouse.active = false;
    }

    resize();
    makeNodes();
    draw(); // paint one static frame immediately (covers reduced-motion too)
    start();

    const ro = new ResizeObserver(() => {
      resize();
      makeNodes();
      if (reduceMotion) draw();
    });
    ro.observe(canvas);

    // Pause when the hero scrolls out of view
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) start();
          else stop();
        }
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    function onVisibility() {
      if (document.hidden) stop();
      else start();
    }
    function onTheme() {
      isDark = document.documentElement.classList.contains("dark");
      colors = palette();
      if (reduceMotion) draw();
    }
    const themeObs = new MutationObserver(onTheme);
    themeObs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("mouseleave", onLeave, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      themeObs.disconnect();
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 h-full w-full"
      style={{ zIndex: 0, pointerEvents: "none", willChange: "transform" }}
    />
  );
}
