/**
 * Step 9 — Presentation Planner
 *
 * Separates presentation structural planning from slide content generation.
 */

import { PlannerInput, PresentationPlan, SectionPlan, SlidePlan } from './planSchema';
import { validatePresentationPlan } from './planValidator';
import { OllamaClient } from '../ai/ollamaClient';

export interface PlannerOptions {
  model?: string;
  ollamaClient?: OllamaClient;
  maxRetries?: number;
}

export async function createPresentationPlan(
  input: PlannerInput,
  options?: PlannerOptions
): Promise<PresentationPlan> {
  const topic = input.topic;
  const slideCount = input.slideCount ?? 10;
  const audience = input.audience ?? 'General Professional Audience';
  const purpose = input.purpose ?? 'Educational & Strategic Briefing';
  const depth = input.depth ?? 'Detailed';

  console.log(`[PresentationPlanner] Planning ${slideCount}-slide presentation for: "${topic}" …`);

  const client = options?.ollamaClient ?? new OllamaClient();
  const modelName = options?.model ?? 'qwen3:8b';
  const maxRetries = options?.maxRetries ?? 2;

  const systemPrompt = `You are a presentation planning architect.
Return ONLY valid JSON matching the PresentationPlan schema.

RULES:
1. EXACT slide count: The slides array MUST contain exactly ${slideCount} items.
2. Return sections array and slides array.
3. Every slide must map to a valid sectionId.
4. Do NOT output presentation code, coordinates, or long text paragraphs.
5. Create a logical beginning (title/overview), middle (concepts/analysis), and conclusion.
6. Allowed slide types ONLY: ["title", "overview", "concept", "comparison", "cause-effect", "statistics", "process", "case-study", "image-story", "table", "chart", "takeaways", "conclusion", "references"]
7. Set visualIntent ("none", "image", "diagram", "chart", "table", "timeline", "mixed") and dataIntent (boolean).
8. Make slide titles topic-specific.

SCHEMA SAMPLE:
{
  "title": "${topic}",
  "subtitle": "Strategic Analysis",
  "sections": [
    { "id": "sec-01", "title": "Introduction", "purpose": "Establish scope", "slideNumbers": [1, 2] },
    { "id": "sec-02", "title": "Analysis", "purpose": "Detail core mechanisms", "slideNumbers": [3, 4, 5, 6, 7, 8, 9] },
    { "id": "sec-03", "title": "Conclusion", "purpose": "Synthesize key findings", "slideNumbers": [10] }
  ],
  "slides": [
    {
      "slideNumber": 1,
      "sectionId": "sec-01",
      "type": "title",
      "title": "${topic}",
      "purpose": "Introduce topic and set presentation context",
      "keyQuestion": "What is the primary objective?",
      "keyMessage": "Setting foundational context.",
      "density": "medium",
      "visualIntent": "mixed",
      "dataIntent": false
    }
  ]
}`;

  let userPrompt = `Plan a ${slideCount}-slide presentation for topic: "${topic}". Audience: ${audience}. Purpose: ${purpose}. Depth: ${depth}.${input.specialInstructions ? ` Instructions: ${input.specialInstructions}` : ''}`;

  let attempt = 0;

  while (attempt <= maxRetries) {
    attempt++;
    console.log(`[Planner Attempt ${attempt}/${maxRetries + 1}] Requesting presentation plan from Qwen …`);

    try {
      const rawText = await client.generateJson(modelName, systemPrompt, userPrompt);
      const cleaned = extractJson(rawText);
      const parsed = JSON.parse(cleaned);

      const check = validatePresentationPlan(parsed, slideCount);

      if (check.valid && check.plan) {
        console.log(`✔ Qwen presentation plan created successfully! (${check.plan.slides.length} slides, ${check.plan.sections.length} sections)\n`);
        return check.plan;
      }

      console.warn(`⚠️ Plan validation failed on attempt ${attempt}:`);
      check.errors.forEach((err) => console.warn(`  - [${err.field}] ${err.message}`));

      if (attempt <= maxRetries) {
        const errorList = check.errors.map((e) => `[${e.field}] ${e.message}`).join('\n');
        userPrompt = `Your previous JSON plan failed validation with errors:\n${errorList}\n\nPlease fix these errors and return ONLY the corrected PresentationPlan JSON.`;
      }
    } catch (err: any) {
      console.warn(`⚠️ Planner attempt ${attempt} failed: ${err.message}`);
      if (attempt > maxRetries) {
        break;
      }
    }
  }

  console.warn(`⚠️ Qwen planner unavailable or failed validation. Utilizing topic-adapted structural planner.`);
  return createDomainAdaptedPlan(topic, slideCount, audience, purpose);
}

/**
 * Domain-adapted structural planner creating distinct presentation plans per topic.
 */
