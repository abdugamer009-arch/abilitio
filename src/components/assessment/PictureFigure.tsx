import { memo } from "react";
import { useId } from "react";
import type {
  PictureFigure as Figure,
  PictureGlyph,
  PictureLanguage,
} from "@/lib/assessment/picture-types";

const ink = "#1d1b16";
import { figureDescription } from "@/lib/assessment/picture-descriptions";

export const PictureFigure = memo(function PictureFigure({
  figure: f,
  lang = "en",
  practice = false,
}: {
  figure: Figure;
  lang?: PictureLanguage;
  practice?: boolean;
}) {
  const hatch = `picture-${useId().replace(/:/g, "")}`;
  const fill = (v?: string) => (v === "black" ? ink : v === "hatched" ? `url(#${hatch})` : "#fff");
  if (
    practice &&
    f.fill !== "hatched" &&
    ["triangle", "diamond", "circle", "square"].includes(f.kind)
  ) {
    const dot = f.dot;
    const x = dot ? (dot.x > 75 ? 104 : dot.x < 25 ? 16 : 60) : 60;
    const y = dot ? (dot.y > 75 ? 104 : dot.y < 25 ? 16 : f.kind === "triangle" ? 70 : 60) : 60;
    return (
      <svg
        viewBox="0 0 120 120"
        className={`picture-svg picture-svg-${f.kind}`}
        role="img"
        aria-label={figureDescription(f, lang)}
      >
        <g stroke={ink} strokeWidth="4" strokeLinejoin="round" fill={fill(f.fill)}>
          {f.kind === "triangle" ? (
            <path d="M60 24L98 92H22Z" />
          ) : f.kind === "diamond" ? (
            <path d="M60 18L94 52L60 86L26 52Z" />
          ) : f.kind === "circle" ? (
            <circle cx="60" cy="60" r="35" />
          ) : (
            <rect x="28" y="28" width="64" height="64" rx="3" />
          )}
        </g>
        {dot && <circle cx={x} cy={y} r="7" fill={ink} />}
      </svg>
    );
  }
  function shape(g: PictureGlyph, x = 50, y = 50, s = 25) {
    const style = { fill: fill(g.fill) };
    const main =
      g.kind === "circle" ? (
        <circle cx={x} cy={y} r={s} {...style} />
      ) : g.kind === "triangle" ? (
        <path d={`M${x} ${y - s}L${x + s} ${y + s}H${x - s}Z`} {...style} />
      ) : g.kind === "diamond" ? (
        <path d={`M${x} ${y - s}L${x + s} ${y}L${x} ${y + s}L${x - s} ${y}Z`} {...style} />
      ) : (
        <rect x={x - s} y={y - s} width={s * 2} height={s * 2} rx="2" {...style} />
      );
    return (
      <>
        {main}
        {g.dot && <circle cx={g.dot.x} cy={g.dot.y} r={practice ? 7 : 5} fill={ink} />}
      </>
    );
  }
  function mark(symbol: string) {
    if (symbol === "dot") return <circle cx=".5" cy=".5" r=".18" fill={ink} stroke="none" />;
    if (symbol === "ring" || symbol === "ringdot")
      return (
        <>
          <circle
            cx=".5"
            cy=".5"
            r=".22"
            fill="white"
            strokeWidth="3"
            vectorEffect="non-scaling-stroke"
          />
          {symbol === "ringdot" && <circle cx=".5" cy=".5" r=".075" fill={ink} stroke="none" />}
        </>
      );
    if (symbol === "hatch")
      return (
        <>
          <rect
            x=".27"
            y=".27"
            width=".46"
            height=".46"
            fill="white"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M.28 .43L.43 .28M.28 .62L.62 .28M.40 .73L.73 .40M.59 .73L.73 .59"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />
        </>
      );
    return symbol === "diamond" ? (
      <path d="M.5 .23L.77 .5L.5 .77L.23 .5Z" fill={ink} stroke="none" />
    ) : (
      <rect x=".29" y=".29" width=".42" height=".42" fill={ink} stroke="none" />
    );
  }
  function glyph(g: PictureGlyph): React.ReactNode {
    if (g.kind === "dial") {
      const p = [
        [48, 32],
        [72, 56],
        [48, 80],
        [24, 56],
      ][g.rotation ?? 0];
      return (
        <>
          <circle cx="48" cy="56" r="29" fill="white" />
          <path d={`M48 56L${p[0]} ${p[1]}`} />
          <circle cx="48" cy="56" r="3" fill={ink} />
          {g.marker && <circle cx="83" cy="17" r="7" fill={fill(g.fill)} />}
        </>
      );
    }
    if (g.kind === "cells") {
      const cells = g.cells ?? [];
      const w = Math.max(...cells.map((c) => c[0])) + 1,
        h = Math.max(...cells.map((c) => c[1])) + 1,
        s = 70 / Math.max(w, h);
      return cells.map(([x, y], i) => (
        <rect
          key={i}
          x={(100 - w * s) / 2 + x * s}
          y={(100 - h * s) / 2 + y * s}
          width={s}
          height={s}
          fill="white"
        />
      ));
    }
    if (g.kind === "cube")
      return (
        <>
          <path d="M52 4L100 28L52 52L4 28Z" fill="white" />
          <path d="M4 28L52 52V108L4 84Z" fill="white" />
          <path d="M52 52L100 28V84L52 108Z" fill="white" />
          {[
            "matrix(48 24 48 -24 4 28)",
            "matrix(48 24 0 56 4 28)",
            "matrix(48 -24 0 56 52 52)",
          ].map((m, i) => (
            <g key={m} transform={m}>
              {mark(g.symbols?.[g.faces?.[i] ?? 0] ?? "dot")}
            </g>
          ))}
        </>
      );
    return shape(g);
  }
  if (f.kind === "text") return <span>{f.text?.[lang]}</span>;
  if (f.kind === "odd" || f.kind === "logic")
    return <p className="picture-figure-note">{figureDescription(f, lang)}</p>;
  let viewBox = "0 0 100 100",
    content: React.ReactNode = glyph(f);
  if (f.kind === "series") {
    viewBox = "0 0 540 102";
    content = (
      <>
        {f.items?.map((g, i) => (
          <g key={i} transform={`translate(${i * 108} 0)`}>
            <rect x="2" y="2" width="96" height="96" rx="14" fill="white" />
            {glyph(g)}
          </g>
        ))}
        <rect x="434" y="2" width="96" height="96" rx="14" fill="#ffd93d" strokeDasharray="7 6" />
        <text x="482" y="68" textAnchor="middle" stroke="none" fontSize="46" fontWeight="800">
          ?
        </text>
      </>
    );
  }
  if (f.kind === "grid") {
    viewBox = "0 0 300 300";
    content = f.tiles?.map((g, i) => (
      <g key={i} transform={`translate(${(i % 3) * 100} ${Math.floor(i / 3) * 100})`}>
        <rect x="2" y="2" width="96" height="96" rx="8" fill={g ? "white" : "#ffd93d"} />
        {g ? (
          shape(g)
        ) : (
          <text x="50" y="68" textAnchor="middle" fontSize="46" fontWeight="800" stroke="none">
            ?
          </text>
        )}
      </g>
    ));
  }
  if (f.kind === "net") {
    viewBox = "0 0 232 176";
    content = f.netCells?.map(([x, y], i) => (
      <g key={i} transform={`translate(${x * 56 + 4} ${y * 56 + 4})`}>
        <rect width="56" height="56" fill="white" />
        <g transform="scale(56)">{mark(f.symbols?.[i] ?? "dot")}</g>
      </g>
    ));
  }
  if (f.kind === "cube") viewBox = "0 0 104 112";
  const normalized = practice && f.kind !== "grid" && f.kind !== "series";
  return (
    <svg
      viewBox={normalized ? "0 0 120 120" : viewBox}
      className={`picture-svg picture-svg-${f.kind}`}
      role="img"
      aria-label={figureDescription(f, lang)}
    >
      <defs>
        <pattern
          id={hatch}
          width="7"
          height="7"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <rect width="7" height="7" fill="white" />
          <path d="M0 0V7" stroke={ink} strokeWidth="2" />
        </pattern>
      </defs>
      <g
        transform={
          normalized ? (f.kind === "dial" ? "translate(12 4)" : "translate(10 10)") : undefined
        }
        stroke={ink}
        strokeWidth={practice ? 4 : 3}
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        {content}
      </g>
    </svg>
  );
});
