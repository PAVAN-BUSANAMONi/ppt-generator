/**
 * Step 7 — Structured Content Contract
 *
 * Defines the strict JSON / TypeScript contract between the AI Presentation Planner
 * and the Deterministic Slide Engine.
 */

import { SlideData, SlideType, VisualDensity } from '../slides/types';
import { slideRegistry } from '../slides/registry';
import { Theme, referenceEditorial } from '../design/theme';

export interface PresentationMetadata {
  title: string;
  topic: string;
  author?: string;
  targetAudience?: string;
  themeName?: string;
  density?: VisualDensity;
}

export interface PresentationContract {
  metadata: PresentationMetadata;
  slides: SlideData[];
}

export interface ValidationResult {
  valid: boolean;
  contract?: PresentationContract;
  errors: string[];
  warnings: string[];
}

/**
 * Validate & sanitize raw JSON object from AI/LLM into a strict PresentationContract.
 */
export function validatePresentationContract(
  rawInput: any,
  defaultThemeObj: Theme = referenceEditorial
): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!rawInput || typeof rawInput !== 'object') {
    return {
      valid: false,
      errors: ['Input is not a valid JSON object.'],
      warnings: [],
    };
  }

  // 1. Validate Metadata
  const metadataInput = rawInput.metadata || {};
  const title = typeof metadataInput.title === 'string' && metadataInput.title.trim()
    ? metadataInput.title.trim()
    : 'Untitled Presentation';

  const topic = typeof metadataInput.topic === 'string' && metadataInput.topic.trim()
    ? metadataInput.topic.trim()
    : 'General Topic';

  const metadata: PresentationMetadata = {
    title,
    topic,
    author: typeof metadataInput.author === 'string' ? metadataInput.author : undefined,
    targetAudience: typeof metadataInput.targetAudience === 'string' ? metadataInput.targetAudience : undefined,
    themeName: typeof metadataInput.themeName === 'string' ? metadataInput.themeName : defaultThemeObj.name,
    density: ['light', 'medium', 'dense'].includes(metadataInput.density)
      ? metadataInput.density
      : 'medium',
  };

  // 2. Validate Slides Array
  const rawSlides = Array.isArray(rawInput.slides) ? rawInput.slides : [];
  if (rawSlides.length === 0) {
    errors.push('Presentation must contain at least 1 slide in the "slides" array.');
  }

  const validSlideTypes = Object.keys(slideRegistry) as SlideType[];
  const sanitizedSlides: SlideData[] = [];

  rawSlides.forEach((rawSlide: any, idx: number) => {
    const slideNum = idx + 1;
    const slideId = typeof rawSlide.id === 'string' && rawSlide.id.trim()
      ? rawSlide.id.trim()
      : `slide-${String(slideNum).padStart(2, '0')}`;

    // Validate Slide Type
    let type: SlideType = 'concept';
    if (typeof rawSlide.type === 'string' && validSlideTypes.includes(rawSlide.type as SlideType)) {
      type = rawSlide.type as SlideType;
    } else {
      warnings.push(`Slide ${slideNum} (${slideId}): Unknown slide type "${rawSlide.type}". Defaulted to "concept".`);
    }

    const slideTitle = typeof rawSlide.title === 'string' && rawSlide.title.trim()
      ? rawSlide.title.trim()
      : `Slide ${slideNum}`;

    const density: VisualDensity = ['light', 'medium', 'dense'].includes(rawSlide.density)
      ? rawSlide.density
      : metadata.density || 'medium';

    // Base properties
    const baseSlide: any = {
      id: slideId,
      type,
      eyebrow: typeof rawSlide.eyebrow === 'string' ? rawSlide.eyebrow : undefined,
      title: slideTitle,
      subtitle: typeof rawSlide.subtitle === 'string' ? rawSlide.subtitle : undefined,
      notes: typeof rawSlide.notes === 'string' ? rawSlide.notes : undefined,
      slideNumber: slideNum,
      totalSlides: rawSlides.length,
      theme: defaultThemeObj,
      density,
      layoutVariant: typeof rawSlide.layoutVariant === 'string' ? rawSlide.layoutVariant : undefined,
    };

    // Type-specific field sanitization & fallbacks
    switch (type) {
      case 'title':
        baseSlide.author = rawSlide.author || metadata.author;
        baseSlide.date = rawSlide.date || '2026';
        baseSlide.dark = rawSlide.dark !== false;
        baseSlide.image = rawSlide.image;
        break;

      case 'overview':
        baseSlide.agendaItems = Array.isArray(rawSlide.agendaItems) && rawSlide.agendaItems.length > 0
          ? rawSlide.agendaItems
          : [
              { number: '1', title: 'Introduction', description: 'Overview of fundamental topics.' },
              { number: '2', title: 'Core Analysis', description: 'Detailed examination of concepts.' },
              { number: '3', title: 'Summary', description: 'Key takeaways and next steps.' },
            ];
        break;

      case 'concept':
        baseSlide.mainConcept = rawSlide.mainConcept && typeof rawSlide.mainConcept === 'object'
          ? rawSlide.mainConcept
          : { title: slideTitle, description: rawSlide.subtitle || 'Key concept breakdown.' };
        baseSlide.cards = Array.isArray(rawSlide.cards) && rawSlide.cards.length > 0
          ? rawSlide.cards
          : [{ title: 'Core Principle', body: 'Primary operational takeaway.' }];
        break;

      case 'comparison':
        baseSlide.leftPanel = rawSlide.leftPanel || { title: 'Option A', points: ['Advantage 1', 'Feature A'] };
        baseSlide.rightPanel = rawSlide.rightPanel || { title: 'Option B', points: ['Advantage 2', 'Feature B'] };
        break;

      case 'cause-effect':
        baseSlide.causes = Array.isArray(rawSlide.causes) ? rawSlide.causes : [{ title: 'Root Cause', description: 'Initial driver' }];
        baseSlide.mechanism = rawSlide.mechanism || 'Causal transformation mechanism.';
        baseSlide.effects = Array.isArray(rawSlide.effects) ? rawSlide.effects : [{ title: 'Observed Impact', description: 'Resulting outcome' }];
        break;

      case 'statistics':
        baseSlide.metrics = Array.isArray(rawSlide.metrics) && rawSlide.metrics.length > 0
          ? rawSlide.metrics
          : [{ number: '100%', label: 'Metric Indicator', explanation: 'Key quantitative benchmark.' }];
        break;

      case 'process':
        baseSlide.steps = Array.isArray(rawSlide.steps) && rawSlide.steps.length > 0
          ? rawSlide.steps
          : [
              { stepNumber: 1, title: 'Phase 1', description: 'Initial setup' },
              { stepNumber: 2, title: 'Phase 2', description: 'Execution' },
            ];
        break;

      case 'case-study':
        baseSlide.context = rawSlide.context || 'Industry operational background.';
        baseSlide.challenge = rawSlide.challenge || 'Primary hurdle faced.';
        baseSlide.solution = rawSlide.solution || 'Implemented strategy.';
        baseSlide.result = rawSlide.result || 'Measurable outcome.';
        baseSlide.image = rawSlide.image;
        break;

      case 'image-story':
        baseSlide.image = rawSlide.image;
        baseSlide.caption = rawSlide.caption;
        baseSlide.storyPoints = Array.isArray(rawSlide.storyPoints) ? rawSlide.storyPoints : ['Key narrative observation.'];
        break;

      case 'table':
        baseSlide.headers = Array.isArray(rawSlide.headers) ? rawSlide.headers : ['Category', 'Metric', 'Status'];
        baseSlide.rows = Array.isArray(rawSlide.rows) ? rawSlide.rows : [['Sample A', '100', 'Active']];
        baseSlide.keyTakeaway = rawSlide.keyTakeaway;
        baseSlide.chartData = rawSlide.chartData;
        break;

      case 'chart':
        baseSlide.chartDescription = rawSlide.chartDescription || 'Data distribution summary.';
        baseSlide.keyInsights = Array.isArray(rawSlide.keyInsights) ? rawSlide.keyInsights : ['Key statistical insight.'];
        baseSlide.chartData = rawSlide.chartData;
        break;

      case 'takeaways':
        baseSlide.takeaways = Array.isArray(rawSlide.takeaways) && rawSlide.takeaways.length > 0
          ? rawSlide.takeaways
          : [{ number: 1, title: 'Key Finding', description: 'Summary recommendation.' }];
        break;

      case 'conclusion':
        baseSlide.summaryText = rawSlide.summaryText || 'Final synthesis of presentation topics.';
        baseSlide.finalCallToAction = rawSlide.finalCallToAction;
        baseSlide.dark = rawSlide.dark !== false;
        break;

      case 'references':
        baseSlide.references = Array.isArray(rawSlide.references) && rawSlide.references.length > 0
          ? rawSlide.references
          : [{ title: 'Reference Source', source: 'Academic Journal', year: 2026 }];
        break;
    }

    sanitizedSlides.push(baseSlide as SlideData);
  });

  const contract: PresentationContract = {
    metadata,
    slides: sanitizedSlides,
  };

  return {
    valid: errors.length === 0,
    contract: errors.length === 0 ? contract : undefined,
    errors,
    warnings,
  };
}
