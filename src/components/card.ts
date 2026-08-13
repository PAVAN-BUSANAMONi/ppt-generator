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

  let currentY = options.y + pxToInches(t.spacing.md);
  const contentX = options.x + pxToInches(t.spacing.md);
  const contentWidth = options.width - pxToInches(t.spacing.md * 2);

  // 2. Icon Badge (if provided)
  if (options.icon) {
    const badgeElements = iconBadge({
      icon: options.icon,
      x: contentX,
      y: currentY,
      size: 0.55,
      iconColor: accentColor,
      badgeFill: isDark ? t.colors.ink2 : t.colors.mint2,
      theme: t,
    });
    elements.push(...badgeElements);
    currentY += 0.65;
  }

  // 3. Card Title / Heading
  elements.push(
    textBox({
      text: options.title,
      x: contentX,
      y: currentY,
      w: contentWidth,
      h: 0.5,
      fontFace: t.typography.heading.fontFace,
      fontSize: t.typography.heading.fontSize,
      color: titleColor,
      bold: true,
      theme: t,
    })
  );
  currentY += 0.55;

  // 4. Card Body
  elements.push(
    textBox({
      text: options.body,
      x: contentX,
      y: currentY,
      w: contentWidth,
      h: options.height - (currentY - options.y) - pxToInches(t.spacing.md),
      fontFace: t.typography.body.fontFace,
      fontSize: t.typography.body.fontSize - 1, // 17pt for clean card body fit
      color: bodyColor,
      valign: 'top',
      theme: t,
    })
  );

  return elements;
}
