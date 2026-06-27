import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Calendar, Shield, ArrowRight, LogOut } from 'lucide-react';

const roleLabels: Record<string, string> = {
  tenant: 'Tenant / Renter',
  agent: 'Agent / Landlord',
  admin: 'Administrator',
};

const roleColors: Record<string, string> = {
  tenant: 'bg-blue-100 text-blue-600',
  agent: 'bg-green-100 text-green-600',
  admin: 'bg-purple-100 text-purple-600',
};

export default function ProfileSection() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <h1 className="text-3xl md:text-4xl font-semibold text-text-primary mb-8">
            My profile
          </h1>

          {/* Profile Card */}
          <div className="bg-white rounded-2xl p-6 md:p-8 border border-border shadow-sm mb-6">
            <div className="flex items-start gap-5 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-page-bg flex items-center justify-center flex-shrink-0">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.firstName}
                    className="w-full h-full rounded-2xl object-cover"
                  />
                ) : (
                  <User className="w-7 h-7 text-text-secondary" />
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-text-primary">
                  {user.firstName} {user.lastName}
                </h2>
                <span
                  className={`inline-block mt-1 px-3 py-0.5 rounded-full text-xs font-medium ${roleColors[user.role]}`}
                >
                  {roleLabels[user.role]}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <Mail className="w-4 h-4" /> {user.email}
              </div>
              {user.phone && (
                <div className="flex items-center gap-3 text-sm text-text-secondary">
                  <Phone className="w-4 h-4" /> {user.phone}
                </div>
              )}
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <Calendar className="w-4 h-4" /> Member since{' '}
                {new Date(user.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
              <div className="flex items-center gap-3 text-sm text-text-secondary">
                <Shield className="w-4 h-4" /> ID: {user.id}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Link
              to="/properties"
              className="flex items-center justify-between bg-white rounded-2xl p-5 border border-border shadow-sm hover:shadow-md transition-all group"
            >
              <div>
                <p className="font-semibold text-text-primary">Browse properties</p>
                <p className="text-xs text-text-muted mt-0.5">Explore listings and save favorites</p>
              </div>
              <ArrowRight className="w-5 h-5 text-text-secondary transition-transform group-hover:translate-x-1" />
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-between bg-white rounded-2xl p-5 border border-border shadow-sm hover:shadow-md transition-all group text-left"
            >
              <div className="flex items-center gap-3">
                <LogOut className="w-5 h-5 text-red-500" />
                <div>
                  <p className="font-semibold text-red-500">Sign out</p>
                  <p className="text-xs text-text-muted mt-0.5">Log out of your account</p>
                </div>
              </div>
              <ArrowRight className="w-5 h-5 text-text-secondary transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
