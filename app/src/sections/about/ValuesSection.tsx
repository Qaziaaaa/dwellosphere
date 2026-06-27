import { motion } from 'framer-motion';
import { Heart, Lightbulb, Sofa, Leaf, Users, Shield } from 'lucide-react';

const values = [
  {
    title: 'Integrity',
    description: 'We believe in honest, transparent dealings. Every transaction is built on trust and clear communication.',
    icon: Heart,
    color: 'bg-orange-100 text-orange-600',
  },
  {
    title: 'Innovation',
    description: 'Cutting-edge technology powers every aspect of our platform, from AI recommendations to virtual tours.',
    icon: Lightbulb,
    color: 'bg-green-100 text-green-600',
  },
  {
    title: 'Comfort',
    description: 'Your home should be your sanctuary. We help you find spaces that truly feel like home.',
    icon: Sofa,
    color: 'bg-blue-100 text-blue-600',
  },
  {
    title: 'Sustainability',
    description: 'We promote eco-friendly properties and sustainable living practices for a better tomorrow.',
    icon: Leaf,
    color: 'bg-teal-100 text-teal-600',
  },
  {
    title: 'Client first',
    description: 'Your needs come first. Our dedicated team works around the clock to ensure your satisfaction.',
    icon: Users,
    color: 'bg-purple-100 text-purple-600',
  },
  {
    title: 'Security',
    description: 'Your data and transactions are protected with enterprise-grade security and encryption.',
    icon: Shield,
    color: 'bg-red-100 text-red-600',
  },
];

export default function ValuesSection() {
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
            What guides everything we do
          </h2>
          <p className="text-text-secondary max-w-md mx-auto">
            Our core values shape every decision, every feature, and every interaction we have with our clients.
          </p>
        </motion.div>

        {/* Values Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.4, 0, 0.2, 1],
              }}
              whileHover={{ y: -4 }}
              className="bg-page-bg rounded-2xl p-6 transition-shadow duration-300 hover:shadow-md"
            >
              <div
                className={`w-12 h-12 rounded-xl ${value.color} flex items-center justify-center mb-4`}
              >
                <value.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                {value.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {value.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
