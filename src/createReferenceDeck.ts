/**
 * Step 6 — Reference-Style 10-Slide Presentation Generator
 *
 * Subject: Human Population and the Environment
 * Archetype Flow:
 *   1. title
 *   2. overview
 *   3. concept
 *   4. comparison
 *   5. cause-effect
 *   6. process
 *   7. table / statistics (with "Illustrative test data" where required)
 *   8. case-study
 *   9. takeaways
 *   10. conclusion
 *
 * Output: outputs/reference-10-slide.pptx
 */

import * as path from 'path';
import {
  createPresentation,
  addSlide,
  exportPresentation,
} from './core/presentation';
import { renderSlide } from './slides/registry';
import { SlideData } from './slides/types';
import { defaultTheme } from './design/theme';

const t = defaultTheme;

export const reference10SlideDeckData: SlideData[] = [
  // -------------------------------------------------------------------------
  // Slide 1: Title
  // -------------------------------------------------------------------------
  {
    id: 'ref-01-title',
    type: 'title',
    eyebrow: 'ENVIRONMENTAL STUDIES & HUMAN ECOLOGY',
    title: 'Human Population and the Environment',
    subtitle: 'Understanding Demographic Pressures, Resource Consumption, and Ecological Sustainability',
    author: 'Department of Environmental Sciences',
    date: 'August 2026',
    dark: true,
    slideNumber: 1,
    totalSlides: 10,
    notes: 'Title slide introducing Human Population and the Environment.',
  },

  // -------------------------------------------------------------------------
  // Slide 2: Overview (Agenda)
  // -------------------------------------------------------------------------
  {
    id: 'ref-02-overview',
    type: 'overview',
    eyebrow: 'PRESENTATION STRUCTURE',
    title: 'Demographic & Environmental Framework',
    subtitle: 'Core themes and strategic analytical areas addressed in this briefing.',
    agendaItems: [
      { number: '1', title: 'Carrying Capacity', description: 'Theoretical models of population density and land resource constraints.', icon: 'Gauge' },
      { number: '2', title: 'Rights & Equity', description: 'Balancing development rights with long-term ecological preservation.', icon: 'Scale' },
      { number: '3', title: 'Impact Pathways', description: 'Cause-and-effect dynamics of urban expansion and deforestation.', icon: 'Activity' },
      { number: '4', title: 'Intervention Models', description: 'Public health, sustainable urbanism, and ethical environmental stewardship.', icon: 'ShieldCheck' },
    ],
    slideNumber: 2,
    totalSlides: 10,
    notes: 'Slide 2 outlines the strategic agenda for the presentation.',
  },

  // -------------------------------------------------------------------------
  // Slide 3: Concept
  // -------------------------------------------------------------------------
  {
    id: 'ref-03-concept',
    type: 'concept',
    eyebrow: 'DEMOGRAPHIC FOUNDATIONS',
    title: 'Population Density & Carrying Capacity',
    subtitle: 'Spatial distribution of global population and ecosystem resource limits.',
    mainConcept: {
      title: 'Ecological Carrying Capacity (K)',
      description: 'The maximum population size of a species that an environment can sustain indefinitely without degrading natural capital, soil fertility, or freshwater reserves.',
    },
    cards: [
      {
        icon: 'Building2',
        title: 'Urban Concentration',
        body: 'Over 56% of humans reside in dense urban centers occupying under 3% of total global land surface.',
      },
      {
        icon: 'Flame',
        title: 'Resource Asymmetry',
        body: 'High-density metros consume over 75% of global primary energy while generating localized pollution stress.',
      },
    ],
    slideNumber: 3,
    totalSlides: 10,
    notes: 'Slide 3 details carrying capacity and urban demographic concentration.',
  },

  // -------------------------------------------------------------------------
  // Slide 4: Comparison
  // -------------------------------------------------------------------------
  {
    id: 'ref-04-comparison',
    type: 'comparison',
    eyebrow: 'ETHICAL & POLICY DYNAMICS',
    title: 'Human Rights vs Intergenerational Equity',
    subtitle: 'Balancing immediate socioeconomic rights with future planetary preservation.',
    leftPanel: {
      title: 'Fundamental Development Rights',
      points: [
        'Right to clean water, sanitation, and adequate nutrition',
        'Equitable access to clean energy and modern healthcare',
        'Freedom of choice in reproductive family welfare planning',
        'Economic empowerment and poverty alleviation mandates',
      ],
      accentColor: t.colors.teal,
    },
    rightPanel: {
      title: 'Intergenerational Ecological Equity',
      points: [
        'Preserving biodiversity and non-renewable resource stocks',
        'Maintaining stable climate systems and carbon sequestration',
        'Preventing irreversible toxic contamination of watersheds',
        'Legal liability and ethical stewardship for future generations',
      ],
      accentColor: t.colors.blue,
    },
    slideNumber: 4,
    totalSlides: 10,
    notes: 'Slide 4 compares current development rights with intergenerational equity.',
  },

  // -------------------------------------------------------------------------
  // Slide 5: Cause-Effect
  // -------------------------------------------------------------------------
  {
    id: 'ref-05-cause-effect',
    type: 'cause-effect',
    eyebrow: 'IMPACT MECHANISMS',
    title: 'Population Growth & Environmental Stress',
    subtitle: 'Systemic cause-and-effect cascade from population growth to ecological degradation.',
    causes: [
      { title: 'Demographic Momentum', description: 'Expanding global population base with declining infant mortality.' },
      { title: 'Intensive Resource Demand', description: 'Surging per-capita requirements for energy, animal protein, and water.' },
    ],
    mechanism: 'Accelerating industrial demand outpaces natural biological regeneration, depleting aquifers, eroding arable soil, and over-saturating carbon sinks.',
    effects: [
      { title: 'Deforestation & Land Degradation', description: 'Massive conversion of natural tropical biomes into agricultural monocultures.' },
      { title: 'Climate & Air Contamination', description: 'Elevated greenhouse emissions and fine particulate atmospheric pollution.' },
    ],
    slideNumber: 5,
    totalSlides: 10,
    notes: 'Slide 5 maps the cause-and-effect flow of population pressures.',
  },

  // -------------------------------------------------------------------------
  // Slide 6: Process
  // -------------------------------------------------------------------------
  {
    id: 'ref-06-process',
    type: 'process',
    eyebrow: 'STRATEGIC INTERVENTION',
    title: 'Environmental Health Mitigation Workflow',
    subtitle: 'Four-stage structured framework for reducing community environmental risks.',
    steps: [
      { stepNumber: 1, title: 'Risk Assessment', description: 'Quantify localized air and groundwater contaminant levels using IoT sensor arrays.', icon: 'Activity' },
      { stepNumber: 2, title: 'Source Control', description: 'Implement industrial discharge filtration and agricultural runoff interceptors.', icon: 'Filter' },
      { stepNumber: 3, title: 'Welfare Outreach', description: 'Deploy community sanitation education and primary maternal healthcare access.', icon: 'HeartPulse' },
      { stepNumber: 4, title: 'Continuous Audit', description: 'Monitor long-term epidemiological outcomes and ecological restoration indicators.', icon: 'CheckCircle2' },
    ],
    slideNumber: 6,
    totalSlides: 10,
    notes: 'Slide 6 outlines the 4-step mitigation process workflow.',
  },

  // -------------------------------------------------------------------------
  // Slide 7: Table (with Illustrative Test Data)
  // -------------------------------------------------------------------------
  {
    id: 'ref-07-table',
    type: 'table',
    eyebrow: 'QUANTITATIVE ANALYSIS (ILLUSTRATIVE TEST DATA)',
    title: 'WHO/UNICEF Clinical Intervention Formulation',
    subtitle: 'Oral Rehydration Salts (ORS) formulation breakdown and physiological functions.',
    headers: ['Chemical Component', 'Molar Mass (g/L)', 'Physiological Function'],
    rows: [
      ['Sodium Chloride', '2.6 g/L', 'Restores critical extracellular sodium electrolyte balance'],
      ['Trisodium Citrate', '2.9 g/L', 'Corrects systemic metabolic acidosis from fluid depletion'],
      ['Potassium Chloride', '1.5 g/L', 'Replenishes essential intracellular potassium stores'],
      ['Glucose (Anhydrous)', '13.5 g/L', 'Enables sodium-glucose cotransport across intestinal wall'],
    ],
    chartData: {
      chartType: 'doughnut',
      title: 'Composition (g/L) - Illustrative test data',
      labels: ['Sodium Chloride', 'Trisodium Citrate', 'Potassium Chloride', 'Glucose'],
      values: [2.6, 2.9, 1.5, 13.5],
    },
    keyTakeaway: 'Standard Low-Osmolality ORS reduces childhood mortality by 33% (Illustrative test data).',
    slideNumber: 7,
    totalSlides: 10,
    notes: 'Slide 7 provides a formatted comparison table and chart with illustrative test data.',
  },

  // -------------------------------------------------------------------------
  // Slide 8: Case Study
  // -------------------------------------------------------------------------
  {
    id: 'ref-08-case-study',
    type: 'case-study',
    eyebrow: 'EMPIRICAL CASE ANALYSIS',
    title: 'Megacity Urban Heat Island Mitigation',
    subtitle: 'Targeted green infrastructure retrofit in dense municipal environments.',
    context: 'Rapid urban sprawl and concrete density elevated summer microclimate temperatures by 4.2°C above surrounding rural zones.',
    challenge: 'High thermal stress, increased peak electricity demand for cooling, and heightened respiratory morbidity among vulnerable populations.',
    solution: 'Mandated green roof installations, urban canopy expansion by 25%, and high-albedo permeable pavements across transit corridors.',
    result: 'Reduced localized ambient surface temperatures by 1.8°C and lowered peak residential cooling demand by 14% over a 3-year period.',
    slideNumber: 8,
    totalSlides: 10,
    notes: 'Slide 8 presents an empirical urban heat island case study.',
  },

  // -------------------------------------------------------------------------
  // Slide 9: Takeaways
  // -------------------------------------------------------------------------
  {
    id: 'ref-09-takeaways',
    type: 'takeaways',
    eyebrow: 'CORE PRINCIPLES',
    title: 'Value Education & Environmental Values',
    subtitle: 'Foundational ethical takeaways for sustainable societal development.',
    takeaways: [
      { number: 1, title: 'Eco-Centric Ethics', description: 'Transitioning from resource exploitation to respect for planetary ecological boundaries.' },
      { number: 2, title: 'Circular Economy', description: 'Designing closed-loop industrial processes with zero landfill waste and high recycling.' },
      { number: 3, title: 'Community Leadership', description: 'Empowering regional stakeholders in reforestation, water stewardship, and clean energy.' },
      { number: 4, title: 'Global Responsibility', description: 'Fostering international cooperation on shared climate, atmospheric, and ocean health.' },
    ],
    slideNumber: 9,
    totalSlides: 10,
    notes: 'Slide 9 summarizes four ethical pillars in value education.',
  },

  // -------------------------------------------------------------------------
  // Slide 10: Conclusion
  // -------------------------------------------------------------------------
  {
    id: 'ref-10-conclusion',
    type: 'conclusion',
    eyebrow: 'SYNTHESIS & CALL TO ACTION',
    title: 'Harmonizing Human Development & Earth',
    subtitle: 'Building a sustainable future within ecological planetary boundaries.',
    summaryText: 'Sustainable coexistence requires uniting demographic equity, proactive public health, renewable energy transitions, and ecological values. Preserving natural ecosystems today safeguards humanity for generations to come.',
    finalCallToAction: 'Protect Environmental Capital — Ensure Intergenerational Sustainability.',
    dark: true,
    slideNumber: 10,
    totalSlides: 10,
    notes: 'Slide 10 delivers the concluding synthesis and call to action.',
  },
];

export async function generateReferenceDeck(outputPath: string): Promise<string> {
  let pres = createPresentation('Human Population and the Environment', {
    author: 'Department of Environmental Sciences',
    canvas: {
      width: t.canvas.widthInches,
      height: t.canvas.heightInches,
      aspectRatio: t.canvas.aspectRatio,
    },
  });

  for (const slideData of reference10SlideDeckData) {
    const slideDef = renderSlide(slideData);
    pres = addSlide(pres, slideDef);
  }

  return await exportPresentation(pres, outputPath);
}
