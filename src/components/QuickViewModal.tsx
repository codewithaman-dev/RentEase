import React, { useState } from 'react';
import { X, Star, ShoppingBag, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useToast } from '../contexts/ToastContext';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const [selectedTenure, setSelectedTenure] = useState<3 | 6 | 12>(6);
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  if (!product) return null;

  const isWishlisted = isInWishlist(product.id);

  const getMonthlyRate = (m: 3 | 6 | 12) => {
    if (m === 3) return product.monthly_rate_3m || (product.monthly_rent ? Math.round(product.monthly_rent * 1.3) : 899);
    if (m === 6) return product.monthly_rate_6m || (product.monthly_rent ? Math.round(product.monthly_rent * 1.15) : 749);
    return product.monthly_rate_12m || product.monthly_rent || 549;
  };

  const currentRate = getMonthlyRate(selectedTenure);

  const handleAddToCart = () => {
    addToCart(product, selectedTenure);
    showToast(`Added "${product.title || product.name}" (${selectedTenure}m tenure) to cart!`, 'success');
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl text-slate-100 relative"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-slate-950/80 hover:bg-slate-800 text-slate-400 hover:text-white rounded-full z-10 border border-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-12">
            {/* Image Column */}
            <div className="md:col-span-5 relative bg-slate-950">
              <img
                src={product.image || (product.images ? product.images[0] : '')}
                alt={product.title || product.name}
                className="w-full h-full min-h-[300px] object-cover"
              />
              <button
                onClick={() => {
                  toggleWishlist(product);
                  showToast(
                    isWishlisted ? 'Removed from Wishlist' : 'Saved to Wishlist',
                    'info'
                  );
                }}
                className={`absolute top-4 left-4 p-2.5 rounded-full border shadow-lg transition-colors ${
                  isWishlisted
                    ? 'bg-rose-500 text-white border-rose-400'
                    : 'bg-slate-900/90 text-slate-300 border-slate-700 hover:text-rose-400'
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-white' : ''}`} />
              </button>
            </div>

            {/* Details Column */}
            <div className="md:col-span-7 p-6 space-y-4">
              <div>
                <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                  {product.category_name || 'Furniture'}
                </span>
                <h3 className="text-xl font-black text-white">{product.title || product.name}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{product.description}</p>
              </div>

              {/* Rating & Stock */}
              <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
                <div className="flex items-center gap-1 text-amber-300 font-bold">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{product.rating || 4.8}</span>
                  <span className="text-slate-400 font-normal">({product.reviews_count || 18} reviews)</span>
                </div>
                <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  {product.available_stock || product.stock || 10} Units Ready
                </span>
              </div>

              {/* Tenure Selection */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300">Select Rental Tenure:</label>
                <div className="grid grid-cols-3 gap-2">
                  {([3, 6, 12] as const).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setSelectedTenure(m)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        selectedTenure === m
                          ? 'bg-emerald-950/40 border-emerald-500 text-white font-bold'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-[10px] uppercase font-bold">{m} Months</div>
                      <div className="text-sm font-black text-emerald-400">₹{getMonthlyRate(m)}/mo</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Financials Breakdown */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between text-slate-300">
                  <span>Monthly Rental Fee:</span>
                  <span className="font-bold text-white">₹{currentRate} / month</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Refundable Deposit:</span>
                  <span className="font-bold text-teal-400">₹{product.deposit_amount || product.security_deposit || 1000}</span>
                </div>
              </div>

              {/* CTA Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 py-3 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-4 h-4" /> Add to Cart
                </button>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
