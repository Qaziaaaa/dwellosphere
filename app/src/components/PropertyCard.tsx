import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, Square, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Property } from '@/types/property.types';
import { getPropertyPriceDisplay } from '@/services/property.service';

interface PropertyCardProps {
  property: Property;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  index?: number;
}

export default function PropertyCard({
  property,
  isFavorite,
  onToggleFavorite,
  index = 0,
}: PropertyCardProps) {
  const primaryImage = property.images.find((img) => img.isPrimary) || property.images[0];
  const typeLabel = property.listingType === 'for-sale' ? 'For Sale' : 'For Rent';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.4, 0, 0.2, 1],
      }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group"
    >
      <div className="relative overflow-hidden bg-gray-100">
        <Link to={`/properties/${property.id}`}>
          {primaryImage?.url ? (
            <img
              src={primaryImage.url}
              alt={primaryImage.alt || property.title}
              loading="lazy"
              className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-56 flex items-center justify-center text-text-muted">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
          )}
        </Link>
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-text-primary">
            {typeLabel}
          </span>
          {property.propertyType && (
            <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-text-primary capitalize">
              {property.propertyType}
            </span>
          )}
        </div>
        <button
          onClick={() => onToggleFavorite(property.id)}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            className={`w-4 h-4 ${
              isFavorite ? 'fill-primary text-primary' : 'text-text-secondary'
            }`}
          />
        </button>
      </div>
      <div className="p-5">
        <div className="flex items-center gap-1 text-text-muted text-sm mb-2">
          <MapPin className="w-3.5 h-3.5" />
          <span>
            {property.location.city}, {property.location.state}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">
          <Link
            to={`/properties/${property.id}`}
            className="hover:text-primary transition-colors"
          >
            {property.title}
          </Link>
        </h3>
        <p className="text-primary font-semibold text-xl mb-4">
          {getPropertyPriceDisplay(property.price, property.listingType)}
        </p>
        <div className="flex items-center gap-4 text-text-secondary text-sm border-t border-border pt-4">
          {property.beds > 0 && (
            <span className="flex items-center gap-1">
              <Bed className="w-4 h-4" /> {property.beds} bed{property.beds > 1 ? 's' : ''}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Bath className="w-4 h-4" /> {property.baths} bath{property.baths > 1 ? 's' : ''}
          </span>
          <span className="flex items-center gap-1">
            <Square className="w-4 h-4" /> {property.sqft.toLocaleString()} sqft
          </span>
        </div>
      </div>
    </motion.div>
  );
}
