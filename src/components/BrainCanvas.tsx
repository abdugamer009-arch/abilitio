import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { AdaptiveDpr } from "@react-three/drei";
import * as THREE from "three";

/**
 * Interactive 3D particle brain, rendered as a fixed background layer.
 *
 * Shape: the brain is assembled as the union of anatomically-placed lobes
 * rather than a deformed sphere. That distinction matters — a noise-displaced
 * ellipsoid reads as a bean, because a brain's silhouette comes from distinct
 * lobes meeting at angles, not from a smooth body with bumps on it. Surface
 * points that fall inside a neighbouring lobe are discarded, so what survives
 * is the outer hull of the union.
 *
 * The canvas sits behind everything with pointer-events disabled, so text and
 * icons on top stay sharp and clickable.
 */

// ---------------------------------------------------------------------------
// Tunables
// ---------------------------------------------------------------------------

const POINTS_DESKTOP = 4600;
const POINTS_SMALL = 3500;

/** Neon cyan through electric blue into deep purple. */
/**
 * Scattered palette rather than a depth ramp. The reference gets its character
 * from individually coloured glyphs — mostly warm gold with teal, violet and
 * white mixed through — so colour is assigned per particle instead of by
 * distance from camera. Gold is weighted heaviest because it carries the
 * silhouette in the reference.
 */
const PALETTE = [
  new THREE.Color("#f5b62c"), // gold
  new THREE.Color("#f5b62c"),
  new THREE.Color("#e8912a"), // amber
  new THREE.Color("#e8912a"),
  new THREE.Color("#facc15"), // bright yellow
  new THREE.Color("#2dd4bf"), // teal
  new THREE.Color("#22d3ee"), // cyan
  new THREE.Color("#a855f7"), // violet
  new THREE.Color("#7c3aed"), // deep purple
  new THREE.Color("#f8fafc"), // white
  new THREE.Color("#cbd5e1"), // light grey
];

/** Synapses: how close two points must be to be wired together. */
const LINK_RADIUS = 0.13;
const MAX_LINKS = 900;

/**
 * Yaw that puts the camera on the side of the brain. The lobes are modelled
 * with +x lateral, so looking down x gives the profile — frontal lobe, temporal
 * lobe, cerebellum and brainstem all in view. Any other angle reads as an ovoid.
 */
const LATERAL_YAW = Math.PI / 2;

/**
 * Sit in the right-hand side of the frame, clear of the hero copy. Tuned so
 * the occipital end still clears the viewport edge — pushed much further and
 * the back of the head clips off-screen.
 */
const RIGHT_OFFSET = 0.95;

// ---------------------------------------------------------------------------
// Math generators
// ---------------------------------------------------------------------------

