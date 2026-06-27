import { motion } from 'framer-motion';

export default function HeroSection() {
  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-text-primary leading-tight tracking-tight mb-4">
            Browse properties
          </h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Discover your perfect home from our curated collection of premium properties for sale and rent.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
