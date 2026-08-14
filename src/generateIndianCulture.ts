/**
 * Indian Culture & Heritage Presentation Generator & Verifier
 */

import * as path from 'path';
import * as fs from 'fs';
import { runProductionPipeline } from './pipeline/productionPipeline';

async function main() {
  console.log('====================================================');
  console.log('  GENERATING INDIAN CULTURE & HERITAGE DECK');
  console.log('====================================================\n');

  const outputPath = path.resolve(__dirname, '..', 'outputs', 'indian-culture.pptx');
  const rendersDir = path.resolve(__dirname, '..', 'work', 'renders', 'indian-culture');

  const result = await runProductionPipeline({
    topic: 'Indian Culture and Heritage',
    slideCount: 10,
    author: 'National Cultural & Archaeological Heritage Institute',
    userInstructions: 'Highlight classical arts, UNESCO world heritage landmarks, and Vasudhaiva Kutumbakam pluralism',
    transition: 'fade',
    outputPath,
    rendersDir,
  });

  console.log('\n====================================================');
  console.log('  INDIAN CULTURE GENERATION REPORT');
  console.log('====================================================');
  console.log(`PPTX Output:       ${outputPath}`);
  console.log(`PPTX Exists:       ${fs.existsSync(outputPath)}`);
  console.log(`PPTX Size:         ${(fs.statSync(outputPath).size / (1024 * 1024)).toFixed(2)} MB`);
  console.log(`PowerPoint Open:   ${result.powerpointVerification.openSuccess ? 'PASS' : 'FAIL'} (${result.powerpointVerification.slideCount} slides)`);
  console.log(`Audit Score:       ${result.scoreReport.totalScore}/${result.scoreReport.maxScore} (${result.scoreReport.passed ? 'PASS' : 'FAIL'})`);
  
  let imageCount = 0;
  result.slideDefs.forEach((s, idx) => {
    s.elements.forEach((el) => {
      if (el.kind === 'image' && el.path && fs.existsSync(el.path)) {
        imageCount++;
        console.log(`  Slide ${idx + 1} Image: ${path.basename(el.path)}`);
      }
    });
  });
  console.log(`Images Embedded:   ${imageCount}/5`);
  console.log('====================================================\n');
}

main().catch((err) => {
  console.error('Error generating Indian Culture deck:', err);
  process.exit(1);
});
