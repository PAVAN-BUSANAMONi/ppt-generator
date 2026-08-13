/**
 * Canvas & layout grid — 1280×720, 12-column grid with fixed margins.
 * All values in pixels; use pxToInches() when passing to PptxGenJS.
 */

export const canvas = {
  /** Canvas width in px */
  width: 1280,
  /** Canvas height in px */
  height: 720,
  /** Aspect ratio */
  aspectRatio: '16:9' as const,
  /** Canvas width in inches (1280 / 96) */
  widthInches: 13.333,
  /** Canvas height in inches (720 / 96) */
  heightInches: 7.5,
};

export const grid = {
  /** Left margin in px */
  marginLeft: 64,
  /** Right margin in px */
  marginRight: 64,
  /** Top margin in px */
  marginTop: 46,
  /** Bottom margin in px */
  marginBottom: 56,
  /** Number of columns */
  columns: 12,
  /** Gutter width in px */
  gutter: 16,
};

/**
 * Derived grid helpers (px values).
 */
export const layout = {
  /** Usable content width: 1280 - 64 - 64 = 1152 px */
  contentWidth: canvas.width - grid.marginLeft - grid.marginRight,
  /** Usable content height: 720 - 46 - 56 = 618 px */
  contentHeight: canvas.height - grid.marginTop - grid.marginBottom,
  /** Single column width: (1152 - 11 × 16) / 12 = 81.33 px */
  columnWidth:
    (canvas.width - grid.marginLeft - grid.marginRight - (grid.columns - 1) * grid.gutter) /
    grid.columns,
};

/**
 * Get the x-position and width for a span of columns (1-indexed).
 * Example: colSpan(1, 6) → left half of the grid.
 */
export function colSpan(
  startCol: number,
  endCol: number
): { x: number; w: number } {
  const s = startCol - 1;
  const e = endCol - 1;
  const x = grid.marginLeft + s * (layout.columnWidth + grid.gutter);
  const w =
    (e - s + 1) * layout.columnWidth + (e - s) * grid.gutter;
  return { x, w };
}
