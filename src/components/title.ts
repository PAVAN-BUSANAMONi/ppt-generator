/**
 * Component 2: title
 * Header block producing eyebrow + title + optional subtitle with dynamic typography scaling.
 */

import { SlideElement } from '../core/types';
import { defaultTheme, pxToInches, Theme } from '../design/theme';
import { textBox } from './text';

export interface TitleOptions {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  x?: number;
  y?: number;
  w?: number;
  dark?: boolean;
  theme?: Theme;
}

export function title(options: TitleOptions): SlideElement[] {
  const t = options.theme ?? defaultTheme;
  const elements: SlideElement[] = [];

  const ml = options.x ?? pxToInches(t.grid.marginLeft);
  let currentY = options.y ?? pxToInches(t.grid.marginTop);
  const width = options.w ?? pxToInches(t.layout.contentWidth);

  const isDark = options.dark ?? false;
  const eyebrowColor = isDark ? t.colors.mint : t.colors.teal;
  const titleColor = isDark ? t.colors.white : t.colors.ink;
  const subtitleColor = isDark ? t.colors.line : t.colors.slate;

  // 1. Eyebrow
  if (options.eyebrow) {
    elements.push(
      textBox({
        text: options.eyebrow.toUpperCase(),
        x: ml,
        y: currentY,
        w: width,
        h: 0.35,
        fontFace: t.typography.caption.fontFace,
        fontSize: t.typography.caption.fontSize,
        color: eyebrowColor,
        bold: true,
        theme: t,
      })
    );
    currentY += 0.38;
  }

  // 2. Title with dynamic line count calculation
  const titleLen = options.title.length;
  let titleFontSize = 34;
  let titleH = 0.55;

  if (titleLen > 42) {
    titleFontSize = 26;
    titleH = 0.85;
  } else if (titleLen > 28) {
    titleFontSize = 28;
    titleH = 0.78;
  }

  elements.push(
    textBox({
      text: options.title,
      x: ml,
      y: currentY,
      w: width,
      h: titleH,
      fontFace: t.typography.title.fontFace,
      fontSize: titleFontSize,
      color: titleColor,
      bold: t.typography.title.bold,
      theme: t,
    })
  );
  currentY += titleH + 0.08;

  // 3. Subtitle (optional)
  if (options.subtitle) {
    elements.push(
      textBox({
        text: options.subtitle,
        x: ml,
        y: currentY,
        w: width,
        h: 0.45,
        fontFace: t.typography.body.fontFace,
        fontSize: 15,
        color: subtitleColor,
        theme: t,
      })
    );
  }

  return elements;
}
