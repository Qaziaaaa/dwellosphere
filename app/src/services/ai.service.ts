import * as api from '@/lib/api';
import type { Property } from '@/types/property.types';
import type { BackendProperty } from './property.service';
import { mapBackendProperty } from './property.service';

export interface PricingAdvice {
  advice: string;
  comparableCount: number;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  avgPricePerSqft: number;
  estimatedPrice?: number;
}

export interface ListingDescription {
  description: string;
}

export async function getRecommendations(limit = 6): Promise<Property[]> {
  try {
    const data = await api.get(`/ai/recommendations?limit=${limit}`);
    return (data || []).map((p: BackendProperty) => mapBackendProperty(p));
  } catch {
    return [];
  }
}

export async function getTrending(limit = 6): Promise<Property[]> {
  try {
    const data = await api.get(`/ai/trending?limit=${limit}`);
    return (data || []).map((p: BackendProperty) => mapBackendProperty(p));
  } catch {
    return [];
  }
}

export async function getSimilarProperties(
  propertyId: string,
  limit = 6,
): Promise<Property[]> {
  try {
    const data = await api.get(
      `/ai/similar/${propertyId}?limit=${limit}`,
    );
    return (data || []).map((p: BackendProperty) => mapBackendProperty(p));
  } catch {
    return [];
  }
}

export async function semanticSearch(
  query: string,
  filters?: { listingType?: string },
  limit = 12,
): Promise<Property[]> {
  try {
    const params = new URLSearchParams({ q: query, limit: String(limit) });
    if (filters?.listingType) params.set('listingType', filters.listingType);
    const data = await api.get(`/ai/search?${params.toString()}`);
    return (data || []).map((p: BackendProperty) => mapBackendProperty(p));
  } catch {
    return [];
  }
}

export async function getPricingAdvice(params: {
  price?: number;
  listingType?: string;
  beds?: number;
  baths?: number;
  sqft?: number;
  city?: string;
  state?: string;
}): Promise<PricingAdvice | null> {
  try {
    return await api.post('/ai/pricing-advisor', params);
  } catch {
    return null;
  }
}

export async function generateListingDescription(params: {
  title: string;
  propertyType: string;
  beds: number;
  baths: number;
  sqft: number;
  yearBuilt: number;
  city: string;
  state: string;
  amenities?: string[];
}): Promise<ListingDescription | null> {
  try {
    return await api.post('/ai/listing-generator', params);
  } catch {
    return null;
  }
}

export async function trackInteraction(
  propertyId: string,
  type: string,
  metadata?: string,
): Promise<void> {
  try {
    await api.post('/ai/track-interaction', { propertyId, type, metadata });
  } catch {
    // silent
  }
}
