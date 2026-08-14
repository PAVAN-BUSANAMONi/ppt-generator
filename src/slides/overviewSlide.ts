/**
 * Archetype 2: overviewSlide
 * Agenda / Outline slide — multi-column or vertical list of topic cards.
 */

import { SlideDefinition, SlideElement } from '../core/types';
import { defaultTheme, pxToInches } from '../design/theme';
import { OverviewSlideData } from './types';
import { title } from '../components/title';
import { card } from '../components/card';
import { footer } from '../components/footer';

function hex(color: string): string {
  return color.replace(/^#/, '');
}

export function renderOverviewSlide(data: OverviewSlideData): SlideDefinition {
  const t = data.theme ?? defaultTheme;
  const elements: SlideElement[] = [];

  const ml = pxToInches(t.grid.marginLeft);
  const cw = pxToInches(t.layout.contentWidth);

  // Title header
  elements.push(
    ...title({
      eyebrow: data.eyebrow ?? 'AGENDA',
      title: data.title,
      subtitle: data.subtitle,
      theme: t,
    })
  );

  const hasLongSubtitle = Boolean(data.subtitle && data.subtitle.length > 50);
  const startY = hasLongSubtitle ? 2.38 : 2.20;

  // Agenda Cards
  const count = data.agendaItems.length;
  const colCount = count <= 3 ? count : Math.ceil(count / 2);
  const cardWidth = (cw - (colCount - 1) * 0.3) / colCount;
  const cardHeight = count <= 3 ? (hasLongSubtitle ? 4.05 : 4.20) : (hasLongSubtitle ? 1.88 : 2.00);
  const gapY = count <= 3 ? 0 : (hasLongSubtitle ? 0.20 : 0.25);

  data.agendaItems.forEach((item, idx) => {
    const r = count <= 3 ? 0 : Math.floor(idx / colCount);
    const c = count <= 3 ? idx : idx % colCount;

    const x = ml + c * (cardWidth + 0.3);
    const y = startY + r * (cardHeight + gapY);

    elements.push(
      ...card({
        x,
        y,
        width: cardWidth,
        height: cardHeight,
        icon: item.icon ?? 'ListChecks',
        title: item.number ? `${item.number}. ${item.title}` : item.title,
        body: item.description,
        accent: idx % 2 === 0 ? t.colors.teal : t.colors.blue,
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
