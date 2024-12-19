import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { OrderList } from '../components/Orders/List';
import { DashboardContent } from '../components/SellerDashboard/DashboardContent';
import { SettingsContent } from '../components/SellerDashboard/SettingsContent';
import { Tabs } from '../components/SellerDashboard/Tabs';
import { useAuth } from '../services/auth/context';
import { supabase } from '../config/supabase';
import type { Seller } from '../types/seller';

export function SellerDashboard() {
  const [seller, setSeller] = useState<Seller | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    async function fetchSeller() {
      try {
        if (!user) {
          setLoading(false);
          setAuthChecked(true);
          return;
        }

        const { data: sellerData, error: fetchError } = await supabase
          .rpc('get_or_create_seller', { user_id: user.id })
          .select('*')
          .single();

        if (fetchError) {
          if (fetchError.code === 'PGRST116') {
            // No rows returned - create new seller
            const { data: newSeller, error: createError } = await supabase
              .from('sellers')
              .insert([{ id: user.id, email: user.email }])
              .select()
              .single();
              
            if (createError) throw createError;
            setSeller(newSeller);
          } else {
            throw fetchError;
          }
        } else {
          setSeller(sellerData);
        }

        setAuthChecked(true);
        setSeller(sellerData);
      } catch (err) {
        console.error('Error fetching seller:', err);
        setError(err instanceof Error ? err.message : 'Failed to load seller profile');
        setAuthChecked(true);
      } finally {
        setLoading(false);
        setIsInitialLoad(false);
      }
    }

    fetchSeller();
  }, [user, navigate]);

  // Handle navigation after initial load
  useEffect(() => {
    if (authChecked) {
      if (!user) {
        navigate('/seller-login');
      }
    }
  }, [user, navigate, authChecked]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0"> 
              {activeTab === 'dashboard' ? 'Dashboard' : 'Account Settings'}
            </h1>
          </div>
          
          <Tabs activeTab={activeTab} onTabChange={setActiveTab} />

          {activeTab === 'dashboard' ? (
            <DashboardContent seller={seller} />
          ) : (
            <SettingsContent seller={seller} />
          )}
        </div>
      </main>
    </div>
  );
}