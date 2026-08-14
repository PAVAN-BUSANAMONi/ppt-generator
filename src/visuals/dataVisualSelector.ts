/**
 * Step 11 — Intelligent Data Visual Selector
 *
 * Evaluates quantitative DataSpecs, semantic properties, data scale disparity,
 * and cognitive clarity rules to deterministically select the optimal visual representation:
 *
 * ├── bar chart          (discrete categorical comparisons with uniform scale)
 * ├── line chart         (time-series or temporal progression)
 * ├── grouped chart      (multi-series attributes compared across categories)
 * ├── stat cards         (2-4 high-impact headline metrics where big numbers provide greater punch)
 * ├── table              (multi-dimensional attributes, diverse units, or >50x scale disparity)
 * ├── timeline           (chronological milestone progressions)
 * ├── process diagram    (sequential operational workflows)
 * └── comparison graphic (dual-paradigm side-by-side evaluation)
 *
 * Graphic Hierarchy Rule:
 * Every slide has ONE primary visual occupying the dominant canvas region.
 * Supporting visuals (like takeaways or source footers) remain secondary.
 */

import { DataSpec } from '../data/dataTypes';

export type VisualRepresentationKind =
  | 'bar-chart'
  | 'line-chart'
  | 'grouped-chart'
  | 'stat-cards'
  | 'table'
  | 'timeline'
  | 'process-diagram'
  | 'comparison-graphic';

export interface VisualSelectionResult {
  dataSpecId: string;
  dataSpecTitle: string;
  sourceIds: string[];
  chosenVisual: VisualRepresentationKind;
  reason: string;
  primaryVisualHierarchy: string;
  secondaryVisuals: string[];
  recommendedSlideArchetype: 'statistics' | 'table' | 'process' | 'comparison' | 'concept';
}

export interface SelectionContext {
  topic: string;
  slidePurpose?: 'benchmark' | 'comparison' | 'process' | 'performance' | 'standards' | 'general';
  targetAudience?: 'executive' | 'technical' | 'regulatory';
  preferredKind?: VisualRepresentationKind;
}

