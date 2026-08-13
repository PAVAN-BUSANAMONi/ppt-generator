/**
 * Executable Script for Batch 3 (Steps 7, 8, 9)
 *
 * Generates an AI-planned presentation on any arbitrary topic:
 * Topic -> Qwen AI Planner -> Structured Contract -> Archetype Engine -> PPTX + PNGs + Montage
 *
 * Run: npx tsx src/generateAiDeck.ts "Artificial Intelligence in Medicine"
 */

import { generateAiPresentation } from './ai/presentationPlanner';

async function main(): Promise<void> {
  const topicArg = process.argv[2] || 'Artificial Intelligence in Medicine';
  const slidesArg = parseInt(process.argv[3] || '8', 10);

  console.log(`Starting AI Deck Generation for topic: "${topicArg}" …\n`);

  const result = await generateAiPresentation({
    topic: topicArg,
    numSlides: slidesArg,
    audience: 'Medical Professionals & AI Researchers',
  });

  console.log(result.formattedReportText);

  console.log('✔ PPTX Output:  ' + result.pptxPath);
  console.log('✔ Deck Montage: ' + result.montagePath);
  console.log('✔ PNG Renders:  ' + result.renderedSlides.length + ' slide previews rendered');

  console.log('\n====================================================');
  console.log('  AI PRESENTATION PIPELINE: ' + result.inspectionReport.status);
  console.log('====================================================\n');
}

main().catch((err) => {
  console.error('AI Deck Generation Failed:', err);
  process.exit(1);
});
