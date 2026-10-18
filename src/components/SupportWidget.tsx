import React, { useState } from 'react';
import { MessageCircle, Phone, X, HelpCircle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const SupportWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="mb-3 w-80 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-2xl space-y-4 text-slate-100"
          >
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></div>
                <h4 className="font-bold text-sm text-white">RentEase Customer Assistance</h4>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Need help selecting furniture, checking PIN code serviceability, or scheduling a free relocation?
            </p>

            <div className="space-y-2 text-xs font-semibold">
              <a
                href="https://wa.me/919876543210?text=Hello%20RentEase,%20I%20have%20a%20query%20about%20furniture%20rentals"
                target="_blank"
                rel="noreferrer"
                className="w-full p-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl flex items-center justify-between transition-colors shadow-md"
              >
                <span className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
                </span>
                <ChevronRight className="w-4 h-4" />
              </a>

              <a
                href="tel:+918041239900"
                className="w-full p-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl flex items-center justify-between transition-colors border border-slate-700"
              >
                <span className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-teal-400" /> Call Support (24/7)
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        aria-label="Open Help and Support"
        onClick={() => setIsOpen(!isOpen)}
        className="p-3.5 sm:px-5 sm:py-3.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-full shadow-2xl flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer"
      >
        <MessageCircle className="w-5 h-5 text-slate-950" />
        <span className="hidden sm:inline text-xs font-bold">Help & Support</span>
      </button>
    </div>
  );
};
