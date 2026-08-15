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
import { textBox } from '../components/text';
import { iconBadge } from '../components/iconBadge';

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
    // Vertical stacked process cards on left with badge on left side of card
    const stepH = (cardH - (count - 1) * 0.12) / count;

    data.steps.forEach((step, idx) => {
      const x = ml;
      const y = startY + idx * (stepH + 0.12);
      const isEven = idx % 2 === 0;
      const accent = isEven ? t.colors.teal : t.colors.blue;
      const fill = isEven ? t.colors.mint2 : t.colors.sky;

      // 1. Step background card container
      elements.push({
        kind: 'shape',
        shapeType: 'rounded-rect',
        fill: hex(fill),
        stroke: hex(t.colors.line),
        strokeWidth: 1,
        rectRadius: pxToInches(t.shapes.cardRadius),
        shadow: t.shadows.sm,
        position: { x, y },
        size: { w: stepsWidth, h: stepH },
      });

      // 2. Step number circle badge on left
      const badgeSize = 0.36;
      const badgeX = x + 0.12;
      const badgeY = y + (stepH - badgeSize) / 2;

      elements.push(
        ...iconBadge({
          icon: step.icon ?? 'ArrowRight',
          x: badgeX,
          y: badgeY,
          size: badgeSize,
          iconColor: accent,
          badgeFill: t.colors.white,
          theme: t,
        })
      );

      // 3. Text block on right
      const textX = badgeX + badgeSize + 0.12;
      const textW = stepsWidth - (textX - x) - 0.12;
      const titleH = 0.28;
      const bodyH = Math.max(0.38, stepH - titleH - 0.12);

      // Title: "Step X: Title"
      elements.push(
        textBox({
          text: `Step ${step.stepNumber}: ${step.title}`,
          x: textX,
          y: y + 0.08,
          w: textW,
          h: titleH,
          fontFace: t.typography.heading.fontFace,
          fontSize: 12.5,
          color: t.colors.ink,
          bold: true,
          theme: t,
        })
      );

      // Body / Description
      elements.push(
        textBox({
          text: step.description,
          x: textX,
          y: y + 0.08 + titleH,
          w: textW,
          h: bodyH,
          fontFace: t.typography.body.fontFace,
          fontSize: 10,
          color: t.colors.slate,
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

