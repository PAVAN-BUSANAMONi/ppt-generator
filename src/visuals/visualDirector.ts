/**
 * Step 11 — Intelligent Visual Director
 *
 * Inspects slide type, title, content, key message, data, audience, and theme,
 * and attaches a validated VisualPlan to every slide in PresentationData.
 */

import { PresentationData } from '../content/presentationSchema';
import { VisualPlan } from './visualTypes';
import { determineVisualPolicy } from './visualPolicy';
import { validateVisualPlan } from './visualValidator';

export interface VisualDirectorReport {
  slideNumber: number;
  slideTitle: string;
  slideType: string;
  visualPlan: VisualPlan;
  valid: boolean;
}

export function directVisualsForPresentation(presentationData: PresentationData): {
  presentationData: PresentationData;
  reports: VisualDirectorReport[];
} {
  const topic = presentationData.presentation.title;
  const reports: VisualDirectorReport[] = [];

  const updatedSlides = presentationData.slides.map((slide: any, idx: number) => {
    const slideNumber = slide.slideNumber || idx + 1;

    // 1. Determine visual policy for slide
    const vPlan = determineVisualPolicy(slide, topic);

    // 2. Validate visual plan
    const check = validateVisualPlan(vPlan);
    if (!check.valid) {
      console.warn(`⚠️ Visual plan validation warnings for Slide ${slideNumber}:`, check.errors);
    }

    reports.push({
      slideNumber,
      slideTitle: slide.title,
      slideType: slide.type,
      visualPlan: vPlan,
      valid: check.valid,
    });

    return {
      ...slide,
      visualPlan: vPlan,
    };
  });

  return {
    presentationData: {
      ...presentationData,
      slides: updatedSlides,
    },
    reports,
  };
}
