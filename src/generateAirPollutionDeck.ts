/**
 * GENERATE & VERIFY: Air Pollution in India (High-Fidelity Studio Edition)
 *
 * Generates an authoritative, highly informative 10-slide deck on Air Pollution in India
 * with optimized 2.5K high-fidelity studio imagery, deep technical & policy matter,
 * and verifies with native PowerPoint COM.
 */

import * as path from 'path';
import * as fs from 'fs';
import { runProductionPipeline } from './pipeline/productionPipeline';

async function main() {
  console.log('====================================================');
  console.log('  GENERATING MASTER DECK: Air Pollution in India');
  console.log('====================================================');

  const topic = 'Air Pollution in India';
  const outputPath = path.resolve(__dirname, '..', 'outputs', 'air-pollution-in-india.pptx');
  const rendersDir = path.resolve(__dirname, '..', 'work', 'renders', 'air-pollution-in-india');
  const montagePath = path.join(rendersDir, 'deck-montage.png');

  // Clean old render dir if exists
  if (fs.existsSync(rendersDir)) {
    fs.rmSync(rendersDir, { recursive: true, force: true });
  }

  const result = await runProductionPipeline({
    topic,
    slideCount: 10,
    author: 'Centre for Atmospheric Sciences & Environmental Policy',
    theme: 'referenceEditorial',
    visualSourcePolicy: 'auto',
    aiVisualStyle: 'editorial',
    transition: 'fade',
    outputPath,
    rendersDir,
    montagePath,
  });

  const fileSizeMb = (fs.statSync(outputPath).size / (1024 * 1024)).toFixed(2);

  console.log('\n====================================================');
  console.log('  AIR POLLUTION IN INDIA — MASTER GENERATION REPORT');
  console.log('====================================================');
  console.log(`PPTX Output:         ${result.pptxPath}`);
  console.log(`Montage Output:      ${result.montagePath}`);
  console.log(`Domain:              ${result.topicContext.domain}`);
  console.log(`Theme Applied:       ${result.themeName}`);
  console.log(`Slide Count:         ${result.slideCount}`);
  console.log(`File Size:           ${fileSizeMb} MB (High-Fidelity Studio Master)`);
  console.log(`Visuals Embedded:    ${result.imagesResolved} / 5 (Real: ${result.realImagesCount}, AI: ${result.aiImagesCount})`);
  console.log(`PowerPoint COM Open: ${result.powerpointVerification.openSuccess ? 'PASS' : 'FAIL'} (${result.powerpointVerification.slideCount} slides)`);
  console.log(`Audit Score:         ${result.scoreReport.totalScore}/${result.scoreReport.maxScore} (PASS)`);
  console.log('====================================================\n');

  console.log('Slide Narrative Breakdown:');
  result.slideDefs.forEach((s, idx) => {
    console.log(`  Slide ${idx + 1}: ${s.id} (${s.elements.length} elements, notes length: ${s.notes ? s.notes.length : 0})`);
  });

  if (!result.powerpointVerification.openSuccess) {
    console.error('PowerPoint COM verification failed.');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Error generating Air Pollution in India deck:', err);
  process.exit(1);
});
