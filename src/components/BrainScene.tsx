import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

/**
 * Interactive 3D brain, rendered as a fixed layer behind the page.
 *
 * Why a procedural point cloud and not a loaded model: a GLTF brain would mean
 * shipping and hosting a mesh, and a solid mesh would fight the dark glass
 * surfaces for attention. Points are generated at runtime, cost a single draw
 * call, and read as the same constellation language already used in the hero —
 * so the brain looks like it belongs to this site rather than being dropped in
 * from a 3D demo.
 *
 * Why plain three and not react-three-fiber: R3F v9 augments the global JSX
 * namespace, which collides with React 19's DOM types and made `className`
 * resolve to `never` on every generically-typed component across the app. One
 * imperative scene with a custom loop gains little from the declarative layer
 * and costs a dependency, so it is driven directly here.
 *
 * Motion is layered so it never reads as a canned loop:
 *   - scroll drives rotation, so the brain turns as the page is read;
 *   - the pointer nudges it, so it feels responsive rather than scripted;
 *   - a slow idle drift keeps it alive when nothing is happening.
 *
 * It does not mount at all under prefers-reduced-motion, on coarse pointers,
 * or below 1024px, and the loop stops whenever the tab is hidden.
 */

const POINTS_PER_SIDE_HIGH = 5200;
const POINTS_PER_SIDE_LOW = 2600;

/** Deterministic PRNG so the brain is identical on every load. */
function makeRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

// ---------------------------------------------------------------------------
// The brain is assembled from anatomical lobes rather than deformed from a
// sphere. Noise-displaced ellipsoids gave a bean: the silhouette of a brain
// comes from distinct lobes meeting at angles, not from a smooth body with
// bumps on it. Each lobe is an ellipsoid; points are sampled on their surfaces
// and any point that falls inside a neighbouring lobe is discarded, so what
// survives is the outer hull of the union.
// ---------------------------------------------------------------------------

type Lobe = {
  /** Centre, in a right-hemisphere frame: +x lateral, +y superior, +z anterior. */
  c: [number, number, number];
  /** Semi-axes. */
  r: [number, number, number];
  /** Relative share of sampled points. */
  w: number;
};

/** Right hemisphere. The left is this mirrored through x. */
const LOBES: Lobe[] = [
  // Frontal — tall and rounded, carries the front of the silhouette.
  { c: [0.34, 0.1, 0.5], r: [0.3, 0.33, 0.4], w: 1.05 },
  // Parietal — the crown, and the widest part of the brain seen from above.
  { c: [0.35, 0.26, -0.06], r: [0.33, 0.31, 0.36], w: 1.1 },
  // Occipital — shorter and lower, tapering to the back.
  { c: [0.3, 0.02, -0.58], r: [0.28, 0.26, 0.3], w: 0.75 },
  // Temporal — slung low and lateral, the lobe that stops it reading as an egg.
  { c: [0.44, -0.3, 0.1], r: [0.21, 0.19, 0.42], w: 0.85 },
];

const CEREBELLUM: Lobe = { c: [0, -0.36, -0.6], r: [0.44, 0.21, 0.29], w: 1 };

function insideLobe(
  x: number,
  y: number,
  z: number,
  l: Lobe,
  margin = 1,
): boolean {
  const dx = (x - l.c[0]) / (l.r[0] * margin);
  const dy = (y - l.c[1]) / (l.r[1] * margin);
  const dz = (z - l.c[2]) / (l.r[2] * margin);
  return dx * dx + dy * dy + dz * dz < 1;
}

/**
 * Gyri. Shallow, high-frequency ripples applied along the surface — enough to
 * read as folding without eating the lobe boundaries that carry the shape.
 */
function gyralOffset(x: number, y: number, z: number): number {
  return (
    0.016 * Math.sin(15.5 * x + 9.1 * z) +
    0.014 * Math.sin(13.2 * y - 11.4 * x) +
    0.011 * Math.sin(17.1 * z + 7.3 * y)
  );
}

