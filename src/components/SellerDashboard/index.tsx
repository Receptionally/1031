import { useEffect } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { OrderList } from '../Orders/List';
import { OnboardingPrompt } from './OnboardingPrompt';
import { Analytics } from './Analytics';
import { StripeConnect } from './StripeConnect';
import { SubscriptionAlert } from './Subscription/SubscriptionAlert';
import { ChargeHistory } from './ChargeHistory';
import { CustomerReviews } from './CustomerReviews';
import { SettingsSection } from './SettingsSection';
import { Tabs } from './Tabs';
import { useAuth } from '../../services/auth/context';
import { supabase } from '../../config/supabase';
import { CheckCircle } from 'lucide-react';
import type { Seller } from '../../types/seller';
import { Header } from '../Header';

export function SellerDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [seller, setSeller] = useState<Seller | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const { user } = useAuth();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for success message
    const success = sessionStorage.getItem('subscription_success');
    if (success) {
      setShowSuccess(true);
      sessionStorage.removeItem('subscription_success');
      // Hide success message after 5 seconds
      setTimeout(() => setShowSuccess(false), 5000);
    }
  }, []);

  useEffect(() => {
    async function fetchSeller() {
      try {
        if (!user) {
          setLoading(false);
          return;
        }

        const { data: sellerData, error: fetchError } = await supabase
          .rpc('get_or_create_seller', { user_id: user.id })
          .select('*')
          .single();

        if (fetchError) throw fetchError;
        setSeller(sellerData);
      } catch (err) {
        console.error('Error fetching seller:', err);
        setError(err instanceof Error ? err.message : 'Failed to load seller profile');
      } finally {
        setLoading(false);
        setIsInitialLoad(false);
      }
    }

    fetchSeller();
  }, [user, navigate]);

  // Handle navigation after initial load
  useEffect(() => {
    if (!isInitialLoad) {
      if (!user) {
        navigate('/seller-login');
      }
    }
  }, [user, navigate, isInitialLoad]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="flex justify-center py-8">
            <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !seller) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="bg-red-50 p-4 rounded-md">
            <p className="text-red-700">{error || 'Seller not found'}</p>
          </div>
        </main>
      </div>
    );
  }

  // Rest of the component code...

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">
              Seller {activeTab === 'dashboard' ? 'Dashboard' : 'Settings'}
            </h1>
          </div>

          <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

          {showSuccess && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg">
              <div className="flex">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    Payment method successfully set up! You can now continue accepting orders.
                  </p>
                </div>
              </div>
            </div>
          )}

          <OnboardingPrompt seller={seller} />
          <SubscriptionAlert sellerId={seller.id} />

          {activeTab === 'dashboard' ? (
            <div className="space-y-8">
              <OnboardingPrompt seller={seller} />
              <SubscriptionAlert sellerId={seller.id} />
              <Analytics sellerId={seller.id} />
              <OrderList sellerId={seller.id} />
              <ChargeHistory sellerId={seller.id} />
              <CustomerReviews sellerId={seller.id} />
            </div>
          ) : (
            <div className="space-y-8">
              <StripeConnect />
              <SettingsSection seller={seller} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}