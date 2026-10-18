import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Search, SlidersHorizontal, Sparkles, RefreshCw, Heart } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { Product, Category } from '../types';
import { useWishlist } from '../contexts/WishlistContext';
import { apiFetch, filterMockProducts, INITIAL_CATEGORIES } from '../lib/api';

export const CatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const initialSearch = searchParams.get('search') || '';
  const initialCombo = searchParams.get('combo') === 'true';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [showComboOnly, setShowComboOnly] = useState<boolean>(initialCombo);
  const [showWishlistOnly, setShowWishlistOnly] = useState<boolean>(false);
  const [priceMax, setPriceMax] = useState<number>(3500);
  const [sortBy, setSortBy] = useState<'rating' | 'price-asc' | 'price-desc'>('rating');
  const [loading, setLoading] = useState<boolean>(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState<boolean>(false);

  const { wishlistProducts, wishlistCount } = useWishlist();

  useEffect(() => {
    const cat = searchParams.get('category') || 'all';
    const combo = searchParams.get('combo') === 'true';
    setSelectedCategory(cat);
    setSearchQuery(searchParams.get('search') || '');
    setShowComboOnly(combo || cat === 'student-combos' || cat === 'combos' || cat === 'combo');
  }, [searchParams]);

  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        let url = '/api/products?limit=100&';
        if (selectedCategory !== 'all') url += `category=${selectedCategory}&`;
        if (searchQuery) url += `search=${encodeURIComponent(searchQuery)}&`;
        if (showComboOnly) url += `is_combo=true&`;

        const [prodRes, catRes] = await Promise.all([
          apiFetch(url),
          apiFetch('/api/categories'),
        ]);

        let prodsData = Array.isArray(prodRes) ? prodRes : (prodRes?.data || []);
        const catsData = Array.isArray(catRes) ? catRes : (catRes?.data || []);

        // Guaranteed fallback if API returned empty
        if (!prodsData || prodsData.length === 0) {
          const fallback = filterMockProducts({
            category: selectedCategory,
            search: searchQuery,
            is_combo: showComboOnly,
          });
          prodsData = fallback.data;
        }

        setProducts(prodsData);
        setCategories(catsData.length > 0 ? catsData : INITIAL_CATEGORIES);
      } catch (err) {
        console.error('Error fetching catalog:', err);
        const fallback = filterMockProducts({
          category: selectedCategory,
          search: searchQuery,
          is_combo: showComboOnly,
        });
        setProducts(fallback.data);
        setCategories(INITIAL_CATEGORIES);
      } finally {
        setLoading(false);
      }
    };

    fetchCatalog();
  }, [selectedCategory, searchQuery, showComboOnly]);

  const sourceProducts = showWishlistOnly ? wishlistProducts : (Array.isArray(products) ? products : []);

  const filteredProducts = sourceProducts
    .filter((p) => {
      const rate = Number(p.monthly_rate_12m || p.monthly_rent || 0);
      return rate <= priceMax;
    })
    .sort((a, b) => {
      const rateA = Number(a.monthly_rate_12m || a.monthly_rent || 0);
      const rateB = Number(b.monthly_rate_12m || b.monthly_rent || 0);
      if (sortBy === 'price-asc') return rateA - rateB;
      if (sortBy === 'price-desc') return rateB - rateA;
      return (b.rating || 0) - (a.rating || 0);
    });

  const handleCategorySelect = (catSlug: string) => {
    setSelectedCategory(catSlug);
    setShowWishlistOnly(false);
    const isCombo = catSlug === 'student-combos' || catSlug === 'combos' || catSlug === 'combo';
    setShowComboOnly(isCombo);
    setSearchParams((prev) => {
      if (catSlug === 'all') {
        prev.delete('category');
        prev.delete('combo');
      } else if (isCombo) {
        prev.set('category', 'student-combos');
        prev.set('combo', 'true');
      } else {
        prev.set('category', catSlug);
        prev.delete('combo');
      }
      return prev;
    });
  };

  const CATEGORY_CHIPS = [
    { slug: 'all', label: 'All Items' },
    { slug: 'furniture', label: 'Furniture' },
    { slug: 'living-room', label: 'Living Room' },
    { slug: 'bedroom', label: 'Bedroom Sets' },
    { slug: 'appliances', label: 'Home Appliances' },
    { slug: 'study-wfh', label: 'Work From Home' },
    { slug: 'dining', label: 'Dining Room' },
    { slug: 'student-combos', label: '1BHK Combos' },
  ];

  const isChipActive = (chipSlug: string) => {
    if (showWishlistOnly) return false;
    if (chipSlug === 'all') return (selectedCategory === 'all' || !selectedCategory) && !showComboOnly;
    if (chipSlug === selectedCategory) return true;
    if (chipSlug === 'bedroom' && (selectedCategory === 'bed' || selectedCategory === 'bedroom')) return true;
    if (chipSlug === 'living-room' && (selectedCategory === 'sofa' || selectedCategory === 'living-room')) return true;
    if (chipSlug === 'appliances' && ['fridge', 'washing-machine', 'tv', 'appliances'].includes(selectedCategory)) return true;
    if (chipSlug === 'study-wfh' && ['table', 'study-wfh', 'wfh'].includes(selectedCategory)) return true;
    if (chipSlug === 'dining' && ['dining', 'dining-room'].includes(selectedCategory)) return true;
    if (chipSlug === 'student-combos' && (showComboOnly || selectedCategory === 'student-combos' || selectedCategory === 'combos' || selectedCategory === 'combo')) return true;
    if (chipSlug === 'furniture' && ['furniture', 'bed', 'sofa', 'table', 'dining'].includes(selectedCategory)) return true;
    return false;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 bg-slate-950 text-slate-100 min-h-screen">
      
      {/* Header Title */}
      <div className="space-y-2 border-b border-slate-800 pb-6">
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
          Furniture & Appliance Rental Catalog
          {showComboOnly && (
            <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 rounded-full flex items-center gap-1 font-bold">
              <Sparkles className="w-3.5 h-3.5" /> Student Combos
            </span>
          )}
        </h1>
        <p className="text-sm text-slate-400">
          Flexi 3 to 12+ month rentals in India with free doorstep assembly and free city relocation.
        </p>
      </div>

      {/* Category Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800/80">
        {CATEGORY_CHIPS.map((chip) => {
          const isSelected = isChipActive(chip.slug);
          return (
            <button
              key={chip.slug}
              onClick={() => handleCategorySelect(chip.slug)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-950/40'
                  : 'bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
              }`}
            >
              {chip.label}
            </button>
          );
        })}

        <button
          onClick={() => setShowWishlistOnly(!showWishlistOnly)}
          className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
            showWishlistOnly
              ? 'bg-rose-500 text-white shadow-lg shadow-rose-950/40'
              : 'bg-slate-900 border border-slate-800 text-rose-400 hover:border-rose-800'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${showWishlistOnly ? 'fill-white' : ''}`} />
          Saved Wishlist ({wishlistCount})
        </button>
      </div>

      {/* Mobile Filter Toggle Button */}
      <div className="lg:hidden flex items-center justify-between bg-slate-900 border border-slate-800 p-3.5 rounded-2xl">
        <button
          type="button"
          onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
          className="flex items-center gap-2 text-xs font-bold text-emerald-400 cursor-pointer"
        >
          <Filter className="w-4 h-4" />
          <span>{mobileFilterOpen ? 'Hide Filters' : 'Filter & Search Products'}</span>
        </button>
        <span className="text-xs text-slate-400 font-medium">
          {filteredProducts.length} items found
        </span>
      </div>

      {/* Main Grid Layout - items-start ensures sticky sidebar stays stable */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        
        {/* Left Filter Sidebar - Sticky and Fixed on Desktop */}
        <aside
          className={`${
            mobileFilterOpen ? 'block' : 'hidden lg:block'
          } lg:col-span-1 lg:sticky lg:top-24 space-y-6 bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-slate-800 shadow-xl max-h-[calc(100vh-7rem)] overflow-y-auto overscroll-contain`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-white text-sm flex items-center gap-2">
              <Filter className="w-4 h-4 text-emerald-400" /> Filters
            </h3>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
                setShowComboOnly(false);
                setShowWishlistOnly(false);
                setPriceMax(3500);
                setSearchParams({});
              }}
              className="text-xs text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Search Box */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Search Products</label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sofas, desks, beds..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Categories Radio List */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">Categories</label>
            <div className="space-y-1">
              <button
                onClick={() => handleCategorySelect('all')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors ${
                  selectedCategory === 'all' && !showWishlistOnly
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat.slug)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium transition-colors flex justify-between items-center ${
                    selectedCategory === cat.slug && !showWishlistOnly
                      ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <span>{cat.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Student Package Filter Toggle */}
          <div className="pt-2 border-t border-slate-800">
            <label className="flex items-center justify-between cursor-pointer p-2 bg-slate-950 rounded-xl border border-slate-800/80">
              <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Combo Bundles
              </span>
              <input
                type="checkbox"
                checked={showComboOnly}
                onChange={(e) => setShowComboOnly(e.target.checked)}
                className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
              />
            </label>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-semibold">Max Monthly Rate:</span>
              <span className="font-bold text-emerald-400">₹{priceMax.toLocaleString('en-IN')}/mo</span>
            </div>
            <input
              type="range"
              min="400"
              max="3500"
              step="100"
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
          </div>

        </aside>

        {/* Right Catalog Grid */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Top Sort & Count Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-center bg-slate-900/60 p-4 rounded-2xl border border-slate-800 gap-4 text-xs">
            <div className="text-slate-300 font-medium">
              Showing <span className="font-bold text-white">{filteredProducts.length}</span> rental products
            </div>

            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-slate-400" />
              <span className="text-slate-400">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-950 border border-slate-800 text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-emerald-500"
              >
                <option value="rating">Highest Rated</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Product Items List */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-80 bg-slate-900 animate-pulse rounded-2xl border border-slate-800"></div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
              <div className="text-slate-400 font-bold">
                {showWishlistOnly
                  ? 'No saved products in your Wishlist yet. Click the heart icon on any card to save!'
                  : 'No rental products found matching your filter criteria.'}
              </div>
              <p className="text-xs text-slate-500">Try adjusting your price range or search terms.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
