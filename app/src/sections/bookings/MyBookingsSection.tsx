import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, XCircle, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { getBookingsByTenant, updateBookingStatus } from '@/services/booking.service';
import type { Booking, BookingStatus } from '@/types/booking.types';

const statusConfig: Record<BookingStatus, { color: string; bg: string; icon: typeof CheckCircle; label: string }> = {
  pending: { color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20', icon: Clock, label: 'Pending' },
  confirmed: { color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20', icon: CheckCircle, label: 'Confirmed' },
  completed: { color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', icon: CheckCircle, label: 'Completed' },
  cancelled: { color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20', icon: XCircle, label: 'Cancelled' },
};

export default function MyBookingsSection() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<BookingStatus | 'all'>('all');

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    getBookingsByTenant(user.id).then((data) => {
      if (cancelled) return;
      setBookings(data);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [user]);

  const filtered = useMemo(
    () => (filter === 'all' ? bookings : bookings.filter((b) => b.status === filter)),
    [bookings, filter]
  );

  const handleCancel = async (id: string) => {
    const updated = await updateBookingStatus(id, 'cancelled');
    if (updated) {
      setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
    }
  };

  const tabs: { value: BookingStatus | 'all'; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'pending', label: 'Pending' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  if (!user) return null;

  return (
    <section className="pt-28 pb-16 md:pt-36 md:pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-4xl font-semibold text-text-primary mb-2">My Bookings</h1>
          <p className="text-text-secondary mb-8">Manage your property viewing appointments.</p>

          <div className="flex flex-wrap gap-2 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  filter === tab.value
                    ? 'bg-primary text-white'
                    : 'bg-page-bg text-text-secondary hover:text-text-primary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="mx-auto h-12 w-12 text-text-muted mb-4" />
              <p className="text-text-secondary">No bookings found.</p>
              <Link
                to="/properties"
                className="mt-4 inline-flex items-center gap-2 text-primary hover:underline text-sm"
              >
                Browse properties
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((booking) => {
                const status = statusConfig[booking.status];
                const StatusIcon = status.icon;
                return (
                  <motion.div
                    key={booking.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-2xl border border-border p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </span>
                      </div>
                      {booking.status === 'pending' && (
                        <button
                          onClick={() => handleCancel(booking.id)}
                          className="text-xs text-red-500 hover:text-red-700 transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>

                    <Link to={`/properties/${booking.propertyId}`} className="group">
                      <h3 className="font-semibold text-text-primary group-hover:text-primary transition-colors">
                        {booking.propertyTitle}
                      </h3>
                    </Link>

                    <div className="mt-3 space-y-1.5 text-sm text-text-secondary">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 flex-shrink-0" />
                        <span>{new Date(booking.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 flex-shrink-0" />
                        <span>{booking.timeSlot}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span>Agent: {booking.agentName}</span>
                      </div>
                    </div>

                    {booking.message && (
                      <p className="mt-3 text-xs text-text-muted italic line-clamp-2">{booking.message}</p>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
