import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { CreditCard } from 'lucide-react';
import { logger } from '../../../services/utils/logger';
import { supabase } from '../../../config/supabase';
import { useAuth } from '../../../services/auth/context'; 
import { useNavigate } from 'react-router-dom';

interface SubscriptionPaymentFormProps {
  onSuccess: () => void;
}

export function SubscriptionPaymentForm({ onSuccess }: SubscriptionPaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements || !user) return;

    setLoading(true);
    setError(null);

    try {
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) throw new Error('Card element not found');

      // Create payment method
      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: user.email,
        },
      });

      if (pmError) throw pmError;

      // Create customer with payment method
      const response = await fetch('/.netlify/functions/create-seller-customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sellerId: user.id,
          paymentMethodId: paymentMethod.id,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create customer');
      }

      logger.info('Successfully set up subscription payment');

      // Redirect to dashboard
      navigate('/seller-dashboard');
      
      // Call onSuccess callback after navigation
      onSuccess();
      
      // Call onSuccess callback after navigation
      onSuccess();
    } catch (err) {
      logger.error('Error setting up payment:', err);
      setError(err instanceof Error ? err.message : 'Failed to set up payment method');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-500">
        <ul className="list-disc list-inside space-y-1 mb-4">
          <li>No monthly fees or minimums</li>
          <li>Only pay when you receive orders</li>
          <li>Keep 100% of delivery fees</li>
          <li>Cancel anytime</li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-4">
            <CreditCard className="h-4 w-4 mr-2" />
            Card Details
          </label>
          <CardElement 
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#32325d',
                  '::placeholder': {
                    color: '#aab7c4'
                  }
                },
                invalid: {
                  color: '#dc2626'
                }
              }
            }}
          />
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={!stripe || loading}
          className="w-full px-4 py-3 text-sm font-medium text-white bg-orange-600 border border-transparent rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
        >
          {loading ? 'Setting up...' : 'Set Up Payment'}
        </button>
      </form>
    </div>
  );
}