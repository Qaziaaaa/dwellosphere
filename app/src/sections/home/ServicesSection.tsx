import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  {
    title: 'Property Listings',
    description:
      'Browse thousands of curated properties with high-quality photos, virtual tours, and detailed neighborhood insights to find your ideal match.',
    image: '/images/service-exterior.jpg',
  },
  {
    title: 'Property Management',
    description:
      'Full-service property management including tenant screening, maintenance coordination, rent collection, and financial reporting for landlords.',
    image: '/images/service-decoration.jpg',
  },
  {
    title: 'Real Estate Sales',
    description:
      'Expert guidance through every step of buying or selling — from market analysis and pricing strategy to closing and beyond.',
    image: '/images/service-construction.jpg',
  },
];

export default function ServicesSection() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Service Cards */}
          <div className="space-y-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                  ease: [0.4, 0, 0.2, 1],
                }}
                whileHover={{ y: -4 }}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
              >
                <div className="relative overflow-hidden">
                  <motion.img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-48 md:h-56 object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-text-primary mb-2">
                    {service.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right Column - Sticky Content */}
          <div className="lg:sticky lg:top-32 lg:self-start">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            >
              <h2 className="text-3xl md:text-4xl font-semibold text-text-primary mb-4 leading-tight">
                Your trusted real estate partner
              </h2>
              <p className="text-text-secondary mb-6 leading-relaxed">
                From first search to final signature, DwelloSphere provides end-to-end real estate solutions powered by cutting-edge technology.
              </p>
              <Link
                to="#"
                className="inline-flex items-center gap-2 border border-text-primary text-text-primary px-6 py-3 rounded-full text-sm font-medium hover:bg-text-primary hover:text-white transition-all duration-200 group"
              >
                Explore all services
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
