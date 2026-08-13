/**
 * Step 12 — Image Attribution Manager
 *
 * Preserves source attribution metadata (title, creator, license, source URL, local path).
 * Stores attribution records under work/assets/attributions.json.
 */

import * as fs from 'fs';
import * as path from 'path';
import { ImageAsset, AttributionRecord } from './imageTypes';

export function recordAttribution(asset: ImageAsset): AttributionRecord {
  const record: AttributionRecord = {
    assetId: asset.id,
    title: asset.title,
    creator: asset.creator || 'Unknown Creator',
    license: asset.license || 'Public Domain / Open License',
    source: asset.source,
    sourceUrl: asset.sourceUrl,
    localPath: asset.localPath || '',
    attributedAt: new Date().toISOString(),
  };

  const attributionsPath = path.resolve(__dirname, '..', '..', 'work', 'assets', 'attributions.json');

  let existing: AttributionRecord[] = [];
  if (fs.existsSync(attributionsPath)) {
    try {
      existing = JSON.parse(fs.readFileSync(attributionsPath, 'utf-8'));
    } catch {
      existing = [];
    }
  }

  // Prevent duplicate attribution entries
  if (!existing.some((r) => r.assetId === asset.id)) {
    existing.push(record);
    const dir = path.dirname(attributionsPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(attributionsPath, JSON.stringify(existing, null, 2), 'utf-8');
  }

  return record;
}

export function formatAttributionString(record: AttributionRecord): string {
  return `Photo: "${record.title}" by ${record.creator} (${record.license}) via ${record.source}`;
}