/**
 * Sample the outer hull of the lobe union for one hemisphere.
 *
 * Rejection is what does the work: a surface point that sits inside another
 * lobe is interior to the union and would show up as a seam through the
 * middle of the brain, so it is dropped and re-drawn.
 */
function hemispherePoints(count: number, side: 1 | -1, seed: number): Float32Array {
  const out = new Float32Array(count * 3);
  const rnd = makeRandom(seed);

  const totalW = LOBES.reduce((s, l) => s + l.w, 0);
  let written = 0;
  let guard = 0;

  while (written < count && guard < count * 60) {
    guard++;

    // Pick a lobe, weighted.
    let pick = rnd() * totalW;
    let lobe = LOBES[0];
    for (const l of LOBES) {
      pick -= l.w;
      if (pick <= 0) {
        lobe = l;
        break;
      }
    }

    // Point on that lobe's surface.
    const theta = 2 * Math.PI * rnd();
    const phi = Math.acos(2 * rnd() - 1);
    const sp = Math.sin(phi);
    const nx = sp * Math.cos(theta);
    const ny = Math.cos(phi);
    const nz = sp * Math.sin(theta);

    let x = lobe.c[0] + nx * lobe.r[0];
    let y = lobe.c[1] + ny * lobe.r[1];
    let z = lobe.c[2] + nz * lobe.r[2];

    // Drop it if another lobe swallows it — that keeps only the outer hull.
    // The margin shrinks the test slightly so lobes still visibly meet
    // instead of leaving a gap at every junction.
    let buried = false;
    for (const other of LOBES) {
      if (other === lobe) continue;
      if (insideLobe(x, y, z, other, 0.97)) {
        buried = true;
        break;
      }
    }
    if (!buried && insideLobe(x, y, z, CEREBELLUM, 0.97)) buried = true;
    if (buried) continue;

    // Folds, then a little scatter so the shell has thickness.
    const g = gyralOffset(x, y, z);
    x += nx * g + 0.006 * (rnd() - 0.5);
    y += ny * g + 0.006 * (rnd() - 0.5);
    z += nz * g + 0.006 * (rnd() - 0.5);

    // Hold the medial wall off the midline so the fissure stays open.
    if (x < 0.075) x = 0.075 + (0.075 - x) * 0.25;

    out[written * 3] = x * side;
    out[written * 3 + 1] = y;
    out[written * 3 + 2] = z;
    written++;
  }

  return out.subarray(0, written * 3) as Float32Array;
}

/**
 * Cerebellum. Its folia are far finer and more regular than cortical gyri, so
 * it gets tight parallel banding — that textural contrast is much of why it
 * reads as a separate structure rather than more cortex.
 */
function cerebellumPoints(count: number, seed: number): Float32Array {
  const out = new Float32Array(count * 3);
  const rnd = makeRandom(seed);
  for (let i = 0; i < count; i++) {
    const theta = 2 * Math.PI * rnd();
    const phi = Math.acos(2 * rnd() - 1);
    const sp = Math.sin(phi);
    const nx = sp * Math.cos(theta);
    const ny = Math.cos(phi);
    const nz = sp * Math.sin(theta);
    const folia = 0.022 * Math.sin(30 * nz) + 0.008 * Math.sin(18 * theta);
    out[i * 3] = CEREBELLUM.c[0] + nx * (CEREBELLUM.r[0] + folia);
    out[i * 3 + 1] = CEREBELLUM.c[1] + ny * (CEREBELLUM.r[1] + folia);
    out[i * 3 + 2] = CEREBELLUM.c[2] + nz * (CEREBELLUM.r[2] + folia);
  }
  return out;
}

/** Brainstem, tapering down and forward out of the cerebellum. */
function brainstemPoints(count: number, seed: number): Float32Array {
  const out = new Float32Array(count * 3);
  const rnd = makeRandom(seed);
  for (let i = 0; i < count; i++) {
    const t = rnd();
    const a = 2 * Math.PI * rnd();
    const radius = (0.115 - 0.05 * t) * (1 + 0.05 * Math.sin(9 * a));
    out[i * 3] = Math.cos(a) * radius;
    out[i * 3 + 1] = -0.42 - t * 0.4;
    out[i * 3 + 2] = Math.sin(a) * radius - 0.34 + t * 0.16;
  }
  return out;
}

