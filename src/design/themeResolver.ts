/**
 * STEP 47 & 48 — THEME RESOLVER
 *
 * Resolves user-selected theme or automatically determines best theme pairing
 * from topic domain and presentation purpose.
 */

import { Theme, defaultTheme } from './theme';
import { THEME_REGISTRY, createCustomTheme } from './themeCatalog';
import { UniversalTopicContext } from '../core/topicContext';

export type ThemeIdentifier =
  | 'auto'
  | 'referenceEditorial'
  | 'academic'
  | 'corporate'
  | 'technology'
  | 'medical'
  | 'education'
  | 'heritage'
  | 'nature'
  | 'agriculture'
  | 'minimal'
  | 'dark'
  | 'modern'
  | 'creative'
  | 'custom';

export function resolveTheme(
  requestedTheme?: string | Theme,
  topicContext?: UniversalTopicContext,
  customConfig?: Partial<Theme>
): Theme {
  // If already a full Theme object, return directly
  if (typeof requestedTheme === 'object' && requestedTheme !== null && 'colors' in requestedTheme) {
    return requestedTheme as Theme;
  }

  const themeKey = (typeof requestedTheme === 'string' ? requestedTheme.trim() : 'auto').toLowerCase();

  // 1. Custom Theme
  if (themeKey === 'custom') {
    return createCustomTheme(customConfig || {});
  }

  // 2. Direct Registry Match
  const normalizedKeyMap: Record<string, string> = {
    referenceeditorial: 'referenceEditorial',
    editorial: 'referenceEditorial',
    academic: 'academic',
    research: 'academic',
    corporate: 'corporate',
    executive: 'corporate',
    technology: 'technology',
    tech: 'technology',
    medical: 'medical',
    clinical: 'medical',
    healthcare: 'medical',
    education: 'education',
    learning: 'education',
    heritage: 'heritage',
    culture: 'heritage',
    history: 'heritage',
    nature: 'nature',
    environment: 'nature',
    climate: 'nature',
    agriculture: 'agriculture',
    agtech: 'agriculture',
    agronomy: 'agriculture',
    minimal: 'minimal',
    minimalist: 'minimal',
    dark: 'dark',
    darkmode: 'dark',
    modern: 'modern',
    dynamic: 'modern',
    creative: 'creative',
    design: 'creative',
  };

  const matchedId = normalizedKeyMap[themeKey];
  if (matchedId && THEME_REGISTRY[matchedId]) {
    return THEME_REGISTRY[matchedId];
  }

  // 3. Auto Theme Selection (Topic Domain & Purpose Mapping)
  if (topicContext) {
    switch (topicContext.domain) {
      case 'culture-history-heritage':
        return THEME_REGISTRY.heritage;
      case 'plant-biology-photosynthesis':
      case 'climate-environment':
        return THEME_REGISTRY.nature;
      case 'biotechnology-botany':
        return THEME_REGISTRY.academic;
      case 'blockchain-computing':
      case 'cybersecurity-computing':
        return THEME_REGISTRY.technology;
      case 'healthcare-medicine':
        return THEME_REGISTRY.medical;
      case 'law-governance':
        return THEME_REGISTRY.corporate;
      case 'agriculture-agtech':
        return THEME_REGISTRY.agriculture;
      default:
        return THEME_REGISTRY.referenceEditorial;
    }
  }

  return defaultTheme;
}
