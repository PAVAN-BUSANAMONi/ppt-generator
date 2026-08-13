/**
 * Step 10A — Topic-Constrained Grounded Prompts
 *
 * Enforces topic consistency, slide-specific evidence scoping, and filler rejection rules.
 */

import { SlideSpecificRegistry } from '../research/sourceTypes';
import { SlidePlan, PresentationPlan } from '../planner/planSchema';

export interface GenerationParams {
  topic: string;
  slideCount?: number;
  audience?: string;
  purpose?: string;
  depth?: string;
  style?: string;
}

export interface GroundedGenerationParams {
  topic: string;
  plan: PresentationPlan;
  registry: any;
  audience?: string;
  purpose?: string;
  depth?: string;
  style?: string;
}

export function buildGroundedSystemPrompt(): string {
  return `You are an expert presentation content architect.
Your task is to generate a structured presentation in JSON format matching the PresentationData contract.

CRITICAL TOPIC CONSISTENCY & GROUNDING RULES:
1. Return ONLY valid JSON matching PresentationData.
2. Use ONLY evidence that is relevant to the presentation topic AND the current slide plan. The presence of a source in the research context does not make it valid for the current slide.
3. Never use a factual claim merely because it appears in the supplied context. It must support the current slide's purpose.
4. Every statistic included MUST come directly from the supplied research sources and attach valid "sourceIds" matching accepted sources for that slide.
5. NEVER invent statistics, percentages, numerical metrics, dates, or fake source IDs.
6. NEVER use generic placeholder phrases like "Key insight regarding...", "Baseline Category A", "Comparison Category B", "Point 1", "Point 2", "Grounded fact from...", "Presenter Notes for...", "Comprehensive research synthesis for...".
7. All titles, bullets, card text, and speaker notes MUST contain rich, topic-specific domain content tailored strictly to the presentation topic.
8. Allowed slide types ONLY: ["title", "overview", "concept", "comparison", "cause-effect", "statistics", "process", "case-study", "image-story", "table", "chart", "takeaways", "conclusion", "references"]
9. Provide informative, topic-specific speaker notes for every slide explaining the actual content.

OUTPUT CONTRACT:
{
  "presentation": {
    "title": "Title",
    "subtitle": "Subtitle",
    "author": "Author",
    "date": "2026",
    "theme": "referenceEditorial"
  },
  "slides": [
    {
      "id": "slide-01",
      "slideNumber": 1,
      "type": "title",
      "title": "Title",
      "subtitle": "Subtitle",
      "speakerNotes": "Specific presenter notes explaining slide topic..."
    }
  ]
}`;
}

export function buildSlideSpecificUserPrompt(
  topic: string,
  slidePlan: SlidePlan,
  slideRegistry: SlideSpecificRegistry
): string {
  const sourcesText = slideRegistry.acceptedSources
    .map((s) => `[${s.id}] (${s.sourceType.toUpperCase()}) "${s.title}"\nExcerpt: ${s.extractedText}`)
    .join('\n\n');

  const statsText = slideRegistry.acceptedStatistics
    .map((st) => `- ${st.value} (${st.label}) [Source: ${st.sourceIds.join(', ')}]`)
    .join('\n');

  return `Generate content for Slide ${slidePlan.slideNumber} of "${topic}".

SLIDE CONTEXT:
- Presentation Topic: ${topic}
- Section: ${slidePlan.sectionId}
- Slide Type: ${slidePlan.type}
- Slide Title: ${slidePlan.title}
- Slide Purpose: ${slidePlan.purpose}
- Key Message: ${slidePlan.keyMessage}

ACCEPTED SLIDE-SPECIFIC RESEARCH SOURCES:
${sourcesText}

ACCEPTED SLIDE-SPECIFIC STATISTICS:
${statsText}

Generate valid JSON for this slide. Ensure all text is 100% specific to "${topic}" and this slide's title/purpose.`;
}

export function buildGroundedUserPrompt(params: GroundedGenerationParams): string {
  return `Generate full ${params.plan.slides.length}-slide PresentationData JSON for topic: "${params.topic}".
Presentation Title: ${params.plan.title}
Sections: ${params.plan.sections.map((s) => s.title).join(' -> ')}

Ensure every slide contains 100% topic-consistent content without generic placeholders or cross-domain terms.`;
}

export function buildRetryPrompt(errors: string[], previousJson: string): string {
  return `Your previous JSON output failed validation rules:
${errors.map((e) => `- ${e}`).join('\n')}

Please fix these errors and return ONLY the corrected PresentationData JSON. Make sure to remove any generic filler phrases and cross-domain terms.`;
}
