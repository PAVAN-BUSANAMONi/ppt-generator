/**
 * STEP 50 — VISUAL SOURCE POLICY & CONFIGURATION
 *
 * Defines the global visual source policy modes, AI visual styles,
 * and user preferences for visual resolution across all presentations.
 */

export type VisualSourcePolicyType =
  | 'auto'
  | 'real-only'
  | 'ai-only'
  | 'real-plus-ai'
  | 'native-only';

export type AIVisualStyle =
  | 'photorealistic'
  | 'editorial'
  | 'scientific-illustration'
  | 'technical-illustration'
  | 'watercolor'
  | 'minimalist'
  | 'isometric'
  | 'infographic';

export type AIImageQuality = 'standard' | 'high' | 'maximum';

export interface VisualSourceConfig {
  policy: VisualSourcePolicyType;
  aiEnabled: boolean;
  aiQuality: AIImageQuality;
  aiStyle: AIVisualStyle;
}

export const defaultVisualSourceConfig: VisualSourceConfig = {
  policy: 'auto',
  aiEnabled: true,
  aiQuality: 'maximum',
  aiStyle: 'editorial',
};
