import HeroSection from '@/sections/home/HeroSection';
import LogoBar from '@/sections/home/LogoBar';
import ServicesSection from '@/sections/home/ServicesSection';
import CTASection from '@/sections/home/CTASection';
import WorksSection from '@/sections/home/WorksSection';
import WorkTogetherSection from '@/sections/home/WorkTogetherSection';
import ProcessSection from '@/sections/home/ProcessSection';
import TestimonialsSection from '@/sections/home/TestimonialsSection';
import ArticlesSection from '@/sections/home/ArticlesSection';
import RecommendedProperties from '@/components/RecommendedProperties';
import AISearchBar from '@/components/AISearchBar';

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <div className="mx-auto flex max-w-7xl justify-center px-4 py-8">
        <AISearchBar />
      </div>
      <RecommendedProperties limit={4} />
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
