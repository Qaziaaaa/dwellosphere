import { Test, type TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { PropertyService } from './property.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { QueryPropertyDto } from './dto/query-property.dto';

const mockPrisma = {
  property: {
    create: jest.fn(),
    findMany: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    count: jest.fn(),
    update: jest.fn(),
  },
};

describe('PropertyService', () => {
  let service: PropertyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PropertyService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<PropertyService>(PropertyService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    const dto: CreatePropertyDto = {
      title: 'Test Property',
      description: 'A test property',
      price: 500000,
      listingType: 'for_sale',
      beds: 3,
      baths: 2,
      sqft: 1500,
      yearBuilt: 2020,
      address: '123 Test St',
      city: 'Test City',
      state: 'TS',
      zip: '12345',
    };

    it('should create a property', async () => {
      const created = { id: 'p1', ...dto, agentId: 'agent1' };
      mockPrisma.property.create.mockResolvedValue(created);

      const result = await service.create(dto, 'agent1');
      expect(result.id).toBe('p1');
      expect(mockPrisma.property.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            title: 'Test Property',
            agentId: 'agent1',
          }),
        }),
      );
    });
  });

  describe('findAll', () => {
    it('should return paginated properties', async () => {
      mockPrisma.property.findMany.mockResolvedValue([
        {
          id: 'p1',
          title: 'Prop 1',
          images: '[]',
          features: '[]',
          amenities: '[]',
          agent: {
            id: 'a1',
            firstName: 'Agent',
            lastName: 'One',
            email: '',
            role: 'agent',
            avatar: null,
          },
        },
      ]);
      mockPrisma.property.count.mockResolvedValue(1);

      const query: QueryPropertyDto = { page: 1, limit: 12 };
      const result = await service.findAll(query);
      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
    });

    it('should filter by listing type', async () => {
      mockPrisma.property.findMany.mockResolvedValue([]);
      mockPrisma.property.count.mockResolvedValue(0);

      const query: QueryPropertyDto = { listingType: 'for_rent' };
      await service.findAll(query);
      expect(mockPrisma.property.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ listingType: 'for_rent' }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a property', async () => {
      mockPrisma.property.findFirst.mockResolvedValue({
        id: 'p1',
        title: 'Test',
        images: '[]',
        features: '[]',
        amenities: '[]',
        agent: {
          id: 'a1',
          firstName: 'A',
          lastName: 'B',
          email: '',
          phone: '',
          role: 'agent',
          avatar: null,
        },
      });

      const result = await service.findOne('p1');
      expect(result.title).toBe('Test');
    });

    it('should throw NotFoundException', async () => {
      mockPrisma.property.findFirst.mockResolvedValue(null);
      await expect(service.findOne('nonexistent')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a property', async () => {
      mockPrisma.property.findFirst.mockResolvedValue({
        id: 'p1',
        agentId: 'agent1',
        deletedAt: null,
      });
      mockPrisma.property.update.mockResolvedValue({
        id: 'p1',
        title: 'Updated',
      });

      const result = await service.update('p1', { title: 'Updated' }, 'agent1');
      expect(result.title).toBe('Updated');
    });

    it('should throw NotFoundException if not owner', async () => {
      mockPrisma.property.findFirst.mockResolvedValue(null);
      await expect(
        service.update('p1', { title: 'X' }, 'other'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should soft-delete a property', async () => {
      mockPrisma.property.findFirst.mockResolvedValue({
        id: 'p1',
        agentId: 'agent1',
        deletedAt: null,
      });
      mockPrisma.property.update.mockResolvedValue({
        id: 'p1',
        deletedAt: new Date(),
      });

      const result = await service.remove('p1', 'agent1');
      expect(result.deletedAt).toBeDefined();
    });

    it('should throw NotFoundException if not owner', async () => {
      mockPrisma.property.findFirst.mockResolvedValue(null);
      await expect(service.remove('p1', 'other')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
