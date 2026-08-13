/**
 * Step 13B — Native PPTX Chart Renderer
 *
 * Renders ChartPlan / DataSpec into PptxGenJS native vector charts with readable typography,
 * design system tokens, axis formatting, and source footer strings.
 */

import { ChartPlan } from './dataTypes';
import { SourceRegistry } from '../research/sourceTypes';
import { Theme } from '../design/theme';

export interface NativePptxChartDefinition {
  isTable?: boolean;
  tableData?: any[][];
  tableOptions?: any;
  chartType: string; // PptxGenJS chart type string: 'bar', 'line', 'pie', 'doughnut', 'area', 'scatter', 'table'
  chartData: any[];
  chartOptions: {
    x: number;
    y: number;
    w: number;
    h: number;
    title?: string;
    showTitle?: boolean;
    showLegend?: boolean;
    legendPos?: 'b' | 'l' | 'r' | 't' | 'tr';
    showValue?: boolean;
    valueFontSize?: number;
    chartColors?: string[];
    catAxisLabelFontSize?: number;
    valAxisLabelFontSize?: number;
    barDir?: 'col' | 'bar';
    barGrouping?: 'standard' | 'clustered' | 'stacked';
  };
  sourceFooterText: string;
}

export function renderChartPlanToNativePptx(
  plan: ChartPlan,
  registry?: SourceRegistry,
  theme?: Theme,
  bounds: { x: number; y: number; w: number; h: number } = { x: 0.667, y: 1.25, w: 11.8, h: 4.8 }
): NativePptxChartDefinition {
  const spec = plan.dataSpec;

  // 1. Source Citation Footer Formatting
  if (!registry) {
    throw new Error('CHART_SOURCE_PROVENANCE_MISSING: SourceRegistry is required for chart generation.');
  }

  if (!spec.sourceIds || spec.sourceIds.length === 0) {
    throw new Error('CHART_SOURCE_PROVENANCE_MISSING: No sourceIds provided in DataSpec.');
  }

  const matchedSources = registry.sources.filter((s) => spec.sourceIds!.includes(s.id));
  
  if (matchedSources.length === 0 || matchedSources.length !== spec.sourceIds.length) {
    throw new Error('CHART_SOURCE_PROVENANCE_MISSING: One or more sourceIds not found in SourceRegistry.');
  }

  const titles = matchedSources.map((s) => s.title).join('; ');
  const sourceFooterText = matchedSources.length > 1 ? `Sources: ${titles}` : `Source: ${titles}`;

  // 2. Handle Table Output for Extreme Scale Data Specs
  if (plan.type === 'table') {
    const valueColTitle = spec.series[0]?.name && spec.series[0]?.name !== 'Value' && spec.series[0]?.name !== 'Values'
      ? `${spec.series[0].name}${spec.unit ? ` (${spec.unit})` : ''}`
      : `Value${spec.unit ? ` (${spec.unit})` : ''}`;

    const headerRow = [
      { text: 'Category / Contaminant', options: { bold: true, fill: { color: '0F766E' }, color: 'FFFFFF', fontSize: 13, align: 'left' as const, margin: [8, 12, 8, 12] } },
      { text: valueColTitle, options: { bold: true, fill: { color: '0F766E' }, color: 'FFFFFF', fontSize: 13, align: 'right' as const, margin: [8, 12, 8, 12] } },
    ];

    const dataRows = spec.categories.map((cat, idx) => {
      const val = spec.series[0]?.values[idx] ?? 0;
      const formattedVal = typeof val === 'number' ? Number(val.toFixed(6)).toString() : val;
      const bg = idx % 2 === 0 ? 'F8FAFC' : 'FFFFFF';

      return [
        { text: cat, options: { fill: { color: bg }, color: '1E293B', fontSize: 12, align: 'left' as const, margin: [6, 12, 6, 12] } },
        { text: `${formattedVal}${spec.unit ? ` ${spec.unit}` : ''}`, options: { fill: { color: bg }, color: '0F766E', bold: true, fontSize: 12, align: 'right' as const, margin: [6, 12, 6, 12] } },
      ];
    });

    const tableData = [headerRow, ...dataRows];
    // Explicit colW ensuring sum (6.8 + 4.8 = 11.6 in) < available bounds.w (11.8 in) to prevent right-edge clipping
    const tableOptions = {
      x: bounds.x,
      y: bounds.y,
      w: bounds.w,
      colW: [6.8, 4.8],
      border: { pt: 1, color: 'E2E8F0' },
    };

    return {
      isTable: true,
      tableData,
      tableOptions,
      chartType: 'table',
      chartData: [],
      chartOptions: {
        x: bounds.x,
        y: bounds.y,
        w: bounds.w,
        h: bounds.h,
      },
      sourceFooterText,
    };
  }

  // 3. Map ChartType to PptxGenJS type string and direction options
  let pptxChartType = 'bar';
  let barDir: 'col' | 'bar' | undefined = undefined;
  let barGrouping: 'standard' | 'clustered' | 'stacked' | undefined = undefined;

  switch (plan.type) {
    case 'line':
      pptxChartType = 'line';
      break;
    case 'bar':
      pptxChartType = 'bar';
      barDir = 'col';
      break;
    case 'grouped-bar':
      pptxChartType = 'bar';
      barDir = 'bar';
      barGrouping = 'clustered';
      break;
    case 'stacked-bar':
      pptxChartType = 'bar';
      barDir = 'bar';
      barGrouping = 'stacked';
      break;
    case 'pie':
      pptxChartType = 'pie';
      break;
    case 'doughnut':
      pptxChartType = 'doughnut';
      break;
    case 'area':
      pptxChartType = 'area';
      break;
    case 'scatter':
      pptxChartType = 'scatter';
      break;
    default:
      pptxChartType = 'bar';
      barDir = 'col';
      break;
  }

  // 4. Format Series Data
  let chartData: any[];

  if (plan.type === 'scatter') {
    chartData = [
      { name: 'X-Axis', values: spec.categories.map((c) => parseFloat(c) || 0) },
      { name: spec.series[0]?.name || 'Y-Values', values: spec.series[0]?.values || [] },
    ];
  } else {
    chartData = spec.series.map((s) => ({
      name: s.name,
      labels: spec.categories,
      values: s.values.map((v) => (typeof v === 'number' ? Number(v.toFixed(6)) : v)),
    }));
  }

  // 5. Theme Colors
  const palette = theme
    ? [theme.colors.teal, theme.colors.blue, theme.colors.gold, theme.colors.red, '#10B981']
    : ['#0F766E', '#0284C7', '#C88A1E', '#C2410C', '#10B981'];

  const seriesCount = Math.max(1, chartData.length);
  const chartColors = palette.slice(0, seriesCount);

  // Concise subtitle to avoid title duplication
  const chartSubtitle = spec.series[0]?.name && spec.series[0]?.name !== 'Value' && spec.series[0]?.name !== 'Values'
    ? `${spec.series[0].name}${spec.unit ? ` (${spec.unit})` : ''}`
    : (spec.unit ? `Metric (${spec.unit})` : '');

  return {
    chartType: pptxChartType,
    chartData,
    chartOptions: {
      x: bounds.x,
      y: bounds.y,
      w: bounds.w,
      h: bounds.h,
      title: chartSubtitle,
      showTitle: Boolean(chartSubtitle),
      showLegend: spec.series.length > 1,
      ...(spec.series.length > 1 ? { legendPos: 'b' as const } : {}),
      showValue: true,
      valueFontSize: 10,
      chartColors,
      catAxisLabelFontSize: 10,
      valAxisLabelFontSize: 10,
      ...(barDir ? { barDir } : {}),
      ...(barGrouping ? { barGrouping } : {}),
    },
    sourceFooterText,
  };
}
