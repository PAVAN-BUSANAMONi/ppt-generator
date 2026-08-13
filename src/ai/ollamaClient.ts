/**
 * Step 8 — Ollama Client
 *
 * Handles HTTP connection to local Ollama server (127.0.0.1:11434).
 * Features:
 * - Model availability verification (e.g. qwen3:8b, qwen2.5-coder, etc.)
 * - Structured JSON generation
 * - Timeout support
 * - keep_alive support
 * - Clear error formatting
 */

import * as http from 'http';

export interface OllamaClientOptions {
  host?: string;         // Default: '127.0.0.1'
  port?: number;         // Default: 11434
  timeoutMs?: number;    // Default: 120000 (120s)
  keepAlive?: string;    // Default: '5m'
}

export interface OllamaModelInfo {
  name: string;
  modified_at: string;
  size: number;
}

export class OllamaClient {
  private host: string;
  private port: number;
  private timeoutMs: number;
  private keepAlive: string;

  constructor(options?: OllamaClientOptions) {
    this.host = options?.host ?? '127.0.0.1';
    this.port = options?.port ?? 11434;
    this.timeoutMs = options?.timeoutMs ?? 120000;
    this.keepAlive = options?.keepAlive ?? '5m';
  }

  /**
   * Verify if Ollama server is running on host:port.
   */
  async checkHealth(): Promise<boolean> {
    try {
      const tags = await this.listModels();
      return Array.isArray(tags);
    } catch {
      return false;
    }
  }

  /**
   * List available models from Ollama (/api/tags).
   */
  async listModels(): Promise<OllamaModelInfo[]> {
    return new Promise((resolve, reject) => {
      const req = http.get(
        {
          hostname: this.host,
          port: this.port,
          path: '/api/tags',
          timeout: 5000,
        },
        (res) => {
          let body = '';
          res.on('data', (chunk) => (body += chunk));
          res.on('end', () => {
            if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
              try {
                const parsed = JSON.parse(body);
                resolve(parsed.models || []);
              } catch (e: any) {
                reject(new Error(`Failed to parse Ollama models response: ${e.message}`));
              }
            } else {
              reject(new Error(`Ollama server returned HTTP status ${res.statusCode}`));
            }
          });
        }
      );

      req.on('error', (err) => reject(new Error(`Ollama server connection refused on ${this.host}:${this.port} (${err.message})`)));
      req.on('timeout', () => {
        req.destroy();
        reject(new Error(`Ollama server connection timed out on ${this.host}:${this.port}`));
      });
    });
  }

  /**
   * Verify if a specific model (e.g. 'qwen3:8b') is available.
   */
  async verifyModelAvailability(modelName: string): Promise<{ available: boolean; matchingModel?: string }> {
    try {
      const models = await this.listModels();
      const match = models.find((m) => m.name.toLowerCase() === modelName.toLowerCase() || m.name.toLowerCase().startsWith(modelName.toLowerCase()));
      if (match) {
        return { available: true, matchingModel: match.name };
      }
      return { available: false };
    } catch (err: any) {
      return { available: false };
    }
  }

  /**
   * Generate structured text / JSON from Ollama (/api/generate).
   */
  async generateJson(
    model: string,
    systemPrompt: string,
    userPrompt: string
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const payload = JSON.stringify({
        model,
        prompt: `${systemPrompt}\n\nUser Request: ${userPrompt}`,
        stream: false,
        format: 'json',
        keep_alive: this.keepAlive,
        options: {
          temperature: 0.2, // Low temperature for deterministic adherence to schema
        },
      });

      const reqOptions: http.RequestOptions = {
        hostname: this.host,
        port: this.port,
        path: '/api/generate',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
        timeout: this.timeoutMs,
      };

      const req = http.request(reqOptions, (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            try {
              const parsed = JSON.parse(body);
              resolve(parsed.response || body);
            } catch {
              resolve(body);
            }
          } else {
            reject(new Error(`Ollama generate failed with status ${res.statusCode}: ${body}`));
          }
        });
      });

      req.on('error', (err) => reject(new Error(`Ollama request failed: ${err.message}`)));
      req.on('timeout', () => {
        req.destroy();
        reject(new Error(`Ollama request timed out after ${this.timeoutMs}ms`));
      });

      req.write(payload);
      req.end();
    });
  }
}
