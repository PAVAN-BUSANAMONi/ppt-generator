/**
 * Deck Programmatic Inspector Utility
 *
 * Inspects presentation definitions for:
 * - Slide count
 * - Missing elements
 * - Object bounds
 * - Overflow
 * - Invalid coordinates
 */

import { PresentationDefinition } from './core/types';

export interface InspectionReport {
  slideCount: number;
  validSlideCount: boolean;
  missingElementsCount: number;
  outOfBoundsCount: number;
  invalidCoordsCount: number;
  warnings: string[];
  passed: boolean;
}

export function inspectPresentation(pres: PresentationDefinition): InspectionReport {
  const warnings: string[] = [];
  let missingElementsCount = 0;
  let outOfBoundsCount = 0;
  let invalidCoordsCount = 0;

  const canvasW = pres.canvas.width;
  const canvasH = pres.canvas.height;

  pres.slides.forEach((slide, idx) => {
    const slideNum = idx + 1;

    if (!slide.elements || slide.elements.length === 0) {
      warnings.push(`Slide ${slideNum} (${slide.id}): Has no elements!`);
      missingElementsCount++;
    }

    slide.elements.forEach((el, elIdx) => {
      const pos = el.position;
      const size = el.size;

      // 1. Check invalid coordinates (NaN, Infinity, undefined)
      if (
        typeof pos.x !== 'number' || Number.isNaN(pos.x) || !Number.isFinite(pos.x) ||
        typeof pos.y !== 'number' || Number.isNaN(pos.y) || !Number.isFinite(pos.y) ||
        typeof size.w !== 'number' || Number.isNaN(size.w) || !Number.isFinite(size.w) ||
        typeof size.h !== 'number' || Number.isNaN(size.h) || !Number.isFinite(size.h)
      ) {
        warnings.push(`Slide ${slideNum} Element ${elIdx} (${el.kind}): Invalid coordinates [x:${pos.x}, y:${pos.y}, w:${size.w}, h:${size.h}]`);
        invalidCoordsCount++;
      }

      // 2. Check negative coordinates or non-positive size (allowing h=0 for horizontal line shapes)
      const isLineShape = el.kind === 'shape' && el.shapeType === 'line';
      if (pos.x < 0 || pos.y < 0 || size.w <= 0 || (size.h < 0 || (!isLineShape && size.h === 0))) {
        warnings.push(`Slide ${slideNum} Element ${elIdx} (${el.kind}): Negative position or non-positive size [x:${pos.x}, y:${pos.y}, w:${size.w}, h:${size.h}]`);
        invalidCoordsCount++;
      }

      // 3. Check canvas boundary overflow
      const right = pos.x + size.w;
      const bottom = pos.y + size.h;

      if (right > canvasW + 0.05 || bottom > canvasH + 0.05) {
        warnings.push(`Slide ${slideNum} Element ${elIdx} (${el.kind}): Exceeds canvas bounds [right:${right.toFixed(2)} > ${canvasW}, bottom:${bottom.toFixed(2)} > ${canvasH}]`);
        outOfBoundsCount++;
      }
    });
  });

  const validSlideCount = pres.slides.length === 10;
  const passed = validSlideCount && missingElementsCount === 0 && outOfBoundsCount === 0 && invalidCoordsCount === 0;

  return {
    slideCount: pres.slides.length,
    validSlideCount,
    missingElementsCount,
    outOfBoundsCount,
    invalidCoordsCount,
    warnings,
    passed,
  };
}
