/**
 * STEP 23 & 26 — UNIVERSAL TOPIC-DRIVEN PRODUCTION PIPELINE
 *
 * Universal, content-driven end-to-end pipeline:
 * USER TOPIC + REQUIREMENTS -> UNIVERSAL TOPIC CONTEXT -> DOMAIN RESEARCH ->
 * GROUNDED DATA -> BLUEPRINT GENERATOR -> DYNAMIC CONTENT ENGINE ->
 * DETERMINISTIC RENDERER -> PPTX EXPORT -> OPENXML TRANSITIONS ->
 * PNG RENDERING -> POWERPOINT COM VERIFICATION -> REQUIREMENT SCORE AUDIT.
 */

import * as fs from 'fs';
import * as path from 'path';
import { createUniversalTopicContext, UniversalTopicContext } from '../core/topicContext';
import { conductTopicResearch } from '../research/search';
import { extractGroundedDataSpecs } from '../data/dataResearcher';
import { AssetManager } from '../assets/assetManager';
import { VisualPlan } from '../visuals/visualTypes';
import { synthesizeDynamicSlides } from '../content/dynamicContentEngine';
import { createPresentation, addSlide, exportPresentation } from '../core/presentation';
import { renderSlide } from '../slides/registry';
import { SlideDefinition } from '../core/types';
import { renderSlidesToPng } from '../renderer/renderSlides';
import { createDeckMontage } from '../renderer/montage';
import { SlideTransitionType, enhancePresentationFile } from '../export/transitionEnhancer';
import { testPowerPointOpen, PowerpointOpenResult } from '../testBatch6';
import { resolveTheme } from '../design/themeResolver';
import { defaultTheme, Theme } from '../design/theme';
import {
  PresentationRequirements,
  PresentationBlueprint,
  RequirementScoreReport,
} from '../requirements/requirementTypes';
import { createPresentationBlueprint } from '../requirements/blueprintGenerator';
import { auditPresentationRequirements } from '../requirements/requirementAuditor';

import {
  VisualSourcePolicyType,
  AIVisualStyle,
  AIImageQuality,
  VisualSourceConfig,
} from '../visuals/visualSourcePolicy';
import { VisualSourceResolver } from '../visuals/visualSourceResolver';

export interface ProductionPipelineOptions {
  topic: string;
  slideCount?: number;
  author?: string;
  audience?: string;
  purpose?: string;
  depth?: string;
  userInstructions?: string;
  transition?: SlideTransitionType;
  outputPath?: string;
  rendersDir?: string;
  montagePath?: string;
  theme?: string | Theme;
  customThemeConfig?: Partial<Theme>;
  darkTitleAndConclusion?: boolean;
  visualSourcePolicy?: VisualSourcePolicyType;
  aiImageGeneration?: boolean;
  aiImageQuality?: AIImageQuality;
  aiVisualStyle?: AIVisualStyle;
}

export interface ProductionPipelineResult {
  topic: string;
  pptxPath: string;
  rendersDir: string;
  montagePath: string;
  slideCount: number;
  sourcesCount: number;
  imagesResolved: number;
  realImagesCount: number;
  aiImagesCount: number;
  dataSpecsCount: number;
  powerpointVerification: PowerpointOpenResult;
  slideDefs: SlideDefinition[];
  topicContext: UniversalTopicContext;
  blueprint: PresentationBlueprint;
  scoreReport: RequirementScoreReport;
  themeName: string;
}

