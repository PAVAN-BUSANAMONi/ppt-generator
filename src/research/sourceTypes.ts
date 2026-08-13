/**
 * Step 10A — Source Types & Evidence Schema
 *
 * Extends ResearchSource with subjectTags and topicTerms.
 * Defines EvidenceRelevance and SlideSpecificRegistry interfaces.
 */

export type SourceTypeCategory =
  | 'government'
  | 'academic'
  | 'university'
  | 'intl-org'
  | 'reputable-secondary';

export interface ResearchSource {
  id: string;
  title: string;
  url: string;
  publisher?: string;
  authors?: string[];
  publishedAt?: string;
  sourceType: SourceTypeCategory;
  relevanceScore: number;
  extractedText: string;
  subjectTags?: string[];
  topicTerms?: string[];
}

export interface Evidence {
  id?: string;
  claim: string;
  sourceIds: string[];
  subjectTags?: string[];
}

export interface StatisticEvidence {
  id?: string;
  label: string;
  value: string | number;
  unit?: string;
  sourceIds: string[];
  subjectTags?: string[];
}

export interface SourceRegistry {
  sources: ResearchSource[];
  evidence: Evidence[];
  statistics: StatisticEvidence[];
}

export interface EvidenceRelevance {
  evidenceId: string;
  slideRelevance: number;
  topicRelevance: number;
  sectionRelevance: number;
  accepted: boolean;
  rejectionReason?: string;
}

export interface SlideSpecificRegistry {
  slideNumber: number;
  slideTitle: string;
  acceptedSources: ResearchSource[];
  acceptedEvidence: Evidence[];
  acceptedStatistics: StatisticEvidence[];
}
