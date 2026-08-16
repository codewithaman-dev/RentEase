import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, ShieldCheck, Wrench, ArrowRight, Sparkles, Heart, Eye } from 'lucide-react';
import { Product } from '../types';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useToast } from '../contexts/ToastContext';
import { QuickViewModal } from './QuickViewModal';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const isWishlisted = isInWishlist(product.id);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    showToast(
      isWishlisted ? `Removed "${product.title || product.name}" from Wishlist` : `Saved "${product.title || product.name}" to Wishlist`,
      'info'
    );
  };

  const startingRate = product.monthly_rate_12m || product.monthly_rent || 449;

  return (
    <>
      <div className="group bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-950/20 transition-all duration-300 flex flex-col justify-between relative">
        
        <div>
          {/* Product Image Header */}
          <div className="relative aspect-4/3 overflow-hidden bg-slate-950">
            <img
              src={product.image || (product.images ? product.images[0] : '')}
              alt={product.title || product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>

            {/* Wishlist Heart Button */}
            <button
              onClick={handleToggleWishlist}
              className={`absolute top-3 right-3 p-2 rounded-full border shadow-md transition-all z-10 ${
                isWishlisted
                  ? 'bg-rose-500 text-white border-rose-400'
                  : 'bg-slate-900/80 backdrop-blur-md text-slate-300 border-slate-700 hover:text-rose-400'
              }`}
              title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
            </button>

            {/* Quick View Button */}
            <button
              onClick={(e) => {
                e.preventDefault();
                setQuickViewProduct(product);
              }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-md hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 z-10"
            >
              <Eye className="w-3.5 h-3.5 text-emerald-400" /> Quick View
            </button>

            {/* Condition Tag */}
            <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
              <span className="bg-slate-900/90 backdrop-blur-md text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md">
                {product.condition || 'Brand New'}
              </span>
              {product.is_combo && (
                <span className="bg-amber-500 text-slate-950 font-black text-[10px] px-2 py-1 rounded-full shadow-md flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Combo
                </span>
              )}
            </div>

            {/* Rating Pill */}
            <div className="absolute bottom-2 right-3 bg-slate-900/90 backdrop-blur-md text-amber-300 text-[11px] font-bold px-2 py-0.5 rounded-full border border-slate-700 flex items-center gap-1 shadow-md">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating || 4.8}</span>
              <span className="text-[9px] text-slate-400 font-normal">({product.reviews_count || 12})</span>
            </div>
          </div>

          {/* Details Content */}
          <div className="p-5 space-y-3">
            <div className="text-xs text-slate-400 font-semibold tracking-wider uppercase">
              {product.category_name || 'Furniture'}
            </div>

            <Link to={`/product/${product.id}`} className="block">
              <h3 className="font-bold text-white text-base group-hover:text-emerald-400 transition-colors line-clamp-1">
                {product.title || product.name}
              </h3>
            </Link>

            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>

        {/* Footer Pricing & CTA */}
        <div className="p-5 pt-0 mt-auto border-t border-slate-800/80 pt-4">
          <div className="flex items-end justify-between mb-3">
            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-medium">Rent starting from</span>
              <div className="text-xl font-black text-white flex items-baseline gap-1">
                ₹{Number(startingRate).toLocaleString('en-IN')}
                <span className="text-xs font-normal text-slate-400">/mo</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block">Retail Value</span>
              <span className="text-xs text-slate-500 line-through">₹{Number(product.retail_price || 15000).toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              to={`/product/${product.id}`}
              className="w-full text-center py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
            >
              View Details
            </Link>
            <button
              onClick={() => {
                addToCart(product, 6);
                showToast(`Added "${product.title || product.name}" to cart!`, 'success');
              }}
              className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1"
            >
              Quick Rent <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </>
  );
};
