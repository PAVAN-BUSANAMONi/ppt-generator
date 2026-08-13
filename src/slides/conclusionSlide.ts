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

  let currentY = 1.8;

  // Eyebrow
  elements.push(
    textBox({
      text: (data.eyebrow ?? 'CONCLUSION & NEXT STEPS').toUpperCase(),
      x: ml,
      y: currentY,
      w: cw,
      h: 0.4,
      fontFace: t.typography.caption.fontFace,
      fontSize: t.typography.caption.fontSize + 2,
      color: isDark ? t.colors.gold : t.colors.teal,
      bold: true,
      theme: t,
    })
  );
  currentY += 0.5;

  // Large Display Title
  elements.push(
    textBox({
      text: data.title,
      x: ml,
      y: currentY,
      w: cw,
      h: 1.2,
      fontFace: t.typography.display.fontFace,
      fontSize: t.typography.display.fontSize,
      color: isDark ? t.colors.white : t.colors.ink,
      bold: true,
      theme: t,
    })
  );
  currentY += 1.4;

  // Summary / Synthesis Card
  elements.push(
    ...card({
      x: ml,
      y: currentY,
      width: cw,
      height: 2.0,
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
  currentY += 2.2;

  // Optional Call to Action Box
  if (data.finalCallToAction) {
    elements.push(
      textBox({
        text: `NEXT ACTION: ${data.finalCallToAction}`,
        x: ml,
        y: currentY,
        w: cw,
        h: 0.6,
        fontFace: t.typography.body.fontFace,
        fontSize: t.typography.body.fontSize,
        color: isDark ? t.colors.goldSoft : t.colors.ink,
        bold: true,
        boxFill: isDark ? t.colors.ink : t.colors.mint2,
        boxStroke: t.colors.teal,
        padding: 12,
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
