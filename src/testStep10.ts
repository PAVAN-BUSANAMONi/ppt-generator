/**
 * STEP 10 — REAL IMAGES IN ACTUAL SLIDES
 *
 * End-to-End Image Search, Semantic Ranking, Caching, Attribution, and Slide Rendering.
 * Decks:
 * A: Climate Change and Agriculture (10 slides)
 * B: Artificial Intelligence in Healthcare (10 slides)
 */

import * as fs from 'fs';
import * as path from 'path';
import { createPresentation, addSlide, exportPresentation } from './core/presentation';
import { renderSlide } from './slides/registry';
import { SlideDefinition } from './core/types';
import { renderSlidesToPng } from './renderer/renderSlides';
import { createDeckMontage } from './renderer/montage';
import { AssetManager } from './assets/assetManager';
import { VisualPlan } from './visuals/visualTypes';
import {
  TitleSlideData,
  OverviewSlideData,
  ConceptSlideData,
  ComparisonSlideData,
  CauseEffectSlideData,
  ProcessSlideData,
  TableSlideData,
  CaseStudySlideData,
  KeyTakeawaysSlideData,
  ConclusionSlideData,
} from './slides/types';

// ============================================================================
// DECK A: Climate Change and Agriculture (10 Slides)
// ============================================================================
export async function buildClimateAgricultureDeck(assetMgr: AssetManager): Promise<{ slides: SlideDefinition[]; imageLog: any[] }> {
  const imageLog: any[] = [];
  const topic = 'Climate Change and Agriculture';

  // 1. Title Slide (Hero Photo)
  const titlePlan: VisualPlan = {
    type: 'photo',
    purpose: 'Hero background showing agricultural landscape impacted by changing climate',
    relevanceQuery: 'agriculture farm wheat field drought crop',
    placement: 'right',
    importance: 'primary',
    aspectRatio: 'portrait',
  };
  const titleRes = await assetMgr.resolveImageForVisualPlan(titlePlan, topic);
  if (titleRes.asset) {
    imageLog.push({
      slideNum: 1,
      slideTitle: 'Climate Change and Agriculture',
      role: 'Hero image',
      source: titleRes.asset.source,
      sourceUrl: titleRes.asset.sourceUrl,
      title: titleRes.asset.title,
      creator: titleRes.asset.creator,
      license: titleRes.asset.license,
      localPath: titleRes.asset.localPath,
    });
  }

  const slide1Data: TitleSlideData = {
    id: 'agri-01-title',
    type: 'title',
    eyebrow: 'SUSTAINABLE AGRONOMY & CLIMATE SCIENCE',
    title: 'Climate Change & Global Agriculture',
    subtitle: 'Impacts on Crop Yields, Soil Ecology, and Climate-Resilient Agricultural Adaptation',
    author: 'Institute for Climate Resilient Agriculture',
    date: 'August 2026',
    dark: true,
    slideNumber: 1,
    totalSlides: 10,
    image: titleRes.asset?.localPath,
    notes: `Title slide for Climate Change and Agriculture briefing.${
      titleRes.attribution
        ? `\n\n[Image Credit: "${titleRes.attribution.title}" by ${titleRes.attribution.creator} (${titleRes.attribution.license}) - ${titleRes.attribution.sourceUrl}]`
        : ''
    }`,
  };

  // 2. Overview Slide (No Image)
  const slide2Data: OverviewSlideData = {
    id: 'agri-02-overview',
    type: 'overview',
    eyebrow: 'BRIEFING ROADMAP',
    title: 'Agricultural Vulnerability & Adaptation Agenda',
    subtitle: 'Strategic analysis of climatic vectors and technological solutions in food systems.',
    agendaItems: [
      { number: '1', title: 'Thermal & Hydrological Stress', description: 'Impacts of heatwaves and altered precipitation on staple cereal crops.', icon: 'Thermometer' },
      { number: '2', title: 'Conventional vs Regenerative', description: 'Comparing input-heavy monoculture against diversified regenerative agronomy.', icon: 'Scale' },
      { number: '3', title: 'Soil Degradation Feedback', description: 'Erosion of soil organic carbon and disruption of microbial mycorrhizae.', icon: 'Layers' },
      { number: '4', title: 'Precision Climate Tech', description: 'Deploying IoT moisture probes, variable rate irrigation, and drought-tolerant cultivars.', icon: 'CheckCircle2' },
    ],
    slideNumber: 2,
    totalSlides: 10,
    notes: 'Overview of topics covered in the agricultural resilience assessment.',
  };

  // 3. Concept Slide (Concept Visual Image)
  const conceptPlan: VisualPlan = {
    type: 'photo',
    purpose: 'Smart precision agriculture technology deployed in crop fields',
    relevanceQuery: 'smart agriculture precision farming crop field',
    placement: 'left',
    importance: 'primary',
    aspectRatio: 'portrait',
  };
  const conceptRes = await assetMgr.resolveImageForVisualPlan(conceptPlan, topic);
  if (conceptRes.asset) {
    imageLog.push({
      slideNum: 3,
      slideTitle: 'Climate-Smart Agriculture (CSA)',
      role: 'Concept visual',
      source: conceptRes.asset.source,
      sourceUrl: conceptRes.asset.sourceUrl,
      title: conceptRes.asset.title,
      creator: conceptRes.asset.creator,
      license: conceptRes.asset.license,
      localPath: conceptRes.asset.localPath,
    });
  }

  const slide3Data: ConceptSlideData = {
    id: 'agri-03-concept',
    type: 'concept',
    eyebrow: 'AGRONOMIC FRAMEWORK',
    title: 'Climate-Smart Agriculture (CSA) Architecture',
    subtitle: 'Integrated approach to simultaneously boost productivity and sequester soil carbon.',
    image: conceptRes.asset?.localPath,
    mainConcept: {
      title: 'Climate-Smart Agronomy',
      description: 'An integrated management framework that balances food security, climate resilience, and greenhouse gas mitigation through data-driven soil and crop management.',
    },
    cards: [
      {
        icon: 'Cpu',
        title: 'Precision Soil Moisture Telemetry',
        body: 'Real-time capacitance probes and satellite NDVI indices driving automated micro-irrigation scheduling.',
      },
      {
        icon: 'Leaf',
        title: 'Microbial Soil Inoculants',
        body: 'Endophytic biofertilizers that enhance root depth, nitrogen fixation, and plant drought tolerance.',
      },
    ],
    slideNumber: 3,
    totalSlides: 10,
    notes: `Concept breakdown of CSA frameworks.${
      conceptRes.attribution
        ? `\n\n[Image Credit: "${conceptRes.attribution.title}" by ${conceptRes.attribution.creator} (${conceptRes.attribution.license}) - ${conceptRes.attribution.sourceUrl}]`
        : ''
    }`,
  };

  // 4. Comparison Slide (No Image)
  const slide4Data: ComparisonSlideData = {
    id: 'agri-04-comparison',
    type: 'comparison',
    eyebrow: 'SYSTEMIC COMPARISON',
    title: 'Conventional Monoculture vs Regenerative Agroecology',
    subtitle: 'Evaluating long-term soil organic matter, drought resilience, and input costs.',
    leftPanel: {
      title: 'Conventional High-Input Farming',
      accentColor: 'gold',
      points: [
        'Heavy synthetic nitrogen and phosphate fertilizer reliance',
        'Intensive tillage causing topsoil loss and organic matter depletion',
        'Monocropping increases susceptibility to climate-induced pest surges',
        'High operational energy footprint from fossil chemical inputs',
      ],
    },
    rightPanel: {
      title: 'Regenerative Agroecology Systems',
      accentColor: 'blue',
      points: [
        'Continuous living cover crops and multi-species rotational grazing',
        'No-till preservation of fungal mycorrhizal soil networks',
        'Higher water infiltration rate reduces drought and flood vulnerability',
        'Active biological carbon sequestration into stable humus fractions',
      ],
    },
    slideNumber: 4,
    totalSlides: 10,
    notes: 'Comparison between high-input legacy agriculture and regenerative agroecology.',
  };

  // 5. Cause-Effect Slide (No Image)
  const slide5Data: CauseEffectSlideData = {
    id: 'agri-05-cause-effect',
    type: 'cause-effect',
    eyebrow: 'ECOSYSTEM MECHANISMS',
    title: 'Drought Cascades on Food Production',
    subtitle: 'How persistent soil moisture deficits trigger compound agricultural disruptions.',
    causes: [
      { title: 'Prolonged Rainfall Deficits', description: 'Depleted regional aquifers and inadequate seasonal precipitation.' },
      { title: 'Extreme Vapor Pressure Deficit', description: 'High atmospheric evaporative demand accelerating crop transpiration.' },
    ],
    mechanism: 'Extreme soil water stress triggers stomatal closure, suppressing photosynthesis, stunting reproductive pollination, and reducing cereal harvest biomass by over 30%.',
    effects: [
      { title: 'Severe Crop Yield Declines', description: 'Sharply curtailed staple cereal harvests and regional grain shortfalls.' },
      { title: 'Accelerated Topsoil Desiccation', description: 'Loss of root cohesion causing dust storm generation and wind erosion.' },
    ],
    slideNumber: 5,
    totalSlides: 10,
    notes: 'Cause and effect cascade of extreme drought on crop biology.',
  };

  // 6. Process Slide (No Image)
  const slide6Data: ProcessSlideData = {
    id: 'agri-06-process',
    type: 'process',
    eyebrow: 'FARM TRANSITION PROTOCOL',
    title: '4-Phase Regenerative Farm Conversion',
    subtitle: 'Systematic operational pathway to restore soil health and drought resilience.',
    steps: [
      { stepNumber: 1, title: 'Soil Baseline Mapping', description: 'Conduct grid soil chemistry, organic carbon, and microbiome metagenomic testing.', icon: 'MapPin' },
      { stepNumber: 2, title: 'Cover Crop Seeding', description: 'Plant deep-rooting brassica and legume cover blends between cash crop cycles.', icon: 'Compass' },
      { stepNumber: 3, title: 'No-Till Machinery Transition', description: 'Deploy specialized roller-crimpers and direct-seed air drills to protect soil crust.', icon: 'Settings' },
      { stepNumber: 4, title: 'Telemetry Optimization', description: 'Calibrate variable-rate nutrient and irrigation algorithms using field IoT sensors.', icon: 'Activity' },
    ],
    slideNumber: 6,
    totalSlides: 10,
    notes: 'Four-stage operational transition pathway for farm decarbonization.',
  };

  // 7. Table Slide with Chart & Takeaway (No Image)
  const slide7Data: TableSlideData = {
    id: 'agri-07-table',
    type: 'table',
    eyebrow: 'AGRONOMIC BENCHMARKS (ILLUSTRATIVE TEST DATA)',
    title: 'Climate Adaptation Impact on Major Staple Crops',
    subtitle: 'Comparative yield preservation metrics under climate-smart management (Illustrative test data).',
    headers: ['Staple Crop', 'Climate Stressor', 'Yield Protection*', 'Water Savings*'],
    colWidths: [1.8, 2.3, 1.25, 1.25],
    rows: [
      ['Grain Maize (Corn)', 'Extreme Heatwaves & Drought', '88.4%', '34.2%'],
      ['Hard Red Winter Wheat', 'Soil Desiccation & Frost', '92.1%', '28.5%'],
      ['Paddy Rice (Basmati)', 'High Water Salinity', '86.7%', '41.0%'],
      ['Soybean (Glycine max)', 'Variable Rainfall Patterns', '94.0%', '22.8%'],
    ],
    chartData: {
      chartType: 'bar',
      title: 'Yield Protection (%) - Illustrative test data',
      labels: ['Maize', 'Wheat', 'Rice', 'Soybean'],
      values: [88.4, 92.1, 86.7, 94.0],
    },
    keyTakeaway: 'Combined no-till and drip telemetry preserves over 88% of cereal yield under severe drought (Illustrative test data).',
    slideNumber: 7,
    totalSlides: 10,
    notes: 'Quantitative table and chart evaluating agronomic yield preservation.',
  };

  // 8. Case Study Slide (Real-World Image)
  const caseStudyPlan: VisualPlan = {
    type: 'photo',
    purpose: 'Drip irrigation water conservation system in agricultural crop field',
    relevanceQuery: 'drip irrigation crop field water conservation agriculture',
    placement: 'right',
    importance: 'primary',
    aspectRatio: 'portrait',
  };
  const caseStudyRes = await assetMgr.resolveImageForVisualPlan(caseStudyPlan, topic);
  if (caseStudyRes.asset) {
    imageLog.push({
      slideNum: 8,
      slideTitle: 'Arava Valley Desert Agriculture',
      role: 'Case study photo',
      source: caseStudyRes.asset.source,
      sourceUrl: caseStudyRes.asset.sourceUrl,
      title: caseStudyRes.asset.title,
      creator: caseStudyRes.asset.creator,
      license: caseStudyRes.asset.license,
      localPath: caseStudyRes.asset.localPath,
    });
  }

  const slide8Data: CaseStudySlideData = {
    id: 'agri-08-case-study',
    type: 'case-study',
    eyebrow: 'REGIONAL IMPLEMENTATION CASE',
    title: 'Arava Desert Precision Drip Agriculture',
    subtitle: 'Commercial agricultural production under hyper-arid desert climate conditions.',
    image: caseStudyRes.asset?.localPath,
    context: 'Hyper-arid region receiving under 50mm annual rainfall with hyper-saline groundwater resources.',
    challenge: 'Extreme summer temperatures above 44°C causing severe crop heat shock and severe water evaporation.',
    solution: 'Engineered subsurface precision drip networks delivering brackish water with automated fertigation.',
    result: 'Achieved 4.2x water efficiency multiple and export-quality bell pepper yields exceeding 85 t/ha.',
    slideNumber: 8,
    totalSlides: 10,
    notes: `Empirical case study of desert precision agriculture.${
      caseStudyRes.attribution
        ? `\n\n[Image Credit: "${caseStudyRes.attribution.title}" by ${caseStudyRes.attribution.creator} (${caseStudyRes.attribution.license}) - ${caseStudyRes.attribution.sourceUrl}]`
        : ''
    }`,
  };

  // 9. Takeaways Slide (No Image)
  const slide9Data: KeyTakeawaysSlideData = {
    id: 'agri-09-takeaways',
    type: 'takeaways',
    eyebrow: 'EXECUTIVE DIRECTIVES',
    title: 'Core Principles for Agricultural Resilience',
    subtitle: 'Strategic priorities for agricultural ministries, farm cooperatives, and agribusiness.',
    takeaways: [
      { number: 1, title: 'Prioritize Soil Organic Carbon', description: 'Every 1% increase in soil organic matter retains 20,000 gallons of additional water per acre.' },
      { number: 2, title: 'Scale Precision Drip Telemetry', description: 'Replacing flood irrigation with sensor-driven micro-drip eliminates water waste and nutrient leaching.' },
      { number: 3, title: 'Diversify Cropping Systems', description: 'Polyculture rotations and drought-tolerant seed genetics buffer against single-season climatic anomalies.' },
      { number: 4, title: 'Incentivize Ecosystem Services', description: 'Carbon credits and watershed stewardship programs provide vital transition financing for growers.' },
    ],
    slideNumber: 9,
    totalSlides: 10,
    notes: 'Key executive takeaways for agricultural climate policy.',
  };

  // 10. Conclusion Slide (No Image)
  const slide10Data: ConclusionSlideData = {
    id: 'agri-10-conclusion',
    type: 'conclusion',
    eyebrow: 'VISION & STRATEGY',
    title: 'Building Resilient Food Systems for 2050',
    summaryText: 'Securing global food security amidst climatic volatility requires uniting precision telemetry, biological soil regeneration, and diversified agroecological practices. Modern agriculture can become a primary engine for planetary climate resilience.',
    finalCallToAction: 'Transform Farm Infrastructure — Protect Global Food Security.',
    dark: true,
    slideNumber: 10,
    totalSlides: 10,
    notes: 'Concluding synthesis and call to action for agricultural climate resilience.',
  };

  const rawSlides = [
    slide1Data,
    slide2Data,
    slide3Data,
    slide4Data,
    slide5Data,
    slide6Data,
    slide7Data,
    slide8Data,
    slide9Data,
    slide10Data,
  ];

  return {
    slides: rawSlides.map((s) => renderSlide(s)),
    imageLog,
  };
}

