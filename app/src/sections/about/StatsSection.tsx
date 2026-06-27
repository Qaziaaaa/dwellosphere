import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { useCountUp } from '@/hooks/useCountUp';

const stats = [
  { value: 12500, suffix: '+', label: 'Properties listed & sold' },
  { value: 98, suffix: '%', label: 'Client satisfaction rate' },
  { value: 4500, suffix: '+', label: 'Happy homeowners' },
  { value: 150, suffix: '+', label: 'Industry awards' },
];

function StatItem({
  value,
  suffix,
  label,
  delay,
}: {
  value: number;
  suffix: string;
  label: string;
  delay: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { count, setIsInView } = useCountUp(value, 2);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [setIsInView]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className="text-center"
    >
      <div className="text-4xl md:text-5xl lg:text-6xl font-semibold text-text-primary mb-2">
        {count}
        {suffix}
      </div>
      <p className="text-text-secondary text-sm">{label}</p>
    </motion.div>
  );
}

export default function StatsSection() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat, index) => (
            <StatItem
              key={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              label={stat.label}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
