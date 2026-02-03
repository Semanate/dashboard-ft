/* eslint-disable @typescript-eslint/no-explicit-any */
export async function loadFont(
  fetchFn: typeof fetch,
  url: string
): Promise<Uint8Array> {
  const res = await fetchFn(url);
  if (!res.ok) {
    throw new Error(`No se pudo cargar la fuente: ${url}`);
  }

  const buffer = await res.arrayBuffer();
  return new Uint8Array(buffer);
}



export function wrapText(
  text: string,
  maxWidth: number,
  font: any,
  fontSize: number
): string[] {
  const words = text.split(' ');

  const lines: string[] = [];
  let line = '';

  for (const word of words) {
    const testLine = line ? `${line} ${word}` : word;

    if (font.widthOfTextAtSize(testLine, fontSize) <= maxWidth) {
      line = testLine;
    } else {
      lines.push(line);
      line = word;
    }
  }

  if (line) lines.push(line);
  return lines;
}

export function getTextHeight(
  text: string,
  maxWidth: number,
  font: any,
  fontSize: number,
  lineHeight = 14
): number {
  const lines = wrapText(text, maxWidth, font, fontSize);
  return lines.length * lineHeight;
}

export interface CardLayout {
  fontSizeLabel: number;
  fontSizeValue: number;
  lineHeight: number;
  columnWidth: number;
  paddingTop: number;
  paddingBottom: number;
  rowGap: number;
}

export function calculateCardHeight(
  rows: Array<{ left: string; right: string }>,
  font: any, // LibPDF font
  layout: CardLayout
) {
  let height = layout.paddingTop;

  rows.forEach((row) => {
    const leftHeight = getTextHeight(
      row.left,
      layout.columnWidth,
      font,
      layout.fontSizeValue,
      layout.lineHeight
    );

    const rightHeight = getTextHeight(
      row.right,
      layout.columnWidth,
      font,
      layout.fontSizeValue,
      layout.lineHeight
    );

    height += Math.max(leftHeight, rightHeight) + layout.rowGap;
  });

  return height + layout.paddingBottom;
}
