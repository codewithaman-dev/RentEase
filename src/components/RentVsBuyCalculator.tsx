import React, { useState, useEffect } from 'react';
import { Calculator, TrendingDown, X, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const RentVsBuyCalculator: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [stayMonths, setStayMonths] = useState(12);
  const [itemType, setItemType] = useState<'1bhk' | 'bedroom' | 'appliance'>('1bhk');

  // Handle ESC key and background body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

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
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 rounded-full text-xs font-semibold transition-colors cursor-pointer"
      >
        <Calculator className="w-3.5 h-3.5 text-emerald-400" />
        <span>Rent vs Buy Calculator</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <div
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsOpen(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.18 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-lg max-h-[85vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100 my-auto"
            >
              {/* Modal Header with Back Arrow and Close Cross */}
              <div className="px-4 py-3 sm:px-5 border-b border-slate-800/80 bg-slate-950/60 flex items-center justify-between shrink-0">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 rounded-lg transition-all cursor-pointer group"
                  aria-label="Back to Home"
                >
                  <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5 text-emerald-400" />
                  <span>Back</span>
                </button>

                <span className="text-xs font-bold text-slate-200">
                  Rent vs Buy Visualizer
                </span>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 transition-colors cursor-pointer"
                  aria-label="Close Calculator"
                  title="Close (Esc)"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Calculator Content Area */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5 text-slate-100">
                <p className="text-xs text-slate-400">
                  See how much capital you save by renting with RentEase India:
                </p>

                {/* Item Type Selector */}
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-semibold">
                  <button
                    type="button"
                    onClick={() => setItemType('1bhk')}
                    className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer text-center truncate ${
                      itemType === '1bhk' ? 'bg-emerald-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Full 1BHK
                  </button>
                  <button
                    type="button"
                    onClick={() => setItemType('bedroom')}
                    className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer text-center truncate ${
                      itemType === 'bedroom' ? 'bg-emerald-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Bedroom Suite
                  </button>
                  <button
                    type="button"
                    onClick={() => setItemType('appliance')}
                    className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer text-center truncate ${
                      itemType === 'appliance' ? 'bg-emerald-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Appliance Pair
                  </button>
                </div>

                {/* Stay Duration Slider */}
                <div className="space-y-1.5 bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-xs">
                  <div className="flex justify-between items-center font-bold">
                    <span className="text-slate-300">Intended Stay Duration:</span>
                    <span className="text-emerald-400 text-sm font-black">{stayMonths} Months</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="24"
                    step="3"
                    value={stayMonths}
                    onChange={(e) => setStayMonths(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500">
                    <span>3m</span>
                    <span>6m</span>
                    <span>12m</span>
                    <span>18m</span>
                    <span>24m</span>
                  </div>
                </div>

                {/* Side-by-Side Comparison */}
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  {/* Buying Box */}
                  <div className="bg-red-950/25 border border-red-900/40 p-3 rounded-xl space-y-1.5">
                    <h4 className="font-bold text-red-400 uppercase text-[10px] tracking-wider">Buying Outright</h4>
                    <div className="text-lg font-black text-white">₹{buyingTotalOutlay.toLocaleString('en-IN')}</div>
                    <div className="text-[10px] text-slate-400 space-y-0.5 pt-1.5 border-t border-red-900/30 leading-snug">
                      <p>• Initial Cost: ₹{currentModel.buyPrice.toLocaleString('en-IN')}</p>
                      <p>• Mover/Assembly: ₹{currentModel.moverCost.toLocaleString('en-IN')}</p>
                      <p>• Resale Loss: ₹{currentModel.liquidationLoss.toLocaleString('en-IN')}</p>
                    </div>
                  </div>

                  {/* Renting Box */}
                  <div className="bg-emerald-950/30 border border-emerald-800/50 p-3 rounded-xl space-y-1.5">
                    <h4 className="font-bold text-emerald-400 uppercase text-[10px] tracking-wider">Rent with RentEase</h4>
                    <div className="text-lg font-black text-emerald-400">₹{netRentingCost.toLocaleString('en-IN')}</div>
                    <div className="text-[10px] text-slate-300 space-y-0.5 pt-1.5 border-t border-emerald-800/40 leading-snug">
                      <p>• ₹{currentModel.rentMonthly.toLocaleString('en-IN')} × {stayMonths}m</p>
                      <p>• Free Relocation: ₹0</p>
                      <p>• Refundable Deposit: ₹{currentModel.deposit.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>

                {/* Net Savings Banner */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-2.5 sm:p-3 rounded-xl text-slate-950 font-black flex items-center justify-between gap-2 shadow-lg">
                  <span className="text-[11px] uppercase tracking-wider flex items-center gap-1.5 font-bold">
                    <TrendingDown className="w-4 h-4 shrink-0" /> Net Savings:
                  </span>
                  <span className="text-lg sm:text-xl font-black">₹{netSavings.toLocaleString('en-IN')} Saved</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
