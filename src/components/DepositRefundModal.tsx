import React, { useState } from 'react';
import { ShieldCheck, Check, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface DepositRefundModalProps {
  depositAmount: number;
  onClose: () => void;
}

export const DepositRefundModal: React.FC<DepositRefundModalProps> = ({ depositAmount, onClose }) => {
  const [checkedItems, setCheckedItems] = useState([true, true, true, true, true]);

  const CHECKLIST = [
    'No structural wooden cracks or frame breakage',
    'No permanent ink, wine, or oil stains on fabric upholstery',
    'Appliance motor and power cord intact (no open electrical wires)',
    'All accessories (remote, shelves, cushions, keys) present',
    'Basic cleaning done prior to pickup team arrival',
  ];

  const toggleCheck = (index: number) => {
    const updated = [...checkedItems];
    updated[index] = !updated[index];
    setCheckedItems(updated);
  };

  const allPassed = checkedItems.every(Boolean);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 space-y-5 shadow-2xl relative text-slate-100 text-xs"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest bg-teal-500/10 px-3 py-1 rounded-full border border-teal-500/20">
            48h Deposit Refund Inspector
          </span>
          <h3 className="text-xl font-bold text-white">Return Inspection Checklist</h3>
          <p className="text-slate-400">Total Refundable Deposit: <strong className="text-teal-400 font-bold">₹{depositAmount.toLocaleString('en-IN')}</strong></p>
        </div>

        <div className="space-y-2">
          {CHECKLIST.map((item, idx) => (
            <label
              key={idx}
              onClick={() => toggleCheck(idx)}
              className="flex items-start gap-2.5 p-3 bg-slate-950 rounded-xl border border-slate-800/80 cursor-pointer hover:border-slate-700 transition-colors"
            >
              <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center font-bold shrink-0 ${
                checkedItems[idx] ? 'bg-emerald-500 text-slate-950' : 'border border-slate-700 bg-slate-900'
              }`}>
                {checkedItems[idx] && <Check className="w-3 h-3" />}
              </div>
              <span className="text-slate-300">{item}</span>
            </label>
          ))}
        </div>

        <div className={`p-3.5 rounded-xl border text-xs space-y-1 ${
          allPassed
            ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
            : 'bg-amber-950/40 border-amber-800 text-amber-300'
        }`}>
          <p className="font-bold text-white flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            {allPassed ? '100% Deposit Refund Guaranteed!' : 'Partial Deduction Warning'}
          </p>
          <p className="text-[11px] text-slate-400">
            {allPassed
              ? `Full ₹${depositAmount.toLocaleString('en-IN')} will be transferred to your UPI VPA within 48 hours.`
              : 'Missing accessories or physical damage may incur minor deduction from deposit.'}
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl"
        >
          Got It, Close Checklist
        </button>
      </motion.div>
    </div>
  );
};
