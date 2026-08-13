/**
 * Step 13A — Value-Level Data Evidence Validator
 *
 * Enforces value-level data provenance:
 * 1. Every numeric point must have sourceIds.length > 0 and exist in SourceRegistry.
 * 2. Every point must have explicit evidence text supporting the exact category and numeric value.
 * 3. Prohibits manufactured / interpolated time-series trends where year-specific evidence is missing.
 * 4. Requires 100% evidence coverage for chart approval.
 */

import { DataSpec, DataPointEvidence } from './dataTypes';
import { SourceRegistry } from '../research/sourceTypes';

export interface EvidenceValidationResult {
  valid: boolean;
  invalidPoints: string[];
  evidenceCoverage: number; // 0 to 100%
  rejectionReasons: string[];
}

export interface DataValidationResult {
  valid: boolean;
  errors: string[];
}

export function validateDataSpec(
  spec: DataSpec,
  registry?: SourceRegistry
): DataValidationResult {
  const errors: string[] = [];

  if (!spec || typeof spec !== 'object') {
    return { valid: false, errors: ['DataSpec must be a non-null object.'] };
  }

  if (!spec.id || typeof spec.id !== 'string') {
    errors.push('DataSpec requires a valid non-empty id string.');
  }

  if (!spec.title || typeof spec.title !== 'string') {
    errors.push('DataSpec requires a valid non-empty title string.');
  }

  if (!spec.sourceIds || !Array.isArray(spec.sourceIds) || spec.sourceIds.length === 0) {
    errors.push('DataSpec must provide non-empty sourceIds.');
  }

  if (registry && spec.sourceIds) {
    const knownSourceIds = new Set(registry.sources.map((s) => s.id));
    spec.sourceIds.forEach((sId) => {
      if (!knownSourceIds.has(sId)) {
        errors.push(`Source ID "${sId}" does not exist in research registry (fabricated source error).`);
      }
    });
  }

  if (!spec.categories || !Array.isArray(spec.categories) || spec.categories.length === 0) {
    errors.push('DataSpec must contain a non-empty categories array.');
  } else {
    const catSet = new Set<string>();
    spec.categories.forEach((cat, i) => {
      if (typeof cat !== 'string' || cat.trim() === '') {
        errors.push(`Category at index ${i} must be a non-empty string.`);
      }
      if (catSet.has(cat)) {
        errors.push(`Duplicate category "${cat}" detected at index ${i}.`);
      }
      catSet.add(cat);
    });
  }

  if (!spec.series || !Array.isArray(spec.series) || spec.series.length === 0) {
    errors.push('DataSpec must contain a non-empty series array.');
  } else {
    spec.series.forEach((s, idx) => {
      if (!s.name || typeof s.name !== 'string' || s.name.trim() === '') {
        errors.push(`Series at index ${idx} requires a valid non-empty name.`);
      }

      if (!s.values || !Array.isArray(s.values)) {
        errors.push(`Series "${s.name || idx}" must contain a values array.`);
        return;
      }

      if (spec.categories && s.values.length !== spec.categories.length) {
        errors.push(
          `Series "${s.name}" values length (${s.values.length}) does not match categories length (${spec.categories.length}).`
        );
      }

      s.values.forEach((v, valIdx) => {
        if (typeof v !== 'number' || isNaN(v) || !isFinite(v)) {
          errors.push(`Series "${s.name}" contains non-numeric / invalid value at index ${valIdx}: ${v}`);
        }
      });
    });
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validates value-level evidence provenance against research registry.
 */
export function validateDataEvidence(
  spec: DataSpec,
  registry: SourceRegistry
): EvidenceValidationResult {
  const invalidPoints: string[] = [];
  const rejectionReasons: string[] = [];

  const knownSourceIds = new Set(registry.sources.map((s) => s.id));
  const points = spec.dataPoints || [];
  const totalPoints = points.length;

  if (totalPoints === 0) {
    return {
      valid: false,
      invalidPoints: spec.categories || [],
      evidenceCoverage: 0,
      rejectionReasons: ['DataSpec does not contain dataPoints evidence records.'],
    };
  }

  let supportedPointsCount = 0;

  points.forEach((dp) => {
    let pointValid = true;

    // 1. Check point sourceIds
    if (!dp.sourceIds || dp.sourceIds.length === 0) {
      pointValid = false;
      rejectionReasons.push(`Point "${dp.category}": missing sourceIds.`);
    } else {
      for (const sId of dp.sourceIds) {
        if (!knownSourceIds.has(sId)) {
          pointValid = false;
          rejectionReasons.push(`Point "${dp.category}": sourceId "${sId}" not in registry.`);
        }
      }
    }

    // 2. Check value existence
    if (typeof dp.value !== 'number' || isNaN(dp.value) || !isFinite(dp.value)) {
      pointValid = false;
      rejectionReasons.push(`Point "${dp.category}": invalid non-numeric value ${dp.value}.`);
    }

    // 3. Check explicit evidence record / evidenceText
    if (!dp.evidenceText || dp.evidenceText.trim() === '') {
      pointValid = false;
      rejectionReasons.push(`Point "${dp.category}": unsupported value (${dp.value}). Source does not provide year/category specific evidence text.`);
    }

    if (pointValid) {
      supportedPointsCount++;
    } else {
      invalidPoints.push(dp.category);
    }
  });

  const evidenceCoverage = Math.round((supportedPointsCount / totalPoints) * 100);
  const valid = evidenceCoverage === 100 && invalidPoints.length === 0;

  return {
    valid,
    invalidPoints,
    evidenceCoverage,
    rejectionReasons,
  };
}

export function sanitizeDataSpecValues(spec: DataSpec): DataSpec {
  return {
    ...spec,
    series: spec.series.map((s) => ({
      ...s,
      values: s.values.map((v) => Math.round(v * 1000) / 1000),
    })),
  };
}
