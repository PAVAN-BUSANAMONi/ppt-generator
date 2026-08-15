/**
 * Component 9: statCard
 * Key metric card featuring big statistic number, title label, and short explanation.
 */

import { SlideElement, ShapeElement } from '../core/types';
import { defaultTheme, pxToInches, Theme } from '../design/theme';
import { textBox } from './text';

function hex(color: string): string {
  return color.replace(/^#/, '');
}

export interface StatCardOptions {
  number: string;
  label: string;
  explanation?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  numberColor?: string;
  fill?: string;
  border?: string;
  dark?: boolean;
  theme?: Theme;
}

export function statCard(options: StatCardOptions): SlideElement[] {
  const t = options.theme ?? defaultTheme;
  const elements: SlideElement[] = [];

  const isDark = options.dark ?? false;
  const fill = options.fill ?? (isDark ? t.colors.dark : t.colors.mint2);
  const border = options.border ?? (isDark ? t.colors.ink2 : t.colors.line);
  const numColor = options.numberColor ?? (isDark ? t.colors.gold : t.colors.teal);
  const labelColor = isDark ? t.colors.white : t.colors.ink;
  const expColor = isDark ? t.colors.line : t.colors.slate;

  const isVeryCompact = options.height < 1.35;
  const isCompact = options.height < 3.0;

  // 1. Container shape
  const cardShape: ShapeElement = {
    kind: 'shape',
    shapeType: 'rounded-rect',
    fill: hex(fill),
    stroke: hex(border),
    strokeWidth: 1,
    rectRadius: pxToInches(t.shapes.cardRadius),
    shadow: isDark ? t.shadows.none : t.shadows.sm,
    position: { x: options.x, y: options.y },
    size: { w: options.width, h: options.height },
  };
  elements.push(cardShape);

  if (isVeryCompact) {
    // Horizontal Split Layout for compact stacked metric cards
    const pad = 0.12;
    const numWidth = Math.min(2.0, options.width * 0.35);
    const textX = options.x + numWidth + pad;
    const textW = options.width - numWidth - pad * 2;

    // Big Number on Left
    elements.push(
      textBox({
        text: options.number,
        x: options.x + pad,
        y: options.y + pad,
        w: numWidth,
        h: options.height - pad * 2,
        fontFace: t.typography.display.fontFace,
        fontSize: 24,
        color: numColor,
        bold: true,
        valign: 'middle',
        theme: t,
      })
    );

    // Label on Right (Top)
    elements.push(
      textBox({
        text: options.label,
        x: textX,
        y: options.y + pad,
        w: textW,
        h: 0.32,
        fontFace: t.typography.heading.fontFace,
        fontSize: 12.5,
        color: labelColor,
        bold: true,
        theme: t,
      })
    );

    // Explanation on Right (Bottom)
    if (options.explanation) {
      elements.push(
        textBox({
          text: options.explanation,
          x: textX,
          y: options.y + pad + 0.32,
          w: textW,
          h: options.height - pad * 2 - 0.32,
          fontFace: t.typography.body.fontFace,
          fontSize: 10,
          color: expColor,
          theme: t,
        })
      );
    }

    return elements;
  }

  const padding = isCompact ? 0.16 : pxToInches(t.spacing.md);
  const contentX = options.x + padding;
  const contentW = options.width - padding * 2;
  let currentY = options.y + padding;

  // 2. BIG NUMBER (Display font)
  const numFontSize = isCompact ? 36 : 46;
  const numH = isCompact ? 0.6 : 0.85;

  elements.push(
    textBox({
      text: options.number,
      x: contentX,
      y: currentY,
      w: contentW,
      h: numH,
      fontFace: t.typography.display.fontFace,
      fontSize: numFontSize,
      color: numColor,
      bold: true,
      valign: 'middle',
      theme: t,
    })
  );
  currentY += numH + (isCompact ? 0.04 : 0.08);

  // 3. Label (dynamic height based on length)
  const isLongLabel = options.label.length > 20;
  const labelFontSize = isCompact ? 14 : 18;
  const labelH = isLongLabel ? (isCompact ? 0.48 : 0.65) : (isCompact ? 0.32 : 0.42);

  elements.push(
    textBox({
      text: options.label,
      x: contentX,
      y: currentY,
      w: contentW,
      h: labelH,
      fontFace: t.typography.heading.fontFace,
      fontSize: labelFontSize,
      color: labelColor,
      bold: true,
      theme: t,
    })
  );
  currentY += labelH + (isCompact ? 0.04 : 0.08);

  // 4. Short Explanation (optional)
  if (options.explanation) {
    elements.push(
      textBox({
        text: options.explanation,
        x: contentX,
        y: currentY,
        w: contentW,
        h: isCompact ? 0.6 : 0.8,
        fontFace: t.typography.body.fontFace,
        fontSize: isCompact ? 11 : 13.5,
        color: expColor,
        theme: t,
      })
    );
  }

  return elements;
}
