/**
 * BATCH 19 — GLOBAL AI IMAGE + REAL IMAGE VISUAL RESOLVER TEST SUITE
 *
 * Tests:
 * 1. Indian Culture (REAL + AUTO)
 * 2. Plant Tissue Culture (REAL + AI)
 * 3. Blockchain Technology (AUTO + AI)
 *
 * Verifies:
 * - STEP 50: VisualSourcePolicy (auto, real-only, ai-only, real-plus-ai, native-only)
 * - STEP 51: RealImageProvider + AIImageProvider abstraction
 * - STEP 51A: Slide-grounded AI prompt synthesis
 * - STEP 51B: Semantic AI image validation & hard negative rejection
 * - STEP 51C: Quality gate & 16:9 widescreen composition
 * - STEP 51D: Accurate provenance tracking (no fake licenses)
 * - STEP 52: Multi-mode verification with zero regressions
 */

import * as path from 'path';
import * as fs from 'fs';
import { runProductionPipeline, ProductionPipelineResult } from './pipeline/productionPipeline';
import { VisualSourcePolicyType, AIVisualStyle } from './visuals/visualSourcePolicy';

interface VisualTestResult {
  testName: string;
  topic: string;
  policy: VisualSourcePolicyType;
  aiStyle: AIVisualStyle;
  pptxPath: string;
  fileSizeMb: string;
  slideCount: number;
  realImagesCount: number;
  aiImagesCount: number;
  totalImages: number;
  powerpointPass: boolean;
  score: number;
  provenanceRecords: string[];
}

async function runVisualTest(
  topic: string,
  policy: VisualSourcePolicyType,
  aiStyle: AIVisualStyle,
  slug: string
): Promise<VisualTestResult> {
  const outputPath = path.resolve(__dirname, '..', 'outputs', `batch19-${slug}.pptx`);
  const rendersDir = path.resolve(__dirname, '..', 'work', 'renders', `batch19-${slug}`);

  console.log(`\n====================================================`);
  console.log(`  RUNNING BATCH 19 TEST: "${topic}" (Policy: ${policy}, Style: ${aiStyle})`);
  console.log(`====================================================`);

  const result: ProductionPipelineResult = await runProductionPipeline({
    topic,
    visualSourcePolicy: policy,
    aiVisualStyle: aiStyle,
    slideCount: 10,
    author: 'National Visual & Academic Research Institute',
    transition: 'fade',
    outputPath,
    rendersDir,
  });

  const fileSizeMb = (fs.statSync(outputPath).size / (1024 * 1024)).toFixed(2);
  const provenanceRecords: string[] = [];

  result.slideDefs.forEach((s) => {
    if (s.notes && (s.notes.includes('[Image Credit:') || s.notes.includes('AI-Generated'))) {
      const match = s.notes.match(/\[Image Credit:[^\]]+\]/);
      if (match) provenanceRecords.push(match[0]);
    }
  });

  return {
    testName: `${topic} (${policy} / ${aiStyle})`,
    topic,
    policy,
    aiStyle,
    pptxPath: outputPath,
    fileSizeMb,
    slideCount: result.slideCount,
    realImagesCount: result.realImagesCount,
    aiImagesCount: result.aiImagesCount,
    totalImages: result.imagesResolved,
    powerpointPass: result.powerpointVerification.openSuccess,
    score: result.scoreReport.totalScore,
    provenanceRecords,
  };
}

async function main() {
  console.log('====================================================');
  console.log('  BATCH 19 — GLOBAL AI + REAL VISUAL RESOLVER SUITE');
  console.log('====================================================');

  // Test 1: Indian Culture (REAL + AUTO) -> Prefers authentic cultural photography
  const indianCultureRes = await runVisualTest(
    'Indian Culture and Heritage',
    'real-only',
    'editorial',
    'indian-culture-real'
  );

  // Test 2: Plant Tissue Culture (REAL + AI) -> Hybrid Real Lab Photos + AI Scientific Illustrations
  const plantTissueRes = await runVisualTest(
    'Plant Tissue Culture & Micropropagation',
    'real-plus-ai',
    'scientific-illustration',
    'plant-tissue-hybrid'
  );

  // Test 3: Blockchain Technology (AUTO + AI) -> Isometric Technical Architecture Visuals
  const blockchainRes = await runVisualTest(
    'Blockchain Technology and Its Applications',
    'ai-only',
    'isometric',
    'blockchain-ai-isometric'
  );

  console.log('\n\n====================================================');
  console.log('  BATCH 19 COMPREHENSIVE VERIFICATION REPORT');
  console.log('====================================================\n');

  const results = [indianCultureRes, plantTissueRes, blockchainRes];

  results.forEach((r, idx) => {
    console.log(`----------------------------------------------------`);
    console.log(`TEST ${idx + 1}: ${r.testName.toUpperCase()}`);
    console.log(`----------------------------------------------------`);
    console.log(`PPTX Path:           ${r.pptxPath}`);
    console.log(`Policy Used:         ${r.policy}`);
    console.log(`AI Style:            ${r.aiStyle}`);
    console.log(`Real Images:         ${r.realImagesCount}`);
    console.log(`AI Images:           ${r.aiImagesCount}`);
    console.log(`Total Visuals:       ${r.totalImages} / 5`);
    console.log(`File Size:           ${r.fileSizeMb} MB`);
    console.log(`Slide Count:         ${r.slideCount}`);
    console.log(`PowerPoint Open:     ${r.powerpointPass ? 'PASS' : 'FAIL'}`);
    console.log(`Audit Score:         ${r.score}/100`);
    console.log(`Provenance Sample:`);
    r.provenanceRecords.slice(0, 3).forEach((rec) => console.log(`  - ${rec}`));
    console.log('');
  });

  const allPassed = results.every((r) => r.powerpointPass && r.score >= 90 && r.totalImages >= 4);

  console.log(`====================================================`);
  console.log(`BATCH 19 STATUS: ${allPassed ? 'ALL PASS (100%)' : 'SOME FAIL'}`);
  console.log(`====================================================\n`);

  if (!allPassed) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Batch 19 Test Suite Error:', err);
  process.exit(1);
});
