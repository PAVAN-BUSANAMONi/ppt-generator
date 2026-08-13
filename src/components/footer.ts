/**
 * Component 8: footer
 * Page footer aligned with grid margins: horizontal line + presentation name + slide number.
 */

import { SlideElement, ShapeElement } from '../core/types';
import { defaultTheme, pxToInches, Theme } from '../design/theme';
import { textBox } from './text';

function hex(color: string): string {
  return color.replace(/^#/, '');
}

export interface FooterOptions {
  presentationName?: string;
  slideNumber?: number | string;
  totalSlides?: number;
  dark?: boolean;
  theme?: Theme;
}

export function footer(options: FooterOptions): SlideElement[] {
  const t = options.theme ?? defaultTheme;
  const elements: SlideElement[] = [];

  const ml = pxToInches(t.grid.marginLeft);
  const cw = pxToInches(t.layout.contentWidth);
  const footerY = pxToInches(t.canvas.height - t.grid.marginBottom);

  const isDark = options.dark ?? false;
  const lineColor = isDark ? t.colors.ink2 : t.colors.line;
  const textColor = isDark ? t.colors.line : t.colors.slate;

  // 1. Horizontal divider line
  const lineShape: ShapeElement = {
    kind: 'shape',
    shapeType: 'line',
    stroke: hex(lineColor),
    strokeWidth: 1,
    position: { x: ml, y: footerY },
    size: { w: cw, h: 0 },
  };
  elements.push(lineShape);

  // 2. Presentation Name (Left aligned)
  const presName = options.presentationName ?? 'Presentation Engine';
  elements.push(
    textBox({
      text: presName,
      x: ml,
      y: footerY + 0.08,
      w: cw * 0.7,
      h: 0.3,
      fontFace: t.typography.caption.fontFace,
      fontSize: t.typography.caption.fontSize,
      color: textColor,
      align: 'left',
      valign: 'top',
      theme: t,
    })
  );

  // 3. Slide Number (Right aligned)
  if (options.slideNumber !== undefined) {
    const numText = options.totalSlides
      ? `${options.slideNumber} / ${options.totalSlides}`
      : `${options.slideNumber}`;

    elements.push(
      textBox({
        text: numText,
        x: ml + cw * 0.7,
        y: footerY + 0.08,
        w: cw * 0.3,
        h: 0.3,
        fontFace: t.typography.caption.fontFace,
        fontSize: t.typography.caption.fontSize,
        color: textColor,
        align: 'right',
        valign: 'top',
        theme: t,
      })
    );
  }

  return elements;
}
