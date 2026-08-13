/**
 * Step 12A — Domain Subject Validator & Negative Terms Filter
 *
 * Enforces hard semantic relevance gates:
 * 1. Identifies broad subject domain (agriculture, environment, society, technology).
 * 2. Enforces negative terms (rejects human diseases/medical context in crop queries).
 * 3. Enforces strict minimum relevance threshold (>= 85).
 * 4. Bounds all scores between 0 and 100.
 */

import { ImageAsset } from './imageTypes';
import { VisualPlan } from '../visuals/visualTypes';

export interface SubjectValidationResult {
  valid: boolean;
  relevanceScore: number;
  domainCompatible: boolean;
  rejectionReasons: string[];
}

export type SubjectDomain = 'agriculture' | 'environment' | 'society' | 'technology' | 'general';

interface DomainRules {
  domain: SubjectDomain;
  requiredKeywords: string[];
  forbiddenKeywords: string[];
}

export function determineSubjectDomain(query: string): DomainRules {
  const qLower = query.toLowerCase();

  if (qLower.includes('crop') || qLower.includes('farm') || qLower.includes('agriculture') || qLower.includes('botany') || qLower.includes('soil')) {
    return {
      domain: 'agriculture',
      requiredKeywords: ['crop', 'farm', 'agriculture', 'plant', 'leaf', 'botany', 'agronomy', 'harvest', 'drone', 'field', 'precision', 'sensor', 'yield', 'fungal', 'pest', 'disease'],
      forbiddenKeywords: ['leprosy', 'medical', 'hospital', 'patient', 'epidemiology', 'human health', 'clinical', 'pathology', 'dermatology', 'skin', 'syndrome', 'cancer', 'military', 'warfare', 'combat'],
    };
  }

  if (qLower.includes('pollution') || qLower.includes('water') || qLower.includes('waste') || qLower.includes('air') || qLower.includes('effluent')) {
    return {
      domain: 'environment',
      requiredKeywords: ['water', 'pollution', 'river', 'discharge', 'effluent', 'waste', 'industrial', 'sewage', 'treatment', 'environmental', 'contaminant', 'toxic', 'lake', 'stream'],
      forbiddenKeywords: ['medical water', 'hospital patient', 'clinical trial', 'military combat'],
    };
  }

  if (qLower.includes('rights') || qLower.includes('law') || qLower.includes('court') || qLower.includes('justice')) {
    return {
      domain: 'society',
      requiredKeywords: ['rights', 'law', 'court', 'justice', 'human', 'legal', 'treaty', 'declaration', 'dignity'],
      forbiddenKeywords: ['military drone', 'warfare combat'],
    };
  }

  return {
    domain: 'general',
    requiredKeywords: [],
    forbiddenKeywords: [],
  };
}

export function validateImageCandidate(
  asset: ImageAsset,
  visualPlan: VisualPlan,
  query: string,
  minRelevanceThreshold: number = 85
): SubjectValidationResult {
  const rejectionReasons: string[] = [];
  const rules = determineSubjectDomain(query);
  const titleText = (asset.title || '').toLowerCase();
  const queryTerms = query.toLowerCase().split(/\s+/).filter((t) => t.length > 2);

  // 1. Negative Terms Check (Hard Rejection)
  for (const forbidden of rules.forbiddenKeywords) {
    if (titleText.includes(forbidden)) {
      rejectionReasons.push(`Contains forbidden cross-domain term "${forbidden}" for domain "${rules.domain}".`);
    }
  }

  // 2. Relevance Score Calculation (Strict 0-100)
  let termMatches = 0;
  queryTerms.forEach((term) => {
    if (titleText.includes(term)) {
      termMatches++;
    }
  });

  // Check required domain keywords
  let domainMatches = 0;
  if (rules.requiredKeywords.length > 0) {
    rules.requiredKeywords.forEach((kw) => {
      if (titleText.includes(kw)) {
        domainMatches++;
      }
    });
  }

  let rawRelevance = 0;
  if (queryTerms.length > 0) {
    const queryMatchRatio = termMatches / queryTerms.length;
    rawRelevance = Math.round(queryMatchRatio * 100);
  } else {
    rawRelevance = domainMatches > 0 ? 85 : 50;
  }

  // Bound relevance score strictly 0 to 100
  const relevanceScore = Math.max(0, Math.min(100, rawRelevance));

  // 3. Domain Compatibility Flag
  const domainCompatible = rejectionReasons.length === 0 && (rules.domain === 'general' || domainMatches > 0 || termMatches >= 1);

  if (!domainCompatible && rules.domain !== 'general') {
    rejectionReasons.push(`Title metadata lacks required domain keywords for "${rules.domain}".`);
  }

  // 4. Minimum Relevance Gate
  if (relevanceScore < minRelevanceThreshold) {
    rejectionReasons.push(`Relevance score ${relevanceScore} is below strict minimum threshold ${minRelevanceThreshold}.`);
  }

  const valid = rejectionReasons.length === 0 && domainCompatible && relevanceScore >= minRelevanceThreshold;

  return {
    valid,
    relevanceScore,
    domainCompatible,
    rejectionReasons,
  };
}
