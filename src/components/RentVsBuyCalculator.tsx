import React, { useState } from 'react';
import { Calculator, CheckCircle2, TrendingDown, X, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const RentVsBuyCalculator: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [stayMonths, setStayMonths] = useState(12);
  const [itemType, setItemType] = useState<'1bhk' | 'bedroom' | 'appliance'>('1bhk');

  const FINANCIAL_MODELS = {
    '1bhk': {
      title: 'Full 1BHK Apartment Setup (Bed + Sofa + Fridge + Desk)',
      buyPrice: 85000,
      moverCost: 12000,
      liquidationLoss: 35000, // depreciation when selling
      rentMonthly: 2499,
      deposit: 4000,
    },
    'bedroom': {
      title: 'Master Bedroom Suite (Queen Bed + Mattress + Wardrobe)',
      buyPrice: 48000,
      moverCost: 6000,
      liquidationLoss: 20000,
      rentMonthly: 1499,
      deposit: 2500,
    },
    'appliance': {
      title: 'Smart Appliance Pair (260L Fridge + 7.5kg Washer)',
      buyPrice: 53500,
      moverCost: 5000,
      liquidationLoss: 22000,
      rentMonthly: 1699,
      deposit: 3000,
    },
  };

  const currentModel = FINANCIAL_MODELS[itemType];

  // Buying total outlay
  const buyingTotalOutlay = currentModel.buyPrice + currentModel.moverCost;
  const netBuyingCostAfterSale = buyingTotalOutlay - (currentModel.buyPrice - currentModel.liquidationLoss);

  // Renting total outlay
  const rentingTotalOutlay = (currentModel.rentMonthly * stayMonths) + currentModel.deposit;
  const netRentingCost = currentModel.rentMonthly * stayMonths; // deposit refunded 100%

  const netSavings = Math.max(0, netBuyingCostAfterSale - netRentingCost);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 text-emerald-400 font-bold text-xs rounded-full hover:bg-emerald-500/30 transition-all shadow-md"
      >
        <Calculator className="w-4 h-4 text-emerald-400" />
        <span>Rent vs Buy Financial Savings Calculator</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative text-slate-100"
            >
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  Financial Comparison
                </span>
                <h3 className="text-2xl font-black text-white">Rent vs Buy Savings Visualizer</h3>
                <p className="text-xs text-slate-400">See how much capital you save by renting with RentEase India</p>
              </div>

              {/* Item Type Selector */}
              <div className="grid grid-cols-3 gap-2 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setItemType('1bhk')}
                  className={`py-2 rounded-xl transition-all ${
                    itemType === '1bhk' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Full 1BHK Setup
                </button>
                <button
                  type="button"
                  onClick={() => setItemType('bedroom')}
                  className={`py-2 rounded-xl transition-all ${
                    itemType === 'bedroom' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Bedroom Suite
                </button>
                <button
                  type="button"
                  onClick={() => setItemType('appliance')}
                  className={`py-2 rounded-xl transition-all ${
                    itemType === 'appliance' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Appliance Pair
                </button>
              </div>

              {/* Stay Duration Slider */}
              <div className="space-y-2 bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs">
                <div className="flex justify-between font-bold">
                  <span className="text-slate-300">Intended Stay Duration in City:</span>
                  <span className="text-emerald-400 text-sm">{stayMonths} Months</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="24"
                  step="3"
                  value={stayMonths}
                  onChange={(e) => setStayMonths(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>

              {/* Side-by-Side Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Buying Box */}
                <div className="bg-red-950/30 border border-red-900/50 p-5 rounded-2xl space-y-2">
                  <h4 className="font-bold text-red-400 uppercase text-[11px] tracking-wider">Buying Outright</h4>
                  <div className="text-xl font-black text-white">₹{buyingTotalOutlay.toLocaleString('en-IN')}</div>
                  <div className="text-[11px] text-slate-400 space-y-1 pt-1 border-t border-red-900/40">
                    <p>• Initial Buying Cost: ₹{currentModel.buyPrice.toLocaleString('en-IN')}</p>
                    <p>• Mover / Assembly Fees: ₹{currentModel.moverCost.toLocaleString('en-IN')}</p>
                    <p>• Depreciation Resale Loss: ₹{currentModel.liquidationLoss.toLocaleString('en-IN')}</p>
                  </div>
                </div>

                {/* Renting Box */}
                <div className="bg-emerald-950/40 border border-emerald-800 p-5 rounded-2xl space-y-2">
                  <h4 className="font-bold text-emerald-400 uppercase text-[11px] tracking-wider">Renting with RentEase</h4>
                  <div className="text-xl font-black text-emerald-400">₹{netRentingCost.toLocaleString('en-IN')}</div>
                  <div className="text-[11px] text-slate-300 space-y-1 pt-1 border-t border-emerald-800">
                    <p>• Monthly Rent: ₹{currentModel.rentMonthly.toLocaleString('en-IN')} x {stayMonths}m</p>
                    <p>• Free City Relocation: ₹0</p>
                    <p>• 100% Refundable Deposit: ₹{currentModel.deposit.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              </div>

              {/* Net Savings Banner */}
              <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-4 rounded-2xl text-slate-950 font-black text-center flex flex-col sm:flex-row items-center justify-between gap-2 shadow-xl">
                <span className="text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingDown className="w-5 h-5" /> Your Net Financial Savings:
                </span>
                <span className="text-2xl font-black">₹{netSavings.toLocaleString('en-IN')} Saved</span>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
