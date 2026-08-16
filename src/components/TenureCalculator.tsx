import React from 'react';
import { Calendar, ShieldCheck, TrendingDown } from 'lucide-react';
import { Product } from '../types';

interface TenureCalculatorProps {
  product: Product;
  selectedTenure: 3 | 6 | 12;
  onSelectTenure: (tenure: 3 | 6 | 12) => void;
}

export const TenureCalculator: React.FC<TenureCalculatorProps> = ({
  product,
  selectedTenure,
  onSelectTenure,
}) => {
  const getMonthlyRate = (tenure: 3 | 6 | 12) => {
    if (tenure === 3) return product.monthly_rate_3m;
    if (tenure === 6) return product.monthly_rate_6m;
    return product.monthly_rate_12m;
  };

  const currentRate = getMonthlyRate(selectedTenure);
  const highestRate = product.monthly_rate_3m;
  const savingsPct = Math.round(((highestRate - currentRate) / highestRate) * 100);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-slate-100 text-sm flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-400" />
          Select Rental Tenure
        </h4>
        {savingsPct > 0 && (
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
            <TrendingDown className="w-3 h-3" /> Save {savingsPct}% per month
          </span>
        )}
      </div>

      {/* Tenure Options Grid */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { tenure: 3 as const, label: '3 Months', tag: 'Short Term' },
          { tenure: 6 as const, label: '6 Months', tag: 'Popular' },
          { tenure: 12 as const, label: '12+ Months', tag: 'Best Value' },
        ].map((item) => {
          const rate = getMonthlyRate(item.tenure);
          const isSelected = selectedTenure === item.tenure;

          return (
            <button
              key={item.tenure}
              type="button"
              onClick={() => onSelectTenure(item.tenure)}
              className={`p-3 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'border-emerald-500 bg-emerald-950/30 ring-2 ring-emerald-500/20'
                  : 'border-slate-800 bg-slate-800/40 hover:border-slate-700 hover:bg-slate-800/80'
              }`}
            >
              <div>
                <div className="text-xs text-slate-400 font-medium">{item.label}</div>
                <div className="text-lg font-black text-white mt-1">₹{rate.toLocaleString('en-IN')}<span className="text-xs text-slate-400 font-normal">/mo</span></div>
              </div>

              <div className="mt-2 flex items-center justify-between">
                <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                  isSelected ? 'bg-emerald-500 text-slate-950 font-bold' : 'bg-slate-700 text-slate-300'
                }`}>
                  {item.tag}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Financial Summary */}
      <div className="bg-slate-950/60 rounded-xl p-3 text-xs space-y-2 border border-slate-800/80">
        <div className="flex justify-between text-slate-300">
          <span>Monthly Rental Fee:</span>
          <span className="font-bold text-white">₹{currentRate.toLocaleString('en-IN')} / month</span>
        </div>
        <div className="flex justify-between text-slate-300">
          <span className="flex items-center gap-1">
            Refundable Security Deposit:
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
          </span>
          <span className="font-bold text-teal-400">₹{product.deposit_amount.toLocaleString('en-IN')}</span>
        </div>
        <div className="flex justify-between text-slate-300 pt-1 border-t border-slate-800">
          <span>Retail Purchase Price (for comparison):</span>
          <span className="text-slate-400 line-through">₹{product.retail_price.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  );
};
