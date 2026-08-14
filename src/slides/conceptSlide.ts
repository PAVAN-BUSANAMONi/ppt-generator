/**
 * Archetype 3: conceptSlide
 * Core concept breakdown — hero explanation panel + 2 to 3 supporting cards.
 * Supports image integration (left visual panel + structured concept cards).
 */

import { SlideDefinition, SlideElement } from '../core/types';
import { defaultTheme, pxToInches } from '../design/theme';
import { ConceptSlideData } from './types';
import { title } from '../components/title';
import { card } from '../components/card';
import { imagePanel } from '../components/imagePanel';
import { footer } from '../components/footer';

function hex(color: string): string {
  return color.replace(/^#/, '');
}

export function renderConceptSlide(data: ConceptSlideData): SlideDefinition {
  const t = data.theme ?? defaultTheme;
  const elements: SlideElement[] = [];

  const ml = pxToInches(t.grid.marginLeft);
  const cw = pxToInches(t.layout.contentWidth);

  // Title header
  elements.push(
    ...title({
      eyebrow: data.eyebrow ?? 'CORE CONCEPT',
      title: data.title,
      subtitle: data.subtitle,
      theme: t,
    })
  );

  const hasImage = Boolean(data.image);
  const leftW = cw * 0.42;

  // 1. Left side: Image panel if provided, otherwise main concept hero card
  if (hasImage) {
    elements.push(
      ...imagePanel({
        image: data.image,
        x: ml,
        y: 2.2,
        width: leftW,
        height: 4.3,
        caption: data.mainConcept.title,
        theme: t,
      })
    );
  } else {
    elements.push(
      ...card({
        x: ml,
        y: 2.2,
        width: leftW,
        height: 4.3,
        icon: 'Lightbulb',
        title: data.mainConcept.title,
        body: data.mainConcept.description,
        accent: t.colors.teal,
        fill: t.colors.mint2,
        border: t.colors.line,
        theme: t,
      })
    );
  }

  // 2. Supporting concept cards on right
  const rightX = ml + cw * 0.46;
  const rightWidth = cw * 0.54;

  if (hasImage) {
    // If image is on left, top card on right is the main concept explanation, followed by supporting cards
    const allCards = [
      { icon: 'Lightbulb', title: data.mainConcept.title, body: data.mainConcept.description },
      ...data.cards,
    ];
    const cardCount = allCards.length;
    const cardH = (4.3 - (cardCount - 1) * 0.15) / cardCount;

    allCards.forEach((c, idx) => {
      const y = 2.2 + idx * (cardH + 0.15);
      elements.push(
        ...card({
          x: rightX,
          y,
          width: rightWidth,
          height: cardH,
          icon: c.icon ?? 'CheckCircle',
          title: c.title,
          body: c.body,
          accent: idx === 0 ? t.colors.teal : idx % 2 === 0 ? t.colors.blue : t.colors.gold,
          fill: idx === 0 ? t.colors.mint2 : t.colors.white,
          theme: t,
        })
      );
    });
  } else {
    const cardCount = data.cards.length;
    const cardH = (4.3 - (cardCount - 1) * 0.2) / cardCount;

    data.cards.forEach((c, idx) => {
      const y = 2.2 + idx * (cardH + 0.2);
      elements.push(
        ...card({
          x: rightX,
          y,
          width: rightWidth,
          height: cardH,
          icon: c.icon ?? 'CheckCircle',
          title: c.title,
          body: c.body,
          accent: idx % 2 === 0 ? t.colors.teal : t.colors.blue,
          theme: t,
        })
      );
    });
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
