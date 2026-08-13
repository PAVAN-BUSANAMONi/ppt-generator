/**
 * Slide Registry — maps SlideType to archetype renderers.
 */

import { SlideDefinition } from '../core/types';
import { SlideData, SlideType, SlideRenderer } from './types';

import { renderTitleSlide } from './titleSlide';
import { renderOverviewSlide } from './overviewSlide';
import { renderConceptSlide } from './conceptSlide';
import { renderComparisonSlide } from './comparisonSlide';
import { renderCauseEffectSlide } from './causeEffectSlide';
import { renderStatisticsSlide } from './statisticsSlide';
import { renderProcessSlide } from './processSlide';
import { renderCaseStudySlide } from './caseStudySlide';
import { renderImageStorySlide } from './imageStorySlide';
import { renderTableSlide } from './tableSlide';
import { renderChartSlide } from './chartSlide';
import { renderKeyTakeawaysSlide } from './keyTakeawaysSlide';
import { renderConclusionSlide } from './conclusionSlide';
import { renderReferencesSlide } from './referencesSlide';

export const slideRegistry: Record<SlideType, SlideRenderer<any>> = {
  'title': renderTitleSlide,
  'overview': renderOverviewSlide,
  'concept': renderConceptSlide,
  'comparison': renderComparisonSlide,
  'cause-effect': renderCauseEffectSlide,
  'statistics': renderStatisticsSlide,
  'process': renderProcessSlide,
  'case-study': renderCaseStudySlide,
  'image-story': renderImageStorySlide,
  'table': renderTableSlide,
  'chart': renderChartSlide,
  'takeaways': renderKeyTakeawaysSlide,
  'conclusion': renderConclusionSlide,
  'references': renderReferencesSlide,
};

/**
 * Render any slide definition by looking up its archetype renderer in the registry.
 */
export function renderSlide(data: SlideData): SlideDefinition {
  const renderer = slideRegistry[data.type];
  if (!renderer) {
    throw new Error(`Unknown slide type: '${(data as any).type}'`);
  }
  return renderer(data);
}
