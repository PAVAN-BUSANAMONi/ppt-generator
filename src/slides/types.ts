/**
 * Slide Archetype Types & Data Structures.
 *
 * 14 Topic-Agnostic Archetypes:
 * - title
 * - overview
 * - concept
 * - comparison
 * - cause-effect
 * - statistics
 * - process
 * - case-study
 * - image-story
 * - table
 * - chart
 * - takeaways
 * - conclusion
 * - references
 */

import { Theme } from '../design/theme';
import { SlideDefinition } from '../core/types';
import { VisualPlan } from '../visuals/visualTypes';

export type SlideType =
  | 'title'
  | 'overview'
  | 'concept'
  | 'comparison'
  | 'cause-effect'
  | 'statistics'
  | 'process'
  | 'case-study'
  | 'image-story'
  | 'table'
  | 'chart'
  | 'takeaways'
  | 'conclusion'
  | 'references';

export type VisualDensity = 'light' | 'medium' | 'dense';

export interface BaseSlideData {
  id: string;
  type: SlideType;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  notes?: string;
  slideNumber?: number;
  totalSlides?: number;
  theme?: Theme;
  /** Visual density control: 'light' (spacious), 'medium' (balanced), 'dense' (information-rich) */
  density?: VisualDensity;
  /** Layout variant key to vary component placement (e.g. 'image-right', 'three-cards', 'split') */
  layoutVariant?: string;
  /** Intelligent Visual Director decision plan */
  visualPlan?: VisualPlan;
}

// ---------------------------------------------------------------------------
// 1. Title Slide Data
// ---------------------------------------------------------------------------
export interface TitleSlideData extends BaseSlideData {
  type: 'title';
  author?: string;
  date?: string;
  dark?: boolean;
  image?: string;
}

// ---------------------------------------------------------------------------
// 2. Overview Slide Data
// ---------------------------------------------------------------------------
export interface OverviewSlideData extends BaseSlideData {
  type: 'overview';
  agendaItems: Array<{
    number?: string;
    title: string;
    description: string;
    icon?: string;
  }>;
}

// ---------------------------------------------------------------------------
// 3. Concept Slide Data
// ---------------------------------------------------------------------------
export interface ConceptSlideData extends BaseSlideData {
  type: 'concept';
  mainConcept: {
    title: string;
    description: string;
  };
  cards: Array<{
    icon?: string;
    title: string;
    body: string;
  }>;
}

// ---------------------------------------------------------------------------
// 4. Comparison Slide Data
// ---------------------------------------------------------------------------
export interface ComparisonSlideData extends BaseSlideData {
  type: 'comparison';
  leftPanel: {
    title: string;
    subtitle?: string;
    points: string[];
    accentColor?: string;
  };
  rightPanel: {
    title: string;
    subtitle?: string;
    points: string[];
    accentColor?: string;
  };
}

// ---------------------------------------------------------------------------
// 5. Cause & Effect Slide Data
// ---------------------------------------------------------------------------
export interface CauseEffectSlideData extends BaseSlideData {
  type: 'cause-effect';
  causes: Array<{ title: string; description: string }>;
  mechanism: string;
  effects: Array<{ title: string; description: string }>;
}

// ---------------------------------------------------------------------------
// 6. Statistics Slide Data
// ---------------------------------------------------------------------------
export interface StatisticsSlideData extends BaseSlideData {
  type: 'statistics';
  metrics: Array<{
    number: string;
    label: string;
    explanation?: string;
    sourceIds?: string[];
  }>;
}

// ---------------------------------------------------------------------------
// 7. Process Slide Data
// ---------------------------------------------------------------------------
export interface ProcessSlideData extends BaseSlideData {
  type: 'process';
  steps: Array<{
    stepNumber: number;
    title: string;
    description: string;
    icon?: string;
  }>;
}

// ---------------------------------------------------------------------------
// 8. Case Study Slide Data
// ---------------------------------------------------------------------------
export interface CaseStudySlideData extends BaseSlideData {
  type: 'case-study';
  context: string;
  challenge: string;
  solution: string;
  result: string;
  image?: string;
}

// ---------------------------------------------------------------------------
// 9. Image Story Slide Data
// ---------------------------------------------------------------------------
export interface ImageStorySlideData extends BaseSlideData {
  type: 'image-story';
  image?: string;
  caption?: string;
  storyPoints: string[];
}

// ---------------------------------------------------------------------------
// 10. Table Slide Data
// ---------------------------------------------------------------------------
export interface TableSlideData extends BaseSlideData {
  type: 'table';
  headers: string[];
  rows: string[][];
  keyTakeaway?: string;
  chartData?: {
    chartType: 'doughnut' | 'pie' | 'bar' | 'line' | 'col';
    title?: string;
    labels: string[];
    values: number[];
    colors?: string[];
  };
}

// ---------------------------------------------------------------------------
// 11. Chart Slide Data
// ---------------------------------------------------------------------------
export interface ChartSlideData extends BaseSlideData {
  type: 'chart';
  chartDescription: string;
  keyInsights: string[];
  chartData?: {
    chartType: 'doughnut' | 'pie' | 'bar' | 'line' | 'col';
    title?: string;
    labels: string[];
    values: number[];
    colors?: string[];
  };
}

// ---------------------------------------------------------------------------
// 12. Key Takeaways Slide Data
// ---------------------------------------------------------------------------
export interface KeyTakeawaysSlideData extends BaseSlideData {
  type: 'takeaways';
  takeaways: Array<{
    number: number;
    title: string;
    description: string;
  }>;
}

// ---------------------------------------------------------------------------
// 13. Conclusion Slide Data
// ---------------------------------------------------------------------------
export interface ConclusionSlideData extends BaseSlideData {
  type: 'conclusion';
  summaryText: string;
  finalCallToAction?: string;
  dark?: boolean;
}

// ---------------------------------------------------------------------------
// 14. References Slide Data
// ---------------------------------------------------------------------------
export interface ReferencesSlideData extends BaseSlideData {
  type: 'references';
  references: Array<{
    title: string;
    source: string;
    year?: string | number;
    link?: string;
  }>;
}

// ---------------------------------------------------------------------------
// Union of all slide data interfaces
// ---------------------------------------------------------------------------
export type SlideData =
  | TitleSlideData
  | OverviewSlideData
  | ConceptSlideData
  | ComparisonSlideData
  | CauseEffectSlideData
  | StatisticsSlideData
  | ProcessSlideData
  | CaseStudySlideData
  | ImageStorySlideData
  | TableSlideData
  | ChartSlideData
  | KeyTakeawaysSlideData
  | ConclusionSlideData
  | ReferencesSlideData;

/**
 * Slide Archetype Renderer function signature.
 */
export type SlideRenderer<T extends SlideData = SlideData> = (
  data: T
) => SlideDefinition;
