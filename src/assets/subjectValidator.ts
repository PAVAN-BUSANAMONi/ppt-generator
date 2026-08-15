/**
 * STEP 28 — EXACT SLIDE-LEVEL SUBJECT VALIDATOR & HARD NEGATIVE FILTER
 *
 * Enforces strict semantic relevance rules:
 * 1. Categorizes exact slide-level topic domain.
 * 2. Applies Hard Negative Keyword filtering (immediate rejection of cross-domain noise).
 * 3. Enforces Positive Subject Affinity (mandatory domain keywords).
 * 4. Bounded scoring (0-100) with strict rejection below minRelevanceThreshold.
 */

import { ImageAsset } from './imageTypes';
import { VisualPlan } from '../visuals/visualTypes';

export interface SubjectValidationResult {
  valid: boolean;
  relevanceScore: number;
  domainCompatible: boolean;
  rejectionReasons: string[];
}

export type SubjectDomain =
  | 'biotechnology-botany'
  | 'law-governance'
  | 'climate-environment'
  | 'healthcare-medicine'
  | 'cybersecurity-computing'
  | 'agriculture-agtech'
  | 'culture-history-heritage'
  | 'plant-biology-photosynthesis'
  | 'blockchain-computing'
  | 'general';

interface DomainRules {
  domain: SubjectDomain;
  requiredKeywords: string[];
  forbiddenKeywords: string[];
}

