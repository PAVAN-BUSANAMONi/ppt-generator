import * as fs from 'fs';
import * as path from 'path';
import pptxgen from 'pptxgenjs';
import { execSync } from 'child_process';
import { conductTopicResearch } from './research/search';
import { extractGroundedDataSpecs } from './data/dataResearcher';
import { planChartForDataSpec } from './data/chartPlanner';
import { renderChartPlanToNativePptx } from './data/chartRenderer';
import { validateChartPptx } from './data/chartInspector';

function renderPptxSlideToPng(pptxPath: string, pngPath: string): boolean {
  try {
    const absPptx = path.resolve(pptxPath);
    const absPng = path.resolve(pngPath);
    const pngDir = path.dirname(absPng);
    if (!fs.existsSync(pngDir)) fs.mkdirSync(pngDir, { recursive: true });

    const psCmd = `$ppt = $null; try { $ppt = New-Object -ComObject PowerPoint.Application; $pres = $ppt.Presentations.Open('${absPptx}', 1, 0, 0); if ($pres -ne $null) { $pres.Slides.Item(1).Export('${absPng}', 'PNG', 1280, 720); $pres.Close(); Write-Output 'RENDER_SUCCESS' } } catch { Write-Output ('RENDER_ERROR: ' + $_.Exception.Message) } finally { if ($ppt -ne $null) { $ppt.Quit() } }`;
    
    const res = execSync(`powershell -NoProfile -Command "${psCmd}"`, { timeout: 15000, encoding: 'utf-8' }).trim();
    return res.includes('RENDER_SUCCESS') && fs.existsSync(absPng);
  } catch (err) {
    console.error('PowerPoint COM Export Error:', err);
    return false;
  }
}