// ============================================================================
// DECK B: Artificial Intelligence in Healthcare (10 Slides)
// ============================================================================
export async function buildAiHealthcareDeck(assetMgr: AssetManager): Promise<{ slides: SlideDefinition[]; imageLog: any[] }> {
  const imageLog: any[] = [];
  const topic = 'Artificial Intelligence in Healthcare';

  // 1. Title Slide (Hero Photo)
  const titlePlan: VisualPlan = {
    type: 'photo',
    purpose: 'Advanced medical imaging hospital radiology MRI CT clinical technology',
    relevanceQuery: 'radiology MRI scanner medical imaging clinical hospital',
    placement: 'right',
    importance: 'primary',
    aspectRatio: 'portrait',
  };
  const titleRes = await assetMgr.resolveImageForVisualPlan(titlePlan, topic);
  if (titleRes.asset) {
    imageLog.push({
      slideNum: 1,
      slideTitle: 'AI in Healthcare & Clinical Diagnostics',
      role: 'Hero image',
      source: titleRes.asset.source,
      sourceUrl: titleRes.asset.sourceUrl,
      title: titleRes.asset.title,
      creator: titleRes.asset.creator,
      license: titleRes.asset.license,
      localPath: titleRes.asset.localPath,
    });
  }

  const slide1Data: TitleSlideData = {
    id: 'health-01-title',
    type: 'title',
    eyebrow: 'MEDICAL TECHNOLOGY & DIGITAL HEALTH',
    title: 'AI in Healthcare & Clinical Diagnostics',
    subtitle: 'Deep Learning Diagnostics, Algorithmic Precision Medicine, and Clinical Workflow Automation',
    author: 'Center for Health Informatics & Biomedical AI',
    date: 'August 2026',
    dark: true,
    slideNumber: 1,
    totalSlides: 10,
    image: titleRes.asset?.localPath,
    notes: `Title slide for AI in Healthcare presentation.${
      titleRes.attribution
        ? `\n\n[Image Credit: "${titleRes.attribution.title}" by ${titleRes.attribution.creator} (${titleRes.attribution.license}) - ${titleRes.attribution.sourceUrl}]`
        : ''
    }`,
  };

  // 2. Overview Slide (No Image)
  const slide2Data: OverviewSlideData = {
    id: 'health-02-overview',
    type: 'overview',
    eyebrow: 'PRESENTATION STRUCTURE',
    title: 'Clinical AI Integration Matrix',
    subtitle: 'Key technological domains and medical applications examined in this briefing.',
    agendaItems: [
      { number: '1', title: 'Diagnostic Vision', description: 'Convolutional networks in radiology, pathology, and dermatoscopy.', icon: 'Eye' },
      { number: '2', title: 'Workflow Evolution', description: 'Comparing traditional triage against AI-augmented clinical pathways.', icon: 'Scale' },
      { number: '3', title: 'EHR Analysis Flow', description: 'Natural language processing for unstructured medical records.', icon: 'FileText' },
      { number: '4', title: 'Deployment Pipeline', description: 'Four-stage FDA validation and safe hospital integration process.', icon: 'CheckCircle2' },
    ],
    slideNumber: 2,
    totalSlides: 10,
    notes: 'Overview slide outlining medical AI focus areas.',
  };

  // 3. Concept Slide (Concept Visual Image)
  const conceptPlan: VisualPlan = {
    type: 'photo',
    purpose: 'Medical scan diagnostic imaging display showing brain CT or MRI scan',
    relevanceQuery: 'radiology CT scan brain medical imaging diagnosis',
    placement: 'left',
    importance: 'primary',
    aspectRatio: 'portrait',
  };
  const conceptRes = await assetMgr.resolveImageForVisualPlan(conceptPlan, topic);
  if (conceptRes.asset) {
    imageLog.push({
      slideNum: 3,
      slideTitle: 'Multimodal Clinical Decision Support',
      role: 'Concept visual',
      source: conceptRes.asset.source,
      sourceUrl: conceptRes.asset.sourceUrl,
      title: conceptRes.asset.title,
      creator: conceptRes.asset.creator,
      license: conceptRes.asset.license,
      localPath: conceptRes.asset.localPath,
    });
  }

  const slide3Data: ConceptSlideData = {
    id: 'health-03-concept',
    type: 'concept',
    eyebrow: 'CLINICAL INFORMATICS FOUNDATIONS',
    title: 'Multimodal Clinical Decision Support (CDS)',
    subtitle: 'Synthesizing pixel-level imaging, genomics, and electronic health record streams.',
    image: conceptRes.asset?.localPath,
    mainConcept: {
      title: 'Multimodal Diagnostic Engine',
      description: 'An AI architecture combining computer vision on DICOM scans, transformer models on clinical notes, and genomic embeddings to output risk scores with explainable heatmaps.',
    },
    cards: [
      {
        icon: 'Search',
        title: 'Pixel-Level Pattern Recognition',
        body: 'Detects microcalcifications and subtle tissue densities invisible to standard visual inspection.',
      },
      {
        icon: 'ShieldCheck',
        title: 'Clinical Saliency Maps',
        body: 'Highlights exact image regions responsible for model predictions to ensure interpretability.',
      },
    ],
    slideNumber: 3,
    totalSlides: 10,
    notes: `Concept slide explaining multimodal clinical decision support architecture.${
      conceptRes.attribution
        ? `\n\n[Image Credit: "${conceptRes.attribution.title}" by ${conceptRes.attribution.creator} (${conceptRes.attribution.license}) - ${conceptRes.attribution.sourceUrl}]`
        : ''
    }`,
  };

  // 4. Comparison Slide (No Image)
  const slide4Data: ComparisonSlideData = {
    id: 'health-04-comparison',
    type: 'comparison',
    eyebrow: 'CLINICAL WORKFLOW ANALYSIS',
    title: 'Conventional Triage vs AI-Augmented Workflow',
    subtitle: 'Evaluating throughput, diagnostic turnaround times, and diagnostic fatigue.',
    leftPanel: {
      title: 'Conventional Emergency Triage',
      accentColor: 'gold',
      points: [
        'Sequential first-in-first-out radiology review queue',
        'Delayed diagnosis for emergent non-obvious acute cases',
        'High cognitive clinician fatigue during high-volume shifts',
        'Manual cross-referencing of legacy patient medical charts',
      ],
    },
    rightPanel: {
      title: 'AI-Prioritized Clinical Pathway',
      accentColor: 'blue',
      points: [
        'Automated pre-read triage prioritizing critical scans (e.g. stroke)',
        'Real-time anomaly alerts flagged in under 3 minutes',
        'Integrated diagnostic check acting as an attentive second reader',
        'Automatic synthesis of patient history and risk comorbidities',
      ],
    },
    slideNumber: 4,
    totalSlides: 10,
    notes: 'Comparison slide contrasting conventional triage with AI-augmented clinical pathways.',
  };

  // 5. Cause-Effect Slide (No Image)
  const slide5Data: CauseEffectSlideData = {
    id: 'health-05-cause-effect',
    type: 'cause-effect',
    eyebrow: 'DIAGNOSTIC MECHANISMS',
    title: 'Early Detection & Clinical Outcomes',
    subtitle: 'How automated early biomarker screening alters downstream patient prognosis.',
    causes: [
      { title: 'High-Throughput CT Screening', description: 'Automated nodule volumetric tracking across routine chest scans.' },
      { title: 'Subtle Biomarker Flagging', description: 'Algorithmic detection of early stage oncological and vascular anomalies.' },
    ],
    mechanism: 'Accelerating diagnostic confirmation from weeks to minutes enables immediate targeted therapy before metastasis or acute organ failure occurs.',
    effects: [
      { title: 'Improved 5-Year Survival Rates', description: 'Significantly higher recovery rates achieved through Stage 1 surgical resection.' },
      { title: 'Reduced ICU Hospitalizations', description: 'Lower emergency admissions and reduced total hospital length of stay.' },
    ],
    slideNumber: 5,
    totalSlides: 10,
    notes: 'Cause-effect slide linking algorithmic screening to improved patient outcomes.',
  };

  // 6. Process Slide (No Image)
  const slide6Data: ProcessSlideData = {
    id: 'health-06-process',
    type: 'process',
    eyebrow: 'IMPLEMENTATION WORKFLOW',
    title: 'Clinical AI Validation & Deployment',
    subtitle: 'Standardized 4-stage lifecycle for safe clinical machine learning integration.',
    steps: [
      { stepNumber: 1, title: 'Multi-Center Curation', description: 'Assemble diverse multi-site imaging datasets with blinded expert board consensus labels.', icon: 'Database' },
      { stepNumber: 2, title: 'Algorithm Calibration', description: 'Train deep models with adversarial robustness checks and demographic bias mitigation.', icon: 'Cpu' },
      { stepNumber: 3, title: 'Prospective Trial', description: 'Validate performance in double-blind clinical trials under real-world hospital conditions.', icon: 'CheckSquare' },
      { stepNumber: 4, title: 'EHR Integration', description: 'Deploy into hospital PACS/EHR systems via secure HL7/FHIR standardized interfaces.', icon: 'Activity' },
    ],
    slideNumber: 6,
    totalSlides: 10,
    notes: 'Process slide outlining FDA-style medical AI validation lifecycle.',
  };

  // 7. Table Slide with Chart & Takeaway (No Image)
  const slide7Data: TableSlideData = {
    id: 'health-07-table',
    type: 'table',
    eyebrow: 'CLINICAL BENCHMARKS (ILLUSTRATIVE TEST DATA)',
    title: 'Diagnostic Performance Metrics Across Modalities',
    subtitle: 'Comparative model evaluation metrics across imaging specialties (Illustrative test data).',
    headers: ['Clinical Modality', 'Target Pathology', 'Sensitivity*', 'Specificity*'],
    colWidths: [1.8, 2.3, 1.25, 1.25],
    rows: [
      ['Chest Radiography', 'Pneumothorax & Consolidation', '94.2%', '96.5%'],
      ['Brain Non-Contrast CT', 'Acute Intracranial Hemorrhage', '97.8%', '98.1%'],
      ['Digital Mammography', 'Invasive Ductal Carcinoma', '91.5%', '93.4%'],
      ['Fundus Photography', 'Diabetic Retinopathy (Proliferative)', '96.0%', '95.2%'],
    ],
    chartData: {
      chartType: 'bar',
      title: 'Sensitivity Benchmark (%) - Illustrative test data',
      labels: ['Chest X-Ray', 'Brain CT', 'Mammography', 'Fundus Photo'],
      values: [94.2, 97.8, 91.5, 96.0],
    },
    keyTakeaway: 'AI pre-triage models achieve clinical parity in screening triage (Illustrative test data).',
    slideNumber: 7,
    totalSlides: 10,
    notes: 'Table slide displaying comparative model performance metrics across 4 imaging modalities.',
  };

  // 8. Case Study Slide (Real-World Image)
  const caseStudyPlan: VisualPlan = {
    type: 'photo',
    purpose: 'Hospital emergency stroke treatment neuro intervention operating room',
    relevanceQuery: 'hospital emergency room clinical medicine healthcare patient',
    placement: 'right',
    importance: 'primary',
    aspectRatio: 'portrait',
  };
  const caseStudyRes = await assetMgr.resolveImageForVisualPlan(caseStudyPlan, topic);
  if (caseStudyRes.asset) {
    imageLog.push({
      slideNum: 8,
      slideTitle: 'Acute Stroke Triage AI Deployment',
      role: 'Case study photo',
      source: caseStudyRes.asset.source,
      sourceUrl: caseStudyRes.asset.sourceUrl,
      title: caseStudyRes.asset.title,
      creator: caseStudyRes.asset.creator,
      license: caseStudyRes.asset.license,
      localPath: caseStudyRes.asset.localPath,
    });
  }

  const slide8Data: CaseStudySlideData = {
    id: 'health-08-case-study',
    type: 'case-study',
    eyebrow: 'HOSPITAL SYSTEM CASE STUDY',
    title: 'Acute Stroke Triage AI Deployment',
    subtitle: 'Automating Large Vessel Occlusion (LVO) detection across a 12-hospital network.',
    image: caseStudyRes.asset?.localPath,
    context: 'Emergency department transfer delays for acute ischemic stroke patients previously averaged 68 minutes from initial CT scan to neuro-interventionist review.',
    challenge: 'Rapid time-to-treatment is critical ("time is brain"), but specialist neuro-radiologists were unavailable on-site at regional community spoke hospitals 24/7.',
    solution: 'Integrated cloud-based automated CT angiography LVO detection software that immediately notifies on-call surgical teams via encrypted mobile alerts.',
    result: 'Reduced median door-to-groin puncture time by 34 minutes, increasing positive 90-day functional recovery rates from 41% to 58%.',
    slideNumber: 8,
    totalSlides: 10,
    notes: `Case study slide documenting acute stroke triage automation.${
      caseStudyRes.attribution
        ? `\n\n[Image Credit: "${caseStudyRes.attribution.title}" by ${caseStudyRes.attribution.creator} (${caseStudyRes.attribution.license}) - ${caseStudyRes.attribution.sourceUrl}]`
        : ''
    }`,
  };

  // 9. Takeaways Slide (No Image)
  const slide9Data: KeyTakeawaysSlideData = {
    id: 'health-09-takeaways',
    type: 'takeaways',
    eyebrow: 'EXECUTIVE TAKEAWAYS',
    title: 'Core Principles for Healthcare AI',
    subtitle: 'Strategic requirements for clinicians, healthcare executives, and health system CIOs.',
    takeaways: [
      { number: 1, title: 'Clinician in the Loop', description: 'AI must augment expert human clinical judgment, serving as an assistive co-pilot rather than an autonomous decision maker.' },
      { number: 2, title: 'Demographic Generalizability', description: 'Models must be validated across diverse geographic cohorts to eliminate bias and performance disparities.' },
      { number: 3, title: 'Seamless Workflow Fit', description: 'Tools that require exiting the primary PACS/EHR interface suffer from low clinical adoption regardless of accuracy.' },
      { number: 4, title: 'Continuous Model Auditing', description: 'Post-deployment surveillance is essential to detect scanner protocol shifts, drift, and clinical edge cases.' },
    ],
    slideNumber: 9,
    totalSlides: 10,
    notes: 'Takeaways slide summarizing strategic rules for medical AI integration.',
  };

  // 10. Conclusion Slide (No Image)
  const slide10Data: ConclusionSlideData = {
    id: 'health-10-conclusion',
    type: 'conclusion',
    eyebrow: 'FUTURE OF MEDICINE',
    title: 'Transforming Patient Care Through Intelligent Systems',
    summaryText: 'Artificial intelligence is reshaping modern medicine by automating diagnostic triage, uncovering personalized disease pathways, and liberating clinicians from administrative burdens. Sustainable adoption balances algorithmic precision with ethical responsibility.',
    finalCallToAction: 'Pioneer Clinical Innovation — Deliver Better Healthcare Outcomes for All.',
    dark: true,
    slideNumber: 10,
    totalSlides: 10,
    notes: 'Conclusion slide synthesizing future horizons in clinical AI.',
  };

  const rawSlides = [
    slide1Data,
    slide2Data,
    slide3Data,
    slide4Data,
    slide5Data,
    slide6Data,
    slide7Data,
    slide8Data,
    slide9Data,
    slide10Data,
  ];

  return {
    slides: rawSlides.map((s) => renderSlide(s)),
    imageLog,
  };
}

