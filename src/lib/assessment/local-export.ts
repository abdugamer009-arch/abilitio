export type ExportSection = { heading: string; lines: string[] };
// Drawing uses the app's loaded fonts, including Cyrillic and Uzbek characters.
// The resulting raster pages are embedded locally: no result text is uploaded.
export function exportCanvas(width: number, height: number) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas is unavailable");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  return { canvas, ctx };
}
export function drawWrapped(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  width: number,
  lineHeight: number,
) {
  let line = "";
  let cursor = y;
  for (const word of text.split(/\s+/)) {
    if (line && ctx.measureText(`${line} ${word}`).width > width) {
      ctx.fillText(line, x, cursor);
      cursor += lineHeight;
      line = "";
    }
    // Very long unbroken names must still fit inside the page.
    for (const char of line ? ` ${word}` : word) {
      if (ctx.measureText(line + char).width > width) {
        ctx.fillText(line, x, cursor);
        cursor += lineHeight;
        line = "";
      }
      line += char;
    }
  }
  if (line) ctx.fillText(line, x, cursor);
  return cursor + lineHeight;
}
export async function makeReportPdf(title: string, sections: ExportSection[]): Promise<Blob> {
  await document.fonts.ready;
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({ unit: "px", format: [794, 1123], hotfixes: ["px_scaling"] });
  let page = exportCanvas(1588, 2246);
  let y = 140;
  let pageNumber = 1;
  const font =
    getComputedStyle(document.documentElement).getPropertyValue("--font-sans").trim() ||
    "sans-serif";
  function header() {
    page.ctx.fillStyle = "#c42d18";
    page.ctx.font = `700 42px ${font}`;
    page.ctx.fillText("abilitio.", 80, 75);
    page.ctx.fillStyle = "#242321";
    page.ctx.font = `600 30px ${font}`;
  }
  function flush() {
    page.ctx.fillStyle = "#4b4b49";
    page.ctx.font = `400 22px ${font}`;
    page.ctx.fillText(`Abilitio · ${pageNumber}`, 80, 2190);
    pdf.addImage(page.canvas.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, 794, 1123);
  }
  function next() {
    flush();
    pdf.addPage();
    page = exportCanvas(1588, 2246);
    pageNumber++;
    y = 140;
    header();
  }
  header();
  y = drawWrapped(page.ctx, title, 80, y, 1428, 44) + 30;
  for (const section of sections) {
    if (y > 1960) next();
    page.ctx.font = `700 30px ${font}`;
    y = drawWrapped(page.ctx, section.heading, 80, y, 1428, 40) + 14;
    page.ctx.font = `400 28px ${font}`;
    for (const line of section.lines) {
      // Split very long paragraphs before drawing, to prevent crossing the footer.
      const words = line.split(/\s+/);
      let piece = "";
      for (const word of words) {
        const candidate = piece ? piece + " " + word : word;
        if (page.ctx.measureText(candidate).width > 1428 && piece) {
          if (y > 2080) {
            next();
            page.ctx.font = `400 28px ${font}`;
          }
          page.ctx.fillText(piece, 80, y);
          y += 38;
          piece = word;
        } else piece = candidate;
      }
      if (piece) {
        if (y > 2080) {
          next();
          page.ctx.font = `400 28px ${font}`;
        }
        y = drawWrapped(page.ctx, piece, 80, y, 1428, 38);
      }
      y += 12;
    }
    y += 24;
  }
  flush();
  return pdf.output("blob");
}
export function downloadLocal(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
