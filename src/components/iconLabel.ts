/**
 * Component 6: iconLabel
 * Inline icon + label pair.
 */

import { SlideElement } from '../core/types';
import { defaultTheme, Theme } from '../design/theme';
import { iconBadge } from './iconBadge';
import { textBox } from './text';

export interface IconLabelOptions {
  icon: string;
  label: string;
  x: number;
  y: number;
  badgeSize?: number;
  fontSize?: number;
  color?: string;
  iconColor?: string;
  badgeFill?: string;
  theme?: Theme;
}

export function iconLabel(options: IconLabelOptions): SlideElement[] {
  const t = options.theme ?? defaultTheme;
  const elements: SlideElement[] = [];

  const badgeSize = options.badgeSize ?? 0.4;
  const iconColor = options.iconColor ?? t.colors.teal;
  const badgeFill = options.badgeFill ?? t.colors.mint;
  const textColor = options.color ?? t.colors.ink;
  const fontSize = options.fontSize ?? t.typography.body.fontSize;

  // 1. Icon badge
  const badgeEls = iconBadge({
    icon: options.icon,
    x: options.x,
    y: options.y,
    size: badgeSize,
    iconColor,
    badgeFill,
    theme: t,
  });
  elements.push(...badgeEls);

  // 2. Text label beside badge
  const textX = options.x + badgeSize + 0.12;
  const textY = options.y + (badgeSize - 0.3) / 2;

  elements.push(
    textBox({
      text: options.label,
      x: textX,
      y: textY,
      w: 4.5,
      h: 0.35,
      fontFace: t.typography.body.fontFace,
      fontSize,
      color: textColor,
      bold: true,
      valign: 'middle',
      theme: t,
    })
  );

  return elements;
}
