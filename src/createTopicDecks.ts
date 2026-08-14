/**
 * Step 7 — Topic Decks Generator
 *
 * Implements 10-slide decks for:
 *   1. Climate Change and Planetary Resilience
 *   2. Artificial Intelligence in Modern Healthcare
 *
 * Archetype Flow:
 *   1. title
 *   2. overview
 *   3. concept
 *   4. comparison
 *   5. cause-effect
 *   6. process
 *   7. statistics / table (with "Illustrative test data")
 *   8. case-study
 *   9. takeaways
 *   10. conclusion
 */

import {
  createPresentation,
  addSlide,
  exportPresentation,
} from './core/presentation';
import { renderSlide } from './slides/registry';
import { SlideData } from './slides/types';
import { defaultTheme } from './design/theme';

const t = defaultTheme;

// ============================================================================
// TOPIC 1: Climate Change and Planetary Resilience (10 Slides)
// ============================================================================
export const climate10SlideDeckData: SlideData[] = [
  // 1. Title
  {
    id: 'climate-01-title',
    type: 'title',
    eyebrow: 'CLIMATE SCIENCE & SUSTAINABILITY',
    title: 'Climate Change & Planetary Resilience',
    subtitle: 'Assessing Global Warming Vectors, Ecological Feedbacks, and Decarbonization Pathways',
    author: 'Institute for Global Climate Studies',
    date: 'August 2026',
    dark: true,
    slideNumber: 1,
    totalSlides: 10,
    notes: 'Title slide for Climate Change and Planetary Resilience briefing.',
  },

  // 2. Overview (Agenda)
  {
    id: 'climate-02-overview',
    type: 'overview',
    eyebrow: 'AGENDA & ROADMAP',
    title: 'Climate Analysis & Mitigation Roadmap',
    subtitle: 'Strategic topics covered in this planetary health briefing.',
    agendaItems: [
      { number: '1', title: 'Atmospheric Physics', description: 'Radiative forcing and greenhouse gas warming mechanics.', icon: 'Sun' },
      { number: '2', title: 'Transition Pathways', description: 'Comparing fossil legacy systems against renewable energy grids.', icon: 'Scale' },
      { number: '3', title: 'Feedback Loops', description: 'Cause-and-effect cascade of Arctic albedo loss and permafrost thaw.', icon: 'RefreshCw' },
      { number: '4', title: 'Decarbonization Workflow', description: 'Systematic 4-phase transition to net-zero industrial emissions.', icon: 'CheckCircle2' },
    ],
    slideNumber: 2,
    totalSlides: 10,
    notes: 'Overview slide covering key sections of the climate deck.',
  },

  // 3. Concept
  {
    id: 'climate-03-concept',
    type: 'concept',
    eyebrow: 'CLIMATE SCIENCE FOUNDATIONS',
    title: 'Radiative Forcing & Thermal Equilibrium',
    subtitle: 'How atmospheric greenhouse gas concentrations trap outgoing longwave radiation.',
    mainConcept: {
      title: 'Radiative Forcing (ΔF in W/m²)',
      description: 'The net change in the Earth’s energy balance caused by external climate drivers. Anthropogenic emissions create positive forcing, trapping surplus thermal energy in oceans and troposphere.',
    },
    cards: [
      {
        icon: 'CloudRain',
        title: 'Atmospheric Residence Time',
        body: 'CO2 remains active in the atmosphere for centuries, creating long-term committed warming even after emissions cease.',
      },
      {
        icon: 'Waves',
        title: 'Ocean Heat Uptake',
        body: 'Over 90% of excess planetary heat is absorbed by oceans, accelerating thermal expansion and marine heatwaves.',
      },
    ],
    slideNumber: 3,
    totalSlides: 10,
    notes: 'Concept slide defining radiative forcing and ocean heat uptake.',
  },

  // 4. Comparison
  {
    id: 'climate-04-comparison',
    type: 'comparison',
    eyebrow: 'ENERGY TRANSITION MATRIX',
    title: 'Fossil Energy Legacy vs Renewable Grid',
    subtitle: 'Evaluating structural differences in carbon intensity, resilience, and levelized cost.',
    leftPanel: {
      title: 'Fossil-Fuel Legacy Grids',
      points: [
        'High direct combustion CO2 and methane leakage emissions',
        'Centralized vulnerable thermoelectric generation nodes',
        'Exposure to volatile global hydrocarbon market prices',
        'Water-intensive cooling cycles creating localized thermal stress',
      ],
      accentColor: t.colors.red,
    },
    rightPanel: {
      title: 'Decarbonized Renewable Systems',
      points: [
        'Zero direct operational greenhouse gas emissions',
        'Distributed solar, wind, and battery storage topologies',
        'Lowest levelized cost of electricity (LCOE) globally',
        'Minimal operational freshwater withdrawal requirements',
      ],
      accentColor: t.colors.teal,
    },
    slideNumber: 4,
    totalSlides: 10,
    notes: 'Comparison slide contrasting fossil and renewable energy topologies.',
  },

  // 5. Cause-Effect
  {
    id: 'climate-05-cause-effect',
    type: 'cause-effect',
    eyebrow: 'BIOSPHERE FEEDBACK MECHANISMS',
    title: 'Cryosphere Loss & Arctic Feedbacks',
    subtitle: 'How rising temperatures trigger amplifying positive climate feedback loops.',
    causes: [
      { title: 'Elevated Surface Temperatures', description: 'Accelerated thermal anomalies in high-latitude polar regions.' },
      { title: 'Sea Ice & Glacial Retreat', description: 'Melting sea ice exposing dark ocean water with lower albedo.' },
    ],
    mechanism: 'Lower surface reflectivity absorbs greater solar radiation, warming polar waters and releasing sequestered methane from thawing sub-arctic permafrost.',
    effects: [
      { title: 'Albedo Feedback Amplification', description: 'Additional heat absorption further accelerating polar ice cap melt rates.' },
      { title: 'Global Sea Level Rise', description: 'Thermal water expansion and continental ice mass runoff inundating coastlines.' },
    ],
    slideNumber: 5,
    totalSlides: 10,
    notes: 'Cause-effect slide detailing Arctic albedo and permafrost feedback loops.',
  },

  // 6. Process
  {
    id: 'climate-06-process',
    type: 'process',
    eyebrow: 'DECARBONIZATION BLUEPRINT',
    title: 'Enterprise Decarbonization Framework',
    subtitle: 'Sequential 4-stage operational pathway toward verified net-zero operations.',
    steps: [
      { stepNumber: 1, title: 'Emissions Audit', description: 'Measure comprehensive Scope 1, 2, and 3 emissions footprints using standardized GHG protocols.', icon: 'Search' },
      { stepNumber: 2, title: 'Efficiency Retrofit', description: 'Deploy building electrification, industrial heat pumps, and automated smart energy controls.', icon: 'Zap' },
      { stepNumber: 3, title: 'Renewable Power PPA', description: 'Contract dedicated long-term off-site solar and wind power purchase agreements.', icon: 'Sun' },
      { stepNumber: 4, title: 'Residual Removal', description: 'Neutralize unavoidable emissions with durable high-integrity carbon removal credits.', icon: 'Award' },
    ],
    slideNumber: 6,
    totalSlides: 10,
    notes: 'Process slide outlining enterprise emissions reduction phases.',
  },

  // 7. Statistics / Table (with Illustrative Test Data)
  {
    id: 'climate-07-statistics',
    type: 'statistics',
    eyebrow: 'CLEAN TECH BENCHMARKS (ILLUSTRATIVE TEST DATA)',
    title: 'Decarbonization Sector Benchmarks',
    subtitle: 'Observed clean technology cost reductions and deployment metrics (Illustrative test data).',
    metrics: [
      { number: '-88%', label: 'Solar PV LCOE (Illustrative)', explanation: 'Illustrative test data: Cost reduction in utility-scale photovoltaic generation over the last decade.' },
      { number: '3.2x', label: 'Storage Capacity Multiple', explanation: 'Illustrative test data: Expansion in grid-scale battery storage installations over a 5-year cycle.' },
      { number: '450 GW', label: 'Annual Additions (Illustrative)', explanation: 'Illustrative test data: Global renewable generation capacity commissioned annually worldwide.' },
    ],
    slideNumber: 7,
    totalSlides: 10,
    notes: 'Statistics slide with clear illustrative test data labels.',
  },

  // 8. Case Study
  {
    id: 'climate-08-case-study',
    type: 'case-study',
    eyebrow: 'REGIONAL IMPLEMENTATION',
    title: 'Regional Grid Island Decarbonization',
    subtitle: 'Transitioning a coastal archipelago from diesel generation to 100% renewables.',
    context: 'An isolated archipelago relied exclusively on imported diesel fuel for electricity, incurring volatile costs and high carbon emissions.',
    challenge: 'Grid instability, intermittent solar/wind generation, and extreme maritime hurricane vulnerability.',
    solution: 'Engineered a unified hybrid microgrid pairing 45 MW solar PV, offshore wind, and a 60 MWh lithium iron phosphate battery energy storage system (BESS).',
    result: 'Achieved 98.4% annual renewable power penetration, eliminated 85,000 tons of CO2 annually, and lowered wholesale electricity costs by 42%.',
    slideNumber: 8,
    totalSlides: 10,
    notes: 'Case study showcasing successful island microgrid decarbonization.',
  },

  // 9. Takeaways
  {
    id: 'climate-09-takeaways',
    type: 'takeaways',
    eyebrow: 'EXECUTIVE SUMMARY',
    title: 'Key Principles for Climate Action',
    subtitle: 'Foundational insights for strategic environmental and corporate decision-makers.',
    takeaways: [
      { number: 1, title: 'Speed Over Perfection', description: 'Immediate deployment of existing mature technologies yields higher cumulative emission savings than waiting for experimental solutions.' },
      { number: 2, title: 'Electrify Everything', description: 'Switching transport, heating, and industrial processes to clean electricity is the most direct decarbonization route.' },
      { number: 3, title: 'Resilience By Design', description: 'Infrastructure must be engineered for extreme precipitation, heatwaves, and sea-level variability already locked in.' },
      { number: 4, title: 'Ecosystem Restoration', description: 'Protecting natural coastal wetlands and peatlands provides cost-effective buffer capacity against climate extremes.' },
    ],
    slideNumber: 9,
    totalSlides: 10,
    notes: 'Takeaways slide highlighting key principles for climate action.',
  },

  // 10. Conclusion
  {
    id: 'climate-10-conclusion',
    type: 'conclusion',
    eyebrow: 'VISION & COMMITMENT',
    title: 'Accelerating the Net-Zero Transition',
    subtitle: 'Uniting innovation, policy, and capital for a resilient planetary future.',
    summaryText: 'The transition to a net-zero economy represents both a planetary imperative and the largest technological modernization opportunity of our era. By deploying clean technologies, safeguarding natural biomes, and adopting regenerative practices, global resilience can be secured.',
    finalCallToAction: 'Commit to Bold Climate Action — Build a Decarbonized World.',
    dark: true,
    slideNumber: 10,
    totalSlides: 10,
    notes: 'Conclusion slide inspiring strategic climate commitment.',
  },
];