export function determineSubjectDomain(query: string): DomainRules {
  const qLower = query.toLowerCase();

  // 0A. PLANT BIOLOGY & PHOTOSYNTHESIS (Light Reactions, Calvin Cycle, Chloroplasts)
  if (
    qLower.includes('photosynthesis') ||
    qLower.includes('chloroplast') ||
    qLower.includes('thylakoid') ||
    qLower.includes('calvin cycle') ||
    qLower.includes('chlorophyll') ||
    qLower.includes('light reaction') ||
    qLower.includes('carbon fixation') ||
    qLower.includes('rubisco') ||
    qLower.includes('stoma') ||
    qLower.includes('stomata') ||
    qLower.includes('leaf')
  ) {
    return {
      domain: 'plant-biology-photosynthesis',
      requiredKeywords: [
        'photosynthesis', 'chloroplast', 'thylakoid', 'chlorophyll', 'leaf',
        'plant', 'light', 'calvin', 'stomata', 'stoma', 'bioenergetics',
        'solar', 'glucose', 'atp', 'rubisco', 'botany', 'cell', 'green', 'sunlight',
        'microscope', 'greenhouse', 'laboratory', 'seedling', 'sprout', 'flora'
      ],
      forbiddenKeywords: [
        'testis', 'testicle', 'mouse', 'rat', 'animal', 'meat', 'human clinical',
        'hospital surgery', 'server rack', 'cybersecurity', 'malware', 'us supreme court'
      ],
    };
  }

  // 0B. BLOCKCHAIN & DECENTRALIZED SYSTEMS
  if (
    qLower.includes('blockchain') ||
    qLower.includes('distributed ledger') ||
    qLower.includes('smart contract') ||
    qLower.includes('consensus') ||
    qLower.includes('cryptocurrency') ||
    qLower.includes('ethereum') ||
    qLower.includes('bitcoin') ||
    qLower.includes('merkle') ||
    qLower.includes('hash') ||
    qLower.includes('crypto')
  ) {
    return {
      domain: 'blockchain-computing',
      requiredKeywords: [
        'blockchain', 'distributed', 'ledger', 'smart', 'contract', 'crypto',
        'cryptocurrency', 'cryptography', 'consensus', 'ethereum', 'bitcoin',
        'node', 'network', 'hash', 'merkle', 'decentralized', 'token', 'digital',
        'server', 'code', 'data', 'center', 'computer', 'programmer', 'software', 'analytics', 'screen'
      ],
      forbiddenKeywords: [
        'agriculture', 'tractor', 'crop', 'soil', 'fertilizer', 'patient surgery',
        'hospital ward', 'plant leaf', 'testis', 'greenhouse'
      ],
    };
  }

  // 0. CULTURE, HISTORY & HERITAGE (Indian Culture, Architecture, Monuments, Classical Arts)
  if (
    qLower.includes('culture') ||
    qLower.includes('heritage') ||
    qLower.includes('monument') ||
    qLower.includes('dance') ||
    qLower.includes('music') ||
    qLower.includes('temple') ||
    qLower.includes('taj mahal') ||
    qLower.includes('varanasi') ||
    qLower.includes('ajanta') ||
    qLower.includes('konark') ||
    qLower.includes('hampi') ||
    qLower.includes('bharatanatyam') ||
    qLower.includes('kathak') ||
    qLower.includes('art') ||
    qLower.includes('tradition') ||
    qLower.includes('history')
  ) {
    return {
      domain: 'culture-history-heritage',
      requiredKeywords: [
        'india', 'indian', 'culture', 'heritage', 'monument', 'temple', 'dance',
        'music', 'art', 'classical', 'tradition', 'architecture', 'varanasi',
        'taj mahal', 'hampi', 'ajanta', 'ellora', 'konark', 'bharatanatyam',
        'kathak', 'ghat', 'unesco', 'sculpture', 'painting', 'history', 'ancient',
        'mahal', 'delhi', 'agra', 'kerala', 'odisha', 'rajasthan', 'karnataka',
        'buddhist', 'hindu', 'sanskrit', 'stone', 'carving'
      ],
      forbiddenKeywords: [
        'testis', 'clinical patient', 'hospital surgery', 'server rack',
        'cybersecurity', 'malware', 'botnet', 'soybean planting', 'combine harvester',
        'us supreme court', 'white house'
      ],
    };
  }

  // 1. BIOTECHNOLOGY & BOTANY (Plant Tissue Culture, Micropropagation)
  if (
    qLower.includes('tissue culture') ||
    qLower.includes('micropropagation') ||
    qLower.includes('callus') ||
    qLower.includes('explant') ||
    qLower.includes('plant cell') ||
    qLower.includes('botan') ||
    (qLower.includes('plant') && !qLower.includes('power plant') && !qLower.includes('industrial plant'))
  ) {
    return {
      domain: 'biotechnology-botany',
      requiredKeywords: [
        'plant', 'flora', 'botany', 'botanical', 'leaf', 'seedling', 'callus',
        'shoot', 'explant', 'in vitro', 'micropropagation', 'agar', 'culture',
        'tissue', 'greenhouse', 'nursery', 'sprout', 'orchid', 'banana', 'crop',
        'vegetation', 'petri', 'seed', 'horticulture', 'agriculture', 'lab', 'laboratory'
      ],
      forbiddenKeywords: [
        'testis', 'testicle', 'sperm', 'ovary', 'mouse', 'rat', 'murine', 'human',
        'patient', 'clinical', 'hospital', 'cancer', 'tumor', 'neuron', 'brain',
        'skin', 'mammal', 'mammalian', 'animal', 'meat', 'blood', 'surgery',
        'veterinary', 'heart', 'kidney', 'liver', 'medical diagnosis'
      ],
    };
  }

  // 2. LAW, CONSTITUTION & GOVERNANCE (Indian Constitution, Municipal Corporations, Urban Governance)
  if (
    qLower.includes('constitution') ||
    qLower.includes('supreme court') ||
    qLower.includes('preamble') ||
    qLower.includes('fundamental rights') ||
    qLower.includes('parliament') ||
    qLower.includes('justice') ||
    qLower.includes('gavel') ||
    qLower.includes('law') ||
    qLower.includes('court') ||
    qLower.includes('municipal') ||
    qLower.includes('hyderabad') ||
    qLower.includes('ghmc') ||
    qLower.includes('urban governance') ||
    qLower.includes('corporation')
  ) {
    return {
      domain: 'law-governance',
      requiredKeywords: [
        'constitution', 'preamble', 'parliament', 'lok sabha', 'rajya sabha',
        'supreme court', 'court', 'law', 'justice', 'gavel', 'legal', 'judge',
        'courtroom', 'lady justice', 'scales of justice', 'statue of justice',
        'rights', 'jurisprudence', 'charter', 'treaty', 'india', 'indian',
        'delhi', 'ashoka', 'bench', 'statue', 'scales', 'book',
        'hyderabad', 'charminar', 'ghmc', 'municipal', 'corporation', 'urban',
        'civic', 'governance', 'infrastructure', 'bridge', 'skyline', 'hitec city',
        'sanitation', 'city', 'ward', 'zonal', 'telangana', 'building', 'street', 'road',
        'durgam', 'cheruvu', 'waste', 'workers', 'modern', 'architecture', 'monument',
        'bus', 'metro', 'transit', 'station', 'electric', 'transport'
      ],
      forbiddenKeywords: [
        'us supreme court', 'united states supreme court', 'scotus',
        'washington dc', 'american supreme court', 'uk supreme court',
        'westminster', 'french constitution', 'texas', 'california',
        'white house', 'capitol hill', 'us capitol', 'department of justice building washington',
        'testis', 'tumor biopsy'
      ],
    };
  }

  // 3. CLIMATE CHANGE & ENVIRONMENT (Global Warming, Air Pollution, Decarbonization)
  if (
    qLower.includes('climate') ||
    qLower.includes('warming') ||
    qLower.includes('glacier') ||
    qLower.includes('arctic') ||
    qLower.includes('ice') ||
    qLower.includes('decarbonization') ||
    qLower.includes('renewable') ||
    qLower.includes('solar panel') ||
    qLower.includes('wind turbine') ||
    qLower.includes('greenhouse gas') ||
    qLower.includes('pollution') ||
    qLower.includes('aqi') ||
    qLower.includes('smog') ||
    qLower.includes('weather') ||
    qLower.includes('atmosphere') ||
    qLower.includes('meteorolog') ||
    qLower.includes('environment')
  ) {
    return {
      domain: 'climate-environment',
      requiredKeywords: [
        'climate', 'warming', 'glacier', 'ice', 'arctic', 'antarctic', 'co2',
        'emissions', 'temperature', 'renewable', 'solar', 'wind', 'turbine',
        'atmosphere', 'sea level', 'ocean', 'greenhouse', 'energy transition',
        'decarbonization', 'photovoltaic', 'smog', 'pollution', 'river', 'water', 'environment',
        'station', 'weather', 'meteorological', 'observatory', 'instrumentation', 'sensor', 'monitoring',
        'air', 'traffic', 'vehicles', 'transit', 'bus', 'urban', 'aqi', 'particulate', 'chimney',
        'factory', 'stubble', 'smoke', 'cars', 'road', 'haze', 'city', 'congestion'
      ],
      forbiddenKeywords: [
        'tractor harvest', 'combine harvester', 'soybean planting',
        'corn field harvest', 'herbicide spraying', 'livestock feedlot', 'hospital patient'
      ],
    };
  }

  // 4. HEALTHCARE & CLINICAL MEDICINE (AI Healthcare, Radiology)
  if (
    qLower.includes('health') ||
    qLower.includes('medic') ||
    qLower.includes('clinic') ||
    qLower.includes('hospital') ||
    qLower.includes('radiolog') ||
    qLower.includes('diagnos') ||
    qLower.includes('doctor') ||
    qLower.includes('mri') ||
    qLower.includes('ct scan') ||
    qLower.includes('x-ray') ||
    qLower.includes('patholog') ||
    qLower.includes('patient') ||
    qLower.includes('biomedical')
  ) {
    return {
      domain: 'healthcare-medicine',
      requiredKeywords: [
        'health', 'medical', 'clinical', 'hospital', 'doctor', 'radiology', 'mri',
        'ct scan', 'ct', 'scan', 'x-ray', 'diagnosis', 'patient', 'medicine',
        'pathology', 'surgery', 'ai', 'algorithm', 'nurse', 'imaging', 'retina',
        'ultrasound', 'microscope', 'laboratory', 'triage', 'stroke', 'oncology'
      ],
      forbiddenKeywords: [
        'military combat', 'weapon', 'warfare', 'artillery', 'tractor', 'crop yield', 'agriculture field'
      ],
    };
  }

  // 5. CYBERSECURITY & COMPUTING (IoT Security, Embedded Systems)
  if (
    qLower.includes('iot') ||
    qLower.includes('cyber') ||
    qLower.includes('security') ||
    qLower.includes('embedded') ||
    qLower.includes('malware') ||
    qLower.includes('botnet') ||
    qLower.includes('firmware') ||
    qLower.includes('cve') ||
    qLower.includes('ddos') ||
    qLower.includes('server') ||
    qLower.includes('data center') ||
    qLower.includes('microchip')
  ) {
    return {
      domain: 'cybersecurity-computing',
      requiredKeywords: [
        'server', 'data center', 'network', 'microchip', 'semiconductor',
        'circuit', 'cybersecurity', 'security operations', 'hardware', 'computer',
        'cable', 'processor', 'silicon', 'switch', 'router', 'terminal', 'screen', 'integrated circuit'
      ],
      forbiddenKeywords: [
        'agriculture', 'tractor', 'crop', 'soil', 'fertilizer', 'patient surgery', 'hospital ward'
      ],
    };
  }

  // 6. AGRICULTURE & AGTECH
  if (
    qLower.includes('crop') ||
    qLower.includes('farm') ||
    qLower.includes('agriculture') ||
    qLower.includes('soil') ||
    qLower.includes('irrigation') ||
    qLower.includes('agronomy')
  ) {
    return {
      domain: 'agriculture-agtech',
      requiredKeywords: [
        'crop', 'farm', 'agriculture', 'plant', 'leaf', 'botany', 'agronomy',
        'harvest', 'drone', 'field', 'precision', 'sensor', 'yield', 'soil',
        'irrigation', 'wheat', 'rice', 'corn', 'greenhouse', 'tractor', 'combine'
      ],
      forbiddenKeywords: [
        'human clinical', 'hospital patient', 'military combat', 'server rack', 'data center'
      ],
    };
  }

  return {
    domain: 'general',
    requiredKeywords: [],
    forbiddenKeywords: [],
  };
}

