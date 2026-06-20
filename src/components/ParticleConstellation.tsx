import { useEffect, useRef } from "react";

const COLORS = ["#8052ff", "#ffb829", "#15846e", "#ffffff"];
const SHAPES = ["circle", "triangle", "diamond", "square"] as const;
type Shape = typeof SHAPES[number];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  shape: Shape;
  alpha: number;
}

function createParticle(w: number, h: number): Particle {
  // Bias toward center for organic clustering
  const cx = w / 2 + (Math.random() - 0.5) * w * 0.8;
  const cy = h / 2 + (Math.random() - 0.5) * h * 0.8;
  return {
    x: cx,
    y: cy,
    vx: (Math.random() - 0.5) * 0.4,
    vy: (Math.random() - 0.5) * 0.4,
    size: 2 + Math.random() * 4,
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
    alpha: 0.15 + Math.random() * 0.55,
  };
}

function drawShape(ctx: CanvasRenderingContext2D, p: Particle) {
  const s = p.size;
  ctx.globalAlpha = p.alpha;
  ctx.fillStyle = p.color;
  ctx.beginPath();
  switch (p.shape) {
    case "circle":
      ctx.arc(p.x, p.y, s / 2, 0, Math.PI * 2);
      break;
    case "square":
      ctx.rect(p.x - s / 2, p.y - s / 2, s, s);
      break;
    case "triangle":
      ctx.moveTo(p.x, p.y - s / 2);
      ctx.lineTo(p.x + s / 2, p.y + s / 2);
      ctx.lineTo(p.x - s / 2, p.y + s / 2);
      ctx.closePath();
      break;
    case "diamond":
      ctx.moveTo(p.x, p.y - s / 2);
      ctx.lineTo(p.x + s / 2, p.y);
      ctx.lineTo(p.x, p.y + s / 2);
      ctx.lineTo(p.x - s / 2, p.y);
      ctx.closePath();
      break;
  }
  ctx.fill();
  ctx.globalAlpha = 1;
}

const PARTICLE_COUNT = 900;

export function ParticleConstellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let particles: Particle[] = [];

    function resize() {
      if (!canvas) return;
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function init() {
      resize();
      particles = Array.from({ length: PARTICLE_COUNT }, () =>
        createParticle(canvas!.width, canvas!.height)
      );
    }

    function tick() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        // Wrap around edges
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        if (p.y < -10) p.y = canvas.height + 10;
        if (p.y > canvas.height + 10) p.y = -10;
        drawShape(ctx, p);
      }
      animId = requestAnimationFrame(tick);
    }

    init();
    tick();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 h-full w-full"
      style={{ zIndex: 0, pointerEvents: "none" }}
    />
  );
}
