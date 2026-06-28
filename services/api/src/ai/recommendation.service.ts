import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmbeddingsProvider } from './providers/embeddings.provider';
import { LLMProvider } from './providers/llm.provider';
import { createRecommendationGraph } from './agents/recommendation.agent';
import { createSearchGraph } from './agents/search.agent';
import { createPricingGraph } from './agents/pricing.agent';
import { createListingGraph } from './agents/listing.agent';

@Injectable()
export class RecommendationService {
  private recGraph: ReturnType<typeof createRecommendationGraph>;
  private searchGraph: ReturnType<typeof createSearchGraph>;
  private pricingGraph: ReturnType<typeof createPricingGraph>;
  private listingGraph: ReturnType<typeof createListingGraph>;

  constructor(
    private readonly prisma: PrismaService,
    private readonly embeddings: EmbeddingsProvider,
    private readonly llm: LLMProvider,
  ) {
    this.recGraph = createRecommendationGraph(this.prisma);
    this.searchGraph = createSearchGraph(this.prisma, this.embeddings);
    this.pricingGraph = createPricingGraph(this.prisma);
    this.listingGraph = createListingGraph(this.llm);
  }

  async getRecommendationsForUser(userId: string, limit = 6) {
    const final = await this.recGraph.invoke({
      userId,
      limit,
      likedIds: [],
      scoredIds: [],
      done: false,
    });
    const ids = final.scoredIds;
    if (ids.length === 0) return [];

    const data = await this.prisma.property.findMany({
      where: { id: { in: ids } },
      include: {
        agent: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            avatar: true,
          },
        },
      },
    });

    const idOrder = new Map(ids.map((id, i) => [id, i]));
    data.sort((a, b) => (idOrder.get(a.id) ?? 0) - (idOrder.get(b.id) ?? 0));

    return data.map((p) => ({
      ...p,
      images: JSON.parse(p.images),
      features: JSON.parse(p.features),
      amenities: JSON.parse(p.amenities),
      recommendationScore:
        idOrder.get(p.id) !== undefined
          ? 1 - (idOrder.get(p.id) ?? 0) / limit
          : 0,
    }));
  }

  async getSimilarProperties(propertyId: string, limit = 6) {
    const target = await this.prisma.property.findFirst({
      where: { id: propertyId, deletedAt: null },
    });
    if (!target) return [];

    const all = await this.prisma.property.findMany({
      where: { deletedAt: null, id: { not: propertyId } },
    });
    const targetEmb = this.parseEmbedding(target.embedding);

    let similar: { id: string; score: number }[];

    if (targetEmb.length > 0) {
      const candidates = all.map((p) => ({
        id: p.id,
        embedding: this.parseEmbedding(p.embedding),
      }));
      similar = this.embeddings.findSimilar(targetEmb, candidates, limit);
    } else {
      const targetFeatures = this.extractFeatureSet(target);
      const scored = all.map((p) => ({
        id: p.id,
        score: this.jaccard(targetFeatures, this.extractFeatureSet(p)),
      }));
      scored.sort((a, b) => b.score - a.score);
      similar = scored.slice(0, limit);
    }

    const topIds = similar.map((s) => s.id);
    const data = await this.prisma.property.findMany({
      where: { id: { in: topIds } },
      include: {
        agent: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            avatar: true,
          },
        },
      },
    });

    const idOrder = new Map(topIds.map((id, i) => [id, i]));
    data.sort((a, b) => (idOrder.get(a.id) ?? 0) - (idOrder.get(b.id) ?? 0));

    return data.map((p) => ({
      ...p,
      images: JSON.parse(p.images),
      features: JSON.parse(p.features),
      amenities: JSON.parse(p.amenities),
      similarityScore:
        idOrder.get(p.id) !== undefined
          ? 1 - (idOrder.get(p.id) ?? 0) / limit
          : 0,
    }));
  }

  async semanticSearch(
    query: string,
    filters?: { listingType?: string },
    limit = 12,
  ) {
    const final = await this.searchGraph.invoke({
      query,
      listingType: filters?.listingType,
      limit,
      scoredIds: [],
      done: false,
    });
    const ids = final.scoredIds;
    if (ids.length === 0) return [];

    const data = await this.prisma.property.findMany({
      where: { id: { in: ids } },
      include: {
        agent: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            role: true,
            avatar: true,
          },
        },
      },
    });

    const idOrder = new Map(ids.map((id, i) => [id, i]));
    data.sort((a, b) => (idOrder.get(a.id) ?? 0) - (idOrder.get(b.id) ?? 0));

    return data.map((p) => ({
      ...p,
      images: JSON.parse(p.images),
      features: JSON.parse(p.features),
      amenities: JSON.parse(p.amenities),
      relevanceScore:
        idOrder.get(p.id) !== undefined
          ? 1 - (idOrder.get(p.id) ?? 0) / limit
          : 0,
    }));
  }

  async pricingAdvice(params: {
    price?: number;
    listingType?: string;
    beds?: number;
    baths?: number;
    sqft?: number;
    city?: string;
    state?: string;
  }) {
    const final = await this.pricingGraph.invoke({
      ...params,
      result: null,
      done: false,
    });
    return final.result;
  }

  async generateListingDescription(dto: {
    title: string;
    propertyType: string;
    beds: number;
    baths: number;
    sqft: number;
    yearBuilt: number;
    city: string;
    state: string;
    amenities?: string[];
  }) {
    const final = await this.listingGraph.invoke({
      ...dto,
      amenities: dto.amenities || [],
      description: '',
      done: false,
    });
    return { description: final.description };
  }

  async trackInteraction(
    userId: string,
    propertyId: string,
    type: string,
    metadata?: string,
  ) {
    return this.prisma.userInteraction.create({
      data: { userId, propertyId, type, metadata },
    });
  }

  private parseEmbedding(embedding: string | null): number[] {
    if (!embedding) return [];
    try {
      const p = JSON.parse(embedding);
      return Array.isArray(p) ? p : [];
    } catch {
      return [];
    }
  }

  private extractFeatureSet(property: any): Set<string> {
    const f = new Set<string>();
    f.add(property.listingType);
    f.add(property.city);
    f.add(property.state);
    f.add(`beds:${property.beds}`);
    f.add(`baths:${property.baths}`);
    f.add(
      property.sqft < 1000
        ? 'small'
        : property.sqft < 2000
          ? 'medium'
          : property.sqft < 3000
            ? 'large'
            : 'estate',
    );
    const amenities: string[] = JSON.parse(property.amenities || '[]');
    for (const a of amenities) f.add(`amenity:${a}`);
    return f;
  }

  private jaccard(a: Set<string>, b: Set<string>): number {
    let intersection = 0;
    for (const item of a) if (b.has(item)) intersection++;
    const union = new Set([...a, ...b]).size;
    return union === 0 ? 0 : intersection / union;
  }
}
