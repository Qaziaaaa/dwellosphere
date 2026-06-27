import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Facebook, Instagram, Linkedin } from 'lucide-react';
import { Input } from '@/components/ui/input';

const footerLinks = {
  column1: [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Properties', href: '/properties' },
    { name: 'Services', href: '/services' },
    { name: 'Contact', href: '/contact' },
  ],
  column2: [
    { name: 'Buy', href: '/properties?sale=for-sale' },
    { name: 'Rent', href: '/properties?sale=for-rent' },
    { name: 'Sell', href: '/services' },
    { name: 'Property Management', href: '/services' },
    { name: 'Market Insights', href: '#' },
  ],
  column3: [
    { name: 'FAQ', href: '/about#faq' },
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Cookie Policy', href: '#' },
  ],
  column4: [
    { name: 'Careers', href: '#' },
    { name: 'Press Kit', href: '#' },
    { name: 'Partner Program', href: '#' },
    { name: 'Affiliates', href: '#' },
    { name: 'Support', href: '/contact' },
  ],
};

export default function Footer() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    setEmail('');
  };

  return (
    <footer className="bg-dark-bg text-white">
      {/* Newsletter Section */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-8"
          >
            <div>
              <h3 className="text-2xl md:text-3xl font-semibold mb-2">
                Stay ahead in real estate
              </h3>
              <p className="text-white/60 text-sm max-w-md">
                Subscribe to our newsletter for exclusive property listings, market insights, and expert tips.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2 w-full md:w-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-dark-surface border-white/20 text-white placeholder:text-white/40 rounded-full px-5 py-3 w-full md:w-64 focus:border-primary"
              />
              <button
                type="submit"
                className="bg-primary text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-primary-hover transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Links Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Column 1 */}
          <div>
            <ul className="space-y-3">
              {footerLinks.column1.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-white/60 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <ul className="space-y-3">
              {footerLinks.column2.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-white/60 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <ul className="space-y-3">
              {footerLinks.column3.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-white/60 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <ul className="space-y-3">
              {footerLinks.column4.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-white/60 hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <svg
                width="28"
                height="28"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path
                  d="M8 28L16 4L24 28H8Z"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 20H20"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
              <span className="text-lg font-semibold">DwelloSphere</span>
            </Link>

            {/* Copyright */}
            <p className="text-sm text-white/40">
              Copyright &copy; DwelloSphere. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="text-white/60 hover:text-primary transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-white/60 hover:text-primary transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-white/60 hover:text-primary transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
