/**
 * Step 13B — Minimal Known-Good Chart Test
 *
 * Builds the smallest possible working PptxGenJS chart:
 * Categories: ["A", "B", "C", "D"]
 * Values: [10, 20, 30, 40]
 * Exports: outputs/debug-minimal-bar-chart.pptx
 * Validates XML plot/series elements and PowerPoint openability.
 */

import * as fs from 'fs';
import * as path from 'path';
import pptxgen from 'pptxgenjs';
import { validateChartPptx } from './chartInspector';

export async function testMinimalBarChart(): Promise<boolean> {
  console.log('[MinimalChartTest] Creating debug minimal bar chart …');

  const outputsDir = path.resolve(__dirname, '..', '..', 'outputs');
  if (!fs.existsSync(outputsDir)) fs.mkdirSync(outputsDir, { recursive: true });
  const outputPath = path.join(outputsDir, 'debug-minimal-bar-chart.pptx');

  const pptx = new pptxgen();
  pptx.layout = 'LAYOUT_16x9';
  const slide = pptx.addSlide();

  slide.addText('Minimal Debug Bar Chart', { x: 0.8, y: 0.6, w: 11.0, h: 0.6, fontSize: 24, bold: true, color: '1E293B' });

  const dataChart = [
    {
      name: 'Sample Series',
      labels: ['A', 'B', 'C', 'D'],
      values: [10, 20, 30, 40],
    },
  ];

  slide.addChart(pptx.ChartType.bar, dataChart, {
    x: 0.8,
    y: 1.8,
    w: 8.5,
    h: 4.5,
    title: 'Debug Bar Chart',
    showTitle: true,
    barDir: 'col',
    chartColors: ['#0F766E'],
  });

  await pptx.writeFile({ fileName: outputPath });
  console.log(`[MinimalChartTest] Exported PPTX: ${outputPath}`);

  // Programmatic XML & PowerPoint Openability Verification
  const report = await validateChartPptx(outputPath);

  console.log(`  PACKAGE VALID:            ${report.packageValid}`);
  console.log(`  CHART XML EXISTS:         ${report.chartXmlExists}`);
  console.log(`  CHART TYPE ELEMENT FOUND: ${report.chartTypeElementFound}`);
  console.log(`  SERIES FOUND (<c:ser>):   ${report.seriesFound}`);
  console.log(`  CATEGORIES FOUND (<c:cat>): ${report.categoriesFound}`);
  console.log(`  VALUES FOUND (<c:val>):    ${report.valuesFound}`);
  console.log(`  EMBEDDED WORKBOOK VALID:  ${report.embeddedWorkbookValid}`);
  console.log(`  POWERPOINT OPENABLE:      ${report.powerPointOpenable} (${report.openableStatus})\n`);

  if (!report.seriesFound || !report.categoriesFound || !report.valuesFound) {
    console.error('❌ Minimal Chart Test FAILED: XML missing required plot/series elements!', report.errors);
    return false;
  }

  return true;
}
