/**
 * Archetype 13: conclusionSlide
 * Conclusion & call to action slide — dark or light theme synthesis.
 */

import { SlideDefinition, SlideElement } from '../core/types';
import { defaultTheme, pxToInches } from '../design/theme';
import { ConclusionSlideData } from './types';
import { textBox } from '../components/text';
import { card } from '../components/card';
import { footer } from '../components/footer';

function hex(color: string): string {
  return color.replace(/^#/, '');
}

export function renderConclusionSlide(data: ConclusionSlideData): SlideDefinition {
  const t = data.theme ?? defaultTheme;
  const elements: SlideElement[] = [];

  const isDark = data.dark ?? true;
  const ml = pxToInches(t.grid.marginLeft);
  const cw = pxToInches(t.layout.contentWidth);

  // Background
  const bg = isDark ? hex(t.colors.dark) : hex(t.colors.off);

  let currentY = 0.85;

  // Eyebrow
  elements.push(
    textBox({
      text: (data.eyebrow ?? 'CONCLUSION & NEXT STEPS').toUpperCase(),
      x: ml,
      y: currentY,
      w: cw,
      h: 0.35,
      fontFace: t.typography.caption.fontFace,
      fontSize: t.typography.caption.fontSize + 2,
      color: isDark ? t.colors.gold : t.colors.teal,
      bold: true,
      theme: t,
    })
  );
  currentY += 0.38;

  // Large Display Title (dynamic sizing for length)
  const titleLen = data.title.length;
  const titleFontSize = titleLen > 40 ? 28 : 34;
  const titleH = titleLen > 40 ? 0.75 : 0.65;

  elements.push(
    textBox({
      text: data.title,
      x: ml,
      y: currentY,
      w: cw,
      h: titleH,
      fontFace: t.typography.display.fontFace,
      fontSize: titleFontSize,
      color: isDark ? t.colors.white : t.colors.ink,
      bold: true,
      theme: t,
    })
  );
  currentY += titleH + 0.25;

  // Summary / Synthesis Card
  elements.push(
    ...card({
      x: ml,
      y: currentY,
      width: cw,
      height: 2.2,
      icon: 'CheckSquare',
      title: 'Synthesis',
      body: data.summaryText,
      accent: t.colors.teal,
      fill: isDark ? t.colors.ink2 : t.colors.white,
      border: isDark ? t.colors.teal : t.colors.line,
      dark: isDark,
      theme: t,
    })
  );
  currentY += 2.4;

  // Optional Call to Action Box
  if (data.finalCallToAction) {
    elements.push(
      textBox({
        text: `NEXT ACTION: ${data.finalCallToAction}`,
        x: ml,
        y: currentY,
        w: cw,
        h: 0.58,
        fontFace: t.typography.body.fontFace,
        fontSize: 14,
        color: isDark ? t.colors.goldSoft : t.colors.ink,
        bold: true,
        boxFill: isDark ? t.colors.ink : t.colors.mint2,
        boxStroke: t.colors.teal,
        padding: 10,
        valign: 'middle',
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
