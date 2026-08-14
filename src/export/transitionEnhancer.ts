/**
 * Step 15 — Optional Slide Transitions (Post-Export OpenXML Enhancement)
 *
 * Adds optional slide transitions as a post-export pass without modifying static slide generation.
 *
 * Supported transition types:
 * - 'none' (Default — leaves static PPTX untouched)
 * - 'fade' (<p:fade/>)
 * - 'push' (<p:push dir="l"/>)
 * - 'wipe' (<p:wipe dir="r"/>)
 * - 'cut'  (<p:cut/>)
 *
 * 100% ECMA-376 compliant Schema Order for <p:sld>:
 * 1. <p:cSld>
 * 2. <p:clrMapOvr>
 * 3. <p:transition>  <-- Placed AFTER <p:clrMapOvr> and BEFORE <p:timing>/<p:extLst>/<p:sld>
 * 4. <p:timing>
 * 5. <p:extLst>
 */

import * as fs from 'fs';
import * as path from 'path';
import JSZip from 'jszip';

export type SlideTransitionType = 'none' | 'fade' | 'push' | 'wipe' | 'cut';
export type TransitionSpeed = 'slow' | 'med' | 'fast';

export interface TransitionEnhancerOptions {
  transitionType: SlideTransitionType;
  speed?: TransitionSpeed;
  targetSlides?: 'all' | number[]; // 'all' or 1-based slide indices (e.g., [2, 3])
}

export function generateTransitionXml(
  transitionType: SlideTransitionType,
  speed: TransitionSpeed = 'med'
): string {
  if (transitionType === 'none') return '';

  let effectXml = '<p:fade/>';
  if (transitionType === 'push') {
    effectXml = '<p:push dir="l"/>';
  } else if (transitionType === 'wipe') {
    effectXml = '<p:wipe dir="r"/>';
  } else if (transitionType === 'cut') {
    effectXml = '<p:cut/>';
  }

  return `<p:transition spd="${speed}" advClick="1">${effectXml}</p:transition>`;
}

export async function applySlideTransitions(
  pptxBuffer: Buffer,
  options: TransitionEnhancerOptions
): Promise<Buffer> {
  const transitionType = options.transitionType ?? 'none';
  if (transitionType === 'none') {
    return pptxBuffer;
  }

  const speed = options.speed ?? 'med';
  const transitionXml = generateTransitionXml(transitionType, speed);
  const zip = await JSZip.loadAsync(pptxBuffer);

  // Find all slide XML files in the ppt/slides/ directory
  const slideFilePaths = Object.keys(zip.files).filter((filePath) =>
    /^ppt\/slides\/slide\d+\.xml$/.test(filePath)
  );

  const targetSlides = options.targetSlides ?? 'all';

  for (const slidePath of slideFilePaths) {
    const match = slidePath.match(/slide(\d+)\.xml/);
    if (!match) continue;
    const slideNum = parseInt(match[1], 10);

    // Skip slide 1 if applying to all by default (keep title slide transition-free or match target)
    if (Array.isArray(targetSlides)) {
      if (!targetSlides.includes(slideNum)) continue;
    }

    const xmlContent = await zip.file(slidePath)?.async('text');
    if (!xmlContent) continue;

    // Check if transition already exists
    let modifiedXml = xmlContent;
    if (modifiedXml.includes('<p:transition')) {
      // Replace existing transition
      modifiedXml = modifiedXml.replace(/<p:transition[\s\S]*?<\/p:transition>/, transitionXml);
    } else if (modifiedXml.includes('</p:clrMapOvr>')) {
      // Insert immediately AFTER </p:clrMapOvr> (ECMA-376 schema compliant sequence)
      modifiedXml = modifiedXml.replace('</p:clrMapOvr>', `</p:clrMapOvr>${transitionXml}`);
    } else if (modifiedXml.includes('<p:clrMapOvr/>')) {
      modifiedXml = modifiedXml.replace('<p:clrMapOvr/>', `<p:clrMapOvr/>${transitionXml}`);
    } else if (modifiedXml.includes('<p:timing')) {
      // Insert before <p:timing>
      modifiedXml = modifiedXml.replace('<p:timing', `${transitionXml}<p:timing`);
    } else {
      modifiedXml = modifiedXml.replace('</p:sld>', `${transitionXml}</p:sld>`);
    }

    zip.file(slidePath, modifiedXml);
  }

  return (await zip.generateAsync({ type: 'nodebuffer' })) as Buffer;
}

export async function enhancePresentationFile(
  inputPptxPath: string,
  options: TransitionEnhancerOptions,
  outputPptxPath?: string
): Promise<string> {
  const destPath = outputPptxPath || inputPptxPath;
  const rawBuffer = fs.readFileSync(inputPptxPath);
  const enhancedBuffer = await applySlideTransitions(rawBuffer, options);

  const destDir = path.dirname(destPath);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  fs.writeFileSync(destPath, enhancedBuffer);
  return destPath;
}
