import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sofa, CheckCircle2, User, Truck, Eye, EyeOff, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { signInWithGoogle } from '../lib/googleAuth';
import { useToast } from '../contexts/ToastContext';

export const RegisterPage: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<'CUSTOMER' | 'VENDOR'>('CUSTOMER');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [pincode, setPincode] = useState('560103');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(true);

  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { registerAccount } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (password.length < 8) {
      setErrorMessage('Password must be at least 8 characters long');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (!termsAccepted) {
      setErrorMessage('Please accept the terms and privacy policy to continue');
      return;
    }

    setSubmitting(true);

    const res = await registerAccount({
      name: fullName,
      email,
      phone,
      password,
      role: selectedRole,
      city,
      pincode,
    } as any);

    setSubmitting(false);

    if (res.success) {
      showToast(
        selectedRole === 'VENDOR'
          ? 'Vendor account created! Redirecting to Vendor Hub...'
          : 'Customer account created! Redirecting to Dashboard...',
        'success'
      );
      if (selectedRole === 'VENDOR') {
        navigate('/vendor');
      } else {
        navigate('/dashboard');
      }
    } else {
      setErrorMessage(res.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      
      {/* Top Back Home Link */}
      <div className="max-w-5xl mx-auto w-full mb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-emerald-400 transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>
      </div>

      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form Box */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
          
          {/* Header */}
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
                <Sofa className="w-5 h-5 text-white" />
              </div>
              <span className="font-black text-white text-lg tracking-tight">RentEase India</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">Join RentEase India</h1>
            <p className="text-xs text-slate-400">Tell us who you are first — the registration form adapts to your answer.</p>
          </div>

          {/* Role Selection Cards */}
          <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-950 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => setSelectedRole('CUSTOMER')}
              className={`p-4 rounded-xl text-left transition-all border flex flex-col justify-between ${
                selectedRole === 'CUSTOMER'
                  ? 'bg-gradient-to-br from-emerald-600 to-teal-700 border-emerald-500 text-white shadow-lg'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4" />
                <span className="font-bold text-sm">Customer / Renter</span>
              </div>
              <span className="text-[11px] opacity-80">Rent furniture & appliances / flexi plans</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('VENDOR')}
              className={`p-4 rounded-xl text-left transition-all border flex flex-col justify-between ${
                selectedRole === 'VENDOR'
                  ? 'bg-gradient-to-br from-amber-600 to-orange-700 border-amber-500 text-white shadow-lg'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <Truck className="w-4 h-4" />
                <span className="font-bold text-sm">Vendor / Partner</span>
              </div>
              <span className="text-[11px] opacity-80">List warehouse inventory & supply</span>
            </button>
          </div>

          {/* Error Message Alert */}
          {errorMessage && (
            <div className="bg-red-950/80 border border-red-800 p-3.5 rounded-2xl text-xs text-red-200 flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleRegister} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">FULL NAME *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={selectedRole === 'VENDOR' ? 'e.g. Ramesh Chauhan (Logistics Hub)' : 'e.g. Anjali Verma'}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">EMAIL ADDRESS *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">PHONE</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">CITY</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Bengaluru"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">PINCODE</label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="560103"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">PASSWORD * (8+ chars)</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white pr-10 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">CONFIRM PASSWORD *</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white pr-10 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            <label className="flex items-center gap-2 text-xs text-slate-400 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
              <span>I accept the RentEase terms of service and privacy policy.</span>
            </label>

            <button
              type="submit"
              disabled={submitting}
              className={`w-full py-3.5 font-black text-xs rounded-xl shadow-xl transition-all ${
                selectedRole === 'VENDOR'
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950'
              }`}
            >
              {submitting
                ? 'Creating Account...'
                : selectedRole === 'VENDOR'
                ? 'Create Vendor Account & Start Onboarding'
                : 'Create Customer Account'}
            </button>
          </form>

          <div className="relative text-center text-xs text-slate-500 pt-1">
            <span className="bg-slate-900 px-3 relative z-10 uppercase tracking-widest font-bold text-[10px]">or</span>
            <div className="absolute inset-0 top-1/2 border-t border-slate-800"></div>
          </div>

          <button
            type="button"
            onClick={() => signInWithGoogle('RentEase India Platform')}
            className="w-full py-3 bg-slate-950 hover:bg-slate-800 text-slate-200 border border-slate-800 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            Sign up with Google
          </button>

          <div className="text-center text-xs text-slate-400 pt-2">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-400 font-bold hover:underline">
              Sign in
            </Link>
          </div>

        </div>

        {/* Right Info Panel */}
        <div className="lg:col-span-4 bg-slate-900/80 border border-slate-800/80 rounded-3xl p-6 sm:p-8 space-y-4">
          <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">
            {selectedRole === 'VENDOR' ? 'FOR VENDOR PARTNERS' : 'FOR CUSTOMERS'}
          </span>
          <h3 className="text-xl font-bold text-white">
            {selectedRole === 'VENDOR' ? 'Your Inventory, Your Storefront' : 'Real Furniture Comfort, Honest Monthly Rates'}
          </h3>

          <ul className="space-y-3 text-xs text-slate-300">
            {selectedRole === 'VENDOR' ? (
              <>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Zero listing commission for verified warehouse partners</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Real-time supply tracking and order fulfillment dashboard</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Direct monthly payouts for active rental subscriptions</span>
                </li>
              </>
            ) : (
              <>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Verified Grade A furniture delivered within 48 hours</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>100% Free city relocation support if you shift flats</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Free technician repair SLA &lt; 24h</span>
                </li>
              </>
            )}
          </ul>
        </div>

      </div>

    </div>
  );
};
