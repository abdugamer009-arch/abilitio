import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { AdaptiveDpr } from "@react-three/drei";
import * as THREE from "three";

/**
 * Interactive 3D particle brain, rendered as a fixed background layer.
 *
 * Shape: the brain is one implicit surface — a signed distance field in which
 * anatomically-placed lobes, the cerebellum and the brainstem are fused with a
 * smooth minimum, then a midline fissure is subtracted from the crown. Points
 * are sampled against that single field.
 *
 * Both halves of that sentence matter. A noise-displaced ellipsoid reads as a
 * bean, because a brain's silhouette comes from distinct lobes meeting at
 * angles rather than from a smooth body with bumps on it — hence the lobes. But
 * sampling each lobe's own surface and discarding whatever lands inside a
 * neighbour leaves a visible seam wherever two shells cross, and two separate
 * balls wherever they merely touch — hence one field rather than a union of
 * parts. Fusing them in the field means separate masses are not representable.
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
};

/** Right hemisphere; the left is this mirrored through x. */
const LOBES: Lobe[] = [
  // Frontal — tall and rounded, carries the front of the silhouette.
  { c: [0.34, 0.1, 0.5], r: [0.3, 0.33, 0.4] },
  // Parietal — the crown, widest part of the brain seen from above.
  { c: [0.35, 0.26, -0.06], r: [0.33, 0.31, 0.36] },
  // Occipital — shorter and lower, tapering to the back.
  { c: [0.3, 0.02, -0.58], r: [0.28, 0.26, 0.3] },
  // Temporal — slung low and lateral; the lobe that stops it reading as an egg.
  { c: [0.44, -0.3, 0.1], r: [0.21, 0.19, 0.42] },
];

const CEREBELLUM: Lobe = { c: [0, -0.36, -0.6], r: [0.44, 0.21, 0.29] };

/** Brainstem axis, descending from under the thalamus toward the cord. */
const STEM_TOP: [number, number, number] = [0, -0.34, -0.3];
const STEM_BOTTOM: [number, number, number] = [0, -0.86, -0.16];

// ---------------------------------------------------------------------------
// One brain, as a single implicit surface
// ---------------------------------------------------------------------------
//
// The parts used to be sampled independently — each lobe got points on its own
// complete ellipsoid, and a point was dropped only if it fell strictly inside a
// neighbour. Wherever two lobes only partly overlapped you therefore saw two
// whole shells crossing, and wherever they merely touched you saw two separate
// balls. The result read as a heap of six or seven blobs rather than one organ.
//
// Everything below instead describes the brain as one signed distance field:
// negative inside, zero on the surface. Parts are combined with a smooth
// minimum, which fuses them into a single continuous body with a fillet at
// every joint instead of an intersection seam. Sampling then happens against
// that one surface, so separate masses are not merely avoided — they are not
// representable.

/**
 * Ellipsoid distance. A closed-form exact SDF for an ellipsoid needs iteration;
 * this scaled-sphere approximation is smooth, monotonic and correctly signed,
 * which is all the blend and the surface projection require.
 */
function sdEllipsoid(
  px: number,
  py: number,
  pz: number,
  c: [number, number, number],
  r: [number, number, number],
): number {
  const dx = (px - c[0]) / r[0];
  const dy = (py - c[1]) / r[1];
  const dz = (pz - c[2]) / r[2];
  return (Math.hypot(dx, dy, dz) - 1) * Math.min(r[0], r[1], r[2]);
}

/** Capsule distance, for the brainstem. */
function sdCapsule(
  px: number,
  py: number,
  pz: number,
  a: [number, number, number],
  b: [number, number, number],
  radius: number,
): number {
  const bax = b[0] - a[0];
  const bay = b[1] - a[1];
  const baz = b[2] - a[2];
  const pax = px - a[0];
  const pay = py - a[1];
  const paz = pz - a[2];
  const len2 = bax * bax + bay * bay + baz * baz;
  const h = THREE.MathUtils.clamp((pax * bax + pay * bay + paz * baz) / len2, 0, 1);
  return Math.hypot(pax - bax * h, pay - bay * h, paz - baz * h) - radius;
}

