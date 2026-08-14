/**
 * Component 3: card
 * Editorial content card with rounded rectangle, optional icon circle, heading, body, border, and soft shadow.
 */

import { SlideElement, ShapeElement } from '../core/types';
import { defaultTheme, pxToInches, Theme } from '../design/theme';
import { textBox } from './text';
import { iconBadge } from './iconBadge';

function hex(color: string): string {
  return color.replace(/^#/, '');
}

export interface CardOptions {
  x: number;
  y: number;
  width: number;
  height: number;
  icon?: string;
  title: string;
  body: string;
  accent?: string;
  fill?: string;
  border?: string;
  dark?: boolean;
  theme?: Theme;
}

export function card(options: CardOptions): SlideElement[] {
  const t = options.theme ?? defaultTheme;
  const elements: SlideElement[] = [];

  const isDark = options.dark ?? false;
  const fill = options.fill ?? (isDark ? t.colors.dark : t.colors.white);
  const border = options.border ?? (isDark ? t.colors.ink2 : t.colors.line);
  const titleColor = isDark ? t.colors.white : t.colors.ink;
  const bodyColor = isDark ? t.colors.line : t.colors.slate;
  const accentColor = options.accent ?? t.colors.teal;

  const isVeryCompact = options.height < 1.6;
  const isCompact = options.height < 3.0;
  const isNarrow = options.width < 4.2;

  const pad = isVeryCompact ? 0.10 : isCompact || isNarrow ? 0.14 : pxToInches(t.spacing.md);
  const iconSize = isVeryCompact ? 0.24 : isCompact || isNarrow ? 0.32 : 0.45;

  const titleFontSize = isVeryCompact ? 13 : isNarrow ? 13.5 : isCompact ? 14.5 : 18;
  const bodyFontSize = isVeryCompact ? 10.5 : isNarrow || isCompact ? 11 : 13.5;

  // 1. Outer rounded container card with shadow & border
  const cardShape: ShapeElement = {
    kind: 'shape',
    shapeType: 'rounded-rect',
    fill: hex(fill),
    stroke: hex(border),
    strokeWidth: 1,
    rectRadius: pxToInches(t.shapes.cardRadius),
    shadow: isDark ? t.shadows.none : t.shadows.md,
    position: { x: options.x, y: options.y },
    size: { w: options.width, h: options.height },
  };
  elements.push(cardShape);

  let currentY = options.y + pad;
  const contentX = options.x + pad;
  const contentWidth = options.width - pad * 2;

  // 2. Icon Badge (if provided)
  if (options.icon) {
    const badgeElements = iconBadge({
      icon: options.icon,
      x: contentX,
      y: currentY,
      size: iconSize,
      iconColor: accentColor,
      badgeFill: isDark ? t.colors.ink2 : t.colors.mint2,
      theme: t,
    });
    elements.push(...badgeElements);
    currentY += iconSize + (isVeryCompact ? 0.05 : 0.08);
  }

  // 3. Card Title / Heading with dynamic height
  const titleLen = options.title.length;
  // Estimate character capacity per line: ~0.10 in per char at 18pt, ~0.08 in at 14pt
  const avgCharWidthInches = titleFontSize >= 16 ? 0.105 : 0.085;
  const charsPerLine = Math.max(12, Math.floor(contentWidth / avgCharWidthInches));
  const isMultiLineTitle = titleLen > charsPerLine;
  const titleH = isMultiLineTitle ? (titleFontSize >= 16 ? 0.62 : 0.45) : (isVeryCompact ? 0.24 : isCompact ? 0.28 : 0.38);

  elements.push(
    textBox({
      text: options.title,
      x: contentX,
      y: currentY,
      w: contentWidth,
      h: titleH,
      fontFace: t.typography.heading.fontFace,
      fontSize: titleFontSize,
      color: titleColor,
      bold: true,
      theme: t,
    })
  );
  currentY += titleH + (isVeryCompact ? 0.03 : 0.06);

  // 4. Card Body
  elements.push(
    textBox({
      text: options.body,
      x: contentX,
      y: currentY,
      w: contentWidth,
      h: Math.max(0.3, options.height - (currentY - options.y) - pad),
      fontFace: t.typography.body.fontFace,
      fontSize: bodyFontSize,
      color: bodyColor,
      valign: 'top',
      theme: t,
    })
  );

  return elements;
}