/** Deterministic PRNG, so the brain is identical on every load. */
function makeRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function hash3(x: number, y: number, z: number): number {
  let h = (x * 374761393 + y * 668265263 + z * 1274126177) | 0;
  h = (Math.imul(h ^ (h >>> 13), 1274126177) | 0) >>> 0;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

const fade = (t: number) => t * t * (3 - 2 * t);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/** Trilinear value noise — the Perlin stand-in used for the folds. */
function valueNoise3(x: number, y: number, z: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  const u = fade(x - xi);
  const v = fade(y - yi);
  const w = fade(z - zi);
  return mix(
    mix(
      mix(hash3(xi, yi, zi), hash3(xi + 1, yi, zi), u),
      mix(hash3(xi, yi + 1, zi), hash3(xi + 1, yi + 1, zi), u),
      v,
    ),
    mix(
      mix(hash3(xi, yi, zi + 1), hash3(xi + 1, yi, zi + 1), u),
      mix(hash3(xi, yi + 1, zi + 1), hash3(xi + 1, yi + 1, zi + 1), u),
      v,
    ),
    w,
  );
}

/** Fractal sum. Frequencies step by 2.03 so octaves never phase-align. */
function fbm(x: number, y: number, z: number, octaves = 3): number {
  let amp = 0.5;
  let freq = 1;
  let sum = 0;
  let norm = 0;
  for (let i = 0; i < octaves; i++) {
    sum += amp * valueNoise3(x * freq, y * freq, z * freq);
    norm += amp;
    amp *= 0.5;
    freq *= 2.03;
  }
  return sum / norm;
}

/**
 * Sulci and gyri. Ridged noise (1 - |2n-1|) gives rounded crowns separated by
 * sharp creases, which is the shape of cortical folding; plain noise just
 * gives lumps. Kept shallow so it never eats the lobe boundaries that carry
 * the silhouette.
 */
function corticalFold(x: number, y: number, z: number): number {
  const ridged = 1 - Math.abs(2 * fbm(x * 4.4, y * 4.4, z * 4.4, 3) - 1);
  const detail = Math.sin(14.5 * x + 8.2 * z) * Math.sin(11.7 * y - 9.4 * x);
  return (ridged - 0.5) * 0.05 + detail * 0.012;
}

type Lobe = {
  /** Centre in a right-hemisphere frame: +x lateral, +y superior, +z anterior. */
  c: [number, number, number];
  /** Semi-axes. */
  r: [number, number, number];
  /** Relative share of sampled points. */
  w: number;
};

/** Right hemisphere; the left is this mirrored through x. */
const LOBES: Lobe[] = [
  // Frontal — tall and rounded, carries the front of the silhouette.
  { c: [0.34, 0.1, 0.5], r: [0.3, 0.33, 0.4], w: 1.05 },
  // Parietal — the crown, widest part of the brain seen from above.
  { c: [0.35, 0.26, -0.06], r: [0.33, 0.31, 0.36], w: 1.1 },
  // Occipital — shorter and lower, tapering to the back.
  { c: [0.3, 0.02, -0.58], r: [0.28, 0.26, 0.3], w: 0.75 },
  // Temporal — slung low and lateral; the lobe that stops it reading as an egg.
  { c: [0.44, -0.3, 0.1], r: [0.21, 0.19, 0.42], w: 0.85 },
];

const CEREBELLUM: Lobe = { c: [0, -0.36, -0.6], r: [0.44, 0.21, 0.29], w: 1 };

function insideLobe(x: number, y: number, z: number, l: Lobe, margin = 1): boolean {
  const dx = (x - l.c[0]) / (l.r[0] * margin);
  const dy = (y - l.c[1]) / (l.r[1] * margin);
  const dz = (z - l.c[2]) / (l.r[2] * margin);
  return dx * dx + dy * dy + dz * dz < 1;
}

/**
 * Generate the full point cloud: both hemispheres, cerebellum and brainstem.
 *
 * `side` mirroring plus the medial-wall clamp is what opens the longitudinal
 * fissure — without a real gap the two halves merge into a single ovoid no
 * matter how good the folding is.
 */
function generateBrainPoints(total: number): Float32Array {
  const rnd = makeRandom(20260901);
  const pts: number[] = [];

  const cortexTarget = Math.round(total * 0.86);
  const cerebellumTarget = Math.round(total * 0.1);
  const stemTarget = total - cortexTarget - cerebellumTarget;

  const totalW = LOBES.reduce((s, l) => s + l.w, 0);
  let guard = 0;

  // --- Cerebral cortex, both hemispheres -----------------------------------
  while (pts.length / 3 < cortexTarget && guard < cortexTarget * 60) {
    guard++;

    let pick = rnd() * totalW;
    let lobe = LOBES[0];
    for (const l of LOBES) {
      pick -= l.w;
      if (pick <= 0) {
        lobe = l;
        break;
      }
    }

    const theta = 2 * Math.PI * rnd();
    const phi = Math.acos(2 * rnd() - 1); // even over the sphere, not over angle
    const sp = Math.sin(phi);
    const nx = sp * Math.cos(theta);
    const ny = Math.cos(phi);
    const nz = sp * Math.sin(theta);

    let x = lobe.c[0] + nx * lobe.r[0];
    let y = lobe.c[1] + ny * lobe.r[1];
    let z = lobe.c[2] + nz * lobe.r[2];

    // Discard anything buried inside a neighbour: that keeps only the outer
    // hull, instead of seams running through the middle of the brain.
    let buried = false;
    for (const other of LOBES) {
      if (other !== lobe && insideLobe(x, y, z, other, 0.97)) {
        buried = true;
        break;
      }
    }
    if (buried || insideLobe(x, y, z, CEREBELLUM, 0.97)) continue;

    const fold = corticalFold(x, y, z);
    x += nx * fold + 0.005 * (rnd() - 0.5);
    y += ny * fold + 0.005 * (rnd() - 0.5);
    z += nz * fold + 0.005 * (rnd() - 0.5);

    // Hold the medial wall off the midline so the fissure stays open.
    if (x < 0.075) x = 0.075 + (0.075 - x) * 0.25;

    const side = rnd() < 0.5 ? 1 : -1;
    pts.push(x * side, y, z);
  }

  // --- Cerebellum: fine parallel folia, not fractal folds -------------------
  for (let i = 0; i < cerebellumTarget; i++) {
    const theta = 2 * Math.PI * rnd();
    const phi = Math.acos(2 * rnd() - 1);
    const sp = Math.sin(phi);
    const nx = sp * Math.cos(theta);
    const ny = Math.cos(phi);
    const nz = sp * Math.sin(theta);
    const folia = 0.022 * Math.sin(30 * nz) + 0.008 * Math.sin(18 * theta);
    pts.push(
      CEREBELLUM.c[0] + nx * (CEREBELLUM.r[0] + folia),
      CEREBELLUM.c[1] + ny * (CEREBELLUM.r[1] + folia),
      CEREBELLUM.c[2] + nz * (CEREBELLUM.r[2] + folia),
    );
  }

  // --- Brainstem ------------------------------------------------------------
  for (let i = 0; i < stemTarget; i++) {
    const t = rnd();
    const a = 2 * Math.PI * rnd();
    const radius = (0.115 - 0.05 * t) * (1 + 0.05 * Math.sin(9 * a));
    pts.push(Math.cos(a) * radius, -0.42 - t * 0.4, Math.sin(a) * radius - 0.34 + t * 0.16);
  }

  return new Float32Array(pts);
}

/**
 * Assign a palette colour per particle, dimming the ones furthest from camera
 * so the far wall of the cloud recedes and the silhouette still reads.
 */
function tintScattered(positions: Float32Array, seed: number): Float32Array {
  const colors = new Float32Array(positions.length);
  const rnd = makeRandom(seed);
  const c = new THREE.Color();
  for (let i = 0; i < positions.length / 3; i++) {
    c.copy(PALETTE[Math.floor(rnd() * PALETTE.length)]);
    const depth = THREE.MathUtils.clamp((positions[i * 3 + 2] + 0.9) / 1.8, 0, 1);
    c.multiplyScalar(0.45 + depth * 0.55);
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  return colors;
}

/**
 * Triangle sprite for the points.
 *
 * Drawn once to a small canvas and reused as the material's map — a texture is
 * far cheaper than swapping the whole point cloud for instanced geometry, and
 * at this size the glyph only needs to read as a triangle, not be crisp.
 */
function makeTriangleTexture(): THREE.Texture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;

  ctx.clearRect(0, 0, size, size);
  ctx.beginPath();
  ctx.moveTo(size / 2, size * 0.12);
  ctx.lineTo(size * 0.9, size * 0.85);
  ctx.lineTo(size * 0.1, size * 0.85);
  ctx.closePath();

  // Outlined rather than solid: the reference glyphs read as little wireframe
  // triangles, and an outline keeps the cloud from turning into a solid mass
  // once additive blending stacks thousands of them.
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = size * 0.11;
  ctx.lineJoin = "round";
  ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.fill();

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

/**
 * Wire nearby points together as synapses.
 *
 * Uses a uniform spatial hash rather than comparing every pair — at ~4,600
 * points a brute-force search is ~21M distance tests, which stalls the main
 * thread on mount. The grid only ever tests the 27 cells around a point.
 */
function buildSynapses(positions: Float32Array, radius: number, maxLinks: number): Float32Array {
  const count = positions.length / 3;
  const cell = radius;
  const grid = new Map<string, number[]>();
  const key = (x: number, y: number, z: number) =>
    `${Math.floor(x / cell)},${Math.floor(y / cell)},${Math.floor(z / cell)}`;

  for (let i = 0; i < count; i++) {
    const k = key(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
    const bucket = grid.get(k);
    if (bucket) bucket.push(i);
    else grid.set(k, [i]);
  }

  const segs: number[] = [];
  const r2 = radius * radius;
  const rnd = makeRandom(77003311);

  for (let i = 0; i < count && segs.length / 6 < maxLinks; i++) {
    // Only a fraction of points sprout a synapse, so the mesh stays readable
    // rather than becoming a solid web.
    if (rnd() > 0.14) continue;

    const x = positions[i * 3];
    const y = positions[i * 3 + 1];
    const z = positions[i * 3 + 2];
    const cx = Math.floor(x / cell);
    const cy = Math.floor(y / cell);
    const cz = Math.floor(z / cell);

    let linked = 0;
    for (let ox = -1; ox <= 1 && linked < 2; ox++) {
      for (let oy = -1; oy <= 1 && linked < 2; oy++) {
        for (let oz = -1; oz <= 1 && linked < 2; oz++) {
          const bucket = grid.get(`${cx + ox},${cy + oy},${cz + oz}`);
          if (!bucket) continue;
          for (const j of bucket) {
            if (j <= i) continue; // each pair once
            const dx = positions[j * 3] - x;
            const dy = positions[j * 3 + 1] - y;
            const dz = positions[j * 3 + 2] - z;
            const d2 = dx * dx + dy * dy + dz * dz;
            if (d2 > r2 || d2 === 0) continue;
            segs.push(x, y, z, positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]);
            if (++linked >= 2) break;
          }
        }
      }
    }
  }

  return new Float32Array(segs);
}

// ---------------------------------------------------------------------------
// Scene
// ---------------------------------------------------------------------------

function Brain({ pointCount, reduceMotion }: { pointCount: number; reduceMotion: boolean }) {
  const group = useRef<THREE.Group>(null);

  const { pointGeometry, lineGeometry, sprite } = useMemo(() => {
    const positions = generateBrainPoints(pointCount);

    const pg = new THREE.BufferGeometry();
    pg.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    pg.setAttribute("color", new THREE.BufferAttribute(tintScattered(positions, 4242), 3));

    const segments = buildSynapses(positions, LINK_RADIUS, MAX_LINKS);
    const lg = new THREE.BufferGeometry();
    lg.setAttribute("position", new THREE.BufferAttribute(segments, 3));
    lg.setAttribute("color", new THREE.BufferAttribute(tintScattered(segments, 909), 3));

    return { pointGeometry: pg, lineGeometry: lg, sprite: makeTriangleTexture() };
  }, [pointCount]);

  // React unmounting the component does not free GPU memory; release it here.
  useEffect(
    () => () => {
      pointGeometry.dispose();
      lineGeometry.dispose();
      sprite.dispose();
    },
    [pointGeometry, lineGeometry, sprite],
  );

  // --- Input --------------------------------------------------------------
  // The canvas has pointer-events disabled so the UI above stays clickable,
  // which also means R3F never receives pointer events. Read them from the
  // window instead.
  const scroll = useRef(0);
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scroll.current = max > 0 ? window.scrollY / max : 0;
    };
    const onPointer = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
    };
  }, []);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g || reduceMotion) return;

    const t = state.clock.elapsedTime;
    const s = scroll.current;

    // Scroll is the primary driver: a little over a full turn top to bottom,
    // with a tilt so the brain presents a different face as sections pass.
    // Base is the lateral pose — a brain only reads as a brain side-on, so the
    // rotation starts and returns there rather than at an arbitrary angle.
    // The idle term oscillates instead of accumulating. A constant `t * 0.05`
    // drift eventually carries the brain to an arbitrary angle and parks it
    // edge-on, where it reads as an ovoid; swinging around the lateral pose
    // keeps it alive without ever losing the profile.
    const idle = Math.sin(t * 0.12) * 0.16;
    const targetY = LATERAL_YAW + s * Math.PI * 2.2 + pointer.current.x * 0.3 + idle;
    const targetX = s * 0.45 - pointer.current.y * 0.18 + Math.sin(t * 0.21) * 0.05;

    // Ease toward the target rather than snapping, so a fast scroll reads as
    // momentum instead of a jump. Frame-rate independent.
    const k = 1 - Math.pow(0.0015, delta);
    g.rotation.y += (targetY - g.rotation.y) * k;
    g.rotation.x += (targetX - g.rotation.x) * k;

    // Idle float, plus a slow breathing pulse.
    g.position.y = Math.sin(t * 0.45) * 0.05 - s * 0.25;
    const breathe = 1 + Math.sin(t * 0.8) * 0.022;
    const shrink = 1 - s * 0.12; // recede a little as the page is read
    g.scale.setScalar(breathe * shrink);
  });

  return (
    <group ref={group} rotation={[0, LATERAL_YAW, 0]} position={[RIGHT_OFFSET, 0, 0]}>
      <points geometry={pointGeometry}>
        <pointsMaterial
          map={sprite}
          alphaTest={0.02}
          size={0.08}
          vertexColors
          transparent
          opacity={0.95}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <lineSegments geometry={lineGeometry}>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.22}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}

/**
 * Default-exported so BrainScene can reach it through React.lazy.
 *
 * This module must never be imported eagerly. Pulling @react-three/fiber into
 * the server bundle breaks SSR: its react-reconciler dependency has no working
 * React internals in that runtime and throws "Cannot read properties of null
 * (reading 'useMemo')" inside CanvasImpl, which takes the whole page down to an
 * error boundary. Lazy-loading keeps R3F strictly client-side.
 */
export default function BrainCanvas() {
  // Safe to read directly: this component only ever mounts on the client.
  const pointCount = window.innerWidth < 1024 ? POINTS_SMALL : POINTS_DESKTOP;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 42 }}
        dpr={[1, 1.6]}
        gl={{ antialias: false, powerPreference: "low-power" }}
      >
        {/* Drops resolution if the frame budget slips, rather than dropping frames. */}
        <AdaptiveDpr pixelated />
        <Brain pointCount={pointCount} reduceMotion={reduceMotion} />
      </Canvas>
    </div>
  );
}
