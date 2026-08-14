/**
 * Step 5, 6, 7 — Batch 3 Deck Generation, PNG Rendering & Verification Suite
 *
 * Generates and verifies:
 *   1. Reference Deck (Human Population & Environment) — 10 slides
 *   2. Climate Change & Planetary Resilience — 10 slides
 *   3. AI in Healthcare & Clinical Diagnostics — 10 slides
 */

import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';
import { generateReferenceDeck, reference10SlideDeckData } from './createReferenceDeck';
import { generateClimateDeck, generateAiHealthcareDeck, climate10SlideDeckData, aiHealthcare10SlideDeckData } from './createTopicDecks';
import { renderSlide } from './slides/registry';
import { renderSlideToSvg } from './renderer/svgRenderer';
import { SlideData } from './slides/types';

async function renderDeckToPngsAndMontage(
  deckName: string,
  slides: SlideData[],
  rendersSubDir: string
): Promise<string[]> {
  if (!fs.existsSync(rendersSubDir)) {
    fs.mkdirSync(rendersSubDir, { recursive: true });
  }

  const slidePngPaths: string[] = [];
  console.log(`\nRendering ${slides.length} PNGs for "${deckName}" into ${rendersSubDir} ...`);

  for (let i = 0; i < slides.length; i++) {
    const slideData = slides[i];
    const slideDef = renderSlide(slideData);
    const svgStr = renderSlideToSvg(slideDef);

    const slideNum = String(i + 1).padStart(2, '0');
    const pngPath = path.join(rendersSubDir, `slide-${slideNum}.png`);

    const svgBuffer = Buffer.from(svgStr);
    await sharp(svgBuffer)
      .resize(1280, 720)
      .png()
      .toFile(pngPath);

    slidePngPaths.push(pngPath);
    console.log(`  ✔ [${deckName}] slide-${slideNum}.png (${slideData.type}) rendered`);
  }

  // Generate 2x5 composite montage
  console.log(`  Generating montage for ${deckName} ...`);
  const thumbW = 400;
  const thumbH = 225;
  const cols = 5;
  const rows = 2;
  const padding = 20;

  const montageW = cols * thumbW + (cols + 1) * padding;
  const montageH = rows * thumbH + (rows + 1) * padding;

  const compositeInputs = [];

  for (let i = 0; i < slidePngPaths.length; i++) {
    const r = Math.floor(i / cols);
    const c = i % cols;

    const left = padding + c * (thumbW + padding);
    const top = padding + r * (thumbH + padding);

    const resizedPng = await sharp(slidePngPaths[i])
      .resize(thumbW, thumbH)
      .toBuffer();

    compositeInputs.push({
      input: resizedPng,
      left,
      top,
    });
  }

  const montagePath = path.join(rendersSubDir, 'deck-montage.webp');
  await sharp({
    create: {
      width: montageW,
      height: montageH,
      channels: 4,
      background: { r: 5, g: 47, b: 53, alpha: 1 },
    },
  })
    .composite(compositeInputs)
    .webp({ quality: 90 })
    .toFile(montagePath);

  console.log(`  ✔ [${deckName}] deck-montage.webp generated (${montageW}x${montageH})`);
  return slidePngPaths;
}

async function runBatch3Suite() {
  console.log('====================================================');
  console.log('  BATCH 3: STEPS 5, 6, 7 DECK SUITE & RENDER TEST');
  console.log('====================================================');

  const outputsDir = path.resolve(__dirname, '..', 'outputs');
  const rendersBaseDir = path.resolve(__dirname, '..', 'work', 'renders');

  if (!fs.existsSync(outputsDir)) fs.mkdirSync(outputsDir, { recursive: true });
  if (!fs.existsSync(rendersBaseDir)) fs.mkdirSync(rendersBaseDir, { recursive: true });

  // -------------------------------------------------------------------------
  // STEP 6: Reference Deck (Human Population & Environment)
  // -------------------------------------------------------------------------
  console.log('\n--- STEP 6: REFERENCE DECK (10 SLIDES) ---');
  const refPptxPath = path.join(outputsDir, 'reference-10-slide.pptx');
  await generateReferenceDeck(refPptxPath);
  console.log(`✔ Reference PPTX generated: ${refPptxPath}`);

  const refRendersDir = path.join(rendersBaseDir, 'reference');
  const refPngs = await renderDeckToPngsAndMontage('Reference Deck', reference10SlideDeckData, refRendersDir);

  // -------------------------------------------------------------------------
  // STEP 7A: Climate Change & Planetary Resilience Deck (10 Slides)
  // -------------------------------------------------------------------------
  console.log('\n--- STEP 7A: CLIMATE CHANGE DECK (10 SLIDES) ---');
  const climatePptxPath = path.join(outputsDir, 'climate-10-slide.pptx');
  await generateClimateDeck(climatePptxPath);
  console.log(`✔ Climate PPTX generated: ${climatePptxPath}`);

  const climateRendersDir = path.join(rendersBaseDir, 'climate');
  const climatePngs = await renderDeckToPngsAndMontage('Climate Deck', climate10SlideDeckData, climateRendersDir);

  // -------------------------------------------------------------------------
  // STEP 7B: AI in Healthcare & Clinical Diagnostics Deck (10 Slides)
  // -------------------------------------------------------------------------
  console.log('\n--- STEP 7B: AI HEALTHCARE DECK (10 SLIDES) ---');
  const healthPptxPath = path.join(outputsDir, 'ai-healthcare-10-slide.pptx');
  await generateAiHealthcareDeck(healthPptxPath);
  console.log(`✔ AI Healthcare PPTX generated: ${healthPptxPath}`);

  const healthRendersDir = path.join(rendersBaseDir, 'ai-healthcare');
  const healthPngs = await renderDeckToPngsAndMontage('AI Healthcare Deck', aiHealthcare10SlideDeckData, healthRendersDir);

  console.log('\n====================================================');
  console.log('  BATCH 3 SUITE GENERATION & RENDERING COMPLETE');
  console.log(`  Reference Slides:   ${refPngs.length}/10`);
  console.log(`  Climate Slides:     ${climatePngs.length}/10`);
  console.log(`  Healthcare Slides:  ${healthPngs.length}/10`);
  console.log('====================================================\n');
}

runBatch3Suite().catch((err) => {
  console.error('BATCH 3 SUITE FAILED:', err);
  process.exit(1);
});
