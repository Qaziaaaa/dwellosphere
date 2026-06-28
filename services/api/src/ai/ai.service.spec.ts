jest.mock('@langchain/community/embeddings/hf', () => ({
  HuggingFaceInferenceEmbeddings: jest.fn().mockImplementation(() => ({
    embedQuery: jest.fn().mockResolvedValue([0.1, 0.2, 0.3]),
    embedDocuments: jest.fn().mockResolvedValue([[0.1, 0.2, 0.3]]),
  })),
}));

jest.mock('@langchain/community/llms/hf', () => ({
  HuggingFaceInference: jest.fn().mockImplementation(() => ({
    invoke: jest.fn().mockResolvedValue('mocked response'),
  })),
}));

import { Test, TestingModule } from '@nestjs/testing';
import { RecommendationService } from './recommendation.service';
import { EmbeddingsProvider } from './providers/embeddings.provider';
import { LLMProvider } from './providers/llm.provider';
import { PrismaService } from '../prisma/prisma.service';

describe('RecommendationService', () => {
  let service: RecommendationService;

  const mockPrisma = {
    userInteraction: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
    property: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
  };

  const mockEmbeddings = {
    embedQuery: jest.fn().mockResolvedValue([0.1, 0.2, 0.3]),
    findSimilar: jest.fn().mockReturnValue([
      { id: 'prop-2', score: 0.95 },
      { id: 'prop-3', score: 0.8 },
    ]),
    cosineSimilarity: jest.fn().mockReturnValue(0.95),
  };

  const mockLLM = {
    generateText: jest
      .fn()
      .mockResolvedValue('AI generated listing description'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecommendationService,
        { provide: EmbeddingsProvider, useValue: mockEmbeddings },
        { provide: LLMProvider, useValue: mockLLM },
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<RecommendationService>(RecommendationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getSimilarProperties', () => {
    it('should return similar properties based on embedding', async () => {
      mockPrisma.property.findFirst.mockResolvedValue({
        id: 'prop-1',
        embedding: JSON.stringify([0.1, 0.2, 0.3]),
        title: 'Test Property',
        description: 'A test',
        images: '[]',
        features: '[]',
        amenities: '[]',
      });

      mockPrisma.property.findMany.mockResolvedValue([
        {
          id: 'prop-2',
          embedding: JSON.stringify([0.15, 0.25, 0.35]),
          title: 'Similar',
          description: 'Similar',
          price: 100000,
          listingType: 'for_sale',
          beds: 3,
          baths: 2,
          sqft: 1500,
          yearBuilt: 2020,
          address: '123 St',
          city: 'City',
          state: 'ST',
          zip: '12345',
          lat: null,
          lng: null,
          images: '[]',
          features: '[]',
          amenities: '[]',
          agentId: 'agent-1',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          agent: {
            id: 'agent-1',
            firstName: 'A',
            lastName: 'B',
            email: 'a@b.com',
            role: 'agent',
            avatar: null,
          },
        },
        {
          id: 'prop-3',
          embedding: JSON.stringify([0.9, 0.9, 0.9]),
          title: 'Different',
          description: 'Different',
          price: 200000,
          listingType: 'for_sale',
          beds: 4,
          baths: 3,
          sqft: 2500,
          yearBuilt: 2021,
          address: '456 St',
          city: 'City2',
          state: 'ST',
          zip: '12346',
          lat: null,
          lng: null,
          images: '[]',
          features: '[]',
          amenities: '[]',
          agentId: 'agent-1',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          agent: {
            id: 'agent-1',
            firstName: 'A',
            lastName: 'B',
            email: 'a@b.com',
            role: 'agent',
            avatar: null,
          },
        },
      ]);

      const result = await service.getSimilarProperties('prop-1', 5);
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('semanticSearch', () => {
    it('should run search graph and return results', async () => {
      mockPrisma.property.findMany.mockResolvedValue([
        {
          id: 'prop-1',
          embedding: JSON.stringify([0.1, 0.2, 0.3]),
          title: 'Match',
          description: 'Match',
          price: 100000,
          listingType: 'for_sale',
          beds: 3,
          baths: 2,
          sqft: 1500,
          yearBuilt: 2020,
          address: '123 St',
          city: 'City',
          state: 'ST',
          zip: '12345',
          lat: null,
          lng: null,
          images: '[]',
          features: '[]',
          amenities: '[]',
          agentId: 'agent-1',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          agent: {
            id: 'agent-1',
            firstName: 'A',
            lastName: 'B',
            email: 'a@b.com',
            role: 'agent',
            avatar: null,
          },
        },
      ]);

      const result = await service.semanticSearch('modern apartment', {}, 5);
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('pricingAdvice', () => {
    it('should return advice from pricing graph', async () => {
      mockPrisma.property.findMany.mockResolvedValue([
        { price: 200000, sqft: 1500 } as any,
        { price: 250000, sqft: 1800 } as any,
        { price: 300000, sqft: 2000 } as any,
      ]);

      const result = await service.pricingAdvice({
        price: 250000,
        listingType: 'for_sale',
        city: 'TestCity',
      });
      expect(result).toBeDefined();
      expect(result.advice).toBeDefined();
      expect(result.comparableCount).toBe(3);
    });

    it('should return no comparable message when empty', async () => {
      mockPrisma.property.findMany.mockResolvedValue([]);
      const result = await service.pricingAdvice({ price: 100000 });
      expect(result.advice).toContain('Not enough comparable');
      expect(result.comparableCount).toBe(0);
    });
  });

  describe('generateListingDescription', () => {
    it('should generate a description via listing graph', async () => {
      const result = await service.generateListingDescription({
        title: 'Beautiful Home',
        propertyType: 'house',
        beds: 3,
        baths: 2,
        sqft: 1500,
        yearBuilt: 2020,
        city: 'Portland',
        state: 'OR',
        amenities: ['Pool', 'Garden'],
      });
      expect(result.description).toBeDefined();
      expect(result.description.length).toBeGreaterThan(0);
    });
  });

  describe('trackInteraction', () => {
    it('should create an interaction record', async () => {
      mockPrisma.userInteraction.create.mockResolvedValue({
        id: 'int-1',
        userId: 'u1',
        propertyId: 'p1',
        type: 'view',
      });
      const result = await service.trackInteraction('u1', 'p1', 'view');
      expect(result).toBeDefined();
      expect(result.id).toBe('int-1');
    });
  });

  describe('getRecommendationsForUser', () => {
    it('should return recommendations via LangGraph agent', async () => {
      mockPrisma.userInteraction.findMany.mockResolvedValue([
        {
          propertyId: 'p1',
          property: {
            listingType: 'for_rent',
            city: 'NY',
            state: 'NY',
            beds: 2,
            baths: 1,
            sqft: 1000,
            amenities: '["Gym"]',
          },
        },
        {
          propertyId: 'p2',
          property: {
            listingType: 'for_rent',
            city: 'NY',
            state: 'NY',
            beds: 2,
            baths: 1,
            sqft: 1200,
            amenities: '["Gym","Pool"]',
          },
        },
      ]);

      mockPrisma.property.findMany.mockResolvedValue([
        {
          id: 'p3',
          listingType: 'for_rent',
          city: 'NY',
          state: 'NY',
          beds: 2,
          baths: 1,
          sqft: 1100,
          amenities: '["Gym"]',
          title: 'prop',
          description: 'desc',
          price: 1000,
          yearBuilt: 2020,
          address: 'addr',
          zip: '10001',
          lat: null,
          lng: null,
          images: '[]',
          features: '[]',
          embedding: null,
          agentId: 'a1',
          createdAt: new Date(),
          updatedAt: new Date(),
          deletedAt: null,
          agent: {
            id: 'a1',
            firstName: 'A',
            lastName: 'B',
            email: 'a@b.com',
            role: 'agent',
            avatar: null,
          },
        },
      ]);

      const result = await service.getRecommendationsForUser('user-1', 5);
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });
});

describe('EmbeddingsProvider', () => {
  let provider: EmbeddingsProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmbeddingsProvider],
    }).compile();
    provider = module.get<EmbeddingsProvider>(EmbeddingsProvider);
  });

  it('should compute cosine similarity', () => {
    const sim = provider.cosineSimilarity([1, 0, 0], [1, 0, 0]);
    expect(sim).toBeCloseTo(1);
    const sim2 = provider.cosineSimilarity([1, 0, 0], [0, 1, 0]);
    expect(sim2).toBeCloseTo(0);
    const sim3 = provider.cosineSimilarity([1, 0], [1, 0, 0]);
    expect(sim3).toBe(0);
  });

  it('should find similar items', () => {
    const result = provider.findSimilar(
      [1, 0, 0],
      [
        { id: 'a', embedding: [1, 0, 0] },
        { id: 'b', embedding: [0, 1, 0] },
        { id: 'c', embedding: [0.9, 0.1, 0] },
      ],
      2,
    );
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe('a');
    expect(result[0].score).toBeCloseTo(1);
  });

  it('should generate property embedding fallback', async () => {
    const result = await provider.generatePropertyEmbedding({
      title: 'Test',
      description: 'A test property',
      features: ['Pool', 'Garage'],
      amenities: ['Gym'],
      city: 'Portland',
      state: 'OR',
    });
    expect(result).toBeDefined();
    expect(result.length).toBeGreaterThan(0);
  });
});
