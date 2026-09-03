import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
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

/**
 * Yaw that puts the camera on the side of the brain. The lobes are modelled
 * with +x lateral, so looking down x gives the profile — frontal lobe, temporal
 * lobe, cerebellum and brainstem all in view. Any other angle reads as an ovoid.
 */
const LATERAL_YAW = Math.PI / 2;

/**
 * Horizontal placement, as a fraction of the *visible* width rather than a
 * fixed world offset.
 *
 * A constant offset only looks right at one aspect ratio: as the viewport
 * narrows the visible world width shrinks, the brain drifts back toward the
 * middle, and it ends up sitting on top of the hero copy. Deriving it from the
 * camera frustum keeps it pinned to the right-hand side at every width.
 */
const RIGHT_FRACTION = 0.24;

/** Below this the layout is single-column and there is no "right side" to sit in. */
const MIN_WIDTH = 1024;

/**
 * Fraction of the cloud drawn in light mode.
 *
 * Density is free under additive blending: the page is black, so stacking more
 * particles only adds glow. Under normal blending it is not. Overlapping alpha
 * compounds as 1 - (1 - a)^n, so a few dozen layers reach full opacity however
 * small `a` is, and the core turns into a flat purple blob that shows straight
 * through the translucent glass cards.
 *
 * Thinning the cloud is therefore the only lever that actually works — lowering
 * opacity alone just moves the depth at which it saturates. These fractions are
 * applied through InstancedMesh.count, which draws a prefix of the buffer, so
 * switching theme costs nothing: no geometry is rebuilt.
 */
const LIGHT_DENSITY = { rim: 0.55, core: 0.14, ambient: 0.55 };

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

/**
 * Fisher-Yates over whole xyz triples.
 *
 * Points leave the generators grouped by structure — all of the cortex, then
 * the cerebellum, then the brainstem — so drawing a prefix of the buffer would
 * amputate whole anatomy rather than thin the brain evenly. One shuffle makes
 * InstancedMesh.count a clean density dial instead. At full count it is a
 * visual no-op, so dark mode renders exactly as before.
 */
function shuffleTriples(a: Float32Array, seed: number): Float32Array {
  const rnd = makeRandom(seed);
  for (let i = a.length / 3 - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    for (let k = 0; k < 3; k++) {
      const tmp = a[i * 3 + k];
      a[i * 3 + k] = a[j * 3 + k];
      a[j * 3 + k] = tmp;
    }
  }
  return a;
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

    // Carve the sulci by thinning density inside them, rather than only
    // displacing the surface. Displacement alone is invisible once the cloud
    // is dense — every fold fills in and the brain reads as a smooth mass.
    // Removing particles from the creases leaves dark channels, and those
    // channels are what the eye reads as gyri.
    const foldNorm = THREE.MathUtils.clamp((fold + 0.05) / 0.1, 0, 1);
    if (rnd() > 0.18 + foldNorm * 0.82) continue;

    x += nx * fold + 0.004 * (rnd() - 0.5);
    y += ny * fold + 0.004 * (rnd() - 0.5);
    z += nz * fold + 0.004 * (rnd() - 0.5);

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

  return shuffleTriples(new Float32Array(pts), 90210);
}

// ---------------------------------------------------------------------------
// Purple palette
// ---------------------------------------------------------------------------

/**
 * Strictly purple, ordered inner -> outer. The core sits in near-black violet
 * so the interior reads as depth rather than a solid mass; the rim climbs
 * through electric purple into magenta and lavender, which is what produces
 * the fresnel-style edge without a custom shader — brightness is driven by how
 * far a particle sits from the centroid, so the outer shell always glows and
 * the interior always recedes.
 */
const CORE_COLORS = [
  new THREE.Color("#2e1065"),
  new THREE.Color("#3b0764"),
  new THREE.Color("#4c1d95"),
  new THREE.Color("#5b21b6"),
];

const RIM_COLORS = [
  new THREE.Color("#7c3aed"), // violet
  new THREE.Color("#8b5cf6"),
  new THREE.Color("#a855f7"), // electric neon purple
  new THREE.Color("#c026d3"), // magenta
  new THREE.Color("#e879f9"), // bright magenta highlight
  new THREE.Color("#ddd6fe"), // lavender glow
];

/**
 * Light-mode palettes.
 *
 * Additive blending only ever *adds* light, so on a pale background the whole
 * cloud washes out to white. Light mode therefore draws with normal blending,
 * and normal blending converges on the particle's own colour rather than on
 * white — so whatever goes in here is exactly what the denser passages will
 * look like. Mid-violets keep those passages reading as purple; the near-black
 * violets used before turned them into an ink blot.
 */
