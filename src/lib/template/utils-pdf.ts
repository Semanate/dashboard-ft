/* ================== CURSOR ================== */

import { PDF, rgb, type PDFPage } from '@libpdf/core';

export class Cursor {
  x = 50;
  y = 800;

  down(px: number) {
    this.y -= px;
  }

  resetX() {
    this.x = 50;
  }

  reset() {
    this.x = 50;
    this.y = 800;
  }
}

/* ================== THEME - Modern Corporate Design ================== */

export function rgb255(r: number, g: number, b: number) {
  return rgb(r / 255, g / 255, b / 255);
}

export const theme = {
  // Primary accent - Vibrant but professional orange
  primary: rgb255(235, 87, 35),
  primaryDark: rgb255(200, 70, 25),
  primaryLight: rgb255(255, 237, 230),
  primarySoft: rgb255(255, 245, 240),
  
  // Secondary colors
  secondary: rgb255(45, 55, 72),
  secondaryLight: rgb255(74, 85, 104),
  
  // Neutrals - Elegant grays
  white: rgb255(255, 255, 255),
  background: rgb255(250, 251, 252),
  cardBg: rgb255(255, 255, 255),
  cardBgAlt: rgb255(248, 250, 252),
  
  // Borders
  border: rgb255(226, 232, 240),
  borderLight: rgb255(237, 242, 247),
  borderAccent: rgb255(235, 87, 35),
  
  // Text
  text: rgb255(26, 32, 44),
  textSecondary: rgb255(113, 128, 150),
  textMuted: rgb255(160, 174, 192),
  textOnPrimary: rgb255(255, 255, 255),
  
  // Status colors
  success: rgb255(72, 187, 120),
  successBg: rgb255(240, 255, 244),
  warning: rgb255(237, 137, 54),
  warningBg: rgb255(255, 250, 240),
  danger: rgb255(245, 101, 101),
  dangerBg: rgb255(255, 245, 245),
  info: rgb255(66, 153, 225),
  infoBg: rgb255(235, 248, 255),
};

/* ================== PAGE DIMENSIONS ================== */

export const PAGE = {
  marginLeft: 50,
  marginRight: 50,
  marginTop: 50,
  marginBottom: 50,
  contentWidth: 495,
};

/* ================== HEADER ================== */

export function drawHeader(
  page: PDFPage,
  cursor: Cursor,
  options: {
    title: string;
    subtitle?: string;
    documentId?: string;
    font: any;
    fontBold?: any;
    logoImage?: any;
    logoWidth?: number;
    logoHeight?: number;
  }
) {
  const { title, subtitle, documentId, font, fontBold, logoImage, logoWidth = 80, logoHeight = 40 } = options;
  const effectiveFont = fontBold || font;
  
  const headerHeight = 85;
  
  // Accent bar on left
  page.drawRectangle({
    x: 0,
    y: cursor.y - headerHeight + 85,
    width: 6,
    height: headerHeight,
    color: theme.primary,
  });
  
  // Subtle background
  page.drawRectangle({
    x: 6,
    y: cursor.y - headerHeight + 85,
    width: page.width - 6,
    height: headerHeight,
    color: theme.primarySoft,
  });
  
  // Bottom separator line
  page.drawLine({
    start: { x: 50, y: cursor.y - headerHeight + 85 },
    end: { x: page.width - 50, y: cursor.y - headerHeight + 85 },
    thickness: 2,
    color: theme.primary,
  });
  
  // Logo (right side)
  if (logoImage) {
    page.drawImage(logoImage, {
      x: page.width - 50 - logoWidth,
      y: cursor.y - logoHeight + 60,
      width: logoWidth,
      height: logoHeight,
    });
  }
  
  // Title
  cursor.down(25);
  page.drawText(title, {
    x: 50,
    y: cursor.y,
    size: 22,
    font: effectiveFont,
    color: theme.secondary,
  });
  
  // Subtitle
  if (subtitle) {
    cursor.down(22);
    page.drawText(subtitle, {
      x: 50,
      y: cursor.y,
      size: 10,
      font,
      color: theme.textSecondary,
    });
  }
  
  // Document ID badge
  if (documentId) {
    const idText = `ID: ${documentId}`;
    const idWidth = font.widthOfTextAtSize(idText, 9) + 16;
    
    cursor.down(18);
    
    drawRoundedCard(page, 50, cursor.y + 12, idWidth, 20, 4, {
      borderWidth: 0,
      fillColor: theme.primary,
    });
    
    page.drawText(idText, {
      x: 58,
      y: cursor.y,
      size: 9,
      font,
      color: theme.textOnPrimary,
    });
  }
  
  cursor.down(30);
}

