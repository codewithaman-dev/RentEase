import React from 'react';
import { CheckCircle2, Clock, X } from 'lucide-react';
import { motion } from 'framer-motion';

interface OrderTrackerModalProps {
  orderNumber: string;
  productTitle: string;
  deliveryDate: string;
  status: string;
  onClose: () => void;
}

export const OrderTrackerModal: React.FC<OrderTrackerModalProps> = ({
  orderNumber,
  productTitle,
  deliveryDate,
  status,
  onClose,
}) => {
  const STEPS = [
    { label: 'Order Confirmed', desc: 'UPI Autopay mandate approved' },
    { label: 'Grade A Deep Sanitized', desc: 'Inspected at Electronic City Hub' },
    { label: 'Dispatched in Logistics Van', desc: 'Loaded into delivery truck' },
    { label: 'Out for Delivery', desc: 'Technician team en route' },
    { label: 'Delivered & Assembled', desc: 'Installed at your apartment' },
  ];

  const currentStepIndex = status === 'Active' || status === 'ACTIVE' ? 4 : status === 'Delivering' ? 3 : 2;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg p-6 space-y-6 shadow-2xl relative text-slate-100"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-1">
          <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
            Live Order Tracking
          </span>
          <h3 className="text-xl font-bold text-white">{productTitle}</h3>
          <p className="text-xs text-slate-400">Order Ref: <span className="font-mono text-emerald-400 font-bold">{orderNumber}</span></p>
        </div>

        {/* Timeline Stepper */}
        <div className="space-y-4 pt-2">
          {STEPS.map((step, idx) => {
            const isCompleted = idx <= currentStepIndex;
            const isCurrent = idx === currentStepIndex;

            return (
              <div key={idx} className="flex items-start gap-3 relative text-xs">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0 z-10 ${
                  isCompleted ? 'bg-emerald-500 text-slate-950 shadow-md' : 'bg-slate-800 text-slate-500'
                }`}>
                  {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                </div>

                {idx < STEPS.length - 1 && (
                  <div className={`absolute left-4 top-8 w-0.5 h-6 -translate-x-1/2 ${
                    idx < currentStepIndex ? 'bg-emerald-500' : 'bg-slate-800'
                  }`}></div>
                )}

                <div className="pt-1">
                  <div className={`font-bold ${isCurrent ? 'text-emerald-400 text-sm' : isCompleted ? 'text-white' : 'text-slate-500'}`}>
                    {step.label}
                  </div>
                  <div className="text-[11px] text-slate-400">{step.desc}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-1">
          <p className="font-bold text-white flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-teal-400" /> Scheduled Delivery Slot:
          </p>
          <p className="text-slate-400 font-mono">{deliveryDate || 'March 25, 2025'} (10:00 AM - 02:00 PM)</p>
        </div>
      </motion.div>
    </div>
  );
};
