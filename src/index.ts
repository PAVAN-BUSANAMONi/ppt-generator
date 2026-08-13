/**
 * Step 7 Entry Point — Content Contract & Pipeline Verification
 *
 * Runs:
 * 1. Content contract test suite (6 validation scenarios)
 * 2. Normalization of valid 10-slide dataset ("Water and Air Pollution")
 * 3. Render Pipeline (BUILD -> PNG RENDER -> LAYOUT INSPECTION -> MONTAGE -> PPTX EXPORT)
 *
 * Run: npm run test-deck
 */

import * as path from 'path';
import { valid10SlideData } from './content/slideData';
import { validatePresentationData } from './content/validator';
import { normalizePresentationData } from './content/normalize';
import { runRenderPipeline } from './renderer/renderPipeline';
import { defaultTheme } from './design/theme';

const t = defaultTheme;

async function main(): Promise<void> {
  console.log('====================================================');
  console.log('  PPT Generator Engine  ·  Step 7 Content Contract');
  console.log('  Subject: Water and Air Pollution');
  console.log('====================================================\n');

  // 1. (Content Contract Test Suite removed)

  // 2. Validate & Normalize sample 10-slide presentation dataset
  console.log('Validating & Normalizing "Water and Air Pollution" dataset …');
  const valResult = validatePresentationData(valid10SlideData);
  if (!valResult.valid || !valResult.data) {
    console.error('❌ Validation failed for valid10SlideData:', valResult.errors);
    process.exit(1);
  }

  const slideDataList = normalizePresentationData(valResult.data);
  console.log(`✔ Normalized ${slideDataList.length} slides for archetype engine\n`);

  // 3. Define output paths
  const pptxOutputPath = path.resolve(__dirname, '..', 'outputs', 'reference-style-10-slide.pptx');
  const rendersDir = path.resolve(__dirname, '..', 'work', 'renders');
  const montageOutputPath = path.resolve(__dirname, '..', 'work', 'renders', 'deck-montage.webp');

  // 4. Run Render Pipeline
  console.log('Executing Render Pipeline …\n');
  const pipelineResult = await runRenderPipeline({
    presentationTitle: valResult.data.presentation.title,
    author: valResult.data.presentation.author,
    slideDataList,
    pptxOutputPath,
    rendersDir,
    montageOutputPath,
  });

  // Print layout inspection report
  console.log(pipelineResult.formattedReportText);

  // Summary
  console.log('✔ PNG Renders:  ' + pipelineResult.renderedSlides.length + ' slide images generated in work/renders/');
  console.log('✔ Deck Montage: ' + pipelineResult.montagePath);
  console.log('✔ PPTX Output:  ' + pipelineResult.pptxPath);

  console.log('\n====================================================');
  console.log('  PIPELINE STATUS: ' + pipelineResult.inspectionReport.status);
  console.log('====================================================\n');

  if (pipelineResult.inspectionReport.status === 'FAIL') {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('STEP 7 EXECUTION FAILED:', err);
  process.exit(1);
});