const STOP_WORDS = new Set(['and', 'the', 'for', 'with', 'from', 'into', 'over', 'under', 'between', 'during', 'across', 'versus', 'vs']);

export function validateImageCandidate(
  asset: ImageAsset,
  visualPlan: VisualPlan,
  query: string,
  minRelevanceThreshold: number = 65
): SubjectValidationResult {
  const rejectionReasons: string[] = [];
  const rules = determineSubjectDomain(query);
  const titleText = (asset.title || '').toLowerCase();
  const queryTerms = query
    .toLowerCase()
    .split(/[\s,.-]+/)
    .filter((t) => t.length > 2 && !STOP_WORDS.has(t));

  // 1. Hard Negative Terms Check (Immediate Rejection)
  for (const forbidden of rules.forbiddenKeywords) {
    const fLower = forbidden.toLowerCase().trim();
    // Use word-boundary match for single words or short tokens to prevent false positives like "rat" in "laboratory"
    const isWord = /^[a-z0-9]+$/i.test(fLower);
    const matched = isWord
      ? new RegExp(`\\b${fLower}\\b`, 'i').test(titleText)
      : titleText.includes(fLower);

    if (matched) {
      rejectionReasons.push(`Hard negative term "${forbidden}" found in image title "${asset.title}".`);
    }
  }

  // Specific check for Plant Tissue Culture: must not be animal / medical cell culture
  if (rules.domain === 'biotechnology-botany') {
    const hasPlantAffinity = rules.requiredKeywords.some((kw) => titleText.includes(kw));
    if (!hasPlantAffinity) {
      rejectionReasons.push(`Image title lacks required plant/botany indicator (found animal/generic cell culture).`);
    }
  }

  // Specific check for Indian Constitution: must not be foreign US/SCOTUS building
  if (rules.domain === 'law-governance') {
    if (query.toLowerCase().includes('constitution') || query.toLowerCase().includes('indian')) {
      if (titleText.includes('us supreme court') || titleText.includes('u.s. supreme court') || titleText.includes('united states') || titleText.includes('scotus') || titleText.includes('washington')) {
        rejectionReasons.push(`Foreign US Supreme Court image rejected for Indian Constitution topic.`);
      }
    }
  }

  // 2. Query Term Matches
  let termMatches = 0;
  queryTerms.forEach((term) => {
    if (titleText.includes(term)) {
      termMatches++;
    }
  });

  // 3. Domain Keywords Matches
  let domainMatches = 0;
  if (rules.requiredKeywords.length > 0) {
    rules.requiredKeywords.forEach((kw) => {
      if (titleText.includes(kw)) {
        domainMatches++;
      }
    });
  }

  let relevanceScore = 0;
  if (queryTerms.length > 0) {
    if (termMatches >= 2) {
      relevanceScore = 95;
    } else if (termMatches === 1 && domainMatches >= 1) {
      relevanceScore = 85;
    } else if (termMatches === 1) {
      relevanceScore = 75;
    } else if (domainMatches >= 2) {
      relevanceScore = 70;
    } else if (domainMatches === 1) {
      relevanceScore = 65;
    } else {
      relevanceScore = 30;
    }
  } else {
    relevanceScore = domainMatches > 0 ? 80 : 40;
  }

  // Bound relevance score strictly 0 to 100
  relevanceScore = Math.max(0, Math.min(100, relevanceScore));

  // Domain Compatibility Flag
  const domainCompatible =
    rejectionReasons.length === 0 &&
    (rules.domain === 'general' || domainMatches > 0 || termMatches >= 1);

  if (!domainCompatible && rules.domain !== 'general' && rejectionReasons.length === 0) {
    rejectionReasons.push(`Title metadata lacks required domain keywords for "${rules.domain}".`);
  }

  // Minimum Relevance Gate
  if (relevanceScore < minRelevanceThreshold) {
    rejectionReasons.push(`Relevance score ${relevanceScore} is below minimum threshold ${minRelevanceThreshold}.`);
  }

  const valid = rejectionReasons.length === 0 && domainCompatible && relevanceScore >= minRelevanceThreshold;

  return {
    valid,
    relevanceScore: valid ? relevanceScore : 0,
    domainCompatible,
    rejectionReasons,
  };
}
