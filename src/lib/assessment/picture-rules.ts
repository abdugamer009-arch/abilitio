import type { PictureGlyph, PictureFigure, PictureItem, PictureText } from "./picture-types";

/** Authoring model. Keep rule metadata out of public drawing DTOs. */
export type RuleFigure = PictureFigure & {
  dotOutside?: boolean;
  dotSide?: string;
  semantic?: string;
  start?: number;
  step?: number;
  two?: boolean;
  kinds?: string[];
  fills?: string[];
  premises?: string;
  normals?: number[][];
};
export type PictureProposal = {
  id: string;
  slot: number;
  version: string;
  type: string;
  difficulty: PictureItem["difficulty"];
  ageGroup: string;
  scored: boolean;
  questionLine: PictureText;
  figureData: RuleFigure;
  options: { id: string; value: RuleFigure }[];
  correctAnswerId: string;
  ruleExplanation: string;
  wrongAnswerExplanations: Record<string, string>;
};
const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);
export function normalizeCells(cells: number[][]): number[][] {
  const x = Math.min(...cells.map((c) => c[0])),
    y = Math.min(...cells.map((c) => c[1]));
  return cells.map(([a, b]) => [a - x, b - y]).sort((a, b) => a[1] - b[1] || a[0] - b[0]);
}
export function turnCells(cells: number[][], turns: number): number[][] {
  let c = cells;
  for (let i = 0; i < turns; i++) c = c.map(([x, y]) => [-y, x]);
  return normalizeCells(c);
}
const negate = (a: number[]) => a.map((x) => -x);
export const cross = (a: number[], b: number[]) => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const dot = (a: number[], b: number[]) => a.reduce((s, x, i) => s + x * b[i], 0);
export function foldNet(cells: number[][]): number[][] {
  const key = ([x, y]: number[]) => `${x},${y}`;
  const bases = new Map<string, { r: number[]; u: number[]; n: number[] }>();
  bases.set(key(cells[0]), { r: [1, 0, 0], u: [0, 1, 0], n: [0, 0, 1] });
  const queue = [cells[0]];
  while (queue.length) {
    const [x, y] = queue.shift()!,
      b = bases.get(key([x, y]))!;
    for (const [dx, dy] of [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ]) {
      const p = [x + dx, y + dy],
        k = key(p);
      if (!cells.some((c) => key(c) === k) || bases.has(k)) continue;
      const nb =
        dx === 1
          ? { r: negate(b.n), u: b.u, n: b.r }
          : dx === -1
            ? { r: b.n, u: b.u, n: negate(b.r) }
            : dy === 1
              ? { r: b.r, u: b.n, n: negate(b.u) }
              : { r: b.r, u: negate(b.n), n: b.u };
      bases.set(k, nb);
      queue.push(p);
    }
  }
  if (bases.size !== 6 || new Set([...bases.values()].map((b) => JSON.stringify(b.n))).size !== 6)
    throw new Error("Invalid cube net");
  return cells.map((c) => bases.get(key(c))!.n);
}
export function validCubeView(normals: number[][], faces: number[]): boolean {
  return (
    faces.length === 3 &&
    faces.every((i) => Number.isInteger(i) && i >= 0 && i < 6) &&
    dot(cross(normals[faces[0]], normals[faces[1]]), normals[faces[2]]) === 1
  );
}
/** Independent rule predicates reject distractors; never equate validity with the saved key. */
export function solvePicture(q: PictureProposal): string[] {
  const f = q.figureData;
  return q.options
    .filter(({ value: v }) => {
      if (q.type === "odd") return v.dotOutside === true;
      if (q.type === "series")
        return v.rotation === (((f.start! + f.step! * 4) % 4) + 4) % 4 && v.fill === "black";
      if (q.type === "grid")
        return v.kind === f.kinds![f.two ? 1 : 2] && v.fill === (f.two ? f.fills![0] : "white");
      if (q.type === "turned")
        return [0, 1, 2, 3].some((n) => same(turnCells(f.cells!, n), normalizeCells(v.cells!)));
      if (q.type === "net") return validCubeView(foldNet(f.netCells!), v.faces!);
      if (q.type === "cube") {
        const faces = f.faces!;
        return [0, 1, 2].some((i) =>
          same(v.faces, [faces[i], faces[(i + 1) % 3], faces[(i + 2) % 3]]),
        );
      }
      if (q.type === "logic") {
        const possible: boolean[] = [];
        for (const member of [false, true])
          for (const attribute of [false, true]) {
            if (!member) continue; // The hypothetical object is in the first set, hence the second.
            if (f.premises === "none-striped" && attribute) continue;
            if (f.premises === "all-dotted" && !attribute) continue;
            possible.push(f.premises === "all-dotted" ? !attribute : attribute);
          }
        return v.semantic === (possible.some(Boolean) ? "yes" : "no");
      }
      return false;
    })
    .map((o) => o.id);
}

/** Whitelist drawn structure. Exclude generator steps, predicates, normals and keys. */
export function publicGlyph(g: RuleFigure): PictureGlyph {
  const result: PictureGlyph = { kind: g.kind };
  for (const k of ["fill", "rotation", "marker", "faces", "symbols", "text"] as const) {
    const value = g[k];
    if (value !== undefined) Object.assign(result, { [k]: value });
  }
  if (g.kind === "cells") result.cells = normalizeCells(g.cells!);
  if (g.dotOutside !== undefined) {
    const distance = g.dotOutside ? 39 : 0;
    result.dot = {
      x: 50 + (g.dotSide === "left" ? -distance : g.dotSide === "right" ? distance : 0),
      y: 50 + (g.dotSide === "bottom" ? distance : 0),
    };
  }
  return result;
}
export function publicFigure(g: RuleFigure): PictureFigure {
  if (g.kind === "series")
    return {
      kind: "series",
      items: Array.from({ length: 4 }, (_, i) => ({
        kind: "dial",
        rotation: (((g.start! + g.step! * i) % 4) + 4) % 4,
        fill: g.two ? (i % 2 ? "white" : "black") : "black",
        marker: !!g.two,
      })),
    };
  if (g.kind === "grid")
    return {
      kind: "grid",
      tiles: Array.from({ length: 9 }, (_, i) =>
        i === 8
          ? null
          : {
              kind: g.kinds![g.two ? (Math.floor(i / 3) + (i % 3)) % 3 : Math.floor(i / 3)],
              fill: (g.two
                ? g.fills![(2 * Math.floor(i / 3) + (i % 3)) % 3]
                : "white") as PictureGlyph["fill"],
            },
      ),
    };
  if (g.kind === "net") {
    foldNet(g.netCells!);
    return { kind: "net", symbols: g.symbols, netCells: g.netCells };
  }
  return publicGlyph(g);
}
export function publicPicture(q: PictureProposal): PictureItem {
  return {
    id: q.id,
    slot: q.slot,
    version: q.version,
    type: q.type,
    difficulty: q.difficulty,
    prompt: q.questionLine,
    figure: publicFigure(q.figureData),
    options: q.options.map((o) => ({
      id: o.id,
      figure: publicGlyph(o.value),
      label: o.value.text ?? { en: "Picture", ru: "Рисунок", uz: "Rasm" },
    })),
  };
}
