/**
 * Step 10 — Content & Evidence Extractor
 *
 * Extracts readable plain text, qualitative claims, and quantitative statistics
 * from research source content.
 */

import { ResearchSource, Evidence, StatisticEvidence } from './sourceTypes';

export function extractPlainText(htmlOrText: string): string {
  if (!htmlOrText) return '';
  return htmlOrText
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function extractEvidenceFromSources(sources: ResearchSource[]): {
  evidence: Evidence[];
  statistics: StatisticEvidence[];
} {
  const evidence: Evidence[] = [];
  const statistics: StatisticEvidence[] = [];

  const statRegex = /((?:\d+(?:\.\d+)?\s*(?:million|billion|trillion|%|percent|x|kg|mg\/L|MCL|ha))|(?:\$\d+(?:\.\d+)?\s*(?:billion|trillion)?))\s+([^.,;\n]{5,60})/gi;

  sources.forEach((src) => {
    const sentences = src.extractedText.split(/(?<=[.!?])\s+/);

    sentences.forEach((sentence) => {
      const cleanSent = sentence.trim();
      if (cleanSent.length > 20 && cleanSent.length < 250) {
        evidence.push({
          claim: cleanSent,
          sourceIds: [src.id],
        });

        let match: RegExpExecArray | null;
        while ((match = statRegex.exec(cleanSent)) !== null) {
          const val = match[1].trim();
          const label = match[2].trim();

          statistics.push({
            label,
            value: val,
            sourceIds: [src.id],
          });
        }
      }
    });
  });

  return { evidence, statistics };
}
