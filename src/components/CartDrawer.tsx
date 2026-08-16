import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, ShieldCheck, ArrowRight, ShoppingBag, Calendar, Truck } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

export const CartDrawer: React.FC = () => {
  const { items, removeFromCart, updateTenure, isCartOpen, setIsCartOpen, totalMonthlyPrice, totalDeposit } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
      ></div>

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-slate-900 border-l border-slate-800 text-white flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-lg text-white">Your Rental Cart</h3>
              <span className="text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="p-5 overflow-y-auto space-y-4 flex-1">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto text-slate-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="text-slate-400 font-medium">Your rental bag is empty</div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    navigate('/catalog');
                  }}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.product.id}
                  className="bg-slate-800/80 border border-slate-700/80 rounded-xl p-4 space-y-3"
                >
                  <div className="flex gap-3">
                    <img
                      src={item.product.image}
                      alt={item.product.title}
                      className="w-16 h-16 rounded-lg object-cover bg-slate-950 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-sm text-white truncate">{item.product.title}</h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-slate-400 hover:text-red-400 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">{item.product.category_name}</div>
                    </div>
                  </div>

                  {/* Tenure Selector Pill */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-700/60 text-xs">
                    <span className="text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-emerald-400" /> Tenure:
                    </span>
                    <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-700">
                      {[3, 6, 12].map((m) => (
                        <button
                          key={m}
                          onClick={() => updateTenure(item.product.id, m as any)}
                          className={`px-2.5 py-0.5 rounded text-[11px] font-bold transition-colors ${
                            item.tenureMonths === m
                              ? 'bg-emerald-500 text-slate-950'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {m}m
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Itemized Price */}
                  <div className="flex justify-between text-xs pt-1">
                    <span className="text-slate-300">Monthly Rent:</span>
                    <span className="font-black text-white">₹{item.monthlyPrice.toLocaleString('en-IN')} / mo</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Totals & Checkout Button */}
          {items.length > 0 && (
            <div className="p-5 border-t border-slate-800 bg-slate-950/80 space-y-4">
              
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Total Monthly Rental Fee:</span>
                  <span className="text-lg font-black text-emerald-400">₹{totalMonthlyPrice.toLocaleString('en-IN')} / mo</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span className="flex items-center gap-1">
                    Refundable Security Deposit:
                    <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                  </span>
                  <span className="font-semibold text-slate-200">₹{totalDeposit.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-teal-400 font-medium bg-teal-500/10 p-2 rounded-lg border border-teal-500/20">
                  <Truck className="w-3.5 h-3.5" /> Free doorstep delivery & assembly in Metro cities
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('/checkout');
                }}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
