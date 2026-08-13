/**
 * Step 6 Renderer — renderPipeline
 * Complete end-to-end rendering, inspection, montage, and export pipeline.
 *
 * Pipeline sequence:
 * Slide Data → Archetype → PPTX Slide → PNG Render → Layout Inspection → Montage → PPTX Export
 */

import * as path from 'path';
import { PresentationDefinition } from '../core/types';
import { createPresentation, addSlide, exportPresentation } from '../core/presentation';
import { renderSlide } from '../slides/registry';
import { SlideData } from '../slides/types';
import { defaultTheme } from '../design/theme';
import { renderSlidesToPng, RenderedSlideResult } from './renderSlides';
import { inspectDeckLayout, formatInspectionReport, DeckInspectionReport } from './layoutInspector';
import { createDeckMontage } from './montage';

export interface PipelineOptions {
  presentationTitle: string;
  author?: string;
  slideDataList: SlideData[];
  pptxOutputPath: string;
  rendersDir: string;
  montageOutputPath: string;
}

export interface PipelineResult {
  presentation: PresentationDefinition;
  pptxPath: string;
  renderedSlides: RenderedSlideResult[];
  inspectionReport: DeckInspectionReport;
  montagePath: string;
  formattedReportText: string;
}

export async function runRenderPipeline(options: PipelineOptions): Promise<PipelineResult> {
  const t = defaultTheme;

  // 1. BUILD Presentation Definition from Slide Data
  let pres = createPresentation(options.presentationTitle, {
    author: options.author,
    canvas: {
      width: t.canvas.widthInches,
      height: t.canvas.heightInches,
      aspectRatio: t.canvas.aspectRatio,
    },
  });

  for (const slideData of options.slideDataList) {
    const slideDef = renderSlide(slideData);
    pres = addSlide(pres, slideDef);
  }

  // 2. PNG RENDER: Generate 1280x720 PNG image for every slide
  const renderedSlides = await renderSlidesToPng(pres.slides, options.rendersDir);

  // 3. LAYOUT INSPECTION: Verify bounds, overlap, overflow, typography, and footers
  const inspectionReport = inspectDeckLayout(pres);
  const formattedReportText = formatInspectionReport(inspectionReport);

  // 4. MONTAGE: Combine all rendered PNGs into WebP montage
  const montagePath = await createDeckMontage(renderedSlides, options.montageOutputPath);

  // 5. PPTX EXPORT: Write final presentation to .pptx file
  const pptxPath = await exportPresentation(pres, options.pptxOutputPath);

  return {
    presentation: pres,
    pptxPath,
    renderedSlides,
    inspectionReport,
    montagePath,
    formattedReportText,
  };
}
