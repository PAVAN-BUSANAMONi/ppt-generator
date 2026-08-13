/**
 * Archetype 4: comparisonSlide
 * Side-by-side comparison — balanced left/right cards with bullet points.
 */

import { SlideDefinition, SlideElement } from '../core/types';
import { defaultTheme, pxToInches } from '../design/theme';
import { ComparisonSlideData } from './types';
import { title } from '../components/title';
import { bulletList } from '../components/bulletList';
import { textBox } from '../components/text';
import { footer } from '../components/footer';

function hex(color: string): string {
  return color.replace(/^#/, '');
}

export function renderComparisonSlide(data: ComparisonSlideData): SlideDefinition {
  const t = data.theme ?? defaultTheme;
  const elements: SlideElement[] = [];

  const ml = pxToInches(t.grid.marginLeft);
  const cw = pxToInches(t.layout.contentWidth);
  const panelWidth = (cw - 0.4) / 2;

  // Title header
  elements.push(
    ...title({
      eyebrow: data.eyebrow ?? 'COMPARISON',
      title: data.title,
      subtitle: data.subtitle,
      theme: t,
    })
  );

  // Left Panel Title
  elements.push(
    textBox({
      text: data.leftPanel.title,
      x: ml,
      y: 2.2,
      w: panelWidth,
      h: 0.4,
      fontFace: t.typography.heading.fontFace,
      fontSize: t.typography.heading.fontSize,
      color: data.leftPanel.accentColor ?? t.colors.teal,
      bold: true,
      theme: t,
    })
  );

  // Left Panel Bullets
  elements.push(
    ...bulletList({
      items: data.leftPanel.points,
      x: ml,
      y: 2.7,
      w: panelWidth,
      h: 3.8,
      background: t.colors.white,
      border: data.leftPanel.accentColor ?? t.colors.teal,
      padding: 16,
      bulletColor: data.leftPanel.accentColor ?? t.colors.teal,
      theme: t,
    })
  );

  // Right Panel Title
  const rightX = ml + panelWidth + 0.4;
  elements.push(
    textBox({
      text: data.rightPanel.title,
      x: rightX,
      y: 2.2,
      w: panelWidth,
      h: 0.4,
      fontFace: t.typography.heading.fontFace,
      fontSize: t.typography.heading.fontSize,
      color: data.rightPanel.accentColor ?? t.colors.blue,
      bold: true,
      theme: t,
    })
  );

  // Right Panel Bullets
  elements.push(
    ...bulletList({
      items: data.rightPanel.points,
      x: rightX,
      y: 2.7,
      w: panelWidth,
      h: 3.8,
      background: t.colors.white,
      border: data.rightPanel.accentColor ?? t.colors.blue,
      padding: 16,
      bulletColor: data.rightPanel.accentColor ?? t.colors.blue,
      theme: t,
    })
  );

  // Footer
  elements.push(
    ...footer({
      presentationName: data.title,
      slideNumber: data.slideNumber,
      totalSlides: data.totalSlides,
      theme: t,
    })
  );

  return {
    id: data.id,
    background: hex(t.colors.off),
    elements,
    notes: data.notes,
  };
}
