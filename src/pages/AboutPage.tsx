import React from 'react';
import { RefreshCw, Award, HeartHandshake } from 'lucide-react';
import { motion } from 'framer-motion';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 bg-slate-950 text-slate-100 min-h-screen">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          Our Vision & Mission
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Furnish Your Home, <br />
          <span className="text-gradient-emerald">Not Your Worries.</span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          RentEase India was built to solve the mobility challenge faced by 35+ million young professionals and students relocating across Indian tech hubs every year.
        </p>
      </div>

      {/* Grid Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div
          whileHover={{ y: -5 }}
          className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-4 shadow-xl"
        >
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl w-fit">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">Quality Grade A Standard</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Every wooden bed, plush couch, smart fridge, and washing machine undergoes a 12-point sanitization and structural quality inspection before doorstep delivery.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-4 shadow-xl"
        >
          <div className="p-3 bg-teal-500/10 border border-teal-500/20 text-teal-400 rounded-2xl w-fit">
            <RefreshCw className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">100% Free City Relocation</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Changing flats from Bellandur to Indiranagar or Powai to Bandra? Our logistics team uninstalls, moves, and reinstalls your furniture for ₹0.
          </p>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          className="bg-slate-900 border border-slate-800 p-8 rounded-3xl space-y-4 shadow-xl"
        >
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-2xl w-fit">
            <HeartHandshake className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">Zero Capital Barrier</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Enjoy full 1BHK home comfort for ₹2,499/month instead of tying up ₹80,000+ in non-liquid physical furniture purchases.
          </p>
        </motion.div>
      </div>

      {/* Metro Presence */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-6">
        <h2 className="text-2xl font-black text-white text-center">Active Across 6 Major Indian Metros</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 text-center text-xs font-bold">
          {['Bengaluru', 'Mumbai', 'Delhi NCR', 'Pune', 'Hyderabad', 'Chennai'].map((city) => (
            <div key={city} className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80 text-slate-200">
              <span className="block text-emerald-400 text-sm font-black mb-1">48h Delivery</span>
              {city}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
