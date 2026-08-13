/**
 * Render Deck Previews & Montage
 *
 * Output:
 * - work/renders/slide-01.png ... slide-10.png
 * - work/renders/deck-montage.webp
 */

import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';
import { renderSlideToSvg } from './renderer/svgRenderer';
import { renderSlide } from './slides/registry';
import { reference10SlideDeckData } from './createReferenceDeck';

export async function renderDeckPreviews(): Promise<void> {
  const rendersDir = path.resolve(__dirname, '..', 'work', 'renders');
  if (!fs.existsSync(rendersDir)) {
    fs.mkdirSync(rendersDir, { recursive: true });
  }

  const slidePngPaths: string[] = [];

  console.log('Rendering 10 slide PNGs to work/renders/ …');

  for (let i = 0; i < reference10SlideDeckData.length; i++) {
    const slideData = reference10SlideDeckData[i];
    const slideDef = renderSlide(slideData);
    const svgStr = renderSlideToSvg(slideDef);

    const slideNum = String(i + 1).padStart(2, '0');
    const pngPath = path.join(rendersDir, `slide-${slideNum}.png`);

    const svgBuffer = Buffer.from(svgStr);
    await sharp(svgBuffer)
      .resize(1280, 720)
      .png()
      .toFile(pngPath);

    slidePngPaths.push(pngPath);
    console.log(`  ✔ slide-${slideNum}.png rendered`);
  }

  // Generate 2 rows x 5 columns montage WebP
  console.log('Generating work/renders/deck-montage.webp …');

  const thumbW = 400;
  const thumbH = 225; // 16:9
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

  const montagePath = path.join(rendersDir, 'deck-montage.webp');

  await sharp({
    create: {
      width: montageW,
      height: montageH,
      channels: 4,
      background: { r: 5, g: 47, b: 53, alpha: 1 }, // dark theme background
    },
  })
    .composite(compositeInputs)
    .webp({ quality: 90 })
    .toFile(montagePath);

  console.log(`  ✔ deck-montage.webp generated (${montageW}x${montageH})`);
}