/* ================== SECTION DIVIDER ================== */

export function drawSectionDivider(
  page: PDFPage,
  cursor: Cursor,
  options?: {
    width?: number;
    style?: 'solid' | 'dashed' | 'gradient';
  }
) {
  const { width = PAGE.contentWidth, style = 'solid' } = options || {};
  
  cursor.down(10);
  
  if (style === 'dashed') {
    page.drawLine({
      start: { x: 50, y: cursor.y },
      end: { x: 50 + width, y: cursor.y },
      thickness: 1,
      color: theme.border,
      dashArray: [4, 4],
    });
  } else if (style === 'gradient') {
    page.drawLine({
      start: { x: 50, y: cursor.y },
      end: { x: 100, y: cursor.y },
      thickness: 2,
      color: theme.primary,
    });
    page.drawLine({
      start: { x: 100, y: cursor.y },
      end: { x: 50 + width, y: cursor.y },
      thickness: 1,
      color: theme.borderLight,
    });
  } else {
    page.drawLine({
      start: { x: 50, y: cursor.y },
      end: { x: 50 + width, y: cursor.y },
      thickness: 1,
      color: theme.border,
    });
  }
  
  cursor.down(15);
}

/* ================== MODERN CARD ================== */

export function drawModernCard(
  page: PDFPage,
  x: number,
  y: number,
  width: number,
  height: number,
  options?: {
    variant?: 'default' | 'elevated' | 'bordered' | 'accent' | 'highlight';
    accentPosition?: 'left' | 'top';
    accentColor?: ReturnType<typeof rgb>;
    backgroundColor?: ReturnType<typeof rgb>;
    radius?: number;
  }
) {
  const {
    variant = 'default',
    accentPosition = 'left',
    accentColor = theme.primary,
    backgroundColor = theme.cardBg,
    radius = 8,
  } = options || {};

  if (variant === 'elevated') {
    drawRoundedCard(page, x + 2, y - 2, width, height, radius, {
      fillColor: rgb255(0, 0, 0),
      borderWidth: 0,
    });
  }

  drawRoundedCard(page, x, y, width, height, radius, {
    fillColor: backgroundColor,
    borderColor: variant === 'bordered' ? theme.border : theme.borderLight,
    borderWidth: variant === 'bordered' ? 1.5 : 0.5,
  });

  if (variant === 'accent' || variant === 'highlight') {
    if (accentPosition === 'left') {
      page.drawRectangle({
        x: x,
        y: y - height,
        width: 4,
        height: height,
        color: accentColor,
      });
    } else {
      page.drawRectangle({
        x: x,
        y: y,
        width: width,
        height: 4,
        color: accentColor,
      });
    }
  }

  if (variant === 'highlight') {
    drawRoundedCard(page, x + 4, y, width - 4, height, radius, {
      fillColor: theme.primaryLight,
      borderWidth: 0,
    });
  }
}

/* ================== STATUS BADGE ================== */

