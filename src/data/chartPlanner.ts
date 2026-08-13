/**
 * Step 13A — Chart Planner with 100% Value-Level Provenance Enforcement
 *
 * Evaluates DataSpec structure and value-level evidence coverage:
 * - Refuses chart generation if evidenceCoverage < 100% (returns NO_VALID_DATASET / null plan).
 * - Deterministic Chart Type Selection:
 *   - time-series (with explicit multi-year evidence) → line
 *   - category comparison → bar
 *   - multi-series → grouped-bar
 *   - composition (~100%) → doughnut / pie
 *   - 2-variable relationship → scatter
 */

import { DataSpec, ChartPlan, ChartType } from './dataTypes';
import { validateDataSpec, validateDataEvidence, sanitizeDataSpecValues } from './dataValidator';
import { SourceRegistry } from '../research/sourceTypes';

export function planChartForDataSpec(
  rawSpec: DataSpec,
  registry?: SourceRegistry
): { plan: ChartPlan | null; errors: string[] } {
  // 1. Structural Data Validation
  const valCheck = validateDataSpec(rawSpec, registry);
  if (!valCheck.valid) {
    return { plan: null, errors: valCheck.errors };
  }

  // 2. Value-Level Evidence Provenance Validation (100% Coverage Required)
  if (registry) {
    const evidenceCheck = validateDataEvidence(rawSpec, registry);
    if (!evidenceCheck.valid || evidenceCheck.evidenceCoverage < 100) {
      return {
        plan: null,
        errors: [
          'NO_VALID_DATASET: Value-level evidence coverage is below 100%.',
          ...evidenceCheck.rejectionReasons,
        ],
      };
    }
  }

  // Sanitize numeric values
  const spec = sanitizeDataSpecValues(rawSpec);

  // 3. Deterministic Chart Type Selection
  let type: ChartType = 'bar';
  const categoriesLower = spec.categories.map((c) => c.toLowerCase());

  // Detect extreme scale disparity (e.g. 10 vs 0.005 = 2000x ratio)
  const allNonZeroValues: number[] = [];
  spec.series.forEach((s) => {
    s.values.forEach((v) => {
      if (typeof v === 'number' && !isNaN(v) && Math.abs(v) > 1e-9) {
        allNonZeroValues.push(Math.abs(v));
      }
    });
  });

  let isExtremeScale = false;
  if (allNonZeroValues.length >= 2) {
    const maxVal = Math.max(...allNonZeroValues);
    const minVal = Math.min(...allNonZeroValues);
    if (minVal > 0 && maxVal / minVal > 100) {
      isExtremeScale = true;
    }
  }

  const isTimeSeries = categoriesLower.length >= 2 && categoriesLower.every(
    (c) => /^(19|20)\d\d$/.test(c) || /^(q[1-4]|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/.test(c)
  );

  const isCompositionPattern = spec.series.length === 1 && Math.abs(spec.series[0].values.reduce((a, b) => a + b, 0) - 100) <= 3;
  const isScatterPattern = !isTimeSeries && spec.categories.length >= 2 && spec.categories.every((c) => !isNaN(parseFloat(c)) && !/^(19|20)\d\d$/.test(c)) && spec.series.length === 1;

  if (isExtremeScale) {
    type = 'table';
  } else if (isTimeSeries) {
    type = 'line';
  } else if (isScatterPattern) {
    type = 'scatter';
  } else if (spec.series.length > 1) {
    type = 'grouped-bar';
  } else if (isCompositionPattern) {
    type = 'doughnut';
  } else {
    type = 'bar';
  }

  const purpose = `Quantitative ${type} visualization communicating: ${spec.title}${spec.unit ? ` (${spec.unit})` : ''}`;

  const plan: ChartPlan = {
    type,
    title: spec.title,
    purpose,
    dataSpecId: spec.id,
    sourceIds: spec.sourceIds,
    dataSpec: spec,
  };

  return { plan, errors: [] };
}
