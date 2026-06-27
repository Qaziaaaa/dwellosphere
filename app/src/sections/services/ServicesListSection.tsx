import { motion } from 'framer-motion';
import { ArrowRight, Home, Building2, Shield, Users, BarChart3, Key } from 'lucide-react';
import { Link } from 'react-router-dom';

const services = [
  {
    title: 'Property Listings',
    description: 'Access thousands of curated property listings with high-quality photos, virtual tours, and detailed neighborhood data.',
    icon: Home,
    color: 'bg-orange-100 text-orange-600',
  },
  {
    title: 'Property Management',
    description: 'Full-service management for landlords including tenant screening, maintenance, rent collection, and financial reporting.',
    icon: Building2,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    title: 'Buyer & Seller Support',
    description: 'Expert guidance through every step of buying or selling with market analysis, pricing strategy, and negotiation support.',
    icon: Shield,
    color: 'bg-green-100 text-green-600',
  },
  {
    title: 'Tenant Services',
    description: 'Streamlined rental process with online applications, digital lease signing, and secure payment processing.',
    icon: Users,
    color: 'bg-purple-100 text-purple-600',
  },
  {
    title: 'Market Analytics',
    description: 'Data-driven insights and market trends to help you make informed real estate investment decisions.',
    icon: BarChart3,
    color: 'bg-teal-100 text-teal-600',
  },
  {
    title: 'Rental Listings',
    description: 'Find your next rental with smart filters, price comparison tools, and instant booking for viewings.',
    icon: Key,
    color: 'bg-red-100 text-red-600',
  },
];

export default function ServicesListSection() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.4, 0, 0.2, 1],
              }}
              whileHover={{ y: -4 }}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div
                className={`w-12 h-12 rounded-xl ${service.color} flex items-center justify-center mb-4`}
              >
                <service.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {service.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed mb-4">
                {service.description}
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-hover transition-colors group"
              >
                Learn more
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
