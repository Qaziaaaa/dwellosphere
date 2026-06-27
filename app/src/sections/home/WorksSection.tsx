import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const projects = [
  {
    title: 'Modern Villa with Ocean View — Los Angeles, CA',
    description:
      'A stunning 5-bedroom contemporary villa overlooking the Pacific. Floor-to-ceiling windows, infinity pool, and smart home integration throughout.',
    image: '/images/project-la-house.jpg',
  },
  {
    title: 'Luxury Apartment — Brooklyn Heights, New York',
    description:
      'Elegant 3-bedroom apartment in a premier Brooklyn location. Renovated with chef\'s kitchen, private terrace, and panoramic skyline views.',
    image: '/images/service-decoration.jpg',
  },
  {
    title: 'Premium Office Space — Manhattan, New York',
    description:
      'Class A office space in the heart of Manhattan. Open-plan design with state-of-the-art amenities and direct subway access.',
    image: '/images/cta-work-together.jpg',
  },
];

export default function WorksSection() {
  const [activeProject, setActiveProject] = useState(0);

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
            Featured properties
          </h2>
          <p className="text-text-secondary max-w-md mx-auto">
            Discover our handpicked selection of exceptional properties available for sale and rent.
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left - Main Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <div className="relative overflow-hidden rounded-2xl group">
              <motion.img
                src={projects[activeProject].image}
                alt={projects[activeProject].title}
                className="w-full h-[350px] md:h-[450px] object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            {/* Thumbnails */}
            <div className="flex gap-3">
              {projects.map((project, index) => (
                <button
                  key={index}
                  onClick={() => setActiveProject(index)}
                  className={`relative overflow-hidden rounded-lg w-20 h-20 transition-all duration-300 ${
                    activeProject === index
                      ? 'ring-2 ring-primary'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>

          {/* Right - Project List */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {projects.map((project, index) => (
              <motion.div
                key={index}
                onClick={() => setActiveProject(index)}
                className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                  activeProject === index
                    ? 'bg-page-bg'
                    : 'bg-transparent hover:bg-page-bg/50'
                }`}
                whileHover={{ x: 4 }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3
                      className={`text-lg font-semibold mb-2 transition-colors ${
                        activeProject === index
                          ? 'text-text-primary'
                          : 'text-text-secondary'
                      }`}
                    >
                      {project.title}
                    </h3>
                    <p className="text-text-muted text-sm leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{
                      opacity: activeProject === index ? 1 : 0,
                      x: activeProject === index ? 0 : -10,
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <ArrowRight className="w-5 h-5 text-primary" />
                  </motion.div>
                </div>
              </motion.div>
            ))}

            {/* Browse Portfolio Button */}
            <Link
              to="#"
              className="inline-flex items-center gap-2 border border-text-primary text-text-primary px-6 py-3 rounded-full text-sm font-medium hover:bg-text-primary hover:text-white transition-all duration-200 group mt-4"
            >
              View all properties
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
