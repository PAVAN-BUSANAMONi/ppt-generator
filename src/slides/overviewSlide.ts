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

  // Agenda Cards
  const count = data.agendaItems.length;
  const colCount = count <= 3 ? count : Math.ceil(count / 2);
  const cardWidth = (cw - (colCount - 1) * 0.3) / colCount;
  const cardHeight = count <= 3 ? 4.2 : 2.0;

  data.agendaItems.forEach((item, idx) => {
    const r = count <= 3 ? 0 : Math.floor(idx / colCount);
    const c = count <= 3 ? idx : idx % colCount;

    const x = ml + c * (cardWidth + 0.3);
    const y = 2.2 + r * (cardHeight + 0.25);

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
