/**
 * STEP 50 & 51 — VISUAL SOURCE RESOLVER
 *
 * Intelligently orchestrates visual asset resolution across:
 * 1. Licensed Real Images (Wikimedia / Openverse)
 * 2. AI-Generated Visuals (Local AI Provider)
 * 3. Native Structured Graphics (Diagrams, Tables, Charts)
 */

import { VisualPlan } from './visualTypes';
import { ImageAsset, AttributionRecord } from '../assets/imageTypes';
import { AssetManager } from '../assets/assetManager';
import { AIImageProvider } from './aiImageProvider';
import { VisualSourceConfig, defaultVisualSourceConfig, VisualSourcePolicyType } from './visualSourcePolicy';

export interface VisualResolutionRequest {
  topic: string;
  sectionTitle?: string;
  slideTitle: string;
  slidePurpose: string;
  visualIntent?: string;
  audience?: string;
  theme?: string;
  visualPlan: VisualPlan;
  config?: Partial<VisualSourceConfig>;
}

export interface VisualResolutionResult {
  asset: ImageAsset | null;
  attribution?: AttributionRecord;
  sourceType: 'real' | 'ai-generated' | 'native-fallback';
  provider: string;
  decisionReport: {
    policyUsed: VisualSourcePolicyType;
    finalDecision: 'REAL_ACCEPTED' | 'AI_ACCEPTED' | 'NATIVE_FALLBACK';
    reason: string;
  };
}

export class VisualSourceResolver {
  private assetManager: AssetManager;
  private aiProvider: AIImageProvider;

  constructor(assetManager?: AssetManager, aiProvider?: AIImageProvider) {
    this.assetManager = assetManager || new AssetManager();
    this.aiProvider = aiProvider || new AIImageProvider();
  }

  resetScope(): void {
    this.assetManager.resetScope();
  }

  /**
   * Resolves the optimal visual asset for a slide according to the visual source policy.
   */
  async resolveVisual(req: VisualResolutionRequest): Promise<VisualResolutionResult> {
    const config: VisualSourceConfig = {
      ...defaultVisualSourceConfig,
      ...req.config,
    };

    const policy = config.policy;

    // 1. NATIVE ONLY MODE: immediately return native fallback without querying image sources
    if (policy === 'native-only' || req.visualPlan.type === 'none') {
      return {
        asset: null,
        sourceType: 'native-fallback',
        provider: 'native',
        decisionReport: {
          policyUsed: policy,
          finalDecision: 'NATIVE_FALLBACK',
          reason: 'Native-only policy requested; photographic assets bypassed.',
        },
      };
    }

    // 2. AI ONLY MODE
    if (policy === 'ai-only') {
      const aiRes = await this.aiProvider.generateImage({
        topic: req.topic,
        sectionTitle: req.sectionTitle,
        slideTitle: req.slideTitle,
        slidePurpose: req.slidePurpose,
        visualIntent: req.visualIntent,
        audience: req.audience,
        theme: req.theme,
        style: config.aiStyle,
      });

      if (aiRes.decisionReport.status === 'ACCEPTED' && aiRes.asset) {
        return {
          asset: aiRes.asset,
          attribution: aiRes.attribution,
          sourceType: 'ai-generated',
          provider: 'local-ai',
          decisionReport: {
            policyUsed: policy,
            finalDecision: 'AI_ACCEPTED',
            reason: 'AI visual successfully synthesized and validated against slide context.',
          },
        };
      }

      return {
        asset: null,
        sourceType: 'native-fallback',
        provider: 'none',
        decisionReport: {
          policyUsed: policy,
          finalDecision: 'NATIVE_FALLBACK',
          reason: `AI generation rejected: ${aiRes.decisionReport.reason}`,
        },
      };
    }

    // 3. REAL ONLY MODE
    if (policy === 'real-only') {
      const realRes = await this.assetManager.resolveImageForVisualPlan(req.visualPlan, req.topic);
      if (realRes.decisionReport.finalDecision === 'ACCEPTED' && realRes.asset) {
        return {
          asset: realRes.asset,
          attribution: realRes.attribution,
          sourceType: 'real',
          provider: realRes.decisionReport.provider,
          decisionReport: {
            policyUsed: policy,
            finalDecision: 'REAL_ACCEPTED',
            reason: realRes.decisionReport.reason,
          },
        };
      }

      return {
        asset: null,
        sourceType: 'native-fallback',
        provider: 'none',
        decisionReport: {
          policyUsed: policy,
          finalDecision: 'NATIVE_FALLBACK',
          reason: 'Real image search returned no acceptable candidates under strict semantic filter.',
        },
      };
    }

    // 4. AUTO & REAL-PLUS-AI MODES (Real First -> AI Second -> Native Fallback)
    // In AUTO mode:
    // For culture/heritage and real-world places, real photography is prioritized.
    // For abstract technical / biological diagrams or when real search yields 0 candidates, AI visual generation is used.
    const realRes = await this.assetManager.resolveImageForVisualPlan(req.visualPlan, req.topic);
    if (realRes.decisionReport.finalDecision === 'ACCEPTED' && realRes.asset) {
      return {
        asset: realRes.asset,
        attribution: realRes.attribution,
        sourceType: 'real',
        provider: realRes.decisionReport.provider,
        decisionReport: {
          policyUsed: policy,
          finalDecision: 'REAL_ACCEPTED',
          reason: realRes.decisionReport.reason,
        },
      };
    }

    // If real image was unavailable or rejected, check if AI image generation is enabled
    if (config.aiEnabled) {
      console.log(`[VisualSourceResolver] Real photo unavailable for "${req.slideTitle}". Synthesizing high-precision AI visual asset...`);
      const aiRes = await this.aiProvider.generateImage({
        topic: req.topic,
        sectionTitle: req.sectionTitle,
        slideTitle: req.slideTitle,
        slidePurpose: req.slidePurpose,
        visualIntent: req.visualIntent,
        audience: req.audience,
        theme: req.theme,
        style: config.aiStyle,
      });

      if (aiRes.decisionReport.status === 'ACCEPTED' && aiRes.asset) {
        console.log(`✔ AI Visual Synthesized for "${req.slideTitle}" (${aiRes.asset.source}) -> ${aiRes.asset.localPath}`);
        return {
          asset: aiRes.asset,
          attribution: aiRes.attribution,
          sourceType: 'ai-generated',
          provider: 'local-ai',
          decisionReport: {
            policyUsed: policy,
            finalDecision: 'AI_ACCEPTED',
            reason: 'Real photo unavailable; successfully resolved high-precision AI visual asset.',
          },
        };
      } else {
        console.warn(`⚠️ AI generation did not accept: ${aiRes.decisionReport.reason}`);
      }
    }

    // Fallback to native structured graphics
    return {
      asset: null,
      sourceType: 'native-fallback',
      provider: 'none',
      decisionReport: {
        policyUsed: policy,
        finalDecision: 'NATIVE_FALLBACK',
        reason: 'Real image rejected and AI generation bypassed/unavailable.',
      },
    };
  }
}
