import { motion } from 'framer-motion';

const logos = [
  { name: 'Zillow', text: 'Zillow' },
  { name: 'Redfin', text: 'Redfin' },
  { name: 'Realtor', text: 'Realtor' },
  { name: 'Apartments', text: 'Apartments' },
  { name: 'Trulia', text: 'Trulia' },
  { name: 'Homesnap', text: 'Homesnap' },
  { name: 'RealEstate', text: 'RealEstate' },
];

export default function LogoBar() {
  return (
    <section className="py-10 md:py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-center justify-center gap-8 md:gap-12 lg:gap-16"
        >
          {logos.map((logo, index) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="text-text-muted text-lg md:text-xl font-medium opacity-50 hover:opacity-80 transition-opacity cursor-default"
            >
              {logo.text}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
