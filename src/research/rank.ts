/**
 * Step 10 — Source Ranker
 *
 * Ranks sources according to domain authority hierarchy:
 * 1. Government / official
 * 2. Scientific / academic
 * 3. Universities / research organizations
 * 4. WHO / UN / FAO / international organizations
 * 5. Reputable secondary sources
 */

import { ResearchSource, SourceTypeCategory } from './sourceTypes';

export function categorizeSource(url: string, publisher?: string): SourceTypeCategory {
  const u = url.toLowerCase();
  const p = (publisher || '').toLowerCase();

  if (u.includes('.gov') || u.includes('epa.gov') || p.includes('government') || p.includes('department of')) {
    return 'government';
  }
  if (u.includes('who.int') || u.includes('un.org') || u.includes('fao.org') || u.includes('worldbank.org') || u.includes('ipcc.ch')) {
    return 'intl-org';
  }
  if (u.includes('.edu') || u.includes('ac.uk') || p.includes('university')) {
    return 'university';
  }
  if (u.includes('ncbi') || u.includes('sciencedirect') || u.includes('nature.com') || u.includes('arxiv') || u.includes('plos') || u.includes('springer')) {
    return 'academic';
  }
  return 'reputable-secondary';
}

export function rankSources(sources: ResearchSource[], query: string): ResearchSource[] {
  const queryTerms = query.toLowerCase().split(/\s+/).filter((t) => t.length > 3);

  return sources
    .map((src) => {
      let tierWeight = 0.6;
      switch (src.sourceType) {
        case 'government':
          tierWeight = 1.0;
          break;
        case 'intl-org':
          tierWeight = 0.95;
          break;
        case 'academic':
          tierWeight = 0.90;
          break;
        case 'university':
          tierWeight = 0.85;
          break;
        case 'reputable-secondary':
          tierWeight = 0.70;
          break;
      }

      const text = (src.title + ' ' + src.extractedText).toLowerCase();
      let matchCount = 0;
      queryTerms.forEach((term) => {
        if (text.includes(term)) matchCount++;
      });

      const textRelevance = queryTerms.length > 0 ? Math.min(1.0, matchCount / queryTerms.length) : 0.5;
      const score = Math.round((tierWeight * 0.6 + textRelevance * 0.4) * 100);

      return {
        ...src,
        relevanceScore: score,
      };
    })
    .sort((a, b) => b.relevanceScore - a.relevanceScore);
}