export function selectDataVisual(
  dataSpec: DataSpec,
  context: SelectionContext
): VisualSelectionResult {
  const categoriesLower = dataSpec.categories.map((c) => c.toLowerCase());
  const seriesCount = dataSpec.series.length;
  const numCategories = dataSpec.categories.length;

  // 1. Analyze numeric scale disparity
  const allNonZeroValues: number[] = [];
  dataSpec.series.forEach((s) => {
    s.values.forEach((v) => {
      if (typeof v === 'number' && !isNaN(v) && Math.abs(v) > 1e-9) {
        allNonZeroValues.push(Math.abs(v));
      }
    });
  });

  let maxScaleRatio = 1;
  if (allNonZeroValues.length >= 2) {
    const maxVal = Math.max(...allNonZeroValues);
    const minVal = Math.min(...allNonZeroValues);
    if (minVal > 0) {
      maxScaleRatio = maxVal / minVal;
    }
  }

  // 2. Check for time series patterns
  const isTimeSeries =
    numCategories >= 2 &&
    categoriesLower.every(
      (c) => /^(19|20)\d\d$/.test(c) || /^(q[1-4]|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/.test(c)
    );

  // 3. Decision Logic

  // Case A: Extreme scale disparity (> 50x) or Multi-attribute Regulatory Standards -> TABLE
  if (maxScaleRatio > 50 || dataSpec.id.includes('mcl') || dataSpec.id.includes('standard')) {
    return {
      dataSpecId: dataSpec.id,
      dataSpecTitle: dataSpec.title,
      sourceIds: dataSpec.sourceIds,
      chosenVisual: 'table',
      reason: `Extreme scale ratio (${maxScaleRatio.toFixed(1)}x disparity between minimum ${Math.min(
        ...allNonZeroValues
      )} and maximum ${Math.max(
        ...allNonZeroValues
      )}) renders standard charts illegible (smaller values flatten to 0 px). A structured regulatory Table preserves precision and text qualifiers.`,
      primaryVisualHierarchy: 'Structured Table (Left/Main 60-70% content width)',
      secondaryVisuals: ['Full-width key takeaway banner', 'Regulatory source footer'],
      recommendedSlideArchetype: 'table',
    };
  }

  // Case B: Time-Series Progression -> LINE CHART
  if (isTimeSeries) {
    return {
      dataSpecId: dataSpec.id,
      dataSpecTitle: dataSpec.title,
      sourceIds: dataSpec.sourceIds,
      chosenVisual: 'line-chart',
      reason: 'Categories follow chronological time series; line chart highlights longitudinal slope, trajectories, and inflection points.',
      primaryVisualHierarchy: 'Time-Series Line Chart (Dominant central visual)',
      secondaryVisuals: ['Key trend callout takeaway'],
      recommendedSlideArchetype: 'table',
    };
  }

  // Case C: Multi-Series Paired Metrics (e.g. Sensitivity vs Specificity) -> GROUPED CHART / TABLE
  if (seriesCount > 1 && numCategories <= 6) {
    return {
      dataSpecId: dataSpec.id,
      dataSpecTitle: dataSpec.title,
      sourceIds: dataSpec.sourceIds,
      chosenVisual: 'grouped-chart',
      reason: `Multi-series dataset with ${seriesCount} series across ${numCategories} categories. Paired grouped visual enables direct side-by-side comparison across modalities without visual clutter.`,
      primaryVisualHierarchy: 'Paired Comparison Visual / Benchmark Matrix',
      secondaryVisuals: ['Clinical takeaway banner', 'Evidence source citation'],
      recommendedSlideArchetype: 'table',
    };
  }

  // Case D: Headline Benchmark Metrics (2 to 4 discrete impact stats) -> STAT CARDS
  if (
    (dataSpec.statisticKind === 'single-statistic' ||
      (numCategories >= 2 && numCategories <= 4 && seriesCount === 1 && context.slidePurpose === 'benchmark')) &&
    context.preferredKind !== 'bar-chart'
  ) {
    return {
      dataSpecId: dataSpec.id,
      dataSpecTitle: dataSpec.title,
      sourceIds: dataSpec.sourceIds,
      chosenVisual: 'stat-cards',
      reason: `Headline benchmark dataset containing ${numCategories} high-impact metric callouts. Large stat cards deliver immediate executive scannability and clear contextual explanations without chart overhead.`,
      primaryVisualHierarchy: 'High-Contrast Metric Stat Cards Grid (Equal-weight cards across content width)',
      secondaryVisuals: ['Contextual metric labels', 'Source provenance footer'],
      recommendedSlideArchetype: 'statistics',
    };
  }

  // Case E: Dual-Paradigm / Framework Comparison -> COMPARISON GRAPHIC
  if (context.slidePurpose === 'comparison' || dataSpec.id.includes('comparison')) {
    return {
      dataSpecId: dataSpec.id,
      dataSpecTitle: dataSpec.title,
      sourceIds: dataSpec.sourceIds,
      chosenVisual: 'comparison-graphic',
      reason: 'Comparative evaluation between two operational or regulatory paradigms; dual-panel comparison cards highlight trade-offs.',
      primaryVisualHierarchy: 'Dual-Column Comparative Cards (50/50 split width)',
      secondaryVisuals: ['Distinctive accent headers', 'Takeaway banner'],
      recommendedSlideArchetype: 'comparison',
    };
  }

  // Case F: Default Categorical Comparison -> BAR CHART
  return {
    dataSpecId: dataSpec.id,
    dataSpecTitle: dataSpec.title,
    sourceIds: dataSpec.sourceIds,
    chosenVisual: 'bar-chart',
    reason: `Uniform single-series categorical comparison across ${numCategories} categories. Bar chart provides optimal horizontal scannability and proportional value contrast.`,
    primaryVisualHierarchy: 'Categorical Bar Chart (Dominant visual container)',
    secondaryVisuals: ['Key takeaway box', 'Data provenance footer'],
    recommendedSlideArchetype: 'table',
  };
}
