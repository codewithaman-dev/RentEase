import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sofa, 
  Shield, 
  Truck, 
  RefreshCw, 
  Wrench, 
  Mail, 
  CheckCircle2, 
  Phone, 
  Send
} from 'lucide-react';
import { useToast } from '../contexts/ToastContext';

export const Footer: React.FC = () => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const { showToast } = useToast();

  const handleNavClick = () => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    } catch {
      window.scrollTo(0, 0);
    }
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Please enter a valid email address', 'error');
      return;
    }
    showToast('Subscribed! Check your inbox for ₹500 discount code', 'success');
    setNewsletterEmail('');
  };

  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800/80 pt-16 pb-12 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Value Proposition Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pb-12 border-b border-slate-800/80">
          <div className="flex items-start gap-3 bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80">
            <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Free 48h Delivery & Setup</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">Delivered and assembled at your apartment across top Indian metros.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 bg-slate-900/60 p-5 rounded-2xl border border-slate-800/80">
            <div className="p-2.5 bg-teal-500/10 text-teal-400 rounded-xl shrink-0">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Free City Relocation</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">Shifting flats in Bengaluru, Mumbai, or NCR? We move your items for ₹0.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
            <div className="p-2.5 bg-cyan-500/10 text-cyan-400 rounded-xl shrink-0">
              <Wrench className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">100% Free Maintenance</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">On-site technician repair or instant replacement within 24 hours.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
            <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Zero Security Deposit</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">Flexi 3-12m tenure plans with zero deposit on Aadhaar / Work ID check.</p>
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Brand Column (3 Cols) */}
          <div className="md:col-span-12 lg:col-span-3 space-y-4">
            <Link to="/" onClick={handleNavClick} className="flex items-center gap-2 font-bold text-xl text-white group">
              <div className="p-2.5 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl group-hover:scale-105 transition-transform shadow-lg">
                <Sofa className="w-6 h-6 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">
                  RentEase India
                </span>
                <span className="text-xs text-emerald-400 font-semibold tracking-normal -mt-0.5">
                  Flexi-Rental Marketplace
                </span>
              </div>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              India's trusted furniture & appliance rental marketplace for students, software engineers, and relocating professionals across Bengaluru, Mumbai, Delhi NCR, Pune, Hyderabad, and Chennai.
            </p>

            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl w-fit">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>25,000+ Verified Happy Renters in India</span>
            </div>

            <div className="pt-2 text-xs text-slate-400 space-y-1.5">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-teal-400" />
                <span>+91 80 4123 9900 / +91 98765 43210</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>support@rentease.in</span>
              </p>
            </div>
          </div>

          {/* Categories Column (2 Cols) */}
          <div className="md:col-span-4 lg:col-span-2 space-y-3">
            <h4 className="font-bold text-white text-sm border-b border-slate-800 pb-2">
              Popular Categories
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/catalog?category=living-room" onClick={handleNavClick} className="hover:text-emerald-400 transition-colors">
                  Living Room Sofas
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=bedroom" onClick={handleNavClick} className="hover:text-emerald-400 transition-colors">
                  Bedroom Sets
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=appliances" onClick={handleNavClick} className="hover:text-emerald-400 transition-colors">
                  Home Appliances
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=study-wfh" onClick={handleNavClick} className="hover:text-emerald-400 transition-colors">
                  Work From Home
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=dining" onClick={handleNavClick} className="hover:text-emerald-400 transition-colors">
                  Dining Tables
                </Link>
              </li>
              <li>
                <Link to="/catalog?category=student-combos" onClick={handleNavClick} className="hover:text-emerald-400 transition-colors">
                  1BHK Student Combos
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links Column (2 Cols) */}
          <div className="md:col-span-4 lg:col-span-2 space-y-3">
            <h4 className="font-bold text-white text-sm border-b border-slate-800 pb-2">
              Platform Links
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/catalog" onClick={handleNavClick} className="hover:text-emerald-400 transition-colors">
                  Explore Catalog
                </Link>
              </li>
              <li>
                <Link to="/cart" onClick={handleNavClick} className="hover:text-emerald-400 transition-colors">
                  Rental Cart
                </Link>
              </li>
              <li>
                <Link to="/dashboard" onClick={handleNavClick} className="hover:text-emerald-400 transition-colors">
                  Renter Dashboard
                </Link>
              </li>
              <li>
                <Link to="/about" onClick={handleNavClick} className="hover:text-emerald-400 transition-colors">
                  About RentEase
                </Link>
              </li>
              <li>
                <Link to="/contact" onClick={handleNavClick} className="hover:text-emerald-400 transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Cities We Serve Column (2 Cols) */}
          <div className="md:col-span-4 lg:col-span-2 space-y-3">
            <h4 className="font-bold text-white text-sm border-b border-slate-800 pb-2">
              Cities We Serve
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {['Bengaluru', 'Mumbai', 'Delhi NCR', 'Pune', 'Hyderabad', 'Chennai'].map((city) => (
                <li key={city}>
                  <Link to={`/catalog?city=${encodeURIComponent(city)}`} onClick={handleNavClick} className="hover:text-emerald-400 cursor-pointer transition-colors block">
                    {city}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Box (3 Cols - ample width for emails) */}
          <div className="md:col-span-12 lg:col-span-3 space-y-3">
            <h4 className="font-bold text-white text-sm border-b border-slate-800 pb-2">
              Newsletter Discounts
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Subscribe to get ₹500 off voucher on your first monthly rental.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-2">
              <input
                type="email"
                id="newsletter-email"
                name="newsletter-email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter email address"
                aria-label="Email address for newsletter"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <button
                type="submit"
                className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" /> Subscribe
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Payment Badges */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} RentEase India Technologies Pvt. Ltd. All rights reserved.</p>

          <div className="flex items-center gap-3 text-xs font-semibold text-slate-400">
            <span className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">UPI Autopay</span>
            <span className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">GPay</span>
            <span className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">PhonePe</span>
            <span className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">Paytm</span>
            <span className="bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">Cards / NetBanking</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" onClick={handleNavClick} className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/rental-terms" onClick={handleNavClick} className="hover:text-slate-300 transition-colors">
              Rental Agreement Terms
            </Link>
            <Link to="/maintenance-sla" onClick={handleNavClick} className="hover:text-slate-300 transition-colors">
              Free Maintenance SLA
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