export function slugifyTopic(topic: string): string {
  return topic
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export async function runProductionPipeline(
  options: ProductionPipelineOptions
): Promise<ProductionPipelineResult> {
  const topic = options.topic;
  const slideCount = options.slideCount ?? 10;
  const author = options.author ?? 'Center for Strategic & Academic Research';
  const transition = options.transition ?? 'none';

  // 1. Universal Topic Context & Normalization
  const topicCtx = createUniversalTopicContext(topic);
  const slug = topicCtx.slug;

  // 2. Global Theme Resolution (Auto vs. User Selection)
  const t = resolveTheme(options.theme, topicCtx, options.customThemeConfig);
  console.log(`[Pipeline] Visual Theme Selected: "${t.name}" (Colors: Ink ${t.colors.ink}, Accent ${t.colors.teal})`);

  // 2. Build Presentation Requirements Contract
  const requirements: PresentationRequirements = {
    topic,
    audience: (options.audience as any) || 'executive',
    purpose: (options.purpose as any) || 'educational',
    depth: (options.depth as any) || 'deep',
    slideCount,
    author,
    userInstructions: options.userInstructions,
    visualRequirements: {
      images: 'auto',
      charts: 'auto',
      tables: 'auto',
      diagrams: 'auto',
      speakerNotes: true,
      references: true,
    },
    transition,
  };

  console.log('====================================================');
  console.log(`  RUNNING PRODUCTION REQUIREMENT ENGINE: "${topic}"`);
  console.log(`  Domain: ${topicCtx.domain} | Slide Count: ${slideCount} | Transition: ${transition}`);
  if (options.userInstructions) console.log(`  User Instructions: "${options.userInstructions}"`);
  console.log('====================================================\n');

  // 3. Output Paths
  const outputsDir = path.resolve(__dirname, '..', '..', 'outputs');
  if (!fs.existsSync(outputsDir)) fs.mkdirSync(outputsDir, { recursive: true });

  const pptxPath = options.outputPath || path.join(outputsDir, `${slug}.pptx`);
  const rendersDir = options.rendersDir || path.resolve(__dirname, '..', '..', 'work', 'renders', slug);
  if (!fs.existsSync(rendersDir)) fs.mkdirSync(rendersDir, { recursive: true });

  const montagePath = options.montagePath || path.join(rendersDir, 'deck-montage.png');

  // 4. Step: Conduct Domain Research
  console.log(`[Pipeline] 1. Sourcing Authoritative Research for: "${topic}"...`);
  const registry = await conductTopicResearch(topic);
  console.log(`✔ Sourced ${registry.sources.length} domain sources.`);

  // 5. Step: Extract Grounded DataSpecs
  console.log(`[Pipeline] 2. Extracting Grounded DataSpecs...`);
  const dataSpecs = extractGroundedDataSpecs(topic, registry);
  console.log(`✔ Extracted ${dataSpecs.length} grounded DataSpecs.`);

  // 6. Step: Generate Structured Presentation Blueprint (4 logical sections)
  console.log(`[Pipeline] 3. Constructing 4-Section Presentation Blueprint...`);
  const blueprint = createPresentationBlueprint(requirements, topicCtx, registry, dataSpecs);
  console.log(`✔ Blueprint Created with ${blueprint.sections.length} sections and ${blueprint.slideBlueprints.length} slide plans.`);

  // 7. Step: Visual Source Resolver (Real Images + Local AI + Native Fallback)
  const visualConfig: VisualSourceConfig = {
    policy: options.visualSourcePolicy || 'auto',
    aiEnabled: options.aiImageGeneration !== false,
    aiQuality: options.aiImageQuality || 'maximum',
    aiStyle:
      options.aiVisualStyle ||
      (topicCtx.domain === 'plant-biology-photosynthesis'
        ? 'scientific-illustration'
        : topicCtx.domain === 'blockchain-computing' || topicCtx.domain === 'cybersecurity-computing'
        ? 'technical-illustration'
        : 'editorial'),
  };

  console.log(
    `[Pipeline] 4. Resolving Visual Assets via VisualSourceResolver (Policy: ${visualConfig.policy}, AI Style: ${visualConfig.aiStyle})...`
  );
  const visualResolver = new VisualSourceResolver();

  // 7A. Hero image plan
  const heroPlan: VisualPlan = {
    type: 'photo',
    purpose: topicCtx.imageQueries.hero.purpose,
    relevanceQuery: topicCtx.imageQueries.hero.query,
    placement: 'right',
    importance: 'primary',
    aspectRatio: 'portrait',
  };
  const heroRes = await visualResolver.resolveVisual({
    topic,
    sectionTitle: 'Title & Introduction',
    slideTitle: topicCtx.normalizedTitle,
    slidePurpose: topicCtx.imageQueries.hero.purpose,
    visualIntent: topicCtx.imageQueries.hero.purpose,
    audience: options.audience,
    theme: t.name,
    visualPlan: heroPlan,
    config: visualConfig,
  });

  // 7B. Concept image plan
  const conceptPlan: VisualPlan = {
    type: 'photo',
    purpose: topicCtx.imageQueries.concept.purpose,
    relevanceQuery: topicCtx.imageQueries.concept.query,
    placement: 'right',
    importance: 'primary',
    aspectRatio: 'landscape',
  };
  const conceptRes = await visualResolver.resolveVisual({
    topic,
    sectionTitle: 'Technical Architecture & Foundational Principles',
    slideTitle: topicCtx.eyebrows.concept,
    slidePurpose: topicCtx.imageQueries.concept.purpose,
    visualIntent: topicCtx.imageQueries.concept.purpose,
    audience: options.audience,
    theme: t.name,
    visualPlan: conceptPlan,
    config: visualConfig,
  });

  // 7C. Case study image plan
  const casePlan: VisualPlan = {
    type: 'photo',
    purpose: topicCtx.imageQueries.caseStudy.purpose,
    relevanceQuery: topicCtx.imageQueries.caseStudy.query,
    placement: 'right',
    importance: 'primary',
    aspectRatio: 'landscape',
  };
  const caseRes = await visualResolver.resolveVisual({
    topic,
    sectionTitle: 'Commercial Deployment & Strategic Synthesis',
    slideTitle: topicCtx.eyebrows.caseStudy,
    slidePurpose: topicCtx.imageQueries.caseStudy.purpose,
    visualIntent: topicCtx.imageQueries.caseStudy.purpose,
    audience: options.audience,
    theme: t.name,
    visualPlan: casePlan,
    config: visualConfig,
  });

  // 7D. Process image plan
  const processPlan: VisualPlan = {
    type: 'photo',
    purpose: topicCtx.imageQueries.process.purpose,
    relevanceQuery: topicCtx.imageQueries.process.query,
    placement: 'right',
    importance: 'supporting',
    aspectRatio: 'landscape',
  };
  const processRes = await visualResolver.resolveVisual({
    topic,
    sectionTitle: 'Operational Workflows & System Transitions',
    slideTitle: topicCtx.eyebrows.process,
    slidePurpose: topicCtx.imageQueries.process.purpose,
    visualIntent: topicCtx.imageQueries.process.purpose,
    audience: options.audience,
    theme: t.name,
    visualPlan: processPlan,
    config: visualConfig,
  });

  // 7E. Statistics image plan
  const statisticsPlan: VisualPlan = {
    type: 'photo',
    purpose: topicCtx.imageQueries.statistics.purpose,
    relevanceQuery: topicCtx.imageQueries.statistics.query,
    placement: 'right',
    importance: 'supporting',
    aspectRatio: 'landscape',
  };
  const statisticsRes = await visualResolver.resolveVisual({
    topic,
    sectionTitle: 'Empirical Metrics & Industry Benchmarks',
    slideTitle: topicCtx.eyebrows.statistics,
    slidePurpose: topicCtx.imageQueries.statistics.purpose,
    visualIntent: topicCtx.imageQueries.statistics.purpose,
    audience: options.audience,
    theme: t.name,
    visualPlan: statisticsPlan,
    config: visualConfig,
  });

  let realImagesCount = 0;
  let aiImagesCount = 0;
  [heroRes, conceptRes, caseRes, processRes, statisticsRes].forEach((r) => {
    if (r.asset) {
      if (r.sourceType === 'real') realImagesCount++;
      else if (r.sourceType === 'ai-generated') aiImagesCount++;
    }
  });
  const imagesResolved = realImagesCount + aiImagesCount;
  console.log(`✔ Resolved ${imagesResolved} visual assets (${realImagesCount} Real, ${aiImagesCount} AI).`);

  // 8. Step: Synthesize Dynamic Slide Models via Dynamic Content Engine
  console.log(`[Pipeline] 5. Synthesizing ${slideCount} Dynamic Slide Models (with Speaker Notes & Citations)...`);
  const slidesData = synthesizeDynamicSlides(
    topicCtx,
    registry,
    dataSpecs,
    {
      heroPath: heroRes.asset?.localPath,
      conceptPath: conceptRes.asset?.localPath,
      caseStudyPath: caseRes.asset?.localPath,
      processPath: processRes.asset?.localPath,
      statisticsPath: statisticsRes.asset?.localPath,
      heroAttribution: heroRes.attribution
        ? `"${heroRes.attribution.title}" by ${heroRes.attribution.creator} (${heroRes.attribution.license}) - ${heroRes.attribution.sourceUrl}`
        : undefined,
      conceptAttribution: conceptRes.attribution
        ? `"${conceptRes.attribution.title}" by ${conceptRes.attribution.creator} (${conceptRes.attribution.license}) - ${conceptRes.attribution.sourceUrl}`
        : undefined,
      caseStudyAttribution: caseRes.attribution
        ? `"${caseRes.attribution.title}" by ${caseRes.attribution.creator} (${caseRes.attribution.license}) - ${caseRes.attribution.sourceUrl}`
        : undefined,
      processAttribution: processRes.attribution
        ? `"${processRes.attribution.title}" by ${processRes.attribution.creator} (${processRes.attribution.license}) - ${processRes.attribution.sourceUrl}`
        : undefined,
      statisticsAttribution: statisticsRes.attribution
        ? `"${statisticsRes.attribution.title}" by ${statisticsRes.attribution.creator} (${statisticsRes.attribution.license}) - ${statisticsRes.attribution.sourceUrl}`
        : undefined,
    },
    slideCount,
    requirements
  );

  // 9. Step: Render Slide Definitions into Core Engine
  console.log(`[Pipeline] 6. Rendering Slide Definitions into Core Engine...`);
  const slideDefs: SlideDefinition[] = slidesData.map((d) => renderSlide({ ...d, theme: t }));

  // 10. Step: Create & Export Native Presentation
  console.log(`[Pipeline] 7. Exporting Native Presentation to: ${pptxPath}...`);
  let pres = createPresentation(topic, { author });
  slideDefs.forEach((s) => {
    pres = addSlide(pres, s);
  });
  await exportPresentation(pres, pptxPath);
  console.log(`✔ Native Presentation Exported successfully.`);

  // 11. Step: Apply Optional Slide Transitions (OpenXML post-export pass)
  if (transition !== 'none') {
    console.log(`[Pipeline] 8. Applying Slide Transition: "${transition}" (OpenXML post-export pass)...`);
    await enhancePresentationFile(pptxPath, {
      transitionType: transition,
      speed: 'med',
      targetSlides: 'all',
    });
    console.log(`✔ Slide Transitions applied.`);
  }

  // 12. Step: Render PNGs & Montage
  console.log(`[Pipeline] 9. Rendering All Slide PNGs into: ${rendersDir}...`);
  const renderResults = await renderSlidesToPng(slideDefs, rendersDir);
  console.log(`✔ Rendered ${renderResults.length} Slide PNGs.`);

  console.log(`[Pipeline] 10. Generating 10-Slide Deck Montage: ${montagePath}...`);
  await createDeckMontage(renderResults, montagePath);
  console.log(`✔ Deck Montage Created.`);

  // 13. Step: Automated PowerPoint COM Verification
  console.log(`[Pipeline] 11. Verifying Presentation with Microsoft PowerPoint COM...`);
  const exportCheckPng = path.join(rendersDir, 'com-verify-slide1.png');
  const powerpointVerification = testPowerPointOpen(pptxPath, exportCheckPng);
  console.log(`  PowerPoint Open Status: ${powerpointVerification.openSuccess ? 'PASS' : 'FAIL'} (${powerpointVerification.slideCount} slides)`);

  // 14. Step: Comprehensive Requirement Score Audit
  console.log(`[Pipeline] 12. Running Automated Requirement Score Audit...`);
  const scoreReport = auditPresentationRequirements(
    topic,
    slideDefs,
    blueprint,
    imagesResolved,
    powerpointVerification
  );
  console.log(`  Requirement Audit Score: ${scoreReport.totalScore}/${scoreReport.maxScore} (${scoreReport.passed ? 'PASS' : 'FAIL'})`);

  return {
    topic,
    pptxPath,
    rendersDir,
    montagePath,
    slideCount: slideDefs.length,
    sourcesCount: registry.sources.length,
    imagesResolved,
    realImagesCount,
    aiImagesCount,
    dataSpecsCount: dataSpecs.length,
    powerpointVerification,
    slideDefs,
    topicContext: topicCtx,
    blueprint,
    scoreReport,
    themeName: t.name,
  };
}
