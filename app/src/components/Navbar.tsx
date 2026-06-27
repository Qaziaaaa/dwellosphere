import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, ArrowRight, User, LogIn } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from '@/hooks/useAuth';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Properties', href: '/properties' },
  { name: 'Services', href: '/services' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  const isAgent = user?.role === 'agent' || user?.role === 'admin';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 p-2 md:p-3 lg:p-4"
    >
      <div className={`mx-auto w-full rounded-2xl md:rounded-[2rem] px-4 md:px-8 transition-colors duration-300 ${
        scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border border-gray-100' : 'bg-transparent'
      }`}>
        <div className="flex items-center justify-between h-[60px] md:h-[64px]">
          <div className="flex items-center gap-10">
            <Link to="/" className="flex items-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#111111]"
              >
                <path d="M12 28L20 4L28 28" stroke="currentColor" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 28V14L10 14V28" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
              </svg>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <div key={link.name} className="relative group">
                  <Link
                    to={link.href}
                    className={`text-[14px] transition-colors tracking-tight relative ${
                      location.pathname === link.href
                        ? 'text-[#111111]'
                        : 'text-[#111111] hover:text-[#555]'
                    }`}
                  >
                    {link.name}
                    {location.pathname === link.href && (
                      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#111111] rounded-full" />
                    )}
                  </Link>
                </div>
              ))}
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Desktop Auth */}
            <div className="hidden md:flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  {isAgent && (
                    <Link
                      to="/agent-dashboard"
                      className="text-[14px] font-medium text-text-secondary hover:text-primary transition-colors"
                    >
                      Dashboard
                    </Link>
                  )}
                  <Link
                    to="/my-bookings"
                    className="text-[14px] font-medium text-text-secondary hover:text-primary transition-colors"
                  >
                    My Bookings
                  </Link>
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 rounded-full border border-border text-[14px] font-medium text-text-primary hover:border-primary transition-all"
                  >
                    <div className="w-6 h-6 rounded-full bg-page-bg flex items-center justify-center overflow-hidden">
                      {user?.avatar ? (
                        <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-3.5 h-3.5" />
                      )}
                    </div>
                    {user?.firstName}
                  </Link>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 text-[14px] font-medium text-text-primary hover:text-primary transition-colors"
                >
                  <LogIn className="w-4 h-4" /> Sign in
                </Link>
              )}
            </div>

            <Link
              to="/contact"
              className="hidden md:inline-flex items-center gap-2 bg-[#FF6B47] text-white px-5 py-2 rounded-full text-[14px] font-medium hover:bg-[#E85A38] transition-all duration-300 group hover:scale-[1.02]"
            >
              Get in touch
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <button className="p-2 text-[#111111]">
                  <Menu className="w-5 h-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-white rounded-l-[2rem]">
                <div className="flex flex-col gap-6 mt-10">
                  {navLinks.map((link) => (
                    <div key={link.name} className="border-b border-gray-50 pb-4">
                      <Link
                        to={link.href}
                        className="text-xl font-medium text-[#111111] hover:text-[#FF6B47] transition-colors block"
                      >
                        {link.name}
                      </Link>
                    </div>
                  ))}
                  {isAuthenticated && (
                    <>
                      <div className="border-b border-gray-50 pb-4">
                        <Link
                          to="/my-bookings"
                          className="text-xl font-medium text-[#111111] hover:text-[#FF6B47] transition-colors block"
                        >
                          My Bookings
                        </Link>
                      </div>
                      {isAgent && (
                        <div className="border-b border-gray-50 pb-4">
                          <Link
                            to="/agent-dashboard"
                            className="text-xl font-medium text-[#111111] hover:text-[#FF6B47] transition-colors block"
                          >
                            Dashboard
                          </Link>
                        </div>
                      )}
                      <div className="border-b border-gray-50 pb-4">
                        <Link
                          to="/profile"
                          className="text-xl font-medium text-[#111111] hover:text-[#FF6B47] transition-colors block"
                        >
                          My profile
                        </Link>
                      </div>
                    </>
                  )}
                  {!isAuthenticated && (
                    <div className="border-b border-gray-50 pb-4">
                      <Link
                        to="/login"
                        className="text-xl font-medium text-[#111111] hover:text-[#FF6B47] transition-colors block"
                      >
                        Sign in
                      </Link>
                    </div>
                  )}
                  <Link
                    to="/contact"
                    className="inline-flex items-center justify-center gap-2 bg-[#FF6B47] text-white px-6 py-4 rounded-full text-base font-medium hover:bg-[#E85A38] transition-colors mt-8"
                  >
                    Get in touch
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
