/**
 * Step 7 — Sample Valid 10-Slide Dataset
 *
 * Subject: Water and Air Pollution: Sources, Impacts, and Control Strategies
 * Conforms 100% to PresentationData schema.
 */

import { PresentationData } from './presentationSchema';

export const valid10SlideData: PresentationData = {
  presentation: {
    title: 'Water and Air Pollution',
    subtitle: 'Sources, Impacts, and Environmental Control Strategies',
    author: 'Environmental Protection Agency',
    date: '2026',
    theme: 'referenceEditorial',
  },
  slides: [
    // Slide 1: Title
    {
      id: 'slide-01',
      slideNumber: 1,
      type: 'title',
      title: 'Water and Air Pollution',
      subtitle: 'Sources, Impacts, and Environmental Control Strategies',
      author: 'Environmental Protection Agency',
      date: '2026',
      dark: true,
      speakerNotes: 'Welcome to the presentation on Environmental Water and Air Pollution.',
    },

    // Slide 2: Concept (What is Pollution?)
    {
      id: 'slide-02',
      slideNumber: 2,
      type: 'concept',
      title: 'What Is Environmental Pollution?',
      subtitle: 'Definition and physical contamination mechanisms.',
      keyMessage: 'Pollution occurs when harmful substances alter natural baseline ecosystems.',
      content: {
        mainConcept: {
          title: 'Ecosystem Contamination',
          body: 'Contamination occurs when foreign chemical or physical agents are introduced into natural biosphere reservoirs faster than natural attenuation capacity.',
        },
        cards: [
          { title: 'Air Contamination', body: 'Particulate matter, tropospheric ozone, and sulfur oxides altering atmospheric chemistry.', icon: 'Wind' },
          { title: 'Water Contamination', body: 'Heavy metals, microplastics, and agricultural runoff corrupting freshwater aquifers.', icon: 'Droplets' },
        ],
      },
      speakerNotes: 'Slide 2 introduces the formal definition of environmental pollution.',
    },

    // Slide 3: Cause-Effect (Air Pollution Drivers & Health Impact)
    {
      id: 'slide-03',
      slideNumber: 3,
      type: 'cause-effect',
      title: 'Air Pollution Drivers & Health Impact',
      subtitle: 'From industrial emissions to respiratory morbidity.',
      content: {
        causes: [
          { title: 'Fossil Fuel Combustion', body: 'Coal and diesel burning releasing fine PM2.5 particulates.' },
          { title: 'Industrial Smelting', body: 'Unfiltered stack emissions of sulfur dioxide and heavy metals.' },
        ],
        mechanism: 'Fine atmospheric particulates penetrate deep into pulmonary alveoli, entering human systemic circulation.',
        effects: [
          { title: 'Cardiovascular Disease', body: 'Chronic inflammation increasing risk of ischemic heart disease.' },
          { title: 'Respiratory Disorders', body: 'Elevated incidence of asthma, COPD, and lung cancer.' },
        ],
      },
      speakerNotes: 'Slide 3 details the causal pathway from stack emissions to lung disease.',
    },

    // Slide 4: Statistics (Global Pollution Metrics)
    {
      id: 'slide-04',
      slideNumber: 4,
      type: 'statistics',
      title: 'Global Pollution Impact Metrics',
      subtitle: 'Quantifying human mortality and environmental economic loss.',
      content: [
        { number: '9.0 Million', label: 'Annual Global Deaths', body: 'Premature deaths attributed directly to ambient and household pollution.' },
        { number: '99%', label: 'Unsafe Air Exposure', body: 'Global population breathing air exceeding WHO air quality guidelines.' },
        { number: '$4.6 Trillion', label: 'Economic Cost', body: 'Annual economic welfare losses from pollution-related health burdens.' },
      ],
      speakerNotes: 'Slide 4 highlights 3 critical metrics from WHO and Lancet reports.',
    },

    // Slide 5: Overview (Pollution Control Pillars)
    {
      id: 'slide-05',
      slideNumber: 5,
      type: 'overview',
      title: 'Pollution Control Pillars',
      subtitle: 'Integrated strategy for environmental remediation.',
      content: [
        { number: '1', title: 'Source Reduction', body: 'Switching to clean energy and zero-emission industrial processes.', icon: 'Zap' },
        { number: '2', title: 'Effluent Treatment', body: 'Advanced filtration, scrubbers, and biological wastewater treatment.', icon: 'Filter' },
        { number: '3', title: 'Regulatory Enforcement', body: 'Strict emission ceilings and legal penalties for non-compliance.', icon: 'ShieldCheck' },
      ],
      speakerNotes: 'Slide 5 outlines the three core pillars of pollution management.',
    },

    // Slide 6: Comparison (Point vs Non-Point Sources)
    {
      id: 'slide-06',
      slideNumber: 6,
      type: 'comparison',
      title: 'Point vs Non-Point Pollution Sources',
      subtitle: 'Comparing localized outfalls with diffuse environmental runoff.',
      content: {
        leftPanel: {
          title: 'Point Source Pollution',
          points: [
            'Single identifiable discharge location (e.g. factory pipe)',
            'Easier to monitor and regulate via effluent limits',
            'Examples: industrial outfalls, sewage treatment plants',
            'Direct end-of-pipe treatment solutions available',
          ],
        },
        rightPanel: {
          title: 'Non-Point Source Pollution',
          points: [
            'Diffuse runoff over vast land areas',
            'Highly challenging to trace and regulate legally',
            'Examples: agricultural pesticide runoff, urban street wash',
            'Requires watershed-wide land management practices',
          ],
        },
      },
      speakerNotes: 'Slide 6 compares point vs non-point pollution sources.',
    },

    // Slide 7: Table + Chart (Water Pollutant Concentration & Limits)
    {
      id: 'slide-07',
      slideNumber: 7,
      type: 'table',
      title: 'Water Pollutant Concentration Limits',
      subtitle: 'EPA maximum contaminant levels (MCL) for drinking water.',
      data: {
        headers: ['Contaminant', 'Primary Source', 'MCL Threshold', 'Health Hazard'],
        rows: [
          ['Lead (Pb)', 'Coroded piping', '0.015 mg/L', 'Neurotoxicity in children'],
          ['Nitrates (NO3)', 'Fertilizer runoff', '10.0 mg/L', 'Methemoglobinemia'],
          ['Arsenic (As)', 'Geologic leaching', '0.010 mg/L', 'Carcinogenic risk'],
          ['Benzene', 'Industrial solvent', '0.005 mg/L', 'Bone marrow toxicity'],
        ],
        keyTakeaway: 'Strict adherence to EPA MCL thresholds prevents systemic toxicity in municipal water systems.',
      },
      chartData: {
        chartType: 'doughnut',
        title: 'Global Water Pollution Share',
        labels: ['Agricultural Runoff', 'Industrial Discharge', 'Municipal Sewage', 'Urban Stormwater'],
        values: [42, 28, 18, 12],
      },
      speakerNotes: 'Slide 7 features standard regulatory limits and global source distribution.',
    },

    // Slide 8: Process (Wastewater Purification Workflow)
    {
      id: 'slide-08',
      slideNumber: 8,
      type: 'process',
      title: 'Wastewater Purification Workflow',
      subtitle: 'Four-stage treatment pipeline before environmental discharge.',
      content: [
        { stepNumber: 1, title: 'Primary Screening', body: 'Removal of large solids and heavy grit via mechanical screens.', icon: 'Filter' },
        { stepNumber: 2, title: 'Biological Treatment', body: 'Aerated sludge tanks utilizing microbes to decompose organic matter.', icon: 'Activity' },
        { stepNumber: 3, title: 'Tertiary Filtration', body: 'Sand filters and membrane bioreactors removing fine suspended solids.', icon: 'Layers' },
        { stepNumber: 4, title: 'Disinfection', body: 'UV irradiation or chlorination neutralizing pathogens before release.', icon: 'CheckCircle2' },
      ],
      speakerNotes: 'Slide 8 describes the four-stage wastewater treatment process.',
    },

    // Slide 9: Takeaways (Key Action Items for Sustainability)
    {
      id: 'slide-09',
      slideNumber: 9,
      type: 'takeaways',
      title: 'Key Action Items for Sustainability',
      subtitle: 'Strategic recommendations for policy and industry.',
      content: [
        { number: 1, title: 'Transition to Renewable Energy', body: 'Eliminate fossil fuel power generation to curb SO2 and NOx emissions.' },
        { number: 2, title: 'Implement Circular Economies', body: 'Minimize industrial chemical waste through recycling and zero-liquid discharge.' },
        { number: 3, title: 'Strengthen Watershed Protection', body: 'Protect natural wetland buffers to filter agricultural non-point runoff.' },
        { number: 4, title: 'Enforce Transparency', body: 'Mandate real-time public monitoring of air quality and industrial discharges.' },
      ],
      speakerNotes: 'Slide 9 summarizes 4 critical policy recommendations.',
    },

    // Slide 10: Conclusion (Restoring Environmental Balance)
    {
      id: 'slide-10',
      slideNumber: 10,
      type: 'conclusion',
      title: 'Restoring Environmental Balance',
      subtitle: 'A collective commitment to clean air and water.',
      content: {
        summaryText: 'Clean air and water are fundamental human rights and essential pillars of public health. By combining stringent regulatory enforcement, clean industrial technology, and community stewardship, we can reverse environmental degradation and protect future generations.',
        callToAction: 'Act Today for Clean Air and Water for All.',
      },
      dark: true,
      speakerNotes: 'Slide 10 concludes the presentation.',
    },
  ],
};
