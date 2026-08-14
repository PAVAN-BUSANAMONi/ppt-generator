/**
 * Archetype 7: processSlide
 * Process & workflow slide — sequential numbered steps horizontally or vertically.
 * Supports an optional contextual image on the right side.
 */

import { SlideDefinition, SlideElement } from '../core/types';
import { defaultTheme, pxToInches } from '../design/theme';
import { ProcessSlideData } from './types';
import { title } from '../components/title';
import { card } from '../components/card';
import { footer } from '../components/footer';
import { imagePanel } from '../components/imagePanel';

function hex(color: string): string {
  return color.replace(/^#/, '');
}

export function renderProcessSlide(data: ProcessSlideData): SlideDefinition {
  const t = data.theme ?? defaultTheme;
  const elements: SlideElement[] = [];

  const ml = pxToInches(t.grid.marginLeft);
  const cw = pxToInches(t.layout.contentWidth);

  const hasImage = Boolean(data.image);
  const stepsWidth = hasImage ? cw * 0.55 : cw;

  // Title header
  elements.push(
    ...title({
      eyebrow: data.eyebrow ?? 'PROCESS WORKFLOW',
      title: data.title,
      subtitle: data.subtitle,
      theme: t,
    })
  );

  const hasLongSubtitle = Boolean(data.subtitle && data.subtitle.length > 50);
  const startY = hasLongSubtitle ? 2.38 : 2.20;
  const cardH = hasLongSubtitle ? 4.10 : 4.30;

  const count = data.steps.length;

  if (hasImage) {
    // Vertical layout: stack steps vertically, image on right
    const stepH = (cardH - (count - 1) * 0.12) / count;

    data.steps.forEach((step, idx) => {
      const x = ml;
      const y = startY + idx * (stepH + 0.12);

      elements.push(
        ...card({
          x,
          y,
          width: stepsWidth,
          height: stepH,
          icon: step.icon ?? 'ArrowRight',
          title: `Step ${step.stepNumber}: ${step.title}`,
          body: step.description,
          accent: idx % 2 === 0 ? t.colors.teal : t.colors.blue,
          fill: idx % 2 === 0 ? t.colors.mint2 : t.colors.sky,
          theme: t,
        })
      );
    });

    // Image panel on the right
    elements.push(
      ...imagePanel({
        image: data.image,
        x: ml + cw * 0.60,
        y: startY,
        width: cw * 0.40,
        height: cardH,
        frameColor: t.colors.mint,
        theme: t,
      })
    );
  } else {
    // Horizontal layout: cards side by side (original behavior)
    const stepW = (stepsWidth - (count - 1) * 0.25) / count;

    data.steps.forEach((step, idx) => {
      const x = ml + idx * (stepW + 0.25);
      const y = startY;

      elements.push(
        ...card({
          x,
          y,
          width: stepW,
          height: cardH,
          icon: step.icon ?? 'ArrowRight',
          title: `Step ${step.stepNumber}: ${step.title}`,
          body: step.description,
          accent: idx % 2 === 0 ? t.colors.teal : t.colors.blue,
          fill: idx % 2 === 0 ? t.colors.mint2 : t.colors.sky,
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

