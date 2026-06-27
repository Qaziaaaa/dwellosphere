import HeroSection from '@/sections/about/HeroSection';
import StatsSection from '@/sections/about/StatsSection';
import ValuesSection from '@/sections/about/ValuesSection';
import CTASection from '@/sections/home/CTASection';
import TeamSection from '@/sections/about/TeamSection';
import LocationsSection from '@/sections/about/LocationsSection';
import FAQSection from '@/sections/about/FAQSection';

export default function About() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <StatsSection />
      <ValuesSection />
      <CTASection />
      <TeamSection />
      <LocationsSection />
      <FAQSection />
    </main>
  );
}
