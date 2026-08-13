/**
 * Step 11 — Visual Director Types
 *
 * Defines VisualPlan interface and supported visual parameters.
 */

export type VisualType =
  | 'none'
  | 'photo'
  | 'illustration'
  | 'diagram'
  | 'chart'
  | 'table'
  | 'timeline'
  | 'process'
  | 'comparison'
  | 'icon-grid'
  | 'mixed';

export type VisualPlacement = 'left' | 'right' | 'full' | 'top' | 'bottom';
export type VisualImportance = 'primary' | 'supporting';
export type VisualAspectRatio = 'landscape' | 'portrait' | 'square';

export interface VisualPlan {
  type: VisualType;
  purpose: string;
  relevanceQuery?: string;
  placement: VisualPlacement;
  importance: VisualImportance;
  aspectRatio: VisualAspectRatio;
}
