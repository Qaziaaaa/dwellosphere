import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import type { PropertyFilters, ListingType, PropertyType } from '@/types/property.types';

interface FilterBarProps {
  filters: PropertyFilters;
  onFiltersChange: (filters: PropertyFilters) => void;
  resultCount: number;
}

const listingTypes: { value: ListingType | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'for-sale', label: 'For Sale' },
  { value: 'for-rent', label: 'For Rent' },
];

const propertyTypes: { value: PropertyType | 'all'; label: string }[] = [
  { value: 'all', label: 'All Types' },
  { value: 'house', label: 'House' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'condo', label: 'Condo' },
  { value: 'studio', label: 'Studio' },
  { value: 'townhouse', label: 'Townhouse' },
  { value: 'commercial', label: 'Commercial' },
];

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'sqft-desc', label: 'Largest First' },
] as const;

export default function FilterBar({ filters, onFiltersChange, resultCount }: FilterBarProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const updateFilter = (key: keyof PropertyFilters, value: string | number | undefined) => {
    onFiltersChange({ ...filters, [key]: value || undefined });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters = Object.values(filters).some((v) => v !== undefined && v !== '' && v !== 'all');

  return (
    <div className="space-y-4">
      {/* Main Search Row */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <Input
            placeholder="Search by location, property name..."
            value={filters.query || ''}
            onChange={(e) => updateFilter('query', e.target.value)}
            className="pl-11 rounded-xl border-border bg-white"
          />
        </div>
        <div className="flex gap-2">
          {listingTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => updateFilter('listingType', type.value === 'all' ? undefined : type.value)}
              className={`px-5 py-2 rounded-full text-sm font-medium border transition-colors ${
                (type.value === 'all' && !filters.listingType) || filters.listingType === type.value
                  ? 'bg-text-primary text-white border-text-primary'
                  : 'bg-white text-text-secondary border-border hover:border-text-primary'
              }`}
            >
              {type.label}
            </button>
          ))}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`p-2 rounded-xl border transition-colors ${
              showAdvanced || hasActiveFilters
                ? 'bg-text-primary text-white border-text-primary'
                : 'bg-white text-text-secondary border-border hover:border-text-primary'
            }`}
            aria-label="Advanced filters"
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="bg-white rounded-2xl p-5 border border-border space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-primary">Advanced Filters</h3>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1 text-sm text-text-muted hover:text-primary transition-colors"
              >
                <X className="w-3.5 h-3.5" /> Clear all
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {/* Property Type */}
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1.5">Property Type</label>
              <select
                value={filters.propertyType || 'all'}
                onChange={(e) => updateFilter('propertyType', e.target.value === 'all' ? undefined : e.target.value)}
                className="w-full rounded-xl border border-border bg-page-bg px-3 py-2 text-sm text-text-primary"
              >
                {propertyTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Min Price */}
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1.5">Min Price</label>
              <select
                value={filters.minPrice ?? ''}
                onChange={(e) => updateFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full rounded-xl border border-border bg-page-bg px-3 py-2 text-sm text-text-primary"
              >
                <option value="">No min</option>
                <option value="100000">$100k</option>
                <option value="250000">$250k</option>
                <option value="500000">$500k</option>
                <option value="1000000">$1M</option>
                <option value="2000000">$2M</option>
                <option value="5000000">$5M+</option>
              </select>
            </div>

            {/* Max Price */}
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1.5">Max Price</label>
              <select
                value={filters.maxPrice ?? ''}
                onChange={(e) => updateFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full rounded-xl border border-border bg-page-bg px-3 py-2 text-sm text-text-primary"
              >
                <option value="">No max</option>
                <option value="500000">$500k</option>
                <option value="1000000">$1M</option>
                <option value="2000000">$2M</option>
                <option value="5000000">$5M</option>
                <option value="10000000">$10M+</option>
              </select>
            </div>

            {/* Beds */}
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1.5">Bedrooms</label>
              <select
                value={filters.minBeds ?? ''}
                onChange={(e) => updateFilter('minBeds', e.target.value ? Number(e.target.value) : undefined)}
                className="w-full rounded-xl border border-border bg-page-bg px-3 py-2 text-sm text-text-primary"
              >
                <option value="">Any</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="5">5+</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-xs font-medium text-text-muted mb-1.5">Sort by</label>
              <select
                value={filters.sortBy || 'newest'}
                onChange={(e) => updateFilter('sortBy', e.target.value as PropertyFilters['sortBy'])}
                className="w-full rounded-xl border border-border bg-page-bg px-3 py-2 text-sm text-text-primary"
              >
                {sortOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Result Count */}
      <p className="text-sm text-text-muted">
        {resultCount} {resultCount === 1 ? 'property' : 'properties'} found
      </p>
    </div>
  );
}
