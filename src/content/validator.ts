/**
 * Step 10 — Content & Citation Validator
 *
 * Strict validation engine for PresentationData schema and research citation grounding.
 */

import { PresentationData, SlideType } from './presentationSchema';
import { SourceRegistry } from '../research/sourceTypes';

export interface ValidationError {
  path: string;
  message: string;
}

export interface ValidationReport {
  valid: boolean;
  errors: ValidationError[];
  data?: PresentationData;
}

const VALID_SLIDE_TYPES: SlideType[] = [
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

export function validatePresentationData(
  data: any,
  registry?: SourceRegistry
): ValidationReport {
  const errors: ValidationError[] = [];

  if (!data || typeof data !== 'object') {
    return {
      valid: false,
      errors: [{ path: 'root', message: 'Data must be a non-null object.' }],
    };
  }

  // 1. Validate root presentation object
  if (!data.presentation || typeof data.presentation !== 'object') {
    errors.push({ path: 'presentation', message: 'Missing required "presentation" root object.' });
  } else {
    if (!data.presentation.title || typeof data.presentation.title !== 'string' || !data.presentation.title.trim()) {
      errors.push({ path: 'presentation.title', message: 'Missing required "presentation.title" string.' });
    }
  }

  // 2. Validate slides array
  if (!Array.isArray(data.slides)) {
    errors.push({ path: 'slides', message: 'Missing or invalid "slides" array.' });
    return { valid: false, errors };
  }

  if (data.slides.length === 0) {
    errors.push({ path: 'slides', message: 'The "slides" array must contain at least 1 slide.' });
  }

  const seenSlideNumbers = new Set<number>();
  const validSourceIds = registry ? new Set(registry.sources.map((s) => s.id)) : null;

  // 3. Validate each slide
  data.slides.forEach((slide: any, idx: number) => {
    const pathPrefix = `slides[${idx}]`;

    if (!slide || typeof slide !== 'object') {
      errors.push({ path: pathPrefix, message: 'Slide item must be an object.' });
      return;
    }

    // Slide Type Check
    if (!slide.type || !VALID_SLIDE_TYPES.includes(slide.type)) {
      errors.push({
        path: `${pathPrefix}.type`,
        message: `Unknown or missing slide type "${slide.type}". Allowed types: ${VALID_SLIDE_TYPES.join(', ')}`,
      });
    }

    // Required Slide Title
    if (!slide.title || typeof slide.title !== 'string' || !slide.title.trim()) {
      errors.push({ path: `${pathPrefix}.title`, message: 'Missing required slide "title" string.' });
    }

    // Slide Number & Duplication Check
    if (typeof slide.slideNumber !== 'number' || slide.slideNumber <= 0 || !Number.isInteger(slide.slideNumber)) {
      errors.push({
        path: `${pathPrefix}.slideNumber`,
        message: `Invalid slideNumber "${slide.slideNumber}". Must be a positive integer.`,
      });
    } else {
      if (seenSlideNumbers.has(slide.slideNumber)) {
        errors.push({
          path: `${pathPrefix}.slideNumber`,
          message: `Duplicate slideNumber ${slide.slideNumber} detected.`,
        });
      } else {
        seenSlideNumbers.add(slide.slideNumber);
      }
    }

    // Statistics Source Grounding Check
    if (slide.type === 'statistics') {
      const metrics = Array.isArray(slide.content) ? slide.content : Array.isArray(slide.metrics) ? slide.metrics : [];
      metrics.forEach((m: any, mIdx: number) => {
        const itemSources: string[] = Array.isArray(m.sourceIds) ? m.sourceIds : Array.isArray(slide.sources) ? slide.sources : [];

        if (itemSources.length === 0) {
          errors.push({
            path: `${pathPrefix}.content[${mIdx}].sourceIds`,
            message: `Statistic "${m.number || m.value} ${m.label}" is missing required sourceIds citation!`,
          });
        } else if (validSourceIds) {
          itemSources.forEach((srcId) => {
            if (!validSourceIds.has(srcId)) {
              errors.push({
                path: `${pathPrefix}.content[${mIdx}].sourceIds`,
                message: `Statistic "${m.number || m.value} ${m.label}" references ungrounded source ID "${srcId}".`,
              });
            }
          });
        }
      });
    }

    // Visual Definition Check (if provided)
    if (slide.visual) {
      if (typeof slide.visual !== 'object') {
        errors.push({ path: `${pathPrefix}.visual`, message: 'Visual definition must be an object.' });
      } else if (!['image', 'icon', 'badge', 'panel'].includes(slide.visual.type)) {
        errors.push({
          path: `${pathPrefix}.visual.type`,
          message: `Invalid visual.type "${slide.visual.type}". Must be image, icon, badge, or panel.`,
        });
      }
    }

    // Chart Definition Check (if provided)
    if (slide.chartData) {
      validateChartData(`${pathPrefix}.chartData`, slide.chartData, errors);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    data: errors.length === 0 ? (data as PresentationData) : undefined,
  };
}

function validateChartData(path: string, chartData: any, errors: ValidationError[]): void {
  if (typeof chartData !== 'object' || !chartData) {
    errors.push({ path, message: 'Chart data must be an object.' });
    return;
  }

  if (!['doughnut', 'pie', 'bar', 'line', 'col'].includes(chartData.chartType)) {
    errors.push({ path: `${path}.chartType`, message: `Invalid chartType "${chartData.chartType}".` });
  }

  if (!Array.isArray(chartData.labels)) {
    errors.push({ path: `${path}.labels`, message: 'Chart labels must be an array of strings.' });
  }

  if (!Array.isArray(chartData.values)) {
    errors.push({ path: `${path}.values`, message: 'Chart values must be an array of numbers.' });
  } else if (Array.isArray(chartData.labels) && chartData.values.length !== chartData.labels.length) {
    errors.push({
      path: `${path}.values`,
      message: `Chart values count (${chartData.values.length}) does not match labels count (${chartData.labels.length}).`,
    });
  }
}
