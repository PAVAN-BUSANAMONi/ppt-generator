import * as fs from 'fs';
import * as path from 'path';
import pptxgen from 'pptxgenjs';
import { conductTopicResearch } from './research/search';
import { extractGroundedDataSpecs } from './data/dataResearcher';
import { planChartForDataSpec } from './data/chartPlanner';
import { renderChartPlanToNativePptx } from './data/chartRenderer';
import { validateChartPptx } from './data/chartInspector';

async function verify() {
  const outputsDir = path.resolve(__dirname, '..', 'outputs');
  if (!fs.existsSync(outputsDir)) fs.mkdirSync(outputsDir, { recursive: true });

  const reg1 = await conductTopicResearch('Water and Air Pollution', { useCache: true });
  const validSpecs1 = extractGroundedDataSpecs('Water and Air Pollution', reg1);
  const epaSpec = validSpecs1.find((s) => s.id === 'ds-epa-contaminant-standards') || validSpecs1[0];
  
  const plan1 = planChartForDataSpec(epaSpec, reg1);
  if (plan1.plan) {
    const nativeDef = renderChartPlanToNativePptx(plan1.plan, reg1);
    const matchedSources = reg1.sources.filter(s => epaSpec.sourceIds.includes(s.id));
    
    console.log('--- WATER POLLUTION CHART ---');
    console.log('DataPoint sourceIds:');
    epaSpec.dataPoints?.forEach(dp => {
      console.log(`  ${dp.category}: ${dp.sourceIds.join(', ')}`);
    });
    console.log(`\nSourceRegistry titles: ${matchedSources.map(s => s.title).join('; ')}`);
    console.log(`Visible chart source footer: ${nativeDef.sourceFooterText}`);

    const pptx = new pptxgen();
    pptx.layout = 'LAYOUT_16x9';
    const slide = pptx.addSlide();
    slide.addText(epaSpec.title, { x: 0.8, y: 0.6, w: 11.0, h: 0.6, fontSize: 24, bold: true, color: '1E293B' });
    slide.addChart(nativeDef.chartType as any, nativeDef.chartData, nativeDef.chartOptions);
    slide.addText(nativeDef.sourceFooterText, { x: 0.8, y: 6.7, w: 11.0, h: 0.4, fontSize: 10, italic: true, color: '64748B' });

    const outputPath = path.join(outputsDir, 'verify-13c-water.pptx');
    await pptx.writeFile({ fileName: outputPath });

    const report = await validateChartPptx(outputPath);
    console.log(`PPTX repair-free openable: ${report.powerPointOpenable} (${report.openableStatus})`);
  }
}

verify().catch(console.error);
