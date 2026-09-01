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
// Noise. Cortical folds are not periodic, so sine bands read as a decorative
// ripple rather than a brain. Fractal value noise gives non-repeating gyri,
// and ridging it (1 - |2n-1|) produces rounded crowns with sharp creases
// between them — which is what a sulcus actually looks like.
// ---------------------------------------------------------------------------

function hash3(x: number, y: number, z: number): number {
  let h = (x * 374761393 + y * 668265263 + z * 1274126177) | 0;
  h = (Math.imul(h ^ (h >>> 13), 1274126177) | 0) >>> 0;
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

const smoothStep = (t: number) => t * t * (3 - 2 * t);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;

function valueNoise3(x: number, y: number, z: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  const u = smoothStep(x - xi);
  const v = smoothStep(y - yi);
  const w = smoothStep(z - zi);
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
function fbm(x: number, y: number, z: number, octaves = 4): number {
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
 * Radial displacement standing in for the cortex surface.
 *
 * Two ridged layers: a coarse one for the major gyri, a finer one for the
 * secondary folding on top of them. Returned roughly in [-0.5, 0.5] so the
 * caller can scale it.
 */
function cortexFold(x: number, y: number, z: number): number {
  const coarse = 1 - Math.abs(2 * fbm(x * 3.1, y * 3.1, z * 3.1, 4) - 1);
  const fine = 1 - Math.abs(2 * fbm(x * 7.4 + 11, y * 7.4 + 11, z * 7.4 + 11, 3) - 1);
  return (coarse - 0.5) * 0.78 + (fine - 0.5) * 0.3;
}

/**
 * One cerebral hemisphere.
 *
 * Built as a sphere pushed through three shaping stages:
 *   1. an anatomical profile — a brain is widest around the parietal region,
 *      tapering to a narrower frontal pole and a shorter occipital one, which
 *      a plain ellipsoid does not capture;
 *   2. a temporal-lobe bulge low on the lateral side, separated by a crease
 *      standing in for the lateral sulcus — the single most recognisable
 *      landmark in a brain silhouette;
 *   3. ridged fractal folds for the gyri.
 *
 * The medial face is then flattened and offset so the two halves face each
 * other across a real longitudinal fissure instead of interpenetrating.
 */
function hemispherePoints(count: number, side: 1 | -1, seed: number): Float32Array {
  const out = new Float32Array(count * 3);
  const rnd = makeRandom(seed);

  for (let i = 0; i < count; i++) {
    const theta = 2 * Math.PI * rnd();
    const phi = Math.acos(2 * rnd() - 1); // even over the sphere, not over angle
    const sp = Math.sin(phi);
    let x = sp * Math.cos(theta);
    let y = Math.cos(phi);
    let z = sp * Math.sin(theta);

    // 1. Anatomical profile. z+ is anterior (front), z- posterior.
    const front = Math.max(0, z);
    const back = Math.max(0, -z);
    const widthProfile = 1 - 0.34 * front * front - 0.14 * back * back;
    const heightProfile = 1 - 0.3 * front * front - 0.26 * back * back;

    // 2. Temporal lobe: a bulge low, lateral and slightly forward.
    const dTemporal = Math.hypot(x * 0.9, (y + 0.62) * 1.25, (z - 0.22) * 0.8);
    const temporal = Math.max(0, 1 - dTemporal / 0.85) ** 1.4;

    // Lateral sulcus: the crease separating that lobe from the rest.
    const sulcus = Math.exp(-(((y + 0.2) * 3.4) ** 2)) * Math.max(0, 1 - Math.abs(z - 0.1)) * 0.06;

    // 3. Gyri. Deep enough to survive additive blending — at shallower
    // amplitudes thousands of overlapping points wash the relief into haze.
    const fold = cortexFold(x, y, z) * 0.2;

    const r = 1 + fold + temporal * 0.2 - sulcus + 0.012 * (rnd() - 0.5);

    // Real proportions: a brain is markedly wider than it is tall, and longer
    // front-to-back than either. Getting this wrong is what makes a point
    // cloud read as an egg standing on end.
    x *= r * 0.8 * widthProfile;
    y *= r * 0.5 * heightProfile;
    z *= r * 0.86;

    // Flatten the medial face and push the halves apart. This gap is the
    // longitudinal fissure and it is the single most identifying feature of
    // the silhouette — with a narrow one the hemispheres read as a single
    // ovoid no matter how good the folding is. It has to be wide enough to
    // survive additive blending from points on the far wall.
    x = (Math.abs(x) * 0.6 + 0.16) * side;

    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }
  return out;
}

/**
 * Cerebellum. Its folia are far finer and more regular than cortical gyri, so
 * it gets tight parallel banding rather than the fractal treatment — that
 * contrast is a large part of why it reads as a separate structure.
 */
function cerebellumPoints(count: number, seed: number): Float32Array {
  const out = new Float32Array(count * 3);
  const rnd = makeRandom(seed);
  for (let i = 0; i < count; i++) {
    const theta = 2 * Math.PI * rnd();
    const phi = Math.acos(2 * rnd() - 1);
    const sp = Math.sin(phi);
    const x = sp * Math.cos(theta);
    const y = Math.cos(phi);
    const z = sp * Math.sin(theta);

    const folia = 0.035 * Math.sin(26 * y) + 0.012 * Math.sin(15 * theta);
    const r = 0.36 + folia + 0.01 * (rnd() - 0.5);

    out[i * 3] = x * r * 1.28;
    out[i * 3 + 1] = y * r * 0.6 - 0.44;
    out[i * 3 + 2] = z * r * 0.92 - 0.52;
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
    const radius = (0.115 - 0.055 * t) * (1 + 0.05 * Math.sin(9 * a));
    out[i * 3] = Math.cos(a) * radius;
    out[i * 3 + 1] = -0.42 - t * 0.42;
    out[i * 3 + 2] = Math.sin(a) * radius - 0.3 + t * 0.12;
  }
  return out;
}

/**
 * Sparse bright points threaded through the interior, standing in for neural
 * activity. Kept as its own buffer so they can be drawn larger and hotter than
 * the cortex without needing a per-point size attribute and a custom shader.
 */
function synapsePoints(count: number, seed: number): Float32Array {
  const out = new Float32Array(count * 3);
  const rnd = makeRandom(seed);
  let written = 0;
  let guard = 0;
  while (written < count && guard < count * 40) {
    guard++;
    // Rejection-sample inside the cerebrum so they sit within the volume
    // rather than floating around it.
    const x = (rnd() * 2 - 1) * 0.62;
    const y = (rnd() * 2 - 1) * 0.52;
    const z = (rnd() * 2 - 1) * 0.8;
    const inside = (x / 0.6) ** 2 + (y / 0.5) ** 2 + (z / 0.82) ** 2;
    if (inside > 1) continue;
    // Bias toward the cortical shell, where the synapses actually are.
    if (rnd() > 0.25 + inside * 0.75) continue;
    out[written * 3] = x;
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
  const cere = cerebellumPoints(Math.round(perSide * 0.3), 19470012);
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
