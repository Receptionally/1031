import React, { useState, useEffect } from 'react';
import { StripeConnect as StripeConnectButton } from '../StripeConnect';
import { ENV } from '../../config/env';
import { logger } from '../../services/utils/logger';
import { useAuth } from '../../services/auth/context';
import { disconnectStripeAccount } from '../../services/stripe';
import { supabase } from '../../config/supabase';

export function StripeConnect() {
  const [loading, setLoading] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stripeAccountId, setStripeAccountId] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    async function fetchStripeAccount() {
      try {
        if (!user?.id) return;
        
        const { data, error } = await supabase
          .from('connected_accounts')
          .select('stripe_account_id')
          .eq('seller_id', user.id)
          .single();
        
        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
          throw error;
        }

        setStripeAccountId(data?.stripe_account_id || null);
      } catch (err) {
        logger.error('Error fetching Stripe account:', err);
      }
    }
    
    fetchStripeAccount();
  }, [user?.id]);

  const handleConnect = async () => {
    try {
      setLoading(true);
      setError(null);

      // Generate OAuth URL with state parameter
      const state = generateState();
      sessionStorage.setItem('stripe_connect_state', state);

      const params = new URLSearchParams({
        response_type: 'code',
        client_id: ENV.stripe.clientId,
        scope: 'read_write',
        redirect_uri: `${ENV.app.url}/stripe/callback`,
        state,
        'stripe_user[business_type]': 'company',
        'stripe_user[country]': 'US',
        'stripe_user[product_description]': 'Firewood delivery platform',
        'stripe_user[url]': ENV.app.url,
      });

      logger.info('Initiating Stripe Connect flow');
      window.location.href = `https://connect.stripe.com/oauth/authorize?${params.toString()}`;
    } catch (err) {
      logger.error('Error initiating Stripe Connect:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect with Stripe');
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    if (!stripeAccountId) return;
    if (!window.confirm('Are you sure you want to disconnect your Stripe account? This action cannot be undone.')) {
      return;
    }

    setDisconnecting(true);
    setError(null);

    try {
      await disconnectStripeAccount(stripeAccountId);
      setStripeAccountId(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to disconnect account');
    } finally {
      setDisconnecting(false);
    }
  };

  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              {stripeAccountId ? 'Stripe Connected' : 'Connect your Stripe account'}
            </h3>
            <div className="mt-2 mb-4 sm:mb-0 max-w-xl text-sm text-gray-500">
              <p>
                {stripeAccountId
                  ? 'Your Stripe account is connected and ready to accept payments.'
                  : 'Connect your Stripe account to start accepting payments. You\'ll be redirected to Stripe to complete the setup process.'}
              </p>
            </div>
            {error && (
              <div className="mt-2 text-sm text-red-600">
                {error}
              </div>
            )}
          </div>
          <div className="sm:ml-6 sm:flex-shrink-0">
            <StripeConnectButton
              onConnect={handleConnect}
              onDisconnect={handleDisconnect}
              isLoading={loading || disconnecting}
              isConnected={!!stripeAccountId}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function generateState(): string {
  const array = new Uint32Array(2);
  crypto.getRandomValues(array);
  return Array.from(array, dec => dec.toString(16)).join('');
}