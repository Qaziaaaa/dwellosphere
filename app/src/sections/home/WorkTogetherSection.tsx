import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WorkTogetherSection() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left - Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="order-2 lg:order-1"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-text-primary mb-4 leading-tight">
              Ready to find your dream home? Let's get started.
            </h2>
            <p className="text-text-secondary mb-8 leading-relaxed max-w-md">
              Schedule a consultation with our expert agents and take the first step toward your new home.
            </p>
            <Link
              to="#"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-primary-hover transition-all duration-200 group hover:scale-[1.02]"
            >
              Get in touch
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Right - Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.6,
              delay: 0.2,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="order-1 lg:order-2"
          >
            <div className="relative overflow-hidden rounded-2xl group">
              <motion.img
                src="/images/cta-work-together.jpg"
                alt="Modern office interior"
                className="w-full h-[350px] md:h-[450px] object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
