import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import PropertyDetailSection from '@/sections/properties/PropertyDetailSection';
import { getPropertyById } from '@/services/property.service';
import { useFavorites } from '@/hooks/useFavorites';
import SimilarProperties from '@/components/SimilarProperties';
import PricingAdvisor from '@/components/PricingAdvisor';
import { trackInteraction } from '@/services/ai.service';
import type { Property } from '@/types/property.types';

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [property, setProperty] = useState<Property | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    getPropertyById(id).then((prop) => {
      if (cancelled) return;
      setProperty(prop);
      setLoading(false);
      if (prop) trackInteraction(id, 'view');
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
          <div>
            <h1 className="text-4xl font-semibold text-text-primary mb-4">Property not found</h1>
            <p className="text-text-secondary mb-8">The property you're looking for doesn't exist or has been removed.</p>
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-primary-hover transition-all duration-200"
            >
              Browse all properties
            </Link>
          </div>
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

      {property && (
        <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <PricingAdvisor
                price={property.price}
                listingType={property.listingType}
                beds={property.beds}
                baths={property.baths}
                sqft={property.sqft}
                city={property.location.city}
                state={property.location.state}
              />
            </div>
          </div>
        </section>
      )}

      {id && <SimilarProperties propertyId={id} limit={3} />}
    </main>
  );
}
