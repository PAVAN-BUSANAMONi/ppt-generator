/**
 * Color palette — reference editorial theme.
 * Teal / blue / mint / gold palette from the visual baseline.
 */

export const colors = {
  /** Primary ink — darkest teal-black */
  ink: '#073B3A',
  /** Secondary ink — slightly lighter */
  ink2: '#134E4A',
  /** Core teal accent */
  teal: '#0F766E',
  /** Blue accent */
  blue: '#0284C7',
  /** Mint background — light green wash */
  mint: '#DDF7EE',
  /** Mint background — even lighter */
  mint2: '#EFFBF5',
  /** Sky background — light blue wash */
  sky: '#EAF6FF',
  /** Gold accent — callouts, highlights */
  gold: '#C88A1E',
  /** Gold soft background */
  goldSoft: '#FFF3D6',
  /** Pure white */
  white: '#FFFFFF',
  /** Off-white — subtle warm background */
  off: '#F7FBF8',
  /** Slate — secondary text, muted labels */
  slate: '#52666A',
  /** Line — borders, dividers */
  line: '#B9D8D4',
  /** Dark — deep background, contrast panels */
  dark: '#052F35',
  /** Red — error, alert, danger */
  red: '#C2410C',
} as const;

export type ColorToken = keyof typeof colors;