// ============================================================================
// TOPIC 2: Artificial Intelligence in Modern Healthcare (10 Slides)
// ============================================================================
export const aiHealthcare10SlideDeckData: SlideData[] = [
  // 1. Title
  {
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
    notes: 'Title slide for AI in Healthcare presentation.',
  },

  // 2. Overview (Agenda)
  {
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
  },

  // 3. Concept
  {
    id: 'health-03-concept',
    type: 'concept',
    eyebrow: 'CLINICAL INFORMATICS FOUNDATIONS',
    title: 'Multimodal Clinical Decision Support (CDS)',
    subtitle: 'Synthesizing pixel-level imaging, genomics, and electronic health record streams.',
    mainConcept: {
      title: 'Multimodal Diagnostic Engine',
      description: 'An AI architecture combining computer vision on DICOM scans, transformer models on clinical notes, and genomic embeddings to output risk scores with explainable feature heatmaps.',
    },
    cards: [
      {
        icon: 'Search',
        title: 'Pixel-Level Pattern Recognition',
        body: 'Detects microcalcifications and subtle tissue densities invisible to standard human visual inspection.',
      },
      {
        icon: 'ShieldCheck',
        title: 'Clinical Saliency Maps',
        body: 'Highlights exact image regions responsible for model predictions to ensure clinician interpretability.',
      },
    ],
    slideNumber: 3,
    totalSlides: 10,
    notes: 'Concept slide explaining multimodal clinical decision support architecture.',
  },

  // 4. Comparison
  {
    id: 'health-04-comparison',
    type: 'comparison',
    eyebrow: 'CLINICAL WORKFLOW ANALYSIS',
    title: 'Conventional Triage vs AI-Augmented Workflow',
    subtitle: 'Evaluating throughput, diagnostic turnaround times, and diagnostic fatigue.',
    leftPanel: {
      title: 'Conventional Emergency Triage',
      points: [
        'Sequential first-in-first-out radiology review queue',
        'Delayed diagnosis for emergent non-obvious acute cases',
        'High cognitive clinician fatigue during high-volume shifts',
        'Manual cross-referencing of legacy patient medical charts',
      ],
      accentColor: t.colors.red,
    },
    rightPanel: {
      title: 'AI-Prioritized Clinical Pathway',
      points: [
        'Automated pre-read triage prioritizing critical scans (e.g. stroke)',
        'Real-time anomaly alerts flagged in under 3 minutes',
        'Integrated diagnostic check acting as an attentive second reader',
        'Automatic synthesis of patient history and risk comorbidities',
      ],
      accentColor: t.colors.teal,
    },
    slideNumber: 4,
    totalSlides: 10,
    notes: 'Comparison slide contrasting conventional triage with AI-assisted emergency workflows.',
  },

  // 5. Cause-Effect
  {
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
  },

  // 6. Process
  {
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
  },

  // 7. Table (with Illustrative Test Data)
  {
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
    notes: 'Table and chart slide demonstrating diagnostic performance with illustrative data.',
  },

  // 8. Case Study
  {
    id: 'health-08-case-study',
    type: 'case-study',
    eyebrow: 'HOSPITAL SYSTEM CASE STUDY',
    title: 'Acute Stroke Triage AI Deployment',
    subtitle: 'Automating Large Vessel Occlusion (LVO) detection across a 12-hospital network.',
    context: 'Emergency department transfer delays for acute ischemic stroke patients previously averaged 68 minutes from initial CT scan to neuro-interventionist review.',
    challenge: 'Rapid time-to-treatment is critical ("time is brain"), but specialist neuro-radiologists were unavailable on-site at regional community spoke hospitals 24/7.',
    solution: 'Integrated cloud-based automated CT angiography LVO detection software that immediately notifies on-call surgical teams via encrypted mobile alerts.',
    result: 'Reduced median door-to-groin puncture time by 34 minutes, increasing positive 90-day functional recovery rates from 41% to 58%.',
    slideNumber: 8,
    totalSlides: 10,
    notes: 'Case study on acute stroke workflow optimization across regional hospitals.',
  },

  // 9. Takeaways
  {
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
    notes: 'Takeaways slide highlighting key principles for healthcare AI deployment.',
  },

  // 10. Conclusion
  {
    id: 'health-10-conclusion',
    type: 'conclusion',
    eyebrow: 'FUTURE OF MEDICINE',
    title: 'Transforming Patient Care Through Intelligent Systems',
    subtitle: 'Uniting artificial intelligence with compassionate, patient-centered clinical practice.',
    summaryText: 'Artificial intelligence is reshaping modern medicine by automating diagnostic triage, uncovering personalized disease pathways, and liberating clinicians from administrative burdens. Sustainable adoption balances algorithmic precision with ethical responsibility.',
    finalCallToAction: 'Pioneer Clinical Innovation — Deliver Better Healthcare Outcomes for All.',
    dark: true,
    slideNumber: 10,
    totalSlides: 10,
    notes: 'Conclusion slide summarizing the future impact of medical AI.',
  },
];

// ============================================================================
// GENERATOR FUNCTIONS
// ============================================================================
export async function generateClimateDeck(outputPath: string): Promise<string> {
  let pres = createPresentation('Climate Change & Planetary Resilience', {
    author: 'Institute for Global Climate Studies',
    canvas: {
      width: t.canvas.widthInches,
      height: t.canvas.heightInches,
      aspectRatio: t.canvas.aspectRatio,
    },
  });

  for (const slideData of climate10SlideDeckData) {
    const slideDef = renderSlide(slideData);
    pres = addSlide(pres, slideDef);
  }

  return await exportPresentation(pres, outputPath);
}

export async function generateAiHealthcareDeck(outputPath: string): Promise<string> {
  let pres = createPresentation('AI in Healthcare & Clinical Diagnostics', {
    author: 'Center for Health Informatics & Biomedical AI',
    canvas: {
      width: t.canvas.widthInches,
      height: t.canvas.heightInches,
      aspectRatio: t.canvas.aspectRatio,
    },
  });

  for (const slideData of aiHealthcare10SlideDeckData) {
    const slideDef = renderSlide(slideData);
    pres = addSlide(pres, slideDef);
  }

  return await exportPresentation(pres, outputPath);
}
