import { useEffect, useState } from 'react';
import type { Property } from '@/types/property.types';
import { getRecommendations } from '@/services/ai.service';
import { useAuth } from '@/hooks/useAuth';
import { useFavorites } from '@/hooks/useFavorites';
import PropertyCard from './PropertyCard';

interface Props {
  limit?: number;
}

export default function RecommendedProperties({ limit = 4 }: Props) {
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const data = await getRecommendations(limit);
        if (!cancelled) setProperties(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [user, limit]);

  if (!user) return null;
  if (loading) {
    return (
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-8 text-2xl font-bold text-gray-900 dark:text-white">
            Recommended for You
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
        <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
          Recommended for You
        </h2>
        <p className="mb-8 text-gray-600 dark:text-gray-400">
          AI-powered picks based on your preferences and activity
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} isFavorite={isFavorite(p.id)} onToggleFavorite={toggleFavorite} />
          ))}
        </div>
      </div>
    </section>
  );
}