/**
 * Polynomial smooth minimum.
 *
 * This one function is what turns the parts into a brain. A plain Math.min
 * unions two shapes but leaves a crease exactly where their surfaces cross —
 * the seam that made the old cloud look assembled from spheres. Blending over a
 * band of width `k` replaces that crease with a fillet, the way real cortex
 * runs continuously from one lobe into the next.
 */
function smin(a: number, b: number, k: number): number {
  const h = THREE.MathUtils.clamp(0.5 + (0.5 * (b - a)) / k, 0, 1);
  return b * (1 - h) + a * h - k * h * (1 - h);
}

/** Smooth maximum, used to subtract the midline fissure without a razor edge. */
function smax(a: number, b: number, k: number): number {
  return -smin(-a, -b, k);
}

/** How wide a band each joint is filleted over. Larger reads as one mass. */
const LOBE_BLEND = 0.14;

/**
 * Signed distance to the whole brain. Negative inside.
 *
 * Lobes are evaluated at |x| so both hemispheres come from a single definition
 * and are guaranteed to match. The cerebellum and brainstem join the same
 * blend rather than sitting alongside it, so they are part of one body instead
 * of two satellites parked next to it.
 */
function brainField(x: number, y: number, z: number): number {
  const ax = Math.abs(x);

  let d = sdEllipsoid(ax, y, z, LOBES[0].c, LOBES[0].r);
  for (let i = 1; i < LOBES.length; i++) {
    d = smin(d, sdEllipsoid(ax, y, z, LOBES[i].c, LOBES[i].r), LOBE_BLEND);
  }

  // Cerebellum straddles the midline, so it is evaluated on real x. Tighter
  // blend: it should read as tucked under the occipital lobe, not melted into it.
  d = smin(d, sdEllipsoid(x, y, z, CEREBELLUM.c, CEREBELLUM.r), 0.075);
  d = smin(d, sdCapsule(x, y, z, STEM_TOP, STEM_BOTTOM, 0.098), 0.07);

  // Longitudinal fissure. Carved as a thin midline slab that stops short of
  // the base, so the hemispheres separate at the crown but stay joined
  // underneath, as they are through the corpus callosum. Cutting the full
  // depth would genuinely split the brain into two objects — which is the
  // failure this whole rewrite exists to remove.
  const fissure = sdBox(x, y, z, 0, 0.62, 0, 0.05, 0.72, 1.15);
  return smax(d, -fissure, 0.045);
}

/** Box distance; exact outside, the usual cheap interior approximation. */
function sdBox(
  px: number,
  py: number,
  pz: number,
  cx: number,
  cy: number,
  cz: number,
  hx: number,
  hy: number,
  hz: number,
): number {
  const dx = Math.abs(px - cx) - hx;
  const dy = Math.abs(py - cy) - hy;
  const dz = Math.abs(pz - cz) - hz;
  const ox = Math.max(dx, 0);
  const oy = Math.max(dy, 0);
  const oz = Math.max(dz, 0);
  return Math.hypot(ox, oy, oz) + Math.min(Math.max(dx, dy, dz), 0);
}

/** Sampling volume, sized to contain the field with room for the blend. */
const BOUNDS = { x: 0.82, yMin: -1.02, yMax: 0.68, z: 1.0 };

/** Surface normal of the field, by central difference. */
function fieldNormal(x: number, y: number, z: number): [number, number, number] {
  const e = 0.004;
  const gx = brainField(x + e, y, z) - brainField(x - e, y, z);
  const gy = brainField(x, y + e, z) - brainField(x, y - e, z);
  const gz = brainField(x, y, z + e) - brainField(x, y, z - e);
  const len = Math.hypot(gx, gy, gz) || 1;
  return [gx / len, gy / len, gz / len];
}

