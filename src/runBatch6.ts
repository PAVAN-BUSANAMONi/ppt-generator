/**
 * BATCH 6 RUNNER — MICROSOFT POWERPOINT OPENABILITY VERIFICATION
 */

import * as path from 'path';
import * as fs from 'fs';
import { testPowerPointOpen } from './testBatch6';

async function main() {
  console.log('====================================================');
  console.log('  BATCH 6 — MICROSOFT POWERPOINT OPENABILITY VERIFICATION');
  console.log('====================================================\n');

  const outputsDir = path.resolve(__dirname, '..', 'outputs');
  const rendersDir = path.resolve(__dirname, '..', 'work', 'renders', 'batch6-verify');
  if (!fs.existsSync(rendersDir)) fs.mkdirSync(rendersDir, { recursive: true });

  const batch5Pptx = path.join(outputsDir, 'batch5-precision-agriculture.pptx');
  const transitionPptx = path.join(outputsDir, 'step15-transition-test.pptx');

  console.log('Testing 1: Production Deck (batch5-precision-agriculture.pptx)...');
  const exportBatch5Png = path.join(rendersDir, 'batch5-slide1.png');
  const resBatch5 = testPowerPointOpen(batch5Pptx, exportBatch5Png);
  console.log(`  Open Status:  ${resBatch5.openSuccess ? 'PASS' : 'FAIL'}`);
  console.log(`  Slide Count:  ${resBatch5.slideCount}`);
  if (resBatch5.errorMessage) console.log(`  Error:        ${resBatch5.errorMessage}`);
  if (resBatch5.exportedPng) console.log(`  Exported PNG: ${resBatch5.exportedPng}`);

  console.log('\nTesting 2: Transition Enhanced Deck (step15-transition-test.pptx)...');
  const exportTransPng = path.join(rendersDir, 'transition-slide2.png');
  const resTrans = testPowerPointOpen(transitionPptx, exportTransPng);
  console.log(`  Open Status:  ${resTrans.openSuccess ? 'PASS' : 'FAIL'}`);
  console.log(`  Slide Count:  ${resTrans.slideCount}`);
  if (resTrans.errorMessage) console.log(`  Error:        ${resTrans.errorMessage}`);
  if (resTrans.exportedPng) console.log(`  Exported PNG: ${resTrans.exportedPng}`);

  console.log('\n====================================================');
  console.log('  BATCH 6 VERIFICATION SUMMARY');
  console.log('====================================================');
  console.log(`STEP 16 (Transition XML Schema Order): ${resTrans.openSuccess ? 'PASS' : 'FAIL'}`);
  console.log(`STEP 17 (PowerPoint Open Both Files):`);
  console.log(`  batch5-precision-agriculture.pptx:    ${resBatch5.openSuccess ? 'PASS' : 'FAIL'} (${resBatch5.slideCount} slides)`);
  console.log(`  step15-transition-test.pptx:          ${resTrans.openSuccess ? 'PASS' : 'FAIL'} (${resTrans.slideCount} slides)`);
  console.log(`STEP 18 (Media/SVG Diagnostics):       ${resBatch5.openSuccess && resTrans.openSuccess ? 'NOT NEEDED' : 'REQUIRED'}`);
  console.log('====================================================\n');
}

main().catch(console.error);
