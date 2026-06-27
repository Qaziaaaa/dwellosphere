import { Injectable, Logger } from '@nestjs/common';

const HF_EMBEDDING_URL =
  'https://api-inference.huggingface.co/pipeline/feature-extraction/sentence-transformers/all-MiniLM-L6-v2';
const HF_GENERATE_URL =
  'https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta';

@Injectable()
export class HuggingFaceService {
  private readonly logger = new Logger(HuggingFaceService.name);
  private readonly apiKey?: string;

  constructor() {
    this.apiKey = process.env.HF_API_KEY || undefined;
  }

  private get headers(): Record<string, string> {
    const h: Record<string, string> = { 'Content-Type': 'application/json' };
    if (this.apiKey) h['Authorization'] = `Bearer ${this.apiKey}`;
    return h;
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const res = await fetch(HF_EMBEDDING_URL, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({ inputs: text }),
      });
      if (!res.ok) {
        this.logger.warn(
          `Embedding API returned ${res.status}, using fallback`,
        );
        return this.fallbackEmbedding(text);
      }
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const emb = data[0];
        if (Array.isArray(emb) && emb.length > 0) return emb;
      }
      return this.fallbackEmbedding(text);
    } catch (err) {
      this.logger.warn(`Embedding request failed: ${err}, using fallback`);
      return this.fallbackEmbedding(text);
    }
  }

  async generateEmbeddingBatch(texts: string[]): Promise<number[][]> {
    return Promise.all(texts.map((t) => this.generateEmbedding(t)));
  }

  async generateText(prompt: string, maxLength = 300): Promise<string> {
    try {
      const res = await fetch(HF_GENERATE_URL, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: maxLength,
            temperature: 0.7,
            do_sample: true,
          },
        }),
      });
      if (!res.ok) {
        this.logger.warn(
          `Generation API returned ${res.status}, using fallback`,
        );
        return this.fallbackGenerate(prompt);
      }
      const data = await res.json();
      if (Array.isArray(data) && data[0]?.generated_text) {
        return data[0].generated_text.replace(prompt, '').trim();
      }
      return this.fallbackGenerate(prompt);
    } catch (err) {
      this.logger.warn(`Generation request failed: ${err}, using fallback`);
      return this.fallbackGenerate(prompt);
    }
  }

  private fallbackEmbedding(text: string): number[] {
    const words = text.toLowerCase().split(/\s+/);
    const vocab: Record<string, number> = {};
    let idx = 0;
    for (const w of words) {
      if (!(w in vocab)) vocab[w] = idx++;
    }
    const vec = new Array(384).fill(0);
    for (const w of words) {
      const hash = this.simpleHash(w) % 384;
      vec[hash] += 1.0 / words.length;
    }
    return vec;
  }

  private fallbackGenerate(prompt: string): string {
    return '';
  }

  private simpleHash(s: string): number {
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
      const char = s.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    return Math.abs(hash);
  }
}