/**
 * Sample the brain's surface — the whole thing, in one pass.
 *
 * Candidates are thrown into the bounding volume and kept when they land in a
 * thin shell around f = 0, then projected exactly onto the surface along the
 * gradient. There is no per-part loop and no notion of which lobe a point
 * "belongs" to, so cortex, cerebellum and brainstem come out as one continuous
 * skin with fillets at the joints.
 *
 * Rejection sampling is the right tool here despite the waste: it finds
 * undercuts — under the temporal lobe, beneath the cerebellum — that ray
 * marching outward from a centre point cannot reach.
 */
function generateBrainPoints(total: number): Float32Array {
  const rnd = makeRandom(20260901);
  const pts: number[] = [];

  // Wide enough to keep the hit rate workable, thin enough that a single
  // Newton step lands on the surface rather than near it.
  const SHELL = 0.028;
  const spanY = BOUNDS.yMax - BOUNDS.yMin;
  let guard = 0;

  while (pts.length / 3 < total && guard < total * 400) {
    guard++;

    const px = (rnd() * 2 - 1) * BOUNDS.x;
    const py = BOUNDS.yMin + rnd() * spanY;
    const pz = (rnd() * 2 - 1) * BOUNDS.z;

    const d = brainField(px, py, pz);
    if (d < -SHELL || d > SHELL) continue;

    const [nx, ny, nz] = fieldNormal(px, py, pz);
    const sx = px - d * nx;
    const sy = py - d * ny;
    const sz = pz - d * nz;

    const fold = corticalFold(sx, sy, sz);

    // Carve the sulci by thinning density inside them, rather than only
    // displacing the surface. Displacement alone is invisible once the cloud
    // is dense — every fold fills in and the brain reads as a smooth mass.
    // Removing particles from the creases leaves dark channels, and those
    // channels are what the eye reads as gyri.
    const foldNorm = THREE.MathUtils.clamp((fold + 0.05) / 0.1, 0, 1);
    if (rnd() > 0.18 + foldNorm * 0.82) continue;

    // Displace along the field's own normal, so folds sit perpendicular to the
    // surface everywhere — including the undercuts, where the old per-lobe
    // radial normal pointed into the body instead of out of it.
    const j = 0.004;
    pts.push(
      sx + nx * fold + j * (rnd() - 0.5),
      sy + ny * fold + j * (rnd() - 0.5),
      sz + nz * fold + j * (rnd() - 0.5),
    );
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
 * Fill the volume behind that same surface, for the dense inner core.
 *
 * Tested against the one field rather than against each lobe separately, so
 * the interior is the inside of the brain the rim describes. Filling the lobes
 * individually used to deposit a second set of overlapping ellipsoid clouds,
 * which is a large part of why the silhouette read as several masses even
 * where the outer shell had merged.
 */
function generateCorePoints(count: number, seed: number): Float32Array {
  const rnd = makeRandom(seed);
  const out: number[] = [];
  const spanY = BOUNDS.yMax - BOUNDS.yMin;
  let guard = 0;

  while (out.length / 3 < count && guard < count * 200) {
    guard++;
    const x = (rnd() * 2 - 1) * BOUNDS.x;
    const y = BOUNDS.yMin + rnd() * spanY;
    const z = (rnd() * 2 - 1) * BOUNDS.z;
    // Comfortably inside, so the core never pokes through the rim it sits behind.
    if (brainField(x, y, z) > -0.05) continue;
    out.push(x, y, z);
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
      // Scroll swings the brain through a bounded arc instead of spinning it.
      // A full 2.2 turns down the page looked lively but spent most of its time
      // at angles where a brain simply stops being recognisable — head-on, the
      // two frontal lobes are just a pair of spheres. Staying inside roughly
      // ±45° of the lateral pose keeps it in side-to-three-quarter profile,
      // which is the range that actually reads as a brain, and still gives the
      // scroll something to drive.
      const swing = (s - 0.5) * 0.85;
      const targetY = LATERAL_YAW + swing + pointer.current.x * 0.22 + idle;
      const targetX = s * 0.3 - pointer.current.y * 0.18 + Math.sin(t * 0.21) * 0.05;

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
