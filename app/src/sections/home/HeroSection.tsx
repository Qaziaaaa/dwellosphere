import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  return (
    <section className="w-full p-2 md:p-3 lg:p-4 pt-2 md:pt-3 lg:pt-4 overflow-hidden">
      <div 
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-[#E2E6E9] pt-[100px] md:pt-[140px] flex flex-col items-center min-h-[85vh] md:min-h-[125vh]"
      >
        {/* Parallax Background Image - Full Cover */}
        <motion.div 
          style={{ scale, y }}
          className="absolute inset-0 w-full h-full origin-center"
        >
          <img
            src="/images/hero_architecture_light_sky.png"
            alt="Modern timber architecture with pool"
            className="w-full h-full object-cover object-center"
          />
        </motion.div>

        {/* Content - Sits comfortably near the top */}
        <div className="relative z-20 w-full flex-grow flex flex-col justify-start px-4 text-center mt-2 pointer-events-none">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                  delayChildren: 0.2,
                },
              },
            }}
            className="max-w-4xl mx-auto pointer-events-auto"
          >
            <motion.h1
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
                },
              }}
              className="text-[2rem] sm:text-[2.6rem] md:text-[3.2rem] lg:text-[3.8rem] font-medium text-[#111111] leading-[1.05] tracking-[-0.03em]"
            >
              Find your perfect home.<br className="hidden sm:block" /> Live the life you deserve.
            </motion.h1>
            
            <motion.div
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
                },
              }}
              className="mt-5 mb-4 md:mt-7"
            >
              <Link
                to="#"
                className="inline-flex items-center gap-2 bg-[#FF6B47] text-white px-6 py-3 rounded-full text-[14px] font-medium hover:bg-[#E85A38] transition-all duration-300 group hover:scale-[1.02] shadow-sm tracking-wide"
              >
                Get in touch
                <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
