/**
 * Component 7: imagePanel
 * Image container with optional background placeholder frame, fit/crop behavior, and rounded corners.
 */

import { SlideElement, ImageElement, ShapeElement } from '../core/types';
import { defaultTheme, pxToInches, Theme } from '../design/theme';
import { textBox } from './text';

function hex(color: string): string {
  return color.replace(/^#/, '');
}

export interface ImagePanelOptions {
  image?: string;          // path or base64 / data URL
  x: number;
  y: number;
  width: number;
  height: number;
  fit?: 'cover' | 'contain' | 'crop';
  borderRadius?: number;   // px
  caption?: string;
  placeholderText?: string;
  frameColor?: string;
  theme?: Theme;
}

export function imagePanel(options: ImagePanelOptions): SlideElement[] {
  const t = options.theme ?? defaultTheme;
  const elements: SlideElement[] = [];

  const frameColor = options.frameColor ?? t.colors.mint;
  const radiusPx = options.borderRadius ?? t.shapes.cardRadius;

  // 1. Background frame container
  const containerShape: ShapeElement = {
    kind: 'shape',
    shapeType: 'rounded-rect',
    fill: hex(frameColor),
    stroke: hex(t.colors.line),
    strokeWidth: 1,
    rectRadius: pxToInches(radiusPx),
    shadow: t.shadows.sm,
    position: { x: options.x, y: options.y },
    size: { w: options.width, h: options.height },
  };
  elements.push(containerShape);

  // 2. Image element (if provided) or placeholder
  if (options.image) {
    const isDataUrl = options.image.startsWith('data:');
    const imgEl: ImageElement = {
      kind: 'image',
      path: isDataUrl ? undefined : options.image,
      data: isDataUrl ? options.image : undefined,
      position: { x: options.x, y: options.y },
      size: { w: options.width, h: options.height },
      sizing: {
        type: options.fit ?? 'cover',
      },
    };
    elements.push(imgEl);
  } else {
    // Placeholder indicator
    elements.push(
      textBox({
        text: options.placeholderText ?? '[ IMAGE PANEL ]',
        x: options.x,
        y: options.y + (options.height - 0.4) / 2,
        w: options.width,
        h: 0.4,
        fontFace: t.typography.caption.fontFace,
        fontSize: t.typography.caption.fontSize,
        color: t.colors.slate,
        align: 'center',
        valign: 'middle',
        theme: t,
      })
    );
  }

  // 3. Optional caption at the bottom
  if (options.caption) {
    elements.push(
      textBox({
        text: options.caption,
        x: options.x,
        y: options.y + options.height + 0.08,
        w: options.width,
        h: 0.3,
        fontFace: t.typography.caption.fontFace,
        fontSize: t.typography.caption.fontSize,
        color: t.colors.slate,
        align: 'center',
        theme: t,
      })
    );
  }

  return elements;
}
