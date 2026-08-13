/**
 * Typography scale — Aptos Display for headlines, Aptos for body.
 */

export interface TypeStyle {
  fontFace: string;
  fontSize: number;   // points
  bold?: boolean;
  italic?: boolean;
  lineSpacing?: number; // points (PptxGenJS lineSpacingMultiple alternative)
}

export const typography = {
  /** Hero / cover title — 52pt Aptos Display bold */
  display: {
    fontFace: 'Aptos Display',
    fontSize: 52,
    bold: true,
  } satisfies TypeStyle,

  /** Slide title — 38pt Aptos Display bold */
  title: {
    fontFace: 'Aptos Display',
    fontSize: 38,
    bold: true,
  } satisfies TypeStyle,

  /** Section header — 28pt Aptos bold */
  section: {
    fontFace: 'Aptos',
    fontSize: 28,
    bold: true,
  } satisfies TypeStyle,

  /** Card / block heading — 23pt Aptos bold */
  heading: {
    fontFace: 'Aptos',
    fontSize: 23,
    bold: true,
  } satisfies TypeStyle,

  /** Body copy — 18pt Aptos */
  body: {
    fontFace: 'Aptos',
    fontSize: 18,
    bold: false,
  } satisfies TypeStyle,

  /** Small text — 16pt Aptos */
  small: {
    fontFace: 'Aptos',
    fontSize: 16,
    bold: false,
  } satisfies TypeStyle,

  /** Caption / footnote — 12pt Aptos */
  caption: {
    fontFace: 'Aptos',
    fontSize: 12,
    bold: false,
  } satisfies TypeStyle,
} as const;

export type TypographyToken = keyof typeof typography;
