/**
 * Archetype 5: causeEffectSlide
 * Cause-and-effect flow slide — causes → central mechanism → effects.
 */

import { SlideDefinition, SlideElement } from '../core/types';
import { defaultTheme, pxToInches } from '../design/theme';
import { CauseEffectSlideData } from './types';
import { title } from '../components/title';
import { card } from '../components/card';
import { footer } from '../components/footer';

function hex(color: string): string {
  return color.replace(/^#/, '');
}

export function renderCauseEffectSlide(data: CauseEffectSlideData): SlideDefinition {
  const t = data.theme ?? defaultTheme;
  const elements: SlideElement[] = [];

  const ml = pxToInches(t.grid.marginLeft);
  const cw = pxToInches(t.layout.contentWidth);

  // Title header
  elements.push(
    ...title({
      eyebrow: data.eyebrow ?? 'CAUSE & EFFECT',
      title: data.title,
      subtitle: data.subtitle,
      theme: t,
    })
  );

  const colW = (cw - 0.6) / 3;

  // 1. Causes Column (Left)
  const causeCount = data.causes.length;
  const causeH = (4.3 - (causeCount - 1) * 0.2) / causeCount;
  data.causes.forEach((c, idx) => {
    elements.push(
      ...card({
        x: ml,
        y: 2.2 + idx * (causeH + 0.2),
        width: colW,
        height: causeH,
        icon: 'ArrowRightCircle',
        title: c.title,
        body: c.description,
        accent: t.colors.gold,
        fill: t.colors.goldSoft,
        theme: t,
      })
    );
  });

  // 2. Central Mechanism Card (Middle)
  elements.push(
    ...card({
      x: ml + colW + 0.3,
      y: 2.2,
      width: colW,
      height: 4.3,
      icon: 'RefreshCw',
      title: 'CORE MECHANISM',
      body: data.mechanism,
      accent: t.colors.teal,
      fill: t.colors.mint2,
      border: t.colors.teal,
      theme: t,
    })
  );

  // 3. Effects Column (Right)
  const effectCount = data.effects.length;
  const effectH = (4.3 - (effectCount - 1) * 0.2) / effectCount;
  data.effects.forEach((e, idx) => {
    elements.push(
      ...card({
        x: ml + (colW + 0.3) * 2,
        y: 2.2 + idx * (effectH + 0.2),
        width: colW,
        height: effectH,
        icon: 'TrendingUp',
        title: e.title,
        body: e.description,
        accent: t.colors.blue,
        fill: t.colors.sky,
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
