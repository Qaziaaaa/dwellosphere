import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'How do I search for properties on DwelloSphere?',
    answer:
      'You can search by location, property type, price range, bedrooms, and more using our advanced filters. Our AI-powered recommendations also suggest properties based on your preferences and browsing history.',
  },
  {
    question: 'Is DwelloSphere free for home buyers and renters?',
    answer:
      'Yes, browsing properties and using our search tools is completely free for buyers and renters. We earn commission from sellers and landlords when a transaction is completed through our platform.',
  },
  {
    question: 'How do I schedule a property viewing?',
    answer:
      'Simply click "Schedule a viewing" on any property page, select your preferred date and time from the available slots, and confirm. You\'ll receive an instant confirmation and reminder notifications.',
  },
  {
    question: 'Can I apply for a rental online?',
    answer:
      'Yes, our digital application process lets you submit your application, upload documents, and pay application fees entirely online. Landlords typically respond within 24-48 hours.',
  },
  {
    question: 'How does the property management service work?',
    answer:
      'Landlords can list their properties, screen tenants, collect rent, coordinate maintenance, and access financial reports — all through our dashboard. We handle the day-to-day so you don\'t have to.',
  },
  {
    question: 'What areas do you serve?',
    answer:
      'We currently operate in major markets across the United States and Europe, including New York, San Francisco, Los Angeles, Chicago, London, and Amsterdam, with plans to expand globally.',
  },
];

export default function FAQSection() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left - Title */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-text-primary mb-4">
              You ask, we answer
            </h2>
            <p className="text-text-secondary mb-8 leading-relaxed max-w-md">
              Have more questions? We're here to help with anything you need.
            </p>
            <Link
              to="#"
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-primary-hover transition-all duration-200 group hover:scale-[1.02]"
            >
              Get in touch
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>

          {/* Right - Accordion */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="bg-white rounded-xl border-none shadow-sm px-5 data-[state=open]:shadow-md transition-shadow"
                >
                  <AccordionTrigger className="text-left text-text-primary font-semibold hover:no-underline py-4 text-base">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-text-secondary text-sm leading-relaxed pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
