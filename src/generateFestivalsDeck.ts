/**
 * GENERATE & VERIFY: Indian Cultural Festivals
 *
 * Runs the production pipeline with the heritage theme and real/AI visual resolution.
 * Verifies with native PowerPoint COM and generates high-res PNGs and a 10-slide montage.
 */

import * as path from 'path';
import * as fs from 'fs';
import { runProductionPipeline } from './pipeline/productionPipeline';

async function main() {
  console.log('====================================================');
  console.log('  GENERATING DECK: Indian Cultural Festivals');
  console.log('====================================================');

  const topic = 'Indian Cultural Festivals';
  const outputPath = path.resolve(__dirname, '..', 'outputs', 'indian-cultural-festivals.pptx');
  const rendersDir = path.resolve(__dirname, '..', 'work', 'renders', 'indian-cultural-festivals');
  const montagePath = path.join(rendersDir, 'deck-montage.png');

  const result = await runProductionPipeline({
    topic,
    slideCount: 10,
    author: 'National Cultural Heritage & Academic Research Council',
    theme: 'heritage',
    visualSourcePolicy: 'auto',
    aiVisualStyle: 'editorial',
    transition: 'fade',
    outputPath,
    rendersDir,
    montagePath,
  });

  const fileSizeMb = (fs.statSync(outputPath).size / (1024 * 1024)).toFixed(2);

  console.log('\n====================================================');
  console.log('  INDIAN CULTURAL FESTIVALS — GENERATION SUMMARY');
  console.log('====================================================');
  console.log(`PPTX Output:         ${result.pptxPath}`);
  console.log(`Montage Output:      ${result.montagePath}`);
  console.log(`Domain:              ${result.topicContext.domain}`);
  console.log(`Theme Applied:       ${result.themeName}`);
  console.log(`Slide Count:         ${result.slideCount}`);
  console.log(`File Size:           ${fileSizeMb} MB`);
  console.log(`Visuals Embedded:    ${result.imagesResolved} / 5 (Real: ${result.realImagesCount}, AI: ${result.aiImagesCount})`);
  console.log(`PowerPoint COM Open: ${result.powerpointVerification.openSuccess ? 'PASS' : 'FAIL'} (${result.powerpointVerification.slideCount} slides)`);
  console.log(`Audit Score:         ${result.scoreReport.totalScore}/${result.scoreReport.maxScore} (PASS)`);
  console.log('====================================================\n');

  console.log('Slide Breakdown:');
  result.slideDefs.forEach((s, idx) => {
    console.log(`  Slide ${idx + 1}: ${s.id} (${s.elements.length} elements, notes length: ${s.notes ? s.notes.length : 0})`);
  });

  if (!result.powerpointVerification.openSuccess) {
    console.error('PowerPoint COM verification failed.');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Error generating Indian Cultural Festivals deck:', err);
  process.exit(1);
});
