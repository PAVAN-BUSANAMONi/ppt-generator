/**
 * Archetype 1: titleSlide
 * Hero title slide — supports dark/light mode, title, subtitle, author, date, and optional visual panel.
 */

import { SlideDefinition, SlideElement } from '../core/types';
import { defaultTheme, pxToInches } from '../design/theme';
import { TitleSlideData } from './types';
import { textBox } from '../components/text';
import { footer } from '../components/footer';
import { imagePanel } from '../components/imagePanel';

function hex(color: string): string {
  return color.replace(/^#/, '');
}

export function renderTitleSlide(data: TitleSlideData): SlideDefinition {
  const t = data.theme ?? defaultTheme;
  const elements: SlideElement[] = [];

  const isDark = data.dark ?? true;
  const ml = pxToInches(t.grid.marginLeft);
  const cw = pxToInches(t.layout.contentWidth);

  // Background
  const bg = isDark ? hex(t.colors.dark) : hex(t.colors.off);

  const hasImage = Boolean(data.image);
  const textWidth = hasImage ? cw * 0.58 : cw;

  let currentY = 1.4;

  // Eyebrow
  if (data.eyebrow) {
    elements.push(
      textBox({
        text: data.eyebrow.toUpperCase(),
        x: ml,
        y: currentY,
        w: textWidth,
        h: 0.35,
        fontFace: t.typography.caption.fontFace,
        fontSize: t.typography.caption.fontSize + 2,
        color: isDark ? t.colors.gold : t.colors.teal,
        bold: true,
        theme: t,
      })
    );
    currentY += 0.42;
  }

  // Display Title with dynamic font size and calculated height
  const isLongTitle = data.title.length > 30;
  const titleFontSize = hasImage ? (isLongTitle ? 32 : 38) : (data.title.length > 45 ? 36 : 42);
  const charsPerLine = Math.max(12, Math.floor(textWidth / (titleFontSize * 0.062)));
  const titleLines = Math.max(1, Math.ceil(data.title.length / charsPerLine));
  const titleH = titleLines * (titleFontSize * 0.015 + 0.18);

  elements.push(
    textBox({
      text: data.title,
      x: ml,
      y: currentY,
      w: textWidth,
      h: titleH,
      fontFace: t.typography.display.fontFace,
      fontSize: titleFontSize,
      color: isDark ? t.colors.white : t.colors.ink,
      bold: true,
      theme: t,
    })
  );
  currentY += titleH + 0.15;

  // Subtitle
  if (data.subtitle) {
    elements.push(
      textBox({
        text: data.subtitle,
        x: ml,
        y: currentY,
        w: textWidth,
        h: 0.8,
        fontFace: t.typography.body.fontFace,
        fontSize: hasImage ? 16 : 18,
        color: isDark ? t.colors.line : t.colors.slate,
        theme: t,
      })
    );
    currentY += 0.85;
  }

  // Author & Date metadata
  if (data.author || data.date) {
    const metaStr = [data.author, data.date].filter(Boolean).join('  ·  ');
    elements.push(
      textBox({
        text: metaStr,
        x: ml,
        y: currentY + 0.10,
        w: textWidth,
        h: 0.4,
        fontFace: t.typography.small.fontFace,
        fontSize: 13,
        color: isDark ? t.colors.slate : t.colors.ink2,
        bold: true,
        theme: t,
      })
    );
  }

  // Image panel (right column if provided)
  if (hasImage) {
    elements.push(
      ...imagePanel({
        image: data.image,
        x: ml + cw * 0.62,
        y: 1.4,
        width: cw * 0.38,
        height: 5.0,
        frameColor: isDark ? t.colors.ink2 : t.colors.mint,
        theme: t,
      })
    );
  }

  // Footer
  elements.push(
    ...footer({
      presentationName: data.title,
      slideNumber: data.slideNumber,
      totalSlides: data.totalSlides,
      dark: isDark,
      theme: t,
    })
  );

  return {
    id: data.id,
    background: bg,
    elements,
    notes: data.notes,
  };
}
