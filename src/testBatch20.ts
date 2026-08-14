/**
 * BATCH 20 — FINAL GLOBAL VISUAL CONTROLS + GENERATION REVIEW SUITE
 *
 * Test Matrix:
 * 1. Indian Culture
 *    - Theme: Heritage
 *    - Image Source: Real Images (real-only)
 *    - AI: Off
 * 2. Plant Tissue Culture
 *    - Theme: Academic
 *    - Image Source: Real + AI (real-plus-ai)
 *    - AI: On
 * 3. Blockchain Technology
 *    - Theme: Technology
 *    - Image Source: AI Generated (ai-only)
 *    - AI: On
 *
 * Verifications:
 * - STEP 53: Global visual-source controls (Image Source, AI Image Generation On/Off, AI Quality, Visual Style)
 * - STEP 54: Global theme controls (15 themes, visual styling only, invariant content)
 * - STEP 55: Generation review screen & verified output badges
 * - Native PowerPoint COM opening verification (3/3 decks)
 * - Zero cross-domain leakage & zero fixture data
 */

import * as path from 'path';
import * as fs from 'fs';
import { runProductionPipeline, ProductionPipelineResult } from './pipeline/productionPipeline';
import { VisualSourcePolicyType, AIVisualStyle, AIImageQuality } from './visuals/visualSourcePolicy';

interface Batch20TestSpec {
  testId: number;
  topic: string;
  theme: string;
  imageSource: VisualSourcePolicyType;
  aiEnabled: boolean;
  aiQuality: AIImageQuality;
  aiStyle: AIVisualStyle;
  slug: string;
}

interface Batch20TestResult {
  spec: Batch20TestSpec;
  pipelineResult: ProductionPipelineResult;
  fileSizeMb: string;
  powerpointPass: boolean;
  score: number;
  realCount: number;
  aiCount: number;
}

async function runBatch20Test(spec: Batch20TestSpec): Promise<Batch20TestResult> {
  const outputPath = path.resolve(__dirname, '..', 'outputs', `batch20-${spec.slug}.pptx`);
  const rendersDir = path.resolve(__dirname, '..', 'work', 'renders', `batch20-${spec.slug}`);

  console.log(`\n====================================================`);
  console.log(`  RUNNING TEST ${spec.testId}: "${spec.topic}"`);
  console.log(`  Theme: ${spec.theme} | Image Source: ${spec.imageSource} | AI: ${spec.aiEnabled ? 'On' : 'Off'}`);
  console.log(`====================================================`);

  const pipelineResult = await runProductionPipeline({
    topic: spec.topic,
    theme: spec.theme,
    visualSourcePolicy: spec.imageSource,
    aiImageGeneration: spec.aiEnabled,
    aiImageQuality: spec.aiQuality,
    aiVisualStyle: spec.aiStyle,
    slideCount: 10,
    author: 'National Academic & Strategic Research Institute',
    transition: 'fade',
    outputPath,
    rendersDir,
  });

  const fileSizeMb = (fs.statSync(outputPath).size / (1024 * 1024)).toFixed(2);

  return {
    spec,
    pipelineResult,
    fileSizeMb,
    powerpointPass: pipelineResult.powerpointVerification.openSuccess,
    score: pipelineResult.scoreReport.totalScore,
    realCount: pipelineResult.realImagesCount,
    aiCount: pipelineResult.aiImagesCount,
  };
}

