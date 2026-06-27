import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, XCircle, CheckCircle, Users, CalendarCheck, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getBookingsByAgent, updateBookingStatus } from '@/services/booking.service';
import type { Booking, BookingStatus } from '@/types/booking.types';

const statusConfig: Record<BookingStatus, { color: string; bg: string; icon: typeof CheckCircle; label: string }> = {
  pending: { color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20', icon: Clock, label: 'Pending' },
  confirmed: { color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20', icon: CheckCircle, label: 'Confirmed' },
  completed: { color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', icon: CheckCircle, label: 'Completed' },
  cancelled: { color: 'text-red-600', bg: 'bg-red-50 dark:bg-red-900/20', icon: XCircle, label: 'Cancelled' },
};

export default function AgentDashboardSection() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    getBookingsByAgent(user.id).then((data) => {
      if (cancelled) return;
      setBookings(data);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [user]);

  const stats = useMemo(() => {
    const total = bookings.length;
    const pending = bookings.filter((b) => b.status === 'pending').length;
    const confirmed = bookings.filter((b) => b.status === 'confirmed').length;
    const completed = bookings.filter((b) => b.status === 'completed').length;
    return { total, pending, confirmed, completed };
  }, [bookings]);

  const upcoming = useMemo(() => {
    return bookings
      .filter((b) => b.status === 'pending' || b.status === 'confirmed')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [bookings]);

  const handleStatus = async (id: string, status: BookingStatus) => {
    const updated = await updateBookingStatus(id, status);
    if (updated) {
      setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
    }
  };

  if (!user) return null;

  return (
    <section className="pt-28 pb-16 md:pt-36 md:pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl md:text-4xl font-semibold text-text-primary mb-2">Agent Dashboard</h1>
          <p className="text-text-secondary mb-8">Manage viewing requests and appointments.</p>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                {[
                  { icon: CalendarCheck, label: 'Total Requests', value: stats.total, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
                  { icon: Clock, label: 'Pending', value: stats.pending, color: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-900/20' },
                  { icon: CheckCircle, label: 'Confirmed', value: stats.confirmed, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
                  { icon: TrendingUp, label: 'Completed', value: stats.completed, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white rounded-2xl border border-border p-4 shadow-sm">
                    <div className={`inline-flex p-2 rounded-xl ${stat.bg} mb-3`}>
                      <stat.icon className={`h-5 w-5 ${stat.color}`} />
                    </div>
                    <p className="text-2xl font-bold text-text-primary">{stat.value}</p>
                    <p className="text-xs text-text-muted">{stat.label}</p>
                  </div>
                ))}
              </div>

              <h2 className="text-xl font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Upcoming Appointments
              </h2>

              {upcoming.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-border">
                  <Calendar className="mx-auto h-10 w-10 text-text-muted mb-3" />
                  <p className="text-text-secondary">No upcoming appointments.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcoming.map((booking) => {
                    const status = statusConfig[booking.status];
                    const StatusIcon = status.icon;
                    return (
                      <motion.div
                        key={booking.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white rounded-2xl border border-border p-5 shadow-sm"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className={`p-2 rounded-xl ${status.bg}`}>
                              <StatusIcon className={`h-5 w-5 ${status.color}`} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${status.bg} ${status.color}`}>
                                  {status.label}
                                </span>
                              </div>
                              <p className="font-semibold text-text-primary">{booking.propertyTitle}</p>
                              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-text-secondary">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3.5 w-3.5" />
                                  {new Date(booking.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5" />
                                  {booking.timeSlot}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="h-3.5 w-3.5" />
                                  {booking.tenantName}
                                </span>
                              </div>
                              {booking.message && (
                                <p className="mt-1 text-xs text-text-muted italic">"{booking.message}"</p>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            {booking.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleStatus(booking.id, 'confirmed')}
                                  className="px-4 py-2 bg-emerald-600 text-white rounded-full text-sm font-medium hover:bg-emerald-700 transition-colors"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => handleStatus(booking.id, 'cancelled')}
                                  className="px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm font-medium hover:bg-red-200 transition-colors"
                                >
                                  Decline
                                </button>
                              </>
                            )}
                            {booking.status === 'confirmed' && (
                              <button
                                onClick={() => handleStatus(booking.id, 'completed')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
                              >
                                Mark Complete
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
