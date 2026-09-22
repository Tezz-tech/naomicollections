import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import Seo from './components/Seo';
import { queryClient } from './lib/queryClient';
import AuthInitializer from './components/AuthInitializer';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import AuthLayout from './components/layout/AuthLayout';
import AccountLayout from './components/layout/AccountLayout';

import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import OrderTracking from './pages/OrderTracking';
import BulkOrders from './pages/BulkOrders';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

import Terms from './pages/legal/Terms';
import Privacy from './pages/legal/Privacy';
import Returns from './pages/legal/Returns';
import Shipping from './pages/legal/Shipping';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyEmail from './pages/auth/VerifyEmail';

import AccountOverview from './pages/account/AccountOverview';
import AccountOrders from './pages/account/AccountOrders';
import AccountAddresses from './pages/account/AccountAddresses';
import AccountWishlist from './pages/account/AccountWishlist';
import AccountBulkRequests from './pages/account/AccountBulkRequests';

// Admin section is code-split — it's a large, internal-only surface that
// storefront visitors never need to download.
const AdminLayout = lazy(() => import('./admin/layout/AdminLayout'));
const Dashboard = lazy(() => import('./admin/pages/Dashboard'));
const ProductList = lazy(() => import('./admin/pages/products/ProductList'));
const ProductForm = lazy(() => import('./admin/pages/products/ProductForm'));
const Categories = lazy(() => import('./admin/pages/Categories'));
const AdminOrderList = lazy(() => import('./admin/pages/orders/OrderList'));
const AdminOrderDetail = lazy(() => import('./admin/pages/orders/OrderDetail'));
const AdminBulkRequests = lazy(() => import('./admin/pages/BulkRequests'));
const Customers = lazy(() => import('./admin/pages/Customers'));
const CustomerDetail = lazy(() => import('./admin/pages/CustomerDetail'));
const DeliveryZones = lazy(() => import('./admin/pages/DeliveryZones'));
const Coupons = lazy(() => import('./admin/pages/Coupons'));
const Content = lazy(() => import('./admin/pages/Content'));
const Emails = lazy(() => import('./admin/pages/Emails'));
const Payments = lazy(() => import('./admin/pages/Payments'));
const Reviews = lazy(() => import('./admin/pages/Reviews'));
const Admins = lazy(() => import('./admin/pages/Admins'));
const AdminSettings = lazy(() => import('./admin/pages/Settings'));

function AdminFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-offwhite">
      <Loader2 className="h-6 w-6 animate-spin text-gold" />
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <AuthInitializer />
      <Seo />
      <BrowserRouter>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: '#0A0A0A',
              color: '#FFFFFF',
              fontSize: '13px',
              borderRadius: '2px',
            },
          }}
        />
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:slug" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order/success" element={<OrderSuccess />} />
            <Route path="/order/:orderNumber" element={<OrderTracking />} />
            <Route path="/bulk-orders" element={<BulkOrders />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/shipping" element={<Shipping />} />

            <Route
              path="/account"
              element={
                <ProtectedRoute>
                  <AccountLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AccountOverview />} />
              <Route path="orders" element={<AccountOrders />} />
              <Route path="addresses" element={<AccountAddresses />} />
              <Route path="wishlist" element={<AccountWishlist />} />
              <Route path="bulk-requests" element={<AccountBulkRequests />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Route>

          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
          </Route>

          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['admin', 'super-admin']}>
                <Suspense fallback={<AdminFallback />}>
                  <AdminLayout />
                </Suspense>
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="products" element={<ProductList />} />
            <Route path="products/new" element={<ProductForm />} />
            <Route path="products/:id" element={<ProductForm />} />
            <Route path="categories" element={<Categories />} />
            <Route path="orders" element={<AdminOrderList />} />
            <Route path="orders/:id" element={<AdminOrderDetail />} />
            <Route path="bulk-requests" element={<AdminBulkRequests />} />
            <Route path="customers" element={<Customers />} />
            <Route path="customers/:id" element={<CustomerDetail />} />
            <Route path="delivery" element={<DeliveryZones />} />
            <Route path="coupons" element={<Coupons />} />
            <Route path="content" element={<Content />} />
            <Route path="emails" element={<Emails />} />
            <Route path="payments" element={<Payments />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="admins" element={<Admins />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
    </HelmetProvider>
  );
}
