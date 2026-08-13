/**
 * Step 5 — Reference-Style 10-Slide Presentation Generator
 *
 * Subject: Human Population and the Environment
 * Visual benchmark: Reference editorial design system
 *
 * Output: outputs/reference-style-10-slide.pptx
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
    id: 'slide-01-title',
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
  // Slide 2: Human Population & Population Density (Concept)
  // -------------------------------------------------------------------------
  {
    id: 'slide-02-density',
    type: 'concept',
    eyebrow: 'DEMOGRAPHIC FOUNDATIONS',
    title: 'Human Population & Population Density',
    subtitle: 'Spatial distribution of global population and ecosystem carrying capacity.',
    mainConcept: {
      title: 'Population Density (N / Area)',
      description: 'Measures the concentration of individuals per unit of geographical area (persons/km²). Spatial distribution is highly uneven across urban, rural, and coastal ecosystems.',
    },
    cards: [
      {
        icon: 'Building2',
        title: 'Urban Concentration',
        body: 'Over 56% of global population resides in urban areas, occupying under 3% of global land surface.',
      },
      {
        icon: 'Gauge',
        title: 'Resource Strain',
        body: 'High density accelerates localized freshwater depletion, air pollution, and infrastructure strain.',
      },
    ],
    slideNumber: 2,
    totalSlides: 10,
    notes: 'Slide 2 explains population density concepts and spatial distribution.',
  },

  // -------------------------------------------------------------------------
  // Slide 3: Population Growth & Its Consequences (Cause-Effect)
  // -------------------------------------------------------------------------
  {
    id: 'slide-03-growth',
    type: 'cause-effect',
    eyebrow: 'ENVIRONMENTAL IMPACT',
    title: 'Population Growth & Its Consequences',
    subtitle: 'How exponential population expansion drives environmental degradation.',
    causes: [
      { title: 'High Fertility Rates', description: 'Sustained high birth rates in developing regions.' },
      { title: 'Decreased Mortality', description: 'Medical advances & improved sanitation reducing death rates.' },
    ],
    mechanism: 'Exponential population growth increases total demand for food, water, energy, and land faster than natural ecosystem regeneration rates.',
    effects: [
      { title: 'Deforestation & Habitat Loss', description: 'Massive land conversion for agriculture and urban sprawl.' },
      { title: 'Pollution & Climate Change', description: 'Increased carbon emissions overburdening global carbon sinks.' },
    ],
    slideNumber: 3,
    totalSlides: 10,
    notes: 'Slide 3 details cause-and-effect relationship of rapid population growth.',
  },

  // -------------------------------------------------------------------------
  // Slide 4: Population Explosion (Statistics)
  // -------------------------------------------------------------------------
  {
    id: 'slide-04-explosion',
    type: 'statistics',
    eyebrow: 'GLOBAL DEMOGRAPHICS',
    title: 'Population Explosion',
    subtitle: 'Unprecedented acceleration in human population over the past century.',
    metrics: [
      { number: '8.1 Billion', label: 'Global Population', explanation: 'Grew from 1 billion in 1804 to over 8 billion in 2022.' },
      { number: '+70 Million', label: 'Annual Net Addition', explanation: 'Net human lives added to Earth each year.' },
      { number: '1.08%', label: 'Current Growth Rate', explanation: 'Decelerated from a historical peak of 2.1% per year in 1968.' },
    ],
    slideNumber: 4,
    totalSlides: 10,
    notes: 'Slide 4 showcases population explosion statistical metrics.',
  },

  // -------------------------------------------------------------------------
  // Slide 5: Family Welfare Programme (Overview)
  // -------------------------------------------------------------------------
  {
    id: 'slide-05-welfare',
    type: 'overview',
    eyebrow: 'POLICY & HEALTH',
    title: 'Family Welfare Programme',
    subtitle: 'Strategic national initiatives promoting maternal-child health and family planning.',
    agendaItems: [
      { number: '1', title: 'Maternal & Child Health', description: 'Integrated healthcare services ensuring safe childbirth, nutrition, and child immunization.', icon: 'HeartPulse' },
      { number: '2', title: 'Family Planning Access', description: 'Voluntary access to reproductive health education and modern family planning methods.', icon: 'Users' },
      { number: '3', title: 'Women Empowerment', description: 'Promoting female literacy and economic independence to foster sustainable family sizes.', icon: 'GraduationCap' },
    ],
    slideNumber: 5,
    totalSlides: 10,
    notes: 'Slide 5 outlines the three pillars of family welfare programs.',
  },

  // -------------------------------------------------------------------------
  // Slide 6: Environment & Human Health (Concept)
  // -------------------------------------------------------------------------
  {
    id: 'slide-06-health',
    type: 'concept',
    eyebrow: 'ENVIRONMENTAL HEALTH',
    title: 'Environment & Human Health',
    subtitle: 'The direct link between ecosystem quality and human physical well-being.',
    mainConcept: {
      title: 'Environmental Health Risk Factors',
      description: 'Ecosystem degradation directly impacts human health through vector-borne disease expansion, air and water contamination, and extreme thermal stress.',
    },
    cards: [
      { icon: 'Wind', title: 'Air & Water Quality', body: 'Fine particulate matter (PM2.5) and water contamination cause over 7 million premature deaths annually.' },
      { icon: 'Bug', title: 'Vector Expansion', body: 'Deforestation and climate warming expand the geographical range of malaria and dengue vectors.' },
    ],
    slideNumber: 6,
    totalSlides: 10,
    notes: 'Slide 6 highlights environmental health risk factors.',
  },

  // -------------------------------------------------------------------------
  // Slide 7: Diarrhoea, ORT & ORS (Table + Native Chart Hybrid)
  // -------------------------------------------------------------------------
  {
    id: 'slide-07-ors',
    type: 'table',
    eyebrow: 'CLINICAL INTERVENTION',
    title: 'Diarrhoea, ORT & ORS',
    subtitle: 'WHO/UNICEF Oral Rehydration Salts (ORS) formulation & composition.',
    headers: ['Component', 'Molar Mass (g/L)', 'Physiological Function'],
    rows: [
      ['Sodium Chloride', '2.6 g/L', 'Restores essential extracellular sodium'],
      ['Trisodium Citrate', '2.9 g/L', 'Corrects metabolic acidosis'],
      ['Potassium Chloride', '1.5 g/L', 'Replenishes intracellular potassium'],
      ['Glucose (Anhydrous)', '13.5 g/L', 'Enables intestinal sodium co-transport'],
    ],
    chartData: {
      chartType: 'doughnut',
      title: 'ORS Formula Ratio (g/L)',
      labels: ['Sodium Chloride', 'Trisodium Citrate', 'Potassium Chloride', 'Glucose'],
      values: [2.6, 2.9, 1.5, 13.5],
    },
    keyTakeaway: 'WHO/UNICEF Low-Osmolality ORS reduces mortality by 33% and prevents IV hospitalization in over 90% of cases.',
    slideNumber: 7,
    totalSlides: 10,
    notes: 'Slide 7 features a native table alongside a native doughnut chart for ORS composition.',
  },

  // -------------------------------------------------------------------------
  // Slide 8: Human Rights (Comparison)
  // -------------------------------------------------------------------------
  {
    id: 'slide-08-rights',
    type: 'comparison',
    eyebrow: 'ETHICAL FRAMEWORK',
    title: 'Human Rights & Environmental Protection',
    subtitle: 'Balancing fundamental human rights with environmental stewardship.',
    leftPanel: {
      title: 'Fundamental Environmental Rights',
      points: [
        'Right to a clean, healthy, and sustainable environment',
        'Right to safe drinking water and sanitation',
        'Right to accurate environmental information & public input',
        'Protection of indigenous communities from toxic pollution',
      ],
      accentColor: t.colors.teal,
    },
    rightPanel: {
      title: 'Intergenerational Equity',
      points: [
        'Preserving ecosystem integrity for future human generations',
        'Preventing irreversible biodiversity loss and climate tipping points',
        'Fair global distribution of climate adaptation funds',
        'Legal accountability for cross-border environmental damage',
      ],
      accentColor: t.colors.blue,
    },
    slideNumber: 8,
    totalSlides: 10,
    notes: 'Slide 8 presents Human Rights and Intergenerational Equity side-by-side.',
  },

  // -------------------------------------------------------------------------
  // Slide 9: Value Education & Environmental Values (Takeaways)
  // -------------------------------------------------------------------------
  {
    id: 'slide-09-values',
    type: 'takeaways',
    eyebrow: 'EDUCATION & ETHICS',
    title: 'Value Education & Environmental Values',
    subtitle: 'Fostering ecological ethics, conservation awareness, and sustainable practices.',
    takeaways: [
      { number: 1, title: 'Eco-Centric Ethics', description: 'Shifting from human exploitation toward respect for all living systems.' },
      { number: 2, title: 'Sustainable Living', description: 'Promoting resource conservation, zero waste, and circular economies.' },
      { number: 3, title: 'Community Leadership', description: 'Empowering local communities in reforestation and water conservation.' },
      { number: 4, title: 'Global Responsibility', description: 'Recognizing international shared responsibility for planetary climate health.' },
    ],
    slideNumber: 9,
    totalSlides: 10,
    notes: 'Slide 9 highlights 4 key values in environmental education.',
  },

  // -------------------------------------------------------------------------
  // Slide 10: Conclusion & Thank You (Conclusion)
  // -------------------------------------------------------------------------
  {
    id: 'slide-10-conclusion',
    type: 'conclusion',
    eyebrow: 'SUMMARY & VISION',
    title: 'Conclusion & Thank You',
    subtitle: 'Harmonizing human progress with planetary environmental limits.',
    summaryText: 'Human population dynamics and environmental sustainability are deeply interdependent. Achieving long-term balance requires empowering communities through education, family welfare, clean energy, and environmental ethics.',
    finalCallToAction: 'Protect the Environment — Preserve Our Shared Future.',
    dark: true,
    slideNumber: 10,
    totalSlides: 10,
    notes: 'Slide 10 concludes the 10-slide presentation.',
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
