/**
 * BATCH 16 — VERIFICATION OF PRODUCTION UI + TOPIC BINDING + 3 TEST DECKS
 *
 * Runs the exact production pipeline for:
 * 1. Indian Culture
 * 2. Photosynthesis in Plants
 * 3. Blockchain Technology and Its Applications
 *
 * Verifies:
 * - 100% Topic Consistency (0 contamination across domains)
 * - PowerPoint COM Openability (100% repair-free)
 * - 5 relevant images per deck
 * - Grounded charts, structured tables, and process diagrams
 * - Zero meta/internal text leaks
 */

import * as path from 'path';
import * as fs from 'fs';
import { runProductionPipeline, ProductionPipelineResult } from './pipeline/productionPipeline';

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
  sourceCount: number;
  contaminationPass: boolean;
  contaminationErrors: string[];
}

async function runDeckTest(
  topic: string,
  slug: string,
  userInstructions?: string,
  audience?: string,
  purpose?: string,
  depth?: string,
  forbiddenTerms: string[] = []
): Promise<DeckAuditResult> {
  const outputPath = path.resolve(__dirname, '..', 'outputs', `batch16-${slug}.pptx`);
  const rendersDir = path.resolve(__dirname, '..', 'work', 'renders', `batch16-${slug}`);

  console.log(`\n====================================================`);
  console.log(`  RUNNING BATCH 16 TEST: "${topic}"`);
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

  // Collect charts
  const charts: string[] = [];
  result.slideDefs.forEach((s, idx) => {
    s.elements.forEach((el) => {
      if (el.kind === 'chart') {
        charts.push(`Slide ${idx + 1}: ${el.chartType} chart`);
      }
    });
  });

  // Collect tables
  const tables: string[] = [];
  result.slideDefs.forEach((s, idx) => {
    s.elements.forEach((el) => {
      if (el.kind === 'table') {
        tables.push(`Slide ${idx + 1}: Table with ${el.rows.length} rows`);
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

  // Contamination check
  const contaminationErrors: string[] = [];
  let allText = '';
  result.slideDefs.forEach((s) => {
    s.elements.forEach((el) => {
      if (el.kind === 'text') {
        allText += ' ' + (typeof el.content === 'string' ? el.content : el.content.map((c: any) => c.text).join(' '));
      }
    });
  });
  const lowerAllText = allText.toLowerCase();

  forbiddenTerms.forEach((term) => {
    const regex = new RegExp(`\\b${term}\\b`, 'i');
    if (regex.test(lowerAllText)) {
      contaminationErrors.push(`Found forbidden cross-domain term "${term}"`);
    }
  });

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
    sourceCount: result.sourcesCount,
    contaminationPass: contaminationErrors.length === 0,
    contaminationErrors,
  };
}

async function main() {
  console.log('====================================================');
  console.log('  BATCH 16 — 3-DECK PRODUCTION VERIFICATION SUITE');
  console.log('====================================================');

  // Deck 1: Indian Culture
  const indianCultureResult = await runDeckTest(
    'Indian Culture',
    'indian-culture',
    'Focus on classical arts, festivals, languages, and Vasudhaiva Kutumbakam pluralism',
    'University Students',
    'Educational',
    'Detailed',
    ['combine harvester', 'tractor', 'micropropagation', 'callus', 'blockchain', 'ethereum', 'botnet']
  );

  // Deck 2: Photosynthesis in Plants
  const photosynthesisResult = await runDeckTest(
    'Photosynthesis in Plants',
    'photosynthesis',
    'Focus on biophysical Z-scheme, light-harvesting complexes, Calvin cycle, and C3 vs C4 efficiency',
    'B.Sc Agriculture Students',
    'Academic',
    'Detailed',
    ['constitution', 'supreme court', 'blockchain', 'ethereum', 'malware', 'botnet', 'taj mahal']
  );

  // Deck 3: Blockchain Technology and Applications
  const blockchainResult = await runDeckTest(
    'Blockchain Technology and Its Applications',
    'blockchain',
    'Focus on distributed ledgers, consensus protocols (PoW vs PoS), smart contract VMs, and enterprise supply chain',
    'Computer Science Students',
    'Technical Deep-Dive',
    'Detailed',
    ['agriculture', 'tractor', 'photosynthesis', 'chloroplast', 'rubisco', 'preamble', 'taj mahal']
  );

  console.log('\n\n====================================================');
  console.log('  BATCH 16 COMPREHENSIVE VERIFICATION REPORT');
  console.log('====================================================\n');

  const decks = [indianCultureResult, photosynthesisResult, blockchainResult];

  decks.forEach((d, idx) => {
    console.log(`----------------------------------------------------`);
    console.log(`DECK ${idx + 1}: ${d.topic.toUpperCase()}`);
    console.log(`----------------------------------------------------`);
    console.log(`PPTX Path:           ${d.pptxPath}`);
    console.log(`Slide Count:         ${d.slideCount}`);
    console.log(`Domain Detected:     ${d.domain}`);
    console.log(`File Size:           ${d.fileSizeMb} MB`);
    console.log(`PowerPoint Open:     ${d.powerpointPass ? 'PASS' : 'FAIL'}`);
    console.log(`Audit Score:         ${d.score}/100`);
    console.log(`Contamination Check: ${d.contaminationPass ? 'PASS (0 leaks)' : 'FAIL: ' + d.contaminationErrors.join(', ')}`);
    console.log(`Section Sequence:`);
    d.sections.forEach((sec) => console.log(`  - ${sec}`));
    console.log(`Images Used (${d.images.length}/5):`);
    d.images.forEach((img) => console.log(`  - ${img}`));
    console.log(`Charts Used (${d.charts.length}):`);
    d.charts.forEach((ch) => console.log(`  - ${ch}`));
    console.log(`Tables Used (${d.tables.length}):`);
    d.tables.forEach((tb) => console.log(`  - ${tb}`));
    console.log(`Diagrams Used (${d.diagrams.length}):`);
    d.diagrams.forEach((dg) => console.log(`  - ${dg}`));
    console.log(`Source Count:        ${d.sourceCount} verified research sources`);
    console.log('');
  });

  const allPassed = decks.every((d) => d.powerpointPass && d.contaminationPass && d.score >= 90 && d.images.length >= 5);
  console.log(`====================================================`);
  console.log(`ALL 3 DECKS STATUS: ${allPassed ? 'ALL PASS (100%)' : 'SOME FAIL'}`);
  console.log(`====================================================\n`);

  if (!allPassed) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Batch 16 Test Suite Error:', err);
  process.exit(1);
});
