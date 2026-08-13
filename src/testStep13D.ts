import * as fs from 'fs';
import * as path from 'path';
import pptxgen from 'pptxgenjs';
import { conductTopicResearch } from './research/search';
import { extractGroundedDataSpecs } from './data/dataResearcher';
import { planChartForDataSpec } from './data/chartPlanner';
import { renderChartPlanToNativePptx } from './data/chartRenderer';
import { validateChartPptx } from './data/chartInspector';

async function runStep13DVisualVerification() {
  console.log('====================================================');
  console.log('  STEP 13D — VISUAL FORMATION VERIFICATION');
  console.log('====================================================\n');

  const outputsDir = path.resolve(__dirname, '..', 'outputs');
  if (!fs.existsSync(outputsDir)) fs.mkdirSync(outputsDir, { recursive: true });

  // 1. Water Pollution / EPA MCL Test
  const regWater = await conductTopicResearch('Water and Air Pollution', { useCache: true });
  const waterSpecs = extractGroundedDataSpecs('Water and Air Pollution', regWater);
  const epaSpec = waterSpecs.find((s) => s.id === 'ds-epa-contaminant-standards') || waterSpecs[0];
  const epaPlanRes = planChartForDataSpec(epaSpec, regWater);

  if (!epaPlanRes.plan) {
    console.error('❌ Failed to plan chart for EPA MCL:', epaPlanRes.errors);
    process.exit(1);
  }

  const epaPlan = epaPlanRes.plan;
  console.log(`[EPA MCL Plan Type]: ${epaPlan.type}`);

  const epaNativeDef = renderChartPlanToNativePptx(epaPlan, regWater);
  const pptxWater = new pptxgen();
  pptxWater.layout = 'LAYOUT_16x9';
  const slideWater = pptxWater.addSlide();

  // Slide Title
  slideWater.addText(epaSpec.title, {
    x: 0.8,
    y: 0.6,
    w: 11.73,
    h: 0.6,
    fontSize: 22,
    bold: true,
    color: '1E293B',
  });

  if (epaNativeDef.isTable) {
    slideWater.addTable(epaNativeDef.tableData!, epaNativeDef.tableOptions);
  } else {
    slideWater.addChart(epaNativeDef.chartType as any, epaNativeDef.chartData, epaNativeDef.chartOptions);
  }

  // Source Footer aligned to grid
  slideWater.addText(epaNativeDef.sourceFooterText, {
    x: 0.8,
    y: 6.7,
    w: 11.73,
    h: 0.4,
    fontSize: 10,
    italic: true,
    color: '64748B',
  });

  const waterPath = path.join(outputsDir, 'visual-check-mcl.pptx');
  await pptxWater.writeFile({ fileName: waterPath });
  const reportWater = await validateChartPptx(waterPath);
  console.log(`✔ Generated: ${waterPath}`);
  console.log(`  Package Valid: ${reportWater.packageValid}`);
  console.log(`  PowerPoint Openable: ${reportWater.powerPointOpenable} (${reportWater.openableStatus})\n`);

  // 2. AI Agriculture Benchmark Test
  const regAg = await conductTopicResearch('Artificial Intelligence in Agriculture', { useCache: true });
  const agSpecs = extractGroundedDataSpecs('Artificial Intelligence in Agriculture', regAg);
  const agSpec = agSpecs.find((s) => s.id === 'ds-agtech-resource-savings') || agSpecs[0];
  const agPlanRes = planChartForDataSpec(agSpec, regAg);

  if (!agPlanRes.plan) {
    console.error('❌ Failed to plan chart for AgTech Benchmarks:', agPlanRes.errors);
    process.exit(1);
  }

  const agPlan = agPlanRes.plan;
  console.log(`[AgTech Plan Type]: ${agPlan.type}`);

  const agNativeDef = renderChartPlanToNativePptx(agPlan, regAg);
  const pptxAg = new pptxgen();
  pptxAg.layout = 'LAYOUT_16x9';
  const slideAg = pptxAg.addSlide();

  // Slide Title
  slideAg.addText(agSpec.title, {
    x: 0.8,
    y: 0.6,
    w: 11.73,
    h: 0.6,
    fontSize: 22,
    bold: true,
    color: '1E293B',
  });

  if (agNativeDef.isTable) {
    slideAg.addTable(agNativeDef.tableData!, agNativeDef.tableOptions);
  } else {
    slideAg.addChart(agNativeDef.chartType as any, agNativeDef.chartData, agNativeDef.chartOptions);
  }

  // Source Footer aligned to grid
  slideAg.addText(agNativeDef.sourceFooterText, {
    x: 0.8,
    y: 6.7,
    w: 11.73,
    h: 0.4,
    fontSize: 10,
    italic: true,
    color: '64748B',
  });

  const agPath = path.join(outputsDir, 'visual-check-agriculture.pptx');
  await pptxAg.writeFile({ fileName: agPath });
  const reportAg = await validateChartPptx(agPath);
  console.log(`✔ Generated: ${agPath}`);
  console.log(`  Package Valid: ${reportAg.packageValid}`);
  console.log(`  PowerPoint Openable: ${reportAg.powerPointOpenable} (${reportAg.openableStatus})\n`);

  console.log('====================================================');
  console.log('  STEP 13D VISUAL VERIFICATION COMPLETE');
  console.log('====================================================');
}

runStep13DVisualVerification().catch((err) => {
  console.error('STEP 13D VISUAL VERIFICATION FAILED:', err);
  process.exit(1);
});
