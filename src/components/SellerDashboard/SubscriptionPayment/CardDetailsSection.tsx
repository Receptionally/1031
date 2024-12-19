import React from 'react';
import { PaymentElement } from '@stripe/react-stripe-js';

export function CardDetailsSection() {
  return (
    <div className="border-t border-gray-200 pt-6">
      <label className="block text-sm font-medium text-gray-700 mb-4">
        Card Details
      </label>
      <PaymentElement />
    </div>
  );
}