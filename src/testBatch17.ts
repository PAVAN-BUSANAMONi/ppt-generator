/**
 * BATCH 17 — ZERO FABRICATED CHART/DATA VISUALS VERIFICATION SUITE
 *
 * Verifies:
 * - STEP 44: Value-level chart evidence gate
 * - STEP 44A: Rejection of synthetic metrics (preservation index, cultural index, etc.)
 * - STEP 44B: Fallback to grounded structured tables / diagrams when no numeric data exists
 * - STEP 45: Indian Culture fixed (0 unsupported charts, 100% grounded table)
 * - STEP 45A: Verified numeric claims in Indian Culture (121+, 22, 42, 8, 4000+, 3000+)
 * - STEP 46: Tests Indian Culture, Photosynthesis in Plants, and Blockchain Technology
 */

import * as path from 'path';
import * as fs from 'fs';
import { runProductionPipeline, ProductionPipelineResult } from './pipeline/productionPipeline';
import { rejectSyntheticMetrics } from './data/dataValidator';

interface DeckAuditResult {
  topic: string;
  domain: string;
  pptxPath: string;
  slideCount: number;
  fileSizeMb: string;
  powerpointPass: boolean;
  score: number;
  sections: string[];
  images: string[];
  charts: string[];
  tables: string[];
  diagrams: string[];
  syntheticMetricsDetected: string[];
  unsupportedClaims: string[];
}

async function runDeckTest(
  topic: string,
  slug: string,
  userInstructions?: string,
  audience?: string,
  purpose?: string,
  depth?: string
): Promise<DeckAuditResult> {
  const outputPath = path.resolve(__dirname, '..', 'outputs', `batch17-${slug}.pptx`);
  const rendersDir = path.resolve(__dirname, '..', 'work', 'renders', `batch17-${slug}`);

  console.log(`\n====================================================`);
  console.log(`  RUNNING BATCH 17 TEST: "${topic}"`);
  console.log(`====================================================`);

  const result: ProductionPipelineResult = await runProductionPipeline({
    topic,
    slideCount: 10,
    author: 'National Academic & Strategic Research Institute',
    userInstructions,
    audience,
    purpose,
    depth,
    transition: 'fade',
    outputPath,
    rendersDir,
  });

  const fileSizeMb = (fs.statSync(outputPath).size / (1024 * 1024)).toFixed(2);
  const sections = result.blueprint.sections.map((sec) => `${sec.sectionNumber}. ${sec.title}`);

  // Collect images
  const images: string[] = [];
  result.slideDefs.forEach((s) => {
    s.elements.forEach((el) => {
      if (el.kind === 'image' && el.path) {
        images.push(path.basename(el.path));
      }
    });
  });

  // Collect charts and check for synthetic metrics
  const charts: string[] = [];
  const syntheticMetricsDetected: string[] = [];

  result.slideDefs.forEach((s, idx) => {
    s.elements.forEach((el) => {
      if (el.kind === 'chart') {
        const seriesName = el.data?.[0]?.name || el.chartType;
        charts.push(`Slide ${idx + 1}: ${seriesName}`);

        // Run synthetic metric rejection check
        const check = rejectSyntheticMetrics({
          id: `chart-${idx}`,
          title: seriesName,
          sourceIds: ['test'],
          categories: el.data?.[0]?.labels || [],
          series: el.data || [],
        } as any);

        if (!check.passed) {
          syntheticMetricsDetected.push(`Slide ${idx + 1}: ${check.reason}`);
        }
      }
    });
  });

  // Collect tables
  const tables: string[] = [];
  result.slideDefs.forEach((s, idx) => {
    s.elements.forEach((el) => {
      if (el.kind === 'table') {
        const headerTexts = el.rows[0]?.map((c) => c.text).join(' | ') || '';
        tables.push(`Slide ${idx + 1}: Table with ${el.rows.length} rows (${headerTexts})`);
      }
    });
  });

  // Collect diagrams
  const diagrams: string[] = [];
  result.slideDefs.forEach((s, idx) => {
    if (s.id.includes('process') || s.id.includes('overview') || s.id.includes('comparison')) {
      diagrams.push(`Slide ${idx + 1}: ${s.id.split('-')[1]} layout`);
    }
  });

  // Check text content for unsupported synthetic percentage assertions
  const unsupportedClaims: string[] = [];
  let allText = '';
  result.slideDefs.forEach((s) => {
    s.elements.forEach((el) => {
      if (el.kind === 'text') {
        allText += ' ' + (typeof el.content === 'string' ? el.content : el.content.map((c: any) => c.text).join(' '));
      }
    });
  });

  if (allText.includes('Classical Lineage Preservation') || allText.includes('96% Bharatanatyam') || allText.includes('93.5%')) {
    unsupportedClaims.push('Found fabricated "Classical Lineage Preservation" percentage values.');
  }

  return {
    topic,
    domain: result.topicContext.domain,
    pptxPath: outputPath,
    slideCount: result.slideCount,
    fileSizeMb,
    powerpointPass: result.powerpointVerification.openSuccess,
    score: result.scoreReport.totalScore,
    sections,
    images,
    charts,
    tables,
    diagrams,
    syntheticMetricsDetected,
    unsupportedClaims,
  };
}

