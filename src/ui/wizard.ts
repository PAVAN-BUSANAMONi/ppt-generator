/**
 * STEP 19 — INTERACTIVE PRESENTATION GENERATOR WIZARD (CLI)
 *
 * Provides a human-guided interactive wizard in terminal to configure and generate presentations.
 */

import * as readline from 'readline';
import { runProductionPipeline, ProductionPipelineOptions } from '../pipeline/productionPipeline';
import { SlideTransitionType } from '../export/transitionEnhancer';

export async function promptUser(question: string, defaultValue: string = ''): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    const promptText = defaultValue ? `${question} [${defaultValue}]: ` : `${question}: `;
    rl.question(promptText, (answer) => {
      rl.close();
      resolve(answer.trim() || defaultValue);
    });
  });
}

export async function runInteractiveWizard(): Promise<void> {
  console.log('====================================================');
  console.log('  🎯 PPT GENERATOR — INTERACTIVE PRESENTATION WIZARD');
  console.log('====================================================\n');

  const topic = await promptUser('Enter Presentation Topic', 'Water and Air Pollution');
  const slidesStr = await promptUser('Enter Slide Count', '10');
  const slideCount = parseInt(slidesStr, 10) || 10;
  const author = await promptUser('Enter Author / Organization', 'Environmental Protection & Policy Center');
  const transitionRaw = await promptUser('Select Slide Transition (none, fade, push, wipe, cut)', 'fade');
  const transition = (['none', 'fade', 'push', 'wipe', 'cut'].includes(transitionRaw)
    ? transitionRaw
    : 'fade') as SlideTransitionType;

  console.log('\n--- Configuration Summary ---');
  console.log(`Topic:      ${topic}`);
  console.log(`Slides:     ${slideCount}`);
  console.log(`Author:     ${author}`);
  console.log(`Transition: ${transition}`);
  console.log('-----------------------------\n');

  console.log('Launching Production Pipeline...\n');
  const result = await runProductionPipeline({
    topic,
    slideCount,
    author,
    transition,
  });

  console.log('\n====================================================');
  console.log('  🎉 PRESENTATION GENERATED SUCCESSFULLY');
  console.log('====================================================');
  console.log(`PPTX Path:           ${result.pptxPath}`);
  console.log(`Deck Montage:        ${result.montagePath}`);
  console.log(`PowerPoint Verified: ${result.powerpointVerification.openSuccess ? 'PASS' : 'FAIL'} (${result.powerpointVerification.slideCount} slides)`);
  console.log('====================================================\n');
}

if (require.main === module) {
  runInteractiveWizard().catch((err) => {
    console.error('Wizard Error:', err);
    process.exit(1);
  });
}
