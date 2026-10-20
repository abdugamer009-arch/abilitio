/** Public drawing instructions only. No answer keys, generation rules or scoring weights. */
export type PictureLanguage = "en" | "ru" | "uz";
export type PictureText = Record<PictureLanguage, string>;
export type PictureGlyph = {
  kind: string;
  fill?: "white" | "black" | "hatched";
  rotation?: number;
  marker?: boolean;
  dot?: { x: number; y: number };
  cells?: number[][];
  faces?: number[];
  symbols?: string[];
  text?: PictureText;
};
export type PictureFigure = PictureGlyph & {
  items?: PictureGlyph[];
  tiles?: (PictureGlyph | null)[];
  netCells?: number[][];
};
export type PictureItem = {
  id: string;
  slot: number;
  version: string;
  type: string;
  difficulty: "easy" | "medium" | "medium-hard" | "hard";
  prompt: PictureText;
  figure: PictureFigure;
  options: { id: string; figure: PictureGlyph; label: PictureText }[];
};
export const PICTURE_SET_VERSION = "picture-reasoning-v1";
export const LEGACY_SET_VERSION = "legacy-reasoning-v1";
