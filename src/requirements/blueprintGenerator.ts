/**
 * STEP 25, 26 & 30 — UNIVERSAL TOPIC BLUEPRINT & STORY ENGINE
 *
 * Generates an end-to-end presentation blueprint dividing the deck into
 * 4 logical sections and assigning explicit narrative sequences, data/visual intents,
 * speaker notes guidance, and source linkages to every single slide.
 */

import { UniversalTopicContext } from '../core/topicContext';
import {
  PresentationRequirements,
  PresentationBlueprint,
  SectionBlueprint,
  SlideBlueprint,
} from './requirementTypes';
import { SourceRegistry } from '../research/sourceTypes';
import { DataSpec } from '../data/dataTypes';

interface SlidePlanTemplate {
  slideNumber: number;
  archetype: string;
  title: string;
  purpose: string;
  keyQuestion: string;
  keyMessage: string;
  dataIntent: 'none' | 'chart' | 'table' | 'statistics';
  visualIntent: 'none' | 'hero-photo' | 'concept-diagram' | 'process-workflow' | 'case-photo';
}

export function createPresentationBlueprint(
  req: PresentationRequirements,
  ctx: UniversalTopicContext,
  registry: SourceRegistry,
  dataSpecs: DataSpec[]
): PresentationBlueprint {
  const { domain, normalizedTitle } = ctx;
  const slideCount = req.slideCount || 10;

  // 1. Define 4 Logical Sections
  let sections: SectionBlueprint[] = [];
  let slidePlans: SlidePlanTemplate[] = [];

  switch (domain) {
    case 'climate-environment':
      sections = [
        { sectionNumber: 1, title: 'Atmospheric Dynamics & Forcing', purpose: 'Establish physical and chemical mechanics of radiative forcing and climate instability.', slideNumbers: [1, 2, 3] },
        { sectionNumber: 2, title: 'Decarbonization Pathways & Energy Transition', purpose: 'Map technical workflows and energy system transitions from fossil to renewables.', slideNumbers: [4, 5] },
        { sectionNumber: 3, title: 'Empirical Climate Data & Mitigation Targets', purpose: 'Present peer-reviewed planetary indicators and sectoral emissions abatement benchmarks.', slideNumbers: [6, 7] },
        { sectionNumber: 4, title: 'Field Deployment & Strategic Synthesis', purpose: 'Examine utility-scale clean transition case studies and high-leverage policy directives.', slideNumbers: [8, 9, 10] },
      ];
      slidePlans = [
        { slideNumber: 1, archetype: 'title', title: 'Global Warming & Climate Resilience', purpose: 'Title and executive scope of climate destabilization and decarbonization.', keyQuestion: 'What is the scale of anthropogenic climate change?', keyMessage: 'Human greenhouse gas emissions have initiated global planetary shifts requiring rapid decarbonization.', dataIntent: 'none', visualIntent: 'hero-photo' },
        { slideNumber: 2, archetype: 'overview', title: 'Earth System Science & Atmospheric Energy Balance', purpose: 'Explain solar radiation absorption and greenhouse thermal trapping mechanics.', keyQuestion: 'How do greenhouse gases trap thermal energy in the troposphere?', keyMessage: 'Increased CO2, CH4, and N2O trap outgoing infrared radiation, breaking thermal equilibrium.', dataIntent: 'none', visualIntent: 'none' },
        { slideNumber: 3, archetype: 'concept', title: 'Anthropogenic Carbon Budget & Trajectories', purpose: 'Examine atmospheric carbon ppm concentrations and net-zero timelines.', keyQuestion: 'What carbon budget remains to stay under 1.5°C warming?', keyMessage: 'Reaching net-zero by 2050 is required to prevent irreversible ecological tipping points.', dataIntent: 'none', visualIntent: 'concept-diagram' },
        { slideNumber: 4, archetype: 'process', title: 'The Decarbonization & Clean Energy Transition Lifecycle', purpose: 'Detail the 4-phase technical roadmap from efficiency to grid integration.', keyQuestion: 'What sequential phases are required to decarbonize the energy grid?', keyMessage: 'Systemic transition requires efficiency, renewable generation, grid storage, and industrial electrification.', dataIntent: 'none', visualIntent: 'process-workflow' },
        { slideNumber: 5, archetype: 'comparison', title: 'Fossil Energy vs Renewable Electrification', purpose: 'Contrast centralized combustion grids with distributed solar/wind infrastructure.', keyQuestion: 'How does renewable power compare in lifecycle emissions and marginal cost?', keyMessage: 'Renewables provide zero-marginal cost electricity with 95% lower lifecycle carbon emissions.', dataIntent: 'none', visualIntent: 'none' },
        { slideNumber: 6, archetype: 'statistics', title: 'Empirical Cryospheric & Oceanic Indicators', purpose: 'Present verified NOAA/IPCC planetary warming and sea ice decline metrics.', keyQuestion: 'What empirical indicators prove current climate trajectory?', keyMessage: 'A 1.2°C anomaly, 13% decadal sea ice decline, and 3.4 mm/yr sea rise demonstrate accelerated warming.', dataIntent: 'statistics', visualIntent: 'none' },
        { slideNumber: 7, archetype: 'table', title: 'Sectoral Mitigation Benchmarks & Abatement Matrix', purpose: 'Deliver structured abatement potential across power, industry, and transport.', keyQuestion: 'Which industrial sectors offer the highest carbon mitigation leverage?', keyMessage: 'Power and industrial heat account for over 55% of global mitigation opportunity.', dataIntent: 'table', visualIntent: 'none' },
        { slideNumber: 8, archetype: 'case-study', title: 'Utility-Scale Clean Grid Transformation (Offshore Wind)', purpose: 'Analyze commercial offshore wind and battery storage deployment.', keyQuestion: 'How do utility-scale wind farms perform in grid decarbonization?', keyMessage: 'Offshore wind installations displace 1.5M tons of CO2 annually while delivering 99.8% grid reliability.', dataIntent: 'none', visualIntent: 'case-photo' },
        { slideNumber: 9, archetype: 'takeaways', title: 'Strategic Climate Policy & International Directives', purpose: 'Outline executive policy mandates, carbon pricing, and infrastructure adaptation.', keyQuestion: 'What strategic policy levers must leadership enact immediately?', keyMessage: 'Mandating carbon borders, accelerating clean permitting, and grid modernization are non-negotiable.', dataIntent: 'none', visualIntent: 'none' },
        { slideNumber: 10, archetype: 'conclusion', title: 'Securing a Climate-Resilient Planet', purpose: 'Synthesize global net-zero commitments and planetary stewardship vision.', keyQuestion: 'What is the long-term vision for climate resilience?', keyMessage: 'Coordinated global decarbonization protects ecological stability and long-term socio-economic prosperity.', dataIntent: 'none', visualIntent: 'none' },
      ];
      break;

    case 'biotechnology-botany':
      sections = [
        { sectionNumber: 1, title: 'Cellular Totipotency & Physiological Foundations', purpose: 'Introduce aseptic in-vitro principles and hormonal regulation of plant cell differentiation.', slideNumbers: [1, 2, 3] },
        { sectionNumber: 2, title: 'Four-Stage Micropropagation & Clonal Protocols', purpose: 'Detail sequential sterile stages and contrast in-vitro cloning with conventional seed propagation.', slideNumbers: [4, 5] },
        { sectionNumber: 3, title: 'Multiplication Yields & Stage Performance', purpose: 'Deliver empirical survival metrics, virus eradication benchmarks, and growth media formulations.', slideNumbers: [6, 7] },
        { sectionNumber: 4, title: 'Commercial Bioreactor Scaling & Directives', purpose: 'Evaluate commercial plantation deployments, disease resistance, and laboratory QC guidelines.', slideNumbers: [8, 9, 10] },
      ];
      slidePlans = [
        { slideNumber: 1, archetype: 'title', title: 'Plant Tissue Culture & Micropropagation', purpose: 'Title and executive scope of plant in-vitro cloning and biotechnology.', keyQuestion: 'What is in-vitro plant tissue culture?', keyMessage: 'Aseptic micropropagation enables clonal multiplication of true-to-type, pathogen-free elite crops.', dataIntent: 'none', visualIntent: 'hero-photo' },
        { slideNumber: 2, archetype: 'overview', title: 'Cellular Totipotency & Physiological Foundations', purpose: 'Establish Gottlieb Haberlandt principle of totipotency and cellular competence.', keyQuestion: 'How can a single somatic plant cell regenerate a complete fertile plant?', keyMessage: 'Plant cells retain complete genomic plasticity and can dedifferentiate upon hormonal stimulation.', dataIntent: 'none', visualIntent: 'none' },
        { slideNumber: 3, archetype: 'concept', title: 'Aseptic In-Vitro Media & Nutrient Chemistry', purpose: 'Detail Murashige & Skoog (MS) media, macronutrients, sucrose, and agar matrix.', keyQuestion: 'What chemical micro-environment is required for in-vitro growth?', keyMessage: 'Optimized MS basal salts, 3% sucrose carbon source, vitamins, and pH 5.7 sustain in-vitro morphogenesis.', dataIntent: 'none', visualIntent: 'concept-diagram' },
        { slideNumber: 4, archetype: 'process', title: 'Four-Stage Micropropagation Lifecycle', purpose: 'Map sequential stages from explant isolation to greenhouse acclimatization.', keyQuestion: 'What are the 4 standardized stages of commercial micropropagation?', keyMessage: 'Explant sterilization → In-vitro establishment → Shoot proliferation → Rooting and hardening.', dataIntent: 'none', visualIntent: 'process-workflow' },
        { slideNumber: 5, archetype: 'comparison', title: 'Auxin vs Cytokinin Hormonal Morphogenesis', purpose: 'Contrast high cytokinin/auxin shoot induction with high auxin/cytokinin root induction.', keyQuestion: 'How does the auxin-to-cytokinin ratio control organogenesis?', keyMessage: 'High cytokinin triggers shoot bud formation; high auxin triggers adventitious rooting.', dataIntent: 'none', visualIntent: 'none' },
        { slideNumber: 6, archetype: 'statistics', title: 'Contamination Control & Virus Eradication', purpose: 'Present empirical validation for 98.5% virus-free meristem culture.', keyQuestion: 'How effectively does apical meristem culture eliminate plant viruses?', keyMessage: 'Meristem isolation combined with thermotherapy eradicates systemic pathogens with 98.5% efficacy.', dataIntent: 'statistics', visualIntent: 'none' },
        { slideNumber: 7, archetype: 'table', title: 'Growth Stage Performance & Hormonal Formulations', purpose: 'Deliver structured performance matrix across initiation, proliferation, and rooting.', keyQuestion: 'What hormonal formulations maximize clonal multiplication indices?', keyMessage: 'Optimizing BAP (2.0 mg/L) and IBA (1.5 mg/L) delivers a 25x multiplication index and 86% hardening survival.', dataIntent: 'table', visualIntent: 'none' },
        { slideNumber: 8, archetype: 'case-study', title: 'Commercial Clonal Banana & Orchid Mass Production', purpose: 'Analyze commercial facility producing 5M disease-free plantlets per year.', keyQuestion: 'How does automated bioreactor micropropagation scale in commercial agriculture?', keyMessage: 'Delivers 100% disease-free planting stock, increasing commercial crop yields by 38%.', dataIntent: 'none', visualIntent: 'case-photo' },
        { slideNumber: 9, archetype: 'takeaways', title: 'Genetic Fidelity & Laboratory QC Directives', purpose: 'Outline SSR marker screening, laminar flow sterility, and somaclonal variation prevention.', keyQuestion: 'What quality protocols prevent genetic drift in commercial tissue culture?', keyMessage: 'PCR-based molecular screening and strict subculture limits guarantee trueness-to-type.', dataIntent: 'none', visualIntent: 'none' },
        { slideNumber: 10, archetype: 'conclusion', title: 'Scaling Botanical Biotechnology & Agriculture', purpose: 'Synthesize germplasm preservation, automated bioreactors, and global food security.', keyQuestion: 'What is the future outlook for agricultural micropropagation?', keyMessage: 'Automated in-vitro bioreactors and cryopreservation safeguard biodiversity and global food supply.', dataIntent: 'none', visualIntent: 'none' },
      ];
      break;

    case 'law-governance':
      sections = [
        { sectionNumber: 1, title: 'Constitutional Genesis & Sovereign Philosophy', purpose: 'Establish the Constituent Assembly drafting process, historical background, and Preamble philosophy.', slideNumbers: [1, 2, 3] },
        { sectionNumber: 2, title: 'Legislative Mechanics & Rights vs Directive Harmonization', purpose: 'Detail Article 368 amendment procedures and contrast Fundamental Rights with Directive Principles.', slideNumbers: [4, 5] },
        { sectionNumber: 3, title: 'Institutional Dimensions & Judicial Remedies', purpose: 'Present structural constitutional metrics and Article 32 prerogative writ enforceability.', slideNumbers: [6, 7] },
        { sectionNumber: 4, title: 'Landmark Jurisprudence & Democratic Synthesis', purpose: 'Analyze Kesavananda Bharati Basic Structure doctrine, federal governance, and democratic endurance.', slideNumbers: [8, 9, 10] },
      ];
      slidePlans = [
        { slideNumber: 1, archetype: 'title', title: 'The Constitution of India', purpose: 'Title and scope of Indian constitutionalism, preamble philosophy, and democratic governance.', keyQuestion: 'What are the foundational pillars of Indian constitutional law?', keyMessage: 'The Constitution of India establishes a sovereign, socialist, secular, democratic republic based on rule of law.', dataIntent: 'none', visualIntent: 'hero-photo' },
        { slideNumber: 2, archetype: 'overview', title: 'Historical Genesis & The Constituent Assembly', purpose: 'Detail the 1946–1949 drafting process, Dr. Ambedkar drafting committee, and adoption on 26 Nov 1949.', keyQuestion: 'How was the Constitution of India drafted and adopted?', keyMessage: 'Drafted over 2 years, 11 months, and 18 days by the Constituent Assembly under Dr. B.R. Ambedkar leadership.', dataIntent: 'none', visualIntent: 'none' },
        { slideNumber: 3, archetype: 'concept', title: 'Philosophy of the Preamble & Sovereign Values', purpose: 'Examine Justice, Liberty, Equality, Fraternity and the Basic Structure of democracy.', keyQuestion: 'What core values guide constitutional interpretation in India?', keyMessage: 'The Preamble embodies the soul of the Constitution, declaring justice, liberty, equality, and fraternity.', dataIntent: 'none', visualIntent: 'concept-diagram' },
        { slideNumber: 4, archetype: 'process', title: 'Constitutional Amendment Procedure (Article 368)', purpose: 'Explain the procedural stages for amending constitutional provisions.', keyQuestion: 'How does Article 368 balance constitutional flexibility with structural rigidity?', keyMessage: 'Standard provisions require special parliamentary majorities; federal provisions require state ratifications.', dataIntent: 'none', visualIntent: 'process-workflow' },
        { slideNumber: 5, archetype: 'comparison', title: 'Fundamental Rights vs Directive Principles', purpose: 'Contrast justiciable civil liberties (Part III) with socio-economic welfare goals (Part IV).', keyQuestion: 'How do justiciable rights harmonize with non-justiciable directive principles?', keyMessage: 'Fundamental Rights protect civil freedom from state intrusion; Directive Principles guide state welfare action.', dataIntent: 'none', visualIntent: 'none' },
        { slideNumber: 6, archetype: 'statistics', title: 'Codified Dimensions & Institutional Metrics', purpose: 'Deliver quantitative parameters: 448 Articles, 25 Parts, 106 Amendments, 5 Writs.', keyQuestion: 'What structural dimensions define the Indian Constitution?', keyMessage: '448 articles across 25 parts and 106 amendments make it the most comprehensive democratic charter.', dataIntent: 'statistics', visualIntent: 'none' },
        { slideNumber: 7, archetype: 'table', title: 'Fundamental Rights Categories & Enforceability Framework', purpose: 'Present structured 4-column matrix of rights categories and Article 32 writ remedies.', keyQuestion: 'How are constitutional rights categorized and judicially enforced?', keyMessage: 'Articles 14–32 guarantee fundamental rights protected by direct Supreme Court writ jurisdiction.', dataIntent: 'table', visualIntent: 'none' },
        { slideNumber: 8, archetype: 'case-study', title: 'Kesavananda Bharati (1973) Landmark Ruling', purpose: 'Analyze the 13-judge constitutional bench establishing the Basic Structure Doctrine.', keyQuestion: 'How did the Supreme Court protect democracy from unlimited parliamentary amendment power?', keyMessage: 'Ruled that Article 368 does not enable Parliament to abrogate the foundational core of the Constitution.', dataIntent: 'none', visualIntent: 'case-photo' },
        { slideNumber: 9, archetype: 'takeaways', title: 'Separation of Powers & Constitutional Governance', purpose: 'Outline executive accountability, judicial independence, and cooperative federalism directives.', keyQuestion: 'What institutional checks preserve constitutional balance in governance?', keyMessage: 'Independent judiciary, free elections, and federal decentralization maintain democratic equilibrium.', dataIntent: 'none', visualIntent: 'none' },
        { slideNumber: 10, archetype: 'conclusion', title: 'Living Constitutionalism & Democratic Stewardship', purpose: 'Synthesize the enduring strength of the Constitution as a living transformative document.', keyQuestion: 'Why is the Indian Constitution considered a living transformative document?', keyMessage: 'Dynamic judicial interpretation and civic commitment sustain constitutional democracy across generations.', dataIntent: 'none', visualIntent: 'none' },
      ];
      break;

    case 'healthcare-medicine':
      sections = [
        { sectionNumber: 1, title: 'Clinical AI Diagnostics & Computer Vision Foundations', purpose: 'Establish deep convolutional diagnostic architectures and clinical imaging modalities.', slideNumbers: [1, 2, 3] },
        { sectionNumber: 2, title: 'Hospital Triage Pipelines & Workflow Paradigm Shift', purpose: 'Map DICOM scan processing and compare manual interpretation with AI-assisted concurrent screening.', slideNumbers: [4, 5] },
        { sectionNumber: 3, title: 'Multi-Modality Accuracy & Clinical Benchmarks', purpose: 'Deliver peer-reviewed validation figures for pulmonary, neurologic, and oncologic AI tools.', slideNumbers: [6, 7] },
        { sectionNumber: 4, title: 'Acute Trauma Deployment & Clinical Leadership Directives', purpose: 'Evaluate emergency stroke intervention case studies and clinical governance directives.', slideNumbers: [8, 9, 10] },
      ];
      slidePlans = [
        { slideNumber: 1, archetype: 'title', title: 'Clinical AI Diagnostics & Medical Informatics', purpose: 'Title and scope of AI radiology screening and hospital triage.', keyQuestion: 'How is clinical AI transforming diagnostic accuracy?', keyMessage: 'Deep learning models assist radiologists with high-sensitivity lesion and stroke detection.', dataIntent: 'none', visualIntent: 'hero-photo' },
        { slideNumber: 2, archetype: 'overview', title: 'Deep Learning Diagnostic Architecture & Imaging Modalities', purpose: 'Explain convolutional networks, vision transformers, and multi-slice CT/MRI processing.', keyQuestion: 'What neural architectures process volumetric medical imaging?', keyMessage: '3D CNNs and vision transformers analyze voxel-level radiological data across CT, MRI, and X-ray.', dataIntent: 'none', visualIntent: 'none' },
        { slideNumber: 3, archetype: 'concept', title: 'Computer Vision in Pulmonary & Oncologic Detection', purpose: 'Detail nodule segmentation, heatmaps, and Bayesian uncertainty estimation.', keyQuestion: 'How does computer vision locate subtle micro-calcifications and nodules?', keyMessage: 'Grad-CAM heatmaps highlight suspicious regions while quantifying confidence calibrated to clinical risks.', dataIntent: 'none', visualIntent: 'concept-diagram' },
        { slideNumber: 4, archetype: 'process', title: 'End-to-End Hospital PACS & AI Triage Pipeline', purpose: 'Map DICOM ingestion from scanner to radiologist worklist prioritization.', keyQuestion: 'How does AI integrate into clinical emergency room workflows?', keyMessage: 'DICOM ingestion → Automated inference (<60s) → Critical finding flag → Priority radiologist worklist.', dataIntent: 'none', visualIntent: 'process-workflow' },
        { slideNumber: 5, archetype: 'comparison', title: 'Manual Radiology Triage vs AI-Assisted Concurrent Screening', purpose: 'Contrast FIFO queue delays with AI instantaneous critical finding prioritization.', keyQuestion: 'What clinical time savings result from AI concurrent screening?', keyMessage: 'Reduces emergency triage turnaround from 180 minutes to under 8 minutes for emergent intracranial hemorrhage.', dataIntent: 'none', visualIntent: 'none' },
        { slideNumber: 6, archetype: 'statistics', title: 'Multi-Modality Clinical Validation Metrics', purpose: 'Present peer-reviewed validation metrics: 97.4% sensitivity, 78% triage speedup.', keyQuestion: 'What clinical benchmarks validate diagnostic AI deployment?', keyMessage: 'Multi-center clinical trials demonstrate 97.4% sensitivity and 0.96 AUC across chest and brain CT.', dataIntent: 'statistics', visualIntent: 'none' },
        { slideNumber: 7, archetype: 'table', title: 'Diagnostic Modality Benchmarks & Regulatory Approvals', purpose: 'Deliver structured performance matrix across Chest X-ray, Brain CT, and Breast MRI.', keyQuestion: 'How do diagnostic metrics compare across regulatory-approved modalities?', keyMessage: 'FDA-cleared diagnostic algorithms maintain >94% specificity across emergency imaging modalities.', dataIntent: 'table', visualIntent: 'none' },
        { slideNumber: 8, archetype: 'case-study', title: 'Emergency Department Stroke Triage Deployment', purpose: 'Analyze Level-1 trauma center deployment saving 42 minutes per thrombectomy.', keyQuestion: 'How does AI stroke detection improve patient neurological outcomes?', keyMessage: 'Accelerated door-to-needle time by 42 minutes, improving 90-day functional independence by 34%.', dataIntent: 'none', visualIntent: 'case-photo' },
        { slideNumber: 9, archetype: 'takeaways', title: 'Clinical Governance & AI Leadership Directives', purpose: 'Outline algorithmic bias audits, physician oversight, and HIPAA data security.', keyQuestion: 'What governance framework ensures safe clinical AI adoption?', keyMessage: 'Physician-in-the-loop oversight, continuous calibration monitoring, and strict data privacy are mandatory.', dataIntent: 'none', visualIntent: 'none' },
        { slideNumber: 10, archetype: 'conclusion', title: 'The Future of AI-Powered Clinical Medicine', purpose: 'Synthesize multimodal EHR synthesis, precision diagnostics, and equitable healthcare.', keyQuestion: 'What is the future horizon for diagnostic medical informatics?', keyMessage: 'Integrating computer vision with genomics and clinical notes will unlock predictive preventative medicine.', dataIntent: 'none', visualIntent: 'none' },
      ];
      break;

    case 'cybersecurity-computing':
    case 'agriculture-agtech':
    default:
      sections = [
        { sectionNumber: 1, title: 'Technical Architecture & Foundational Principles', purpose: 'Establish core domain mechanics and baseline architectures.', slideNumbers: [1, 2, 3] },
        { sectionNumber: 2, title: 'Operational Workflows & System Transitions', purpose: 'Detail operational lifecycles and contrast legacy systems with modern paradigms.', slideNumbers: [4, 5] },
        { sectionNumber: 3, title: 'Empirical Metrics & Industry Benchmarks', purpose: 'Deliver verified performance figures and structured domain comparisons.', slideNumbers: [6, 7] },
        { sectionNumber: 4, title: 'Commercial Deployment & Strategic Synthesis', purpose: 'Evaluate enterprise field deployments and leadership governance directives.', slideNumbers: [8, 9, 10] },
      ];
      slidePlans = [
        { slideNumber: 1, archetype: 'title', title: normalizedTitle, purpose: `Executive overview of ${normalizedTitle}.`, keyQuestion: `What is the core premise of ${normalizedTitle}?`, keyMessage: `Modern technical advancements drive systemic improvements in ${normalizedTitle}.`, dataIntent: 'none', visualIntent: 'hero-photo' },
        { slideNumber: 2, archetype: 'overview', title: 'Architectural Foundations & Core Objectives', purpose: `Map the 4 foundational pillars of ${normalizedTitle}.`, keyQuestion: `What architectural components govern ${normalizedTitle}?`, keyMessage: 'Structured frameworks establish scalable performance across all operational dimensions.', dataIntent: 'none', visualIntent: 'none' },
        { slideNumber: 3, archetype: 'concept', title: 'Core Mechanics & Functional Architecture', purpose: `Detail theoretical and practical dynamics governing ${normalizedTitle}.`, keyQuestion: `How do core mechanisms operate in ${normalizedTitle}?`, keyMessage: 'Systemic synchronization optimizes operational reliability and performance.', dataIntent: 'none', visualIntent: 'concept-diagram' },
        { slideNumber: 4, archetype: 'process', title: 'End-to-End Operational Lifecycle', purpose: `Detail the 4-phase implementation process for ${normalizedTitle}.`, keyQuestion: `What sequential steps ensure successful implementation?`, keyMessage: 'Sequential execution from assessment to continuous optimization guarantees success.', dataIntent: 'none', visualIntent: 'process-workflow' },
        { slideNumber: 5, archetype: 'comparison', title: 'Traditional Approaches vs Modern Paradigm', purpose: `Contrast legacy operational limitations with next-generation solutions.`, keyQuestion: `Why does the modern approach outperform legacy systems?`, keyMessage: 'Next-generation architectures provide superior efficiency, adaptability, and resilience.', dataIntent: 'none', visualIntent: 'none' },
        { slideNumber: 6, archetype: 'statistics', title: 'Empirical Performance & Industry Benchmarks', purpose: `Deliver verified quantitative impact figures for ${normalizedTitle}.`, keyQuestion: `What measurable outcomes validate this approach?`, keyMessage: 'Empirical data demonstrates significant improvements across key operational metrics.', dataIntent: 'statistics', visualIntent: 'none' },
        { slideNumber: 7, archetype: 'table', title: 'Structured Comparative Benchmarks & Matrix', purpose: `Present 4-column matrix of operational standards and metrics.`, keyQuestion: `How do key parameters perform across operational categories?`, keyMessage: 'Comprehensive benchmarks confirm consistent operational advantages.', dataIntent: 'table', visualIntent: 'none' },
        { slideNumber: 8, archetype: 'case-study', title: 'Commercial Deployment & Real-World Impact', purpose: `Analyze enterprise case study and measured operational gains.`, keyQuestion: `How does real-world deployment validate system performance?`, keyMessage: 'Demonstrates substantial efficiency gains, cost reductions, and operational stability.', dataIntent: 'none', visualIntent: 'case-photo' },
        { slideNumber: 9, archetype: 'takeaways', title: 'Strategic Leadership & Governance Directives', purpose: `Outline actionable governance mandates and leadership priorities.`, keyQuestion: `What strategic actions must leadership take immediately?`, keyMessage: 'Executive prioritization and disciplined execution ensure enduring competitive advantage.', dataIntent: 'none', visualIntent: 'none' },
        { slideNumber: 10, archetype: 'conclusion', title: 'Strategic Synthesis & Future Horizons', purpose: `Synthesize long-term outlook and transformative vision.`, keyQuestion: `What is the future outlook for ${normalizedTitle}?`, keyMessage: 'Continuous innovation and strategic alignment unlock lasting transformative value.', dataIntent: 'none', visualIntent: 'none' },
      ];
      break;
  }

  // 2. Build Slide Blueprints
  const slideBlueprints: SlideBlueprint[] = slidePlans.map((plan) => {
    const sec = sections.find((s) => s.slideNumbers.includes(plan.slideNumber)) || sections[0];

    return {
      slideNumber: plan.slideNumber,
      sectionName: sec.title,
      archetype: plan.archetype,
      title: plan.title,
      purpose: plan.purpose,
      keyQuestion: plan.keyQuestion,
      keyMessage: plan.keyMessage,
      contentDepth: req.depth || 'deep',
      dataIntent: plan.dataIntent,
      visualIntent: plan.visualIntent,
      requiredTerms: ctx.keywords,
      speakerNotesGuidance: `Deliver comprehensive verbal commentary explaining slide ${plan.slideNumber} ("${plan.title}") for a ${req.audience} audience.`,
      sourceReferences: registry.sources.map((s) => s.title),
    };
  });

  return {
    requirements: req,
    topicContext: ctx,
    sections,
    slideBlueprints,
  };
}
