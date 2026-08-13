/**
 * Component 1: textBox
 * Low-level text component using design system tokens.
 */

import { TextElement, TextStyle } from '../core/types';
import { defaultTheme, Theme } from '../design/theme';

function hex(color: string): string {
  return color.replace(/^#/, '');
}

export interface TextBoxOptions {
  text: string;
  x: number;
  y: number;
  w: number;
  h: number;
  fontFace?: string;
  fontSize?: number;
  color?: string;
  bold?: boolean;
  italic?: boolean;
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  padding?: number | [number, number, number, number];
  boxFill?: string;
  boxStroke?: string;
  bullet?: boolean | { code?: string; color?: string };
  lineSpacing?: number;
  theme?: Theme;
}

export function textBox(options: TextBoxOptions): TextElement {
  const t = options.theme ?? defaultTheme;

  const marginVal: [number, number, number, number] | undefined =
    typeof options.padding === 'number'
      ? [options.padding, options.padding, options.padding, options.padding]
      : options.padding;

  const style: TextStyle = {
    fontFace: options.fontFace ?? t.typography.body.fontFace,
    fontSize: options.fontSize ?? t.typography.body.fontSize,
    color: hex(options.color ?? t.colors.ink),
    bold: options.bold ?? false,
    italic: options.italic ?? false,
    align: options.align ?? 'left',
    valign: options.valign ?? 'top',
    margin: marginVal,
    bullet: options.bullet,
    lineSpacing: options.lineSpacing,
  };

  return {
    kind: 'text',
    content: options.text,
    style,
    position: { x: options.x, y: options.y },
    size: { w: options.w, h: options.h },
    boxFill: options.boxFill ? hex(options.boxFill) : undefined,
    boxStroke: options.boxStroke ? hex(options.boxStroke) : undefined,
  };
}
