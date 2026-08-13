/**
 * Theme — unified access to all design tokens.
 * Single theme for now: referenceEditorial.
 */

import { colors } from './colors';
import { typography } from './typography';
import { canvas, grid, layout, colSpan } from './grid';
import { spacing, pxToInches, inchesToPx } from './spacing';
import { shapes } from './shapes';
import { shadows } from './shadows';

// ---------------------------------------------------------------------------
// Theme interface
// ---------------------------------------------------------------------------

export interface Theme {
  name: string;
  colors: typeof colors;
  typography: typeof typography;
  canvas: typeof canvas;
  grid: typeof grid;
  layout: typeof layout;
  spacing: typeof spacing;
  shapes: typeof shapes;
  shadows: typeof shadows;
}

// ---------------------------------------------------------------------------
// referenceEditorial — the one and only theme
// ---------------------------------------------------------------------------

export const referenceEditorial: Theme = {
  name: 'referenceEditorial',
  colors,
  typography,
  canvas,
  grid,
  layout,
  spacing,
  shapes,
  shadows,
};

// ---------------------------------------------------------------------------
// Default export — always referenceEditorial for now
// ---------------------------------------------------------------------------

export const defaultTheme = referenceEditorial;

// Re-export utilities so consumers can import from theme.ts
export { colSpan, pxToInches, inchesToPx };
