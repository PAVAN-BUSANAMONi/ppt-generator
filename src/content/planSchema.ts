/**
 * Step 9 — Presentation Plan Schema
 *
 * Defines the structure for AI presentation planning prior to content generation.
 */

import { SlideType, VisualDensity } from './presentationSchema';

export type VisualIntent = 'image' | 'icon' | 'badge' | 'panel' | 'chart' | 'table' | 'none';
export type DataIntent = 'metrics' | 'table' | 'comparison' | 'process' | 'narrative' | 'none';

export interface SlidePlan {
  slideNumber: number;
  section: string;
  type: SlideType;
  title: string;
  purpose: string;
  keyQuestion: string;
  keyMessage: string;
  density: VisualDensity;
  visualIntent: VisualIntent;
  dataIntent: DataIntent;
}

export interface PresentationPlan {
  title: string;
  subtitle: string;
  narrativeGoal: string;
  sections: string[];
  slides: SlidePlan[];
}

export interface PlanValidationResult {
  valid: boolean;
  errors: string[];
  plan?: PresentationPlan;
}

export function validatePresentationPlan(rawPlan: any): PlanValidationResult {
  const errors: string[] = [];

  if (!rawPlan || typeof rawPlan !== 'object') {
    return { valid: false, errors: ['Plan must be an object.'] };
  }

  if (!rawPlan.title || typeof rawPlan.title !== 'string') {
    errors.push('Missing plan title.');
  }

  if (!Array.isArray(rawPlan.slides) || rawPlan.slides.length === 0) {
    errors.push('Plan must contain a non-empty slides array.');
    return { valid: false, errors };
  }

  const seenNumbers = new Set<number>();

  rawPlan.slides.forEach((slide: any, idx: number) => {
    const p = `slides[${idx}]`;

    if (typeof slide.slideNumber !== 'number' || slide.slideNumber <= 0) {
      errors.push(`${p}.slideNumber must be a positive integer.`);
    } else if (seenNumbers.has(slide.slideNumber)) {
      errors.push(`${p}.slideNumber ${slide.slideNumber} is duplicated.`);
    } else {
      seenNumbers.add(slide.slideNumber);
    }

    if (!slide.type || typeof slide.type !== 'string') {
      errors.push(`${p}.type is required.`);
    }

    if (!slide.title || typeof slide.title !== 'string') {
      errors.push(`${p}.title is required.`);
    }

    if (!slide.purpose || typeof slide.purpose !== 'string') {
      errors.push(`${p}.purpose is required.`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    plan: errors.length === 0 ? (rawPlan as PresentationPlan) : undefined,
  };
}
