/**
 * Step 10A — Slide-Specific Research Retriever & Relevance Scorer
 *
 * Enforces slide-level source scoping, relevance scoring, and hard topic mismatch filtering.
 * Prevents cross-domain evidence pollution (e.g. wastewater content in AI Agriculture slides).
 */

import { SlidePlan } from '../planner/planSchema';
import { SourceRegistry, SlideSpecificRegistry, EvidenceRelevance, ResearchSource, Evidence, StatisticEvidence } from './sourceTypes';

// Hard negative keyword pairs for cross-domain mismatch detection
const HARD_MISMATCH_RULES: Array<{ topicInclude: string; forbiddenTerms: string[] }> = [
  {
    topicInclude: 'agriculture',
    forbiddenTerms: ['wastewater', 'sewage', 'lead (pb)', 'arsenic (as)', 'drinking water regulations', 'mcl threshold', 'pathogen neutralization'],
  },
  {
    topicInclude: 'pollution',
    forbiddenTerms: ['autonomous tractor', 'spot-spraying', 'herbicide reduction by 80%', 'crop disease cnn', 'agtech drone'],
  },
  {
    topicInclude: 'human rights',
    forbiddenTerms: ['wastewater', 'spot-spraying', 'herbicide', 'lead (pb)', 'crop disease'],
  },
];

export function retrieveSlideSpecificRegistry(
  slidePlan: SlidePlan,
  presentationTopic: string,
  fullRegistry: SourceRegistry,
  threshold: number = 40
): SlideSpecificRegistry {
  const slideQuery = `${presentationTopic} ${slidePlan.sectionId} ${slidePlan.title} ${slidePlan.purpose} ${slidePlan.keyMessage}`.toLowerCase();
  const topicLower = presentationTopic.toLowerCase();

  const acceptedSources: ResearchSource[] = [];
  const acceptedEvidence: Evidence[] = [];
  const acceptedStatistics: StatisticEvidence[] = [];

  // Find forbidden terms for this topic
  const mismatchRule = HARD_MISMATCH_RULES.find((r) => topicLower.includes(r.topicInclude));
  const forbiddenTerms = mismatchRule ? mismatchRule.forbiddenTerms : [];

  // 1. Evaluate and Filter Sources
  fullRegistry.sources.forEach((src) => {
    const srcText = (src.title + ' ' + src.extractedText + ' ' + (src.subjectTags || []).join(' ')).toLowerCase();

    // Check hard topic mismatch
    const hasForbidden = forbiddenTerms.some((term) => srcText.includes(term));
    if (hasForbidden) {
      return; // Reject source for this presentation topic
    }

    // Check slide relevance score
    const slideScore = computeRelevanceScore(srcText, slideQuery);
    if (slideScore >= threshold || src.relevanceScore >= 80) {
      acceptedSources.push(src);
    }
  });

  const acceptedSourceIds = new Set(acceptedSources.map((s) => s.id));

  // 2. Evaluate and Filter Qualitative Evidence
  fullRegistry.evidence.forEach((ev, idx) => {
    const evText = ev.claim.toLowerCase();
    const hasForbidden = forbiddenTerms.some((term) => evText.includes(term));
    if (hasForbidden) return;

    const sourceValid = ev.sourceIds.some((id) => acceptedSourceIds.has(id));
    if (sourceValid || acceptedSources.length === 0) {
      const relevance = evaluateEvidenceRelevance(ev.claim, slidePlan, presentationTopic);
      if (relevance.accepted) {
        acceptedEvidence.push(ev);
      }
    }
  });

  // 3. Evaluate and Filter Quantitative Statistics
  fullRegistry.statistics.forEach((st) => {
    const stText = (st.label + ' ' + st.value).toLowerCase();
    const hasForbidden = forbiddenTerms.some((term) => stText.includes(term));
    if (hasForbidden) return;

    const sourceValid = st.sourceIds.some((id) => acceptedSourceIds.has(id));
    if (sourceValid) {
      acceptedStatistics.push(st);
    }
  });

  return {
    slideNumber: slidePlan.slideNumber,
    slideTitle: slidePlan.title,
    acceptedSources: acceptedSources.length > 0 ? acceptedSources : fullRegistry.sources.slice(0, 2),
    acceptedEvidence,
    acceptedStatistics,
  };
}

export function evaluateEvidenceRelevance(
  claim: string,
  slidePlan: SlidePlan,
  presentationTopic: string
): EvidenceRelevance {
  const claimLower = claim.toLowerCase();
  const topicLower = presentationTopic.toLowerCase();
  const slideLower = (slidePlan.title + ' ' + slidePlan.purpose + ' ' + slidePlan.keyMessage).toLowerCase();

  // Topic Relevance Check
  const topicWords = topicLower.split(/\s+/).filter((w) => w.length > 3);
  let topicMatches = 0;
  topicWords.forEach((tw) => {
    if (claimLower.includes(tw)) topicMatches++;
  });
  const topicRelevance = topicWords.length > 0 ? Math.round((topicMatches / topicWords.length) * 100) : 50;

  // Slide Relevance Check
  const slideWords = slideLower.split(/\s+/).filter((w) => w.length > 3);
  let slideMatches = 0;
  slideWords.forEach((sw) => {
    if (claimLower.includes(sw)) slideMatches++;
  });
  const slideRelevance = slideWords.length > 0 ? Math.round((slideMatches / slideWords.length) * 100) : 50;

  const sectionRelevance = 60;
  const accepted = topicRelevance >= 20 || slideRelevance >= 20;

  return {
    evidenceId: claim.slice(0, 20),
    slideRelevance,
    topicRelevance,
    sectionRelevance,
    accepted,
    rejectionReason: accepted ? undefined : 'Below slide relevance threshold',
  };
}

function computeRelevanceScore(text: string, query: string): number {
  const terms = query.split(/\s+/).filter((t) => t.length > 3);
  if (terms.length === 0) return 50;
  let matches = 0;
  terms.forEach((t) => {
    if (text.includes(t)) matches++;
  });
  return Math.round((matches / terms.length) * 100);
}
