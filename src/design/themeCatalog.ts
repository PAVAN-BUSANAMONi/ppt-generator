/**
 * STEP 47 — GLOBAL THEME CATALOG
 *
 * 15 comprehensive theme definitions with distinct color palettes,
 * typography pairings, card styles, line accents, and visual density.
 */

import { Theme } from './theme';
import { canvas, grid, layout } from './grid';
import { spacing } from './spacing';
import { shapes } from './shapes';
import { shadows } from './shadows';
import { TypeStyle } from './typography';

function createTypeScale(displayFace: string, bodyFace: string) {
  return {
    display: { fontFace: displayFace, fontSize: 52, bold: true } satisfies TypeStyle,
    title: { fontFace: displayFace, fontSize: 38, bold: true } satisfies TypeStyle,
    section: { fontFace: bodyFace, fontSize: 28, bold: true } satisfies TypeStyle,
    heading: { fontFace: bodyFace, fontSize: 23, bold: true } satisfies TypeStyle,
    body: { fontFace: bodyFace, fontSize: 18, bold: false } satisfies TypeStyle,
    small: { fontFace: bodyFace, fontSize: 16, bold: false } satisfies TypeStyle,
    caption: { fontFace: bodyFace, fontSize: 12, bold: false } satisfies TypeStyle,
  };
}

// 1. Reference Editorial (Signature Theme)
export const referenceEditorialTheme: Theme = {
  name: 'referenceEditorial',
  colors: {
    ink: '#073B3A',
    ink2: '#134E4A',
    teal: '#0F766E',
    blue: '#0284C7',
    mint: '#DDF7EE',
    mint2: '#EFFBF5',
    sky: '#EAF6FF',
    gold: '#C88A1E',
    goldSoft: '#FFF3D6',
    white: '#FFFFFF',
    off: '#F7FBF8',
    slate: '#52666A',
    line: '#B9D8D4',
    dark: '#052F35',
    red: '#C2410C',
  },
  typography: createTypeScale('Aptos Display', 'Aptos'),
  canvas,
  grid,
  layout,
  spacing,
  shapes,
  shadows,
};

// 2. Academic & Research
export const academicTheme: Theme = {
  name: 'academic',
  colors: {
    ink: '#0F172A',
    ink2: '#1E293B',
    teal: '#1D4ED8',
    blue: '#2563EB',
    mint: '#F1F5F9',
    mint2: '#F8FAFC',
    sky: '#E0F2FE',
    gold: '#B45309',
    goldSoft: '#FEF3C7',
    white: '#FFFFFF',
    off: '#FAFAFA',
    slate: '#475569',
    line: '#CBD5E1',
    dark: '#0F172A',
    red: '#DC2626',
  },
  typography: createTypeScale('Georgia', 'Calibri'),
  canvas,
  grid,
  layout,
  spacing,
  shapes,
  shadows,
};

// 3. Corporate Executive
export const corporateTheme: Theme = {
  name: 'corporate',
  colors: {
    ink: '#0F172A',
    ink2: '#334155',
    teal: '#0284C7',
    blue: '#2563EB',
    mint: '#F8FAFC',
    mint2: '#F1F5F9',
    sky: '#E2E8F0',
    gold: '#D97706',
    goldSoft: '#FEF3C7',
    white: '#FFFFFF',
    off: '#F8FAFC',
    slate: '#64748B',
    line: '#CBD5E1',
    dark: '#0B1222',
    red: '#E11D48',
  },
  typography: createTypeScale('Segoe UI', 'Arial'),
  canvas,
  grid,
  layout,
  spacing,
  shapes,
  shadows,
};

// 4. Technology & Computing
export const technologyTheme: Theme = {
  name: 'technology',
  colors: {
    ink: '#090D16',
    ink2: '#1E293B',
    teal: '#06B6D4',
    blue: '#3B82F6',
    mint: '#1E293B',
    mint2: '#0F172A',
    sky: '#0284C7',
    gold: '#10B981',
    goldSoft: '#064E3B',
    white: '#F8FAFC',
    off: '#0F172A',
    slate: '#94A3B8',
    line: '#1E3A5F',
    dark: '#06090E',
    red: '#F43F5E',
  },
  typography: createTypeScale('Trebuchet MS', 'Segoe UI'),
  canvas,
  grid,
  layout,
  spacing,
  shapes,
  shadows,
};

