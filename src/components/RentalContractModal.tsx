import React from 'react';
import { Printer, CheckCircle2, Sofa, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { Rental } from '../types';

interface RentalContractModalProps {
  rental: Rental;
  onClose: () => void;
}

export const RentalContractModal: React.FC<RentalContractModalProps> = ({ rental, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl p-6 sm:p-8 space-y-6 shadow-2xl relative text-slate-100 max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Printable Receipt Contract */}
        <div className="space-y-6 text-xs text-slate-300">
          
          <div className="flex justify-between items-start border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl">
                <Sofa className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">RentEase India</h2>
                <p className="text-[10px] text-emerald-400 font-bold uppercase">Official Digital Rental Agreement</p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-slate-400">Contract Ref #:</div>
              <div className="font-mono font-bold text-emerald-400 text-sm">{rental.order_number}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
            <div>
              <span className="text-slate-500 uppercase font-semibold text-[10px] block">Lessor (Company):</span>
              <p className="font-bold text-white">RentEase India Technologies Pvt. Ltd.</p>
              <p className="text-slate-400">GSTIN: 29ABCDE1234F1Z5</p>
              <p className="text-slate-400">Embassy TechVillage, Bengaluru</p>
            </div>

            <div>
              <span className="text-slate-500 uppercase font-semibold text-[10px] block">Lessee (Renter):</span>
              <p className="font-bold text-white">{rental.user_name}</p>
              <p className="text-slate-400">{rental.user_email}</p>
              <p className="text-slate-400">{rental.delivery_address}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-bold text-white text-sm">Rented Product Specifications:</h4>
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex justify-between font-bold text-white">
                <span>{rental.product_title}</span>
                <span className="text-emerald-400">₹{Number(rental.monthly_price).toLocaleString('en-IN')} / month</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Agreed Tenure Duration:</span>
                <span>{rental.tenure_months} Months</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Refundable Security Deposit:</span>
                <span className="text-teal-400 font-bold">₹{Number(rental.security_deposit).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Start Date / Next Billing:</span>
                <span>{rental.start_date || 'Feb 01, 2025'} / {rental.next_billing_date || 'Mar 25, 2025'}</span>
              </div>
            </div>
          </div>

          <div className="bg-emerald-950/30 border border-emerald-800/40 p-3 rounded-2xl text-[11px] text-emerald-300 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>Includes 100% Free City Relocation Support & 24h Technician Repair SLA.</span>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2 print:hidden">
          <button
            onClick={handlePrint}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" /> Print / Save Contract PDF
          </button>
        </div>

      </motion.div>
    </div>
  );
};
