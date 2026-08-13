/**
 * Step 9 — AI Presentation Planner
 *
 * Full end-to-end AI presentation creation pipeline:
 * Topic / User Request
 *   ↓
 * Qwen AI Planner (src/ai/qwenClient.ts)
 *   ↓
 * Validated Presentation Contract (src/contract/presentationContract.ts)
 *   ↓
 * Slide Archetype Registry (src/slides/registry.ts)
 *   ↓
 * Render Pipeline (src/renderer/renderPipeline.ts)
 *   ↓
 * PPTX + PNG Previews + WebP Montage + Inspection Report
 */

import * as path from 'path';
import { QwenClient, QwenClientOptions } from './qwenClient';
import { runRenderPipeline, PipelineResult } from '../renderer/renderPipeline';
import { PresentationContract } from '../contract/presentationContract';

export interface AiPlannerOptions {
  topic: string;
  numSlides?: number;
  audience?: string;
  outputFileName?: string;
  qwenOptions?: QwenClientOptions;
}

export interface AiPlannerResult extends PipelineResult {
  contract: PresentationContract;
}

export async function generateAiPresentation(
  options: AiPlannerOptions
): Promise<AiPlannerResult> {
  const numSlides = options.numSlides ?? 8;
  const topic = options.topic;

  console.log('====================================================');
  console.log('  STEP 9 — AI PRESENTATION PLANNER');
  console.log(`  Topic: "${topic}"`);
  console.log(`  Target Slide Count: ${numSlides}`);
  console.log('====================================================\n');

  // 1. CALL Qwen AI Client to plan the presentation and return PresentationContract
  const qwen = new QwenClient(options.qwenOptions);
  const contract = await qwen.generatePresentationJson(topic, numSlides, options.audience);

  console.log(`\n✔ Presentation Plan Created: "${contract.metadata.title}" (${contract.slides.length} slides)\n`);

  // 2. DEFINE Output paths
  const safeTopicName = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const fileName = options.outputFileName || `ai-presentation-${safeTopicName}.pptx`;

  const pptxOutputPath = path.resolve(__dirname, '..', 'outputs', fileName);
  const rendersDir = path.resolve(__dirname, '..', 'work', 'renders');
  const montageOutputPath = path.resolve(__dirname, '..', 'work', 'renders', 'ai-deck-montage.webp');

  // 3. EXECUTE Render Pipeline (Slide Archetypes -> PPTX -> PNGs -> Layout Inspection -> Montage)
  console.log('Executing Render Pipeline for AI Presentation …\n');
  const pipelineResult = await runRenderPipeline({
    presentationTitle: contract.metadata.title,
    author: contract.metadata.author || 'AI Presentation Planner',
    slideDataList: contract.slides,
    pptxOutputPath,
    rendersDir,
    montageOutputPath,
  });

  return {
    ...pipelineResult,
    contract,
  };
}
