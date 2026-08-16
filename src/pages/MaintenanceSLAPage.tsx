import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Clock, ShieldCheck, CheckCircle2, ArrowLeft, AlertCircle } from 'lucide-react';

export const MaintenanceSLAPage: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 bg-slate-950 text-slate-100 min-h-screen">
      
      {/* Top Back Link */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-emerald-400 transition-colors uppercase tracking-wider"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Home
      </Link>

      {/* Header */}
      <div className="border-b border-slate-800 pb-8 space-y-3">
        <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
          24-Hour On-Site Service SLA
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Free On-Site Maintenance SLA</h1>
        <p className="text-xs text-slate-400">
          Service Level Agreement (SLA) & Repair Guarantees | RentEase India
        </p>
      </div>

      <div className="space-y-8 text-xs text-slate-300 leading-relaxed">
        
        {/* SLA Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
            <Clock className="w-6 h-6 text-emerald-400 mb-1" />
            <h4 className="font-bold text-white text-sm">Response Time SLA</h4>
            <p className="text-slate-400 text-[11px]">Technician visit dispatched within &lt; 24 hours of ticket report.</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
            <Wrench className="w-6 h-6 text-teal-400 mb-1" />
            <h4 className="font-bold text-white text-sm">100% Free Repair</h4>
            <p className="text-slate-400 text-[11px]">Zero charges for labor, spare parts, or motor maintenance.</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-1">
            <ShieldCheck className="w-6 h-6 text-cyan-400 mb-1" />
            <h4 className="font-bold text-white text-sm">Product Replacement</h4>
            <p className="text-slate-400 text-[11px]">Free product swap if repair time exceeds 48 hours.</p>
          </div>
        </div>

        {/* SLA Detail 1 */}
        <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 1. Covered Maintenance Scope
          </h2>
          <p>
            RentEase provides 100% free comprehensive maintenance coverage across all rented furniture and appliances during your active subscription:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-slate-400 pl-2">
            <li><strong>Home Appliances:</strong> Refrigerator cooling compressor issues, washing machine drum noise, motor capacitor replacements, microwave convection heating, AC gas top-up & filter cleaning.</li>
            <li><strong>Furniture Items:</strong> Loose wooden joints, upholstery cushion foam adjustments, drawer alignment, bed frame bolt tightening, and standing desk motorized lift recalibration.</li>
          </ul>
        </section>

        {/* SLA Detail 2 */}
        <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-teal-400" /> 2. Service Dispatch Timeline & Hours
          </h2>
          <ul className="list-disc list-inside space-y-1.5 text-slate-400 pl-2">
            <li><strong>Ticket Raising:</strong> Raise a 1-click ticket anytime 24/7 from your Renter Dashboard.</li>
            <li><strong>Technician Visit Window:</strong> Mon - Sun (09:00 AM - 08:00 PM) across Bengaluru, Mumbai, Delhi NCR, Pune, Hyderabad, and Chennai.</li>
            <li><strong>Urgent SLA:</strong> Major appliance breakdowns (fridge cooling loss) prioritized for same-day technician visit.</li>
          </ul>
        </section>

        {/* SLA Detail 3 */}
        <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400" /> 3. Exclusions & Renter Responsibilities
          </h2>
          <p>
            To maintain SLA eligibility, renters must adhere to basic care guidelines:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-slate-400 pl-2">
            <li>Connecting appliances to grounded 220V electrical sockets with voltage stabilizers where required.</li>
            <li>Avoiding unapproved third-party local repairs or tampering.</li>
            <li>Preventing intentional physical damage or liquid spills inside electrical circuits.</li>
          </ul>
        </section>

      </div>

    </div>
  );
};
