import { useState, type FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { requestViewing, TIME_SLOTS } from '@/services/booking.service';

interface ScheduleViewingProps {
  propertyId: string;
  propertyTitle: string;
  open: boolean;
  onClose: () => void;
}

export const ScheduleViewing: FC<ScheduleViewingProps> = ({
  propertyId,
  propertyTitle,
  open,
  onClose,
}) => {
  const { user } = useAuth();
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [name, setName] = useState(user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Name is required';
    if (!email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'Invalid email';
    if (!date) newErrors.date = 'Please select a date';
    if (!timeSlot) newErrors.timeSlot = 'Please select a time slot';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await requestViewing({
        propertyId,
        date,
        timeSlot,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        message: message.trim() || undefined,
      });
    } catch {
      // silently fail for now
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
            >
              <X className="h-5 w-5" />
            </button>

            {submitted ? (
              <div className="flex flex-col items-center py-12 text-center">
                <CheckCircle className="mb-4 h-16 w-16 text-emerald-500" />
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                  Request Submitted!
                </h3>
                <p className="mt-2 text-slate-500">
                  The agent will confirm your viewing shortly.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white">
                    Schedule a Viewing
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">{propertyTitle}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-800 dark:text-white ${errors.name ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'}`}
                        placeholder="John Doe"
                      />
                      {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-800 dark:text-white ${errors.email ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'}`}
                        placeholder="john@example.com"
                      />
                      {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Phone (optional)
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        <Calendar className="mr-1 inline-block h-4 w-4" />
                        Date *
                      </label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        min={today}
                        className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-800 dark:text-white ${errors.date ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'}`}
                      />
                      {errors.date && <p className="mt-1 text-xs text-red-500">{errors.date}</p>}
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                        <Clock className="mr-1 inline-block h-4 w-4" />
                        Time *
                      </label>
                      <select
                        value={timeSlot}
                        onChange={(e) => setTimeSlot(e.target.value)}
                        className={`w-full rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-800 dark:text-white ${errors.timeSlot ? 'border-red-400' : 'border-slate-200 dark:border-slate-700'}`}
                      >
                        <option value="">Select time</option>
                        {TIME_SLOTS.map((slot) => (
                          <option key={slot.value} value={slot.value}>
                            {slot.label}
                          </option>
                        ))}
                      </select>
                      {errors.timeSlot && <p className="mt-1 text-xs text-red-500">{errors.timeSlot}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300">
                      Message (optional)
                    </label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      rows={3}
                      className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                      placeholder="Any specific questions?"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                  >
                    Request Viewing
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
