/**
 * Shape tokens — border radius and standard shape presets.
 * Radius values in pixels; convert with pxToInches() for PptxGenJS.
 */

export const shapes = {
  /** Card border radius — rounded corners */
  cardRadius: 12,
  /** Pill / badge radius */
  pillRadius: 20,
  /** Circle (use half of width/height) */
  circleRadius: 9999,
  /** No rounding */
  sharpRadius: 0,
  /** Subtle rounding — data cards, tables */
  softRadius: 6,
} as const;

export type ShapeToken = keyof typeof shapes;
