/**
 * Step 12 — Image Cache & Downloader
 *
 * Downloads image assets over HTTP/HTTPS, optimizes them with sharp to slide dimensions,
 * and caches them locally under work/assets/. Never downloads the same asset twice.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as http from 'http';
import * as https from 'https';
import sharp from 'sharp';
import { ImageAsset } from './imageTypes';

export async function cacheImageAsset(
  asset: ImageAsset,
  targetDir?: string
): Promise<ImageAsset> {
  const assetsDirectory = targetDir || path.resolve(__dirname, '..', '..', 'work', 'assets');

  const cleanFileName = `${asset.id.replace(/[^a-z0-9]/gi, '_')}.jpg`;
  const thumbFileName = `${asset.id.replace(/[^a-z0-9]/gi, '_')}_thumb.jpg`;
  const localPath = path.join(assetsDirectory, cleanFileName);
  const thumbPath = path.join(assetsDirectory, thumbFileName);

  // Return existing local cache if present (>50KB)
  if (fs.existsSync(localPath) && fs.statSync(localPath).size > 50000) {
    return {
      ...asset,
      localPath,
    };
  }

  // Download raw image file to temporary path
  const rawPath = path.join(assetsDirectory, `raw_${cleanFileName}`);
  try {
    const downloadedPath = await downloadFile(asset.sourceUrl, rawPath);
    if (downloadedPath && fs.existsSync(downloadedPath) && fs.statSync(downloadedPath).size > 1000) {
      // 1. Optimize image to pristine 4K studio master (3840x2160 UHD, 4:4:4 chroma, pristine visual quality ~1.8MB-2.8MB per image)
      await sharp(downloadedPath)
        .resize({ width: 3840, height: 2160, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 98, mozjpeg: true, chromaSubsampling: '4:4:4' })
        .toFile(localPath);

      // 2. Generate thumbnail for SVG preview rendering
      await sharp(downloadedPath)
        .resize({ width: 960, height: 540, fit: 'inside' })
        .jpeg({ quality: 85 })
        .toFile(thumbPath);

      // Clean up raw temp file
      try {
        fs.unlinkSync(rawPath);
      } catch {
        // ignore
      }

      console.log(`✔ Cached & optimized presentation master "${asset.title}" (${asset.source}) -> ${localPath} (${(fs.statSync(localPath).size / 1024).toFixed(1)} KB)`);
      return {
        ...asset,
        localPath,
      };
    }
  } catch (err: any) {
    console.warn(`⚠️ Failed to process image asset "${asset.title}": ${err.message}`);
  }

  return asset;
}

function downloadFile(url: string, destPath: string, timeoutMs: number = 20000): Promise<string | null> {
  return new Promise((resolve) => {
    try {
      const parsed = new URL(url);
      const getter = parsed.protocol === 'https:' ? https.get : http.get;

      const req = getter(
        url,
        {
          headers: {
            'User-Agent': 'PPTGenerator/1.0 (https://commons.wikimedia.org/wiki/User:PPTGenerator; contact@pptgen.local) Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
          },
          timeout: timeoutMs,
        },
        (res) => {
          // Handle redirects (301, 302, 303, 307, 308)
          if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
            const redirectUrl = res.headers.location.startsWith('http')
              ? res.headers.location
              : new URL(res.headers.location, url).toString();
            downloadFile(redirectUrl, destPath, timeoutMs).then(resolve);
            return;
          }

          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            const fileStream = fs.createWriteStream(destPath);
            res.pipe(fileStream);

            fileStream.on('finish', () => {
              fileStream.close(() => {
                if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1000) {
                  resolve(destPath);
                } else {
                  resolve(null);
                }
              });
            });

            fileStream.on('error', () => {
              if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
              resolve(null);
            });
          } else {
            console.warn(`[ImageCache] HTTP ${res.statusCode} for URL: ${url}`);
            resolve(null);
          }
        }
      );

      req.on('error', (err) => {
        console.warn(`[ImageCache] Network error for ${url}: ${err.message}`);
        if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
        resolve(null);
      });

      req.on('timeout', () => {
        req.destroy();
        if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
        resolve(null);
      });
    } catch (err: any) {
      console.warn(`[ImageCache] Exception parsing ${url}: ${err.message}`);
      resolve(null);
    }
  });
}
