/**
 * Step 7 & 11 — Content Normalizer
 *
 * Normalizes validated PresentationData into clean SlideData[] for the Slide Registry.
 * Preserves VisualPlan decisions from Intelligent Visual Director.
 */

import { PresentationData, SlideSchema } from './presentationSchema';
import { SlideData } from '../slides/types';

export function normalizePresentationData(data: PresentationData): SlideData[] {
  const totalSlides = data.slides.length;

  return data.slides.map((slide: SlideSchema, idx: number) => {
    const slideNumber = slide.slideNumber || idx + 1;
    const slideId = slide.id || `slide-${String(slideNumber).padStart(2, '0')}`;
    const density = slide.density || 'medium';

    const base: any = {
      id: slideId,
      type: slide.type,
      eyebrow: slide.title.toUpperCase(),
      title: slide.title,
      subtitle: slide.subtitle || slide.keyMessage,
      notes: slide.speakerNotes,
      slideNumber,
      totalSlides,
      density,
      visualPlan: slide.visualPlan,
    };

    switch (slide.type) {
      case 'title':
        base.author = slide.author || data.presentation.author;
        base.date = slide.date || data.presentation.date || '2026';
        base.dark = slide.dark !== false;
        base.image = slide.visual?.src;
        break;

      case 'overview':
        base.agendaItems = slide.content.map((item) => ({
          number: item.number,
          title: item.title,
          description: item.body,
          icon: item.icon || 'ListChecks',
        }));
        break;

      case 'concept':
        base.mainConcept = {
          title: slide.content.mainConcept.title,
          description: slide.content.mainConcept.body,
        };
        base.cards = slide.content.cards.map((c) => ({
          title: c.title,
          body: c.body,
          icon: c.icon || 'CheckCircle',
        }));
        break;

      case 'comparison':
        base.leftPanel = slide.content.leftPanel;
        base.rightPanel = slide.content.rightPanel;
        break;

      case 'cause-effect':
        base.causes = slide.content.causes.map((c) => ({ title: c.title, description: c.body }));
        base.mechanism = slide.content.mechanism;
        base.effects = slide.content.effects.map((e) => ({ title: e.title, description: e.body }));
        break;

      case 'statistics':
        base.metrics = slide.content.map((m) => ({
          number: m.number,
          label: m.label,
          explanation: m.body,
          sourceIds: m.sourceIds,
        }));
        break;

      case 'process':
        base.steps = slide.content.map((s) => ({
          stepNumber: s.stepNumber,
          title: s.title,
          description: s.body,
          icon: s.icon || 'ArrowRight',
        }));
        break;

      case 'case-study':
        base.context = slide.content.context;
        base.challenge = slide.content.challenge;
        base.solution = slide.content.solution;
        base.result = slide.content.result;
        base.image = slide.visual?.src;
        break;

      case 'image-story':
        base.image = slide.visual.src;
        base.caption = slide.visual.caption;
        base.storyPoints = slide.content;
        break;

      case 'table':
        base.headers = slide.data.headers;
        base.rows = slide.data.rows;
        base.keyTakeaway = slide.data.keyTakeaway;
        base.chartData = slide.chartData;
        break;

      case 'chart':
        base.chartDescription = slide.subtitle || 'Data visualization analysis.';
        base.keyInsights = slide.content;
        base.chartData = slide.chartData;
        break;

      case 'takeaways':
        base.takeaways = slide.content.map((t) => ({
          number: t.number,
          title: t.title,
          description: t.body,
        }));
        break;

      case 'conclusion':
        base.summaryText = slide.content.summaryText;
        base.finalCallToAction = slide.content.callToAction;
        base.dark = slide.dark !== false;
        break;

      case 'references':
        base.references = slide.content;
        break;
    }

    return base as SlideData;
  });
}
