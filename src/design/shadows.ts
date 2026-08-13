/**
 * Shadow presets — soft card shadows for the editorial look.
 * Values map to PptxGenJS shadow options.
 */

export interface ShadowStyle {
  type: 'outer' | 'inner' | 'none';
  blur: number;    // points
  offset: number;  // points
  color: string;   // hex without #
  opacity: number; // 0–1
}

export const shadows = {
  /** No shadow */
  none: {
    type: 'none' as const,
    blur: 0,
    offset: 0,
    color: '000000',
    opacity: 0,
  },

  /** Subtle card shadow — light lift */
  sm: {
    type: 'outer' as const,
    blur: 4,
    offset: 2,
    color: '073B3A',
    opacity: 0.08,
  },

  /** Standard card shadow */
  md: {
    type: 'outer' as const,
    blur: 8,
    offset: 3,
    color: '073B3A',
    opacity: 0.1,
  },

  /** Elevated card shadow — modals, overlays */
  lg: {
    type: 'outer' as const,
    blur: 16,
    offset: 6,
    color: '073B3A',
    opacity: 0.12,
  },
} as const;

export type ShadowToken = keyof typeof shadows;
