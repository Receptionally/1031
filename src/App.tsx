import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './services/auth/context';
import { useAnalytics } from './services/analytics/hooks/useAnalytics';
import { HomePage } from './pages/HomePage';
import { SellerDashboard } from './pages/SellerDashboard';
import { SellerLoginPage } from './pages/SellerLoginPage';
import { SellerLandingPage } from './pages/SellerLandingPage';
import { SellerOnboarding } from './pages/SellerOnboarding';
import { AdminDashboard } from './pages/AdminDashboard';
import { SellerProfilePage } from './pages/SellerProfilePage';
import { StripeCallback } from './components/StripeCallback';
import { FirewoodPage } from './pages/FirewoodPage';
import { CustomerSuccess } from './pages/CustomerSuccess';
import { TestPage } from './pages/TestPage';
import { MockFirewoodPage } from './pages/MockFirewoodPage';
import { CityPage } from './pages/CityPage';

function App() {
  useAnalytics();

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/seller-landing" element={<SellerLandingPage />} />
        <Route path="/seller-dashboard" element={<SellerDashboard />} />
        <Route path="/seller-login" element={<SellerLoginPage />} />
        <Route path="/seller-onboarding" element={<SellerOnboarding />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/stripe/callback" element={<StripeCallback />} />
        <Route path="/seller/:sellerId" element={<SellerProfilePage />} />
        <Route path="/firewood-near-me" element={<FirewoodPage />} />
        <Route path="/customer-success" element={<CustomerSuccess />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/mock-product" element={<MockFirewoodPage />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;