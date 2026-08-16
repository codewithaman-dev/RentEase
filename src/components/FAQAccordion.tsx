import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: 'How does the free city relocation service work?',
    answer: 'If you move flats within Bengaluru, Mumbai, Delhi NCR, Pune, or Hyderabad during your tenure, submit a request from your dashboard. Our logistics team will pick up, transport, and reinstall your rented items at your new apartment for ₹0 additional charge!',
  },
  {
    question: 'Is there any security deposit required?',
    answer: 'We offer zero security deposit options for users who verify their Aadhaar Card, Student College ID, or Corporate Work ID. Standard deposits range from ₹900 to ₹2,000 depending on item category and are 100% refunded via UPI within 48 hours of return inspection.',
  },
  {
    question: 'What happens if an appliance breaks down or needs service?',
    answer: 'Maintenance is 100% free! Simply raise a 1-click support ticket from your Renter Dashboard. Our certified technician will visit your home within 24 hours to repair or replace the item with zero service fee.',
  },
  {
    question: 'Can I extend or shorten my rental tenure?',
    answer: 'Yes! You can extend your tenure anytime from your dashboard with longer tenure discount rates applied. If you need to return early, you can schedule a pickup through the app.',
  },
  {
    question: 'How does delivery and assembly work?',
    answer: 'We deliver and assemble all furniture and appliances at your doorstep within 48 hours of order confirmation. Our team handles lifting, unboxing, and complete setup.',
  },
];

export const FAQAccordion: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-4">
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold text-emerald-400">
          <HelpCircle className="w-3.5 h-3.5" /> Frequently Asked Questions
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white">Got Questions? We’ve Got Answers.</h2>
        <p className="text-xs text-slate-400">Everything you need to know about renting with RentEase India</p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all duration-300"
            >
              <button
                onClick={() => toggleIndex(idx)}
                className="w-full p-5 text-left font-bold text-sm text-white flex justify-between items-center gap-4 hover:text-emerald-400 transition-colors"
              >
                <span>{faq.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-emerald-400 transition-transform duration-300 shrink-0 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="p-5 pt-0 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 mt-1 pt-3">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};
