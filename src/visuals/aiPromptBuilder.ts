/**
 * STEP 51A — AI IMAGE GENERATION PROMPT BUILDER
 *
 * Constructs slide-grounded, high-precision visual generation prompts
 * tailored to topic, section, slide title, purpose, visual intent, and visual style.
 */

import { AIVisualStyle } from './visualSourcePolicy';

export interface AIPromptContext {
  topic: string;
  sectionTitle?: string;
  slideTitle: string;
  slidePurpose: string;
  visualIntent?: string;
  audience?: string;
  theme?: string;
  style?: AIVisualStyle;
}

export function buildAIGenerationPrompt(ctx: AIPromptContext): string {
  const style = ctx.style || 'editorial';
  const cleanTopic = ctx.topic.trim();
  const cleanTitle = ctx.slideTitle.trim();
  const cleanPurpose = ctx.slidePurpose.trim();

  let styleModifier = '';
  switch (style) {
    case 'scientific-illustration':
      styleModifier = 'clean scientific botanical/biological illustration, vector cellular cross-section, high precision anatomical detail, neutral crisp background, professional educational textbook diagram style';
      break;
    case 'technical-illustration':
      styleModifier = 'clean modern technical systems architecture diagram, vector data pipelines, modular nodes, high tech engineering visualization, precise lines, professional dark UI aesthetic';
      break;
    case 'isometric':
      styleModifier = '3D isometric technical visualization, glowing modular network nodes, geometric blocks, cyan and deep navy lighting, clean matte background, highly detailed rendering';
      break;
    case 'editorial':
      styleModifier = 'award-winning National Geographic / BBC documentary style photograph, authentic environmental context, cinematic 8k lighting, natural color grading, high detail 4k master';
      break;
    case 'photorealistic':
      styleModifier = 'ultra-realistic professional photography, 50mm f/1.8 lens, natural studio lighting, razor sharp focus, 8k resolution, authentic textures';
      break;
    case 'watercolor':
      styleModifier = 'elegant fine art watercolor illustration, delicate washes, expressive brushstrokes, archival paper texture, artistic color harmony';
      break;
    case 'minimalist':
      styleModifier = 'minimalist graphic design, bold geometric silhouettes, refined color palette, abundant negative space, modern Swiss design style';
      break;
    case 'infographic':
      styleModifier = 'modern infographic visual element, structured hierarchy, clean icons and badges, data visualization graphic, professional corporate design';
      break;
    default:
      styleModifier = 'editorial documentary photography, rich colors, professional presentation visual';
  }

  // Slide-specific contextual prompt construction
  const prompt = `${cleanTopic} — ${cleanTitle}: ${cleanPurpose}. Visual Concept: ${ctx.visualIntent || cleanPurpose}. Style: ${styleModifier}, 16:9 widescreen composition, no watermarks, no distorted text, high resolution.`;

  return prompt;
}
