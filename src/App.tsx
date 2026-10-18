import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { ToastProvider } from './contexts/ToastContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { handleGoogleRedirect } from './lib/googleAuth';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { SupportWidget } from './components/SupportWidget';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ScrollToTop } from './components/ScrollToTop';

// Dynamic Code Splitting Lazy Imports
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })));
const CatalogPage = lazy(() => import('./pages/CatalogPage').then(m => ({ default: m.CatalogPage })));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage').then(m => ({ default: m.ProductDetailPage })));
const CartPage = lazy(() => import('./pages/CartPage').then(m => ({ default: m.CartPage })));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage').then(m => ({ default: m.CheckoutPage })));
const CustomerDashboard = lazy(() => import('./pages/CustomerDashboard').then(m => ({ default: m.CustomerDashboard })));
const VendorDashboard = lazy(() => import('./pages/VendorDashboard').then(m => ({ default: m.VendorDashboard })));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/RegisterPage').then(m => ({ default: m.RegisterPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./pages/ContactPage').then(m => ({ default: m.ContactPage })));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage })));
const RentalTermsPage = lazy(() => import('./pages/RentalTermsPage').then(m => ({ default: m.RentalTermsPage })));
const MaintenanceSLAPage = lazy(() => import('./pages/MaintenanceSLAPage').then(m => ({ default: m.MaintenanceSLAPage })));

handleGoogleRedirect();

const PageLoader = () => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs">
    <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mr-3"></div>
    Loading RentEase...
  </div>
);

export function App() {
  return (
    <ToastProvider>
      <WishlistProvider>
        <AuthProvider>
          <CartProvider>
            <BrowserRouter>
              <ScrollToTop />
              <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950 relative">
                <Navbar />
                
                <main className="flex-1">
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/catalog" element={<CatalogPage />} />
                      <Route path="/product/:id" element={<ProductDetailPage />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/register" element={<RegisterPage />} />
                      <Route path="/signup" element={<RegisterPage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/contact" element={<ContactPage />} />
                      <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
                      <Route path="/rental-terms" element={<RentalTermsPage />} />
                      <Route path="/maintenance-sla" element={<MaintenanceSLAPage />} />
                      
                      {/* Protected Customer Routes */}
                      <Route path="/checkout" element={
                        <ProtectedRoute allowedRoles={['customer', 'admin', 'vendor']}>
                          <CheckoutPage />
                        </ProtectedRoute>
                      } />
                      <Route path="/dashboard" element={
                        <ProtectedRoute allowedRoles={['customer', 'admin', 'vendor']}>
                          <CustomerDashboard />
                        </ProtectedRoute>
                      } />

                      {/* Protected Vendor Routes */}
                      <Route path="/vendor" element={
                        <ProtectedRoute allowedRoles={['vendor', 'admin']}>
                          <VendorDashboard />
                        </ProtectedRoute>
                      } />

                      {/* Protected Admin Routes */}
                      <Route path="/admin" element={
                        <ProtectedRoute allowedRoles={['admin']}>
                          <AdminDashboard />
                        </ProtectedRoute>
                      } />
                    </Routes>
                  </Suspense>
                </main>

                <Footer />
                
                <CartDrawer />
                <SupportWidget />
              </div>
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </WishlistProvider>
    </ToastProvider>
  );
}

export default App;
