import { useEffect, useState } from 'react';
import type { Property } from '@/types/property.types';
import { getSimilarProperties } from '@/services/ai.service';
import { useFavorites } from '@/hooks/useFavorites';
import PropertyCard from './PropertyCard';

interface Props {
  propertyId: string;
  limit?: number;
}

export default function SimilarProperties({ propertyId, limit = 3 }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    async function load() {
      try {
        const data = await getSimilarProperties(propertyId, limit);
        if (!cancelled) setProperties(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [propertyId, limit]);

  if (loading) {
    return (
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">
            Similar Properties
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: limit }).map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (properties.length === 0) return null;

  return (
    <section className="py-12">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">
          Similar Properties
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} isFavorite={isFavorite(p.id)} onToggleFavorite={toggleFavorite} />
          ))}
        </div>
      </div>
    </section>
  );
}
