import { Injectable } from '@nestjs/common';
import { HuggingFaceService } from './huggingface.service';

@Injectable()
export class EmbeddingService {
  constructor(private readonly hf: HuggingFaceService) {}

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
    return this.hf.generateEmbedding(text);
  }

  cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
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
    const scored = candidates
      .filter((c) => c.embedding && c.embedding.length > 0)
      .map((c) => ({
        id: c.id,
        score: this.cosineSimilarity(target, c.embedding),
      }))
      .sort((a, b) => b.score - a.score);
    return scored.slice(0, limit);
  }
}
