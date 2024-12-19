import { useState } from 'react';
import { useStripe, useElements } from '@stripe/react-stripe-js';
import { useAuth } from '../../../../services/auth/context';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../../config/supabase';
import { logger } from '../../../../services/utils/logger';

interface UseSubscriptionPaymentProps {
  clientSecret: string;
  onSuccess: () => void;
}

export function useSubscriptionPayment({ clientSecret, onSuccess }: UseSubscriptionPaymentProps) {
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
      const { error: submitError } = await elements.submit();
      if (submitError) throw submitError;

      const { setupIntent, error: setupError } = await stripe.confirmSetup({
        elements,
        clientSecret,
        redirect: 'if_required'
      });

      if (setupError) throw setupError;
      
      const setupIntentId = sessionStorage.getItem('setup_intent_id');
      sessionStorage.removeItem('setup_intent_id');

      // Update seller status
      const { error: updateError } = await supabase
        .from('sellers')
        .upsert({
          id: user.id,
          setup_intent_status: setupIntent.status,
          setup_intent_id: setupIntentId,
          subscription_status: setupIntent.status === 'succeeded' ? 'active' : 'none',
          subscription_start_date: setupIntent.status === 'succeeded' ? new Date().toISOString() : null
        }, { onConflict: 'id' });

      if (updateError) throw updateError;

      logger.info('Successfully set up subscription payment');
      onSuccess();
      
      // Store success message in session storage
      sessionStorage.setItem('subscription_success', 'true');
      
      // Redirect to seller dashboard
      navigate('/seller-dashboard');
    } catch (err) {
      logger.error('Error setting up subscription payment:', err);
      setError(err instanceof Error ? err.message : 'Failed to set up payment method');
    } finally {
      setLoading(false);
    }
  };

  return {
    handleSubmit,
    error,
    loading,
    stripe,
  };
}