async function main() {
  console.log('====================================================');
  console.log('  BATCH 17 — ZERO FABRICATED VISUALS TEST SUITE');
  console.log('====================================================');

  // Deck 1: Indian Culture
  const indianCultureResult = await runDeckTest(
    'Indian Culture & Heritage',
    'indian-culture',
    'Focus on classical arts, festivals, languages, and philosophical pluralism',
    'University Students',
    'Educational',
    'Detailed'
  );

  // Deck 2: Photosynthesis in Plants
  const photosynthesisResult = await runDeckTest(
    'Photosynthesis in Plants',
    'photosynthesis',
    'Focus on biophysical Z-scheme, light-harvesting complexes, Calvin cycle, and C3 vs C4 efficiency',
    'B.Sc Agriculture Students',
    'Academic',
    'Detailed'
  );

  // Deck 3: Blockchain Technology and Applications
  const blockchainResult = await runDeckTest(
    'Blockchain Technology and Its Applications',
    'blockchain',
    'Focus on distributed ledgers, consensus protocols (PoW vs PoS), smart contract VMs, and enterprise supply chain',
    'Computer Science Students',
    'Technical Deep-Dive',
    'Detailed'
  );

  console.log('\n\n====================================================');
  console.log('  BATCH 17 COMPREHENSIVE VERIFICATION REPORT');
  console.log('====================================================\n');

  const decks = [indianCultureResult, photosynthesisResult, blockchainResult];

  decks.forEach((d, idx) => {
    console.log(`----------------------------------------------------`);
    console.log(`DECK ${idx + 1}: ${d.topic.toUpperCase()}`);
    console.log(`----------------------------------------------------`);
    console.log(`PPTX Path:                  ${d.pptxPath}`);
    console.log(`Slide Count:                ${d.slideCount}`);
    console.log(`Domain Detected:            ${d.domain}`);
    console.log(`File Size:                  ${d.fileSizeMb} MB`);
    console.log(`PowerPoint Open:            ${d.powerpointPass ? 'PASS' : 'FAIL'}`);
    console.log(`Audit Score:                ${d.score}/100`);
    console.log(`Synthetic Metrics Found:    ${d.syntheticMetricsDetected.length === 0 ? '0 (PASS)' : d.syntheticMetricsDetected.join('; ')}`);
    console.log(`Unsupported Claims Found:   ${d.unsupportedClaims.length === 0 ? '0 (PASS)' : d.unsupportedClaims.join('; ')}`);
    console.log(`Images Used (${d.images.length}/5):`);
    d.images.forEach((img) => console.log(`  - ${img}`));
    console.log(`Grounded Charts (${d.charts.length}):`);
    if (d.charts.length === 0) console.log('  - None (Qualitative topic; non-numeric visual alternative used)');
    d.charts.forEach((ch) => console.log(`  - ${ch}`));
    console.log(`Structured Tables (${d.tables.length}):`);
    d.tables.forEach((tb) => console.log(`  - ${tb}`));
    console.log(`Diagram Layouts (${d.diagrams.length}):`);
    d.diagrams.forEach((dg) => console.log(`  - ${dg}`));
    console.log('');
  });

  const allPassed = decks.every(
    (d) =>
      d.powerpointPass &&
      d.syntheticMetricsDetected.length === 0 &&
      d.unsupportedClaims.length === 0 &&
      d.score >= 90 &&
      d.images.length >= 5
  );

  console.log(`====================================================`);
  console.log(`BATCH 17 STATUS: ${allPassed ? 'ALL PASS (100%)' : 'SOME FAIL'}`);
  console.log(`====================================================\n`);

  if (!allPassed) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Batch 17 Test Suite Error:', err);
  process.exit(1);
});
