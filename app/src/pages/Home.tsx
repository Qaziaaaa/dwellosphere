import HeroSection from '@/sections/home/HeroSection';
import LogoBar from '@/sections/home/LogoBar';
import ServicesSection from '@/sections/home/ServicesSection';
import CTASection from '@/sections/home/CTASection';
import WorksSection from '@/sections/home/WorksSection';
import WorkTogetherSection from '@/sections/home/WorkTogetherSection';
import ProcessSection from '@/sections/home/ProcessSection';
import TestimonialsSection from '@/sections/home/TestimonialsSection';
import ArticlesSection from '@/sections/home/ArticlesSection';

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <LogoBar />
      <ServicesSection />
      <CTASection />
      <WorksSection />
      <WorkTogetherSection />
      <ProcessSection />
      <TestimonialsSection />
      <ArticlesSection />
    </main>
  );
}
