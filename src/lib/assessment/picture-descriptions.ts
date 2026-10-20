import type { PictureFigure as Figure, PictureLanguage } from "./picture-types";
const text = (lang: PictureLanguage, en: string, ru: string, uz: string) => ({ en, ru, uz })[lang];
export function figureDescription(f: Figure, lang: PictureLanguage): string {
  const names: Record<string, string> = {
    series: text(
      lang,
      "A row of pointer pictures followed by a missing picture.",
      "Ряд указателей и пропущенная картинка.",
      "Ko‘rsatkichlar qatori va yetishmayotgan rasm.",
    ),
    grid: text(
      lang,
      "A grid of shapes. The bottom-right tile is missing.",
      "Сетка фигур. Нижняя правая ячейка пропущена.",
      "Shakllar katagi. Pastki o‘ng katak yetishmaydi.",
    ),
    net: text(
      lang,
      "A flat net of connected squares bearing abstract marks.",
      "Развёртка из соединённых квадратов с условными знаками.",
      "Belgili kvadratlardan tuzilgan tekis yoyilma.",
    ),
    cube: text(
      lang,
      "A cube with a different mark on each visible face.",
      "Куб с разными знаками на видимых гранях.",
      "Ko‘rinadigan yoqlarida turli belgilar bo‘lgan kub.",
    ),
    cells: text(
      lang,
      "A connected shape made of square cells.",
      "Связная фигура из квадратных клеток.",
      "Kvadrat kataklardan tuzilgan tutash shakl.",
    ),
    dial: text(lang, "A circular pointer", "Круглый указатель", "Aylana ko‘rsatkich"),
    circle: text(lang, "A circle", "Круг", "Doira"),
    square: text(lang, "A square", "Квадрат", "Kvadrat"),
    diamond: text(lang, "A diamond", "Ромб", "Romb"),
    triangle: text(lang, "A triangle", "Треугольник", "Uchburchak"),
    odd: text(
      lang,
      "Compare the answer pictures below.",
      "Сравните картинки ответов ниже.",
      "Quyidagi javob rasmlarini solishtiring.",
    ),
    logic: text(
      lang,
      "Read the statements above.",
      "Прочитайте утверждения выше.",
      "Yuqoridagi fikrlarni o‘qing.",
    ),
  };
  let description = names[f.kind] ?? "";
  if (f.fill)
    description +=
      ". " +
      {
        white: text(lang, "White fill", "Белая заливка", "Oq rang"),
        black: text(lang, "Black fill", "Чёрная заливка", "Qora rang"),
        hatched: text(lang, "Hatched fill", "Штриховка", "Chiziqli to‘ldirish"),
      }[f.fill];
  if (f.kind === "dial")
    description +=
      ". " +
      [
        text(lang, "Points up", "Направлен вверх", "Yuqoriga yo‘nalgan"),
        text(lang, "Points right", "Направлен вправо", "O‘ngga yo‘nalgan"),
        text(lang, "Points down", "Направлен вниз", "Pastga yo‘nalgan"),
        text(lang, "Points left", "Направлен влево", "Chapga yo‘nalgan"),
      ][f.rotation ?? 0];
  if (f.dot)
    description +=
      ". " +
      text(lang, "A black dot at", "Чёрная точка:", "Qora nuqta:") +
      " " +
      (f.dot.x < 25
        ? text(lang, "the far left", "далеко слева", "eng chapda")
        : f.dot.x > 75
          ? text(lang, "the far right", "далеко справа", "eng o‘ngda")
          : f.dot.y > 75
            ? text(lang, "the bottom", "внизу", "pastda")
            : text(lang, "the centre", "в центре", "markazda"));
  if (f.kind === "series")
    description += " " + f.items?.map((g) => figureDescription(g, lang)).join("; ");
  if (f.kind === "grid")
    description +=
      " " +
      f.tiles
        ?.map((g) =>
          g
            ? figureDescription(g, lang)
            : text(lang, "Missing tile", "Пропущенная ячейка", "Yetishmayotgan katak"),
        )
        .join("; ");
  if (f.kind === "cells" && f.cells) {
    const cells = f.cells,
      w = Math.max(...cells.map((c) => c[0])) + 1,
      h = Math.max(...cells.map((c) => c[1])) + 1;
    description +=
      " " +
      text(
        lang,
        "Rows from top to bottom, cells from left to right:",
        "Ряды сверху вниз, клетки слева направо:",
        "Qatorlar yuqoridan pastga, kataklar chapdan o‘ngga:",
      ) +
      " " +
      Array.from({ length: h }, (_, y) =>
        Array.from({ length: w }, (_, x) =>
          cells.some((c) => c[0] === x && c[1] === y)
            ? text(lang, "filled", "занято", "to‘la")
            : text(lang, "empty", "пусто", "bo‘sh"),
        ).join(", "),
      ).join("; ");
  }
  const symbols: Record<string, string> = {
    dot: text(lang, "black dot", "чёрная точка", "qora nuqta"),
    ring: text(lang, "ring", "кольцо", "halqa"),
    ringdot: text(
      lang,
      "ring with central dot",
      "кольцо с точкой в центре",
      "markazida nuqtali halqa",
    ),
    diamond: text(lang, "black diamond", "чёрный ромб", "qora romb"),
    square: text(lang, "black square", "чёрный квадрат", "qora kvadrat"),
    hatch: text(lang, "hatched square", "штрихованный квадрат", "chiziqli kvadrat"),
  };
  if (f.kind === "cube")
    description +=
      " " +
      [
        text(lang, "Top", "Верх", "Yuqori"),
        text(lang, "Left", "Слева", "Chap"),
        text(lang, "Right", "Справа", "O‘ng"),
      ]
        .map((label, i) => `${label}: ${symbols[f.symbols?.[f.faces?.[i] ?? 0] ?? "dot"]}`)
        .join("; ");
  if (f.kind === "net")
    description +=
      " " +
      f.netCells
        ?.map(
          ([x, y], i) =>
            `${text(lang, "Row", "Ряд", "Qator")} ${y + 1}, ${text(lang, "column", "столбец", "ustun")} ${x + 1}: ${symbols[f.symbols?.[i] ?? "dot"]}`,
        )
        .join("; ");
  return description;
}
