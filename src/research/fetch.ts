/**
 * Step 4 — Research Fetcher
 *
 * Fetches page content over HTTP/HTTPS with clean timeouts and user agent.
 */

import * as http from 'http';
import * as https from 'https';
import { extractPlainText } from './extract';

export async function fetchUrlText(url: string, timeoutMs: number = 8000): Promise<string> {
  return new Promise((resolve) => {
    try {
      const parsedUrl = new URL(url);
      const getter = parsedUrl.protocol === 'https:' ? https.get : http.get;

      const req = getter(
        url,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) PPTGenerator/1.0 ResearchBot',
            Accept: 'text/html,application/xhtml+xml,text/plain',
          },
          timeout: timeoutMs,
        },
        (res) => {
          let body = '';
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            res.on('data', (chunk) => (body += chunk));
            res.on('end', () => resolve(extractPlainText(body)));
          } else {
            resolve('');
          }
        }
      );

      req.on('error', () => resolve(''));
      req.on('timeout', () => {
        req.destroy();
        resolve('');
      });
    } catch {
      resolve('');
    }
  });
}