const CORE_COLORS_LIGHT = [
  new THREE.Color("#8b5cf6"),
  new THREE.Color("#a78bfa"),
  new THREE.Color("#7c3aed"),
];

const RIM_COLORS_LIGHT = [
  new THREE.Color("#7c3aed"),
  new THREE.Color("#8b5cf6"),
  new THREE.Color("#a855f7"),
  new THREE.Color("#6d28d9"),
  new THREE.Color("#c084fc"),
];

/** Target the light-mode interior fades toward — the page, not black. */
const PAGE_WHITE = new THREE.Color("#ffffff");

/** How far from the brain's centre a particle sits, normalised to roughly 0..1. */
const CENTROID = new THREE.Vector3(0, -0.05, -0.05);

// ---------------------------------------------------------------------------
// Instance building
// ---------------------------------------------------------------------------

type Layout = {
  positions: Float32Array;
  scales: Float32Array;
  rotations: Float32Array;
};

/**
 * Size and orientation per particle, so the triangles never look tiled.
 *
 * Deliberately split from the colour pass: rebuilding a brain means rejection
 * sampling tens of thousands of candidate points through three octaves of
 * noise, and none of that depends on the theme. Toggling day mode used to redo
 * all of it — visibly stalling the switch — when the only thing that actually
 * changes is which purple each particle is tinted.
 *
 * Both passes walk one shared PRNG stream in the same order, so they stay in
 * lockstep with the single pass they replaced and dark mode renders unchanged.
 */
function buildLayout(
  positions: Float32Array,
  seed: number,
  opts: { minScale: number; maxScale: number },
): Layout {
  const n = positions.length / 3;
  const rnd = makeRandom(seed);
  const scales = new Float32Array(n);
  const rotations = new Float32Array(n * 3);

  for (let i = 0; i < n; i++) {
    rnd(); // the palette pick, drawn by buildColors — skipped to hold alignment
    scales[i] = opts.minScale + rnd() * (opts.maxScale - opts.minScale);
    rotations[i * 3] = rnd() * Math.PI * 2;
    rotations[i * 3 + 1] = rnd() * Math.PI * 2;
    rotations[i * 3 + 2] = rnd() * Math.PI * 2;
  }

  return { positions, scales, rotations };
}

/** Per-particle tint. The only part of a particle that depends on the theme. */
function buildColors(
  positions: Float32Array,
  seed: number,
  opts: {
    palette: THREE.Color[];
    /** Push particles near the centroid into the background; drives the rim. */
    rimBias: boolean;
    isDark: boolean;
  },
): Float32Array {
  const n = positions.length / 3;
  const rnd = makeRandom(seed);
  const colors = new Float32Array(n * 3);
  const p = new THREE.Vector3();
  const c = new THREE.Color();

  for (let i = 0; i < n; i++) {
    p.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
    const dist = p.distanceTo(CENTROID);

    c.copy(opts.palette[Math.floor(rnd() * opts.palette.length)]);
    if (opts.rimBias) {
      // Outer shell reads strongest, interior falls away. This is the cheap
      // stand-in for a fresnel term and it survives any rotation, unlike a
      // view-dependent effect baked into the geometry.
      const glow = THREE.MathUtils.clamp((dist - 0.45) / 0.5, 0, 1);
      if (opts.isDark) {
        // Toward black, which under additive blending means "contributes less".
        // Kept under 1.0 at the low end: additive stacks every overlapping
        // wireframe, and multipliers above ~1.2 drive the middle of the cloud
        // to white and the purple disappears.
        c.multiplyScalar(0.28 + glow * 0.85);
      } else {
        // The same trick inverted. On a pale page darkening a particle makes it
        // *more* prominent, not less, so receding means fading toward the page.
        c.lerp(PAGE_WHITE, (1 - glow) * 0.58);
      }
    }
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;

    // Consume the four values buildLayout takes, keeping the streams aligned.
    rnd();
    rnd();
    rnd();
    rnd();
  }

  return colors;
}

/**
 * Fill the lobe volumes rather than their surfaces, for the dense inner core.
 * Biased inward so the interior is packed and does not compete with the rim.
 */
