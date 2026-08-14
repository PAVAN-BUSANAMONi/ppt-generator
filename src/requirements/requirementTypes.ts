/**
 * STEP 25 — PRESENTATION REQUIREMENTS CONTRACT
 *
 * Defines the strict contract for user requirements, visual rules,
 * content depth, quality thresholds, and structural blueprints.
 */

import { SlideTransitionType } from '../export/transitionEnhancer';
import { UniversalTopicContext } from '../core/topicContext';

export type AudienceType = 'executive' | 'technical' | 'academic' | 'general' | 'practitioner';
export type PurposeType = 'briefing' | 'educational' | 'persuasion' | 'technical-deepdive' | 'governance-policy';
export type DepthType = 'overview' | 'standard' | 'deep' | 'comprehensive';

export interface VisualRequirements {
  images: 'auto' | 'required' | 'none';
  charts: 'auto' | 'required' | 'none';
  tables: 'auto' | 'required' | 'none';
  diagrams: 'auto' | 'required' | 'none';
  speakerNotes: boolean;
  references: boolean;
}

export interface PresentationRequirements {
  topic: string;
  audience: AudienceType;
  purpose: PurposeType;
  depth: DepthType;
  slideCount: number;
  author?: string;
  userInstructions?: string;
  visualRequirements: VisualRequirements;
  transition?: SlideTransitionType;
  outputPath?: string;
  rendersDir?: string;
}

export interface SectionBlueprint {
  sectionNumber: number;
  title: string;
  purpose: string;
  slideNumbers: number[];
}

export interface SlideBlueprint {
  slideNumber: number;
  sectionName: string;
  archetype: string;
  title: string;
  purpose: string;
  keyQuestion: string;
  keyMessage: string;
  contentDepth: DepthType;
  dataIntent: 'chart' | 'table' | 'statistics' | 'none';
  visualIntent: 'hero-photo' | 'concept-diagram' | 'process-workflow' | 'case-photo' | 'none';
  requiredTerms: string[];
  speakerNotesGuidance: string;
  sourceReferences: string[];
}

export interface PresentationBlueprint {
  requirements: PresentationRequirements;
  topicContext: UniversalTopicContext;
  sections: SectionBlueprint[];
  slideBlueprints: SlideBlueprint[];
}

export interface RequirementScoreReport {
  topic: string;
  totalScore: number;
  maxScore: number;
  passed: boolean;
  breakdown: {
    sections: { score: number; max: number; passed: boolean; details: string };
    contentDepth: { score: number; max: number; passed: boolean; details: string };
    speakerNotes: { score: number; max: number; passed: boolean; details: string };
    references: { score: number; max: number; passed: boolean; details: string };
    images: { score: number; max: number; passed: boolean; details: string };
    charts: { score: number; max: number; passed: boolean; details: string };
    tables: { score: number; max: number; passed: boolean; details: string };
    diagrams: { score: number; max: number; passed: boolean; details: string };
    layoutQA: { score: number; max: number; passed: boolean; details: string };
    powerpoint: { score: number; max: number; passed: boolean; details: string };
  };
  failedRequirements: string[];
}
