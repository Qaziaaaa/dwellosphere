import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const testimonials = [
  {
    quote:
      'DwelloSphere made finding our dream home effortless. The AI recommendations were spot-on and the agents were incredibly responsive.',
    author: 'Lilly Woods',
    location: 'Los Angeles, CA',
  },
  {
    quote:
      'The best real estate platform we\'ve used. From virtual tours to digital closing, everything was seamless and professional.',
    author: 'John Carter',
    location: 'New York, NY',
  },
  {
    quote:
      'We sold our home in under two weeks thanks to DwelloSphere\'s marketing and pricing tools. Exceptional platform.',
    author: 'Sophie Moore',
    location: 'San Francisco, CA',
  },
  {
    quote:
      'As a landlord, the property management dashboard saves me hours every month. Rent collection, maintenance, tenant screening — all in one place.',
    author: 'Andy Smith',
    location: 'Chicago, IL',
  },
  {
    quote:
      'From our first search to move-in day, every detail was handled with care. The booking system made viewings so easy to schedule.',
    author: 'Sandy Houston',
    location: 'Amsterdam, NL',
  },
  {
    quote:
      'The data analytics and market insights gave us confidence in our investment. DwelloSphere is a game-changer for buyers.',
    author: 'Matt Cannon',
    location: 'Ottawa, CA',
  },
  {
    quote:
      'Clear communication, transparent pricing, and a platform that actually works. Couldn\'t be happier with our experience.',
    author: 'Lilly Woods',
    location: 'Miami, FL',
  },
  {
    quote:
      'Their rental platform made finding tenants incredibly fast. Background checks, lease signing, and payments all handled digitally.',
    author: 'Andy Smith',
    location: 'Chicago, IL',
  },
];

export default function TestimonialsSection() {
  // Double the testimonials for seamless loop
  const allTestimonials = [...testimonials, ...testimonials];

  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-text-primary mb-4 max-w-md">
            Trusted by thousands of homeowners
          </h2>
          <p className="text-text-secondary max-w-md">
            See why clients across the country choose DwelloSphere for their real estate journey.
          </p>
          <Link
            to="#"
            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-primary-hover transition-all duration-200 group hover:scale-[1.02] mt-6"
          >
            Get in touch
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>

      {/* Marquee */}
      <div className="marquee-container py-4">
        <div className="marquee-content">
          {allTestimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex-shrink-0 w-[350px] md:w-[400px] mx-3"
            >
              <div className="bg-white rounded-2xl p-6 h-full shadow-sm">
                <p className="text-text-primary text-base leading-relaxed mb-6">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="font-semibold text-text-primary">
                    {testimonial.author}
                  </p>
                  <p className="text-text-muted text-sm">
                    {testimonial.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
