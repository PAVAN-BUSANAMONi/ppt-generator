import pptxgen from 'pptxgenjs';
import * as fs from 'fs';
import * as path from 'path';
import { validateChartPptx } from './chartInspector';

async function testColors() {
  const outputsDir = path.resolve(__dirname, '..', '..', 'outputs');

  // Test 1: 4 colors for 1 series
  const pptx1 = new pptxgen();
  slideAdd(pptx1, ['#0F766E', '#0284C7', '#C88A1E', '#C2410C']);
  const path1 = path.join(outputsDir, 'colors-4.pptx');
  await pptx1.writeFile({ fileName: path1 });
  console.log('4 Colors for 1 series:', (await validateChartPptx(path1)).openableStatus);

  // Test 2: 1 color for 1 series
  const pptx2 = new pptxgen();
  slideAdd(pptx2, ['#0F766E']);
  const path2 = path.join(outputsDir, 'colors-1.pptx');
  await pptx2.writeFile({ fileName: path2 });
  console.log('1 Color for 1 series:', (await validateChartPptx(path2)).openableStatus);
}

function slideAdd(pptx: any, colors: string[]) {
  pptx.layout = 'LAYOUT_16x9';
  const slide = pptx.addSlide();
  slide.addText('Test Slide', { x: 0.8, y: 0.6, w: 11.0, h: 0.6 });
  slide.addChart('bar' as any, [
    { name: 'Maximum Contaminant Level', labels: ['Lead (Pb)', 'Nitrates (NO3)', 'Arsenic (As)', 'Benzene'], values: [0.015, 10.0, 0.010, 0.005] }
  ], {
    x: 0.8, y: 1.8, w: 8.5, h: 4.5,
    title: 'EPA Primary Drinking Water Standards',
    showTitle: true,
    barDir: 'col',
    chartColors: colors
  });
}

testColors();
