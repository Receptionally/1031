import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle } from 'lucide-react';
import { exchangeStripeCode } from '../services/stripe/oauth.service';
import { saveConnectedAccount } from '../services/stripe/accounts.service';
import { logger } from '../services/utils/logger';

export function StripeCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    async function handleCallback() {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        // Handle user denial or Stripe errors
        if (error) {
          if (error === 'access_denied') {
            throw new Error('Connection request was denied');
          }
          throw new Error(errorDescription || error);
        }

        // Validate required parameters
        if (!code || !state) {
          throw new Error('Missing required parameters');
        }

        // Validate state parameter
        const savedState = sessionStorage.getItem('stripe_connect_state');
        sessionStorage.removeItem('stripe_connect_state');
        if (!savedState || state !== savedState) {
          throw new Error('Invalid state parameter');
        }

        // Exchange code for access token
        const { stripe_user_id, access_token } = await exchangeStripeCode(code);
        
        // Save connected account details
        await saveConnectedAccount(stripe_user_id, access_token);
        
        setStatus('success');
        
        // Redirect after short delay
        setTimeout(() => {
          navigate('/seller-dashboard');
        }, 2000);
      } catch (err) {
        logger.error('Error handling Stripe callback:', err);
        setStatus('error');
        setError(err instanceof Error ? err.message : 'Failed to connect Stripe account');
      }
    }

    handleCallback();
  }, [navigate, searchParams]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white shadow rounded-lg p-6">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Connecting your Stripe account...</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white shadow rounded-lg p-6">
          <div className="text-center">
            <XCircle className="w-12 h-12 text-red-500 mx-auto" />
            <h2 className="mt-4 text-xl font-semibold text-gray-900">Connection Failed</h2>
            <p className="mt-2 text-red-600">{error}</p>
            <button
              onClick={() => navigate('/seller-dashboard')}
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white shadow rounded-lg p-6">
        <div className="text-center">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">Successfully Connected!</h2>
          <p className="mt-2 text-gray-600">
            Your Stripe account has been connected. Redirecting you to the dashboard...
          </p>
        </div>
      </div>
    </div>
  );
}