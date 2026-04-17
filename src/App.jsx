import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ScrollToTop from './utils/ScrollToTop';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CartDrawer from './pages/CartDrawer';

// Pages
import HomePage from './pages/HomePage';
import CategoriesPage from './pages/CategoriesPage';
import ShopPage from './pages/ShopPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './pages/LoginPage';
import WishlistPage from './pages/WishlistPage';
import ProfilePage from './pages/ProfilePage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PlaceholderPage from './pages/PlaceholderPage';
// Admin & Routing
import AdminRoute from './components/routing/AdminRoute';
import AdminLayout from './components/admin/AdminLayout';
import AdminProducts from './components/admin/AdminProducts';
import AdminOrders from './components/admin/AdminOrders';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminCategories from './components/admin/AdminCategories';
import AdminCoupons from './components/admin/AdminCoupons';
import AdminUsers from './components/admin/AdminUsers';
import AdminSettings from './components/admin/AdminSettings';
// Stores
import { useProductStore } from './services/productStore';

function App() {
  const fetchProducts = useProductStore((state) => state.fetchProducts);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <ScrollToTop />
      <Toaster position="top-center" reverseOrder={false} />

      <Navbar />
      <CartDrawer />

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
          <Route path="/faq" element={<PlaceholderPage title="Frequently Asked Questions" />} />
          <Route path="/shipping-returns" element={<PlaceholderPage title="Shipping & Returns" />} />
          <Route path="/privacy-policy" element={<PlaceholderPage title="Privacy Policy" />} />
          <Route path="/terms" element={<PlaceholderPage title="Terms of Service" />} />

          <Route path="/admin" element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={
                <div className="space-y-4">
                  <h1 className="text-3xl font-display text-ink">Admin Overview</h1>
                  <p className="text-stone">Welcome to your dashboard. Here you can manage your store activity.</p>
                  <div className="mt-10 p-20 border-2 border-dashed border-petal-gray rounded-3xl text-center bg-[#FAF8F6]"></div>
                </div>
              } />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="coupons" element={<AdminCoupons />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Route>

          <Route path="*" element={<div className="py-40 text-center text-2xl">404 - Page Not Found</div>} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;