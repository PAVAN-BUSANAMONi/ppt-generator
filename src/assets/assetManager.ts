/**
 * Step 12A — Asset Manager with Semantic Relevance Enforcement
 *
 * End-to-end image asset orchestration pipeline:
 * VisualPlan → query → providers → candidate list → semantic domain validation → ranking → best asset → cache → attribution
 */

import { VisualPlan } from '../visuals/visualTypes';
import { ImageAsset, AttributionRecord } from './imageTypes';
import { searchImages } from './imageSearch';
import { rankAndFilterImageCandidates, EvaluatedCandidate } from './imageRanker';
import { cacheImageAsset } from './imageCache';
import { recordAttribution } from './attribution';

export interface ResolveAssetResult {
  asset: ImageAsset | null;
  candidate?: EvaluatedCandidate;
  allEvaluatedCandidates?: EvaluatedCandidate[];
  attribution?: AttributionRecord;
}

export class AssetManager {
  private usedAssetIds: Set<string> = new Set();
  private verbose: boolean = false;

  constructor(options?: { verbose?: boolean }) {
    this.verbose = options?.verbose ?? false;
  }

  /**
   * Reset presentation scope to allow fresh image selections per deck.
   */
  resetScope(): void {
    this.usedAssetIds.clear();
  }

  /**
   * Resolves, ranks, validates domain compatibility, caches, and records attribution for a VisualPlan.
   */
  async resolveImageForVisualPlan(
    visualPlan: VisualPlan,
    presentationTopic: string,
    minRelevanceThreshold: number = 85
  ): Promise<ResolveAssetResult> {
    if (visualPlan.type !== 'photo' && visualPlan.type !== 'mixed') {
      return { asset: null };
    }

    const query = visualPlan.relevanceQuery || `${presentationTopic} ${visualPlan.purpose}`;
    const rawAssets = await searchImages(query, 10);

    if (rawAssets.length === 0) {
      return { asset: null };
    }

    // Rank & Filter candidates with semantic domain hard gate
    const evaluatedCandidates = rankAndFilterImageCandidates(rawAssets, visualPlan, query, minRelevanceThreshold);

    if (this.verbose) {
      console.log(`\n[AssetManager] Evaluated ${evaluatedCandidates.length} candidates for query: "${query}" (Min Threshold=${minRelevanceThreshold}):`);
      evaluatedCandidates.forEach((c, i) => {
        console.log(`  Candidate ${i + 1}: [${c.asset.id}] "${c.asset.title}"`);
        console.log(`    Relevance: ${c.relevanceScore} | Quality: ${c.qualityScore} | Orientation: ${c.orientationScore} | Final: ${c.finalScore}`);
        console.log(`    Domain Compatible: ${c.validation.domainCompatible} | Decision: ${c.decision}`);
        if (c.rejectionReasons.length > 0) {
          console.log(`    Rejection Reasons: ${c.rejectionReasons.join('; ')}`);
        }
      });
    }

    // Find top ACCEPTED candidate not already used in this deck
    const bestCandidate = evaluatedCandidates.find(
      (c) => c.decision === 'ACCEPTED' && !this.usedAssetIds.has(c.asset.id)
    );

    if (!bestCandidate) {
      if (this.verbose) {
        console.warn(`⚠️ No candidate passed semantic domain validation for query "${query}". All candidates REJECTED.\n`);
      }
      return { asset: null, allEvaluatedCandidates: evaluatedCandidates };
    }

    this.usedAssetIds.add(bestCandidate.asset.id);

    // Download & Cache asset locally in work/assets/
    const cachedAsset = await cacheImageAsset(bestCandidate.asset);

    // Record source attribution metadata
    const attribution = recordAttribution(cachedAsset);

    return {
      asset: cachedAsset,
      candidate: bestCandidate,
      allEvaluatedCandidates: evaluatedCandidates,
      attribution,
    };
  }
}
