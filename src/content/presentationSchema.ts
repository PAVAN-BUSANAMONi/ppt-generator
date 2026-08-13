/**
 * Step 7 & 11 — Structured Content Schema
 *
 * Defines the strict TypeScript PresentationData model, discriminated slide unions, and VisualPlan integration.
 */

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

export interface VisualDefinition {
  type: 'image' | 'icon' | 'badge' | 'panel';
  placement?: 'left' | 'right' | 'center' | 'top' | 'bottom';
  src?: string;
  iconName?: string;
  caption?: string;
}

export interface ChartDefinition {
  chartType: 'doughnut' | 'pie' | 'bar' | 'line' | 'col';
  title?: string;
  labels: string[];
  values: number[];
  colors?: string[];
}

export interface ContentSection {
  title?: string;
  body: string;
  icon?: string;
}

// ---------------------------------------------------------------------------
// Base Slide Schema
// ---------------------------------------------------------------------------

export interface BaseSlideSchema {
  id: string;
  slideNumber: number;
  type: SlideType;
  title: string;
  subtitle?: string;
  keyMessage?: string;
  density?: VisualDensity;
  speakerNotes?: string;
  sources?: string[];
  visualPlan?: VisualPlan;
}

// ---------------------------------------------------------------------------
// Discriminated Slide Unions
// ---------------------------------------------------------------------------

export interface TitleSlideSchema extends BaseSlideSchema {
  type: 'title';
  author?: string;
  date?: string;
  dark?: boolean;
  visual?: VisualDefinition;
}

export interface OverviewSlideSchema extends BaseSlideSchema {
  type: 'overview';
  content: Array<{
    number?: string;
    title: string;
    body: string;
    icon?: string;
  }>;
}

export interface ConceptSlideSchema extends BaseSlideSchema {
  type: 'concept';
  content: {
    mainConcept: { title: string; body: string };
    cards: Array<{ title: string; body: string; icon?: string }>;
  };
  visual?: VisualDefinition;
}

export interface ComparisonSlideSchema extends BaseSlideSchema {
  type: 'comparison';
  content: {
    leftPanel: { title: string; points: string[]; accentColor?: string };
    rightPanel: { title: string; points: string[]; accentColor?: string };
  };
}

export interface CauseEffectSlideSchema extends BaseSlideSchema {
  type: 'cause-effect';
  content: {
    causes: Array<{ title: string; body: string }>;
    mechanism: string;
    effects: Array<{ title: string; body: string }>;
  };
}

export interface StatisticsSlideSchema extends BaseSlideSchema {
  type: 'statistics';
  content: Array<{
    number: string;
    label: string;
    body?: string;
    sourceIds?: string[];
  }>;
}

export interface ProcessSlideSchema extends BaseSlideSchema {
  type: 'process';
  content: Array<{
    stepNumber: number;
    title: string;
    body: string;
    icon?: string;
  }>;
}

export interface CaseStudySlideSchema extends BaseSlideSchema {
  type: 'case-study';
  content: {
    context: string;
    challenge: string;
    solution: string;
    result: string;
  };
  visual?: VisualDefinition;
}

export interface ImageStorySlideSchema extends BaseSlideSchema {
  type: 'image-story';
  visual: VisualDefinition;
  content: string[]; // Story points
}

export interface TableSlideSchema extends BaseSlideSchema {
  type: 'table';
  data: {
    headers: string[];
    rows: string[][];
    keyTakeaway?: string;
  };
  chartData?: ChartDefinition;
}

export interface ChartSlideSchema extends BaseSlideSchema {
  type: 'chart';
  chartData: ChartDefinition;
  content: string[]; // Insights
}

export interface TakeawaysSlideSchema extends BaseSlideSchema {
  type: 'takeaways';
  content: Array<{
    number: number;
    title: string;
    body: string;
  }>;
}

export interface ConclusionSlideSchema extends BaseSlideSchema {
  type: 'conclusion';
  content: {
    summaryText: string;
    callToAction?: string;
  };
  dark?: boolean;
}

export interface ReferencesSlideSchema extends BaseSlideSchema {
  type: 'references';
  content: Array<{
    title: string;
    source: string;
    year?: string | number;
    link?: string;
  }>;
}

export type SlideSchema =
  | TitleSlideSchema
  | OverviewSlideSchema
  | ConceptSlideSchema
  | ComparisonSlideSchema
  | CauseEffectSlideSchema
  | StatisticsSlideSchema
  | ProcessSlideSchema
  | CaseStudySlideSchema
  | ImageStorySchema
  | TableSlideSchema
  | ChartSlideSchema
  | TakeawaysSlideSchema
  | ConclusionSlideSchema
  | ReferencesSlideSchema;

export type ImageStorySchema = ImageStorySlideSchema;

// ---------------------------------------------------------------------------
// Root PresentationData Schema
// ---------------------------------------------------------------------------

export interface PresentationData {
  presentation: {
    title: string;
    subtitle?: string;
    author?: string;
    date?: string;
    theme?: string;
  };
  slides: SlideSchema[];
}
