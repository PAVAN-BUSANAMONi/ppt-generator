/**
 * Archetype 6: statisticsSlide
 * Key statistics & metrics slide — 2 to 4 stat cards with descriptions.
 * Supports an optional contextual image on the right side.
 */

import { SlideDefinition, SlideElement } from '../core/types';
import { defaultTheme, pxToInches } from '../design/theme';
import { StatisticsSlideData } from './types';
import { title } from '../components/title';
import { statCard } from '../components/statCard';
import { footer } from '../components/footer';
import { imagePanel } from '../components/imagePanel';

function hex(color: string): string {
  return color.replace(/^#/, '');
}

export function renderStatisticsSlide(data: StatisticsSlideData): SlideDefinition {
  const t = data.theme ?? defaultTheme;
  const elements: SlideElement[] = [];

  const ml = pxToInches(t.grid.marginLeft);
  const cw = pxToInches(t.layout.contentWidth);

  const hasImage = Boolean(data.image);
  const metricsWidth = hasImage ? cw * 0.55 : cw;

  // Title header
  elements.push(
    ...title({
      eyebrow: data.eyebrow ?? 'KEY METRICS',
      title: data.title,
      subtitle: data.subtitle,
      theme: t,
    })
  );

  const hasLongSubtitle = Boolean(data.subtitle && data.subtitle.length > 55);
  const startY = hasLongSubtitle ? 2.38 : 2.20;

  const count = data.metrics.length;
  const cols = hasImage ? 1 : (count <= 3 ? count : 2);
  const cardW = (metricsWidth - (cols - 1) * 0.3) / cols;
  const cardH = hasImage
    ? ((hasLongSubtitle ? 4.05 : 4.20) - (count - 1) * 0.15) / count
    : (count <= 3 ? (hasLongSubtitle ? 4.05 : 4.20) : (hasLongSubtitle ? 1.88 : 2.00));
  const gapY = hasImage ? 0.15 : (count <= 3 ? 0 : (hasLongSubtitle ? 0.18 : 0.25));

  const accentColors = [t.colors.teal, t.colors.blue, t.colors.gold, t.colors.ink];

  data.metrics.forEach((m, idx) => {
    const r = hasImage ? idx : (count <= 3 ? 0 : Math.floor(idx / cols));
    const c = hasImage ? 0 : (count <= 3 ? idx : idx % cols);

    const x = ml + c * (cardW + 0.3);
    const y = startY + r * (cardH + gapY);

    elements.push(
      ...statCard({
        number: m.number,
        label: m.label,
        explanation: m.explanation,
        x,
        y,
        width: cardW,
        height: cardH,
        numberColor: accentColors[idx % accentColors.length],
        theme: t,
      })
    );
  });

  // Image panel on the right (when image is provided)
  if (hasImage) {
    const totalCardHeight = hasLongSubtitle ? 4.05 : 4.20;
    elements.push(
      ...imagePanel({
        image: data.image,
        x: ml + cw * 0.60,
        y: startY,
        width: cw * 0.40,
        height: totalCardHeight,
        frameColor: t.colors.sky,
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

