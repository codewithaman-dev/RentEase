import React from 'react';
import { Sparkles } from 'lucide-react';

interface RentToOwnBadgeProps {
  monthlyRate: number;
  retailPrice: number;
  rentedMonths?: number;
}

export const RentToOwnBadge: React.FC<RentToOwnBadgeProps> = ({
  monthlyRate,
  retailPrice,
  rentedMonths = 6,
}) => {
  const totalPaidSoFar = monthlyRate * rentedMonths;
  const equityPct = Math.min(100, Math.round((totalPaidSoFar / retailPrice) * 100));
  const buyoutAmount = Math.max(0, retailPrice - totalPaidSoFar);

  return (
    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2.5 text-xs">
      <div className="flex justify-between items-center">
        <span className="font-bold text-amber-300 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-400" /> Rent-to-Own Equity Progress
        </span>
        <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
          {equityPct}% Paid
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
        <div
          className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 rounded-full transition-all duration-500"
          style={{ width: `${equityPct}%` }}
        ></div>
      </div>

      <div className="flex justify-between text-[11px] text-slate-400">
        <span>Paid in Rent: <strong className="text-white">₹{totalPaidSoFar.toLocaleString('en-IN')}</strong></span>
        <span>Buyout Price: <strong className="text-emerald-400">₹{buyoutAmount.toLocaleString('en-IN')}</strong></span>
      </div>
    </div>
  );
};