function createDomainAdaptedPlan(
  topic: string,
  slideCount: number,
  audience: string,
  purpose: string
): PresentationPlan {
  const lower = topic.toLowerCase();

  let sectionDefs: Array<{ id: string; title: string; purpose: string }>;
  let archetypeSeq: Array<{ type: any; titleSuffix: string; purpose: string; message: string; visualIntent: any; dataIntent: boolean }>;

  if (lower.includes('agriculture') || lower.includes('farming') || lower.includes('crop')) {
    sectionDefs = [
      { id: 'sec-01', title: 'Context & Foundations', purpose: 'Introduce AI role in modern agriculture' },
      { id: 'sec-02', title: 'Sensing & Automation Technologies', purpose: 'Detail computer vision and drone monitoring' },
      { id: 'sec-03', title: 'Field Deployments & Impact', purpose: 'Analyze yield metrics and autonomous machinery' },
      { id: 'sec-04', title: 'Future Vision & Synthesis', purpose: 'Outline sustainable farming roadmap' },
    ];
    archetypeSeq = [
      { type: 'title', titleSuffix: 'Overview', purpose: 'Introduce AI applications in agriculture', message: 'Transforming crop yield and resource management via digital intelligence.', visualIntent: 'mixed', dataIntent: false },
      { type: 'overview', titleSuffix: 'Strategic Agenda', purpose: 'Outline key agricultural AI domains', message: 'Comprehensive overview of sensing, automation, and harvest technologies.', visualIntent: 'diagram', dataIntent: false },
      { type: 'concept', titleSuffix: 'Precision Farming Architecture', purpose: 'Explain sensor-to-decision workflow', message: 'Sensor nodes and predictive models driving localized field decisions.', visualIntent: 'diagram', dataIntent: false },
      { type: 'process', titleSuffix: 'Crop Health & Disease Detection Pipeline', purpose: 'Detail multispectral sensing pipeline', message: 'Multispectral drone imaging combined with computer vision disease classification.', visualIntent: 'diagram', dataIntent: true },
      { type: 'comparison', titleSuffix: 'Traditional vs Targeted Spraying', purpose: 'Compare herbicide broadcast vs precision spot-spraying', message: 'Transitioning from uniform broadcast spraying to targeted spot spraying.', visualIntent: 'table', dataIntent: true },
      { type: 'statistics', titleSuffix: 'Yield & Resource Efficiency Metrics', purpose: 'Display water and fertilizer reduction statistics', message: 'Empirical USDA and FAO benchmark metrics for input savings.', visualIntent: 'chart', dataIntent: true },
      { type: 'case-study', titleSuffix: 'Autonomous Harvesting Deployment', purpose: 'Examine autonomous tractor field results', message: 'Real-world commercial results from autonomous Midwestern grain operations.', visualIntent: 'image', dataIntent: true },
      { type: 'table', titleSuffix: 'AgTech Sensor & Drone Comparison', purpose: 'Compare resolution, payload, and cost', message: 'Tabular breakdown of hardware components and financial ROI.', visualIntent: 'table', dataIntent: true },
      { type: 'takeaways', titleSuffix: 'Key Adoption Guidelines', purpose: 'Highlight top principles for farm adoption', message: 'Essential guidelines for commercial growers adopting agtech.', visualIntent: 'diagram', dataIntent: false },
      { type: 'conclusion', titleSuffix: 'Future of Sustainable Agriculture', purpose: 'Synthesize digital agriculture roadmap', message: 'Achieving sustainable food security through AI and robotics.', visualIntent: 'none', dataIntent: false },
    ];
  } else if (lower.includes('iot') || lower.includes('cyber') || lower.includes('security') || lower.includes('embedded') || lower.includes('malware') || lower.includes('botnet') || lower.includes('firmware') || lower.includes('cve') || lower.includes('ddos')) {
    sectionDefs = [
      { id: 'sec-01', title: 'Threat Landscape & Attack Vectors', purpose: 'Introduce IoT proliferation and exploitation vectors' },
      { id: 'sec-02', title: 'Firmware Vulnerabilities & Botnet Dynamics', purpose: 'Examine CVE exploit mechanics and DDoS botnets' },
      { id: 'sec-03', title: 'Zero-Trust Architecture & Hardware Roots', purpose: 'Detail hardware TPM, mTLS, and microsegmentation' },
      { id: 'sec-04', title: 'Strategic Roadmap & Conclusions', purpose: 'Synthesize implementation guidelines for enterprise defense' },
    ];
    archetypeSeq = [
      { type: 'title', titleSuffix: 'Strategic Briefing', purpose: 'Introduce IoT and embedded security paradigm', message: 'Hardening connected embedded devices against advanced firmware exploits and botnets.', visualIntent: 'mixed', dataIntent: false },
      { type: 'overview', titleSuffix: 'Defense-in-Depth Architecture', purpose: 'Outline core cybersecurity vectors', message: 'Comprehensive roadmap covering firmware integrity, zero-trust, and threat mitigation.', visualIntent: 'diagram', dataIntent: false },
      { type: 'concept', titleSuffix: 'Hardware Root of Trust Architecture', purpose: 'Explain cryptographic silicon trust foundations', message: 'Hardware TPM and secure boot preventing unauthorized firmware modification.', visualIntent: 'image', dataIntent: false },
      { type: 'process', titleSuffix: 'Automated Vulnerability & Patching Lifecycle', purpose: 'Detail 4-stage firmware patching cycle', message: 'Continuous CVE scanning, automated signed over-the-air deployment, and telemetry.', visualIntent: 'diagram', dataIntent: true },
      { type: 'comparison', titleSuffix: 'Perimeter Security vs Zero-Trust Microsegmentation', purpose: 'Compare traditional firewalls vs zero-trust mTLS', message: 'Transitioning from legacy flat network perimeters to device-level cryptographic isolation.', visualIntent: 'table', dataIntent: true },
      { type: 'statistics', titleSuffix: 'Exploitation & Vulnerability Distribution', purpose: 'Display empirical NIST and ENISA vulnerability percentages', message: 'Grounded metrics on firmware CVEs, default credentials, and memory safety flaws.', visualIntent: 'chart', dataIntent: true },
      { type: 'table', titleSuffix: 'Zero-Trust Threat Mitigation Benchmarks', purpose: 'Tabulate threat vector elimination benchmarks', message: 'Hardware TPM, mTLS authentication, and microsegmentation isolation percentages.', visualIntent: 'table', dataIntent: true },
      { type: 'case-study', titleSuffix: 'Mirai Botnet & Industrial Infiltration', purpose: 'Analyze real-world botnet attack case study', message: 'Forensic breakdown of automated Telnet brute-force and DDoS infrastructure.', visualIntent: 'image', dataIntent: true },
      { type: 'takeaways', titleSuffix: 'Strategic Recommendations for CISOs', purpose: 'Highlight core action items for executive leadership', message: 'Essential guidelines for embedded device procurement and cryptographic hardening.', visualIntent: 'diagram', dataIntent: false },
      { type: 'conclusion', titleSuffix: 'Securing the Connected Future', purpose: 'Synthesize embedded security vision', message: 'Building resilient cyber-physical systems through verified hardware trust.', visualIntent: 'none', dataIntent: false },
    ];
  } else if (lower.includes('rights') || lower.includes('law') || lower.includes('policy')) {
    sectionDefs = [
      { id: 'sec-01', title: 'Human Rights Foundations', purpose: 'Introduce universal declarations and principles' },
      { id: 'sec-02', title: 'Legal & Structural Frameworks', purpose: 'Analyze international treaties and enforcement' },
      { id: 'sec-03', title: 'Global Challenges & Case Studies', purpose: 'Examine systemic barriers and rights protection' },
      { id: 'sec-04', title: 'Advocacy & Action Plan', purpose: 'Synthesize key action items and conclusions' },
    ];
    archetypeSeq = [
      { type: 'title', titleSuffix: 'Foundations', purpose: 'Introduce fundamental human rights framework', message: 'Universal human dignity and international legal protections.', visualIntent: 'mixed', dataIntent: false },
      { type: 'overview', titleSuffix: 'Core Declarations & Pillars', purpose: 'Summarize Universal Declaration structure', message: 'Structure and scope of the 1948 Universal Declaration.', visualIntent: 'diagram', dataIntent: false },
      { type: 'concept', titleSuffix: 'Universal Human Rights Principle', purpose: 'Define inherent human dignity and equality', message: 'Inalienable, indivisible, and interdependent legal rights.', visualIntent: 'image', dataIntent: false },
      { type: 'comparison', titleSuffix: 'Civil vs Socio-Economic Rights', purpose: 'Distinguish negative vs positive rights', message: 'Distinguishing negative freedoms from positive state entitlements.', visualIntent: 'table', dataIntent: false },
      { type: 'cause-effect', titleSuffix: 'Institutional Discrimination Mechanisms', purpose: 'Detail systemic barriers to justice', message: 'Systemic barriers leading to disenfranchisement and legal violations.', visualIntent: 'diagram', dataIntent: true },
      { type: 'statistics', titleSuffix: 'Global Freedom & Justice Indices', purpose: 'Display freedom and judicial access metrics', message: 'International indices measuring freedom and judicial access.', visualIntent: 'chart', dataIntent: true },
      { type: 'case-study', titleSuffix: 'Environmental Justice Case Study', purpose: 'Examine community rights protection', message: 'Indigenous community land tenure protection case study.', visualIntent: 'image', dataIntent: false },
      { type: 'table', titleSuffix: 'International Human Rights Treaties', purpose: 'Tabulate UN conventions and ratification status', message: 'Core UN conventions and state ratification status.', visualIntent: 'table', dataIntent: true },
      { type: 'takeaways', titleSuffix: 'Key Advocacy Takeaways', purpose: 'Summarize core human rights principles', message: 'Priority actions for judicial independence and advocate protection.', visualIntent: 'diagram', dataIntent: false },
      { type: 'conclusion', titleSuffix: 'Upholding Human Dignity Worldwide', purpose: 'Call to action for global advocacy', message: 'Defending human rights and international justice globally.', visualIntent: 'none', dataIntent: false },
    ];
  } else {
    sectionDefs = [
      { id: 'sec-01', title: 'Introduction & Scope', purpose: 'Establish baseline environmental concepts' },
      { id: 'sec-02', title: 'Physical & Chemical Mechanisms', purpose: 'Detail contamination processes and feedback loops' },
      { id: 'sec-03', title: 'Impact Analysis & Metrics', purpose: 'Examine health burdens and regulatory thresholds' },
      { id: 'sec-04', title: 'Control Strategies & Conclusion', purpose: 'Synthesize purification workflows and takeaways' },
    ];
    archetypeSeq = [
      { type: 'title', titleSuffix: 'Comprehensive Overview', purpose: 'Introduce environmental pollution subject matter', message: 'Systemic analysis of environmental air and water pollution.', visualIntent: 'mixed', dataIntent: false },
      { type: 'overview', titleSuffix: 'Executive Agenda', purpose: 'Outline presentation topics', message: 'Outline covering mechanisms, health burdens, and remediation.', visualIntent: 'diagram', dataIntent: false },
      { type: 'concept', titleSuffix: 'Contamination Mechanisms', purpose: 'Explain fundamental physical/chemical processes', message: 'Atmospheric PM2.5 and aquatic pollutant discharge dynamics.', visualIntent: 'image', dataIntent: false },
      { type: 'cause-effect', titleSuffix: 'Environmental Feedback Loops', purpose: 'Detail cause, mechanism, and impacts', message: 'From industrial stack emissions to respiratory and aquatic morbidity.', visualIntent: 'diagram', dataIntent: true },
      { type: 'statistics', titleSuffix: 'Global Pollution Impact Metrics', purpose: 'Display key empirical metrics', message: 'Global WHO and Lancet mortality and economic burden statistics.', visualIntent: 'chart', dataIntent: true },
      { type: 'comparison', titleSuffix: 'Point vs Non-Point Sources', purpose: 'Compare point outfalls vs diffuse runoff', message: 'Differentiating point source outfalls from non-point diffuse runoff.', visualIntent: 'table', dataIntent: true },
      { type: 'table', titleSuffix: 'Contaminant Threshold Standards', purpose: 'Tabulate EPA concentration limits', message: 'EPA primary drinking water Maximum Contaminant Levels.', visualIntent: 'table', dataIntent: true },
      { type: 'process', titleSuffix: 'Wastewater Purification Workflow', purpose: 'Detail 4-stage treatment pipeline', message: 'Three-stage municipal wastewater treatment pipeline.', visualIntent: 'diagram', dataIntent: true },
      { type: 'takeaways', titleSuffix: 'Key Action Items for Sustainability', purpose: 'Highlight core action items', message: 'Priority remediation strategies for policy and industry.', visualIntent: 'diagram', dataIntent: false },
      { type: 'conclusion', titleSuffix: 'Restoring Planetary Balance', purpose: 'Summarize call to action', message: 'Achieving clean air and safe water through science-based standards.', visualIntent: 'none', dataIntent: false },
    ];
  }

  // Assign slide numbers to sections
  const slidesPerSec = Math.ceil(slideCount / sectionDefs.length);
  const sections: SectionPlan[] = sectionDefs.map((sec, idx) => {
    const startNum = idx * slidesPerSec + 1;
    const endNum = Math.min((idx + 1) * slidesPerSec, slideCount);
    const slideNumbers: number[] = [];
    for (let n = startNum; n <= endNum; n++) {
      slideNumbers.push(n);
    }
    return { ...sec, slideNumbers };
  });

  const slides: SlidePlan[] = [];

  for (let i = 0; i < slideCount; i++) {
    const slideNum = i + 1;
    const item = archetypeSeq[i % archetypeSeq.length];

    // Find section for this slide
    const parentSec = sections.find((s) => s.slideNumbers.includes(slideNum)) || sections[0];

    slides.push({
      slideNumber: slideNum,
      sectionId: parentSec.id,
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
