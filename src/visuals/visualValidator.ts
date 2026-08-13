/**
 * Step 11 — Visual Plan Validator
 *
 * Validates VisualPlan objects for structural consistency and parameter constraints.
 */

import { VisualPlan, VisualType, VisualPlacement, VisualImportance, VisualAspectRatio } from './visualTypes';

export interface VisualValidationResult {
  valid: boolean;
  errors: string[];
}

const SUPPORTED_TYPES: VisualType[] = [
  'none',
  'photo',
  'illustration',
  'diagram',
  'chart',
  'table',
  'timeline',
  'process',
  'comparison',
  'icon-grid',
  'mixed',
];

const SUPPORTED_PLACEMENTS: VisualPlacement[] = ['left', 'right', 'full', 'top', 'bottom'];
const SUPPORTED_IMPORTANCES: VisualImportance[] = ['primary', 'supporting'];
const SUPPORTED_ASPECTS: VisualAspectRatio[] = ['landscape', 'portrait', 'square'];

export function validateVisualPlan(plan: any): VisualValidationResult {
  const errors: string[] = [];

  if (!plan || typeof plan !== 'object') {
    return { valid: false, errors: ['VisualPlan must be a non-null object.'] };
  }

  // Type check
  if (!plan.type || !SUPPORTED_TYPES.includes(plan.type)) {
    errors.push(`Unsupported visual type "${plan.type}". Allowed: ${SUPPORTED_TYPES.join(', ')}`);
  }

  // Purpose check
  if (!plan.purpose || typeof plan.purpose !== 'string') {
    errors.push('VisualPlan requires a non-empty purpose string.');
  }

  // Placement check
  if (!plan.placement || !SUPPORTED_PLACEMENTS.includes(plan.placement)) {
    errors.push(`Unsupported placement "${plan.placement}". Allowed: ${SUPPORTED_PLACEMENTS.join(', ')}`);
  }

  // Importance check
  if (!plan.importance || !SUPPORTED_IMPORTANCES.includes(plan.importance)) {
    errors.push(`Unsupported importance "${plan.importance}". Allowed: ${SUPPORTED_IMPORTANCES.join(', ')}`);
  }

  // Aspect ratio check
  if (!plan.aspectRatio || !SUPPORTED_ASPECTS.includes(plan.aspectRatio)) {
    errors.push(`Unsupported aspectRatio "${plan.aspectRatio}". Allowed: ${SUPPORTED_ASPECTS.join(', ')}`);
  }

  // Ensure zero visual coordinates are present
  if ('x' in plan || 'y' in plan || 'width' in plan || 'height' in plan) {
    errors.push('VisualPlan must NEVER contain positional coordinates (x, y, width, height).');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
