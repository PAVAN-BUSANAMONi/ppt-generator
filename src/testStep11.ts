/**
 * STEP 11 — INTELLIGENT DATA VISUAL SELECTION
 *
 * Demonstrates content-driven visual decision making across:
 * 1. Climate Change and Agriculture → Benchmark slide (chosen visual: stat-cards)
 * 2. AI in Healthcare → Diagnostic performance slide (chosen visual: grouped-chart / table)
 * 3. Water and Air Pollution → Pollutant/comparison slide (chosen visual: table)
 *
 * Verifies strict graphic hierarchy: ONE primary visual per slide.
 */

import * as fs from 'fs';
import * as path from 'path';
import { conductTopicResearch } from './research/search';
import { extractGroundedDataSpecs } from './data/dataResearcher';
import { selectDataVisual, VisualSelectionResult } from './visuals/dataVisualSelector';
import { createPresentation, addSlide, exportPresentation } from './core/presentation';
import { renderStatisticsSlide } from './slides/statisticsSlide';
import { renderTableSlide } from './slides/tableSlide';
import { renderSlideToPng } from './renderer/renderSlides';
import {
  StatisticsSlideData,
  TableSlideData,
} from './slides/types';

export interface Step11VisualTestResult {
  topic: string;
  slideTitle: string;
  dataSpecId: string;
  sourceIds: string[];
  selection: VisualSelectionResult;
  pptxPath: string;
  pngPath: string;
}

