/**
 * Step 6 Renderer — renderSlides
 * Converts SlideDefinition array to PNG image files in work/renders/.
 */

import * as fs from 'fs';
import * as path from 'path';
import sharp from 'sharp';
import { SlideDefinition } from '../core/types';
import { renderSlideToSvg } from './svgRenderer';

export interface RenderedSlideResult {
  slideNumber: number;
  slideId: string;
  pngPath: string;
  width: number;
  height: number;
}

export async function renderSlideToPng(
  slide: SlideDefinition,
  outputPath: string
): Promise<string> {
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const svgStr = renderSlideToSvg(slide);
  const svgBuffer = Buffer.from(svgStr);

  await sharp(svgBuffer)
    .resize(1280, 720)
    .png()
    .toFile(outputPath);

  return outputPath;
}

export async function renderSlidesToPng(
  slides: SlideDefinition[],
  outputDir: string
): Promise<RenderedSlideResult[]> {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const results: RenderedSlideResult[] = [];

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    const slideNum = String(i + 1).padStart(2, '0');
    const pngPath = path.join(outputDir, `slide-${slideNum}.png`);

    await renderSlideToPng(slide, pngPath);

    results.push({
      slideNumber: i + 1,
      slideId: slide.id,
      pngPath,
      width: 1280,
      height: 720,
    });
  }

  return results;
}
