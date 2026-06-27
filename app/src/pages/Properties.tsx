import { useSearchParams } from 'react-router-dom';
import HeroSection from '@/sections/properties/HeroSection';
import PropertyGridSection from '@/sections/properties/PropertyGridSection';
import AISearchBar from '@/components/AISearchBar';

export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams();
  const aiQuery = searchParams.get('q') || '';

  return (
    <main className="min-h-screen">
      <HeroSection />
      <div className="mx-auto flex max-w-7xl justify-center px-4 py-6">
        <AISearchBar
          onSearch={(q) => setSearchParams({ q })}
          placeholder="Search with AI... e.g. &quot;spacious studio under 2k near park&quot;"
        />
      </div>
      <PropertyGridSection aiQuery={aiQuery} />
    </main>
  );
}
