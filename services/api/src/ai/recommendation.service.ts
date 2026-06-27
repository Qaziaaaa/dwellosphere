import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmbeddingService } from './embedding.service';
import { HuggingFaceService } from './huggingface.service';

@Injectable()
export class RecommendationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly embedding: EmbeddingService,
    private readonly hf: HuggingFaceService,
  ) {}

  async getRecommendationsForUser(userId: string, limit = 6) {
    const recentInteractions = await this.prisma.userInteraction.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { property: true },
    });

    const likedPropertyIds = new Set(
      recentInteractions.map((i) => i.propertyId),
    );
    const likedFeatures = this.extractFeatures(
      recentInteractions.map((i) => i.property),
    );

    const allProperties = await this.prisma.property.findMany({
      where: { deletedAt: null, id: { notIn: Array.from(likedPropertyIds) } },
    });

    const scored = allProperties.map((p) => {
      const pFeatures = this.extractFeatureSet(p);
      let score = 0;
      for (const liked of likedFeatures) {
        score += this.jaccardSimilarity(liked, pFeatures);
      }
      return {
        id: p.id,
        score: likedFeatures.length > 0 ? score / likedFeatures.length : 0,
      };
    });

    scored.sort((a, b) => b.score - a.score);
    const topIds = scored.slice(0, limit).map((s) => s.id);

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

    const allProperties = await this.prisma.property.findMany({
      where: { deletedAt: null, id: { not: propertyId } },
    });

    const targetEmbedding = this.safeParseEmbedding(target.embedding);
    let similar: { id: string; score: number }[];

    if (targetEmbedding.length > 0) {
      const candidates = allProperties.map((p) => ({
        id: p.id,
        embedding: this.safeParseEmbedding(p.embedding),
      }));
      similar = this.embedding.findSimilar(targetEmbedding, candidates, limit);
    } else {
      const targetFeatures = this.extractFeatureSet(target);
      const scored = allProperties.map((p) => ({
        id: p.id,
        score: this.jaccardSimilarity(
          targetFeatures,
          this.extractFeatureSet(p),
        ),
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
    const queryEmbedding = await this.hf.generateEmbedding(query);

    const where: any = { deletedAt: null };
    if (filters?.listingType) where.listingType = filters.listingType;

    const allProperties = await this.prisma.property.findMany({ where });
    const candidates = allProperties.map((p) => ({
      id: p.id,
      embedding: this.safeParseEmbedding(p.embedding),
    }));

    const similar = this.embedding.findSimilar(
      queryEmbedding,
      candidates,
      limit,
    );
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
    const where: any = { deletedAt: null };
    if (params.listingType) where.listingType = params.listingType;
    if (params.city) where.city = { contains: params.city };
    if (params.state) where.state = { contains: params.state };
    if (params.beds) where.beds = params.beds;
    if (params.baths) where.baths = params.baths;

    const comparable = await this.prisma.property.findMany({
      where,
      orderBy: { price: 'asc' },
    });

    if (comparable.length === 0) {
      return {
        advice: 'Not enough comparable properties in this area.',
        comparableCount: 0,
      };
    }

    const prices = comparable.map((p) => p.price);
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const pricePerSqft = comparable
      .filter((p) => p.sqft > 0)
      .map((p) => p.price / p.sqft);
    const avgPricePerSqft =
      pricePerSqft.length > 0
        ? pricePerSqft.reduce((a, b) => a + b, 0) / pricePerSqft.length
        : 0;

    let advice = '';
    if (params.price) {
      const ratio = params.price / avgPrice;
      if (ratio < 0.8)
        advice = 'This property is priced below the market average.';
      else if (ratio > 1.2)
        advice = 'This property is priced above the market average.';
      else
        advice =
          'This property is priced competitively within the market range.';
    } else {
      const estimatedPrice = avgPrice;
      advice = `Based on ${comparable.length} comparable properties, the estimated market price is $${estimatedPrice.toLocaleString()}.`;
    }

    return {
      advice,
      comparableCount: comparable.length,
      avgPrice,
      minPrice,
      maxPrice,
      avgPricePerSqft: Math.round(avgPricePerSqft),
      estimatedPrice: params.price ? undefined : Math.round(avgPrice),
    };
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
    const amenitiesList =
      (dto.amenities || []).join(', ') || 'various modern features';
    const prompt = `Write a compelling real estate listing description for a ${dto.propertyType} in ${dto.city}, ${dto.state}. Title: "${dto.title}". Features: ${dto.beds} bed, ${dto.baths} bath, ${dto.sqft} sqft, built in ${dto.yearBuilt}. Amenities: ${amenitiesList}. Write a professional, engaging description (max 3 sentences):`;

    let description = await this.hf.generateText(prompt, 200);
    if (!description) {
      description = `Welcome to ${dto.title}, a stunning ${dto.propertyType} in the heart of ${dto.city}, ${dto.state}. This ${dto.beds}-bedroom, ${dto.baths}-bathroom home offers ${dto.sqft} sqft of thoughtfully designed living space, built in ${dto.yearBuilt} with premium finishes throughout.`;
    }
    return { description };
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

  private extractFeatures(properties: any[]): Set<string>[] {
    return properties.map((p) => this.extractFeatureSet(p));
  }

  private extractFeatureSet(property: any): Set<string> {
    const features = new Set<string>();
    features.add(property.listingType);
    features.add(property.city);
    features.add(property.state);
    features.add(`beds:${property.beds}`);
    features.add(`baths:${property.baths}`);
    const sizeBucket =
      property.sqft < 1000
        ? 'small'
        : property.sqft < 2000
          ? 'medium'
          : property.sqft < 3000
            ? 'large'
            : 'estate';
    features.add(`size:${sizeBucket}`);
    const amenities: string[] = JSON.parse(property.amenities || '[]');
    for (const a of amenities) features.add(`amenity:${a}`);
    return features;
  }

  private jaccardSimilarity(a: Set<string>, b: Set<string>): number {
    let intersection = 0;
    for (const item of a) if (b.has(item)) intersection++;
    const union = new Set([...a, ...b]).size;
    return union === 0 ? 0 : intersection / union;
  }

  private safeParseEmbedding(embedding: string | null): number[] {
    if (!embedding) return [];
    try {
      const parsed = JSON.parse(embedding);
      if (Array.isArray(parsed)) return parsed;
      return [];
    } catch {
      return [];
    }
  }
}
