/**
 * Component 10: sectionHeader
 * Full slide section divider header component (dark or light background).
 */

import { SlideElement, ShapeElement } from '../core/types';
import { defaultTheme, pxToInches, Theme } from '../design/theme';
import { textBox } from './text';

function hex(color: string): string {
  return color.replace(/^#/, '');
}

export interface SectionHeaderOptions {
  sectionNumber?: string | number;
  title: string;
  subtitle?: string;
  dark?: boolean;
  theme?: Theme;
}

export function sectionHeader(options: SectionHeaderOptions): SlideElement[] {
  const t = options.theme ?? defaultTheme;
  const elements: SlideElement[] = [];

  const isDark = options.dark ?? true; // Default dark section headers
  const ml = pxToInches(t.grid.marginLeft);
  const cw = pxToInches(t.layout.contentWidth);

  // Background tint shape if dark section
  if (isDark) {
    const bgShape: ShapeElement = {
      kind: 'shape',
      shapeType: 'rect',
      fill: hex(t.colors.dark),
      position: { x: 0, y: 0 },
      size: { w: t.canvas.widthInches, h: t.canvas.heightInches },
    };
    elements.push(bgShape);
  }

  let currentY = 2.4;

  // 1. Section Number / Eyebrow
  if (options.sectionNumber !== undefined) {
    const numText = typeof options.sectionNumber === 'number'
      ? `SECTION ${String(options.sectionNumber).padStart(2, '0')}`
      : options.sectionNumber.toUpperCase();

    elements.push(
      textBox({
        text: numText,
        x: ml,
        y: currentY,
        w: cw,
        h: 0.4,
        fontFace: t.typography.caption.fontFace,
        fontSize: t.typography.caption.fontSize + 2, // 14pt
        color: isDark ? t.colors.gold : t.colors.teal,
        bold: true,
        theme: t,
      })
    );
    currentY += 0.5;
  }

  // 2. Large Section Title
  elements.push(
    textBox({
      text: options.title,
      x: ml,
      y: currentY,
      w: cw,
      h: 1.3,
      fontFace: t.typography.display.fontFace,
      fontSize: t.typography.display.fontSize,
      color: isDark ? t.colors.white : t.colors.ink,
      bold: true,
      theme: t,
    })
  );
  currentY += 1.4;

  // 3. Subtitle / Description (optional)
  if (options.subtitle) {
    elements.push(
      textBox({
        text: options.subtitle,
        x: ml,
        y: currentY,
        w: cw * 0.8,
        h: 0.8,
        fontFace: t.typography.body.fontFace,
        fontSize: t.typography.section.fontSize - 4, // 24pt
        color: isDark ? t.colors.line : t.colors.slate,
        theme: t,
      })
    );
  }

  // Accent bar on section divider
  elements.push({
    kind: 'shape',
    shapeType: 'rect',
    fill: hex(isDark ? t.colors.teal : t.colors.blue),
    position: { x: ml, y: currentY + (options.subtitle ? 0.9 : 0.2) },
    size: { w: 1.5, h: 0.05 },
  });

  return elements;
}
