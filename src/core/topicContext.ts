/**
 * STEP 23 — UNIVERSAL TOPIC CONTEXT
 *
 * Normalizes any topic string, categorizes domain, extracts keywords,
 * builds semantic queries, and generates category-specific slide metadata.
 */

export type TopicDomain =
  | 'climate-environment'
  | 'biotechnology-botany'
  | 'law-governance'
  | 'healthcare-medicine'
  | 'cybersecurity-computing'
  | 'agriculture-agtech'
  | 'culture-history-heritage'
  | 'plant-biology-photosynthesis'
  | 'blockchain-computing'
  | 'general-science-technology';

export interface UniversalTopicContext {
  rawTopic: string;
  normalizedTitle: string;
  slug: string;
  domain: TopicDomain;
  keywords: string[];
  eyebrows: {
    title: string;
    overview: string;
    concept: string;
    process: string;
    comparison: string;
    statistics: string;
    table: string;
    caseStudy: string;
    takeaways: string;
    conclusion: string;
  };
  imageQueries: {
    hero: { query: string; purpose: string };
    concept: { query: string; purpose: string };
    caseStudy: { query: string; purpose: string };
    process: { query: string; purpose: string };
    statistics: { query: string; purpose: string };
  };
}

export function createUniversalTopicContext(topic: string): UniversalTopicContext {
  const lower = topic.toLowerCase();
  const slug = topic
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  let domain: TopicDomain = 'general-science-technology';

  if (
    lower.includes('pollution') ||
    lower.includes('air quality') ||
    lower.includes('aqi') ||
    lower.includes('smog') ||
    lower.includes('climate') ||
    lower.includes('global warming') ||
    lower.includes('greenhouse') ||
    lower.includes('carbon')
  ) {
    domain = 'climate-environment';
  } else if (
    lower.includes('photosynthesis') ||
    lower.includes('chloroplast') ||
    lower.includes('calvin cycle') ||
    lower.includes('thylakoid') ||
    lower.includes('carbon fixation') ||
    lower.includes('light reaction')
  ) {
    domain = 'plant-biology-photosynthesis';
  } else if (
    lower.includes('tissue culture') ||
    lower.includes('micropropagation') ||
    lower.includes('callus') ||
    lower.includes('explant') ||
    (lower.includes('plant') && !lower.includes('power plant'))
  ) {
    domain = 'biotechnology-botany';
  } else if (
    lower.includes('blockchain') ||
    lower.includes('distributed ledger') ||
    lower.includes('smart contract') ||
    lower.includes('cryptocurrency') ||
    lower.includes('ethereum') ||
    lower.includes('bitcoin') ||
    lower.includes('decentralized')
  ) {
    domain = 'blockchain-computing';
  } else if (
    lower.includes('municipal') ||
    lower.includes('hyderabad') ||
    lower.includes('ghmc') ||
    lower.includes('urban governance') ||
    lower.includes('corporation') ||
    lower.includes('constitution') ||
    lower.includes('rights') ||
    lower.includes('law') ||
    lower.includes('governance') ||
    lower.includes('judicial') ||
    lower.includes('preamble') ||
    lower.includes('legal')
  ) {
    domain = 'law-governance';
  } else if (
    lower.includes('health') ||
    lower.includes('medic') ||
    lower.includes('clinical') ||
    lower.includes('diagnostic') ||
    lower.includes('patient') ||
    lower.includes('hospital')
  ) {
    domain = 'healthcare-medicine';
  } else if (
    lower.includes('iot') ||
    lower.includes('cyber') ||
    lower.includes('security') ||
    lower.includes('embedded') ||
    lower.includes('malware') ||
    lower.includes('botnet') ||
    lower.includes('firmware') ||
    lower.includes('cve') ||
    lower.includes('ddos')
  ) {
    domain = 'cybersecurity-computing';
  } else if (
    lower.includes('agriculture') ||
    lower.includes('farming') ||
    lower.includes('crop') ||
    lower.includes('agronomy')
  ) {
    domain = 'agriculture-agtech';
  } else if (
    (lower.includes('culture') && !lower.includes('tissue culture') && !lower.includes('cell culture') && !lower.includes('bacterial culture')) ||
    lower.includes('heritage') ||
    lower.includes('tradition') ||
    lower.includes('monument') ||
    lower.includes('art') ||
    lower.includes('dance') ||
    lower.includes('music') ||
    lower.includes('festival') ||
    lower.includes('diwali') ||
    lower.includes('holi') ||
    lower.includes('durga puja') ||
    lower.includes('pongal') ||
    lower.includes('onam') ||
    lower.includes('civilization') ||
    lower.includes('temple') ||
    lower.includes('freedom movement') ||
    (lower.includes('india') && !lower.includes('constitution') && !lower.includes('law'))
  ) {
    domain = 'culture-history-heritage';
  }

  // Extract core keywords
  const keywords = topic
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !['and', 'the', 'for', 'with', 'from', 'into'].includes(w));

  // Domain-specific metadata and queries
  switch (domain) {
    case 'climate-environment': {
      const isAirPollution =
        lower.includes('pollution') ||
        lower.includes('air quality') ||
        lower.includes('aqi') ||
        lower.includes('smog') ||
        lower.includes('particulate') ||
        lower.includes('pm2.5') ||
        lower.includes('pm10');

      if (isAirPollution) {
        return {
          rawTopic: topic,
          normalizedTitle: 'Air Pollution in India: Sources, Dynamics, Health Impacts & Mitigation Strategies',
          slug,
          domain: 'climate-environment',
          keywords,
          eyebrows: {
            title: 'ATMOSPHERIC DYNAMICS, EPIDEMIOLOGY & POLICY ROADMAP',
            overview: 'MULTI-SECTORAL DRIVERS OF AIR QUALITY DEGRADATION',
            concept: 'PM2.5 / PM10 SPECIATION & METEOROLOGICAL INVERSION',
            process: 'SEASONAL POLLUTION CYCLE ACROSS THE INDO-GANGETIC PLAIN',
            comparison: 'PRIMARY VEHICULAR EXHAUST vs SECONDARY INORGANIC AEROSOLS',
            statistics: 'EPIDEMIOLOGICAL BURDEN & AMBIENT AQI BENCHMARKS',
            table: 'SOURCE APPORTIONMENT & SECTORAL EMISSIONS INVENTORY',
            caseStudy: 'DELHI-NCR AIRSHED MITIGATION: NCAP & CAQM FRAMEWORKS',
            takeaways: 'STRATEGIC INTERVENTIONS FOR CLEAN AIR GOVERNANCE',
            conclusion: 'TOWARDS BREATHABLE SKIES: A COMPREHENSIVE CLEAN AIR HORIZON',
          },
          imageQueries: {
            hero: { query: 'delhi smog india air pollution', purpose: 'Dense winter smog and atmospheric particulate haze over New Delhi urban landscape' },
            concept: { query: 'factory smoke air pollution industrial emissions', purpose: 'Industrial particulate emissions, sulfur dioxide plumes, and aerosol suspension' },
            caseStudy: { query: 'electric bus public transport modern city', purpose: 'Zero-emission electric public bus rapid transit and urban clean mobility transition' },
            process: { query: 'crop burning field agriculture smoke', purpose: 'Post-harvest agricultural crop residue stubble burning in farm fields' },
            statistics: { query: 'traffic congestion air pollution cars road city', purpose: 'Dense vehicular traffic congestion, tailpipe exhaust, and urban transportation emissions' },
          },
        };
      }

      return {
        rawTopic: topic,
        normalizedTitle: topic,
        slug,
        domain,
        keywords,
        eyebrows: {
          title: 'EARTH SYSTEM SCIENCE & CLIMATE ADAPTATION',
          overview: 'PHYSICAL MECHANICS OF GREENHOUSE FORCING',
          concept: 'ANTHROPOGENIC CARBON BUDGET & TRAJECTORIES',
          process: 'DECARBONIZATION & CLEAN ENERGY TRANSITION',
          comparison: 'FOSSIL FUEL COMBUSTION vs RENEWABLE ELECTRIFICATION',
          statistics: 'EMPIRICAL CLIMATE INDICATORS (IPCC & NOAA)',
          table: 'SECTORAL MITIGATION BENCHMARKS & ABATEMENT',
          caseStudy: 'UTILITY-SCALE OFFSHORE WIND GRID TRANSITION',
          takeaways: 'STRATEGIC CLIMATE POLICY & INTERNATIONAL DIRECTIVES',
          conclusion: 'SECURING A CLIMATE-RESILIENT PLANET',
        },
        imageQueries: {
          hero: { query: 'glacier ice arctic melting climate change', purpose: 'Hero visual of climate change and melting glaciers' },
          concept: { query: 'solar panels wind turbines renewable energy green technology', purpose: 'Renewable clean energy infrastructure concept visual' },
          caseStudy: { query: 'wind farm offshore renewable electricity turbines', purpose: 'Commercial renewable energy grid transition case study' },
          process: { query: 'electric vehicle charging station solar energy', purpose: 'Clean energy transition infrastructure and electrification' },
          statistics: { query: 'smog air pollution factory emissions', purpose: 'Atmospheric carbon emissions and pollution indicators' },
        },
      };
    }

    case 'biotechnology-botany':
      return {
        rawTopic: topic,
        normalizedTitle: topic,
        slug,
        domain,
        keywords,
        eyebrows: {
          title: 'PLANT BIOTECHNOLOGY & MICROPROPAGATION',
          overview: 'CELLULAR TOTIPOTENCY & PHYSIOLOGICAL BASES',
          concept: 'IN-VITRO MEDIA CHEMISTRY & NUTRIENTS',
          process: 'FOUR-STAGE MICROPROPAGATION LIFECYCLE',
          comparison: 'CONVENTIONAL SEED PROPAGATION vs IN-VITRO CLONING',
          statistics: 'PROPAGATION EFFICIENCY & SURVIVAL BENCHMARKS',
          table: 'STAGE PERFORMANCE & MULTIPLICATION BENCHMARKS',
          caseStudy: 'COMMERCIAL BANANA & ORCHID TISSUE CULTURE',
          takeaways: 'GENETIC FIDELITY & LABORATORY QC DIRECTIVES',
          conclusion: 'SCALING BOTANICAL BIOTECHNOLOGY & CONSERVATION',
        },
        imageQueries: {
          hero: { query: 'plant tissue culture in vitro', purpose: 'Hero photo of sterile plant tissue culture laboratory' },
          concept: { query: 'plant cell culture', purpose: 'Callus induction and cellular regeneration in petri dish' },
          caseStudy: { query: 'greenhouse plant nursery', purpose: 'Ex-vitro acclimatization in commercial greenhouse' },
          process: { query: 'plant tissue culture laboratory in vitro', purpose: 'Sterile tissue culture workstation and laboratory procedure' },
          statistics: { query: 'plant seedling nursery growth multiplication', purpose: 'Propagated plantlets demonstrating high multiplication rates' },
        },
      };

    case 'law-governance': {
      const isHyderabadMunicipal =
        lower.includes('hyderabad') ||
        lower.includes('ghmc') ||
        lower.includes('municipal') ||
        lower.includes('corporation');

      if (isHyderabadMunicipal) {
        return {
          rawTopic: topic,
          normalizedTitle: 'Municipal Corporation in Hyderabad: Governance, Infrastructure & Urban Administration',
          slug,
          domain: 'law-governance',
          keywords,
          eyebrows: {
            title: 'URBAN GOVERNANCE, INFRASTRUCTURE & CIVIC SERVICES',
            overview: 'FOUR-PILLAR CIVIC & ADMINISTRATIVE FRAMEWORK',
            concept: 'ZONAL DECENTRALIZATION & WARD ADMINISTRATION',
            process: 'MUNICIPAL SERVICE DELIVERY & CITIZEN E-GOVERNANCE',
            comparison: 'CONVENTIONAL MANUAL CIVIC OPERATIONS vs DIGITAL SMART GOVERNANCE',
            statistics: 'GHMC ADMINISTRATIVE METRICS & CIVIC REACH',
            table: 'MUNICIPAL REVENUE STREAMS & CAPITAL EXPENDITURE ALLOCATION',
            caseStudy: 'STRATEGIC ROAD DEVELOPMENT PLAN (SRDP) & INFRASTRUCTURE MODERNIZATION',
            takeaways: 'STRATEGIC REFORMS FOR SUSTAINABLE URBAN GOVERNANCE',
            conclusion: 'BUILDING A LIVEABLE, CLIMATE-RESILIENT SMART MEGACITY',
          },
          imageQueries: {
            hero: { query: 'charminar hyderabad monument city', purpose: 'Iconic Charminar monument and urban historic landscape of Hyderabad' },
            concept: { query: 'hyderabad city skyline urban architecture', purpose: 'Modern urban infrastructure, flyovers, and cityscape in Hyderabad' },
            caseStudy: { query: 'durgam cheruvu bridge hyderabad infrastructure', purpose: 'Strategic road development and iconic cable-stayed bridge infrastructure' },
            process: { query: 'hyderabad city street urban municipal', purpose: 'Urban municipal sanitation, solid waste management, and civic operations' },
            statistics: { query: 'hyderabad city skyline modern buildings', purpose: 'HITEC City financial district and modern municipal expansion in Hyderabad' },
          },
        };
      }

      return {
        rawTopic: topic,
        normalizedTitle: topic,
        slug,
        domain,
        keywords,
        eyebrows: {
          title: 'CONSTITUTIONAL LAW & JURISPRUDENCE',
          overview: 'HISTORICAL GENESIS & CONSTITUENT ASSEMBLY',
          concept: 'PHILOSOPHY OF THE PREAMBLE & SOVEREIGNTY',
          process: 'LEGISLATIVE & CONSTITUTIONAL AMENDMENT PROCESS',
          comparison: 'FUNDAMENTAL RIGHTS vs DIRECTIVE PRINCIPLES',
          statistics: 'CONSTITUTIONAL FRAMEWORK & JUDICIAL BENCHMARKS',
          table: 'FUNDAMENTAL RIGHTS CATEGORIES & REMEDIES',
          caseStudy: 'KESAVANANDA BHARATI LANDMARK JUDICIAL REVIEW',
          takeaways: 'SEPARATION OF POWERS & GOVERNANCE DIRECTIVES',
          conclusion: 'LIVING CONSTITUTIONALISM & DEMOCRATIC VISION',
        },
        imageQueries: {
          hero: { query: 'parliament house new delhi', purpose: 'Hero visual of parliament building in New Delhi India' },
          concept: { query: 'scales of justice law', purpose: 'Concept visual representing rule of law and judicial review' },
          caseStudy: { query: 'courtroom gavel law', purpose: 'Landmark constitutional bench hearing case study' },
          process: { query: 'parliament session debate legislation', purpose: 'Parliamentary legislative session and democratic debate' },
          statistics: { query: 'constitution document parchment law book', purpose: 'Constitutional law document and legal archives' },
        },
      };
    }

    case 'healthcare-medicine':
      return {
        rawTopic: topic,
        normalizedTitle: topic,
        slug,
        domain,
        keywords,
        eyebrows: {
          title: 'BIOMEDICAL INFORMATICS & CLINICAL AI',
          overview: 'CLINICAL AI DEPLOYMENT ROADMAP',
          concept: 'DEEP LEARNING DIAGNOSTIC ARCHITECTURE',
          process: 'END-TO-END CLINICAL TRIAGE PIPELINE',
          comparison: 'MANUAL RADIOLOGY TRIAGE vs AI-ASSISTED SCREENING',
          statistics: 'MULTI-MODALITY CLINICAL VALIDATION BENCHMARKS',
          table: 'DIAGNOSTIC SENSITIVITY & SPECIFICITY BENCHMARKS',
          caseStudy: 'EMERGENCY ROOM STROKE & TRAUMA AI DEPLOYMENT',
          takeaways: 'EXECUTIVE CLINICAL LEADERSHIP DIRECTIVES',
          conclusion: 'TRANSFORMING MODERN HEALTHCARE',
        },
        imageQueries: {
          hero: { query: 'doctor reviewing medical imaging ct scan mri hospital', purpose: 'Hero visual of clinician analyzing digital diagnostic imaging' },
          concept: { query: 'medical radiology x-ray computed tomography scan screen', purpose: 'Multi-slice diagnostic medical imaging scan' },
          caseStudy: { query: 'hospital emergency room intensive care monitoring doctor', purpose: 'Clinical emergency triage deployment case study' },
          process: { query: 'medical imaging workstation radiology department', purpose: 'Radiology PACS workstation diagnostic triage pipeline' },
          statistics: { query: 'medical research laboratory clinical data analysis', purpose: 'Clinical validation and medical research data analysis' },
        },
      };

    case 'cybersecurity-computing':
      return {
        rawTopic: topic,
        normalizedTitle: topic,
        slug,
        domain,
        keywords,
        eyebrows: {
          title: 'EMBEDDED SYSTEMS CYBERSECURITY',
          overview: 'DEFENSE-IN-DEPTH ROADMAP',
          concept: 'SILICON-LEVEL INTEGRITY & HARDWARE ROOT OF TRUST',
          process: 'AUTOMATED FIRMWARE PATCHING & CVE REMEDIATION',
          comparison: 'LEGACY PERIMETER FIREWALLS vs ZERO-TRUST MICROSEGMENTATION',
          statistics: 'EMPIRICAL THREAT AUDITS (NIST & ENISA EVIDENCE)',
          table: 'ZERO-TRUST MITIGATION BENCHMARKS FOR CONNECTED DEVICES',
          caseStudy: 'MIRAI BOTNET INFILTRATION & INDUSTRIAL DEFENSE',
          takeaways: 'STRATEGIC DIRECTIVES FOR CISOs',
          conclusion: 'SECURING THE CONNECTED FUTURE',
        },
        imageQueries: {
          hero: { query: 'server room data center', purpose: 'Server room data center network hardware' },
          concept: { query: 'microchip electronic integrated circuit', purpose: 'Microchip electronic processor silicon circuit' },
          caseStudy: { query: 'network operations center computer monitors', purpose: 'Security operations center monitoring screens' },
          process: { query: 'cybersecurity analyst computer terminal code', purpose: 'Security engineer performing firmware analysis and patching' },
          statistics: { query: 'IoT devices connected smart sensors hardware', purpose: 'Connected embedded IoT devices and sensor hardware' },
        },
      };

    case 'plant-biology-photosynthesis':
      return {
        rawTopic: topic,
        normalizedTitle: topic.toLowerCase().includes('photosynthesis') ? 'Photosynthesis in Plants: Bioenergetics & Mechanisms' : topic,
        slug,
        domain: 'plant-biology-photosynthesis',
        keywords,
        eyebrows: {
          title: 'PLANT BIOENERGETICS & MOLECULAR PHOTOSYNTHESIS',
          overview: 'BIOPHYSICAL ROADMAP OF SOLAR ENERGY CONVERSION',
          concept: 'CHLOROPLAST ULTRASTRUCTURE & LIGHT-HARVESTING COMPLEXES',
          process: 'THYLAKOID ELECTRON TRANSPORT & Z-SCHEME',
          comparison: 'C3 vs C4 & CAM CARBON FIXATION PATHWAYS',
          statistics: 'EMPIRICAL PHOTOSYNTHETIC EFFICIENCY & QUANTUM YIELD',
          table: 'PHOTOSYNTHETIC PATHWAY BENCHMARKS & BIOCHEMICAL METRICS',
          caseStudy: 'HYDROPONIC CANOPY ACCELERATION & LIGHT OPTIMIZATION',
          takeaways: 'AGRONOMIC DIRECTIVES FOR HARVEST INDEX MAXIMIZATION',
          conclusion: 'HARNESSING BIOENERGETIC EFFICIENCY FOR GLOBAL FOOD SECURITY',
        },
        imageQueries: {
          hero: { query: 'chloroplast plant cell', purpose: 'Hero visual of plant chloroplast and cellular photosynthesis structure' },
          concept: { query: 'plant leaf sunlight green', purpose: 'Light absorption and bioenergetic solar conversion in green leaf' },
          caseStudy: { query: 'greenhouse plants lighting', purpose: 'Optimized artificial lighting and photosynthetic yield acceleration' },
          process: { query: 'stomata plant cell microscope', purpose: 'Microscopic stomatal gas exchange and thylakoid membrane ultrastructure' },
          statistics: { query: 'plant seedling laboratory sprout', purpose: 'Empirical photosynthetic quantum yield and carbon assimilation metrics' },
        },
      };

    case 'blockchain-computing':
      return {
        rawTopic: topic,
        normalizedTitle: topic.toLowerCase().includes('blockchain') ? 'Blockchain Technology & Decentralized Applications' : topic,
        slug,
        domain: 'blockchain-computing',
        keywords,
        eyebrows: {
          title: 'DISTRIBUTED LEDGER TECHNOLOGY & CONSENSUS PROTOCOLS',
          overview: 'DECENTRALIZED ARCHITECTURE & SYSTEM TAXONOMY',
          concept: 'CRYPTOGRAPHIC INTEGRITY & MERKLE TREE PRIMITIVES',
          process: 'DISTRIBUTED TRANSACTION LIFECYCLE & CONSENSUS EXECUTION',
          comparison: 'PROOF OF WORK vs PROOF OF STAKE CONSENSUS',
          statistics: 'EMPIRICAL NETWORK METRICS & SCALABILITY AUDITS',
          table: 'LAYER-1 vs LAYER-2 BENCHMARKS & THROUGHPUT COMPARISON',
          caseStudy: 'ENTERPRISE SUPPLY CHAIN TRACEABILITY ON PERMISSIONED LEDGERS',
          takeaways: 'STRATEGIC DIRECTIVES FOR ENTERPRISE DECENTRALIZATION',
          conclusion: 'ARCHITECTING TRUST IN THE DECENTRALIZED WEB',
        },
        imageQueries: {
          hero: { query: 'bitcoin cryptocurrency digital technology', purpose: 'Hero visual of decentralized blockchain network nodes and cryptographic ledger' },
          concept: { query: 'cryptography digital code computer', purpose: 'Cryptographic hash functions and immutable block chain structure' },
          caseStudy: { query: 'data center computer servers network', purpose: 'Enterprise distributed ledger deployment and smart contract execution' },
          process: { query: 'programmer code computer screen software', purpose: 'Smart contract development and consensus validation pipeline' },
          statistics: { query: 'server room data center computer network', purpose: 'Blockchain transaction throughput and network scalability benchmarks' },
        },
      };

    case 'culture-history-heritage': {
      const isFestival =
        lower.includes('festival') ||
        lower.includes('diwali') ||
        lower.includes('holi') ||
        lower.includes('navratri') ||
        lower.includes('durga puja') ||
        lower.includes('pongal') ||
        lower.includes('onam');

      if (isFestival) {
        return {
          rawTopic: topic,
          normalizedTitle: 'Indian Cultural Festivals: Celebrations, Rituals & Living Heritage',
          slug,
          domain: 'culture-history-heritage',
          keywords,
          eyebrows: {
            title: 'INDIAN CULTURAL FESTIVALS & LIVING TRADITIONS',
            overview: 'THE CELEBRATORY TAPESTRY OF INDIAN FESTIVALS',
            concept: 'PHILOSOPHICAL PILLARS: LIGHT, HARVEST & COSMIC RHYTHMS',
            process: 'PAN-INDIAN FESTIVAL CALENDAR ACROSS SEASONS',
            comparison: 'REGIONAL HARVEST FESTIVALS: PONGAL vs ONAM vs MAKAR SANKRANTI',
            statistics: 'UNESCO INTANGIBLE CULTURAL HERITAGE BENCHMARKS',
            table: 'MAJOR FESTIVALS: REGIONS, SIGNIFICANCE & SIGNATURE RITUALS',
            caseStudy: 'DURGA PUJA: UNESCO GLOBAL BENCHMARK IN COMMUNITY ART',
            takeaways: 'STRATEGIC PRESERVATION & SUSTAINABLE CELEBRATIONS',
            conclusion: 'CELEBRATING PLURALISM: THE LIVING SOUL OF INDIAN FESTIVITIES',
          },
          imageQueries: {
            hero: { query: 'diwali oil lamps light india festival', purpose: 'Hero visual of glowing traditional Diwali oil lamps and festive lights in India' },
            concept: { query: 'holi festival colors india celebration', purpose: 'Vibrant celebration of colors, community unity, and joy during Holi festival' },
            caseStudy: { query: 'durga puja idol kolkata india', purpose: 'Artistic Durga idol sculpture and community festival pavilion in Kolkata' },
            process: { query: 'pongal harvest festival india pot', purpose: 'Traditional Pongal harvest celebration, earthen pot, and sugarcane ritual in Tamil Nadu' },
            statistics: { query: 'kumbh mela ganga ghat india festival', purpose: 'UNESCO Intangible Cultural Heritage gathering and sacred bath congregation at Kumbh Mela' },
          },
        };
      }

      return {
        rawTopic: topic,
        normalizedTitle: topic.toLowerCase().includes('culture') ? 'Indian Culture & Heritage' : topic,
        slug,
        domain: 'culture-history-heritage',
        keywords,
        eyebrows: {
          title: 'INDIAN CIVILIZATION, HERITAGE & LIVING TRADITIONS',
          overview: 'CIVILIZATIONAL PILLARS OF INDIAN HERITAGE',
          concept: 'UNITY IN DIVERSITY & PHILOSOPHICAL PLURALISM',
          process: 'HISTORICAL ERAS OF CULTURAL EVOLUTION',
          comparison: 'HINDUSTANI vs CARNATIC CLASSICAL TRADITIONS',
          statistics: 'CULTURAL HERITAGE BENCHMARKS & UNESCO RECOGNITIONS',
          table: 'CLASSICAL DANCE DISCIPLINES & REGIONAL LINEAGES',
          caseStudy: 'VARANASI: CONTINUUM OF LIVING SPIRITUAL HERITAGE',
          takeaways: 'STRATEGIC DIRECTIVES FOR HERITAGE STEWARDSHIP',
          conclusion: 'SUSTAINING CIVILIZATIONAL PLURALISM FOR POSTERITY',
        },
        imageQueries: {
          hero: { query: 'taj mahal agra india monument', purpose: 'Hero visual of world heritage monument representing Indian architecture' },
          concept: { query: 'bharatanatyam indian classical dance', purpose: 'Concept visual of Indian classical performing arts and traditions' },
          caseStudy: { query: 'varanasi ganga ghats boats india', purpose: 'Varanasi cultural continuum on sacred Ganga ghats case study' },
          process: { query: 'ajanta caves ancient fresco painting india', purpose: 'Historical and artistic evolution of ancient Indian monuments' },
          statistics: { query: 'konark sun temple chariot stone wheel india', purpose: 'UNESCO World Heritage monument architectural heritage' },
        },
      };
    }

    case 'agriculture-agtech':
    default:
      return {
        rawTopic: topic,
        normalizedTitle: topic,
        slug,
        domain: 'agriculture-agtech',
        keywords,
        eyebrows: {
          title: 'AGRONOMIC ADAPTATION & CLIMATE RESILIENCE',
          overview: 'EXECUTIVE ROADMAP',
          concept: 'CORE SENSING ARCHITECTURE',
          process: 'CLOSED-LOOP VARIABLE-RATE PRECISION CYCLE',
          comparison: 'CONVENTIONAL FARMING vs PRECISION RESILIENCE',
          statistics: 'EMPIRICAL INPUT REDUCTIONS (USDA & FAO EVIDENCE)',
          table: 'CROP YIELD PRESERVATION UNDER CLIMATE STRESS',
          caseStudy: 'COMMERCIAL AGRONOMIC FIELD DEPLOYMENT',
          takeaways: 'STRATEGIC SYNTHESIS',
          conclusion: 'SECURING GLOBAL FOOD SYSTEMS',
        },
        imageQueries: {
          hero: { query: 'agriculture wheat field drone', purpose: 'Hero precision agriculture drone and crop field' },
          concept: { query: 'soil moisture sensor agriculture', purpose: 'In-situ soil capacitance moisture sensor hardware' },
          caseStudy: { query: 'combine harvester field agriculture', purpose: 'Commercial combine harvester precision machinery' },
          process: { query: 'agricultural sprayer tractor field precision dosing', purpose: 'Variable-rate precision sprayer tractor in crop field' },
          statistics: { query: 'crop irrigation pivot system water', purpose: 'Center-pivot irrigation system and water resource management' },
        },
      };
  }
}
