/**
 * Component 4: bulletList
 * Bulleted list container supporting background, border, padding, and text styling.
 */

import { SlideElement, ShapeElement, TextElement, TextRun } from '../core/types';
import { defaultTheme, pxToInches, Theme } from '../design/theme';

function hex(color: string): string {
  return color.replace(/^#/, '');
}

export interface BulletListOptions {
  items: string[];
  x: number;
  y: number;
  w: number;
  h: number;
  fontSize?: number;
  color?: string;
  background?: string;
  border?: string;
  padding?: number;
  bulletColor?: string;
  theme?: Theme;
}

export function bulletList(options: BulletListOptions): SlideElement[] {
  const t = options.theme ?? defaultTheme;
  const elements: SlideElement[] = [];

  const paddingVal = options.padding ?? t.spacing.md;
  const paddingInches = pxToInches(paddingVal);

  // 1. Optional background card shape
  if (options.background || options.border) {
    const bgShape: ShapeElement = {
      kind: 'shape',
      shapeType: 'rounded-rect',
      fill: options.background ? hex(options.background) : undefined,
      stroke: options.border ? hex(options.border) : undefined,
      strokeWidth: options.border ? 1 : 0,
      rectRadius: pxToInches(t.shapes.softRadius),
      position: { x: options.x, y: options.y },
      size: { w: options.w, h: options.h },
    };
    elements.push(bgShape);
  }

  // 2. Formatted bullet runs
  const textX = options.x + (options.background || options.border ? paddingInches : 0);
  const textY = options.y + (options.background || options.border ? paddingInches : 0);
  const textW = options.w - (options.background || options.border ? paddingInches * 2 : 0);
  const textH = options.h - (options.background || options.border ? paddingInches * 2 : 0);

  const bulletColor = hex(options.bulletColor ?? t.colors.teal);

  const runs: TextRun[] = options.items.map((item) => ({
    text: item + '\n',
    options: {
      fontFace: t.typography.body.fontFace,
      fontSize: options.fontSize ?? t.typography.body.fontSize,
      color: hex(options.color ?? t.colors.ink),
      bullet: { code: '2022', color: bulletColor },
      lineSpacing: 22,
    },
  }));

  const listText: TextElement = {
    kind: 'text',
    content: runs,
    style: {
      fontFace: t.typography.body.fontFace,
      fontSize: options.fontSize ?? t.typography.body.fontSize,
      color: hex(options.color ?? t.colors.ink),
      valign: 'top',
    },
    position: { x: textX, y: textY },
    size: { w: textW, h: textH },
  };

  elements.push(listText);

  return elements;
}
