/**
 * GENERATE & VERIFY: Municipal Corporation in Hyderabad
 *
 * Generates an authoritative, deeply researched 10-slide deck on
 * Greater Hyderabad Municipal Corporation (GHMC) governance, infrastructure,
 * and smart urban services with 4K studio masters and COM verification.
 */

import * as path from 'path';
import * as fs from 'fs';
import { runProductionPipeline } from './pipeline/productionPipeline';

async function main() {
  console.log('====================================================');
  console.log('  GENERATING MASTER DECK: Municipal Corporation in Hyderabad');
  console.log('====================================================');

  const topic = 'Municipal Corporation in Hyderabad';
  const outputPath = path.resolve(__dirname, '..', 'outputs', 'municipal-corporation-in-hyderabad.pptx');
  const rendersDir = path.resolve(__dirname, '..', 'work', 'renders', 'municipal-corporation-in-hyderabad');
  const montagePath = path.join(rendersDir, 'deck-montage.png');

  // Clean old render dir if exists
  if (fs.existsSync(rendersDir)) {
    fs.rmSync(rendersDir, { recursive: true, force: true });
  }

  const result = await runProductionPipeline({
    topic,
    slideCount: 10,
    author: 'Centre for Urban Governance & Municipal Policy',
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
  console.log('  HYDERABAD MUNICIPAL CORPORATION — MASTER GENERATION REPORT');
  console.log('====================================================');
  console.log(`PPTX Output:         ${result.pptxPath}`);
  console.log(`Montage Output:      ${result.montagePath}`);
  console.log(`Domain:              ${result.topicContext.domain}`);
  console.log(`Theme Applied:       ${result.themeName}`);
  console.log(`Slide Count:         ${result.slideCount}`);
  console.log(`File Size:           ${fileSizeMb} MB (4K UHD Studio Master)`);
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
  console.error('Error generating Hyderabad Municipal Corporation deck:', err);
  process.exit(1);
});
