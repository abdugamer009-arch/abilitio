// Custom inline-SVG icon set for the projective interest test.
// Every option in the interest bank references an icon by name here — there are
// no emoji anywhere. Each icon is hand-drawn line-art on a shared 64×64 grid so
// they read as one consistent, "rendered" family. Strokes use currentColor, so
// icons inherit the card's selected/hover colour and adapt to light & dark.
//
// A value is the *inner* SVG content; the renderer (career-assessment.tsx) wraps
// it in <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" …>. Filled
// details (eyes, beads) set fill="currentColor" stroke="none" locally.
import type { ReactNode } from "react";

export const INTEREST_ICONS: Record<string, ReactNode> = {
  // ── Geometric shapes ──
  square: <rect x="14" y="14" width="36" height="36" rx="4" />,
  rectangle: <rect x="8" y="20" width="48" height="24" rx="3" />,
  triangle: <path d="M32 12 L52 50 L12 50 Z" />,
  circle: <circle cx="32" cy="32" r="20" />,
  diamond: <path d="M32 10 L54 32 L32 54 L10 32 Z" />,
  squiggle: <path d="M10 44 C 18 20 26 20 32 34 C 38 48 46 48 54 22" />,
  hexagon: <path d="M32 10 L52 21 L52 43 L32 54 L12 43 L12 21 Z" />,
  star: <path d="M32 10 L37.3 24.7 L52.9 25.2 L40.6 34.8 L44.9 49.8 L32 41 L19.1 49.8 L23.4 34.8 L11.1 25.2 L26.7 24.7 Z" />,

  // ── Lines ──
  l_straight: <path d="M10 32 H54" />,
  l_diagonal: <path d="M12 52 L52 14 M52 14 L41 15.5 M52 14 L50.5 25" />,
  l_wave: <path d="M8 32 Q 20 14 32 32 T 56 32" />,
  l_zigzag: <path d="M8 42 L20 20 L32 42 L44 20 L56 42" />,
  l_spiral: <path d="M34 32 C 34 27 26 27 26 33 C 26 42 40 42 42 32 C 44 18 26 14 20 26 C 13 40 30 52 44 46" />,
  l_grid: <path d="M24 12 V52 M40 12 V52 M12 24 H52 M12 40 H52" />,

  // ── Patterns ──
  p_dots: (
    <g fill="currentColor" stroke="none">
      {[20, 32, 44].flatMap((y) => [20, 32, 44].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="3.4" />))}
    </g>
  ),
  p_geometric: <path d="M32 12 L52 32 L32 52 L12 32 Z M32 22 L42 32 L32 42 L22 32 Z" />,
  p_organic: <path d="M22 22 C 10 30 14 48 30 46 C 46 44 54 30 42 20 C 34 13 28 17 22 22 Z" />,
  p_circuit: (
    <g>
      <path d="M12 20 H30 V40 H50 M30 20 V12 M50 40 V52" />
      <g fill="currentColor" stroke="none">
        <circle cx="12" cy="20" r="3" /><circle cx="30" cy="40" r="3" /><circle cx="50" cy="40" r="3" />
      </g>
    </g>
  ),
  p_marble: <path d="M8 24 Q 22 15 33 26 T 56 23 M8 41 Q 22 32 33 43 T 56 40" />,
  p_doodle: <path d="M12 40 C 20 18 24 50 32 30 C 38 15 42 48 52 26" />,

  // ── Animals ──
  lion: (
    <g>
      <circle cx="32" cy="34" r="18" strokeDasharray="2.5 3.5" />
      <circle cx="32" cy="34" r="12" />
      <g fill="currentColor" stroke="none"><circle cx="27" cy="33" r="1.6" /><circle cx="37" cy="33" r="1.6" /></g>
      <path d="M32 36 v3 M32 39 q -3 2 -5 0 M32 39 q 3 2 5 0" />
    </g>
  ),
  owl: (
    <g>
      <path d="M20 24 Q 32 10 44 24 Q 48 44 32 50 Q 16 44 20 24 Z" />
      <path d="M21 22 L25 28 M43 22 L39 28" />
      <circle cx="26" cy="30" r="5" /><circle cx="38" cy="30" r="5" />
      <g fill="currentColor" stroke="none"><circle cx="26" cy="30" r="1.6" /><circle cx="38" cy="30" r="1.6" /></g>
      <path d="M30 34 L32 38 L34 34 Z" fill="currentColor" stroke="none" />
    </g>
  ),
  dolphin: (
    <g>
      <path d="M12 42 C 16 24 40 16 52 22 C 45 24 42 30 44 33 C 39 35 33 32 31 29 C 27 40 19 44 12 42 Z" />
      <path d="M33 22 Q 38 13 45 17" />
      <circle cx="44" cy="27" r="1.3" fill="currentColor" stroke="none" />
    </g>
  ),
  eagle: (
    <g>
      <path d="M32 26 C 24 15 12 17 7 24 C 17 23 25 29 32 31" />
      <path d="M32 26 C 40 15 52 17 57 24 C 47 23 39 29 32 31" />
      <path d="M32 24 v16 M27 40 h10" />
      <circle cx="32" cy="22" r="3.2" />
      <path d="M35 22 L40 21" />
    </g>
  ),
  fox: (
    <g>
      <path d="M17 22 L27 30 L32 28 L37 30 L47 22 L43 37 L32 46 L21 37 Z" />
      <g fill="currentColor" stroke="none"><circle cx="27" cy="33" r="1.6" /><circle cx="37" cy="33" r="1.6" /><circle cx="32" cy="40" r="1.8" /></g>
    </g>
  ),
  wolf: (
    <g>
      <path d="M18 20 L25 31 M46 20 L39 31" />
      <path d="M23 29 Q 32 23 41 29 L43 40 L36 46 L32 43 L28 46 L21 40 Z" />
      <g fill="currentColor" stroke="none"><circle cx="28" cy="34" r="1.5" /><circle cx="36" cy="34" r="1.5" /><circle cx="32" cy="41" r="1.8" /></g>
    </g>
  ),
  bee: (
    <g>
      <ellipse cx="32" cy="37" rx="10" ry="13" />
      <path d="M23 33 h18 M22 39 h20 M25 45 h14" />
      <path d="M27 27 Q 16 20 22 30 Q 17 33 26 32" />
      <path d="M37 27 Q 48 20 42 30 Q 47 33 38 32" />
      <path d="M28 24 Q 25 17 22 16 M36 24 Q 39 17 42 16" />
    </g>
  ),
  turtle: (
    <g>
      <path d="M13 42 Q 32 18 51 42" />
      <path d="M13 42 H51" />
      <path d="M32 24 V42 M22 30 L15 40 M42 30 L49 40" />
      <path d="M51 40 Q 58 38 57 42 Q 56 46 50 44" />
      <path d="M20 42 v6 M44 42 v6" />
    </g>
  ),
  butterfly: (
    <g>
      <path d="M32 24 v20" />
      <path d="M32 25 C 22 14 9 21 15 32 C 21 41 30 34 32 30 Z" />
      <path d="M32 25 C 42 14 55 21 49 32 C 43 41 34 34 32 30 Z" />
      <path d="M32 33 C 25 39 19 50 27 52 C 32 53 32 44 32 40 Z" />
      <path d="M32 33 C 39 39 45 50 37 52 C 32 53 32 44 32 40 Z" />
      <path d="M32 24 Q 28 17 24 16 M32 24 Q 36 17 40 16" />
    </g>
  ),
  elephant: (
    <g>
      <path d="M20 44 C 12 34 16 20 30 20 C 42 20 46 30 44 36" />
      <path d="M18 24 Q 8 26 12 38 Q 18 44 22 38" />
      <path d="M40 30 Q 50 34 47 46 Q 46 52 41 50" />
      <path d="M34 42 Q 32 48 27 46" />
      <circle cx="30" cy="30" r="1.6" fill="currentColor" stroke="none" />
    </g>
  ),
  horse: (
    <g>
      <path d="M22 50 C 24 36 24 27 33 22 C 39 19 47 22 46 28 C 46 32 42 33 42 37 L46 44" />
      <path d="M31 23 C 25 26 23 34 25 46" />
      <path d="M35 21 L38 14 L41 20" />
      <circle cx="40" cy="28" r="1.4" fill="currentColor" stroke="none" />
    </g>
  ),
  octopus: (
    <g>
      <path d="M19 32 Q 32 14 45 32 Q 45 39 41 43 H23 Q 19 39 19 32 Z" />
      <g fill="currentColor" stroke="none"><circle cx="27" cy="31" r="1.7" /><circle cx="37" cy="31" r="1.7" /></g>
      <path d="M23 43 Q 18 50 13 50 M29 44 Q 26 52 21 54 M35 44 Q 38 52 43 54 M41 43 Q 46 50 51 50 M32 45 Q 32 53 32 55" />
    </g>
  ),

  // ── Landscapes ──
  mountain: (
    <g>
      <path d="M8 48 L24 22 L34 38 L40 30 L56 48 Z" />
      <path d="M19 30 L24 22 L29 30" />
    </g>
  ),
  ocean: <path d="M8 26 Q 14 20 20 26 T 32 26 T 44 26 T 56 26 M8 36 Q 14 30 20 36 T 32 36 T 44 36 M8 46 Q 14 40 20 46 T 32 46 T 44 46 T 56 46" />,
  forest: (
    <g>
      <path d="M14 46 L8 46 L14 32 L11 32 L16 20 L21 32 L18 32 L24 46 Z" />
      <path d="M40 48 L33 48 L40 30 L36 30 L42 16 L48 30 L44 30 L51 48 Z" />
      <path d="M16 46 v6 M42 48 v4" />
    </g>
  ),
  city: (
    <g>
      <path d="M10 50 V28 H22 V50 M22 50 V16 H36 V50 M36 50 V32 H52 V50" />
      <g fill="currentColor" stroke="none">
        <circle cx="16" cy="34" r="1.3" /><circle cx="16" cy="42" r="1.3" /><circle cx="29" cy="24" r="1.3" /><circle cx="29" cy="34" r="1.3" /><circle cx="44" cy="40" r="1.3" />
      </g>
    </g>
  ),
  meadow: (
    <g>
      <path d="M8 44 Q 20 34 32 42 Q 44 50 56 40" />
      <path d="M18 44 V34 M24 46 V36 M40 42 V32" />
      <circle cx="44" cy="22" r="5" />
      <path d="M44 12 v-3 M44 35 v3 M54 22 h3 M31 22 h3 M51 15 l2 -2 M37 29 l-2 2" />
    </g>
  ),
  desert: (
    <g>
      <circle cx="42" cy="22" r="6" />
      <path d="M8 46 Q 20 34 32 44 Q 42 51 56 42" />
      <path d="M12 52 Q 26 44 36 52" />
    </g>
  ),
  stars: (
    <g>
      <path d="M22 18 L24 25 L31 27 L24 29 L22 36 L20 29 L13 27 L20 25 Z" />
      <path d="M43 34 L44.5 39 L49 40 L44.5 41 L43 46 L41.5 41 L37 40 L41.5 39 Z" />
      <g fill="currentColor" stroke="none"><circle cx="45" cy="20" r="1.5" /><circle cx="16" cy="44" r="1.5" /></g>
    </g>
  ),
  farm: (
    <g>
      <path d="M14 50 V30 L28 20 L42 30 V50 Z" />
      <path d="M24 50 V38 H32 V50" />
      <path d="M24 30 H32" />
      <path d="M46 50 V26 A3 3 0 0 1 52 26 V50 Z" />
    </g>
  ),
  harbor: (
    <g>
      <circle cx="32" cy="16" r="3.5" />
      <path d="M32 19 V48" />
      <path d="M24 30 H40" />
      <path d="M18 36 Q 32 54 46 36" />
      <path d="M18 36 l-4 2 M18 36 l1 4 M46 36 l4 2 M46 36 l-1 4" />
    </g>
  ),
  loft: (
    <g>
      <rect x="15" y="15" width="34" height="30" rx="2" />
      <path d="M21 39 L29 28 L35 35 L40 29 L44 39 Z" />
      <circle cx="24" cy="24" r="2.5" />
    </g>
  ),
  trail: (
    <g>
      <path d="M18 50 C 28 42 20 36 30 30 C 40 24 32 18 44 14" />
      <path d="M44 8 V20 M44 9 H52 L49 12.5 L52 16 H44" />
    </g>
  ),
  library: (
    <g>
      <rect x="17" y="40" width="30" height="8" rx="1" />
      <rect x="20" y="30" width="24" height="8" rx="1" />
      <rect x="16" y="20" width="26" height="8" rx="1" />
      <path d="M25 40 v8 M37 40 v8 M27 30 v8 M24 20 v8 M35 20 v8" />
    </g>
  ),

  // ── Elements ──
  fire: <path d="M32 12 C 40 22 45 28 41 38 C 45 35 47 31 47 31 C 51 43 43 53 32 53 C 21 53 13 44 18 33 C 20 37 23 37 25 35 C 22 26 30 22 32 12 Z" />,
  water: <path d="M32 12 C 42 28 47 35 43 44 C 39 53 25 53 21 44 C 17 35 22 28 32 12 Z" />,
  earth: (
    <g>
      <circle cx="32" cy="32" r="18" />
      <path d="M14 32 H50 M32 14 C 22 20 22 44 32 50 C 42 44 42 20 32 14" />
    </g>
  ),
  air: <path d="M12 24 H36 A6 6 0 1 0 30 18 M12 34 H44 A6 6 0 1 1 38 40 M12 44 H26" />,
  lightning: <path d="M35 10 L19 36 H29 L25 54 L45 26 H34 L39 10 Z" />,
  crystal: (
    <g>
      <path d="M20 26 L32 13 L44 26 L36 51 L28 51 Z" />
      <path d="M20 26 H44 M32 13 L28 51 M32 13 L36 51" />
    </g>
  ),

  // ── Objects ──
  compass: (
    <g>
      <circle cx="32" cy="32" r="18" />
      <path d="M32 18 L36 32 L32 46 L28 32 Z" />
      <path d="M32 18 L36 32 L28 32 Z" fill="currentColor" stroke="none" />
      <circle cx="32" cy="32" r="1.6" fill="currentColor" stroke="none" />
    </g>
  ),
  book: <path d="M32 22 C 26 18 16 18 11 20 V44 C 16 42 26 42 32 46 C 38 42 48 42 53 44 V20 C 48 18 38 18 32 22 Z M32 22 V46" />,
  brush: (
    <g>
      <path d="M45 13 L51 19 L31 39 L24 41 L23 40 L25 33 Z" />
      <path d="M24 41 Q 17 49 12 50 Q 13 45 21 38" />
      <path d="M29 35 L37 27" />
    </g>
  ),
  magnifier: (
    <g>
      <circle cx="28" cy="28" r="12" />
      <path d="M37 37 L50 50" />
    </g>
  ),
  megaphone: (
    <g>
      <path d="M14 28 L40 18 V46 L14 38 Z" />
      <path d="M40 24 Q 50 32 40 40" />
      <path d="M18 39 V47 H26 L22 37" />
    </g>
  ),
  wrench: <path d="M43 14 A9 9 0 0 0 30 25 A9 9 0 0 0 31 29 L15 45 A4 4 0 0 0 19 49 L35 33 A9 9 0 0 0 39 34 A9 9 0 0 0 50 21 L44 27 L37 24 L40 17 Z" />,
  telescope: (
    <g>
      <path d="M16 40 L40 16 L48 24 L24 48 Z" />
      <path d="M20 44 L16 52 M44 28 L52 32" />
      <path d="M30 26 L38 34" />
    </g>
  ),
  camera: (
    <g>
      <rect x="11" y="22" width="42" height="27" rx="3" />
      <path d="M21 22 L24 16 H32 L35 22" />
      <circle cx="32" cy="35" r="8" />
      <circle cx="46" cy="28" r="1.6" fill="currentColor" stroke="none" />
    </g>
  ),
  toolbox: (
    <g>
      <rect x="13" y="28" width="38" height="21" rx="2" />
      <path d="M23 28 V24 H41 V28" />
      <path d="M23 24 Q 32 19 41 24" />
      <path d="M13 37 H51" />
      <rect x="28" y="33" width="8" height="8" rx="1" />
    </g>
  ),
  abacus: (
    <g>
      <rect x="13" y="17" width="38" height="30" rx="2" />
      <path d="M13 27 H51 M13 37 H51" />
      <g fill="currentColor" stroke="none">
        <circle cx="21" cy="22" r="2.6" /><circle cx="29" cy="22" r="2.6" /><circle cx="43" cy="22" r="2.6" />
        <circle cx="19" cy="32" r="2.6" /><circle cx="35" cy="32" r="2.6" /><circle cx="43" cy="32" r="2.6" />
        <circle cx="21" cy="42" r="2.6" /><circle cx="29" cy="42" r="2.6" /><circle cx="37" cy="42" r="2.6" />
      </g>
    </g>
  ),
  mic: (
    <g>
      <rect x="26" y="12" width="12" height="23" rx="6" />
      <path d="M20 30 A12 12 0 0 0 44 30 M32 42 V49 M25 50 H39" />
    </g>
  ),
  map: (
    <g>
      <path d="M13 20 L26 16 L38 20 L51 16 V44 L38 48 L26 44 L13 48 Z" />
      <path d="M26 16 V44 M38 20 V48" />
      <circle cx="33" cy="30" r="3" />
    </g>
  ),

  // ── Sound ──
  drum: (
    <g>
      <path d="M16 26 A16 6 0 0 0 48 26 V40 A16 6 0 0 1 16 40 Z" />
      <path d="M16 26 A16 6 0 0 1 48 26" />
      <path d="M20 20 L34 32 M44 20 L30 32" />
    </g>
  ),
  sax: (
    <g>
      <path d="M24 12 L31 15" />
      <path d="M31 15 L30 26 Q 30 40 41 43 Q 52 46 50 33 Q 49 29 44 31" />
      <g fill="currentColor" stroke="none"><circle cx="30.5" cy="22" r="1.4" /><circle cx="31.5" cy="30" r="1.4" /><circle cx="35" cy="38" r="1.4" /></g>
    </g>
  ),
  violin: (
    <g>
      <path d="M25 46 C 16 42 19 31 27 31 C 30 22 40 22 42 31 C 50 33 48 46 39 47 C 37 53 27 53 25 46 Z" />
      <path d="M40 30 L52 15" />
      <path d="M29 36 v6 M39 35 v6" />
    </g>
  ),
  headphones: <path d="M14 36 A18 18 0 0 1 50 36 M14 36 V44 A4 4 0 0 0 22 44 V38 M50 36 V44 A4 4 0 0 1 42 44 V38" />,
  guitar: (
    <g>
      <path d="M33 33 L50 15 L52 13 M46 16 L49 19" />
      <ellipse cx="26" cy="40" rx="13" ry="11" />
      <circle cx="28" cy="40" r="3.5" />
    </g>
  ),

  // ── Games ──
  chess: (
    <g>
      <circle cx="32" cy="20" r="5" />
      <path d="M28 24 L26 34 H38 L36 24" />
      <path d="M25 34 H39 L42 46 H22 Z" />
    </g>
  ),
  jigsaw: <path d="M18 18 H29 A3.5 3.5 0 0 1 35 18 H46 V29 A3.5 3.5 0 0 1 46 35 V46 H35 A3.5 3.5 0 0 0 29 46 H18 V35 A3.5 3.5 0 0 0 18 29 Z" />,
  masks: (
    <g>
      <path d="M12 20 Q 24 16 27 22 Q 28 36 20 42 Q 11 38 11 28 Z" />
      <g fill="currentColor" stroke="none"><circle cx="16" cy="26" r="1.3" /><circle cx="22" cy="26" r="1.3" /></g>
      <path d="M16 34 Q 19 37 23 34" />
      <path d="M37 24 Q 49 20 52 26 Q 53 40 45 46 Q 36 42 36 32 Z" />
      <g fill="currentColor" stroke="none"><circle cx="41" cy="30" r="1.3" /><circle cx="47" cy="30" r="1.3" /></g>
      <path d="M41 40 Q 44 37 48 40" />
    </g>
  ),
  runner: (
    <g>
      <circle cx="38" cy="15" r="4" />
      <path d="M35 21 L28 28 L18 26" />
      <path d="M31 25 L38 31 L34 41" />
      <path d="M38 31 L46 34 L44 24" />
      <path d="M34 41 L27 49 M34 41 L40 47" />
    </g>
  ),
  cards: (
    <g>
      <rect x="14" y="22" width="18" height="26" rx="2.5" transform="rotate(-12 23 35)" />
      <rect x="30" y="18" width="18" height="26" rx="2.5" transform="rotate(9 39 31)" />
      <path d="M40 27 Q 43 23 45 27 Q 46 31 40 34 Q 34 31 35 27 Q 37 23 40 27 Z" fill="currentColor" stroke="none" />
    </g>
  ),
  blocks: (
    <g>
      <path d="M14 30 L24 24 L34 30 L24 36 Z M14 30 V40 L24 46 V36 M34 30 V40 L24 46" />
      <path d="M34 20 L44 14 L54 20 L44 26 Z M34 20 V30 L44 36 V26 M54 20 V30 L44 36" />
    </g>
  ),

  // ── Materials ──
  clay: (
    <g>
      <path d="M25 18 H39 L37 25 Q 46 31 44 41 Q 42 50 32 50 Q 22 50 20 41 Q 18 31 27 25 Z" />
      <path d="M27 25 H37" />
    </g>
  ),
  steel: (
    <g>
      <path d="M16 18 H48 M16 46 H48 M22 18 V46 M42 18 V46" />
      <path d="M22 32 H42" />
    </g>
  ),
  glass: (
    <g>
      <path d="M20 15 H44 L40 50 H24 Z" />
      <path d="M22 27 H42" />
    </g>
  ),
  wood: (
    <g>
      <rect x="14" y="24" width="36" height="16" rx="2" />
      <circle cx="24" cy="32" r="6" /><circle cx="24" cy="32" r="2.5" />
      <path d="M38 26 V38 M44 26 V38" />
    </g>
  ),
  fabric: (
    <g>
      <path d="M14 24 Q 22 18 30 24 T 46 24 V30 Q 38 36 30 30 T 14 30 Z" />
      <path d="M14 36 Q 22 30 30 36 T 46 36 V42 Q 38 48 30 42 T 14 42 Z" />
    </g>
  ),
  stone: (
    <g>
      <path d="M12 44 Q 10 30 24 30 Q 30 22 40 28 Q 52 28 50 42 Z" />
      <path d="M38 44 Q 38 36 46 36 Q 54 36 52 46" />
    </g>
  ),

  // ── Motion ──
  flag: (
    <g>
      <path d="M22 12 V52" />
      <path d="M22 15 H48 V33 H22" />
      <g fill="currentColor" stroke="none">
        <rect x="22" y="15" width="6.5" height="6" /><rect x="35" y="15" width="6.5" height="6" />
        <rect x="28.5" y="21" width="6.5" height="6" /><rect x="41.5" y="21" width="6.5" height="6" />
        <rect x="22" y="27" width="6.5" height="6" /><rect x="35" y="27" width="6.5" height="6" />
      </g>
    </g>
  ),
  climb: (
    <g>
      <path d="M10 52 L26 36 L34 44 L52 24" />
      <path d="M52 24 H42 M52 24 V34" />
    </g>
  ),
  dance: (
    <g>
      <circle cx="34" cy="15" r="4" />
      <path d="M34 19 Q 27 25 20 22" />
      <path d="M34 19 L37 33" />
      <path d="M37 33 Q 46 33 48 26" />
      <path d="M37 33 L30 49 M37 33 L45 45" />
    </g>
  ),
  dive: (
    <g>
      <path d="M32 10 V34 M25 27 L32 36 L39 27" />
      <path d="M10 46 Q 17 40 24 46 T 38 46 T 54 46" />
    </g>
  ),
  boot: (
    <g>
      <path d="M23 13 H31 V33 H42 Q 50 33 50 42 V48 H23 Z" />
      <path d="M23 48 H52" />
    </g>
  ),
  parachute: (
    <g>
      <path d="M11 30 A21 15 0 0 1 53 30 Z" />
      <path d="M11 30 L32 46 L53 30 M24 30 L32 46 M40 30 L32 46" />
      <path d="M32 46 V51 M28 55 H36" />
    </g>
  ),
};
