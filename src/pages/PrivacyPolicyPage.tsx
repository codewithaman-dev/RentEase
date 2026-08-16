import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Eye, FileText, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
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
          DPDP Act 2023 Compliant
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Privacy Policy</h1>
        <p className="text-xs text-slate-400">
          Effective Date: January 1, 2025 | RentEase India Technologies Pvt. Ltd.
        </p>
      </div>

      <div className="space-y-8 text-xs text-slate-300 leading-relaxed">
        
        {/* Section 1 */}
        <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" /> 1. Information We Collect
          </h2>
          <p>
            RentEase India Technologies Pvt. Ltd. ("RentEase", "We", "Us") collects personal information to provide seamless furniture and appliance rental services, identity verification, doorstep delivery, and automated monthly billing.
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-slate-400 pl-2">
            <li><strong>Personal Identity Data:</strong> Full Name, Email Address, Phone Number (+91), Delivery Address, PIN Code.</li>
            <li><strong>KYC Identity Verification:</strong> Digital copies of Aadhaar Card, Driving License, Student College ID, or Corporate Employee ID uploaded during checkout for zero-deposit qualification.</li>
            <li><strong>Payment & Billing Data:</strong> Masked UPI VPA handles (e.g. rahul@okaxis) and recurring E-Mandate tokens processed securely via PCI-DSS compliant RBI-authorized gateways.</li>
            <li><strong>Technical Device Data:</strong> IP Address, browser type, device identifiers, and location pincodes.</li>
          </ul>
        </section>

        {/* Section 2 */}
        <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Eye className="w-4 h-4 text-teal-400" /> 2. How We Use Your Data
          </h2>
          <p>
            Your information is processed strictly for authentic operational purposes in full compliance with the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act, India)</strong>:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-slate-400 pl-2">
            <li>Processing rental agreements and scheduling 48-hour doorstep delivery and assembly.</li>
            <li>Executing automated monthly UPI Mandate debits on your selected billing date.</li>
            <li>Scheduling free city relocation services when you shift apartments.</li>
            <li>Dispatching certified technicians for free on-site maintenance tickets.</li>
            <li>Preventing fraudulent orders and performing identity risk checks.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-cyan-400" /> 3. Data Protection & Security Standards
          </h2>
          <p>
            We implement bank-grade encryption protocols to safeguard your personal data against unauthorized access, loss, or disclosure:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-slate-400 pl-2">
            <li><strong>Encryption in Transit:</strong> 256-bit SSL/TLS encryption across all website and API communications.</li>
            <li><strong>Encryption at Rest:</strong> Database records encrypted using AES-256 in Supabase PostgreSQL infrastructure.</li>
            <li><strong>Zero Password Storage:</strong> Passwords are cryptographically salted and hashed using PBKDF2 with SHA-512. Plaintext passwords are never stored.</li>
            <li><strong>No Data Monetization:</strong> We do NOT sell, rent, or trade your personal information to third-party advertisers.</li>
          </ul>
        </section>

        {/* Section 4 */}
        <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-amber-400" /> 4. Data Sharing & Third Parties
          </h2>
          <p>
            We share relevant customer data only with trusted operational partners required to complete your services:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-slate-400 pl-2">
            <li><strong>Logistics & Assembly Partners:</strong> Sharing delivery address and phone number for doorstep furniture setup.</li>
            <li><strong>Certified Technicians:</strong> Sharing maintenance location for repair SLA visits.</li>
            <li><strong>Payment Aggregators:</strong> RBI-licensed UPI Mandate gateways (Razorpay / Cashfree / NPCI).</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 5. Your Rights & Grievance Officer
          </h2>
          <p>
            Under Indian DPDP regulations, you have the right to access, correct, or request deletion of your personal data upon completion of active rental subscription agreements.
          </p>
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1 text-slate-400">
            <p className="font-bold text-white">Grievance Redressal Officer:</p>
            <p>Mr. Vikram Desai (Head of Data Protection & Compliance)</p>
            <p>RentEase India Technologies Pvt. Ltd., Embassy TechVillage, Bellandur, Bengaluru - 560103</p>
            <p>Email: <span className="text-emerald-400 font-mono">privacy@rentease.in</span> | Phone: +91 80 4123 9900</p>
          </div>
        </section>

      </div>

    </div>
  );
};
