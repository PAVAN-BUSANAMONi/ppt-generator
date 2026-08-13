/**
 * Spacing scale — consistent gaps, padding, and margins.
 * All values in pixels (converted to inches at render time).
 */

export const spacing = {
  /** Tightest gap — 4px */
  xs: 4,
  /** Small gap — 8px */
  sm: 8,
  /** Medium gap — 16px (matches gutter) */
  md: 16,
  /** Large gap — 24px */
  lg: 24,
  /** Extra-large gap — 32px */
  xl: 32,
  /** Section-level gap — 48px */
  '2xl': 48,
  /** Hero-level gap — 64px (matches side margins) */
  '3xl': 64,
} as const;

export type SpacingToken = keyof typeof spacing;

/** Convert px to inches (at 96 dpi). */
export function pxToInches(px: number): number {
  return px / 96;
}

/** Convert inches to px (at 96 dpi). */
export function inchesToPx(inches: number): number {
  return inches * 96;
}
