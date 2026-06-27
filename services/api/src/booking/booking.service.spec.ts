import { Test, type TestingModule } from '@nestjs/testing';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { BookingService } from './booking.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

const mockPrisma = {
  property: {
    findFirst: jest.fn(),
  },
  booking: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

describe('BookingService', () => {
  let service: BookingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookingService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    const dto: CreateBookingDto = {
      propertyId: 'p1',
      date: '2026-07-15',
      timeSlot: '10:00 AM',
      message: 'Interested!',
    };

    it('should create a booking', async () => {
      mockPrisma.property.findFirst.mockResolvedValue({ id: 'p1', deletedAt: null });
      mockPrisma.booking.create.mockResolvedValue({
        id: 'b1',
        ...dto,
        tenantId: 'tenant1',
        property: { id: 'p1', title: 'Test Prop' },
      });

      const result = await service.create(dto, 'tenant1');
      expect(result.id).toBe('b1');
      expect(mockPrisma.booking.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ propertyId: 'p1', tenantId: 'tenant1' }),
        }),
      );
    });

    it('should throw NotFoundException if property missing', async () => {
      mockPrisma.property.findFirst.mockResolvedValue(null);
      await expect(service.create(dto, 'tenant1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByTenant', () => {
    it('should return tenant bookings', async () => {
      mockPrisma.booking.findMany.mockResolvedValue([{ id: 'b1', property: { id: 'p1', title: 'Test', images: '' } }]);
      const result = await service.findByTenant('tenant1');
      expect(result).toHaveLength(1);
    });
  });

  describe('findByAgent', () => {
    it('should return agent bookings', async () => {
      mockPrisma.booking.findMany.mockResolvedValue([{ id: 'b1', property: { id: 'p1', title: 'Test', images: '' }, tenant: { id: 't1', firstName: 'Tenant', lastName: 'T', email: '', phone: '' } }]);
      const result = await service.findByAgent('agent1');
      expect(result).toHaveLength(1);
    });
  });

  describe('updateStatus', () => {
    const dto: UpdateBookingDto = { status: 'confirmed' };

    it('should update booking status', async () => {
      mockPrisma.booking.findUnique.mockResolvedValue({
        id: 'b1',
        tenantId: 'tenant1',
        property: { agentId: 'agent1' },
      });
      mockPrisma.booking.update.mockResolvedValue({ id: 'b1', status: 'confirmed', property: { id: 'p1', title: 'Test' } });

      const result = await service.updateStatus('b1', dto, 'agent1', 'agent');
      expect(result.status).toBe('confirmed');
    });

    it('should throw ForbiddenException for wrong agent', async () => {
      mockPrisma.booking.findUnique.mockResolvedValue({
        id: 'b1',
        tenantId: 'tenant1',
        property: { agentId: 'agent1' },
      });
      await expect(service.updateStatus('b1', dto, 'wrong-agent', 'agent')).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException for nonexistent booking', async () => {
      mockPrisma.booking.findUnique.mockResolvedValue(null);
      await expect(service.updateStatus('b1', dto, 'user', 'agent')).rejects.toThrow(NotFoundException);
    });
  });
});