function generateCorePoints(count: number, seed: number): Float32Array {
  const rnd = makeRandom(seed);
  const out: number[] = [];
  let guard = 0;

  while (out.length / 3 < count && guard < count * 40) {
    guard++;
    const lobe = LOBES[Math.floor(rnd() * LOBES.length)];
    // cube-root keeps the distribution even through the volume instead of
    // clustering everything against the shell.
    const rad = Math.cbrt(rnd()) * 0.86;
    const theta = 2 * Math.PI * rnd();
    const phi = Math.acos(2 * rnd() - 1);
    const sp = Math.sin(phi);

    const x = lobe.c[0] + sp * Math.cos(theta) * lobe.r[0] * rad;
    const y = lobe.c[1] + Math.cos(phi) * lobe.r[1] * rad;
    const z = lobe.c[2] + sp * Math.sin(theta) * lobe.r[2] * rad;
    if (x < 0.085) continue; // keep the longitudinal fissure open

    out.push(x * (rnd() < 0.5 ? 1 : -1), y, z);
  }
  return shuffleTriples(new Float32Array(out), 90211);
}

/** Larger hollow triangles drifting in the space around the brain. */
function generateAmbientPoints(count: number, seed: number): Float32Array {
  const rnd = makeRandom(seed);
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // Shell hugging the brain. A wider spread scattered triangles across the
    // whole viewport, including on top of the hero copy, which is exactly what
    // the right-hand placement exists to avoid.
    const r = 1.25 + rnd() * 0.85;
    const theta = 2 * Math.PI * rnd();
    const phi = Math.acos(2 * rnd() - 1);
    const sp = Math.sin(phi);
    out[i * 3] = sp * Math.cos(theta) * r;
    out[i * 3 + 1] = Math.cos(phi) * r * 0.7;
    out[i * 3 + 2] = sp * Math.sin(theta) * r;
  }
  return shuffleTriples(out, 90212);
}

/**
 * Push an InstanceSet into an InstancedMesh.
 *
 * Done in an effect rather than during render: setMatrixAt writes into a GPU
 * buffer, and doing that in the render body would repeat the work on every
 * React re-render for no benefit.
 */
function applyLayout(mesh: THREE.InstancedMesh | null, set: Layout) {
  if (!mesh) return;
  const dummy = new THREE.Object3D();
  const n = set.scales.length;

  for (let i = 0; i < n; i++) {
    dummy.position.set(set.positions[i * 3], set.positions[i * 3 + 1], set.positions[i * 3 + 2]);
    dummy.rotation.set(set.rotations[i * 3], set.rotations[i * 3 + 1], set.rotations[i * 3 + 2]);
    dummy.scale.setScalar(set.scales[i]);
    dummy.updateMatrix();
    mesh.setMatrixAt(i, dummy.matrix);
  }
  mesh.instanceMatrix.needsUpdate = true;
  mesh.computeBoundingSphere();
}

/** Re-tint an existing mesh without touching a single matrix. */
function applyColors(mesh: THREE.InstancedMesh | null, colors: Float32Array) {
  if (!mesh) return;
  const color = new THREE.Color();
  for (let i = 0; i < colors.length / 3; i++) {
    color.setRGB(colors[i * 3], colors[i * 3 + 1], colors[i * 3 + 2]);
    mesh.setColorAt(i, color);
  }
  if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
}

// ---------------------------------------------------------------------------
// Scene
// ---------------------------------------------------------------------------

