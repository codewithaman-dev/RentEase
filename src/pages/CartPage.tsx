import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingBag, Trash2, ShieldCheck, ArrowRight, Calendar, Tag, Sparkles, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';

export const CartPage: React.FC = () => {
  const { items, removeFromCart, updateTenure, totalMonthlyPrice, totalDeposit } = useCart();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(() => {
    try {
      const saved = sessionStorage.getItem('rentease_applied_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleApplyCoupon = (e?: React.FormEvent, customCode?: string) => {
    if (e) e.preventDefault();
    const code = (customCode || couponInput).trim().toUpperCase();
    if (!code) return;

    if (code === 'RENTEASE500') {
      const coupon = { code, discount: 500 };
      setAppliedCoupon(coupon);
      sessionStorage.setItem('rentease_applied_coupon', JSON.stringify(coupon));
      showToast('₹500 voucher applied successfully!', 'success');
    } else if (code === 'STUDENT10') {
      const discount = Math.round(totalMonthlyPrice * 0.1);
      const coupon = { code, discount };
      setAppliedCoupon(coupon);
      sessionStorage.setItem('rentease_applied_coupon', JSON.stringify(coupon));
      showToast('10% Student Discount applied!', 'success');
    } else if (code === 'FIRSTRENT') {
      const coupon = { code, discount: 300 };
      setAppliedCoupon(coupon);
      sessionStorage.setItem('rentease_applied_coupon', JSON.stringify(coupon));
      showToast('₹300 First Rent discount applied!', 'success');
    } else {
      showToast('Invalid coupon code. Try RENTEASE500 or STUDENT10', 'error');
    }
    setCouponInput('');
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    sessionStorage.removeItem('rentease_applied_coupon');
    showToast('Coupon removed', 'info');
  };

  const finalMonthlyRent = Math.max(1, totalMonthlyPrice - (appliedCoupon?.discount || 0));

  const handleRemove = (productId: string, title: string) => {
    removeFromCart(productId);
    showToast(`Removed "${title}" from cart`, 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-slate-950 text-slate-100 min-h-screen">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
          <ShoppingBag className="w-8 h-8 text-emerald-400" />
          Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
        </h1>
        <p className="text-xs text-slate-400 mt-1">Review items, customize monthly tenure plans, and proceed to checkout</p>
      </div>

      {items.length === 0 ? (
        /* Empty Cart State */
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center space-y-6 max-w-xl mx-auto my-12 shadow-2xl"
        >
          <div className="w-20 h-20 bg-slate-800 text-slate-500 rounded-full flex items-center justify-center mx-auto border border-slate-700">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Your Rental Cart is Empty</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explore our certified beds, plush sofas, smart refrigerators, and WFH desks with free 48h delivery.
            </p>
          </div>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs rounded-xl shadow-lg"
          >
            Explore Catalog <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      ) : (
        /* Cart Grid */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Cart Line Items */}
          <div className="lg:col-span-8 space-y-4">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.product.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.2 }}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.product.image || (item.product.images ? item.product.images[0] : '')}
                        alt={item.product.title || item.product.name}
                        className="w-20 h-20 rounded-xl object-cover bg-slate-950 shrink-0"
                      />
                      <div>
                        <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                          {item.product.category_name || 'Furniture'}
                        </span>
                        <h3 className="font-bold text-white text-base">{item.product.title || item.product.name}</h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Refundable Security Deposit: <strong className="text-teal-400">₹{item.deposit.toLocaleString('en-IN')}</strong>
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemove(item.product.id, item.product.title || item.product.name || 'item')}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-xl transition-colors self-end sm:self-auto"
                      title="Remove item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Tenure Switcher & Item Rate */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-3 border-t border-slate-800 gap-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-emerald-400" />
                      <span className="text-slate-300 font-semibold">Select Tenure:</span>
                      <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                        {[3, 6, 12].map((m) => (
                          <button
                            key={m}
                            onClick={() => {
                              updateTenure(item.product.id, m as any);
                              showToast(`Updated tenure to ${m} months`, 'info');
                            }}
                            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                              item.tenureMonths === m
                                ? 'bg-emerald-500 text-slate-950 shadow-md'
                                : 'text-slate-400 hover:text-slate-200'
                            }`}
                          >
                            {m}m
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="text-right self-end sm:self-auto">
                      <span className="text-[10px] text-slate-400 block uppercase">Monthly Rent</span>
                      <span className="text-lg font-black text-emerald-400">₹{item.monthlyPrice.toLocaleString('en-IN')} / mo</span>
                    </div>
                  </div>

                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Right Column: Order Summary Card */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-6 h-fit shadow-2xl">
            <h3 className="font-bold text-white text-lg border-b border-slate-800 pb-3">Rental Cost Summary</h3>

            {/* Promo Voucher Box */}
            <div className="space-y-2 p-3.5 bg-slate-950 rounded-2xl border border-slate-800">
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-emerald-400" /> Have a Promo Code?
              </label>

              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-xl text-xs">
                  <span className="flex items-center gap-1.5 font-bold text-emerald-400">
                    <Check className="w-4 h-4 text-emerald-400" /> {appliedCoupon.code} applied (-₹{appliedCoupon.discount})
                  </span>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-slate-400 hover:text-red-400 p-1"
                    title="Remove coupon"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Enter RENTEASE500"
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 uppercase focus:outline-none focus:border-emerald-500 font-mono"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}

              {/* Quick Coupon Suggestions */}
              {!appliedCoupon && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <button
                    type="button"
                    onClick={() => handleApplyCoupon(undefined, 'RENTEASE500')}
                    className="text-[10px] bg-slate-900 border border-slate-800 hover:border-emerald-500 text-emerald-400 px-2 py-0.5 rounded-md font-mono transition-colors"
                  >
                    RENTEASE500 (-₹500)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyCoupon(undefined, 'STUDENT10')}
                    className="text-[10px] bg-slate-900 border border-slate-800 hover:border-emerald-500 text-emerald-400 px-2 py-0.5 rounded-md font-mono transition-colors"
                  >
                    STUDENT10 (10% OFF)
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Monthly Recurring Rent:</span>
                <span className={`text-base font-bold ${appliedCoupon ? 'line-through text-slate-500' : 'text-white'}`}>
                  ₹{totalMonthlyPrice.toLocaleString('en-IN')}
                </span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Voucher Discount:
                  </span>
                  <span>-₹{appliedCoupon.discount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-200 font-bold pt-2 border-t border-slate-800">
                <span>Net First Month Rent:</span>
                <span className="text-xl font-black text-emerald-400">
                  ₹{finalMonthlyRent.toLocaleString('en-IN')}<span className="text-xs text-slate-400 font-normal">/mo</span>
                </span>
              </div>

              <div className="flex justify-between text-slate-400">
                <span className="flex items-center gap-1">
                  Total Refundable Deposit:
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                </span>
                <span className="font-bold text-teal-400">₹{totalDeposit.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between text-emerald-400 font-semibold pt-2 border-t border-slate-800">
                <span>Doorstep Delivery & Assembly:</span>
                <span>FREE (₹0)</span>
              </div>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
              <p className="font-bold text-slate-200">Included with RentEase Agreement:</p>
              <p>• 100% Free City Relocation Support if you shift flats</p>
              <p>• Free On-Site Technician Repairs within 24 hours</p>
              <p>• Automated deposit refund via UPI upon tenure return</p>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-sm rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
            >
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
