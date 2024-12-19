import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

export function CardForm() {
  const stripe = useStripe();
  const elements = useElements();

  return (
    <div className="w-full">
      <CardElement options={CARD_ELEMENT_OPTIONS} className="p-3 border border-gray-300 rounded-md" />
    </div>
  );
}