function Brain({
  quality,
  reduceMotion,
  isDark,
}: {
  quality: number;
  reduceMotion: boolean;
  isDark: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const rimRef = useRef<THREE.InstancedMesh>(null);
  const coreRef = useRef<THREE.InstancedMesh>(null);
  const ambientRef = useRef<THREE.InstancedMesh>(null);
  const rimMat = useRef<THREE.MeshBasicMaterial>(null);
  const coreMat = useRef<THREE.MeshBasicMaterial>(null);

  // Geometry: expensive, and independent of the theme. Built once per quality
  // tier and then left alone, so switching day/night never rebuilds a brain.
  const { rim, core, ambient } = useMemo(() => {
    const rimCount = Math.round(9000 * quality);
    const coreCount = Math.round(3600 * quality);

    return {
      rim: buildLayout(generateBrainPoints(rimCount), 4242, {
        minScale: 0.012,
        maxScale: 0.026,
      }),
      core: buildLayout(generateCorePoints(coreCount, 8080), 1717, {
        minScale: 0.009,
        maxScale: 0.018,
      }),
      ambient: buildLayout(generateAmbientPoints(110, 5150), 3030, {
        minScale: 0.05,
        maxScale: 0.11,
      }),
    };
  }, [quality]);

  // Colour: cheap, and the only thing the theme actually changes.
  const tints = useMemo(
    () => ({
      rim: buildColors(rim.positions, 4242, {
        palette: isDark ? RIM_COLORS : RIM_COLORS_LIGHT,
        rimBias: true,
        isDark,
      }),
      core: buildColors(core.positions, 1717, {
        palette: isDark ? CORE_COLORS : CORE_COLORS_LIGHT,
        rimBias: false,
        isDark,
      }),
      ambient: buildColors(ambient.positions, 3030, {
        palette: isDark ? RIM_COLORS : RIM_COLORS_LIGHT,
        rimBias: false,
        isDark,
      }),
    }),
    [rim, core, ambient, isDark],
  );

  // useLayoutEffect, not useEffect: a fresh InstancedMesh starts with every
  // instance on an identity matrix, which draws all of them stacked at the
  // origin as one screen-filling white triangle. useEffect fires after the
  // browser has already painted, so that triangle got a frame or two on screen
  // before the real geometry landed — a white flash across the hero on load.
  useLayoutEffect(() => applyLayout(rimRef.current, rim), [rim]);
  useLayoutEffect(() => applyLayout(coreRef.current, core), [core]);
  useLayoutEffect(() => applyLayout(ambientRef.current, ambient), [ambient]);

  useLayoutEffect(() => applyColors(rimRef.current, tints.rim), [tints]);
  useLayoutEffect(() => applyColors(coreRef.current, tints.core), [tints]);
  useLayoutEffect(() => applyColors(ambientRef.current, tints.ambient), [tints]);

  // Density dial. `count` renders a prefix of the instance buffer, and the
  // points were shuffled at generation, so a prefix thins the whole brain
  // evenly rather than lopping off the cerebellum and brainstem.
  useLayoutEffect(() => {
    const draw = (mesh: THREE.InstancedMesh | null, total: number, fraction: number) => {
      if (mesh) mesh.count = Math.round(total * fraction);
    };
    draw(rimRef.current, rim.scales.length, isDark ? 1 : LIGHT_DENSITY.rim);
    draw(coreRef.current, core.scales.length, isDark ? 1 : LIGHT_DENSITY.core);
    draw(ambientRef.current, ambient.scales.length, isDark ? 1 : LIGHT_DENSITY.ambient);
  }, [rim, core, ambient, isDark]);

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
    if (!g) return;
    const t = state.clock.elapsedTime;
    const s = scroll.current;

    // Pin to the right-hand side of whatever the camera can actually see, and
    // size against it too. Both are recomputed per frame so a window resize is
    // handled without a listener.
    const vw = state.viewport.width;
    g.position.x = vw * RIGHT_FRACTION;
    const fit = THREE.MathUtils.clamp(vw / 5.6, 0.62, 1);

    if (!reduceMotion) {
      // The idle term oscillates instead of accumulating. A constant drift
      // eventually carries the brain to an arbitrary angle and parks it
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

      g.position.y = Math.sin(t * 0.45) * 0.05 - s * 0.25;
      const breathe = 1 + Math.sin(t * 0.8) * 0.022;
      g.scale.setScalar(fit * breathe * (1 - s * 0.12));

      // Ambient field turns on its own axis, slower than the brain, so the
      // two never lock together and look welded.
      if (ambientRef.current) {
        ambientRef.current.rotation.y = t * 0.03;
        ambientRef.current.rotation.x = Math.sin(t * 0.07) * 0.2;
      }
    } else {
      // Still needs placing and sizing when motion is off — it just holds
      // the lateral pose instead of moving.
      g.rotation.set(0, LATERAL_YAW, 0);
      g.scale.setScalar(fit);
    }

    // Shimmer: rim and core pulse out of phase, so brightness travels between
    // the glowing edge and the dark interior rather than the whole cloud
    // flashing at once.
    //
    // Light mode is thinned by LIGHT_DENSITY rather than dimmed, so each
    // surviving particle can carry a little more alpha than in dark mode and
    // still read as a sketch instead of a mass — with far fewer layers stacked,
    // alpha no longer compounds its way to a solid blob.
    const rimBase = isDark ? 0.46 : 0.26;
    const rimSwing = isDark ? 0.1 : 0.05;
    const coreBase = isDark ? 0.16 : 0.1;
    const coreSwing = isDark ? 0.06 : 0.035;

    if (rimMat.current) rimMat.current.opacity = rimBase + Math.sin(t * 1.15) * rimSwing;
    if (coreMat.current)
      coreMat.current.opacity = coreBase + Math.sin(t * 1.15 + Math.PI) * coreSwing;
  });

  return (
    <group ref={group} rotation={[0, LATERAL_YAW, 0]}>
      {/* Dense, dark interior. Drawn first so the rim reads on top of it. */}
      <instancedMesh
        ref={coreRef}
        args={[undefined, undefined, core.scales.length]}
        frustumCulled={false}
      >
        <circleGeometry args={[1, 3]} />
        <meshBasicMaterial
          ref={coreMat}
          wireframe
          side={THREE.DoubleSide}
          transparent
          opacity={0.16}
          depthWrite={false}
          blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
        />
      </instancedMesh>

      {/* Outer shell and brainstem: the glowing edge. */}
      <instancedMesh
        ref={rimRef}
        args={[undefined, undefined, rim.scales.length]}
        frustumCulled={false}
      >
        <circleGeometry args={[1, 3]} />
        <meshBasicMaterial
          ref={rimMat}
          wireframe
          side={THREE.DoubleSide}
          transparent
          opacity={0.46}
          depthWrite={false}
          blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
        />
      </instancedMesh>

      {/* Larger hollow triangles drifting in the surrounding space. */}
      <instancedMesh
        ref={ambientRef}
        args={[undefined, undefined, ambient.scales.length]}
        frustumCulled={false}
      >
        <circleGeometry args={[1, 3]} />
        <meshBasicMaterial
          wireframe
          side={THREE.DoubleSide}
          transparent
          // Faint in dark, fainter still in light — drawn normally on a pale
          // page these scattered triangles otherwise read as specks of dirt
          // across the copy rather than atmosphere.
          opacity={isDark ? 0.16 : 0.07}
          depthWrite={false}
          blending={isDark ? THREE.AdditiveBlending : THREE.NormalBlending}
        />
      </instancedMesh>
    </group>
  );
}

