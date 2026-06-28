import { Injectable, Logger } from '@nestjs/common';
import { HuggingFaceInferenceEmbeddings } from '@langchain/community/embeddings/hf';
import { Document } from '@langchain/core/documents';

@Injectable()
export class EmbeddingsProvider {
  private readonly logger = new Logger(EmbeddingsProvider.name);
  private client: HuggingFaceInferenceEmbeddings;
  private fallbackClient: SimpleEmbedder;

  constructor() {
    const apiKey = process.env.HF_API_KEY || undefined;
    this.client = new HuggingFaceInferenceEmbeddings({
      apiKey,
      model: 'sentence-transformers/all-MiniLM-L6-v2',
    });
    this.fallbackClient = new SimpleEmbedder();
  }

  async embedQuery(text: string): Promise<number[]> {
    try {
      const result = await this.client.embedQuery(text);
      if (result && result.length > 0) return result;
      return this.fallbackClient.embed(text);
    } catch (err) {
      this.logger.warn(`LangChain HF embedding failed: ${err}`);
      return this.fallbackClient.embed(text);
    }
  }

  async embedDocuments(texts: string[]): Promise<number[][]> {
    try {
      return await this.client.embedDocuments(texts);
    } catch (err) {
      this.logger.warn(`LangChain HF batch embedding failed: ${err}`);
      return texts.map((t) => this.fallbackClient.embed(t));
    }
  }

  async generatePropertyEmbedding(property: {
    title: string;
    description: string;
    features: string[];
    amenities: string[];
    city: string;
    state: string;
  }): Promise<number[]> {
    const text = [
      property.title,
      property.description,
      ...(property.features || []),
      ...(property.amenities || []),
      property.city,
      property.state,
    ].join(' ');
    return this.embedQuery(text);
  }

  async embedDocument(doc: Document): Promise<number[]> {
    return this.embedQuery(doc.pageContent);
  }

  cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length || a.length === 0) return 0;
    let dot = 0,
      magA = 0,
      magB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += a[i] * b[i];
      magA += a[i] * a[i];
      magB += b[i] * b[i];
    }
    const denom = Math.sqrt(magA) * Math.sqrt(magB);
    return denom === 0 ? 0 : dot / denom;
  }

  findSimilar(
    target: number[],
    candidates: { id: string; embedding: number[] }[],
    limit = 6,
  ): { id: string; score: number }[] {
    return candidates
      .filter((c) => c.embedding?.length > 0)
      .map((c) => ({
        id: c.id,
        score: this.cosineSimilarity(target, c.embedding),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);
  }
}

class SimpleEmbedder {
  embed(text: string): number[] {
    const words = text.toLowerCase().split(/\s+/);
    const vec = new Array(384).fill(0);
    for (const w of words) {
      let hash = 0;
      for (let i = 0; i < w.length; i++) {
        const char = w.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0;
      }
      vec[Math.abs(hash) % 384] += 1.0 / words.length;
    }
    return vec;
  }
}
