/**
 * Step 6 Renderer — montage
 * Combines slide PNG preview images into a 2x5 grid WebP montage.
 */

import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';
import { RenderedSlideResult } from './renderSlides';

export async function createDeckMontage(
  renderedSlides: RenderedSlideResult[],
  outputPath: string
): Promise<string> {
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const thumbW = 400;
  const thumbH = 225; // 16:9
  const cols = 5;
  const rows = 2;
  const padding = 20;

  const montageW = cols * thumbW + (cols + 1) * padding;
  const montageH = rows * thumbH + (rows + 1) * padding;

  const compositeInputs = [];

  for (let i = 0; i < Math.min(renderedSlides.length, cols * rows); i++) {
    const r = Math.floor(i / cols);
    const c = i % cols;

    const left = padding + c * (thumbW + padding);
    const top = padding + r * (thumbH + padding);

    const resizedPng = await sharp(renderedSlides[i].pngPath)
      .resize(thumbW, thumbH)
      .toBuffer();

    compositeInputs.push({
      input: resizedPng,
      left,
      top,
    });
  }

  await sharp({
    create: {
      width: montageW,
      height: montageH,
      channels: 4,
      background: { r: 5, g: 47, b: 53, alpha: 1 }, // dark theme backdrop
    },
  })
    .composite(compositeInputs)
    .webp({ quality: 90 })
    .toFile(outputPath);

  return outputPath;
}
