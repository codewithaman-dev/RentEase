import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sofa, 
  Bed, 
  Tv, 
  Laptop, 
  Sparkles, 
  ArrowRight, 
  Truck, 
  Wrench, 
  RefreshCw, 
  ChevronRight,
  UtensilsCrossed,
  Layers,
  MapPin,
  Search,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { ProductCard } from '../components/ProductCard';
import { FAQAccordion } from '../components/FAQAccordion';
import { RentVsBuyCalculator } from '../components/RentVsBuyCalculator';
import { Product, Category } from '../types';
import { apiFetch, INITIAL_PRODUCTS, INITIAL_CATEGORIES, INITIAL_SERVICE_AREAS } from '../lib/api';

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [serviceAreas, setServiceAreas] = useState<any[]>([]);
  const [selectedCity, setSelectedCity] = useState('Bangalore');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        let prodsData: any[] = [];
        let catsData: any[] = [];
        let saData: any[] = [];

        try {
          const [prodRes, catRes, saRes] = await Promise.all([
            apiFetch('/api/products?limit=10'),
            apiFetch('/api/categories'),
            apiFetch('/api/service-areas'),
          ]);

          if (prodRes) {
            prodsData = Array.isArray(prodRes) ? prodRes : (prodRes.data || []);
          }
          if (catRes) {
            catsData = Array.isArray(catRes) ? catRes : (catRes.data || []);
          }
          if (saRes) {
            saData = Array.isArray(saRes) ? saRes : (saRes.data || []);
          }
        } catch (err) {
          console.warn('API fetch warning:', err);
        }

        // Guaranteed fallback to seed data on static hosts (like Netlify)
        if (prodsData.length === 0) {
          prodsData = INITIAL_PRODUCTS.slice(0, 6);
        }
        if (catsData.length === 0) {
          catsData = INITIAL_CATEGORIES;
        }
        if (saData.length === 0) {
          saData = INITIAL_SERVICE_AREAS;
        }

        setFeaturedProducts(prodsData.slice(0, 6));
        setCategories(catsData);
        setServiceAreas(saData);
      } catch (err) {
        console.error('Error fetching homepage data:', err);
        setFeaturedProducts(INITIAL_PRODUCTS.slice(0, 6));
        setCategories(INITIAL_CATEGORIES);
        setServiceAreas(INITIAL_SERVICE_AREAS);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'living-room':
      case 'sofa': return <Sofa className="w-6 h-6 text-emerald-400" />;
      case 'bedroom':
      case 'bed': return <Bed className="w-6 h-6 text-teal-400" />;
      case 'appliances':
      case 'fridge':
      case 'tv': return <Tv className="w-6 h-6 text-cyan-400" />;
      case 'study-wfh':
      case 'table': return <Laptop className="w-6 h-6 text-amber-400" />;
      case 'dining': return <UtensilsCrossed className="w-6 h-6 text-purple-400" />;
      default: return <Layers className="w-6 h-6 text-rose-400" />;
    }
  };

  return (
    <div className="space-y-20 pb-16 bg-slate-950 text-slate-100">
      
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden border-b border-slate-800/80 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950">
        
        {/* Subtle Ambient Light Gradients */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-[300px] h-[300px] bg-teal-500/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7 space-y-6 text-center lg:text-left"
            >
              
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3">
                <Link
                  to="/catalog"
                  className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-400 hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span>Zero Upfront Cash Outlay • Flexi Rentals from ₹449/mo</span>
                </Link>

                <RentVsBuyCalculator />
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
                Furnish Your Home, <br />
                <span className="text-gradient-emerald">
                  Not Your Worries.
                </span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed mx-auto lg:mx-0">
                Designed for students and relocating professionals. Enjoy premium beds, velvet sofas, smart fridges, and WFH setups with <strong>100% Free City Relocation</strong> & <strong>Free 24h On-Site Maintenance</strong>.
              </p>

              {/* City Selector & Search Bar */}
              <form onSubmit={handleSearchSubmit} className="bg-slate-900 border border-slate-800 p-2 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-2 max-w-xl mx-auto lg:mx-0">
                <div className="flex items-center gap-1.5 px-3 py-2 bg-slate-950 rounded-xl border border-slate-800 text-xs font-bold text-emerald-400 shrink-0 w-full sm:w-auto">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="bg-transparent focus:outline-none text-white font-bold cursor-pointer"
                  >
                    {serviceAreas.length > 0 ? (
                      serviceAreas.map((sa) => (
                        <option key={sa.id} value={sa.city} className="bg-slate-900 text-white">{sa.city}</option>
                      ))
                    ) : (
                      <>
                        <option value="Bangalore" className="bg-slate-900 text-white">Bangalore</option>
                        <option value="Pune" className="bg-slate-900 text-white">Pune</option>
                        <option value="Hyderabad" className="bg-slate-900 text-white">Hyderabad</option>
                        <option value="Mumbai" className="bg-slate-900 text-white">Mumbai</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="relative flex-1 w-full">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search queen beds, sofas, refrigerators..."
                    className="w-full bg-transparent pl-8 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                  />
                  <Search className="w-4 h-4 text-slate-500 absolute left-2 top-2.5" />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs rounded-xl transition-all shadow-md shrink-0 cursor-pointer"
                >
                  Search
                </button>
              </form>

              {/* Trust Badges - All Clickable */}
              <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-800/80 text-left">
                <Link to="/catalog" className="group cursor-pointer">
                  <div className="text-xl font-black text-white group-hover:text-emerald-400 transition-colors">48 Hours</div>
                  <div className="text-xs text-slate-400 mt-0.5 group-hover:text-slate-300">Free Delivery & Assembly &rarr;</div>
                </Link>
                <Link to="/rental-terms" className="group cursor-pointer">
                  <div className="text-xl font-black text-emerald-400 group-hover:underline">100% Free</div>
                  <div className="text-xs text-slate-400 mt-0.5 group-hover:text-slate-300">Inter-Flats Moving Support &rarr;</div>
                </Link>
                <Link to="/maintenance-sla" className="group cursor-pointer">
                  <div className="text-xl font-black text-teal-400 group-hover:underline">₹0 Fee</div>
                  <div className="text-xs text-slate-400 mt-0.5 group-hover:text-slate-300">Technician Repair SLA &rarr;</div>
                </Link>
              </div>

            </motion.div>

            {/* Right Floating Product Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 group">
                <img
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80"
                  alt="Modern Living Room Setup"
                  className="w-full h-[420px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent"></div>

                {/* Floating Highlight Pill - Clickable */}
                <Link
                  to="/rental-terms"
                  className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 hover:border-emerald-500/50 p-3 rounded-2xl shadow-xl flex items-center gap-3 group/pill transition-all cursor-pointer"
                >
                  <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl group-hover/pill:scale-110 transition-transform">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white group-hover/pill:text-emerald-400 transition-colors">Shifting Apartments?</div>
                    <div className="text-[11px] text-emerald-400 font-medium">Free Relocation Service &rarr;</div>
                  </div>
                </Link>

                {/* Floating Featured Combo Banner - Clickable */}
                <Link
                  to="/catalog?combo=true"
                  className="absolute bottom-6 left-6 right-6 p-4 bg-slate-900/95 backdrop-blur-md border border-slate-800 hover:border-emerald-500/60 rounded-2xl group/combo transition-all cursor-pointer block"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Featured Indian Combo
                      </span>
                      <h4 className="font-bold text-white text-base group-hover/combo:text-emerald-400 transition-colors">Full 1BHK Apartment Bundle</h4>
                      <p className="text-xs text-slate-400">Queen Bed + Sofa + Fridge + WFH Desk</p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-black text-emerald-400">₹2,499<span className="text-xs text-slate-400 font-normal">/mo</span></span>
                      <span className="block text-[10px] text-emerald-400 font-bold mt-0.5">Explore &rarr;</span>
                    </div>
                  </div>
                </Link>

              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Category Navigation Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Browse Furniture & Appliances</h2>
            <p className="text-sm text-slate-400 mt-1">Select your space and customize your monthly rental tenure</p>
          </div>
          <Link
            to="/catalog"
            className="text-emerald-400 hover:text-emerald-300 font-bold text-sm flex items-center gap-1"
          >
            View All Categories <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/catalog?category=${cat.slug}`}
              className="bg-slate-900 border border-slate-800/80 hover:border-emerald-500/50 p-5 rounded-2xl text-center group hover:bg-slate-800/80 transition-all duration-300 shadow-md"
            >
              <div className="p-3 bg-slate-800 group-hover:bg-emerald-500/10 rounded-2xl w-fit mx-auto mb-3 transition-colors">
                {getCategoryIcon(cat.slug)}
              </div>
              <h3 className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">
                {cat.name}
              </h3>
              <p className="text-[11px] text-slate-400 mt-1">{cat.product_count || 6}+ Items</p>
            </Link>
          ))}
        </div>
      </section>

      {/* "How It Works" 4-Step Animated Process */}
      <section className="bg-slate-900/60 border-y border-slate-800/80 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              Simple 4-Step Experience
            </span>
            <h2 className="text-3xl font-black text-white">How RentEase Works</h2>
            <p className="text-xs text-slate-400">Zero buying commitment. Full mobility freedom.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: '1. Browse & Select',
                desc: 'Explore certified Grade A beds, sofas, refrigerators, and WFH setups.',
                icon: Sofa,
                link: '/catalog',
              },
              {
                step: '02',
                title: '2. Choose Tenure',
                desc: 'Pick 3, 6, 9, or 12+ month plans. Longer tenure = cheaper monthly rent.',
                icon: Clock,
                link: '/catalog',
              },
              {
                step: '03',
                title: '3. 48h Delivery',
                desc: 'Free doorstep delivery and expert assembly across Bangalore, Pune, Hyderabad.',
                icon: Truck,
                link: '/catalog',
              },
              {
                step: '04',
                title: '4. Relocate or Return',
                desc: 'Free city relocation if you shift flats, or easy return with 48h deposit refund.',
                icon: RefreshCw,
                link: '/rental-terms',
              },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link key={idx} to={item.link} className="block">
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-slate-900 border border-slate-800 hover:border-emerald-500/50 p-6 rounded-2xl relative space-y-3 shadow-lg transition-colors h-full"
                  >
                    <span className="text-3xl font-black text-slate-800 absolute top-4 right-4">
                      {item.step}
                    </span>
                    <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl w-fit">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-white text-base">{item.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                    <span className="text-[11px] font-bold text-emerald-400 block pt-1">Learn more &rarr;</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">Top Rented Items in India</h2>
            <p className="text-sm text-slate-400 mt-1">Grade A deep-sanitized & ready for 48h delivery</p>
          </div>
          <Link
            to="/catalog"
            className="text-emerald-400 hover:text-emerald-300 font-bold text-sm flex items-center gap-1"
          >
            See All Items <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-80 bg-slate-900 animate-pulse rounded-2xl border border-slate-800"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* FAQ Accordion Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FAQAccordion />
      </section>

    </div>
  );
};