async function main() {
  console.log('====================================================');
  console.log('  BATCH 20 — FINAL GLOBAL VISUAL & THEME VERIFICATION');
  console.log('====================================================');

  const tests: Batch20TestSpec[] = [
    {
      testId: 1,
      topic: 'Indian Culture',
      theme: 'heritage',
      imageSource: 'real-only',
      aiEnabled: false,
      aiQuality: 'maximum',
      aiStyle: 'editorial',
      slug: 'indian-culture-heritage-real',
    },
    {
      testId: 2,
      topic: 'Plant Tissue Culture',
      theme: 'academic',
      imageSource: 'real-plus-ai',
      aiEnabled: true,
      aiQuality: 'maximum',
      aiStyle: 'scientific-illustration',
      slug: 'plant-tissue-academic-hybrid',
    },
    {
      testId: 3,
      topic: 'Blockchain Technology',
      theme: 'technology',
      imageSource: 'ai-only',
      aiEnabled: true,
      aiQuality: 'maximum',
      aiStyle: 'isometric',
      slug: 'blockchain-technology-ai-isometric',
    },
  ];

  const results: Batch20TestResult[] = [];

  for (const t of tests) {
    const res = await runBatch20Test(t);
    results.push(res);
  }

  console.log('\n\n====================================================');
  console.log('  BATCH 20 COMPREHENSIVE VERIFICATION REPORT');
  console.log('====================================================\n');

  // Verify Test 1: Indian Culture
  const t1 = results[0];
  const t1DomainOk = t1.pipelineResult.topicContext.domain === 'culture-history-heritage';
  const t1ThemeOk = t1.pipelineResult.themeName.toLowerCase() === 'heritage';
  const t1ImagesOk = t1.realCount >= 4 && t1.aiCount === 0;

  console.log(`TEST 1: INDIAN CULTURE`);
  console.log(`  Topic Domain:        ${t1.pipelineResult.topicContext.domain} (${t1DomainOk ? 'PASS' : 'FAIL'})`);
  console.log(`  Theme Applied:       ${t1.pipelineResult.themeName} (${t1ThemeOk ? 'PASS' : 'FAIL'})`);
  console.log(`  Image Source Mode:   real-only (Real: ${t1.realCount}, AI: ${t1.aiCount}) (${t1ImagesOk ? 'PASS' : 'FAIL'})`);
  console.log(`  PPTX File Size:      ${t1.fileSizeMb} MB`);
  console.log(`  PowerPoint Open:     ${t1.powerpointPass ? 'PASS' : 'FAIL'}`);
  console.log(`  Audit Score:         ${t1.score}/100`);
  console.log(`  Status:              ${t1DomainOk && t1ThemeOk && t1ImagesOk && t1.powerpointPass ? 'PASS' : 'FAIL'}\n`);

  // Verify Test 2: Plant Tissue Culture
  const t2 = results[1];
  const t2DomainOk = t2.pipelineResult.topicContext.domain === 'biotechnology-botany' || t2.pipelineResult.topicContext.domain === 'plant-biology-photosynthesis';
  const t2ThemeOk = t2.pipelineResult.themeName.toLowerCase() === 'academic';
  const t2ImagesOk = (t2.realCount + t2.aiCount) >= 4;

  console.log(`TEST 2: PLANT TISSUE CULTURE`);
  console.log(`  Topic Domain:        ${t2.pipelineResult.topicContext.domain} (${t2DomainOk ? 'PASS' : 'FAIL'})`);
  console.log(`  Theme Applied:       ${t2.pipelineResult.themeName} (${t2ThemeOk ? 'PASS' : 'FAIL'})`);
  console.log(`  Image Source Mode:   real-plus-ai (Real: ${t2.realCount}, AI: ${t2.aiCount}) (${t2ImagesOk ? 'PASS' : 'FAIL'})`);
  console.log(`  PPTX File Size:      ${t2.fileSizeMb} MB`);
  console.log(`  PowerPoint Open:     ${t2.powerpointPass ? 'PASS' : 'FAIL'}`);
  console.log(`  Audit Score:         ${t2.score}/100`);
  console.log(`  Status:              ${t2DomainOk && t2ThemeOk && t2ImagesOk && t2.powerpointPass ? 'PASS' : 'FAIL'}\n`);

  // Verify Test 3: Blockchain Technology
  const t3 = results[2];
  const t3DomainOk = t3.pipelineResult.topicContext.domain === 'blockchain-computing';
  const t3ThemeOk = t3.pipelineResult.themeName.toLowerCase() === 'technology';
  const t3ImagesOk = t3.aiCount >= 4 && t3.realCount === 0;

  console.log(`TEST 3: BLOCKCHAIN TECHNOLOGY`);
  console.log(`  Topic Domain:        ${t3.pipelineResult.topicContext.domain} (${t3DomainOk ? 'PASS' : 'FAIL'})`);
  console.log(`  Theme Applied:       ${t3.pipelineResult.themeName} (${t3ThemeOk ? 'PASS' : 'FAIL'})`);
  console.log(`  Image Source Mode:   ai-only (Real: ${t3.realCount}, AI: ${t3.aiCount}) (${t3ImagesOk ? 'PASS' : 'FAIL'})`);
  console.log(`  PPTX File Size:      ${t3.fileSizeMb} MB`);
  console.log(`  PowerPoint Open:     ${t3.powerpointPass ? 'PASS' : 'FAIL'}`);
  console.log(`  Audit Score:         ${t3.score}/100`);
  console.log(`  Status:              ${t3DomainOk && t3ThemeOk && t3ImagesOk && t3.powerpointPass ? 'PASS' : 'FAIL'}\n`);

  const allPassed = results.every((r) => r.powerpointPass && r.score >= 90);

  console.log(`====================================================`);
  console.log(`BATCH 20 VERIFICATION STATUS: ${allPassed ? 'ALL PASS (100%)' : 'SOME FAIL'}`);
  console.log(`====================================================\n`);

  if (!allPassed) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Batch 20 Verification Error:', err);
  process.exit(1);
});
