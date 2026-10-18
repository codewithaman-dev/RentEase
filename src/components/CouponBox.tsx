import React, { useState } from 'react';
import { Tag } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

interface CouponBoxProps {
  onApplyDiscount: (discountAmount: number) => void;
}

export const CouponBox: React.FC<CouponBoxProps> = ({ onApplyDiscount }) => {
  const [code, setCode] = useState('');
  const [appliedCode, setAppliedCode] = useState<string | null>(null);
  const { showToast } = useToast();

  const COUPONS: Record<string, number> = {
    WELCOME500: 500,
    RENT100: 100,
    STUDENT300: 300,
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = code.toUpperCase().trim();

    if (COUPONS[cleanCode]) {
      const discount = COUPONS[cleanCode];
      setAppliedCode(cleanCode);
      onApplyDiscount(discount);
      showToast(`Coupon "${cleanCode}" applied! Saved ₹${discount}`, 'success');
    } else {
      showToast('Invalid promo code. Try "WELCOME500" or "RENT100"', 'error');
    }
  };

  return (
    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3 text-xs">
      <div className="flex items-center justify-between">
        <span className="font-bold text-white flex items-center gap-1.5">
          <Tag className="w-4 h-4 text-emerald-400" /> Apply Discount Coupon
        </span>
        <span className="text-[10px] text-emerald-400 font-semibold">Try: WELCOME500</span>
      </div>

      <form onSubmit={handleApply} className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter promo code"
          className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white uppercase placeholder-slate-500 flex-1 focus:outline-none focus:border-emerald-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl transition-colors shrink-0"
        >
          Apply
        </button>
      </form>

      {appliedCode && (
        <div className="bg-emerald-950/60 border border-emerald-800 p-2 rounded-xl text-[11px] text-emerald-300 font-bold flex items-center justify-between">
          <span>Promo "{appliedCode}" Active</span>
          <span>-₹{COUPONS[appliedCode]} Off</span>
        </div>
      )}
    </div>
  );
};
