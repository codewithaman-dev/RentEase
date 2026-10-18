import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Sofa, 
  ShoppingBag, 
  Search, 
  User, 
  LogOut, 
  Menu, 
  X, 
  Sparkles,
  MapPin,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { useToast } from '../contexts/ToastContext';

export const Navbar: React.FC = () => {
  const { user, role, signOut } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();
  const { showToast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Bengaluru');
  const [cityDropdownOpen, setCityDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 320);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const INDIAN_CITIES = ['Bengaluru', 'Mumbai', 'Delhi NCR', 'Pune', 'Hyderabad', 'Chennai'];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setUserDropdownOpen(false);
    showToast('Signed out successfully', 'info');
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md text-white border-b border-slate-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-white group">
            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-md group-hover:scale-105 transition-transform">
              <Sofa className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black bg-gradient-to-r from-white via-slate-100 to-emerald-400 bg-clip-text text-transparent">
                RentEase
              </span>
              <span className="text-xs text-emerald-400 font-medium tracking-normal -mt-0.5">
                India Flexi-Rental
              </span>
            </div>
          </Link>

          {/* Indian City Location Selector - Shown when not on home top */}
          {(!isHomePage || isScrolled) && (
            <div className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setCityDropdownOpen(!cityDropdownOpen)}
                className="flex items-center gap-1.5 bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-full text-xs font-semibold text-emerald-400 hover:bg-slate-700 transition-colors cursor-pointer"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>{selectedCity}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {cityDropdownOpen && (
                <div className="absolute left-0 mt-2 w-36 bg-slate-800 border border-slate-700 rounded-xl shadow-xl py-1 z-50 text-xs">
                  <div className="px-3 py-1 text-xs text-slate-400 font-bold border-b border-slate-700">
                    Select Metro City
                  </div>
                  {INDIAN_CITIES.map((c) => (
                    <button
                      key={c}
                      onClick={() => {
                        setSelectedCity(c);
                        setCityDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 hover:bg-slate-700 ${selectedCity === c ? 'text-emerald-400 font-bold bg-emerald-500/10' : 'text-slate-300'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Search Bar - Shown when not on home top to eliminate duplication */}
          {(!isHomePage || isScrolled) && (
            <form onSubmit={handleSearchSubmit} className="hidden lg:flex items-center flex-1 max-w-md mx-4">
              <div className="relative w-full">
                <input
                  type="text"
                  id="navbar-search"
                  name="navbar-search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search sofas, beds, fridges, study tables, combos..."
                  aria-label="Search rental catalog"
                  className="w-full pl-10 pr-4 py-2 bg-slate-800/80 border border-slate-700/80 rounded-full text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
              </div>
            </form>
          )}

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium">
            <Link 
              to="/catalog" 
              className={`hover:text-emerald-400 transition-colors ${location.pathname === '/catalog' ? 'text-emerald-400 font-semibold' : 'text-slate-200'}`}
            >
              Explore Catalog
            </Link>
            <Link 
              to="/catalog?combo=true" 
              className="text-slate-300 hover:text-amber-300 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Student Combos
            </Link>
          </nav>

          {/* Right Action Icons & Real User Profile / Auth State */}
          <div className="flex items-center gap-3">
            
            {user ? (
              /* Authenticated User Menu */
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 bg-slate-800 border border-slate-700 pl-2 pr-3 py-1 rounded-full text-xs font-medium text-slate-200 hover:bg-slate-700 transition-all shadow-sm"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center">
                    {user.name?.[0] || 'U'}
                  </div>
                  <span className="font-bold truncate max-w-[100px]">{user.name?.split(' ')[0]}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                    role === 'admin' ? 'bg-purple-950 text-purple-300 border border-purple-800' : role === 'vendor' ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}>
                    {role === 'admin' ? 'Admin' : role === 'vendor' ? 'Vendor' : 'Renter'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl py-2 z-50 text-xs">
                    <div className="px-3 py-1 text-[10px] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-700 mb-1">
                      {user.email}
                    </div>

                    <Link
                      to={role === 'admin' ? '/admin' : role === 'vendor' ? '/vendor' : '/dashboard'}
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full text-left px-3 py-2 flex items-center gap-2 text-slate-200 hover:bg-slate-700 hover:text-white"
                    >
                      <User className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{role === 'admin' ? 'Admin HQ Panel' : role === 'vendor' ? 'Vendor Hub' : 'Renter Dashboard'}</span>
                    </Link>

                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-3 py-2 flex items-center gap-2 text-slate-400 hover:text-red-400 hover:bg-slate-700"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Unauthenticated Auth Buttons */
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs font-bold text-slate-200 hover:text-emerald-400 px-3 py-1.5 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-black px-3.5 py-1.5 rounded-full transition-all shadow-md"
                >
                  Register
                </Link>
              </div>
            )}

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-slate-200 hover:text-emerald-400 bg-slate-800 hover:bg-slate-700 rounded-full border border-slate-700 transition-colors"
              aria-label="Open Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900 shadow-md animate-pulse">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3">
          <form onSubmit={handleSearchSubmit} className="mb-3">
            <div className="relative">
              <input
                type="text"
                id="mobile-search"
                name="mobile-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search items..."
                aria-label="Search items"
                className="w-full pl-9 pr-3 py-2 bg-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-400"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </form>

          <div className="grid grid-cols-2 gap-2 text-center">
            <Link
              to="/catalog"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 bg-slate-800 rounded-lg text-sm text-slate-200 font-medium hover:bg-slate-700"
            >
              Catalog
            </Link>
            <Link
              to="/catalog?combo=true"
              onClick={() => setMobileMenuOpen(false)}
              className="p-2.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded-lg text-sm font-semibold flex items-center justify-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" /> Combos
            </Link>
            {user ? (
              <Link
                to={role === 'admin' ? '/admin' : role === 'vendor' ? '/vendor' : '/dashboard'}
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 bg-emerald-600 text-slate-950 font-bold rounded-lg text-sm col-span-2"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 bg-slate-800 text-slate-200 font-bold rounded-lg text-sm"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 bg-emerald-600 text-slate-950 font-bold rounded-lg text-sm"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
