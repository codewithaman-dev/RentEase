import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Sofa, Eye, EyeOff, AlertCircle, ArrowLeft, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { signInWithGoogle } from '../lib/googleAuth';
import { useToast } from '../contexts/ToastContext';

export const LoginPage: React.FC = () => {
  const { loginWithCredentials } = useAuth();
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSubmitting(true);

    const res = await loginWithCredentials(email, password);
    setSubmitting(false);

    if (res.success) {
      showToast('Logged in successfully!', 'success');
      
      // Get role from localStorage saved session
      const savedRole = localStorage.getItem('rentease_role') || 'customer';
      
      if (callbackUrl) {
        navigate(callbackUrl);
      } else if (savedRole === 'admin') {
        navigate('/admin');
      } else if (savedRole === 'vendor') {
        navigate('/vendor');
      } else {
        navigate('/dashboard');
      }
    } else {
      setErrorMessage(res.error || 'Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8">
      
      {/* Top Back Home Link */}
      <div className="max-w-md mx-auto w-full mb-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-emerald-400 transition-colors uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" /> Home
        </Link>
      </div>

      <div className="max-w-md mx-auto w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6 shadow-2xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl w-fit mx-auto shadow-md">
            <Sofa className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white">Welcome back</h2>
          <p className="text-xs text-slate-400">Sign in to your account to manage your rentals or store.</p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="bg-red-950/80 border border-red-800 p-3.5 rounded-2xl text-xs text-red-200 flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* 1-Click Demo Persona Selector */}
        <div className="bg-slate-950/80 border border-slate-800 p-3.5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Instant Demo Roles
            </span>
            <span className="text-xs text-emerald-400 font-semibold">1-Click Auto-Fill</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                setEmail('customer@rentease.in');
                setPassword('Customer@123');
                showToast('Filled Renter demo credentials', 'info');
              }}
              className="p-2.5 bg-slate-900 hover:bg-emerald-500/10 border border-slate-800 hover:border-emerald-500/40 rounded-xl text-center transition-all group cursor-pointer"
            >
              <span className="block font-bold text-white group-hover:text-emerald-400 text-xs">Renter</span>
              <span className="block text-xs text-slate-400 mt-0.5">Rahul S.</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('vendor@rentease.in');
                setPassword('Vendor@123');
                showToast('Filled Vendor demo credentials', 'info');
              }}
              className="p-2.5 bg-slate-900 hover:bg-amber-500/10 border border-slate-800 hover:border-amber-500/40 rounded-xl text-center transition-all group cursor-pointer"
            >
              <span className="block font-bold text-white group-hover:text-amber-400 text-xs">Vendor</span>
              <span className="block text-xs text-slate-400 mt-0.5">Logistics</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('admin@rentease.in');
                setPassword('Admin@123');
                showToast('Filled Admin demo credentials', 'info');
              }}
              className="p-2.5 bg-slate-900 hover:bg-purple-500/10 border border-slate-800 hover:border-purple-500/40 rounded-xl text-center transition-all group cursor-pointer"
            >
              <span className="block font-bold text-white group-hover:text-purple-400 text-xs">Admin HQ</span>
              <span className="block text-xs text-slate-400 mt-0.5">Platform</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-wider">EMAIL *</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1 uppercase tracking-wider">PASSWORD *</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
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

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs rounded-xl transition-all shadow-xl"
          >
            {submitting ? 'Signing in...' : 'Sign in'}
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
          Continue with Google
        </button>

        <div className="text-center text-xs text-slate-400 pt-2">
          Don't have an account?{' '}
          <Link to="/register" className="text-emerald-400 font-bold hover:underline">
            Register
          </Link>
        </div>

      </div>

    </div>
  );
};
