/**
 * Component 5: iconBadge
 * Renders a Lucide icon inside a circular/rounded badge as an ImageElement.
 */

import * as lucide from 'lucide';
import { ImageElement, ShapeElement, SlideElement } from '../core/types';
import { defaultTheme, Theme } from '../design/theme';

function hex(color: string): string {
  return color.replace(/^#/, '');
}

/**
 * Render any Lucide icon definition to an SVG data URL string.
 */
export function getLucideIconDataUrl(
  iconName: string,
  color: string = '#0F766E',
  size: number = 24,
  strokeWidth: number = 2
): string | null {
  // Look up icon in lucide export
  const iconNode = (lucide as Record<string, any>)[iconName];
  if (!iconNode || !Array.isArray(iconNode)) {
    return null;
  }

  const children = iconNode
    .map(([tag, attrs]: [string, Record<string, string>]) => {
      const attrStr = Object.entries(attrs)
        .map(([k, v]) => `${k}="${v}"`)
        .join(' ');
      return `<${tag} ${attrStr} />`;
    })
    .join('');

  const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${children}</svg>`;

  return `data:image/svg+xml;base64,${Buffer.from(svgStr).toString('base64')}`;
}

export interface IconBadgeOptions {
  icon: string;
  x: number;
  y: number;
  size?: number;           // inches (badge diameter)
  iconColor?: string;
  badgeFill?: string;
  badgeBorder?: string;
  theme?: Theme;
}

export function iconBadge(options: IconBadgeOptions): SlideElement[] {
  const t = options.theme ?? defaultTheme;
  const elements: SlideElement[] = [];
  const badgeSize = options.size ?? 0.6; // 0.6 inches
  const iconColor = options.iconColor ?? t.colors.teal;
  const badgeFill = options.badgeFill ?? t.colors.mint;

  // 1. Badge background circle / rounded shape
  const bgShape: ShapeElement = {
    kind: 'shape',
    shapeType: 'ellipse',
    fill: hex(badgeFill),
    stroke: options.badgeBorder ? hex(options.badgeBorder) : undefined,
    strokeWidth: options.badgeBorder ? 1 : 0,
    position: { x: options.x, y: options.y },
    size: { w: badgeSize, h: badgeSize },
  };
  elements.push(bgShape);

  // 2. Icon image inside badge
  const dataUrl = getLucideIconDataUrl(options.icon, iconColor, 32, 2.2);
  if (dataUrl) {
    const iconSize = badgeSize * 0.55;
    const offset = (badgeSize - iconSize) / 2;
    const imgEl: ImageElement = {
      kind: 'image',
      data: dataUrl,
      position: { x: options.x + offset, y: options.y + offset },
      size: { w: iconSize, h: iconSize },
    };
    elements.push(imgEl);
  }

  return elements;
}