/**
 * Default-exported so BrainScene can reach it through React.lazy.
 *
 * This module must never be imported eagerly. Pulling @react-three/fiber into
 * the server bundle throws "Cannot read properties of null (reading 'useMemo')"
 * inside CanvasImpl — its react-reconciler has no React internals in the SSR
 * runtime — which drops the whole page to an error boundary rather than just
 * losing the decoration.
 */
export default function BrainCanvas() {
  // Track the theme so the scene can swap blending and palette. The site
  // toggles a `dark` class on <html>, so observe that rather than the OS
  // preference — the user's in-app choice has to win.
  const [isDark, setIsDark] = useState(
    () => document.documentElement.classList.contains("dark"),
  );

  useEffect(() => {
    const el = document.documentElement;
    const sync = () => setIsDark(el.classList.contains("dark"));
    const obs = new MutationObserver(sync);
    obs.observe(el, { attributes: true, attributeFilter: ["class"] });
    sync();
    return () => obs.disconnect();
  }, []);

  // Safe to read directly: this component only ever mounts on the client.
  //
  // Below MIN_WIDTH the layout is a single column, so there is no right-hand
  // side to sit in — the brain lands on top of the hero copy instead of beside
  // it, which is the one thing the placement is supposed to prevent. Skipping
  // outright also avoids paying for a WebGL context and thousands of instanced
  // wireframes on a phone, for decoration that would be mostly off-screen.
  if (window.innerWidth < MIN_WIDTH) return null;

  const quality = window.innerWidth < 1280 ? 0.6 : 1;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return (
    // The black wash is dark-mode only — painted unconditionally it put a hard
    // black box behind the hero on a white page and dropped the headline to
    // dark-on-black.
    //
    // It is driven by the `dark` variant rather than by `isDark`, so it repaints
    // in the same frame as the class lands on <html>. Routed through React it
    // trailed the rest of the page by a commit or two, which is exactly long
    // enough to see the backdrop stay black for a beat after switching to day.
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 dark:bg-black">
      <Canvas
        camera={{ position: [0, 0, 3.2], fov: 42 }}
        dpr={[1, 1.6]}
        gl={{ antialias: false, powerPreference: "low-power" }}
      >
        {/* Drops resolution if the frame budget slips, rather than dropping frames. */}
        <AdaptiveDpr pixelated />
        <Brain quality={quality} reduceMotion={reduceMotion} isDark={isDark} />
      </Canvas>
    </div>
  );
}
