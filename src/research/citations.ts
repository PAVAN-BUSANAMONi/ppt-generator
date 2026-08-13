/**
 * Step 10 — Citations & Verification Engine
 *
 * Verifies source grounding across all statistics and presentation claims.
 */

import { SourceRegistry, ResearchSource } from './sourceTypes';

export interface CitationVerificationResult {
  valid: boolean;
  errors: string[];
  statisticsCount: number;
  statisticsWithSourcesCount: number;
  unsupportedClaims: string[];
}

export function formatSourceCitation(source: ResearchSource): string {
  const pub = source.publisher ? `${source.publisher}. ` : '';
  const date = source.publishedAt ? ` (${source.publishedAt})` : '';
  return `[${source.id}] ${source.title}. ${pub}${source.url}${date}`;
}

export function verifyPresentationCitations(
  presentationData: any,
  registry: SourceRegistry
): CitationVerificationResult {
  const errors: string[] = [];
  const unsupportedClaims: string[] = [];

  const validSourceIds = new Set(registry.sources.map((s) => s.id));

  let statsCount = 0;
  let statsWithSourcesCount = 0;

  const slides = Array.isArray(presentationData?.slides) ? presentationData.slides : [];

  slides.forEach((slide: any, idx: number) => {
    const sNum = slide.slideNumber || idx + 1;

    // Verify statistics slide type or statistics content
    if (slide.type === 'statistics') {
      const items = Array.isArray(slide.content) ? slide.content : Array.isArray(slide.metrics) ? slide.metrics : [];

      items.forEach((item: any, mIdx: number) => {
        statsCount++;
        const itemSources: string[] = Array.isArray(item.sourceIds) ? item.sourceIds : Array.isArray(slide.sources) ? slide.sources : [];

        if (itemSources.length === 0) {
          const msg = `Slide ${sNum} Statistic ${mIdx + 1} ("${item.number || item.value} ${item.label}") has ZERO source IDs attached!`;
          errors.push(msg);
          unsupportedClaims.push(`${item.number || item.value} ${item.label}`);
        } else {
          const invalidIds = itemSources.filter((id) => !validSourceIds.has(id));
          if (invalidIds.length > 0) {
            errors.push(`Slide ${sNum} Statistic ${mIdx + 1} references unknown source ID(s): ${invalidIds.join(', ')}.`);
            unsupportedClaims.push(`${item.number || item.value} ${item.label}`);
          } else {
            statsWithSourcesCount++;
          }
        }
      });
    }

    // Check slide-level sources if provided
    if (Array.isArray(slide.sources)) {
      slide.sources.forEach((srcId: string) => {
        if (!validSourceIds.has(srcId)) {
          errors.push(`Slide ${sNum} references unknown source ID "${srcId}".`);
        }
      });
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    statisticsCount: statsCount,
    statisticsWithSourcesCount: statsWithSourcesCount,
    unsupportedClaims,
  };
}
