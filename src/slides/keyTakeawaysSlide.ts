/**
 * Archetype 12: keyTakeawaysSlide
 * Key takeaways slide — 4 to 8 structured takeaway cards.
 */

import { SlideDefinition, SlideElement } from '../core/types';
import { defaultTheme, pxToInches } from '../design/theme';
import { KeyTakeawaysSlideData } from './types';
import { title } from '../components/title';
import { card } from '../components/card';
import { footer } from '../components/footer';

function hex(color: string): string {
  return color.replace(/^#/, '');
}

export function renderKeyTakeawaysSlide(data: KeyTakeawaysSlideData): SlideDefinition {
  const t = data.theme ?? defaultTheme;
  const elements: SlideElement[] = [];

  const ml = pxToInches(t.grid.marginLeft);
  const cw = pxToInches(t.layout.contentWidth);

  // Title header
  elements.push(
    ...title({
      eyebrow: data.eyebrow ?? 'SUMMARY',
      title: data.title,
      subtitle: data.subtitle,
      theme: t,
    })
  );

  const count = data.takeaways.length;
  const cols = count <= 4 ? 2 : 3;
  const rows = Math.ceil(count / cols);
  const cardW = (cw - (cols - 1) * 0.3) / cols;
  const cardH = (4.3 - (rows - 1) * 0.25) / rows;

  data.takeaways.forEach((item, idx) => {
    const r = Math.floor(idx / cols);
    const c = idx % cols;

    const x = ml + c * (cardW + 0.3);
    const y = 2.2 + r * (cardH + 0.25);

    elements.push(
      ...card({
        x,
        y,
        width: cardW,
        height: cardH,
        icon: 'Bookmark',
        title: `${item.number}. ${item.title}`,
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
