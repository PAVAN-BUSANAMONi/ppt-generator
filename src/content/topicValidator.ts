/**
 * Step 10A — Topic Consistency & Generic Filler Validator
 *
 * Validates semantic topic consistency and rejects meta placeholder filler phrases.
 */

export interface SlideTopicConsistencyReport {
  slideNumber: number;
  slideTitle: string;
  valid: boolean;
  topicScore: number;
  slideScore: number;
  mismatchedTerms: string[];
  fillerPhrases: string[];
  reasons: string[];
}

export interface PresentationTopicConsistencyReport {
  valid: boolean;
  totalSlides: number;
  passedSlides: number;
  failedSlides: number;
  slideReports: SlideTopicConsistencyReport[];
  errors: string[];
}

// Banned generic filler phrases that trigger immediate rejection
const BANNED_GENERIC_FILLER = [
  'key insight regarding',
  'key insight...',
  'baseline category a',
  'comparison category b',
  'point 1',
  'point 2',
  'point 3',
  'point 4',
  'grounded fact from',
  'presenter notes for',
  'comprehensive research synthesis for',
  'insert text here',
  'lorem ipsum',
];

// Topic mismatch detection dictionaries
const DOMAIN_FORBIDDEN_MAP: Array<{ topicInclude: string; forbiddenWords: string[] }> = [
  {
    topicInclude: 'agriculture',
    forbiddenWords: ['wastewater', 'sewage', 'lead (pb)', 'arsenic (as)', 'drinking water regulations', 'mcl threshold', 'pathogen neutralization', 'effluent discharge'],
  },
  {
    topicInclude: 'pollution',
    forbiddenWords: ['autonomous tractor', 'spot-spraying', 'herbicide reduction by 80%', 'crop disease cnn', 'agtech drone'],
  },
  {
    topicInclude: 'human rights',
    forbiddenWords: ['wastewater', 'spot-spraying', 'herbicide', 'lead (pb)', 'crop disease'],
  },
];

export function validateSlideTopicConsistency(
  slide: any,
  presentationTopic: string
): SlideTopicConsistencyReport {
  const slideNum = slide.slideNumber || 1;
  const slideTitle = slide.title || 'Untitled Slide';

  const slideText = JSON.stringify(slide).toLowerCase();
  const topicLower = presentationTopic.toLowerCase();

  const mismatchedTerms: string[] = [];
  const fillerPhrases: string[] = [];
  const reasons: string[] = [];

  // 1. Detect Generic Filler Phrases
  BANNED_GENERIC_FILLER.forEach((filler) => {
    if (slideText.includes(filler)) {
      fillerPhrases.push(filler);
      reasons.push(`Contains generic filler phrase: "${filler}"`);
    }
  });

  // 2. Detect Cross-Domain Mismatch Terms
  const rule = DOMAIN_FORBIDDEN_MAP.find((r) => topicLower.includes(r.topicInclude));
  if (rule) {
    rule.forbiddenWords.forEach((word) => {
      if (slideText.includes(word)) {
        mismatchedTerms.push(word);
        reasons.push(`Cross-domain term mismatch detected for "${presentationTopic}": "${word}"`);
      }
    });
  }

  // 3. Compute Topic Consistency Score
  const topicWords = topicLower.split(/\s+/).filter((w) => w.length > 3);
  let topicMatches = 0;
  topicWords.forEach((tw) => {
    if (slideText.includes(tw)) topicMatches++;
  });

  const topicScore = topicWords.length > 0 ? Math.round((topicMatches / topicWords.length) * 100) : 100;
  const slideScore = 100 - mismatchedTerms.length * 40 - fillerPhrases.length * 30;

  const valid = mismatchedTerms.length === 0 && fillerPhrases.length === 0;

  return {
    slideNumber: slideNum,
    slideTitle,
    valid,
    topicScore,
    slideScore,
    mismatchedTerms,
    fillerPhrases,
    reasons,
  };
}

export function validatePresentationTopicConsistency(
  presentationData: any,
  presentationTopic: string
): PresentationTopicConsistencyReport {
  const slides = Array.isArray(presentationData?.slides) ? presentationData.slides : [];
  const slideReports: SlideTopicConsistencyReport[] = [];
  const errors: string[] = [];

  let passedSlides = 0;
  let failedSlides = 0;

  slides.forEach((slide: any) => {
    const report = validateSlideTopicConsistency(slide, presentationTopic);
    slideReports.push(report);

    if (report.valid) {
      passedSlides++;
    } else {
      failedSlides++;
      report.reasons.forEach((r) => errors.push(`Slide ${report.slideNumber} (${report.slideTitle}): ${r}`));
    }
  });

  const valid = failedSlides === 0;

  return {
    valid,
    totalSlides: slides.length,
    passedSlides,
    failedSlides,
    slideReports,
    errors,
  };
}
