/**
 * Archetype 7: tableSlide
 * Data summary slide — structured table + optional companion chart + takeaway callout banner.
 *
 * Enforces strict vertical budget:
 * Title (0.48-1.50) -> Subtitle (1.55-2.10) -> Content Block [Table + Chart] (2.20-5.50) -> Takeaway Banner (5.63-6.21) -> Footer (6.65).
 */

import { SlideDefinition, SlideElement } from '../core/types';
import { defaultTheme, pxToInches } from '../design/theme';
import { TableSlideData } from './types';
import { title } from '../components/title';
import { table } from '../components/table';
import { chart } from '../components/chart';
import { textBox } from '../components/text';
import { footer } from '../components/footer';

function hex(color: string): string {
  return color.replace(/^#/, '');
}

export function renderTableSlide(data: TableSlideData): SlideDefinition {
  const t = data.theme ?? defaultTheme;
  const elements: SlideElement[] = [];

  const ml = pxToInches(t.grid.marginLeft);
  const cw = pxToInches(t.layout.contentWidth);

  // Title header
  elements.push(
    ...title({
      eyebrow: data.eyebrow ?? 'DATA SUMMARY',
      title: data.title,
      subtitle: data.subtitle,
      theme: t,
    })
  );

  const hasChart = Boolean(data.chartData);
  const hasTakeaway = Boolean(data.keyTakeaway);
  const hasLongSubtitle = Boolean(data.subtitle && data.subtitle.length > 50);

  const contentY = hasLongSubtitle ? 2.35 : 2.15;
  const contentH = hasTakeaway ? (hasLongSubtitle ? 3.12 : 3.30) : (hasLongSubtitle ? 4.00 : 4.20);

  const tableW = hasChart ? cw * 0.56 : cw;

  // Compute adaptive column widths based on number of columns if not provided
  let colWidths = data.colWidths;
  if (!colWidths) {
    const colCount = data.headers.length;
    if (colCount === 3) {
      colWidths = [tableW * 0.30, tableW * 0.25, tableW * 0.45];
    } else if (colCount === 4) {
      colWidths = [tableW * 0.28, tableW * 0.32, tableW * 0.20, tableW * 0.20];
    }
  }

  // 1. Table Component
  elements.push(
    table({
      headers: data.headers,
      rows: data.rows,
      colWidths,
      x: ml,
      y: contentY,
      width: tableW,
      height: contentH,
      headerFill: t.colors.dark,
      headerColor: t.colors.white,
      theme: t,
    })
  );

  // 2. Companion Chart (if provided)
  if (hasChart && data.chartData) {
    const chartX = ml + tableW + 0.3;
    const chartW = cw - tableW - 0.3;

    elements.push(
      chart({
        chartType: data.chartData.chartType as any,
        data: [
          {
            name: data.chartData.title || 'Data Series',
            labels: data.chartData.labels,
            values: data.chartData.values,
          },
        ],
        x: chartX,
        y: contentY,
        w: chartW,
        h: contentH,
        title: data.chartData.title,
        showLegend: false,
        theme: t,
      })
    );
  }

  // 3. Key Takeaway Banner (Guaranteed placed AFTER table/chart with zero collision)
  if (hasTakeaway && data.keyTakeaway) {
    const takeawayY = 5.63;
    const takeawayH = 0.58;

    // Outer background box with border
    elements.push({
      kind: 'shape',
      shapeType: 'rounded-rect',
      fill: hex(t.colors.mint2),
      stroke: hex(t.colors.gold),
      strokeWidth: 1,
      rectRadius: 0.08,
      position: { x: ml, y: takeawayY },
      size: { w: cw, h: takeawayH },
    });

    // Takeaway text content (strips duplicate 'KEY TAKEAWAY:' prefix if already present)
    const cleanTakeaway = data.keyTakeaway.replace(/^KEY TAKEAWAY:\s*/i, '').trim();
    elements.push(
      textBox({
        text: `KEY TAKEAWAY: ${cleanTakeaway}`,
        x: ml + 0.15,
        y: takeawayY + 0.08,
        w: cw - 0.3,
        h: takeawayH - 0.16,
        fontFace: t.typography.body.fontFace,
        fontSize: 12,
        color: t.colors.ink,
        bold: true,
        valign: 'middle',
        theme: t,
      })
    );
  }

  // 4. Footer
  elements.push(
    ...footer({
      presentationName: data.title,
      slideNumber: data.slideNumber,
      totalSlides: data.totalSlides,
      theme: t,
    })
  );

  return {
    id: data.id,
    background: hex(t.colors.off),
    elements,
    notes: data.notes,
  };
}
