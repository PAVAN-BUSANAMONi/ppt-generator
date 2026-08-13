/**
 * Archetype 11: chartSlide
 * Chart visualization & analysis slide — topic-independent: ChartData → ChartRenderer.
 */

import { SlideDefinition, SlideElement } from '../core/types';
import { defaultTheme, pxToInches } from '../design/theme';
import { ChartSlideData } from './types';
import { title } from '../components/title';
import { card } from '../components/card';
import { chart } from '../components/chart';
import { bulletList } from '../components/bulletList';
import { footer } from '../components/footer';

function hex(color: string): string {
  return color.replace(/^#/, '');
}

export function renderChartSlide(data: ChartSlideData): SlideDefinition {
  const t = data.theme ?? defaultTheme;
  const elements: SlideElement[] = [];

  const ml = pxToInches(t.grid.marginLeft);
  const cw = pxToInches(t.layout.contentWidth);

  const variant = data.layoutVariant ?? 'chart-left';

  // Title header
  elements.push(
    ...title({
      eyebrow: data.eyebrow ?? 'DATA ANALYSIS',
      title: data.title,
      subtitle: data.subtitle,
      theme: t,
    })
  );

  const leftW = cw * 0.52;
  const rightW = cw * 0.44;

  const chartX = variant === 'chart-right' ? ml + leftW + 0.3 : ml;
  const listX = variant === 'chart-right' ? ml : ml + leftW + 0.3;

  // 1. Native Chart (if chartData provided) or Descriptive Card
  if (data.chartData) {
    const chartEl = chart({
      chartType: data.chartData.chartType,
      data: [
        {
          name: data.chartData.title ?? 'Data',
          labels: data.chartData.labels,
          values: data.chartData.values,
        },
      ],
      x: chartX,
      y: 2.2,
      w: leftW,
      h: 4.3,
      title: data.chartData.title ?? 'Data Analysis',
      showLegend: true,
      chartColors: data.chartData.colors,
      theme: t,
    });
    elements.push(chartEl);
  } else {
    elements.push(
      ...card({
        x: chartX,
        y: 2.2,
        width: leftW,
        height: 4.3,
        icon: 'BarChart2',
        title: 'Data Visualization',
        body: data.chartDescription,
        accent: t.colors.teal,
        fill: t.colors.mint2,
        theme: t,
      })
    );
  }

  // 2. Key Insights List
  elements.push(
    ...bulletList({
      items: data.keyInsights,
      x: listX,
      y: 2.2,
      w: rightW,
      h: 4.3,
      background: t.colors.white,
      border: t.colors.line,
      padding: 20,
      bulletColor: t.colors.blue,
      theme: t,
    })
  );

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
