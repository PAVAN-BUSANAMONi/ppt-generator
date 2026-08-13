/**
 * Component 11: table
 * Native PPTX table wrapper using design tokens for headers, cells, borders, and column widths.
 */

import { TableElement, TableCell } from '../core/types';
import { defaultTheme, Theme } from '../design/theme';

function hex(color: string): string {
  return color.replace(/^#/, '');
}

export interface TableOptions {
  headers: string[];
  rows: string[][];
  x: number;
  y: number;
  width: number;
  height: number;
  colWidths?: number[];    // inches
  headerFill?: string;
  headerColor?: string;
  alternateRows?: boolean;
  border?: string;
  theme?: Theme;
}

export function table(options: TableOptions): TableElement {
  const t = options.theme ?? defaultTheme;

  const headerFill = hex(options.headerFill ?? t.colors.dark);
  const headerColor = hex(options.headerColor ?? t.colors.white);
  const borderColor = hex(options.border ?? t.colors.line);

  // 1. Build header row
  const headerRow: TableCell[] = options.headers.map((h) => ({
    text: h,
    options: {
      fontFace: t.typography.heading.fontFace,
      fontSize: t.typography.body.fontSize - 2, // 16pt
      color: headerColor,
      bold: true,
      fill: headerFill,
      align: 'left',
      valign: 'middle',
    },
  }));

  // 2. Build body rows
  const bodyRows: TableCell[][] = options.rows.map((row, rIdx) => {
    const isEven = rIdx % 2 === 0;
    const rowFill = options.alternateRows
      ? (isEven ? hex(t.colors.white) : hex(t.colors.mint2))
      : hex(t.colors.white);

    return row.map((cellText) => ({
      text: cellText,
      options: {
        fontFace: t.typography.body.fontFace,
        fontSize: t.typography.small.fontSize, // 16pt
        color: hex(t.colors.ink),
        fill: rowFill,
        align: 'left',
        valign: 'middle',
      },
    }));
  });

  return {
    kind: 'table',
    rows: [headerRow, ...bodyRows],
    position: { x: options.x, y: options.y },
    size: { w: options.width, h: options.height },
    colWidths: options.colWidths,
    border: { color: borderColor, pt: 1 },
  };
}
