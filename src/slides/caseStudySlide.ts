/**
 * Archetype 8: caseStudySlide
 * Case study slide — Context, Challenge, Solution, Result breakdown.
 */

import { SlideDefinition, SlideElement } from '../core/types';
import { defaultTheme, pxToInches } from '../design/theme';
import { CaseStudySlideData } from './types';
import { title } from '../components/title';
import { card } from '../components/card';
import { imagePanel } from '../components/imagePanel';
import { footer } from '../components/footer';

function hex(color: string): string {
  return color.replace(/^#/, '');
}

export function renderCaseStudySlide(data: CaseStudySlideData): SlideDefinition {
  const t = data.theme ?? defaultTheme;
  const elements: SlideElement[] = [];

  const ml = pxToInches(t.grid.marginLeft);
  const cw = pxToInches(t.layout.contentWidth);

  // Title header
  elements.push(
    ...title({
      eyebrow: data.eyebrow ?? 'CASE STUDY',
      title: data.title,
      subtitle: data.subtitle,
      theme: t,
    })
  );

  const hasImage = Boolean(data.image);
  const gridW = hasImage ? cw * 0.65 : cw;

  const cardW = (gridW - 0.25) / 2;

  // 1. Context & Background Card
  elements.push(
    ...card({
      x: ml,
      y: 2.2,
      width: cardW,
      height: 2.05,
      icon: 'FileText',
      title: 'Context & Background',
      body: data.context,
      accent: t.colors.teal,
      theme: t,
    })
  );

  // 2. Core Challenge Card
  elements.push(
    ...card({
      x: ml + cardW + 0.25,
      y: 2.2,
      width: cardW,
      height: 2.05,
      icon: 'AlertTriangle',
      title: 'Core Challenge',
      body: data.challenge,
      accent: t.colors.gold,
      theme: t,
    })
  );

  // 3. Implemented Solution Card
  elements.push(
    ...card({
      x: ml,
      y: 4.45,
      width: cardW,
      height: 2.05,
      icon: 'CheckCircle2',
      title: 'Implemented Solution',
      body: data.solution,
      accent: t.colors.blue,
      theme: t,
    })
  );

  // 4. Measurable Result Card
  elements.push(
    ...card({
      x: ml + cardW + 0.25,
      y: 4.45,
      width: cardW,
      height: 2.05,
      icon: 'TrendingUp',
      title: 'Measurable Impact',
      body: data.result,
      accent: t.colors.teal,
      fill: t.colors.mint2,
      theme: t,
    })
  );

  // 5. Image Panel (if provided)
  if (hasImage) {
    elements.push(
      ...imagePanel({
        image: data.image,
        x: ml + gridW + 0.25,
        y: 2.2,
        width: cw * 0.32,
        height: 4.3,
        caption: 'Case Study Visual',
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
