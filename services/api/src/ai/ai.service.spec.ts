import { Test, TestingModule } from '@nestjs/testing';
import { RecommendationService } from './recommendation.service';
import { EmbeddingService } from './embedding.service';
import { HuggingFaceService } from './huggingface.service';
import { PrismaService } from '../prisma/prisma.service';

describe('RecommendationService', () => {
  let service: RecommendationService;

  const mockPrisma = {
    userInteraction: {
      findMany: jest.fn(),
      create: jest.fn(),
      count: jest.fn(),
    },
    property: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  const mockHuggingFace = {
    generateEmbedding: jest.fn().mockResolvedValue([0.1, 0.2, 0.3]),
    generateText: jest.fn().mockResolvedValue('AI generated description'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecommendationService,
        EmbeddingService,
        { provide: HuggingFaceService, useValue: mockHuggingFace },
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
    it('should return properties matching the query', async () => {
      mockHuggingFace.generateEmbedding.mockResolvedValue([0.1, 0.2, 0.3]);
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
        {
          id: 'prop-2',
          embedding: JSON.stringify([0.9, 0.9, 0.9]),
          title: 'No Match',
          description: 'No Match',
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

      const result = await service.semanticSearch('modern apartment', {}, 5);
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('pricingAdvice', () => {
    it('should return pricing advice with comparable data', async () => {
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
      expect(result.advice).toBeDefined();
      expect(result.comparableCount).toBe(3);
      expect(result.avgPrice).toBe(250000);
      expect(result.minPrice).toBe(200000);
      expect(result.maxPrice).toBe(300000);
    });

    it('should return no comparable message when empty', async () => {
      mockPrisma.property.findMany.mockResolvedValue([]);
      const result = await service.pricingAdvice({ price: 100000 });
      expect(result.advice).toContain('Not enough comparable');
      expect(result.comparableCount).toBe(0);
    });
  });

  describe('generateListingDescription', () => {
    it('should generate a description', async () => {
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
    it('should return recommendations based on user interactions', async () => {
      mockPrisma.userInteraction.findMany.mockResolvedValue([
        {
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
          id: 'p1',
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

describe('EmbeddingService', () => {
  let service: EmbeddingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmbeddingService,
        {
          provide: HuggingFaceService,
          useValue: {
            generateEmbedding: jest.fn().mockResolvedValue([0.1, 0.2, 0.3]),
          },
        },
      ],
    }).compile();

    service = module.get<EmbeddingService>(EmbeddingService);
  });

  it('should compute cosine similarity', () => {
    const sim = service.cosineSimilarity([1, 0, 0], [1, 0, 0]);
    expect(sim).toBeCloseTo(1);

    const sim2 = service.cosineSimilarity([1, 0, 0], [0, 1, 0]);
    expect(sim2).toBeCloseTo(0);

    const sim3 = service.cosineSimilarity([1, 0], [1, 0, 0]);
    expect(sim3).toBe(0);
  });

  it('should find similar items', () => {
    const result = service.findSimilar(
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

  it('should generate property embedding', async () => {
    const result = await service.generatePropertyEmbedding({
      title: 'Test',
      description: 'A test property',
      features: ['Pool', 'Garage'],
      amenities: ['Gym'],
      city: 'Portland',
      state: 'OR',
    });

    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
  });
});