export function drawBadge(
  page: PDFPage,
  x: number,
  y: number,
  text: string,
  font: any,
  options?: {
    type?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
    size?: 'sm' | 'md' | 'lg';
  }
) {
  const { type = 'primary', size = 'md' } = options || {};
  
  const sizes = {
    sm: { fontSize: 7, paddingX: 6, paddingY: 3, radius: 3 },
    md: { fontSize: 8, paddingX: 10, paddingY: 5, radius: 4 },
    lg: { fontSize: 10, paddingX: 14, paddingY: 6, radius: 5 },
  };
  
  const colors = {
    primary: { bg: theme.primary, text: theme.textOnPrimary },
    success: { bg: theme.success, text: theme.white },
    warning: { bg: theme.warning, text: theme.white },
    danger: { bg: theme.danger, text: theme.white },
    info: { bg: theme.info, text: theme.white },
    neutral: { bg: theme.border, text: theme.text },
  };
  
  const s = sizes[size];
  const c = colors[type];
  
  const textWidth = font.widthOfTextAtSize(text, s.fontSize);
  const badgeWidth = textWidth + s.paddingX * 2;
  const badgeHeight = s.fontSize + s.paddingY * 2;
  
  drawRoundedCard(page, x, y + s.paddingY, badgeWidth, badgeHeight, s.radius, {
    fillColor: c.bg,
    borderWidth: 0,
  });
  
  page.drawText(text, {
    x: x + s.paddingX,
    y: y,
    size: s.fontSize,
    font,
    color: c.text,
  });
  
  return badgeWidth;
}

/* ================== DRAW CARD (Legacy) ================== */

export function drawCard(
  page: PDFPage,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const top = y;
  const bottom = y - h;
  const right = x + w;

  page.drawLine({
    start: { x, y: top },
    end: { x: right, y: top },
    thickness: 1,
    color: theme.border,
  });

  page.drawLine({
    start: { x, y: bottom },
    end: { x: right, y: bottom },
    thickness: 1,
    color: theme.border,
  });

  page.drawLine({
    start: { x, y: top },
    end: { x, y: bottom },
    thickness: 1,
    color: theme.border,
  });

  page.drawLine({
    start: { x: right, y: top },
    end: { x: right, y: bottom },
    thickness: 1,
    color: theme.border,
  });
}

/* ================== SECTION TITLE ================== */

type Align = 'left' | 'center' | 'right';

export function sectionTitle(
  page: PDFPage,
  cursor: Cursor,
  title: string,
  font: any,
  size: number = 13,
  align: Align = 'left',
  options?: {
    color?: ReturnType<typeof rgb>;
    showAccent?: boolean;
    accentColor?: ReturnType<typeof rgb>;
  }
) {
  const { color = theme.secondary, showAccent = true, accentColor = theme.primary } = options || {};
  
  let x: number;
  const textWidth = font.widthOfTextAtSize(title, size);

  switch (align) {
    case 'left':
      x = 50;
      break;
    case 'right':
      x = page.width - textWidth - 50;
      break;
    case 'center':
    default:
      x = (page.width - textWidth) / 2;
      break;
  }

  // Accent bar for left-aligned titles
  if (showAccent && align === 'left') {
    page.drawRectangle({
      x: 50,
      y: cursor.y - 3,
      width: 4,
      height: size + 6,
      color: accentColor,
    });
    x = 62;
  }

  page.drawText(title, {
    x,
    y: cursor.y,
    size,
    font,
    color,
  });

  cursor.down(size + 12);
}

export function drawAlignedImage(
  page: PDFPage,
  cursor: Cursor,
  image: any,
  options: {
    width: number;
    height: number;
    align?: Align;
    margin?: number;
    gapAfter?: number;
  }
) {
  const { width, height, align = 'center', margin = 50, gapAfter = 10 } = options;

  let x: number;

  switch (align) {
    case 'left':
      x = margin;
      break;
    case 'right':
      x = page.width - width - margin;
      break;
    case 'center':
    default:
      x = (page.width - width) / 2;
      break;
  }

  page.drawImage(image, {
    x,
    y: cursor.y - height,
    width,
    height,
  });

  cursor.down(height + gapAfter);
}

/* ================== FIELD ================== */

export function field(
  page: PDFPage,
  cursor: Cursor,
  label: string,
  value: string,
  font: any,
  options?: {
    labelSize?: number;
    valueSize?: number;
    labelColor?: ReturnType<typeof rgb>;
    valueColor?: ReturnType<typeof rgb>;
    fontBold?: any;
  }
) {
  const {
    labelSize = 8,
    valueSize = 10,
    labelColor = theme.textMuted,
    valueColor = theme.text,
    fontBold,
  } = options || {};

  // Label (uppercase for elegance)
  page.drawText(label.toUpperCase(), {
    x: cursor.x,
    y: cursor.y,
    size: labelSize,
    font,
    color: labelColor,
  });

  cursor.down(labelSize + 4);
  
  // Value
  page.drawText(value || '–', {
    x: cursor.x,
    y: cursor.y,
    size: valueSize,
    font: fontBold || font,
    color: valueColor,
  });

  cursor.down(valueSize + 14);
}