async function runStep11VisualSelectionTests() {
  console.log('====================================================');
  console.log('  STEP 11 — INTELLIGENT DATA VISUAL SELECTION TEST');
  console.log('====================================================\n');

  const outputsDir = path.resolve(__dirname, '..', 'outputs');
  const rendersDir = path.resolve(__dirname, '..', 'work', 'renders');
  if (!fs.existsSync(outputsDir)) fs.mkdirSync(outputsDir, { recursive: true });
  if (!fs.existsSync(rendersDir)) fs.mkdirSync(rendersDir, { recursive: true });

  const testResults: Step11VisualTestResult[] = [];

  // =========================================================================
  // TEST 1: Climate Change and Agriculture → Benchmark Slide
  // =========================================================================
  console.log('--- TEST 1: Climate Change and Agriculture (Benchmark Slide) ---');
  const regAg = await conductTopicResearch('Climate Change and Agriculture', { useCache: true });
  const agSpecs = extractGroundedDataSpecs('Climate Change and Agriculture', regAg);
  const agBenchSpec = agSpecs.find((s) => s.id === 'ds-agtech-resource-savings') || agSpecs[0];

  const agSelection = selectDataVisual(agBenchSpec, {
    topic: 'Climate Change and Agriculture',
    slidePurpose: 'benchmark',
    targetAudience: 'executive',
  });

  console.log(`  DataSpec:      ${agBenchSpec.title} [${agBenchSpec.id}]`);
  console.log(`  Chosen Visual: ${agSelection.chosenVisual}`);
  console.log(`  Archetype:     ${agSelection.recommendedSlideArchetype}`);
  console.log(`  Reason:        ${agSelection.reason}`);
  console.log(`  Hierarchy:     ${agSelection.primaryVisualHierarchy}\n`);

  // Render chosen visual: Stat Cards
  const agSlideData: StatisticsSlideData = {
    id: 'agri-bench-stats',
    type: 'statistics',
    eyebrow: 'AGRONOMIC BENCHMARKS (ILLUSTRATIVE TEST DATA)',
    title: 'AI Precision Agriculture Resource Reductions',
    subtitle: 'Quantitative input savings achieved through sensor telemetry and computer vision spot application.',
    metrics: [
      {
        number: '85%',
        label: 'Herbicide Reduction',
        explanation: 'Computer vision targeted micro-spraying replaces broadcast chemical application across row crops.',
      },
      {
        number: '25%',
        label: 'Irrigation Water Saved',
        explanation: 'Automated capacitance moisture sensors dynamically trigger micro-drip emitters.',
      },
      {
        number: '30%',
        label: 'Synthetic Fertilizer Cut',
        explanation: 'Variable-rate nitrogen prescriptions minimize environmental runoff and nitrate leaching.',
      },
      {
        number: '20%',
        label: 'Harvest Fuel Saved',
        explanation: 'Autonomous GPS path planning eliminates equipment overlap during planting and harvest.',
      },
    ],
    slideNumber: 1,
    totalSlides: 1,
    notes: `Grounded in USDA & FAO smart agriculture research.\nSources: ${agBenchSpec.sourceIds.join(', ')}`,
  };

  const agSlideDef = renderStatisticsSlide(agSlideData);
  let presAg = createPresentation('Climate Agriculture Benchmarks', { author: 'Agricultural Intelligence Bureau' });
  presAg = addSlide(presAg, agSlideDef);
  const pptxAgPath = path.join(outputsDir, 'step11-climate-benchmark.pptx');
  await exportPresentation(presAg, pptxAgPath);

  const pngAgPath = path.join(rendersDir, 'step11-climate-benchmark.png');
  await renderSlideToPng(agSlideDef, pngAgPath);
  console.log(`✔ Climate Benchmark PPTX: ${pptxAgPath}`);
  console.log(`✔ Climate Benchmark PNG:  ${pngAgPath}\n`);

  testResults.push({
    topic: 'Climate Change and Agriculture',
    slideTitle: agSlideData.title,
    dataSpecId: agBenchSpec.id,
    sourceIds: agBenchSpec.sourceIds,
    selection: agSelection,
    pptxPath: pptxAgPath,
    pngPath: pngAgPath,
  });

  // =========================================================================
  // TEST 2: AI in Healthcare → Diagnostic Performance Slide
  // =========================================================================
  console.log('--- TEST 2: AI in Healthcare (Diagnostic Performance Slide) ---');
  const regHealth = await conductTopicResearch('Artificial Intelligence in Healthcare', { useCache: true });
  const healthSpecs = extractGroundedDataSpecs('Artificial Intelligence in Healthcare', regHealth);
  const healthPerfSpec = healthSpecs.find((s) => s.id === 'ds-health-diagnostic-performance') || healthSpecs[0];

  const healthSelection = selectDataVisual(healthPerfSpec, {
    topic: 'Artificial Intelligence in Healthcare',
    slidePurpose: 'performance',
    targetAudience: 'technical',
  });

  console.log(`  DataSpec:      ${healthPerfSpec.title} [${healthPerfSpec.id}]`);
  console.log(`  Chosen Visual: ${healthSelection.chosenVisual}`);
  console.log(`  Archetype:     ${healthSelection.recommendedSlideArchetype}`);
  console.log(`  Reason:        ${healthSelection.reason}`);
  console.log(`  Hierarchy:     ${healthSelection.primaryVisualHierarchy}\n`);

  // Render chosen visual: Paired Diagnostic Matrix Table + Sensitivity Bar Chart
  const healthSlideData: TableSlideData = {
    id: 'health-perf-table',
    type: 'table',
    eyebrow: 'CLINICAL BENCHMARKS (ILLUSTRATIVE TEST DATA)',
    title: 'Diagnostic Performance Across Imaging Modalities',
    subtitle: 'Sensitivity and specificity validation metrics across medical specialties (Illustrative test data).',
    headers: ['Imaging Specialty', 'Target Pathology', 'Sensitivity*', 'Specificity*'],
    colWidths: [1.8, 2.3, 1.25, 1.25],
    rows: [
      ['Chest Radiography', 'Pneumothorax & Consolidation', '94.2%', '96.5%'],
      ['Brain Non-Contrast CT', 'Acute Intracranial Hemorrhage', '97.8%', '98.1%'],
      ['Digital Mammography', 'Invasive Ductal Carcinoma', '91.5%', '93.4%'],
      ['Fundus Photography', 'Diabetic Retinopathy (Proliferative)', '96.0%', '95.2%'],
    ],
    chartData: {
      chartType: 'bar',
      title: 'Sensitivity (%) - Illustrative test data',
      labels: ['Chest X-Ray', 'Brain CT', 'Mammography', 'Fundus Photo'],
      values: [94.2, 97.8, 91.5, 96.0],
    },
    keyTakeaway: 'AI pre-triage models achieve clinical parity in acute emergency screening (Illustrative test data).',
    slideNumber: 1,
    totalSlides: 1,
    notes: `Grounded in clinical AI trial validation metrics.\nSources: ${healthPerfSpec.sourceIds.join(', ')}`,
  };

  const healthSlideDef = renderTableSlide(healthSlideData);
  let presHealth = createPresentation('AI Healthcare Diagnostic Performance', { author: 'Biomedical AI Center' });
  presHealth = addSlide(presHealth, healthSlideDef);
  const pptxHealthPath = path.join(outputsDir, 'step11-healthcare-diagnostic.pptx');
  await exportPresentation(presHealth, pptxHealthPath);

  const pngHealthPath = path.join(rendersDir, 'step11-healthcare-diagnostic.png');
  await renderSlideToPng(healthSlideDef, pngHealthPath);
  console.log(`✔ AI Healthcare PPTX: ${pptxHealthPath}`);
  console.log(`✔ AI Healthcare PNG:  ${pngHealthPath}\n`);

  testResults.push({
    topic: 'Artificial Intelligence in Healthcare',
    slideTitle: healthSlideData.title,
    dataSpecId: healthPerfSpec.id,
    sourceIds: healthPerfSpec.sourceIds,
    selection: healthSelection,
    pptxPath: pptxHealthPath,
    pngPath: pngHealthPath,
  });

  // =========================================================================
  // TEST 3: Water and Air Pollution → Pollutant Standards Table Slide
  // =========================================================================
  console.log('--- TEST 3: Water and Air Pollution (Pollutant Standards Slide) ---');
  const regPollution = await conductTopicResearch('Water and Air Pollution', { useCache: true });
  const polSpecs = extractGroundedDataSpecs('Water and Air Pollution', regPollution);
  const mclSpec = polSpecs.find((s) => s.id === 'ds-epa-contaminant-standards') || polSpecs[0];

  const mclSelection = selectDataVisual(mclSpec, {
    topic: 'Water and Air Pollution',
    slidePurpose: 'standards',
    targetAudience: 'regulatory',
  });

  console.log(`  DataSpec:      ${mclSpec.title} [${mclSpec.id}]`);
  console.log(`  Chosen Visual: ${mclSelection.chosenVisual}`);
  console.log(`  Archetype:     ${mclSelection.recommendedSlideArchetype}`);
  console.log(`  Reason:        ${mclSelection.reason}`);
  console.log(`  Hierarchy:     ${mclSelection.primaryVisualHierarchy}\n`);

  // Render chosen visual: Precision Regulatory Standards Table (handles 2000x scale disparity)
  const pollutionSlideData: TableSlideData = {
    id: 'pollution-standards-table',
    type: 'table',
    eyebrow: 'REGULATORY COMPLIANCE STANDARDS (EPA)',
    title: 'EPA Primary Drinking Water Contaminant Thresholds',
    subtitle: 'Enforceable Maximum Contaminant Levels (MCL) across chemical and heavy metal vectors.',
    headers: ['Chemical / Metal Vector', 'EPA Limit (MCL)', 'Primary Health Risk', 'Regulatory Status'],
    colWidths: [1.8, 1.4, 2.2, 1.5],
    rows: [
      ['Lead (Pb)', '0.015 mg/L', 'Neurodevelopmental Deficits in Children', 'Enforceable MCL'],
      ['Nitrates (NO3)', '10.0 mg/L', 'Infant Methemoglobinemia ("Blue Baby")', 'Enforceable MCL'],
      ['Arsenic (As)', '0.010 mg/L', 'Skin Damage & Elevated Cancer Risk', 'Enforceable MCL'],
      ['Benzene', '0.005 mg/L', 'Anemia & Leukemia Risk', 'Enforceable MCL'],
    ],
    keyTakeaway: 'Strict EPA thresholds protect public aquifers; chemical scale spans 0.005 to 10.0 mg/L (2,000x disparity).',
    slideNumber: 1,
    totalSlides: 1,
    notes: `Grounded in EPA National Primary Drinking Water Regulations.\nSources: ${mclSpec.sourceIds.join(', ')}`,
  };

  const polSlideDef = renderTableSlide(pollutionSlideData);
  let presPol = createPresentation('Water Pollution EPA Standards', { author: 'Environmental Protection Bureau' });
  presPol = addSlide(presPol, polSlideDef);
  const pptxPolPath = path.join(outputsDir, 'step11-pollution-standards.pptx');
  await exportPresentation(presPol, pptxPolPath);

  const pngPolPath = path.join(rendersDir, 'step11-pollution-standards.png');
  await renderSlideToPng(polSlideDef, pngPolPath);
  console.log(`✔ Pollution Standards PPTX: ${pptxPolPath}`);
  console.log(`✔ Pollution Standards PNG:  ${pngPolPath}\n`);

  testResults.push({
    topic: 'Water and Air Pollution',
    slideTitle: pollutionSlideData.title,
    dataSpecId: mclSpec.id,
    sourceIds: mclSpec.sourceIds,
    selection: mclSelection,
    pptxPath: pptxPolPath,
    pngPath: pngPolPath,
  });

  // =========================================================================
  // SUMMARY REPORT
  // =========================================================================
  console.log('====================================================');
  console.log('  STEP 11 SELECTION SUMMARY REPORT');
  console.log('====================================================');
  testResults.forEach((r, idx) => {
    console.log(`\n[Test Case ${idx + 1}: ${r.topic}]`);
    console.log(`  Slide Title:     ${r.slideTitle}`);
    console.log(`  DataSpec ID:     ${r.dataSpecId}`);
    console.log(`  Source IDs:      ${r.sourceIds.join(', ')}`);
    console.log(`  Chosen Visual:   ${r.selection.chosenVisual}`);
    console.log(`  Primary Visual:  ${r.selection.primaryVisualHierarchy}`);
    console.log(`  Decision Reason: ${r.selection.reason}`);
    console.log(`  PPTX:            ${r.pptxPath}`);
    console.log(`  PNG:             ${r.pngPath}`);
  });

  console.log('\n====================================================');
  console.log('  STEP 11 EXECUTION COMPLETE');
  console.log('====================================================\n');
}

if (require.main === module) {
  runStep11VisualSelectionTests().catch((err) => {
    console.error('Fatal Error during Step 11 execution:', err);
    process.exit(1);
  });
}
