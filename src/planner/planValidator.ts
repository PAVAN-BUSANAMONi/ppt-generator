/**
 * Step 9 — Plan Validator
 *
 * Strict validation engine for PresentationPlan objects.
 */

import { PresentationPlan, SlidePlan, SectionPlan } from './planSchema';
import { SlideType } from '../slides/types';

export interface PlanValidationError {
  field: string;
  message: string;
}

export interface PlanValidationReport {
  valid: boolean;
  errors: PlanValidationError[];
  plan?: PresentationPlan;
}

const ALLOWED_SLIDE_TYPES: SlideType[] = [
  'title',
  'overview',
  'concept',
  'comparison',
  'cause-effect',
  'statistics',
  'process',
  'case-study',
  'image-story',
  'table',
  'chart',
  'takeaways',
  'conclusion',
  'references',
];

const ALLOWED_VISUAL_INTENTS = ['none', 'image', 'diagram', 'chart', 'table', 'timeline', 'mixed'];

export function validatePresentationPlan(rawPlan: any, expectedSlideCount: number = 10): PlanValidationReport {
  const errors: PlanValidationError[] = [];

  if (!rawPlan || typeof rawPlan !== 'object') {
    return {
      valid: false,
      errors: [{ field: 'root', message: 'Plan must be a non-null JSON object.' }],
    };
  }

  // 1. Title validation
  if (!rawPlan.title || typeof rawPlan.title !== 'string' || !rawPlan.title.trim()) {
    errors.push({ field: 'title', message: 'Missing required "title" string.' });
  }

  // 2. Sections validation
  if (!Array.isArray(rawPlan.sections) || rawPlan.sections.length === 0) {
    errors.push({ field: 'sections', message: 'Plan must contain at least 1 section in "sections".' });
  }

  const validSectionIds = new Set<string>();
  if (Array.isArray(rawPlan.sections)) {
    rawPlan.sections.forEach((sec: any, sIdx: number) => {
      if (!sec || typeof sec !== 'object') {
        errors.push({ field: `sections[${sIdx}]`, message: 'Section item must be an object.' });
        return;
      }
      if (!sec.id || typeof sec.id !== 'string') {
        errors.push({ field: `sections[${sIdx}].id`, message: 'Section requires an id string.' });
      } else {
        validSectionIds.add(sec.id);
      }
      if (!sec.title || typeof sec.title !== 'string') {
        errors.push({ field: `sections[${sIdx}].title`, message: 'Section requires a title string.' });
      }
    });
  }

  // 3. Slides array validation
  if (!Array.isArray(rawPlan.slides)) {
    errors.push({ field: 'slides', message: 'Missing or invalid "slides" array.' });
    return { valid: false, errors };
  }

  // 4. Exact slide count check
  if (rawPlan.slides.length !== expectedSlideCount) {
    errors.push({
      field: 'slides.length',
      message: `Exact slide count mismatch: Expected ${expectedSlideCount}, got ${rawPlan.slides.length}.`,
    });
  }

  const seenSlideNumbers = new Set<number>();
  const seenPurposes = new Set<string>();
  let hasConclusion = false;

  rawPlan.slides.forEach((slide: any, idx: number) => {
    const prefix = `slides[${idx}]`;

    if (!slide || typeof slide !== 'object') {
      errors.push({ field: prefix, message: 'Slide item must be an object.' });
      return;
    }

    // Slide Number check
    if (typeof slide.slideNumber !== 'number' || slide.slideNumber <= 0 || !Number.isInteger(slide.slideNumber)) {
      errors.push({ field: `${prefix}.slideNumber`, message: `Invalid slideNumber "${slide.slideNumber}". Must be a positive integer.` });
    } else if (seenSlideNumbers.has(slide.slideNumber)) {
      errors.push({ field: `${prefix}.slideNumber`, message: `Duplicate slideNumber ${slide.slideNumber} detected.` });
    } else {
      seenSlideNumbers.add(slide.slideNumber);
    }

    // Section ID check
    if (!slide.sectionId || !validSectionIds.has(slide.sectionId)) {
      errors.push({ field: `${prefix}.sectionId`, message: `Invalid or unmapped sectionId "${slide.sectionId}".` });
    }

    // Slide Type check
    if (!slide.type || !ALLOWED_SLIDE_TYPES.includes(slide.type)) {
      errors.push({ field: `${prefix}.type`, message: `Unsupported slide type "${slide.type}".` });
    }

    if (slide.type === 'conclusion') {
      hasConclusion = true;
    }

    // Title & Purpose check
    if (!slide.title || typeof slide.title !== 'string' || !slide.title.trim()) {
      errors.push({ field: `${prefix}.title`, message: 'Slide requires a non-empty title string.' });
    }

    if (!slide.purpose || typeof slide.purpose !== 'string' || !slide.purpose.trim()) {
      errors.push({ field: `${prefix}.purpose`, message: 'Slide requires a non-empty purpose string.' });
    } else {
      const normPurpose = slide.purpose.toLowerCase().trim();
      if (seenPurposes.has(normPurpose)) {
        errors.push({ field: `${prefix}.purpose`, message: `Duplicate slide purpose detected: "${slide.purpose}".` });
      } else {
        seenPurposes.add(normPurpose);
      }
    }

    // Key Message check
    if (!slide.keyMessage || typeof slide.keyMessage !== 'string' || !slide.keyMessage.trim()) {
      errors.push({ field: `${prefix}.keyMessage`, message: 'Slide requires a non-empty keyMessage string.' });
    }

    // Density check
    if (!['light', 'medium', 'dense'].includes(slide.density)) {
      errors.push({ field: `${prefix}.density`, message: `Invalid density "${slide.density}". Must be light, medium, or dense.` });
    }

    // Visual Intent check
    if (!ALLOWED_VISUAL_INTENTS.includes(slide.visualIntent)) {
      errors.push({ field: `${prefix}.visualIntent`, message: `Invalid visualIntent "${slide.visualIntent}".` });
    }

    // Data Intent check
    if (typeof slide.dataIntent !== 'boolean') {
      errors.push({ field: `${prefix}.dataIntent`, message: 'dataIntent must be a boolean.' });
    }
  });

  // 5. Conclusion check
  const lastSlide = rawPlan.slides[rawPlan.slides.length - 1];
  if (!hasConclusion && lastSlide && lastSlide.type !== 'conclusion' && !lastSlide.title.toLowerCase().includes('conclusion')) {
    errors.push({ field: 'slides.conclusion', message: 'Presentation plan must include a conclusion slide.' });
  }

  return {
    valid: errors.length === 0,
    errors,
    plan: errors.length === 0 ? (rawPlan as PresentationPlan) : undefined,
  };
}
