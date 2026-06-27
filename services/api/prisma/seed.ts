import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

function generateEmbedding(text: string): number[] {
  const words = text.toLowerCase().split(/\s+/);
  const vec = new Array(384).fill(0);
  for (const w of words) {
    let hash = 0;
    for (let i = 0; i < w.length; i++) { const char = w.charCodeAt(i); hash = ((hash << 5) - hash) + char; hash |= 0; }
    vec[Math.abs(hash) % 384] += 1.0 / words.length;
  }
  return vec;
}

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);

  const agent = await prisma.user.upsert({
    where: { email: 'agent@dwellosphere.com' },
    update: {},
    create: {
      email: 'agent@dwellosphere.com',
      passwordHash,
      firstName: 'Sophie',
      lastName: 'Moore',
      phone: '+1 (555) 123-4567',
      role: 'agent',
    },
  });

  const tenant = await prisma.user.upsert({
    where: { email: 'tenant@dwellosphere.com' },
    update: {},
    create: {
      email: 'tenant@dwellosphere.com',
      passwordHash,
      firstName: 'Jane',
      lastName: 'Doe',
      phone: '+1 (555) 987-6543',
      role: 'tenant',
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@dwellosphere.com' },
    update: {},
    create: {
      email: 'admin@dwellosphere.com',
      passwordHash,
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
    },
  });

  const prop1 = await prisma.property.upsert({
    where: { id: 'seed-prop-1' },
    update: {},
    create: {
      id: 'seed-prop-1',
      title: 'Modern Villa with Ocean View',
      description: 'Stunning modern villa with panoramic ocean views.',
      price: 2500000,
      listingType: 'for_sale',
      beds: 4,
      baths: 3,
      sqft: 3200,
      yearBuilt: 2021,
      address: '42 Oceanview Drive',
      city: 'Malibu',
      state: 'CA',
      zip: '90265',
      lat: 34.0259,
      lng: -118.7798,
      images: JSON.stringify([{ url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', alt: 'Modern villa' }]),
      features: JSON.stringify([{ name: 'Heating', value: 'Central' }, { name: 'Parking', value: '3-car Garage' }]),
      amenities: JSON.stringify(['Pool', 'Ocean View', 'Smart Home']),
      agentId: agent.id,
    },
  });

  if (prop1 && !prop1.embedding) {
    const emb1 = generateEmbedding(`${prop1.title} ${prop1.description} Pool Ocean View Smart Home Malibu CA modern villa luxury`);
    await prisma.property.update({ where: { id: prop1.id }, data: { embedding: JSON.stringify(emb1) } });
  }

  const prop2 = await prisma.property.upsert({
    where: { id: 'seed-prop-2' },
    update: {},
    create: {
      id: 'seed-prop-2',
      title: 'Luxury Apartment in Brooklyn Heights',
      description: 'Sophisticated apartment in a coveted neighborhood.',
      price: 4500,
      listingType: 'for_rent',
      beds: 2,
      baths: 2,
      sqft: 1400,
      yearBuilt: 2019,
      address: '85 Pierrepont Street',
      city: 'Brooklyn',
      state: 'NY',
      zip: '11201',
      lat: 40.6961,
      lng: -73.9937,
      images: JSON.stringify([{ url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', alt: 'Living room' }]),
      features: JSON.stringify([{ name: 'Heating', value: 'Radiant' }, { name: 'Laundry', value: 'In-unit' }]),
      amenities: JSON.stringify(['Doorman', 'Gym', 'Rooftop']),
      agentId: agent.id,
    },
  });

  if (prop2 && !prop2.embedding) {
    const emb2 = generateEmbedding(`${prop2.title} ${prop2.description} Doorman Gym Rooftop Brooklyn NY luxury apartment`);
    await prisma.property.update({ where: { id: prop2.id }, data: { embedding: JSON.stringify(emb2) } });
  }

  await prisma.booking.upsert({
    where: { id: 'seed-book-1' },
    update: {},
    create: {
      id: 'seed-book-1',
      propertyId: prop1.id,
      tenantId: tenant.id,
      date: new Date('2026-07-10'),
      timeSlot: '10:00 AM',
      status: 'confirmed',
      message: 'Looking forward to seeing this property!',
    },
  });

  const existingInteractions = await prisma.userInteraction.count();
  if (existingInteractions === 0) {
    await prisma.userInteraction.createMany({
      data: [
        { userId: tenant.id, propertyId: prop1.id, type: 'view' },
        { userId: tenant.id, propertyId: prop1.id, type: 'save' },
        { userId: tenant.id, propertyId: prop2.id, type: 'view' },
        { userId: agent.id, propertyId: prop1.id, type: 'view' },
        { userId: agent.id, propertyId: prop2.id, type: 'save' },
      ],
    });
  }

  console.log('Seed data created successfully');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
