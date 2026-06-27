import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const contactInfo = [
  {
    icon: MapPin,
    label: 'Visit us',
    value: '123 Business Ave, Suite 400\nNew York, NY 10001',
  },
  {
    icon: Phone,
    label: 'Call us',
    value: '+1 (555) 123-4567',
  },
  {
    icon: Mail,
    label: 'Email us',
    value: 'hello@dwelloSphere.com',
  },
  {
    icon: Clock,
    label: 'Working hours',
    value: 'Mon–Fri: 9:00 AM – 6:00 PM\nSat: 10:00 AM – 3:00 PM',
  },
];

export default function FormSection() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            <h2 className="text-2xl font-semibold text-text-primary mb-6">
              Send us a message
            </h2>
            <form className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">
                    First name
                  </label>
                  <Input
                    placeholder="John"
                    className="rounded-xl border-border bg-page-bg px-4 py-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1.5">
                    Last name
                  </label>
                  <Input
                    placeholder="Doe"
                    className="rounded-xl border-border bg-page-bg px-4 py-3"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">
                  Email
                </label>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  className="rounded-xl border-border bg-page-bg px-4 py-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">
                  Subject
                </label>
                <Input
                  placeholder="How can we help?"
                  className="rounded-xl border-border bg-page-bg px-4 py-3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1.5">
                  Message
                </label>
                <Textarea
                  placeholder="Tell us more about what you're looking for..."
                  className="rounded-xl border-border bg-page-bg px-4 py-3 min-h-[140px]"
                />
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-primary-hover transition-all duration-200 group hover:scale-[1.02]"
              >
                Send message
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="space-y-6"
          >
            {contactInfo.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                className="bg-page-bg rounded-2xl p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-text-muted text-sm mb-1">{item.label}</p>
                    <p className="text-text-primary font-medium whitespace-pre-line">
                      {item.value}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