// ============================================================================
// MAIN RUNNER
// ============================================================================
async function runStep10ImageVerification() {
  console.log('====================================================');
  console.log('  STEP 10 — REAL IMAGES IN ACTUAL SLIDES TEST');
  console.log('====================================================\n');

  const assetMgr = new AssetManager({ verbose: true });
  const outputsDir = path.resolve(__dirname, '..', 'outputs');
  const rendersDir = path.resolve(__dirname, '..', 'work', 'renders');
  if (!fs.existsSync(outputsDir)) fs.mkdirSync(outputsDir, { recursive: true });

  // -------------------------------------------------------------------------
  // 1. Generate Deck A: Climate Change and Agriculture
  // -------------------------------------------------------------------------
  console.log('--- GENERATING DECK A: Climate Change and Agriculture ---');
  assetMgr.resetScope();
  const deckA = await buildClimateAgricultureDeck(assetMgr);

  let presA = createPresentation('Climate Change & Agriculture', { author: 'Institute for Climate Resilient Agriculture' });
  for (const s of deckA.slides) {
    presA = addSlide(presA, s);
  }
  const pptxAPath = path.join(outputsDir, 'climate-agriculture-10-slide.pptx');
  await exportPresentation(presA, pptxAPath);
  console.log(`✔ Climate Agriculture PPTX: ${pptxAPath}`);

  const renderADir = path.join(rendersDir, 'climate-ag');
  console.log(`Rendering 10 PNGs into ${renderADir} ...`);
  const resultsA = await renderSlidesToPng(deckA.slides, renderADir);
  console.log(`✔ Rendered ${resultsA.length} PNGs for Climate Agriculture Deck`);
  const montageAPath = path.join(renderADir, 'deck-montage.webp');
  await createDeckMontage(resultsA, montageAPath);
  console.log(`✔ Montage generated: ${montageAPath}\n`);

  // -------------------------------------------------------------------------
  // 2. Generate Deck B: Artificial Intelligence in Healthcare
  // -------------------------------------------------------------------------
  console.log('--- GENERATING DECK B: Artificial Intelligence in Healthcare ---');
  assetMgr.resetScope();
  const deckB = await buildAiHealthcareDeck(assetMgr);

  let presB = createPresentation('AI in Healthcare & Clinical Diagnostics', { author: 'Center for Health Informatics & Biomedical AI' });
  for (const s of deckB.slides) {
    presB = addSlide(presB, s);
  }
  const pptxBPath = path.join(outputsDir, 'ai-healthcare-10-slide.pptx');
  await exportPresentation(presB, pptxBPath);
  console.log(`✔ AI Healthcare PPTX: ${pptxBPath}`);

  const renderBDir = path.join(rendersDir, 'ai-health');
  console.log(`Rendering 10 PNGs into ${renderBDir} ...`);
  const resultsB = await renderSlidesToPng(deckB.slides, renderBDir);
  console.log(`✔ Rendered ${resultsB.length} PNGs for AI Healthcare Deck`);
  const montageBPath = path.join(renderBDir, 'deck-montage.webp');
  await createDeckMontage(resultsB, montageBPath);
  console.log(`✔ Montage generated: ${montageBPath}\n`);

  // -------------------------------------------------------------------------
  // SUMMARY LOG
  // -------------------------------------------------------------------------
  console.log('====================================================');
  console.log('  STEP 10 IMAGE INTEGRATION SUMMARY');
  console.log('====================================================');
  console.log('\n[Deck A: Climate Change and Agriculture]');
  deckA.imageLog.forEach((img) => {
    console.log(`  Slide ${img.slideNum} (${img.role}): "${img.title}"`);
    console.log(`    Source: ${img.source} | License: ${img.license} | Creator: ${img.creator}`);
    console.log(`    Cached Local Path: ${img.localPath}`);
  });

  console.log('\n[Deck B: AI in Healthcare]');
  deckB.imageLog.forEach((img) => {
    console.log(`  Slide ${img.slideNum} (${img.role}): "${img.title}"`);
    console.log(`    Source: ${img.source} | License: ${img.license} | Creator: ${img.creator}`);
    console.log(`    Cached Local Path: ${img.localPath}`);
  });

  console.log('\n====================================================');
  console.log('  STEP 10 EXECUTION COMPLETE');
  console.log('====================================================\n');
}

if (require.main === module) {
  runStep10ImageVerification().catch((err) => {
    console.error('Fatal Error during Step 10 execution:', err);
    process.exit(1);
  });
}