/* ================== PAGE FOOTER ================== */

export function drawPageFooter(
  page: PDFPage,
  options?: {
    pageNumber?: number;
    companyName?: string;
    font?: any;
  }
) {
  const { pageNumber, companyName = 'Documento Confidencial', font } = options || {};
  
  page.drawLine({
    start: { x: 50, y: 40 },
    end: { x: page.width - 50, y: 40 },
    thickness: 0.5,
    color: theme.border,
  });
  
  if (font) {
    page.drawText(companyName, {
      x: 50,
      y: 25,
      size: 8,
      font,
      color: theme.textMuted,
    });
    
    if (pageNumber !== undefined) {
      const pageText = `Página ${pageNumber}`;
      const textWidth = font.widthOfTextAtSize(pageText, 8);
      page.drawText(pageText, {
        x: page.width - 50 - textWidth,
        y: 25,
        size: 8,
        font,
        color: theme.textMuted,
      });
    }
  }
}

/* ================== SIGNATURE BLOCK ================== */

export function drawSignatureBlock(
  page: PDFPage,
  cursor: Cursor,
  options: {
    signatureImage?: any;
    name: string;
    document?: string;
    title?: string;
    font: any;
    width?: number;
    height?: number;
  }
) {
  const { signatureImage, name, document, title = 'Firma', font, width = 180, height = 70 } = options;
  
  drawRoundedCard(page, cursor.x, cursor.y, width + 40, height + 60, 8, {
    borderColor: theme.border,
    borderWidth: 1,
    fillColor: theme.cardBgAlt,
  });
  
  cursor.down(15);
  cursor.x += 20;
  
  page.drawText(title.toUpperCase(), {
    x: cursor.x,
    y: cursor.y,
    size: 8,
    font,
    color: theme.textMuted,
  });
  
  cursor.down(10);
  
  if (signatureImage) {
    page.drawImage(signatureImage, {
      x: cursor.x,
      y: cursor.y - height,
      width,
      height,
    });
    cursor.down(height + 5);
  }
  
  page.drawLine({
    start: { x: cursor.x, y: cursor.y },
    end: { x: cursor.x + width, y: cursor.y },
    thickness: 1,
    color: theme.border,
  });
  
  cursor.down(12);
  
  page.drawText(name, {
    x: cursor.x,
    y: cursor.y,
    size: 9,
    font,
    color: theme.text,
  });
  
  cursor.down(12);
  
  if (document) {
    page.drawText(document, {
      x: cursor.x,
      y: cursor.y,
      size: 8,
      font,
      color: theme.textSecondary,
    });
  }
  
  cursor.x = 50;
}

/* ================== TWO COLUMNS ================== */

export function twoCols(
  page: PDFPage,
  cursor: Cursor,
  left: () => number | void,
  right: () => number | void,
  options?: {
    leftWidth?: number;
    gap?: number;
  }
) {
  const { leftWidth = 220, gap = 30 } = options || {};
  const startY = cursor.y;

  // Left column
  cursor.x = 70;
  const leftStartY = cursor.y;
  const leftHeight = left() ?? leftStartY - cursor.y;
  const leftEndY = leftStartY - leftHeight;

  // Right column
  cursor.y = startY;
  cursor.x = 70 + leftWidth + gap;
  const rightStartY = cursor.y;
  const rightHeight = right() ?? rightStartY - cursor.y;
  const rightEndY = rightStartY - rightHeight;

  // Reset cursor
  cursor.x = 50;
  cursor.y = Math.min(leftEndY, rightEndY) - 5;
}

/* ================== THREE COLUMNS ================== */

