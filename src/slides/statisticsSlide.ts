/**
 * Archetype 6: statisticsSlide
 * Key statistics & metrics slide — 2 to 4 stat cards with descriptions.
 */

import { SlideDefinition, SlideElement } from '../core/types';
import { defaultTheme, pxToInches } from '../design/theme';
import { StatisticsSlideData } from './types';
import { title } from '../components/title';
import { statCard } from '../components/statCard';
import { footer } from '../components/footer';

function hex(color: string): string {
  return color.replace(/^#/, '');
}

export function renderStatisticsSlide(data: StatisticsSlideData): SlideDefinition {
  const t = data.theme ?? defaultTheme;
  const elements: SlideElement[] = [];

  const ml = pxToInches(t.grid.marginLeft);
  const cw = pxToInches(t.layout.contentWidth);

  // Title header
  elements.push(
    ...title({
      eyebrow: data.eyebrow ?? 'KEY METRICS',
      title: data.title,
      subtitle: data.subtitle,
      theme: t,
    })
  );

  const count = data.metrics.length;
  const cols = count <= 2 ? count : Math.ceil(count / 2);
  const cardW = (cw - (cols - 1) * 0.3) / cols;
  const cardH = count <= 2 ? 4.2 : 2.0;

  const accentColors = [t.colors.teal, t.colors.blue, t.colors.gold, t.colors.ink];

  data.metrics.forEach((m, idx) => {
    const r = count <= 2 ? 0 : Math.floor(idx / cols);
    const c = count <= 2 ? idx : idx % cols;

    const x = ml + c * (cardW + 0.3);
    const y = 2.2 + r * (cardH + 0.25);

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
