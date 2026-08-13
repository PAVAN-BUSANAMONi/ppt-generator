/**
 * Step 12 — Image Cache & Downloader
 *
 * Downloads image assets over HTTP/HTTPS and caches them locally under work/assets/.
 * Never downloads the same asset twice. Rejects broken or 0-byte downloads.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import * as https from 'https';
import { ImageAsset } from './imageTypes';

export async function cacheImageAsset(
  asset: ImageAsset,
  targetDir?: string
): Promise<ImageAsset> {
  const assetsDirectory = targetDir || path.resolve(__dirname, '..', '..', 'work', 'assets');

  if (!fs.existsSync(assetsDirectory)) {
    fs.mkdirSync(assetsDirectory, { recursive: true });
  }

  const cleanFileName = `${asset.id.replace(/[^a-z0-9]/gi, '_')}.jpg`;
  const localPath = path.join(assetsDirectory, cleanFileName);

  // Return existing local cache if present
  if (fs.existsSync(localPath) && fs.statSync(localPath).size > 5000) {
    return {
      ...asset,
      localPath,
    };
  }

  // Download image file
  try {
    const downloadedPath = await downloadFile(asset.sourceUrl, localPath);
    if (downloadedPath && fs.existsSync(downloadedPath) && fs.statSync(downloadedPath).size > 5000) {
      console.log(`✔ Cached image asset "${asset.title}" (${asset.source}) -> ${downloadedPath}`);
      return {
        ...asset,
        localPath: downloadedPath,
      };
    }
  } catch (err: any) {
    console.warn(`⚠️ Failed to download image asset "${asset.title}": ${err.message}`);
  }

  return asset;
}

function downloadFile(url: string, destPath: string, timeoutMs: number = 15000): Promise<string | null> {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(url);
      const getter = parsed.protocol === 'https:' ? https.get : http.get;

      const req = getter(
        url,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) PPTGenerator/1.0 ImageDownloader',
          },
          timeout: timeoutMs,
        },
        (res) => {
          // Handle redirects
          if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            downloadFile(res.headers.location, destPath, timeoutMs).then(resolve);
            return;
          }

          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            const fileStream = fs.createWriteStream(destPath);
            res.pipe(fileStream);

            fileStream.on('finish', () => {
              fileStream.close(() => resolve(destPath));
            });

            fileStream.on('error', () => {
              fs.unlink(destPath, () => resolve(null));
            });
          } else {
            resolve(null);
          }
        }
      );

      req.on('error', () => {
        if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
        resolve(null);
      });

      req.on('timeout', () => {
        req.destroy();
        if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
        resolve(null);
      });
    } catch {
      resolve(null);
    }
  });
}
