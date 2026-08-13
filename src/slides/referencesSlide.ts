/**
 * Archetype 14: referencesSlide
 * References & Citations slide — clean, structured list of sources and citations.
 */

import { SlideDefinition, SlideElement } from '../core/types';
import { defaultTheme, pxToInches } from '../design/theme';
import { ReferencesSlideData } from './types';
import { title } from '../components/title';
import { textBox } from '../components/text';
import { card } from '../components/card';
import { footer } from '../components/footer';

function hex(color: string): string {
  return color.replace(/^#/, '');
}

export function renderReferencesSlide(data: ReferencesSlideData): SlideDefinition {
  const t = data.theme ?? defaultTheme;
  const elements: SlideElement[] = [];

  const ml = pxToInches(t.grid.marginLeft);
  const cw = pxToInches(t.layout.contentWidth);

  // Title header
  elements.push(
    ...title({
      eyebrow: data.eyebrow ?? 'REFERENCES & SOURCES',
      title: data.title,
      subtitle: data.subtitle,
      theme: t,
    })
  );

  const count = data.references.length;
  const colCount = count <= 3 ? 1 : 2;
  const rowCount = Math.ceil(count / colCount);
  const cardW = (cw - (colCount - 1) * 0.3) / colCount;
  const cardH = (4.3 - (rowCount - 1) * 0.2) / rowCount;

  data.references.forEach((ref, idx) => {
    const r = Math.floor(idx / colCount);
    const c = idx % colCount;

    const x = ml + c * (cardW + 0.3);
    const y = 2.2 + r * (cardH + 0.2);

    const yearStr = ref.year ? ` (${ref.year})` : '';
    const bodyStr = `${ref.source}${yearStr}${ref.link ? ` — ${ref.link}` : ''}`;

    elements.push(
      ...card({
        x,
        y,
        width: cardW,
        height: cardH,
        icon: 'BookOpen',
        title: `[${idx + 1}] ${ref.title}`,
        body: bodyStr,
        accent: t.colors.teal,
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
