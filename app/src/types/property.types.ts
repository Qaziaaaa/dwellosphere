export type PropertyType = 'house' | 'apartment' | 'condo' | 'studio' | 'townhouse' | 'commercial';
export type ListingType = 'for-sale' | 'for-rent';
export type PropertyStatus = 'active' | 'pending' | 'sold' | 'rented';

export interface PropertyImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface PropertyFeature {
  name: string;
  value: string;
}

export interface PropertyLocation {
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  lat: number;
  lng: number;
  neighborhood: string;
}

export interface PropertyAgent {
  id: string;
  name: string;
  role: string;
  image: string;
  phone: string;
  email: string;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  listingType: ListingType;
  propertyType: PropertyType;
  status: PropertyStatus;
  beds: number;
  baths: number;
  sqft: number;
  lotSize?: number;
  yearBuilt: number;
  images: PropertyImage[];
  location: PropertyLocation;
  features: PropertyFeature[];
  amenities: string[];
  agent: PropertyAgent;
  listedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFilters {
  query?: string;
  listingType?: ListingType | 'all';
  propertyType?: PropertyType | 'all';
  minPrice?: number;
  maxPrice?: number;
  minBeds?: number;
  minBaths?: number;
  minSqft?: number;
  maxSqft?: number;
  location?: string;
  sortBy?: 'price-asc' | 'price-desc' | 'newest' | 'sqft-desc';
}
