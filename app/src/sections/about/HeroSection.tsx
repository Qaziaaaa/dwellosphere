import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 mb-10 md:mb-14">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-text-primary leading-tight tracking-tight">
              About DwelloSphere
            </h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
            className="flex flex-col items-start lg:items-end justify-center"
          >
            <p className="text-text-secondary leading-relaxed max-w-md lg:text-right mb-6">
              We're on a mission to transform the real estate experience through technology, transparency, and trusted expertise.
            </p>
            <Link
              to="#"
              className="inline-flex items-center gap-2 border border-text-primary text-text-primary px-6 py-3 rounded-full text-sm font-medium hover:bg-text-primary hover:text-white transition-all duration-200 group"
            >
              Browse properties
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>

        {/* Hero Image with Video Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.8,
            delay: 0.3,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-3xl">
            <img
              src="/images/about-hero.jpg"
              alt="Mountain terrace view"
              className="w-full h-[400px] md:h-[500px] lg:h-[600px] object-cover"
            />
          </div>

          {/* Video Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.4, 0, 0.2, 1] }}
            className="absolute bottom-6 left-6 md:bottom-10 md:left-10 bg-white rounded-2xl p-4 md:p-5 shadow-lg max-w-[280px] md:max-w-sm"
          >
            <div className="flex items-start gap-4">
              <div className="relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden group cursor-pointer">
                <img
                  src="/images/video-thumbnail.jpg"
                  alt="Video thumbnail"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center">
                    <Play className="w-4 h-4 md:w-5 md:h-5 text-text-primary ml-0.5" />
                  </div>
                </div>
              </div>
              <div>
                <p className="text-sm text-text-secondary leading-relaxed mb-3">
                    At DwelloSphere, we don't just list properties — we help you find the place you'll call home.
                </p>
                <button className="inline-flex items-center gap-1.5 text-sm font-medium text-text-primary hover:text-primary transition-colors group">
                  Watch video
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
