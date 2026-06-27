import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PropertyDetailSection from '@/sections/properties/PropertyDetailSection';
import PropertyCard from '@/components/PropertyCard';
import { getPropertyById, getRelatedProperties } from '@/services/property.service';
import { useFavorites } from '@/hooks/useFavorites';
import type { Property } from '@/types/property.types';

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [property, setProperty] = useState<Property | undefined>();
  const [related, setRelated] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    Promise.all([
      getPropertyById(id),
      getRelatedProperties(id),
    ]).then(([prop, rel]) => {
      if (cancelled) return;
      setProperty(prop);
      setRelated(rel);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mt-20" />
        </div>
      </section>
    );
  }

  if (!property) {
    return (
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl font-semibold text-text-primary mb-4">Property not found</h1>
            <p className="text-text-secondary mb-8">The property you're looking for doesn't exist or has been removed.</p>
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-primary-hover transition-all duration-200"
            >
              Browse all properties
            </Link>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <main className="min-h-screen">
      <PropertyDetailSection
        property={property}
        isFavorite={isFavorite(property.id)}
        onToggleFavorite={toggleFavorite}
      />

      {related.length > 0 && (
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-10"
            >
              <h2 className="text-2xl md:text-3xl font-semibold text-text-primary">
                Similar properties
              </h2>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p, i) => (
                <PropertyCard
                  key={p.id}
                  property={p}
                  isFavorite={isFavorite(p.id)}
                  onToggleFavorite={toggleFavorite}
                  index={i}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
