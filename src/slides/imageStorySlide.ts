/**
 * Archetype 9: imageStorySlide
 * Image narrative slide — large image panel alongside narrative story points.
 */

import { SlideDefinition, SlideElement } from '../core/types';
import { defaultTheme, pxToInches } from '../design/theme';
import { ImageStorySlideData } from './types';
import { title } from '../components/title';
import { imagePanel } from '../components/imagePanel';
import { bulletList } from '../components/bulletList';
import { footer } from '../components/footer';

function hex(color: string): string {
  return color.replace(/^#/, '');
}

export function renderImageStorySlide(data: ImageStorySlideData): SlideDefinition {
  const t = data.theme ?? defaultTheme;
  const elements: SlideElement[] = [];

  const ml = pxToInches(t.grid.marginLeft);
  const cw = pxToInches(t.layout.contentWidth);

  // Title header
  elements.push(
    ...title({
      eyebrow: data.eyebrow ?? 'VISUAL NARRATIVE',
      title: data.title,
      subtitle: data.subtitle,
      theme: t,
    })
  );

  // Left Image Panel
  elements.push(
    ...imagePanel({
      image: data.image,
      x: ml,
      y: 2.2,
      width: cw * 0.45,
      height: 4.3,
      caption: data.caption,
      placeholderText: 'HERO VISUAL PANEL',
      theme: t,
    })
  );

  // Right Story Points
  elements.push(
    ...bulletList({
      items: data.storyPoints,
      x: ml + cw * 0.49,
      y: 2.2,
      w: cw * 0.51,
      h: 4.3,
      background: t.colors.white,
      border: t.colors.line,
      padding: 20,
      bulletColor: t.colors.teal,
      theme: t,
    })
  );

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
