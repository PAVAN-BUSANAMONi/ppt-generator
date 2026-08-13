/**
 * Step 6 Renderer — layoutInspector
 * Comprehensive layout quality & constraint verification engine.
 */

import { PresentationDefinition, SlideDefinition, SlideElement } from '../core/types';

export interface SlideCheckResult {
  slideNumber: number;
  slideId: string;
  bounds: 'PASS' | 'FAIL';
  overlap: 'PASS' | 'FAIL';
  overflow: 'PASS' | 'FAIL';
  typography: 'PASS' | 'FAIL';
  issues: string[];
}

export interface DeckInspectionReport {
  slideResults: SlideCheckResult[];
  totalSlides: number;
  passedSlides: number;
  failedSlides: number;
  status: 'PASS' | 'FAIL';
}

export function inspectDeckLayout(pres: PresentationDefinition): DeckInspectionReport {
  const slideResults: SlideCheckResult[] = [];

  const canvasW = pres.canvas.width;   // 13.333 inches
  const canvasH = pres.canvas.height;  // 7.5 inches
  const footerY = 6.85;                // footer boundary line in inches

  let totalPassed = 0;
  let totalFailed = 0;

  pres.slides.forEach((slide, idx) => {
    const slideNumber = idx + 1;
    const issues: string[] = [];

    let boundsOk = true;
    let overlapOk = true;
    let overflowOk = true;
    let typographyOk = true;

    const elements = slide.elements || [];

    if (elements.length === 0) {
      issues.push('Slide has zero elements.');
      boundsOk = false;
    }

    // 1. Check Bounds, Negative Position, & Small Fonts
    elements.forEach((el, elIdx) => {
      const pos = el.position;
      const size = el.size;

      // Negative or invalid coordinates
      if (pos.x < 0 || pos.y < 0) {
        issues.push(`Element ${elIdx} (${el.kind}): Negative position [x:${pos.x}, y:${pos.y}]`);
        boundsOk = false;
      }

      // Non-positive dimensions (allowing h=0 for line shapes)
      const isLine = el.kind === 'shape' && el.shapeType === 'line';
      if (size.w <= 0 || (size.h < 0 || (!isLine && size.h === 0))) {
        issues.push(`Element ${elIdx} (${el.kind}): Non-positive dimension [w:${size.w}, h:${size.h}]`);
        boundsOk = false;
      }

      // Canvas boundary check
      const right = pos.x + size.w;
      const bottom = pos.y + size.h;

      if (right > canvasW + 0.05 || bottom > canvasH + 0.05) {
        issues.push(`Element ${elIdx} (${el.kind}): Exceeds canvas bounds [right:${right.toFixed(2)} > ${canvasW}, bottom:${bottom.toFixed(2)} > ${canvasH}]`);
        boundsOk = false;
      }

      // Footer collision check (excluding footer line & text elements)
      if (pos.y < footerY && bottom > footerY + 0.1 && el.kind !== 'shape') {
        // Exclude footer text elements at the very bottom
        if (pos.y < footerY - 0.2) {
          issues.push(`Element ${elIdx} (${el.kind}): Collides with footer boundary [bottom:${bottom.toFixed(2)} > ${footerY}]`);
          overflowOk = false;
        }
      }

      // Typography check
      if (el.kind === 'text' && el.style.fontSize) {
        if (el.style.fontSize < 10) {
          issues.push(`Element ${elIdx} (text): Suspiciously small font size (${el.style.fontSize}pt < 10pt)`);
          typographyOk = false;
        }
      }
    });

    // 2. Check Overlap between major card shapes
    const cardShapes = elements.filter(
      (el) => el.kind === 'shape' && el.shapeType === 'rounded-rect'
    );

    for (let i = 0; i < cardShapes.length; i++) {
      for (let j = i + 1; j < cardShapes.length; j++) {
        const a = cardShapes[i];
        const b = cardShapes[j];

        if (intersects(a.position, a.size, b.position, b.size)) {
          issues.push(`Card ${i} and Card ${j} overlap!`);
          overlapOk = false;
        }
      }
    }

    const slidePassed = boundsOk && overlapOk && overflowOk && typographyOk;
    if (slidePassed) totalPassed++;
    else totalFailed++;

    slideResults.push({
      slideNumber,
      slideId: slide.id,
      bounds: boundsOk ? 'PASS' : 'FAIL',
      overlap: overlapOk ? 'PASS' : 'FAIL',
      overflow: overflowOk ? 'PASS' : 'FAIL',
      typography: typographyOk ? 'PASS' : 'FAIL',
      issues,
    });
  });

  return {
    slideResults,
    totalSlides: pres.slides.length,
    passedSlides: totalPassed,
    failedSlides: totalFailed,
    status: totalFailed === 0 ? 'PASS' : 'FAIL',
  };
}

function intersects(
  p1: { x: number; y: number },
  s1: { w: number; h: number },
  p2: { x: number; y: number },
  s2: { w: number; h: number }
): boolean {
  const margin = 0.05; // 0.05 inch tolerance
  return !(
    p1.x + s1.w - margin <= p2.x ||
    p2.x + s2.w - margin <= p1.x ||
    p1.y + s1.h - margin <= p2.y ||
    p2.y + s2.h - margin <= p1.y
  );
}

export function formatInspectionReport(report: DeckInspectionReport): string {
  let lines: string[] = [];

  lines.push('────────────────────────────────────────────');
  lines.push('  STEP 6 — LAYOUT INSPECTION REPORT');
  lines.push('────────────────────────────────────────────\n');

  report.slideResults.forEach((res) => {
    const numStr = String(res.slideNumber).padStart(2, '0');
    lines.push(`Slide ${numStr} (${res.slideId}):`);
    lines.push(`  bounds:     ${res.bounds}`);
    lines.push(`  overlap:    ${res.overlap}`);
    lines.push(`  overflow:   ${res.overflow}`);
    lines.push(`  typography: ${res.typography}`);

    if (res.issues.length > 0) {
      res.issues.forEach((iss) => lines.push(`    ⚠️ ${iss}`));
    }
    lines.push('');
  });

  lines.push('────────────────────────────────────────────');
  lines.push(`  Total Slides: ${report.totalSlides}`);
  lines.push(`  Passed:       ${report.passedSlides}`);
  lines.push(`  Failed:       ${report.failedSlides}`);
  lines.push(`  Final Status: ${report.status}`);
  lines.push('────────────────────────────────────────────\n');

  return lines.join('\n');
}
