import { useState } from 'react';
import { type Stripe, type StripeElements } from '@stripe/stripe-js';
import { logger } from '../../../services/utils/logger';
import { useCustomerForm } from '../../CustomerForm/CustomerFormProvider';

interface UsePaymentSubmissionProps {
  stripe: Stripe | null;
  elements: StripeElements | null;
  customerName: string;
  email: string;
  phone: string;
  onSuccess: () => void;
}

export function usePaymentSubmission({
  stripe,
  elements,
  customerName,
  email,
  phone,
  onSuccess,
}: UsePaymentSubmissionProps) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { seller, productId, quantity, amount, deliveryAddress } = useCustomerForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setLoading(true);
    setError('');

    try {
      const cardElement = elements.getElement('cardNumber');
      if (!cardElement) throw new Error('Card element not found');

      const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: { name: customerName, email, phone },
      });

      if (pmError) throw pmError;

      const response = await fetch('/.netlify/functions/create-customer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          email,
          phone,
          address: deliveryAddress,
          paymentMethod: paymentMethod.id,
          productId,
          quantity,
          amount,
          stripeAccountId: seller.stripe_account_id,
          sellerId: seller.id,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create customer');

      onSuccess();
    } catch (err) {
      logger.error('Payment submission error:', err);
      setError(err instanceof Error ? err.message : 'Failed to process payment');
    } finally {
      setLoading(false);
    }
  };

  return { error, loading, handleSubmit };
}