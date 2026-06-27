import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useState } from 'react';

const locations = [
  {
    city: 'New York',
    country: 'NY',
    description: 'Our flagship office in the heart of Manhattan, serving the tri-state area with premium real estate services.',
    image: '/images/office-ny.jpg',
  },
  {
    city: 'Amsterdam',
    country: 'NL',
    description: 'European headquarters delivering innovative property solutions across the Netherlands and surrounding markets.',
    image: '/images/cta-work-together.jpg',
  },
  {
    city: 'London',
    country: 'UK',
    description: 'London office specializing in luxury residential and commercial properties across the United Kingdom.',
    image: '/images/service-decoration.jpg',
  },
  {
    city: 'San Francisco',
    country: 'CA',
    description: 'West Coast hub driving technology innovation and serving the dynamic California real estate market.',
    image: '/images/project-la-house.jpg',
  },
];

export default function LocationsSection() {
  const [activeLocation, setActiveLocation] = useState(0);

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-text-primary mb-4">
            Our offices around the world
          </h2>
          <p className="text-text-secondary max-w-md mx-auto">
            With offices across four major markets, we're always close by to serve you in person or remotely.
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left - Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-2xl"
          >
            <motion.img
              key={activeLocation}
              src={locations[activeLocation].image}
              alt={locations[activeLocation].city}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="w-full h-[350px] md:h-[450px] object-cover"
            />
          </motion.div>

          {/* Right - Location List */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-2"
          >
            {locations.map((location, index) => (
              <motion.button
                key={location.city}
                onClick={() => setActiveLocation(index)}
                className={`w-full text-left p-5 rounded-xl transition-all duration-300 ${
                  activeLocation === index
                    ? 'bg-page-bg'
                    : 'bg-transparent hover:bg-page-bg/50'
                }`}
                whileHover={{ x: 4 }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3
                      className={`text-xl font-semibold mb-1 transition-colors ${
                        activeLocation === index
                          ? 'text-text-primary'
                          : 'text-text-secondary'
                      }`}
                    >
                      {location.city}, {location.country}
                    </h3>
                    {activeLocation === index && (
                      <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-text-muted text-sm leading-relaxed mt-2"
                      >
                        {location.description}
                      </motion.p>
                    )}
                  </div>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{
                      opacity: activeLocation === index ? 1 : 0,
                      x: activeLocation === index ? 0 : -10,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowRight className="w-5 h-5 text-primary" />
                  </motion.div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
