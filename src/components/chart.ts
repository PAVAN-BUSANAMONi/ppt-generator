/**
 * Component: chart
 * Low-level native PPTX chart component wrapper.
 * Pure topic-independent abstraction: ChartData → ChartElement.
 */

import { ChartElement } from '../core/types';
import { defaultTheme, Theme } from '../design/theme';

function hex(color: string): string {
  return color.replace(/^#/, '');
}

export interface ChartSeriesData {
  name: string;
  labels: string[];
  values: number[];
}

export interface ChartComponentOptions {
  chartType: 'doughnut' | 'pie' | 'bar' | 'line' | 'col';
  data: ChartSeriesData[];
  x: number;
  y: number;
  w: number;
  h: number;
  title?: string;
  showLegend?: boolean;
  legendPos?: 'b' | 't' | 'l' | 'r';
  chartColors?: string[];
  theme?: Theme;
}

export function chart(options: ChartComponentOptions): ChartElement {
  const t = options.theme ?? defaultTheme;

  const defaultColors = [
    hex(t.colors.teal),
    hex(t.colors.blue),
    hex(t.colors.gold),
    hex(t.colors.slate),
    hex(t.colors.ink),
  ];

  return {
    kind: 'chart',
    chartType: options.chartType,
    data: options.data,
    position: { x: options.x, y: options.y },
    size: { w: options.w, h: options.h },
    options: {
      showTitle: Boolean(options.title),
      title: options.title,
      showLegend: options.showLegend ?? true,
      legendPos: options.legendPos ?? 'b',
      chartColors: options.chartColors ?? defaultColors,
    },
  };
}
