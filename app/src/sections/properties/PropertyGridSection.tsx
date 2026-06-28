import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PropertyCard from '@/components/PropertyCard';
import FilterBar from '@/components/FilterBar';
import { useFavorites } from '@/hooks/useFavorites';
import { getProperties } from '@/services/property.service';
import { semanticSearch } from '@/services/ai.service';
import type { Property, PropertyFilters } from '@/types/property.types';

interface Props {
  aiQuery?: string;
}

export default function PropertyGridSection({ aiQuery }: Props) {
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const { isFavorite, toggleFavorite } = useFavorites();

  const aiMode = !!(aiQuery && aiQuery.trim().length >= 3);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        if (aiMode) {
          const results = await semanticSearch(aiQuery!, {}, 50);
          if (!cancelled) setProperties(results);
        } else {
          const data = await getProperties(filters);
          if (!cancelled) setProperties(data);
        }
      } catch {
        if (!cancelled) setProperties([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [filters, aiQuery, aiMode]);

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
            <p className="text-text-muted text-sm">{aiMode ? 'Try a different search query.' : 'Try adjusting your filters to see more results.'}</p>
          </motion.div>
        ) : (
          <>
            {aiMode && (
              <div className="mb-4 flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium dark:bg-blue-900/50">AI Semantic Search</span>
                <span>Results ranked by relevance to your query</span>
              </div>
            )}
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
        </>
        )}
      </div>
    </section>
  );
}
