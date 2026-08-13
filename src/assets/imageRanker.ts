/**
 * Step 12A — Image Quality Filter & Semantic Relevance Ranker
 *
 * Enforces hard semantic relevance gates, domain subject compatibility, negative terms,
 * and strictly bounded scores (0-100).
 */

import { ImageAsset, ImageCandidate } from './imageTypes';
import { VisualPlan } from '../visuals/visualTypes';
import { validateImageCandidate, SubjectValidationResult } from './subjectValidator';

export interface EvaluatedCandidate extends ImageCandidate {
  validation: SubjectValidationResult;
  decision: 'ACCEPTED' | 'REJECTED';
  rejectionReasons: string[];
}

export function rankAndFilterImageCandidates(
  assets: ImageAsset[],
  visualPlan: VisualPlan,
  query: string,
  minRelevanceThreshold: number = 85
): EvaluatedCandidate[] {
  const targetAspect = visualPlan.aspectRatio; // landscape, portrait, square
  const evaluated: EvaluatedCandidate[] = [];

  assets.forEach((asset) => {
    // 1. Resolution Filter (reject extremely low resolution < 600px)
    if (asset.width < 600 || asset.height < 600) {
      evaluated.push({
        asset,
        relevanceScore: 0,
        qualityScore: 0,
        orientationScore: 0,
        finalScore: 0,
        validation: { valid: false, relevanceScore: 0, domainCompatible: false, rejectionReasons: ['Resolution below 600px.'] },
        decision: 'REJECTED',
        rejectionReasons: ['Resolution below 600px minimum boundary.'],
      });
      return;
    }

    // 2. Semantic Domain & Relevance Validation (Hard Gate)
    const valResult = validateImageCandidate(asset, visualPlan, query, minRelevanceThreshold);

    // 3. Quality Score (strictly bounded 0 to 100)
    const longEdge = Math.max(asset.width, asset.height);
    let qualityScore = 70;
    if (longEdge >= 1920) qualityScore = 95;
    else if (longEdge >= 1280) qualityScore = 85;

    if (asset.license) qualityScore += 5; // bonus for explicit license
    qualityScore = Math.max(0, Math.min(100, qualityScore));

    // 4. Orientation Score (strictly bounded 0 to 100)
    const ratio = asset.width / asset.height;
    let orientationScore = 70;

    if (targetAspect === 'landscape' && ratio >= 1.2) orientationScore = 100;
    else if (targetAspect === 'portrait' && ratio <= 0.85) orientationScore = 100;
    else if (targetAspect === 'square' && ratio >= 0.85 && ratio <= 1.2) orientationScore = 100;

    orientationScore = Math.max(0, Math.min(100, orientationScore));

    // 5. Final Composite Score (strictly bounded 0 to 100)
    let finalScore = Math.round(
      valResult.relevanceScore * 0.45 + qualityScore * 0.3 + orientationScore * 0.25
    );
    finalScore = Math.max(0, Math.min(100, finalScore));

    // Hard Gate Rule: If semantic relevance / domain fails, candidate is HARD REJECTED
    const isAccepted = valResult.valid && valResult.domainCompatible && valResult.relevanceScore >= minRelevanceThreshold;

    evaluated.push({
      asset,
      relevanceScore: valResult.relevanceScore,
      qualityScore,
      orientationScore,
      finalScore: isAccepted ? finalScore : 0, // Final score force-zeroed if rejected by semantic gate
      validation: valResult,
      decision: isAccepted ? 'ACCEPTED' : 'REJECTED',
      rejectionReasons: valResult.rejectionReasons,
    });
  });

  return evaluated.sort((a, b) => b.finalScore - a.finalScore);
}
