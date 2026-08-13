/**
 * Step 12 — Real Image Engine Types
 *
 * Defines ImageAsset, ImageCandidate, and AttributionRecord interfaces.
 */

export interface ImageAsset {
  id: string;
  source: 'wikimedia' | 'openverse' | 'local' | string;
  sourceUrl: string;
  title: string;
  creator?: string;
  license?: string;
  width: number;
  height: number;
  localPath?: string;
}

export interface ImageCandidate {
  asset: ImageAsset;
  relevanceScore: number;
  qualityScore: number;
  orientationScore: number;
  finalScore: number;
}

export interface AttributionRecord {
  assetId: string;
  title: string;
  creator?: string;
  license?: string;
  source: string;
  sourceUrl: string;
  localPath: string;
  attributedAt: string;
}