// 5. Medical & Life Sciences
export const medicalTheme: Theme = {
  name: 'medical',
  colors: {
    ink: '#0F172A',
    ink2: '#1E293B',
    teal: '#0D9488',
    blue: '#0284C7',
    mint: '#F0FDFA',
    mint2: '#CCFBF1',
    sky: '#E0F2FE',
    gold: '#0284C7',
    goldSoft: '#E0F2FE',
    white: '#FFFFFF',
    off: '#F8FAFC',
    slate: '#475569',
    line: '#99F6E4',
    dark: '#042F2E',
    red: '#E11D48',
  },
  typography: createTypeScale('Arial', 'Calibri'),
  canvas,
  grid,
  layout,
  spacing,
  shapes,
  shadows,
};

// 6. Education & Learning
export const educationTheme: Theme = {
  name: 'education',
  colors: {
    ink: '#1E1B4B',
    ink2: '#312E81',
    teal: '#4338CA',
    blue: '#2563EB',
    mint: '#FEF3C7',
    mint2: '#FFFBEB',
    sky: '#EEF2FF',
    gold: '#D97706',
    goldSoft: '#FEF3C7',
    white: '#FFFFFF',
    off: '#FFFDF5',
    slate: '#4B5563',
    line: '#E0E7FF',
    dark: '#1E1B4B',
    red: '#DC2626',
  },
  typography: createTypeScale('Trebuchet MS', 'Verdana'),
  canvas,
  grid,
  layout,
  spacing,
  shapes,
  shadows,
};

// 7. Heritage & Cultural History
export const heritageTheme: Theme = {
  name: 'heritage',
  colors: {
    ink: '#1C1917',
    ink2: '#292524',
    teal: '#7F1D1D',
    blue: '#B45309',
    mint: '#FEF3C7',
    mint2: '#FFFBEB',
    sky: '#FAF5EE',
    gold: '#D97706',
    goldSoft: '#FEF3C7',
    white: '#FFFFFF',
    off: '#FAF5EE',
    slate: '#57534E',
    line: '#E7E5E4',
    dark: '#450A0A',
    red: '#991B1B',
  },
  typography: createTypeScale('Garamond', 'Georgia'),
  canvas,
  grid,
  layout,
  spacing,
  shapes,
  shadows,
};

// 8. Nature & Environment
export const natureTheme: Theme = {
  name: 'nature',
  colors: {
    ink: '#052E16',
    ink2: '#14532D',
    teal: '#15803D',
    blue: '#0284C7',
    mint: '#DCFCE7',
    mint2: '#F0FDF4',
    sky: '#E0F2FE',
    gold: '#CA8A04',
    goldSoft: '#FEF9C3',
    white: '#FFFFFF',
    off: '#F7FEE7',
    slate: '#3F6212',
    line: '#BBF7D0',
    dark: '#052E16',
    red: '#C2410C',
  },
  typography: createTypeScale('Trebuchet MS', 'Calibri'),
  canvas,
  grid,
  layout,
  spacing,
  shapes,
  shadows,
};

// 9. Agriculture & Agritech
export const agricultureTheme: Theme = {
  name: 'agriculture',
  colors: {
    ink: '#14532D',
    ink2: '#166534',
    teal: '#15803D',
    blue: '#0369A1',
    mint: '#ECFDF5',
    mint2: '#F0FDF4',
    sky: '#FEF9C3',
    gold: '#D97706',
    goldSoft: '#FEF3C7',
    white: '#FFFFFF',
    off: '#FCFDF7',
    slate: '#4D7C0F',
    line: '#A7F3D0',
    dark: '#064E3B',
    red: '#C2410C',
  },
  typography: createTypeScale('Aptos', 'Segoe UI'),
  canvas,
  grid,
  layout,
  spacing,
  shapes,
  shadows,
};

