/**
 * Archetype 10: tableSlide
 * Data table slide — supports full table layout or hybrid table + native chart composition.
 */

import { SlideDefinition, SlideElement, ChartElement } from '../core/types';
import { defaultTheme, pxToInches } from '../design/theme';
import { TableSlideData } from './types';
import { title } from '../components/title';
import { table } from '../components/table';
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

  const tableW = hasChart ? cw * 0.56 : cw;
  const tableH = hasTakeaway ? 3.4 : 4.3;

  // 1. Native Table
  elements.push(
    table({
      headers: data.headers,
      rows: data.rows,
      x: ml,
      y: 2.2,
      width: tableW,
      height: tableH,
      alternateRows: true,
      theme: t,
    })
  );

  // 2. Native Chart (if provided)
  if (data.chartData) {
    const chartX = ml + cw * 0.58;
    const chartW = cw * 0.42;

    const chartEl: ChartElement = {
      kind: 'chart',
      chartType: data.chartData.chartType,
      data: [
        {
          name: data.chartData.title ?? 'Composition',
          labels: data.chartData.labels,
          values: data.chartData.values,
        },
      ],
      position: { x: chartX, y: 2.2 },
      size: { w: chartW, h: tableH },
      options: {
        showLegend: true,
        legendPos: 'b',
        showTitle: Boolean(data.chartData.title),
        title: data.chartData.title,
        chartColors: data.chartData.colors ?? [
          hex(t.colors.teal),
          hex(t.colors.blue),
          hex(t.colors.gold),
          hex(t.colors.slate),
        ],
      },
    };
    elements.push(chartEl);
  }

  // 3. Key Takeaway callout box at bottom
  if (data.keyTakeaway) {
    elements.push(
      textBox({
        text: `KEY TAKEAWAY: ${data.keyTakeaway}`,
        x: ml,
        y: 2.2 + tableH + 0.2,
        w: cw,
        h: 0.6,
        fontFace: t.typography.small.fontFace,
        fontSize: t.typography.small.fontSize,
        color: t.colors.ink,
        bold: true,
        boxFill: t.colors.goldSoft,
        boxStroke: t.colors.gold,
        padding: 10,
        valign: 'middle',
        theme: t,
      })
    );
  }

  // Footer
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
