/**
 * Core types for the presentation engine.
 * Deterministic PPTX renderer — no AI, no research, no magic.
 */

import { ShadowStyle } from '../design/shadows';

// ---------------------------------------------------------------------------
// Canvas
// ---------------------------------------------------------------------------

export interface CanvasSize {
  width: number;   // inches (PptxGenJS uses inches)
  height: number;
  aspectRatio: '16:9' | '4:3';
}

export const DEFAULT_CANVAS: CanvasSize = {
  width: 13.333,   // 1280px at 96dpi ≈ 13.333"
  height: 7.5,     // 720px at 96dpi  ≈ 7.5"
  aspectRatio: '16:9',
};

// ---------------------------------------------------------------------------
// Text elements
// ---------------------------------------------------------------------------

export interface TextStyle {
  fontFace?: string;
  fontSize?: number;       // points
  color?: string;          // hex without #
  bold?: boolean;
  italic?: boolean;
  align?: 'left' | 'center' | 'right';
  valign?: 'top' | 'middle' | 'bottom';
  bullet?: boolean | { code?: string; color?: string };
  margin?: [number, number, number, number]; // [top, right, bottom, left] in pt or px
  lineSpacing?: number;
}

export interface TextRun {
  text: string;
  options?: TextStyle;
}

export interface TextElement {
  kind: 'text';
  content: string | TextRun[];
  style: TextStyle;
  position: Position;
  size: Size;
  boxFill?: string;
  boxStroke?: string;
}

// ---------------------------------------------------------------------------
// Shape elements
// ---------------------------------------------------------------------------

export interface ShapeElement {
  kind: 'shape';
  shapeType: 'rect' | 'rounded-rect' | 'line' | 'ellipse';
  fill?: string;           // hex without #
  stroke?: string;
  strokeWidth?: number;
  rectRadius?: number;     // 0..1 percentage or pt
  shadow?: ShadowStyle;
  position: Position;
  size: Size;
}

// ---------------------------------------------------------------------------
// Image elements
// ---------------------------------------------------------------------------

export interface ImageElement {
  kind: 'image';
  path?: string;
  data?: string;           // base64 or SVG data URL
  position: Position;
  size: Size;
  sizing?: {
    type?: 'contain' | 'cover' | 'crop';
    x?: number;
    y?: number;
    w?: number;
    h?: number;
  };
  rounding?: boolean;
}

// ---------------------------------------------------------------------------
// Table elements
// ---------------------------------------------------------------------------

export interface TableCell {
  text: string;
  options?: {
    fontFace?: string;
    fontSize?: number;
    color?: string;
    bold?: boolean;
    fill?: string;
    align?: 'left' | 'center' | 'right';
    valign?: 'top' | 'middle' | 'bottom';
    colSpan?: number;
    rowSpan?: number;
  };
}

export interface TableElement {
  kind: 'table';
  rows: TableCell[][];
  position: Position;
  size: Size;
  colWidths?: number[];
  border?: { color?: string; pt?: number };
}

// ---------------------------------------------------------------------------
// Chart elements
// ---------------------------------------------------------------------------

export interface ChartElement {
  kind: 'chart';
  chartType: 'doughnut' | 'pie' | 'bar' | 'line' | 'col';
  data: Array<{
    name: string;
    labels: string[];
    values: number[];
  }>;
  position: Position;
  size: Size;
  options?: {
    showLegend?: boolean;
    legendPos?: 'b' | 't' | 'l' | 'r';
    showTitle?: boolean;
    title?: string;
    chartColors?: string[];
  };
}

// ---------------------------------------------------------------------------
// Geometry helpers
// ---------------------------------------------------------------------------

export interface Position {
  x: number;   // inches from left
  y: number;   // inches from top
}

export interface Size {
  w: number;   // inches
  h: number;   // inches
}

// ---------------------------------------------------------------------------
// Slide
// ---------------------------------------------------------------------------

export type SlideElement = TextElement | ShapeElement | ImageElement | TableElement | ChartElement;

export interface SlideDefinition {
  id: string;
  background?: string;     // hex without #
  elements: SlideElement[];
  notes?: string;
}

// ---------------------------------------------------------------------------
// Presentation
// ---------------------------------------------------------------------------

export interface PresentationDefinition {
  title: string;
  author?: string;
  canvas: CanvasSize;
  slides: SlideDefinition[];
}
