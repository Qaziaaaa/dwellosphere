import AgentDashboardSection from '@/sections/bookings/AgentDashboardSection';
import ListingGenerator from '@/components/ListingGenerator';

export default function AgentDashboardPage() {
  return (
    <main className="min-h-screen">
      <AgentDashboardSection />
      <section className="mx-auto max-w-7xl px-4 py-12">
        <ListingGenerator />
      </section>
    </main>
  );
}
