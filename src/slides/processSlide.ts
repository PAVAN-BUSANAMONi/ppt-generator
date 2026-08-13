/**
 * Archetype 7: processSlide
 * Process & workflow slide — sequential numbered steps horizontally or vertically.
 */

import { SlideDefinition, SlideElement } from '../core/types';
import { defaultTheme, pxToInches } from '../design/theme';
import { ProcessSlideData } from './types';
import { title } from '../components/title';
import { card } from '../components/card';
import { footer } from '../components/footer';

function hex(color: string): string {
  return color.replace(/^#/, '');
}

export function renderProcessSlide(data: ProcessSlideData): SlideDefinition {
  const t = data.theme ?? defaultTheme;
  const elements: SlideElement[] = [];

  const ml = pxToInches(t.grid.marginLeft);
  const cw = pxToInches(t.layout.contentWidth);

  // Title header
  elements.push(
    ...title({
      eyebrow: data.eyebrow ?? 'PROCESS WORKFLOW',
      title: data.title,
      subtitle: data.subtitle,
      theme: t,
    })
  );

  const count = data.steps.length;
  const stepW = (cw - (count - 1) * 0.25) / count;

  data.steps.forEach((step, idx) => {
    const x = ml + idx * (stepW + 0.25);
    const y = 2.2;

    elements.push(
      ...card({
        x,
        y,
        width: stepW,
        height: 4.3,
        icon: step.icon ?? 'ArrowRight',
        title: `Step ${step.stepNumber}: ${step.title}`,
        body: step.description,
        accent: idx % 2 === 0 ? t.colors.teal : t.colors.blue,
        fill: idx % 2 === 0 ? t.colors.mint2 : t.colors.sky,
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