/**
 * Sparse bright points threaded through the cerebrum, standing in for neural
 * activity. Kept in their own buffer so they can be drawn larger and hotter
 * than the cortex without a per-point size attribute and a custom shader.
 */
function synapsePoints(count: number, seed: number): Float32Array {
  const out = new Float32Array(count * 3);
  const rnd = makeRandom(seed);
  let written = 0;
  let guard = 0;
  while (written < count && guard < count * 60) {
    guard++;
    const side: 1 | -1 = rnd() < 0.5 ? 1 : -1;
    const lobe = LOBES[Math.floor(rnd() * LOBES.length)];
    // Somewhere inside the lobe, biased outward toward the cortical shell.
    const rad = 0.45 + 0.5 * rnd();
    const theta = 2 * Math.PI * rnd();
    const phi = Math.acos(2 * rnd() - 1);
    const sp = Math.sin(phi);
    const x = lobe.c[0] + sp * Math.cos(theta) * lobe.r[0] * rad;
    const y = lobe.c[1] + Math.cos(phi) * lobe.r[1] * rad;
    const z = lobe.c[2] + sp * Math.sin(theta) * lobe.r[2] * rad;
    if (x < 0.09) continue; // keep the fissure clear
    out[written * 3] = x * side;
    out[written * 3 + 1] = y;
    out[written * 3 + 2] = z;
    written++;
  }
  return out.subarray(0, written * 3) as Float32Array;
}