export function threeCols(
  page: PDFPage,
  cursor: Cursor,
  col1: () => void,
  col2: () => void,
  col3: () => void
) {
  const startY = cursor.y;
  const colWidth = 145;

  cursor.x = 70;
  col1();
  const end1 = cursor.y;

  cursor.y = startY;
  cursor.x = 70 + colWidth;
  col2();
  const end2 = cursor.y;

  cursor.y = startY;
  cursor.x = 70 + colWidth * 2;
  col3();
  const end3 = cursor.y;

  cursor.x = 50;
  cursor.y = Math.min(end1, end2, end3) - 5;
}

export function ensurePageSpace(
  pdf: PDF,
  page: PDFPage,
  cursor: Cursor,
  requiredHeight: number
) {
  const BOTTOM_MARGIN = 60;
  const TOP_MARGIN = 50;

  if (cursor.y - requiredHeight < BOTTOM_MARGIN) {
    const newPage = pdf.addPage({ size: 'a4' });
    cursor.reset();
    cursor.down(TOP_MARGIN);
    return newPage;
  }

  return page;
}

export function drawVerificationBlock(
  page: PDFPage,
  title: string,
  block: any,
  cursor: Cursor,
  font: any,
  pdf: PDF
) {
  page = ensurePageSpace(pdf, page, cursor, 120);
  sectionTitle(page, cursor, title, font);

  field(page, cursor, 'Nombre', block.name, font);
  field(page, cursor, 'Fecha', `${block.date} ${block.time}`, font);
  field(page, cursor, 'Autorizado', block.auth == true ? 'Autorizado' : 'No Autorizado', font);
  cursor.down(10);
}

export function drawRoundedCard(
  page: PDFPage,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number = 8,
  options?: {
    borderWidth?: number;
    borderColor?: ReturnType<typeof rgb>;
    fillColor?: ReturnType<typeof rgb>;
  }
) {
  const { borderWidth = 1, borderColor = theme.border, fillColor } = options || {};

  const r = Math.min(radius, width / 2, height / 2);

  const top = y;
  const bottom = y - height;
  const right = x + width;
  const left = x;

  const path = page.drawPath();

  path.moveTo(left + r, top);
  path.lineTo(right - r, top);
  path.quadraticCurveTo(right, top, right, top - r);
  path.lineTo(right, bottom + r);
  path.quadraticCurveTo(right, bottom, right - r, bottom);
  path.lineTo(left + r, bottom);
  path.quadraticCurveTo(left, bottom, left, bottom + r);
  path.lineTo(left, top - r);
  path.quadraticCurveTo(left, top, left + r, top);
  path.close();

  if (fillColor) {
    path.fillAndStroke({
      color: fillColor,
      borderColor,
      borderWidth,
    });
  } else if (borderWidth > 0) {
    path.stroke({
      borderColor,
      borderWidth,
    });
  }
}

/* ================== HIGHLIGHT BOX ================== */

export function drawHighlightBox(
  page: PDFPage,
  cursor: Cursor,
  text: string,
  font: any,
  options?: {
    type?: 'info' | 'warning' | 'success' | 'danger';
    width?: number;
  }
) {
  const { type = 'info', width = PAGE.contentWidth } = options || {};
  
  const colors = {
    info: { bg: theme.infoBg, accent: theme.info },
    warning: { bg: theme.warningBg, accent: theme.warning },
    success: { bg: theme.successBg, accent: theme.success },
    danger: { bg: theme.dangerBg, accent: theme.danger },
  };
  
  const c = colors[type];
  const padding = 12;
  const textHeight = 12;
  const boxHeight = textHeight + padding * 2;
  
  // Background
  drawRoundedCard(page, 50, cursor.y + padding, width, boxHeight, 6, {
    fillColor: c.bg,
    borderWidth: 0,
  });
  
  // Accent bar
  page.drawRectangle({
    x: 50,
    y: cursor.y + padding - boxHeight,
    width: 4,
    height: boxHeight,
    color: c.accent,
  });
  
  // Text
  page.drawText(text, {
    x: 50 + padding + 4,
    y: cursor.y,
    size: 10,
    font,
    color: theme.text,
  });
  
  cursor.down(boxHeight + 10);
}
