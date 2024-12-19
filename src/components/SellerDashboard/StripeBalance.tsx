import React, { useState, useEffect } from 'react';
import { DollarSign, Calendar, ArrowDownCircle, AlertCircle } from 'lucide-react';
import { supabase } from '../../config/supabase';
import { logger } from '../../services/utils/logger';

interface BalanceData {
  available: number;
  pending: number;
  lastPayout?: {
    amount: number;
    date: string;
  };
}

export function StripeBalance() {
  const [balance, setBalance] = useState<BalanceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [payoutLoading, setPayoutLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [payoutError, setPayoutError] = useState<string | null>(null);
  const [payoutSuccess, setPayoutSuccess] = useState(false);

  useEffect(() => {
    async function fetchBalance() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        // Fetch Stripe balance from your Netlify function
        const response = await fetch('/.netlify/functions/get-stripe-balance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sellerId: user.id }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error);

        setBalance(data);
      } catch (err) {
        logger.error('Error fetching balance:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch balance');
      } finally {
        setLoading(false);
      }
    }

    fetchBalance();
  }, []);

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  if (!balance) return null;

  const handlePayout = async () => {
    if (!balance.available || balance.available < 100) { // Minimum $1.00
      setPayoutError('Minimum payout amount is $1.00');
      return;
    }

    setPayoutLoading(true);
    setPayoutError(null);
    setPayoutSuccess(false);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const response = await fetch('/.netlify/functions/create-payout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sellerId: user.id,
          amount: balance.available 
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      setPayoutSuccess(true);
      
      // Refresh balance after successful payout
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (err) {
      logger.error('Error creating payout:', err);
      setPayoutError(err instanceof Error ? err.message : 'Failed to create payout');
    } finally {
      setPayoutLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Balance & Payouts</h2>
        <button
          onClick={() => window.open('https://dashboard.stripe.com/dashboard', '_blank')}
          className="text-sm text-orange-600 hover:text-orange-700"
        >
          View Stripe Dashboard →
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Available Balance */}
        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-900">Available Balance</p>
                <p className="text-2xl font-semibold text-green-700">
                  ${(balance.available / 100).toFixed(2)}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePayout}
                disabled={payoutLoading || balance.available < 100}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {payoutLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-green-700 border-t-transparent rounded-full animate-spin mr-2" />
                    Processing...
                  </>
                ) : (
                  'Initiate Payout'
                )}
              </button>
              <button
                onClick={() => window.open('https://dashboard.stripe.com/payouts', '_blank')}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200"
              >
                View History
              </button>
            </div>
          </div>
          {payoutError && (
            <div className="mt-2 flex items-center text-sm text-red-600">
              <AlertCircle className="h-4 w-4 mr-1" />
              {payoutError}
            </div>
          )}
          {payoutSuccess && (
            <div className="mt-2 text-sm text-green-600">
              Payout initiated successfully! Your funds will arrive in 2-3 business days.
            </div>
          )}
          {balance.available < 100 && (
            <p className="mt-2 text-xs text-gray-500">
              Minimum payout amount is $1.00
            </p>
          )}
        </div>

        {/* Pending Balance */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-900">Pending Balance</p>
              <p className="text-2xl font-semibold text-blue-700">
                ${(balance.pending / 100).toFixed(2)}
              </p>
              <p className="text-sm text-blue-600">Available in 2-7 business days</p>
            </div>
          </div>
        </div>
      </div>

      {/* Last Payout */}
      {balance.lastPayout && (
        <div className="mt-6 border-t border-gray-200 pt-6">
          <div className="flex items-center text-gray-500">
            <ArrowDownCircle className="h-5 w-5 mr-2" />
            <span className="text-sm">
              Last payout: ${(balance.lastPayout.amount / 100).toFixed(2)} on{' '}
              {new Date(balance.lastPayout.date).toLocaleDateString()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}