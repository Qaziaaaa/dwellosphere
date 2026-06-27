import { motion } from 'framer-motion';

const steps = [
  {
    number: '1',
    title: 'Search & discover',
    description:
      'Browse thousands of properties with smart filters, virtual tours, and AI-powered recommendations tailored to your preferences.',
    image: '/images/process-1.jpg',
  },
  {
    number: '2',
    title: 'Schedule & visit',
    description:
      'Book viewings effortlessly with real-time calendar integration. Take virtual or in-person tours at your convenience.',
    image: '/images/process-2.jpg',
  },
  {
    number: '3',
    title: 'Close & move in',
    description:
      'Our platform streamlines applications, lease signing, payments, and move-in coordination. Welcome home.',
    image: '/images/process-3.jpg',
  },
];

export default function ProcessSection() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-text-primary mb-4">
            How DwelloSphere works
          </h2>
          <p className="text-text-secondary max-w-md">
            Three simple steps to your next home — from search to move-in, we've got you covered.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{
                duration: 0.6,
                delay: index * 0.2,
                ease: [0.4, 0, 0.2, 1],
              }}
              whileHover={{ y: -4 }}
              className="bg-page-bg rounded-2xl overflow-hidden group"
            >
              <div className="relative overflow-hidden">
                <motion.img
                  src={step.image}
                  alt={step.title}
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  {step.number}. {step.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
