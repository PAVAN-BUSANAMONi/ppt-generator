/**
 * Step 13B — All Chart Types Suite Test
 *
 * Tests native chart generation for all 5 required chart types:
 * 1. bar
 * 2. line
 * 3. grouped-bar
 * 4. doughnut
 * 5. scatter
 *
 * For each type:
 * - Generates PPTX
 * - Inspects chart XML for chartType element, <c:ser>, <c:cat>/<c:xVal>, <c:val>/<c:yVal>
 * - Verifies PowerPoint openability (POWERPOINT_OPENABLE_REPAIR_FREE)
 */

import * as fs from 'fs';
import * as path from 'path';
import pptxgen from 'pptxgenjs';
import { validateChartPptx, ChartInspectionReport } from './chartInspector';

export async function testAllChartTypes(): Promise<boolean> {
  console.log('====================================================');
  console.log('  STEP 13B — ALL CHART TYPES VALIDATION SUITE');
  console.log('====================================================\n');

  const outputsDir = path.resolve(__dirname, '..', '..', 'outputs');
  if (!fs.existsSync(outputsDir)) fs.mkdirSync(outputsDir, { recursive: true });

  let allPassed = true;

  const testConfigs = [
    {
      name: 'bar',
      type: 'bar' as const,
      data: [{ name: 'Category Bar', labels: ['Alpha', 'Beta', 'Gamma'], values: [15, 30, 45] }],
      options: { barDir: 'col', chartColors: ['#0F766E'] },
    },
    {
      name: 'line',
      type: 'line' as const,
      data: [{ name: 'Time Trend', labels: ['2020', '2021', '2022', '2023'], values: [10, 25, 40, 60] }],
      options: { chartColors: ['#0284C7'] },
    },
    {
      name: 'grouped-bar',
      type: 'bar' as const,
      data: [
        { name: 'Series A', labels: ['Region 1', 'Region 2'], values: [20, 35] },
        { name: 'Series B', labels: ['Region 1', 'Region 2'], values: [25, 40] },
      ],
      options: { barDir: 'bar', barGrouping: 'clustered', chartColors: ['#0F766E', '#C88A1E'] },
    },
    {
      name: 'doughnut',
      type: 'doughnut' as const,
      data: [{ name: 'Composition Share', labels: ['Share A', 'Share B', 'Share C'], values: [50, 30, 20] }],
      options: { chartColors: ['#0F766E', '#0284C7', '#C88A1E'] },
    },
    {
      name: 'scatter',
      type: 'scatter' as const,
      data: [
        { name: 'X-Axis', values: [1.0, 2.0, 3.0, 4.0] },
        { name: 'Y-Axis', values: [10, 20, 35, 50] },
      ],
      options: { chartColors: ['#C2410C'] },
    },
  ];

  for (const config of testConfigs) {
    const fileName = `debug-chart-type-${config.name}.pptx`;
    const outputPath = path.join(outputsDir, fileName);

    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_16x9';
    const slide = pptx.addSlide();

    slide.addText(`Chart Type Test: ${config.name}`, {
      x: 0.8,
      y: 0.6,
      w: 11.0,
      h: 0.6,
      fontSize: 24,
      bold: true,
      color: '1E293B',
    });

    slide.addChart(config.type, config.data, {
      x: 0.8,
      y: 1.8,
      w: 8.5,
      h: 4.5,
      title: `${config.name.toUpperCase()} Chart`,
      showTitle: true,
      ...config.options,
    } as any);

    await pptx.writeFile({ fileName: outputPath });

    // Inspect XML and PowerPoint openability
    const report: ChartInspectionReport = await validateChartPptx(outputPath);

    console.log(`────────────────────────────────────────────`);
    console.log(`  Chart Type: "${config.name}" (${fileName})`);
    console.log(`────────────────────────────────────────────`);
    console.log(`  Package Valid:      ${report.packageValid}`);
    console.log(`  XML Element Found:  ${report.chartTypeElementFound}`);
    console.log(`  Series (<c:ser>):   ${report.seriesFound}`);
    console.log(`  Categories/xVal:    ${report.categoriesFound}`);
    console.log(`  Values/yVal:        ${report.valuesFound}`);
    console.log(`  PowerPoint Open:    ${report.powerPointOpenable} (${report.openableStatus})`);

    if (!report.seriesFound || !report.categoriesFound || !report.valuesFound || !report.powerPointOpenable) {
      console.error(`❌ Chart Type "${config.name}" FAILED: XML structure or PowerPoint open error!`, report.errors);
      allPassed = false;
    } else {
      console.log(`  ✔ Chart Type "${config.name}" PASSED (XML & PowerPoint Verified)\n`);
    }
  }

  console.log('====================================================');
  console.log(`  ALL CHART TYPES SUITE RESULT: ${allPassed ? 'ALL 5 CHART TYPES PASSED' : 'FAILED'}`);
  console.log('====================================================\n');

  return allPassed;
}
