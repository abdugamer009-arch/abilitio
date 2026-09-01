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

/**
 * One hemisphere as a folded ellipsoid.
 *
 * A plain ellipsoid reads as an egg, so the radius is displaced by two sine
 * bands at different frequencies — that ridging is what makes the silhouette
 * legible as a brain. The inner face is then flattened and pushed outward so
 * the halves meet along a fissure instead of interpenetrating.
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

    // Gyri, plus jitter so the surface has thickness instead of looking like
    // a hollow shell.
    const fold =
      0.11 * Math.sin(8 * phi) * Math.sin(7 * theta) +
      0.07 * Math.sin(12 * theta + 1.7) +
      0.018 * (rnd() - 0.5);
    const r = 1 + fold;

    // Brain proportions: longest front-to-back, shallowest top-to-bottom.
    x *= r * 0.44;
    y *= r * 0.56;
    z *= r * 0.84;

    // Flatten the medial face and separate the halves. The gap is what makes
    // the longitudinal fissure visible from above; too small and the two
    // hemispheres merge into one ovoid.
    x = (Math.abs(x) * 0.7 + 0.085) * side;

    // Taper the frontal lobe so it stops reading as a sphere.
    const taper = 1 - 0.16 * Math.max(0, z);
    x *= taper;
    y *= taper;

    out[i * 3] = x;
    out[i * 3 + 1] = y;
    out[i * 3 + 2] = z;
  }
  return out;
}

/** Cerebellum: a smaller, tighter-ridged cluster tucked under the back. */
function cerebellumPoints(count: number, seed: number): Float32Array {
  const out = new Float32Array(count * 3);
  const rnd = makeRandom(seed);
  for (let i = 0; i < count; i++) {
    const theta = 2 * Math.PI * rnd();
    const phi = Math.acos(2 * rnd() - 1);
    const sp = Math.sin(phi);
    const r = 0.34 + 0.05 * Math.sin(16 * theta) + 0.015 * (rnd() - 0.5);
    out[i * 3] = sp * Math.cos(theta) * r * 1.15;
    out[i * 3 + 1] = Math.cos(phi) * r * 0.62 - 0.44;
    out[i * 3 + 2] = sp * Math.sin(theta) * r + 0.5;
  }
  return out;
}

function buildGeometry(perSide: number): THREE.BufferGeometry {
  const left = hemispherePoints(perSide, -1, 20260901);
  const right = hemispherePoints(perSide, 1, 77003311);
  const cere = cerebellumPoints(Math.round(perSide * 0.28), 19470012);

  const positions = new Float32Array(left.length + right.length + cere.length);
  positions.set(left, 0);
  positions.set(right, left.length);
  positions.set(cere, left.length + right.length);

  // Tint from the site's violet ramp, mixed by depth so the far side recedes
  // instead of flattening into a single colour.
  const colors = new Float32Array(positions.length);
  const near = new THREE.Color("#c4b5fd");
  const far = new THREE.Color("#6d3df0");
  const c = new THREE.Color();
  for (let i = 0; i < positions.length / 3; i++) {
    const z = positions[i * 3 + 2];
    c.copy(far).lerp(near, THREE.MathUtils.clamp((z + 0.9) / 1.8, 0, 1));
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }

  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
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
