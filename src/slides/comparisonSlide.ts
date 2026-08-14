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

  const hasLongSubtitle = Boolean(data.subtitle && data.subtitle.length > 50);
  const headerY = hasLongSubtitle ? 2.38 : 2.20;
  const panelY = hasLongSubtitle ? 2.82 : 2.70;
  const panelH = hasLongSubtitle ? 3.60 : 3.75;

  const leftTitle = data.leftPanel?.title ?? (data as any).leftTitle ?? 'Baseline';
  const leftPoints = data.leftPanel?.points ?? (data as any).leftBullets ?? [];
  const leftAccentRaw = data.leftPanel?.accentColor ?? (data as any).leftAccent ?? t.colors.gold;
  const leftAccent = leftAccentRaw === 'gold' ? t.colors.gold : leftAccentRaw === 'blue' ? t.colors.blue : leftAccentRaw;

  const rightTitle = data.rightPanel?.title ?? (data as any).rightTitle ?? 'Alternative';
  const rightPoints = data.rightPanel?.points ?? (data as any).rightBullets ?? [];
  const rightAccentRaw = data.rightPanel?.accentColor ?? (data as any).rightAccent ?? t.colors.blue;
  const rightAccent = rightAccentRaw === 'blue' ? t.colors.blue : rightAccentRaw === 'gold' ? t.colors.gold : rightAccentRaw;

  // Left Panel Title
  elements.push(
    textBox({
      text: leftTitle,
      x: ml,
      y: headerY,
      w: panelWidth,
      h: 0.4,
      fontFace: t.typography.heading.fontFace,
      fontSize: 18,
      color: leftAccent,
      bold: true,
      theme: t,
    })
  );

  // Left Card Background
  elements.push({
    kind: 'shape',
    shapeType: 'rounded-rect',
    fill: hex(t.colors.white),
    stroke: hex(t.colors.line),
    strokeWidth: 1,
    rectRadius: pxToInches(t.shapes.cardRadius),
    shadow: t.shadows.md,
    position: { x: ml, y: panelY },
    size: { w: panelWidth, h: panelH },
  });

  // Left Bullet Points
  elements.push(
    ...bulletList({
      items: leftPoints,
      x: ml + 0.2,
      y: panelY + 0.2,
      w: panelWidth - 0.4,
      h: panelH - 0.4,
      bulletColor: leftAccent,
      color: t.colors.ink,
      fontSize: 13,
      theme: t,
    })
  );

  // Right Panel Title
  const rightX = ml + panelWidth + 0.4;
  elements.push(
    textBox({
      text: rightTitle,
      x: rightX,
      y: headerY,
      w: panelWidth,
      h: 0.4,
      fontFace: t.typography.heading.fontFace,
      fontSize: 18,
      color: rightAccent,
      bold: true,
      theme: t,
    })
  );

  // Right Card Background
  elements.push({
    kind: 'shape',
    shapeType: 'rounded-rect',
    fill: hex(t.colors.white),
    stroke: hex(t.colors.line),
    strokeWidth: 1,
    rectRadius: pxToInches(t.shapes.cardRadius),
    shadow: t.shadows.md,
    position: { x: rightX, y: panelY },
    size: { w: panelWidth, h: panelH },
  });

  // Right Bullet Points
  elements.push(
    ...bulletList({
      items: rightPoints,
      x: rightX + 0.2,
      y: panelY + 0.2,
      w: panelWidth - 0.4,
      h: panelH - 0.4,
      bulletColor: rightAccent,
      color: t.colors.ink,
      fontSize: 13,
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
