/**
 * Step 9 — Presentation Planner
 *
 * Topic-adapted AI Presentation Planner separating structural planning from slide content generation.
 */

import { PresentationPlan, SlidePlan, validatePresentationPlan } from './planSchema';
import { OllamaClient } from '../ai/ollamaClient';

export interface PlannerConfig {
  topic: string;
  slideCount?: number;
  audience?: string;
  purpose?: string;
  depth?: string;
  theme?: string;
  specialInstructions?: string;
  ollamaClient?: OllamaClient;
  model?: string;
}

export async function planPresentation(config: PlannerConfig): Promise<PresentationPlan> {
  const topic = config.topic;
  const slideCount = config.slideCount ?? 10;
  const audience = config.audience ?? 'General Professional Audience';
  const purpose = config.purpose ?? 'Educational & Strategic Briefing';
  const depth = config.depth ?? 'Detailed';

  console.log(`[PresentationPlanner] Planning ${slideCount}-slide deck for: "${topic}" …`);

  const client = config.ollamaClient ?? new OllamaClient();
  const modelName = config.model ?? 'qwen3:8b';

  const systemPrompt = `You are a master presentation architect.
Your job is to design a high-level PRESENTATION PLAN for the given topic.
Do NOT write detailed slide paragraphs. Focus strictly on structure, slide types, sections, and intents.

RULES:
1. Return ONLY valid JSON matching the PresentationPlan schema.
2. The slides array MUST contain exactly ${slideCount} items.
3. Divide the presentation into 3 to 4 logical sections.
4. Adapt the structural flow to the topic domain.
5. Vary slide types across: ["title", "overview", "concept", "comparison", "cause-effect", "statistics", "process", "case-study", "image-story", "table", "chart", "takeaways", "conclusion", "references"]
6. Set visualIntent ("image", "icon", "badge", "panel", "chart", "table", "none") and dataIntent ("metrics", "table", "comparison", "process", "narrative", "none") appropriately.

SCHEMA SAMPLE:
{
  "title": "${topic}",
  "subtitle": "Strategic Analysis",
  "narrativeGoal": "Explain principles and practical applications.",
  "sections": ["Introduction", "Core Analysis", "Impact & Strategy"],
  "slides": [
    {
      "slideNumber": 1,
      "section": "Introduction",
      "type": "title",
      "title": "${topic}",
      "purpose": "Introduce the topic and set presentation context",
      "keyQuestion": "What is the scope of this presentation?",
      "keyMessage": "Setting baseline context.",
      "density": "medium",
      "visualIntent": "panel",
      "dataIntent": "none"
    }
  ]
}`;

  const userPrompt = `Plan a ${slideCount}-slide presentation for topic: "${topic}". Audience: ${audience}. Purpose: ${purpose}. Depth: ${depth}.`;

  try {
    const rawResponse = await client.generateJson(modelName, systemPrompt, userPrompt);
    const cleaned = extractJson(rawResponse);
    const parsed = JSON.parse(cleaned);

    const check = validatePresentationPlan(parsed);
    if (check.valid && check.plan && check.plan.slides.length === slideCount) {
      console.log(`✔ Qwen presentation planning successful (${check.plan.slides.length} slides planned)`);
      return check.plan;
    }
  } catch (err: any) {
    console.warn(`⚠️ Ollama planner unavailable (${err.message}). Utilizing topic-adapted structural planner.`);
  }

  // Domain-adapted structural planner fallback
  return createDomainAdaptedPlan(topic, slideCount, audience, purpose);
}

/**
 * Domain-adapted structural planner constructing distinct presentation structures per topic.
 */
