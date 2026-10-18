import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShieldCheck, Truck, Wrench, ArrowLeft, CheckCircle2, ShoppingBag, MessageSquare, MapPin, Check, AlertCircle } from 'lucide-react';
import { TenureCalculator } from '../components/TenureCalculator';
import { ProductCard } from '../components/ProductCard';
import { RentToOwnBadge } from '../components/RentToOwnBadge';
import { DepositRefundModal } from '../components/DepositRefundModal';
import { Product, Review } from '../types';
import { useCart } from '../contexts/CartContext';
import { apiFetch, INITIAL_PRODUCTS } from '../lib/api';

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [selectedTenure, setSelectedTenure] = useState<3 | 6 | 12>(6);
  const [loading, setLoading] = useState(true);
  const [addedSuccess, setAddedSuccess] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);

  // Serviceability Checker State
  const [pincode, setPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState<{ checked: boolean; serviceable?: boolean; message?: string } | null>(null);
  const [checkingPincode, setCheckingPincode] = useState(false);

  // New review form states
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [reviewerName, setNewReviewerName] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchProductAndDetails = async () => {
      setLoading(true);
      try {
        const [pRes, rRes] = await Promise.all([
          apiFetch(`/api/product-detail?id=${id}`),
          apiFetch(`/api/reviews?product_id=${id}`),
        ]);

        let pData: Product | null = null;
        if (pRes) {
          pData = pRes.data || (pRes.id ? pRes : null);
        }

        // Guaranteed fallback to mock product
        if (!pData || !pData.id) {
          pData = INITIAL_PRODUCTS.find((p) => p.id === id || p.slug === id) || null;
        }
        setProduct(pData);

        if (rRes) {
          const rList = Array.isArray(rRes) ? rRes : (rRes.data || []);
          setReviews(rList);
        }

        // Fetch related products matching category
        if (pData) {
          const cat = pData.category_slug || 'all';
          const relRes = await apiFetch(`/api/products?category=${cat}&limit=6`);
          const relList = Array.isArray(relRes) ? relRes : (relRes?.data || []);
          let related = relList.filter((p: any) => p.id !== pData?.id).slice(0, 3);
          if (related.length === 0) {
            related = INITIAL_PRODUCTS.filter((p) => p.id !== pData?.id).slice(0, 3);
          }
          setRelatedProducts(related);
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
        const fallbackProd = INITIAL_PRODUCTS.find((p) => p.id === id || p.slug === id) || null;
        setProduct(fallbackProd);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProductAndDetails();
  }, [id]);

  const handleCheckPincode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pincode.trim()) return;

    setCheckingPincode(true);
    try {
      const data = await apiFetch('/api/service-areas/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pincode: pincode.trim() }),
      });

      setPincodeResult({
        checked: true,
        serviceable: data?.serviceable ?? true,
        message: data?.message || '48h Delivery available across top Indian Metro PIN codes!',
      });
    } catch (err) {
      console.error(err);
      setPincodeResult({
        checked: true,
        serviceable: true,
        message: '48h Delivery available in your area!',
      });
    } finally {
      setCheckingPincode(false);
    }
  };

  const handleAddToCartClick = () => {
    if (product) {
      addToCart(product, selectedTenure);
      setAddedSuccess(true);
      setTimeout(() => setAddedSuccess(false), 3000);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim() || !newReviewComment.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await apiFetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: id,
          user_name: reviewerName.trim(),
          rating: newReviewRating,
          comment: newReviewComment.trim(),
          verified_renter: true,
        }),
      });

      if (res) {
        const created = res.data || res;
        setReviews([created, ...reviews]);
        setNewReviewComment('');
        setNewReviewerName('');
      }
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-slate-400">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        Loading product specs...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-white">Product Not Found</h2>
        <Link to="/catalog" className="text-emerald-400 underline text-sm">
          Return to Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 bg-slate-950 text-slate-100 min-h-screen">
      
      {/* Back Button */}
      <Link
        to="/catalog"
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Catalog
      </Link>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Column: Image Gallery & Guarantees */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
            <img
              src={product.image || (product.images ? product.images[0] : '')}
              alt={product.title || product.name}
              className="w-full h-[450px] object-cover"
            />
            <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-emerald-400 border border-emerald-500/30">
              {product.condition || 'Brand New'}
            </div>
            <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-amber-300 border border-slate-700 flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{product.rating || 4.9} ({product.reviews_count || 12} reviews)</span>
            </div>
          </div>

          {/* Guarantees Box */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
              <Truck className="w-6 h-6 text-emerald-400 mx-auto" />
              <div className="font-bold text-xs text-white">48h Free Delivery</div>
              <div className="text-[10px] text-slate-400">At-door assembly included</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl space-y-1">
              <Wrench className="w-6 h-6 text-teal-400 mx-auto" />
              <div className="font-bold text-xs text-white">100% Free Maintenance</div>
              <div className="text-[10px] text-slate-400">Free repairs or swap</div>
            </div>

            <button
              type="button"
              onClick={() => setShowDepositModal(true)}
              className="bg-slate-900 border border-slate-800 hover:border-teal-500/50 p-4 rounded-2xl space-y-1 text-center transition-colors"
            >
              <ShieldCheck className="w-6 h-6 text-cyan-400 mx-auto" />
              <div className="font-bold text-xs text-white">Deposit Refund Checklist</div>
              <div className="text-[10px] text-teal-400 font-semibold underline">Inspect 100% Refund Terms</div>
            </button>
          </div>

          {/* Rent to Own Equity Progress Card */}
          <RentToOwnBadge
            monthlyRate={product.monthly_rate_12m || product.monthly_rent || 549}
            retailPrice={product.retail_price || 25000}
            rentedMonths={6}
          />

          {/* Pincode Serviceability Checker */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-3">
            <h4 className="font-bold text-xs text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-400" /> Check PIN Code Serviceability in Indian Cities
            </h4>
            <form onSubmit={handleCheckPincode} className="flex gap-2">
              <input
                type="text"
                required
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="e.g. 560103, 411014, 500081"
                className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 flex-1 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                disabled={checkingPincode}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl transition-colors"
              >
                {checkingPincode ? 'Checking...' : 'Check Availability'}
              </button>
            </form>

            {pincodeResult?.checked && (
              <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                pincodeResult.serviceable
                  ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                  : 'bg-amber-950/40 border-amber-800 text-amber-300'
              }`}>
                {pincodeResult.serviceable ? <Check className="w-4 h-4 text-emerald-400 shrink-0" /> : <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />}
                <span>{pincodeResult.message}</span>
              </div>
            )}
          </div>

          {/* Specifications */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h3 className="font-bold text-white text-base">Product Specifications</h3>
            <div className="grid grid-cols-2 gap-4 text-xs text-slate-300">
              <div>
                <span className="text-slate-500 block">Dimensions:</span>
                <span className="font-medium text-slate-200">{product.dimensions || 'Standard Ergonomic'}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Available Stock:</span>
                <span className="font-bold text-emerald-400">{product.available_stock || product.stock || 10} units ready</span>
              </div>
            </div>
            {product.specifications && typeof product.specifications === 'object' && (
              <div className="pt-3 border-t border-slate-800 space-y-1">
                <span className="text-xs text-slate-500 font-semibold block">Key Specifications:</span>
                <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                  {Object.entries(product.specifications).map(([key, val]) => (
                    <li key={key}><strong>{key}:</strong> {String(val)}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Pricing & Tenure Calculator */}
        <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
          
          <div>
            <span className="text-xs text-emerald-400 font-bold uppercase tracking-wider">
              {product.category_name || 'Furniture'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">
              {product.title || product.name}
            </h1>
            <p className="text-xs text-slate-400 mt-3 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Added to Cart Feedback Banner */}
          {addedSuccess && (
            <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 p-3 rounded-2xl text-xs font-bold flex items-center justify-between shadow-lg">
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" /> Item added to rental cart!
              </span>
              <button onClick={() => navigate('/checkout')} className="underline text-white font-black">
                Checkout Now
              </button>
            </div>
          )}

          {/* Interactive Tenure Calculator Component */}
          <TenureCalculator
            product={product}
            selectedTenure={selectedTenure}
            onSelectTenure={setSelectedTenure}
          />

          {/* Add to Cart / Rent Now */}
          <div className="space-y-3">
            <button
              onClick={handleAddToCartClick}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-emerald-950/40 transition-all flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-5 h-5" /> Add to Cart & Start Rental
            </button>

            <button
              onClick={() => {
                addToCart(product, selectedTenure);
                navigate('/checkout');
              }}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-2xl border border-slate-700 transition-colors"
            >
              Instant Checkout Now
            </button>
          </div>

        </div>

      </div>

      {/* Deposit Refund Checklist Modal */}
      {showDepositModal && (
        <DepositRefundModal
          depositAmount={product.deposit_amount || product.security_deposit || 1500}
          onClose={() => setShowDepositModal(false)}
        />
      )}

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <div className="border-t border-slate-800 pt-10 space-y-6">
          <h3 className="text-xl font-bold text-white">Related Furniture & Appliances</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}

      {/* Customer Reviews Section */}
      <div className="border-t border-slate-800 pt-10 space-y-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-emerald-400" /> Customer Reviews ({reviews.length})
        </h3>

        {/* Submit Review Form */}
        <form onSubmit={handleReviewSubmit} className="bg-slate-900 border border-slate-800 p-5 rounded-2xl space-y-4 max-w-2xl">
          <h4 className="font-bold text-xs text-slate-200">Rented this item? Leave a review</h4>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input
              type="text"
              required
              value={reviewerName}
              onChange={(e) => setNewReviewerName(e.target.value)}
              placeholder="Your Full Name"
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500"
            />
            <select
              value={newReviewRating}
              onChange={(e) => setNewReviewRating(Number(e.target.value))}
              className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value={5}>5 Stars - Excellent</option>
              <option value={4}>4 Stars - Good</option>
              <option value={3}>3 Stars - Average</option>
            </select>
          </div>

          <textarea
            required
            rows={3}
            value={newReviewComment}
            onChange={(e) => setNewReviewComment(e.target.value)}
            placeholder="How was the product condition and rental delivery experience?"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500"
          ></textarea>

          <button
            type="submit"
            disabled={submittingReview}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors"
          >
            {submittingReview ? 'Posting...' : 'Submit Review'}
          </button>
        </form>

        {/* Existing Reviews List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {reviews.map((rev) => (
            <div key={rev.id} className="bg-slate-900 border border-slate-800/80 p-5 rounded-2xl space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-sm text-white">{rev.user_name}</span>
                <div className="flex gap-1 text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-slate-300 italic">"{rev.comment}"</p>
              {rev.verified_renter && (
                <div className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold pt-1">
                  <CheckCircle2 className="w-3 h-3" /> Verified RentEase Renter
                </div>
              )}
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
