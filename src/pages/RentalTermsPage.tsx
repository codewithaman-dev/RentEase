import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Truck, RefreshCw, ArrowLeft, CheckCircle2, DollarSign } from 'lucide-react';

export const RentalTermsPage: React.FC = () => {
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
          Indian Rental Contract Standards
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Rental Agreement Terms</h1>
        <p className="text-xs text-slate-400">
          Standard Operating Terms & Conditions | RentEase India Technologies Pvt. Ltd.
        </p>
      </div>

      <div className="space-y-8 text-xs text-slate-300 leading-relaxed">
        
        {/* Term 1 */}
        <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 text-emerald-400" /> 1. Rental Tenure & Flexi Plans
          </h2>
          <p>
            RentEase offers flexible subscription tenures of <strong>3, 6, 9, or 12+ months</strong> across all furniture and home appliance products in Indian metro cities.
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-slate-400 pl-2">
            <li><strong>Tenure Rate Commitment:</strong> Longer tenure plans lock in lower monthly rental rates (e.g., ₹549/mo for 12m vs ₹849/mo for 3m).</li>
            <li><strong>Tenure Extensions:</strong> You can extend your tenure anytime from your Renter Dashboard to unlock lower monthly rates.</li>
            <li><strong>Early Termination:</strong> If you cancel prior to completing your chosen tenure, early termination fee equals the difference between your selected tenure rate and actual months used.</li>
          </ul>
        </section>

        {/* Term 2 */}
        <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-teal-400" /> 2. Security Deposit Escrow & Refund SLA
          </h2>
          <p>
            Refundable security deposits are held in a segregated escrow account and managed with complete financial transparency:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-slate-400 pl-2">
            <li><strong>Zero Deposit Qualification:</strong> Users who verify their Aadhaar Card, Student College ID, or Corporate Work ID qualify for Zero Security Deposit.</li>
            <li><strong>48-Hour Deposit Refund SLA:</strong> Upon completion of tenure and item pickup inspection, 100% of refundable deposit is transferred back to your UPI account / Bank VPA within 48 hours.</li>
            <li><strong>Wear & Tear Exclusion:</strong> Minor cosmetic scuffs or age-related fabric color fading count as normal wear & tear and are 100% exempt from deposit deductions.</li>
          </ul>
        </section>

        {/* Term 3 */}
        <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-cyan-400" /> 3. 100% Free City Relocation Terms
          </h2>
          <p>
            If you shift flats or apartments within Bengaluru, Mumbai, Delhi NCR, Pune, Hyderabad, or Chennai during your active tenure:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-slate-400 pl-2">
            <li><strong>₹0 Moving Cost:</strong> RentEase uninstalls, transports, and reinstalls all rented items at your new apartment for zero extra fee.</li>
            <li><strong>Advance Notice Requirement:</strong> Relocation requests must be submitted at least 7 days in advance via your Renter Dashboard.</li>
            <li><strong>Service Pincodes:</strong> New delivery location must fall within active RentEase city service pincodes.</li>
          </ul>
        </section>

        {/* Term 4 */}
        <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Truck className="w-4 h-4 text-amber-400" /> 4. Doorstep Delivery & Assembly
          </h2>
          <ul className="list-disc list-inside space-y-1.5 text-slate-400 pl-2">
            <li>Delivery and expert assembly are scheduled within 48 hours of order placement.</li>
            <li>The renter or an authorized representative (18+ years) must be present at the address during the selected time slot.</li>
            <li>Renters must ensure adequate doorway and elevator/staircase clearance for furniture lifting.</li>
          </ul>
        </section>

        {/* Term 5 */}
        <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 5. Monthly UPI Autopay & Billing
          </h2>
          <p>
            Monthly rent is debited automatically on the 25th of each month via authorized UPI Mandates (GPay / PhonePe / Paytm) or Credit Cards. A 5-day grace period is provided prior to any late fee application.
          </p>
        </section>

      </div>

    </div>
  );
};