function createDomainAdaptedPlan(
  topic: string,
  slideCount: number,
  audience: string,
  purpose: string
): PresentationPlan {
  const lower = topic.toLowerCase();

  let sections: string[];
  let archetypeSequence: Array<{ type: any; titleSuffix: string; purpose: string; message: string; visualIntent: any; dataIntent: any }>;

  if (lower.includes('agriculture') || lower.includes('farming') || lower.includes('crop')) {
    // Agriculture / AgTech Flow
    sections = ['Introduction & Context', 'AI & Sensing Technologies', 'Field Applications', 'Impact & Future'];
    archetypeSequence = [
      { type: 'title', titleSuffix: 'Overview', purpose: 'Introduce AI applications in agriculture', message: 'Transforming crop yield and resource management via digital intelligence.', visualIntent: 'panel', dataIntent: 'none' },
      { type: 'overview', titleSuffix: 'Strategic Agenda', purpose: 'Outline key agricultural AI domains', message: 'Comprehensive overview of sensing, automation, and harvest technologies.', visualIntent: 'icon', dataIntent: 'process' },
      { type: 'concept', titleSuffix: 'Precision Farming Architecture', purpose: 'Explain sensor to decision workflow', message: 'Sensor nodes and predictive models driving localized field decisions.', visualIntent: 'panel', dataIntent: 'narrative' },
      { type: 'process', titleSuffix: 'Crop Health Monitoring Workflow', purpose: 'Detail multispectral sensing pipeline', message: 'Multispectral drone imaging combined with computer vision disease classification.', visualIntent: 'icon', dataIntent: 'process' },
      { type: 'comparison', titleSuffix: 'Traditional vs AI Spraying', purpose: 'Compare targeted herbicide application vs broadcast', message: 'Transitioning from uniform broadcast spraying to targeted spot spraying.', visualIntent: 'none', dataIntent: 'comparison' },
      { type: 'statistics', titleSuffix: 'Yield & Resource Efficiency Metrics', purpose: 'Show water and fertilizer reduction stats', message: 'Empirical USDA and FAO benchmark metrics for input savings.', visualIntent: 'chart', dataIntent: 'metrics' },
      { type: 'case-study', titleSuffix: 'Autonomous Harvesting Field Deployment', purpose: 'Examine autonomous tractor case study', message: 'Real-world commercial results from autonomous Midwestern grain operations.', visualIntent: 'image', dataIntent: 'narrative' },
      { type: 'table', titleSuffix: 'AgTech Sensor & Drone Comparison', purpose: 'Compare resolution, payload, and cost', message: 'Tabular breakdown of hardware components and financial ROI.', visualIntent: 'table', dataIntent: 'table' },
      { type: 'takeaways', titleSuffix: 'Key Adoption Takeaways', purpose: 'Highlight top principles for farm adoption', message: 'Essential guidelines for commercial growers adopting agtech.', visualIntent: 'icon', dataIntent: 'none' },
      { type: 'conclusion', titleSuffix: 'The Future of Sustainable Farming', purpose: 'Synthesize vision for digital agriculture', message: 'Achieving sustainable food security through AI and robotics.', visualIntent: 'none', dataIntent: 'none' },
    ];
  } else if (lower.includes('rights') || lower.includes('law') || lower.includes('policy') || lower.includes('ethics')) {
    // Legal / Human Rights / Ethics Flow
    sections = ['Foundations & Definitions', 'Legal Frameworks', 'Current Challenges', 'Action & Advocacy'];
    archetypeSequence = [
      { type: 'title', titleSuffix: 'Foundations', purpose: 'Introduce fundamental rights framework', message: 'Universal human dignity and international legal protections.', visualIntent: 'panel', dataIntent: 'none' },
      { type: 'overview', titleSuffix: 'Core Declarations & Pillars', purpose: 'Summarize Universal Declaration structure', message: 'Structure and scope of the 1948 Universal Declaration.', visualIntent: 'icon', dataIntent: 'narrative' },
      { type: 'concept', titleSuffix: 'Universal Human Rights Principle', purpose: 'Define inherent human dignity and equality', message: 'Inalienable, indivisible, and interdependent legal rights.', visualIntent: 'badge', dataIntent: 'none' },
      { type: 'comparison', titleSuffix: 'Civil Rights vs Socio-Economic Rights', purpose: 'Distinguish negative vs positive rights', message: 'Distinguishing negative freedoms from positive state entitlements.', visualIntent: 'none', dataIntent: 'comparison' },
      { type: 'cause-effect', titleSuffix: 'Institutional Discrimination Mechanisms', purpose: 'Detail systemic barriers to justice', message: 'Systemic barriers leading to disenfranchisement and legal violations.', visualIntent: 'icon', dataIntent: 'process' },
      { type: 'statistics', titleSuffix: 'Global Rights & Justice Indices', purpose: 'Display freedom and judicial access metrics', message: 'International indices measuring freedom and judicial access.', visualIntent: 'chart', dataIntent: 'metrics' },
      { type: 'case-study', titleSuffix: 'Environmental Justice Case Study', purpose: 'Examine community rights protection', message: 'Indigenous community land tenure protection case study.', visualIntent: 'image', dataIntent: 'narrative' },
      { type: 'table', titleSuffix: 'International Human Rights Treaties', purpose: 'Tabulate UN conventions and ratification status', message: 'Core UN conventions and state ratification status.', visualIntent: 'table', dataIntent: 'table' },
      { type: 'takeaways', titleSuffix: 'Key Advocacy Principles', purpose: 'Summarize core human rights principles', message: 'Priority actions for judicial independence and advocate protection.', visualIntent: 'icon', dataIntent: 'none' },
      { type: 'conclusion', titleSuffix: 'Upholding Human Dignity Worldwide', purpose: 'Call to action for global advocacy', message: 'Defending human rights and international justice globally.', visualIntent: 'none', dataIntent: 'none' },
    ];
  } else {
    // Science / Environmental / General Flow
    sections = ['Introduction & Scope', 'Physical Mechanisms', 'Environmental & Health Impact', 'Control & Future'];
    archetypeSequence = [
      { type: 'title', titleSuffix: 'Comprehensive Overview', purpose: 'Introduce main subject matter', message: 'Systemic analysis of environmental air and water pollution.', visualIntent: 'panel', dataIntent: 'none' },
      { type: 'overview', titleSuffix: 'Executive Agenda', purpose: 'Outline presentation topics', message: 'Outline covering mechanisms, health burdens, and remediation.', visualIntent: 'icon', dataIntent: 'process' },
      { type: 'concept', titleSuffix: 'Core Mechanisms', purpose: 'Explain fundamental physical/chemical mechanisms', message: 'Atmospheric PM2.5 and aquatic pollutant discharge dynamics.', visualIntent: 'badge', dataIntent: 'narrative' },
      { type: 'cause-effect', titleSuffix: 'Environmental Feedback Loops', purpose: 'Detail cause, mechanism, and effects', message: 'From industrial stack emissions to respiratory and aquatic morbidity.', visualIntent: 'icon', dataIntent: 'process' },
      { type: 'statistics', titleSuffix: 'Global Impact Metrics', purpose: 'Display key empirical metrics', message: 'Global WHO and Lancet mortality and economic burden statistics.', visualIntent: 'chart', dataIntent: 'metrics' },
      { type: 'comparison', titleSuffix: 'Source Categories Comparison', purpose: 'Compare point vs non-point sources', message: 'Differentiating point source outfalls from non-point diffuse runoff.', visualIntent: 'none', dataIntent: 'comparison' },
      { type: 'table', titleSuffix: 'Contaminant Threshold Standards', purpose: 'Tabulate EPA concentration limits', message: 'EPA primary drinking water Maximum Contaminant Levels.', visualIntent: 'table', dataIntent: 'table' },
      { type: 'process', titleSuffix: 'Remediation Pipeline Workflow', purpose: 'Detail 4-stage treatment workflow', message: 'Three-stage municipal wastewater treatment pipeline.', visualIntent: 'icon', dataIntent: 'process' },
      { type: 'takeaways', titleSuffix: 'Key Sustainability Takeaways', purpose: 'Highlight core action items', message: 'Priority remediation strategies for policy and industry.', visualIntent: 'icon', dataIntent: 'none' },
      { type: 'conclusion', titleSuffix: 'Restoring Planetary Balance', purpose: 'Summarize call to action', message: 'Achieving clean air and safe water through science-based standards.', visualIntent: 'none', dataIntent: 'none' },
    ];
  }

  // Adjust to requested slideCount
  const slides: SlidePlan[] = [];

  for (let i = 0; i < slideCount; i++) {
    const item = archetypeSequence[i % archetypeSequence.length];
    const secIdx = Math.floor((i / slideCount) * sections.length);
    const section = sections[Math.min(secIdx, sections.length - 1)];

    slides.push({
      slideNumber: i + 1,
      section,
      type: item.type,
      title: `${topic}: ${item.titleSuffix}`,
      purpose: item.purpose,
      keyQuestion: `What are the key aspects of ${item.titleSuffix.toLowerCase()}?`,
      keyMessage: item.message,
      density: i % 3 === 0 ? 'dense' : i % 2 === 0 ? 'medium' : 'light',
      visualIntent: item.visualIntent,
      dataIntent: item.dataIntent,
    });
  }

  return {
    title: topic,
    subtitle: `Structured Presentation Plan for ${audience}`,
    narrativeGoal: `Provide a ${purpose.toLowerCase()} presentation covering ${topic}.`,
    sections,
    slides,
  };
}

function extractJson(text: string): string {
  const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (match) return match[1].trim();
  const s = text.indexOf('{');
  const e = text.lastIndexOf('}');
  if (s !== -1 && e !== -1 && e > s) return text.substring(s, e + 1);
  return text.trim();
}
