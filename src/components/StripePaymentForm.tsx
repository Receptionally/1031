import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { PaymentForm } from './PaymentForm';
import { ENV } from '../config/env';

const stripePromise = loadStripe(ENV.stripe.publishableKey);

interface StripePaymentFormProps {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  productId: string;
  amount: number;
  onSuccess: () => void;
}

export function StripePaymentForm({
  customerName,
  email,
  phone,
  address,
  productId,
  amount,
  onSuccess,
}: StripePaymentFormProps) {
  const [clientSecret, setClientSecret] = React.useState<string>('');
  const [error, setError] = React.useState<string>('');

  React.useEffect(() => {
    async function createPayment() {
      try {
        const response = await fetch('/.netlify/functions/create-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            customerName,
            email,
            phone,
            address,
            productId,
            amount,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to create payment');
        }

        setClientSecret(data.clientSecret);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to create payment');
      }
    }

    if (customerName && email && amount) {
      createPayment();
    }
  }, [customerName, email, phone, address, productId, amount]);

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <p className="text-sm text-red-700">{error}</p>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="flex justify-center py-4">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#2563eb',
          },
        },
      }}
    >
      <PaymentForm
        customerName={customerName}
        email={email}
        productId={productId}
        amount={amount}
        onSuccess={onSuccess}
      />
    </Elements>
  );
}