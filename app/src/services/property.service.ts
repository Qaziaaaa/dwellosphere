import type { Property, PropertyFilters } from '@/types/property.types';
import * as api from '@/lib/api';

interface BackendProperty {
  id: string;
  title: string;
  description: string;
  price: number;
  listingType: string;
  beds: number;
  baths: number;
  sqft: number;
  yearBuilt: number;
  address: string;
  city: string;
  state: string;
  zip: string;
  lat: number | null;
  lng: number | null;
  images: string;
  features: string;
  amenities: string;
  agent: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    role?: string;
    avatar?: string | null;
  };
}

function mapBackendProperty(p: BackendProperty): Property {
  const images: { url: string; alt: string }[] = JSON.parse(p.images || '[]');
  const features: { name: string; value: string }[] = JSON.parse(p.features || '[]');
  const amenities: string[] = JSON.parse(p.amenities || '[]');

  return {
    id: p.id,
    title: p.title,
    description: p.description,
    price: p.price,
    currency: 'USD',
    listingType: p.listingType === 'for_sale' ? 'for-sale' : 'for-rent',
    propertyType: 'house',
    status: 'active',
    beds: p.beds,
    baths: p.baths,
    sqft: p.sqft,
    yearBuilt: p.yearBuilt,
    images: images.map((img: { url: string; alt: string }, i: number) => ({
      id: `${p.id}_img_${i}`,
      url: img.url,
      alt: img.alt || '',
      isPrimary: i === 0,
    })),
    location: {
      address: p.address,
      city: p.city,
      state: p.state,
      zip: p.zip,
      country: 'USA',
      lat: p.lat || 0,
      lng: p.lng || 0,
      neighborhood: p.city,
    },
    features: features.map((f: { name: string; value: string }) => ({ name: f.name, value: f.value })),
    amenities,
    agent: {
      id: p.agent.id,
      name: `${p.agent.firstName} ${p.agent.lastName}`,
      role: p.agent.role || 'Agent',
      image: p.agent.avatar || '',
      phone: p.agent.phone || '',
      email: p.agent.email,
    },
    listedAt: '',
    createdAt: '',
    updatedAt: '',
  };
}

export async function getProperties(filters?: PropertyFilters): Promise<Property[]> {
  const params = new URLSearchParams();
  if (filters?.query) params.set('search', filters.query);
  if (filters?.listingType && filters.listingType !== 'all') {
    params.set('listingType', filters.listingType === 'for-sale' ? 'for_sale' : 'for_rent');
  }
  if (filters?.minPrice !== undefined) params.set('minPrice', String(filters.minPrice));
  if (filters?.maxPrice !== undefined) params.set('maxPrice', String(filters.maxPrice));
  if (filters?.minBeds !== undefined) params.set('minBeds', String(filters.minBeds));
  if (filters?.sortBy) {
    const sortMap: Record<string, string> = {
      'price-asc': 'price_asc',
      'price-desc': 'price_desc',
      newest: 'newest',
      'sqft-desc': 'sqft_desc',
    };
    params.set('sort', sortMap[filters.sortBy] || 'newest');
  }
  params.set('limit', '50');

  const qs = params.toString();
  const data = await api.get(`/properties${qs ? `?${qs}` : ''}`);
  return (data.data || []).map(mapBackendProperty);
}

export async function getPropertyById(id: string): Promise<Property | undefined> {
  try {
    const data = await api.get(`/properties/${id}`);
    return mapBackendProperty(data);
  } catch {
    return undefined;
  }
}

export async function getRelatedProperties(currentId: string, limit = 3): Promise<Property[]> {
  const all = await getProperties();
  return all.filter((p) => p.id !== currentId).slice(0, limit);
}

export function getPropertyPriceDisplay(price: number, listingType: string): string {
  const formatted = price.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  });
  return listingType === 'for-rent' ? `${formatted}/mo` : formatted;
}
