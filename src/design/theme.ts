/**
 * Theme — unified access to all design tokens.
 * Single theme for now: referenceEditorial.
 */

import { colors } from './colors';
import { typography, TypeStyle } from './typography';
import { canvas, grid, layout, colSpan } from './grid';
import { spacing, pxToInches, inchesToPx } from './spacing';
import { shapes } from './shapes';
import { shadows } from './shadows';

// ---------------------------------------------------------------------------
// Theme interface
// ---------------------------------------------------------------------------

export interface ThemeColors {
  ink: string;
  ink2: string;
  teal: string;
  blue: string;
  mint: string;
  mint2: string;
  sky: string;
  gold: string;
  goldSoft: string;
  white: string;
  off: string;
  slate: string;
  line: string;
  dark: string;
  red: string;
}

export interface ThemeTypography {
  display: TypeStyle;
  title: TypeStyle;
  section: TypeStyle;
  heading: TypeStyle;
  body: TypeStyle;
  small: TypeStyle;
  caption: TypeStyle;
}

export interface Theme {
  name: string;
  colors: ThemeColors;
  typography: ThemeTypography;
  canvas: typeof canvas;
  grid: typeof grid;
  layout: typeof layout;
  spacing: typeof spacing;
  shapes: typeof shapes;
  shadows: typeof shadows;
}

// ---------------------------------------------------------------------------
// referenceEditorial — default theme
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

export const defaultTheme = referenceEditorial;

// Re-export utilities so consumers can import from theme.ts
export { colSpan, pxToInches, inchesToPx };

