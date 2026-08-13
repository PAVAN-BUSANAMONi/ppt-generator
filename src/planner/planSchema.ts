/**
 * Step 9 — Presentation Plan Schema
 *
 * Defines the strict PresentationPlan, SectionPlan, and SlidePlan schema interfaces.
 */

import { SlideType, VisualDensity } from '../slides/types';

export type VisualIntentType = 'none' | 'image' | 'diagram' | 'chart' | 'table' | 'timeline' | 'mixed';

export interface SectionPlan {
  id: string;
  title: string;
  purpose: string;
  slideNumbers: number[];
}

export interface SlidePlan {
  slideNumber: number;
  sectionId: string;
  type: SlideType;
  title: string;
  purpose: string;
  keyQuestion?: string;
  keyMessage: string;
  density: VisualDensity;
  visualIntent: VisualIntentType;
  dataIntent: boolean;
}

export interface PresentationPlan {
  title: string;
  subtitle?: string;
  sections: SectionPlan[];
  slides: SlidePlan[];
}

export interface PlannerInput {
  topic: string;
  slideCount?: number;
  audience?: string;
  purpose?: string;
  depth?: string;
  specialInstructions?: string;
}
