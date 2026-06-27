import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateBookingDto, tenantId: string) {
    const property = await this.prisma.property.findFirst({
      where: { id: dto.propertyId, deletedAt: null },
    });
    if (!property) throw new NotFoundException('Property not found');

    return this.prisma.booking.create({
      data: {
        propertyId: dto.propertyId,
        tenantId,
        date: new Date(dto.date),
        timeSlot: dto.timeSlot,
        message: dto.message,
      },
      include: { property: { select: { id: true, title: true } } },
    });
  }

  async findByTenant(tenantId: string) {
    return this.prisma.booking.findMany({
      where: { tenantId },
      include: { property: { select: { id: true, title: true, images: true } } },
      orderBy: { date: 'desc' },
    });
  }

  async findByAgent(agentId: string) {
    return this.prisma.booking.findMany({
      where: { property: { agentId } },
      include: { property: { select: { id: true, title: true, images: true } }, tenant: { select: { id: true, firstName: true, lastName: true, email: true, phone: true } } },
      orderBy: { date: 'desc' },
    });
  }

  async updateStatus(id: string, dto: UpdateBookingDto, userId: string, userRole: string) {
    const booking = await this.prisma.booking.findUnique({
      where: { id },
      include: { property: true },
    });
    if (!booking) throw new NotFoundException('Booking not found');

    if (userRole === 'agent' && booking.property.agentId !== userId) {
      throw new ForbiddenException('Not your property booking');
    }
    if (userRole === 'tenant' && booking.tenantId !== userId) {
      throw new ForbiddenException('Not your booking');
    }

    return this.prisma.booking.update({
      where: { id },
      data: { status: dto.status },
      include: { property: { select: { id: true, title: true } } },
    });
  }
}