// 10. Minimalist Slate
export const minimalTheme: Theme = {
  name: 'minimal',
  colors: {
    ink: '#09090B',
    ink2: '#18181B',
    teal: '#27272A',
    blue: '#3F3F46',
    mint: '#F4F4F5',
    mint2: '#FAFAFA',
    sky: '#F4F4F5',
    gold: '#52525B',
    goldSoft: '#E4E4E7',
    white: '#FFFFFF',
    off: '#FFFFFF',
    slate: '#71717A',
    line: '#E4E4E7',
    dark: '#18181B',
    red: '#DC2626',
  },
  typography: createTypeScale('Arial', 'Helvetica'),
  canvas,
  grid,
  layout,
  spacing,
  shapes,
  shadows,
};

// 11. Dark Mode Studio
export const darkTheme: Theme = {
  name: 'dark',
  colors: {
    ink: '#0B0F19',
    ink2: '#111827',
    teal: '#38BDF8',
    blue: '#818CF8',
    mint: '#1F2937',
    mint2: '#111827',
    sky: '#1E293B',
    gold: '#FBBF24',
    goldSoft: '#374151',
    white: '#F9FAFB',
    off: '#0B0F19',
    slate: '#9CA3AF',
    line: '#374151',
    dark: '#030712',
    red: '#F87171',
  },
  typography: createTypeScale('Segoe UI', 'Aptos'),
  canvas,
  grid,
  layout,
  spacing,
  shapes,
  shadows,
};

// 12. Modern Dynamic
export const modernTheme: Theme = {
  name: 'modern',
  colors: {
    ink: '#0F172A',
    ink2: '#1E293B',
    teal: '#6366F1',
    blue: '#10B981',
    mint: '#EEF2FF',
    mint2: '#F8FAFC',
    sky: '#E0E7FF',
    gold: '#F59E0B',
    goldSoft: '#FEF3C7',
    white: '#FFFFFF',
    off: '#FAFAFA',
    slate: '#64748B',
    line: '#CBD5E1',
    dark: '#0F172A',
    red: '#F43F5E',
  },
  typography: createTypeScale('Aptos Display', 'Aptos'),
  canvas,
  grid,
  layout,
  spacing,
  shapes,
  shadows,
};

// 13. Creative & Design
export const creativeTheme: Theme = {
  name: 'creative',
  colors: {
    ink: '#2E1065',
    ink2: '#3B0764',
    teal: '#7C3AED',
    blue: '#C026D3',
    mint: '#F3E8FF',
    mint2: '#FAF5FF',
    sky: '#EDE9FE',
    gold: '#EA580C',
    goldSoft: '#FFEDD5',
    white: '#FFFFFF',
    off: '#FAF5FF',
    slate: '#6B21A8',
    line: '#E9D5FF',
    dark: '#2E1065',
    red: '#E11D48',
  },
  typography: createTypeScale('Trebuchet MS', 'Georgia'),
  canvas,
  grid,
  layout,
  spacing,
  shapes,
  shadows,
};

// 14. Custom Theme Factory
export function createCustomTheme(overrides: Partial<Theme>): Theme {
  return {
    name: 'custom',
    colors: { ...referenceEditorialTheme.colors, ...overrides.colors },
    typography: overrides.typography || referenceEditorialTheme.typography,
    canvas,
    grid,
    layout,
    spacing,
    shapes,
    shadows,
  };
}

export const THEME_REGISTRY: Record<string, Theme> = {
  referenceEditorial: referenceEditorialTheme,
  academic: academicTheme,
  corporate: corporateTheme,
  technology: technologyTheme,
  medical: medicalTheme,
  education: educationTheme,
  heritage: heritageTheme,
  nature: natureTheme,
  agriculture: agricultureTheme,
  minimal: minimalTheme,
  dark: darkTheme,
  modern: modernTheme,
  creative: creativeTheme,
};
