import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const team = [
  {
    name: 'John Carter',
    role: 'CEO & Founder',
    image: '/images/team-john.jpg',
  },
  {
    name: 'Sophie Moore',
    role: 'Chief Real Estate Officer',
    image: '/images/team-sophie.jpg',
  },
  {
    name: 'Matt Cannon',
    role: 'Head of Technology',
    image: '/images/team-matt.jpg',
  },
  {
    name: 'Lilly Woods',
    role: 'Director of Operations',
    image: '/images/team-lilly.jpg',
  },
];

export default function TeamSection() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-text-primary mb-4">
              Our creative minds
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-sm"
          >
            <p className="text-text-secondary text-sm leading-relaxed">
              Meet the dedicated team behind DwelloSphere — passionate professionals committed to transforming your real estate journey.
            </p>
          </motion.div>
        </div>

        {/* Team Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{
                duration: 0.5,
                delay: index * 0.1,
                ease: [0.4, 0, 0.2, 1],
              }}
              whileHover={{ y: -8 }}
              className="group"
            >
              <div className="relative overflow-hidden rounded-2xl mb-4">
                <motion.img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-[280px] md:h-[320px] object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <h3 className="text-lg font-semibold text-text-primary">
                {member.name}
              </h3>
              <p className="text-text-muted text-sm">{member.role}</p>
            </motion.div>
          ))}
        </div>

        {/* Browse All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-10"
        >
          <Link
            to="#"
            className="inline-flex items-center gap-2 border border-text-primary text-text-primary px-6 py-3 rounded-full text-sm font-medium hover:bg-text-primary hover:text-white transition-all duration-200 group"
          >
            Meet the full team
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
