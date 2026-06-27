import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { QueryPropertyDto } from './dto/query-property.dto';

@Injectable()
export class PropertyService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePropertyDto, agentId: string) {
    return this.prisma.property.create({
      data: {
        ...dto,
        images: JSON.stringify(dto.images || []),
        features: JSON.stringify(dto.features || []),
        amenities: JSON.stringify(dto.amenities || []),
        agentId,
      },
      include: { agent: { select: { id: true, firstName: true, lastName: true, email: true, role: true, avatar: true } } },
    });
  }

  async findAll(query: QueryPropertyDto) {
    const { search, listingType, minPrice, maxPrice, minBeds, city, state, sort, page = 1, limit = 12 } = query;
    const where: any = { deletedAt: null };

    if (search) where.title = { contains: search };
    if (listingType) where.listingType = listingType;
    if (minPrice !== undefined) where.price = { ...where.price, gte: minPrice };
    if (maxPrice !== undefined) where.price = { ...where.price, lte: maxPrice };
    if (minBeds) where.beds = { gte: minBeds };
    if (city) where.city = { contains: city };
    if (state) where.state = { contains: state };

    let orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy = { price: 'asc' };
    else if (sort === 'price_desc') orderBy = { price: 'desc' };
    else if (sort === 'sqft_desc') orderBy = { sqft: 'desc' };

    const [data, total] = await Promise.all([
      this.prisma.property.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: { agent: { select: { id: true, firstName: true, lastName: true, email: true, role: true, avatar: true } } },
      }),
      this.prisma.property.count({ where }),
    ]);

    return {
      data: data.map((p) => ({
        ...p,
        images: JSON.parse(p.images),
        features: JSON.parse(p.features),
        amenities: JSON.parse(p.amenities),
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const property = await this.prisma.property.findFirst({
      where: { id, deletedAt: null },
      include: { agent: { select: { id: true, firstName: true, lastName: true, email: true, phone: true, role: true, avatar: true } } },
    });
    if (!property) throw new NotFoundException('Property not found');
    return {
      ...property,
      images: JSON.parse(property.images),
      features: JSON.parse(property.features),
      amenities: JSON.parse(property.amenities),
    };
  }

  async update(id: string, dto: Partial<CreatePropertyDto>, userId: string) {
    const property = await this.prisma.property.findFirst({ where: { id, agentId: userId, deletedAt: null } });
    if (!property) throw new NotFoundException('Property not found or unauthorized');

    const data: any = { ...dto };
    if (dto.images) data.images = JSON.stringify(dto.images);
    if (dto.features) data.features = JSON.stringify(dto.features);
    if (dto.amenities) data.amenities = JSON.stringify(dto.amenities);

    return this.prisma.property.update({ where: { id }, data });
  }

  async remove(id: string, userId: string) {
    const property = await this.prisma.property.findFirst({ where: { id, agentId: userId, deletedAt: null } });
    if (!property) throw new NotFoundException('Property not found or unauthorized');
    return this.prisma.property.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
