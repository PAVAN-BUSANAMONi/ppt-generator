#!/usr/bin/env node
/**
 * PPT Generator CLI — Production User Input Interface
 *
 * Usage:
 *   npx tsx src/cli.ts --topic "IoT Cybersecurity and Embedded Device Security" --transition fade
 *   npx tsx src/cli.ts --topic "Precision Agriculture and Climate Resilience" --slides 10
 */

import { runProductionPipeline, ProductionPipelineOptions } from './pipeline/productionPipeline';
import { SlideTransitionType } from './export/transitionEnhancer';

function parseArgs(argv: string[]): ProductionPipelineOptions {
  const args = argv.slice(2);
  let topic = 'Precision Agriculture and Climate Resilience';
  let slideCount = 10;
  let author = 'Strategic Research & Technology Center';
  let transition: SlideTransitionType = 'none';
  let outputPath: string | undefined;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--topic' || arg === '-t') {
      topic = args[++i];
    } else if (arg === '--slides' || arg === '-s' || arg === '--count') {
      slideCount = parseInt(args[++i], 10);
    } else if (arg === '--author' || arg === '-a') {
      author = args[++i];
    } else if (arg === '--transition' || arg === '--trans') {
      transition = args[++i] as SlideTransitionType;
    } else if (arg === '--output' || arg === '-o') {
      outputPath = args[++i];
    }
  }

  return {
    topic,
    slideCount,
    author,
    transition,
    outputPath,
  };
}

async function main() {
  const options = parseArgs(process.argv);
  const result = await runProductionPipeline(options);

  console.log('\n====================================================');
  console.log('  GENERATION COMPLETED SUCCESSFULLY');
  console.log('====================================================');
  console.log(`Topic:           ${result.topic}`);
  console.log(`Slides:          ${result.slideCount}`);
  console.log(`Production PPTX: ${result.pptxPath}`);
  console.log(`PNG Renders:     ${result.rendersDir}`);
  console.log(`Deck Montage:    ${result.montagePath}`);
  console.log(`PowerPoint COM:  ${result.powerpointVerification.openSuccess ? 'PASS' : 'FAIL'} (${result.powerpointVerification.slideCount} slides verified)`);
  console.log('====================================================\n');
}

if (require.main === module) {
  main().catch((err) => {
    console.error('Fatal CLI Error:', err);
    process.exit(1);
  });
}
