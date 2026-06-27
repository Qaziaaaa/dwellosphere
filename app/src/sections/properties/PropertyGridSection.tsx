import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PropertyCard from '@/components/PropertyCard';
import FilterBar from '@/components/FilterBar';
import { useFavorites } from '@/hooks/useFavorites';
import { getProperties } from '@/services/property.service';
import type { Property, PropertyFilters } from '@/types/property.types';

export default function PropertyGridSection() {
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    let cancelled = false;
    getProperties(filters).then((data) => {
      if (cancelled) return;
      setProperties(data);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [filters]);

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <FilterBar
          filters={filters}
          onFiltersChange={setFilters}
          resultCount={properties.length}
        />

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : properties.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-text-secondary text-lg mb-2">No properties found</p>
            <p className="text-text-muted text-sm">Try adjusting your filters to see more results.</p>
          </motion.div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {properties.map((property, index) => (
              <PropertyCard
                key={property.id}
                property={property}
                isFavorite={isFavorite(property.id)}
                onToggleFavorite={toggleFavorite}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