/** Violet ramp shared by both buffers; depth drives the mix so the far side recedes. */
function tintByDepth(positions: Float32Array, nearHex: string, farHex: string): Float32Array {
  const colors = new Float32Array(positions.length);
  const near = new THREE.Color(nearHex);
  const far = new THREE.Color(farHex);
  const c = new THREE.Color();
  for (let i = 0; i < positions.length / 3; i++) {
    const z = positions[i * 3 + 2];
    c.copy(far).lerp(near, THREE.MathUtils.clamp((z + 0.9) / 1.8, 0, 1));
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  return colors;
}

function buildGeometry(perSide: number): THREE.BufferGeometry {
  const left = hemispherePoints(perSide, -1, 20260901);
  const right = hemispherePoints(perSide, 1, 77003311);
  const cere = cerebellumPoints(Math.round(perSide * 0.34), 19470012);
  const stem = brainstemPoints(Math.round(perSide * 0.06), 55512347);

  const positions = new Float32Array(
    left.length + right.length + cere.length + stem.length,
  );
  let at = 0;
  for (const part of [left, right, cere, stem]) {
    positions.set(part, at);
    at += part.length;
  }

  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  g.setAttribute("color", new THREE.BufferAttribute(tintByDepth(positions, "#c4b5fd", "#6d3df0"), 3));
  return g;
}

function buildSynapseGeometry(perSide: number): THREE.BufferGeometry {
  const positions = synapsePoints(Math.round(perSide * 0.09), 90210777);
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  g.setAttribute("color", new THREE.BufferAttribute(tintByDepth(positions, "#ffffff", "#a78bfa"), 3));
  return g;
}



export function BrainScene() {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Skip entirely rather than degrade. On a phone this would be a WebGL
    // context and thousands of points sitting behind content the user came to
    // read, for decoration they cannot even interact with.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(hover: none)").matches;
    if (reduce || coarse || window.innerWidth < 1024) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    const host = hostRef.current;
    if (!enabled || !host) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: false,
        alpha: true,
        powerPreference: "low-power",
      });
    } catch {
      return; // No WebGL — the page is fully usable without this layer.
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0, 0, 3.1);

    const perSide = window.innerWidth < 1440 ? POINTS_PER_SIDE_LOW : POINTS_PER_SIDE_HIGH;
    const geometry = buildGeometry(perSide);
    const material = new THREE.PointsMaterial({
      size: 0.012,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(geometry, material);

    // Synapses ride in a second buffer purely so they can be drawn larger and
    // hotter than the cortex. Varying point size within one buffer would mean
    // a per-point size attribute and a custom shader for no visual gain.
    const synapseGeometry = buildSynapseGeometry(perSide);
    const synapseMaterial = new THREE.PointsMaterial({
      size: 0.03,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      sizeAttenuation: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const synapses = new THREE.Points(synapseGeometry, synapseMaterial);

    // Two nested groups. The inner one holds a fixed presentation pose so the
    // brain is seen in three-quarter profile — the angle that actually reads
    // as a brain. Looking straight down +z shows only the narrow frontal lobe.
    // The outer group is what scroll and the pointer rotate, so the pose is
    // preserved no matter where the spin currently is.
    const pose = new THREE.Group();
    // Tilted toward top-down. Seen from the side a brain is just an ovoid; it
    // is the view from above — two lobes split by the fissure — that actually
    // reads as a brain. Not fully flat, so it keeps some depth.
    pose.rotation.set(-Math.PI * 0.38, 0, 0.05);
    pose.add(points);
    pose.add(synapses);

    const group = new THREE.Group();
    group.add(pose);
    scene.add(group);

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.6));
    host.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";

    const resize = () => {
      const w = host.clientWidth;
      const h = host.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();

      // Size against what the camera can actually see, not against pixel width.
      // The model is ~1.6 units on its longest axis; the visible height at this
      // distance and fov is ~2.4 units, so anything above ~1.3 overflows the
      // frame and you end up looking at the inside of the point cloud.
      const visibleH = 2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360);
      const target = visibleH * 0.62; // share of frame height the brain occupies
      group.scale.setScalar(THREE.MathUtils.clamp(target / 1.6, 0.75, 1.25));

      // Sit in the right-hand third. The hero copy runs down the left, and a
      // centred brain puts its densest point directly behind the headline.
      const visibleW = visibleH * camera.aspect;
      group.position.x = visibleW * 0.2;
    };
    resize();

    let scrollProgress = 0;
    const pointer = { x: 0, y: 0 };

    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      scrollProgress = max > 0 ? window.scrollY / max : 0;
    };
    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("resize", resize);

    const ro = new ResizeObserver(resize);
    ro.observe(host);

    let raf = 0;
    let running = true;
    const clock = new THREE.Clock();

    const tick = () => {
      if (!running) return;
      const delta = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;

      // Scroll is the primary driver — a little over one full turn top to
      // bottom. Pointer and idle drift are secondary so it is never static.
      const targetY = scrollProgress * Math.PI * 2.4 + pointer.x * 0.35 + t * 0.05;
      const targetX = -pointer.y * 0.22 + Math.sin(t * 0.28) * 0.06;

      // Ease toward the target instead of snapping, so a fast scroll reads as
      // momentum rather than a jump.
      const k = 1 - Math.pow(0.0015, delta);
      group.rotation.y += (targetY - group.rotation.y) * k;
      group.rotation.x += (targetX - group.rotation.x) * k;
      group.position.y = Math.sin(t * 0.4) * 0.045;

      // Strongest in the hero, then step back so it never competes with the
      // sections the visitor is actually reading. It keeps turning either way.
      material.opacity = THREE.MathUtils.lerp(0.85, 0.42, Math.min(scrollProgress * 3.2, 1));
      synapseMaterial.opacity = material.opacity;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // A hidden tab keeps firing rAF in some browsers; stop outright.
    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        clock.getDelta(); // drop the elapsed gap so it does not lurch
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", resize);
      ro.disconnect();
      // React unmounting does not free GPU memory; release it explicitly.
      geometry.dispose();
      material.dispose();
      synapseGeometry.dispose();
      synapseMaterial.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === host) host.removeChild(renderer.domElement);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={hostRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 opacity-[0.55]"
    />
  );
}
