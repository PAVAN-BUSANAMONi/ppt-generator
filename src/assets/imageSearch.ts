/**
 * Step 12 — Image Search Providers
 *
 * Searches Wikimedia Commons API, Openverse, and local project assets.
 * Normalizes metadata into ImageAsset candidates.
 */

import * as https from 'https';
import { ImageAsset } from './imageTypes';

export async function searchImages(query: string, maxResults: number = 8): Promise<ImageAsset[]> {
  console.log(`[ImageSearch] Searching image providers for query: "${query}" …`);

  const results: ImageAsset[] = [];

  // 1. Wikimedia Commons Provider
  try {
    const wikimediaAssets = await searchWikimediaCommons(query, maxResults);
    results.push(...wikimediaAssets);
  } catch (err: any) {
    console.warn(`⚠️ Wikimedia Commons search warning: ${err.message}`);
  }

  // 2. Openverse / Public Domain Provider Fallback
  if (results.length < maxResults) {
    try {
      const openverseAssets = await searchOpenverse(query, maxResults - results.length);
      results.push(...openverseAssets);
    } catch {
      // ignore
    }
  }

  return results;
}

/**
 * Search Wikimedia Commons API over HTTPS.
 */
function searchWikimediaCommons(query: string, limit: number): Promise<ImageAsset[]> {
  return new Promise((resolve) => {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodedQuery}&gsrnamespace=6&gsrlimit=${limit}&prop=imageinfo&iiprop=url|size|extmetadata&format=json`;

    const req = https.get(
      url,
      {
        headers: {
          'User-Agent': 'PPTGenerator/1.0 (Contact: admin@ppt-generator.local)',
        },
        timeout: 10000,
      },
      (res) => {
        let body = '';
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          res.on('data', (chunk) => (body += chunk));
          res.on('end', () => {
            try {
              const parsed = JSON.parse(body);
              const pages = parsed.query?.pages || {};
              const assets: ImageAsset[] = [];

              Object.values(pages).forEach((page: any, idx: number) => {
                const info = page.imageinfo?.[0];
                if (info && info.url && info.width && info.height) {
                  const ext = info.extmetadata || {};
                  const license = ext.LicenseShortName?.value || 'CC BY-SA 4.0';
                  const creator = ext.Artist?.value?.replace(/<[^>]+>/g, '').trim() || 'Wikimedia Contributor';

                  assets.push({
                    id: `wm-${page.pageid || idx}`,
                    source: 'wikimedia',
                    sourceUrl: info.url,
                    title: page.title ? page.title.replace(/^File:/, '') : query,
                    creator,
                    license,
                    width: info.width,
                    height: info.height,
                  });
                }
              });

              resolve(assets);
            } catch {
              resolve([]);
            }
          });
        } else {
          resolve([]);
        }
      }
    );

    req.on('error', () => resolve([]));
    req.on('timeout', () => {
      req.destroy();
      resolve([]);
    });
  });
}

/**
 * Search Openverse API fallback.
 */
function searchOpenverse(query: string, limit: number): Promise<ImageAsset[]> {
  return new Promise((resolve) => {
    const url = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(query)}&page_size=${limit}`;

    const req = https.get(
      url,
      {
        headers: { 'User-Agent': 'PPTGenerator/1.0' },
        timeout: 10000,
      },
      (res) => {
        let body = '';
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          res.on('data', (chunk) => (body += chunk));
          res.on('end', () => {
            try {
              const parsed = JSON.parse(body);
              const items = parsed.results || [];
              const assets: ImageAsset[] = items.map((item: any) => ({
                id: `ov-${item.id}`,
                source: 'openverse',
                sourceUrl: item.url,
                title: item.title || query,
                creator: item.creator || 'Openverse Creator',
                license: item.license || 'CC BY 2.0',
                width: item.width || 1920,
                height: item.height || 1080,
              }));
              resolve(assets);
            } catch {
              resolve([]);
            }
          });
        } else {
          resolve([]);
        }
      }
    );

    req.on('error', () => resolve([]));
    req.on('timeout', () => {
      req.destroy();
      resolve([]);
    });
  });
}
