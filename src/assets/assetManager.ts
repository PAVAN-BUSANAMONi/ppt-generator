/**
 * STEP 28 — ASSET MANAGER WITH EXACT SLIDE-LEVEL RELEVANCE & HARD NEGATIVE FILTERING
 *
 * End-to-end image asset orchestration pipeline:
 * VisualPlan → query → providers → candidate list → hard negative filter →
 * slide-level semantic validation → ranking → best asset → cache → attribution
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
  decisionReport: {
    provider: string;
    relevanceScore: number;
    rejectedCandidates: Array<{ title: string; reason: string }>;
    finalDecision: 'ACCEPTED' | 'REJECTED';
    reason: string;
  };
}

export class AssetManager {
  private usedAssetIds: Set<string> = new Set();
  private verbose: boolean = true;

  constructor(options?: { verbose?: boolean }) {
    this.verbose = options?.verbose ?? true;
  }

  /**
   * Reset presentation scope to allow fresh image selections per deck.
   */
  resetScope(): void {
    this.usedAssetIds.clear();
  }

  /**
   * Resolves, ranks, validates domain compatibility, caches, and records attribution for a VisualPlan.
   * If no candidate meets strict exact-relevance requirements, gracefully rejects without forcing an image.
   */
  async resolveImageForVisualPlan(
    visualPlan: VisualPlan,
    presentationTopic: string,
    minRelevanceThreshold: number = 65
  ): Promise<ResolveAssetResult> {
    if (visualPlan.type !== 'photo' && visualPlan.type !== 'mixed') {
      return {
        asset: null,
        decisionReport: {
          provider: 'None',
          relevanceScore: 0,
          rejectedCandidates: [],
          finalDecision: 'REJECTED',
          reason: 'Visual plan does not request photographic asset.',
        },
      };
    }

    const query = visualPlan.relevanceQuery || `${presentationTopic} ${visualPlan.purpose}`;
    const rawAssets = await searchImages(query, 10);

    if (rawAssets.length === 0) {
      console.log(`[AssetManager] Query: "${query}" -> 0 results found. Fallback to diagram/cards.`);
      return {
        asset: null,
        decisionReport: {
          provider: 'Wikimedia/Openverse',
          relevanceScore: 0,
          rejectedCandidates: [],
          finalDecision: 'REJECTED',
          reason: 'No raw assets returned by search providers.',
        },
      };
    }

    // Rank & Filter candidates with semantic domain hard gate and hard negative filters
    const evaluatedCandidates = rankAndFilterImageCandidates(rawAssets, visualPlan, query, minRelevanceThreshold);

    const rejectedCandidates: Array<{ title: string; reason: string }> = [];
    evaluatedCandidates.forEach((c) => {
      if (c.decision === 'REJECTED') {
        rejectedCandidates.push({
          title: c.asset.title,
          reason: c.rejectionReasons.join('; ') || 'Below threshold',
        });
      }
    });

    // Find top ACCEPTED candidate not already used in this deck
    const bestCandidate = evaluatedCandidates.find(
      (c) => c.decision === 'ACCEPTED' && !this.usedAssetIds.has(c.asset.id)
    );

    if (!bestCandidate) {
      console.log(`[AssetManager] Visual Resolution for: "${query}"`);
      console.log(`  Provider:            Wikimedia Commons / Openverse`);
      console.log(`  Relevance Score:     0`);
      console.log(`  Rejected Candidates: ${rejectedCandidates.length} (e.g. ${rejectedCandidates.slice(0, 2).map((r) => `"${r.title}": ${r.reason}`).join(' | ')})`);
      console.log(`  Final Decision:      REJECTED (Using clean non-image visual layout)`);
      console.log(`  Reason:              No candidate passed strict slide-level semantic and hard negative filters.\n`);

      return {
        asset: null,
        allEvaluatedCandidates: evaluatedCandidates,
        decisionReport: {
          provider: 'Wikimedia Commons / Openverse',
          relevanceScore: 0,
          rejectedCandidates,
          finalDecision: 'REJECTED',
          reason: 'All candidates rejected by hard negative filters or insufficient slide-level relevance.',
        },
      };
    }

    this.usedAssetIds.add(bestCandidate.asset.id);

    // Download & Cache asset locally in work/assets/
    const cachedAsset = await cacheImageAsset(bestCandidate.asset);

    // Record source attribution metadata
    const attribution = recordAttribution(cachedAsset);

    console.log(`[AssetManager] Visual Resolution for: "${query}"`);
    console.log(`  Provider:            ${bestCandidate.asset.source}`);
    console.log(`  Relevance Score:     ${bestCandidate.relevanceScore}/100 (Final Composite: ${bestCandidate.finalScore}/100)`);
    console.log(`  Rejected Candidates: ${rejectedCandidates.length}`);
    if (rejectedCandidates.length > 0) {
      console.log(`    Excluded: ${rejectedCandidates.slice(0, 2).map((r) => `"${r.title}" (${r.reason})`).join(', ')}`);
    }
    console.log(`  Final Decision:      ACCEPTED ("${bestCandidate.asset.title}")`);
    console.log(`  Reason:              Passed exact slide-level semantic affinity and hard negative gates.\n`);

    return {
      asset: cachedAsset,
      candidate: bestCandidate,
      allEvaluatedCandidates: evaluatedCandidates,
      attribution,
      decisionReport: {
        provider: bestCandidate.asset.source,
        relevanceScore: bestCandidate.relevanceScore,
        rejectedCandidates,
        finalDecision: 'ACCEPTED',
        reason: `Matched exact positive domain terms for query "${query}".`,
      },
    };
  }
}