async function runStep13EVisualVerification() {
  console.log('====================================================');
  console.log('  STEP 13E — ACTUAL CHART & TABLE VISUAL FIT TEST');
  console.log('====================================================\n');

  const outputsDir = path.resolve(__dirname, '..', 'outputs');
  const rendersDir = path.resolve(__dirname, '..', 'work', 'renders');
  if (!fs.existsSync(outputsDir)) fs.mkdirSync(outputsDir, { recursive: true });
  if (!fs.existsSync(rendersDir)) fs.mkdirSync(rendersDir, { recursive: true });

  // -------------------------------------------------------------------------
  // 1. AI Agriculture Benchmark Chart (LAYOUT_WIDE 1280x720 Canvas)
  // -------------------------------------------------------------------------
  const regAg = await conductTopicResearch('Artificial Intelligence in Agriculture', { useCache: true });
  const agSpecs = extractGroundedDataSpecs('Artificial Intelligence in Agriculture', regAg);
  const agSpec = agSpecs.find((s) => s.id === 'ds-agtech-resource-savings') || agSpecs[0];
  const agPlanRes = planChartForDataSpec(agSpec, regAg);

  if (!agPlanRes.plan) {
    console.error('❌ Failed to plan chart for AgTech Benchmarks:', agPlanRes.errors);
    process.exit(1);
  }

  const agPlan = agPlanRes.plan;
  const agNativeDef = renderChartPlanToNativePptx(agPlan, regAg);
  const pptxAg = new pptxgen();
  pptxAg.layout = 'LAYOUT_WIDE'; // 13.333" x 7.5" (1280x720 @ 96 DPI)

  const slideAg = pptxAg.addSlide();

  // Slide Title (Left=64px=0.667in, Top=46px=0.48in, W=11.8in)
  slideAg.addText(agSpec.title, {
    x: 0.667,
    y: 0.48,
    w: 11.8,
    h: 0.5,
    fontSize: 22,
    bold: true,
    color: '1E293B',
  });

  if (agNativeDef.isTable) {
    slideAg.addTable(agNativeDef.tableData!, agNativeDef.tableOptions);
  } else {
    slideAg.addChart(agNativeDef.chartType as any, agNativeDef.chartData, agNativeDef.chartOptions);
  }

  // Source Footer (Top=636px=6.625in, Bottom margin=56px=0.583in)
  slideAg.addText(agNativeDef.sourceFooterText, {
    x: 0.667,
    y: 6.625,
    w: 11.8,
    h: 0.3,
    fontSize: 10,
    italic: true,
    color: '64748B',
  });

  const agPptxPath = path.join(outputsDir, 'visual-check-agriculture-13e.pptx');
  await pptxAg.writeFile({ fileName: agPptxPath });
  const agReport = await validateChartPptx(agPptxPath);

  const agPngPath = path.join(rendersDir, 'visual-check-agriculture-13e.png');
  const agRenderOk = renderPptxSlideToPng(agPptxPath, agPngPath);

  console.log(`[Agriculture Chart]`);
  console.log(`  PPTX Path:     ${agPptxPath}`);
  console.log(`  PNG Path:      ${agPngPath}`);
  console.log(`  Package Valid: ${agReport.packageValid}`);
  console.log(`  Openable:      ${agReport.powerPointOpenable}`);
  console.log(`  PNG Rendered:  ${agRenderOk}\n`);

  // -------------------------------------------------------------------------
  // 2. EPA MCL Table (LAYOUT_WIDE 1280x720 Canvas)
  // -------------------------------------------------------------------------
  const regWater = await conductTopicResearch('Water and Air Pollution', { useCache: true });
  const waterSpecs = extractGroundedDataSpecs('Water and Air Pollution', regWater);
  const epaSpec = waterSpecs.find((s) => s.id === 'ds-epa-contaminant-standards') || waterSpecs[0];
  const epaPlanRes = planChartForDataSpec(epaSpec, regWater);

  if (!epaPlanRes.plan) {
    console.error('❌ Failed to plan chart for EPA MCL:', epaPlanRes.errors);
    process.exit(1);
  }

  const epaPlan = epaPlanRes.plan;
  const epaNativeDef = renderChartPlanToNativePptx(epaPlan, regWater);
  const pptxWater = new pptxgen();
  pptxWater.layout = 'LAYOUT_WIDE'; // 13.333" x 7.5" (1280x720 @ 96 DPI)

  const slideWater = pptxWater.addSlide();

  // Slide Title (Left=64px=0.667in, Top=46px=0.48in, W=11.8in)
  slideWater.addText(epaSpec.title, {
    x: 0.667,
    y: 0.48,
    w: 11.8,
    h: 0.5,
    fontSize: 22,
    bold: true,
    color: '1E293B',
  });

  if (epaNativeDef.isTable) {
    slideWater.addTable(epaNativeDef.tableData!, epaNativeDef.tableOptions);
  } else {
    slideWater.addChart(epaNativeDef.chartType as any, epaNativeDef.chartData, epaNativeDef.chartOptions);
  }

  // Source Footer (Top=636px=6.625in, Bottom margin=56px=0.583in)
  slideWater.addText(epaNativeDef.sourceFooterText, {
    x: 0.667,
    y: 6.625,
    w: 11.8,
    h: 0.3,
    fontSize: 10,
    italic: true,
    color: '64748B',
  });

  const waterPptxPath = path.join(outputsDir, 'visual-check-mcl-13e.pptx');
  await pptxWater.writeFile({ fileName: waterPptxPath });
  const waterReport = await validateChartPptx(waterPptxPath);

  const waterPngPath = path.join(rendersDir, 'visual-check-mcl-13e.png');
  const waterRenderOk = renderPptxSlideToPng(waterPptxPath, waterPngPath);

  console.log(`[EPA MCL Table]`);
  console.log(`  PPTX Path:     ${waterPptxPath}`);
  console.log(`  PNG Path:      ${waterPngPath}`);
  console.log(`  Package Valid: ${waterReport.packageValid}`);
  console.log(`  Openable:      ${waterReport.powerPointOpenable}`);
  console.log(`  PNG Rendered:  ${waterRenderOk}\n`);

  console.log('====================================================');
  console.log('  STEP 13E VISUAL FIT VERIFICATION COMPLETE');
  console.log('====================================================');
}

runStep13EVisualVerification().catch((err) => {
  console.error('STEP 13E VISUAL VERIFICATION FAILED:', err);
  process.exit(1);
});
