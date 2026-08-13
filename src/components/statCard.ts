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

  const padding = pxToInches(t.spacing.md);
  const contentX = options.x + padding;
  const contentW = options.width - padding * 2;
  let currentY = options.y + padding;

  // 2. BIG NUMBER (Display font)
  elements.push(
    textBox({
      text: options.number,
      x: contentX,
      y: currentY,
      w: contentW,
      h: 0.9,
      fontFace: t.typography.display.fontFace,
      fontSize: 48,
      color: numColor,
      bold: true,
      valign: 'middle',
      theme: t,
    })
  );
  currentY += 0.95;

  // 3. Label
  elements.push(
    textBox({
      text: options.label,
      x: contentX,
      y: currentY,
      w: contentW,
      h: 0.4,
      fontFace: t.typography.heading.fontFace,
      fontSize: t.typography.heading.fontSize - 2, // 21pt
      color: labelColor,
      bold: true,
      theme: t,
    })
  );
  currentY += 0.45;

  // 4. Short Explanation (optional)
  if (options.explanation) {
    elements.push(
      textBox({
        text: options.explanation,
        x: contentX,
        y: currentY,
        w: contentW,
        h: options.height - (currentY - options.y) - padding,
        fontFace: t.typography.body.fontFace,
        fontSize: t.typography.caption.fontSize + 2, // 14pt
        color: expColor,
        valign: 'top',
        theme: t,
      })
    );
  }

  return elements;
}
