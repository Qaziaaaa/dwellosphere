import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Calendar,
  Heart,
  Share2,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  Check,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Property } from '@/types/property.types';
import { getPropertyPriceDisplay } from '@/services/property.service';
import PropertyMap from '@/components/PropertyMap';
import { ScheduleViewing } from '@/components/ScheduleViewing';

interface PropertyDetailSectionProps {
  property: Property;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export default function PropertyDetailSection({
  property,
  isFavorite,
  onToggleFavorite,
}: PropertyDetailSectionProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showSchedule, setShowSchedule] = useState(false);
  const typeLabel = property.listingType === 'for-sale' ? 'For Sale' : 'For Rent';

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % property.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length);
  };

  return (
    <section className="pt-28 pb-16 md:pt-36 md:pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Back Link */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <Link
            to="/properties"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Back to properties
          </Link>
        </motion.div>

        {/* Image Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl mb-8 group"
        >
          <div className="relative bg-gray-100">
            {property.images[currentImageIndex]?.url ? (
              <img
                src={property.images[currentImageIndex].url}
                alt={property.images[currentImageIndex]?.alt || property.title}
                className="w-full h-[400px] md:h-[500px] object-cover"
              />
            ) : (
              <div className="w-full h-[400px] md:h-[500px] flex items-center justify-center text-text-muted">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          {property.images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              >
                <ChevronLeft className="w-5 h-5 text-text-primary" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
              >
                <ChevronRight className="w-5 h-5 text-text-primary" />
              </button>
            </>
          )}

          {/* Image indicators */}
          {property.images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {property.images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImageIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentImageIndex ? 'bg-white w-6' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Image count */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-text-primary">
            {currentImageIndex + 1} / {property.images.length}
          </div>

          {/* Listing type badge */}
          <div className="absolute top-4 left-4">
            <span className="bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-medium text-text-primary">
              {typeLabel}
            </span>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title & Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h1 className="text-3xl md:text-4xl font-semibold text-text-primary mb-2">
                    {property.title}
                  </h1>
                  <div className="flex items-center gap-1 text-text-secondary">
                    <MapPin className="w-4 h-4" />
                    <span>
                      {property.location.address}, {property.location.city},{' '}
                      {property.location.state} {property.location.zip}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => onToggleFavorite(property.id)}
                    className={`w-10 h-10 rounded-xl border transition-colors flex items-center justify-center ${
                      isFavorite
                        ? 'bg-primary text-white border-primary'
                        : 'border-border hover:border-primary'
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 ${isFavorite ? 'fill-white' : ''}`}
                    />
                  </button>
                  <button className="w-10 h-10 rounded-xl border border-border hover:border-primary transition-colors flex items-center justify-center">
                    <Share2 className="w-5 h-5 text-text-secondary" />
                  </button>
                </div>
              </div>

              {/* Price */}
              <p className="text-3xl font-bold text-primary mt-4">
                {getPropertyPriceDisplay(property.price, property.listingType)}
              </p>
            </motion.div>

            {/* Key Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-4"
            >
              {[
                { icon: Bed, label: 'Bedrooms', value: property.beds },
                { icon: Bath, label: 'Bathrooms', value: property.baths },
                { icon: Square, label: 'Square Feet', value: property.sqft.toLocaleString() },
                { icon: Calendar, label: 'Year Built', value: property.yearBuilt },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-page-bg rounded-2xl p-4 text-center"
                >
                  <stat.icon className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="text-xl font-semibold text-text-primary">{stat.value}</p>
                  <p className="text-xs text-text-muted">{stat.label}</p>
                </div>
              ))}
            </motion.div>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="text-xl font-semibold text-text-primary mb-3">Description</h2>
              <p className="text-text-secondary leading-relaxed">{property.description}</p>
            </motion.div>

            {/* Features & Amenities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="grid sm:grid-cols-2 gap-8"
            >
              <div>
                <h2 className="text-xl font-semibold text-text-primary mb-3">Features</h2>
                <ul className="space-y-2">
                  {property.features.map((feature) => (
                    <li key={feature.name} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-text-secondary text-sm">
                        <strong>{feature.name}:</strong> {feature.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-text-primary mb-3">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {property.amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="bg-page-bg px-3 py-1.5 rounded-full text-sm text-text-secondary"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Agent & Map */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Agent Card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-2xl p-6 border border-border shadow-sm lg:sticky lg:top-28 z-10"
            >
              <div className="flex items-center gap-4 mb-4">
                {property.agent.image ? (
                  <img
                    src={property.agent.image}
                    alt={property.agent.name}
                    loading="lazy"
                    className="w-14 h-14 rounded-xl object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-gray-100 flex items-center justify-center text-text-muted text-lg font-medium">
                    {property.agent.name?.charAt(0) || 'A'}
                  </div>
                )}
                <div>
                  <p className="font-semibold text-text-primary">{property.agent.name}</p>
                  <p className="text-sm text-text-muted">{property.agent.role}</p>
                </div>
              </div>

              <div className="space-y-3 mb-5">
                <a
                  href={`tel:${property.agent.phone}`}
                  className="flex items-center gap-3 text-sm text-text-secondary hover:text-primary transition-colors"
                >
                  <Phone className="w-4 h-4" /> {property.agent.phone}
                </a>
                <a
                  href={`mailto:${property.agent.email}`}
                  className="flex items-center gap-3 text-sm text-text-secondary hover:text-primary transition-colors"
                >
                  <Mail className="w-4 h-4" /> {property.agent.email}
                </a>
              </div>

              <button
                onClick={() => setShowSchedule(true)}
                className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white px-5 py-3 rounded-full text-sm font-medium hover:bg-primary-hover transition-all duration-200"
              >
                Schedule a viewing
              </button>
            </motion.div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <PropertyMap
                lat={property.location.lat}
                lng={property.location.lng}
                address={property.location.address}
                city={property.location.city}
                state={property.location.state}
              />
            </motion.div>
          </div>
        </div>
      </div>

      <ScheduleViewing
        propertyId={property.id}
        propertyTitle={property.title}
        open={showSchedule}
        onClose={() => setShowSchedule(false)}
      />
    </section>
  );
}
