import React from 'react';
import { CreditCard, DollarSign } from 'lucide-react';

interface PaymentMethodSelectorProps {
  selectedMethod: 'card' | 'cash';
  onSelect: (method: 'card' | 'cash') => void;
  showCard: boolean;
  showCash: boolean;
}

export function PaymentMethodSelector({
  selectedMethod,
  onSelect,
  showCard,
  showCash,
}: PaymentMethodSelectorProps) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Payment Method
      </label>
      <div className="grid grid-cols-2 gap-4">
        {showCard && (
          <button
            type="button"
            onClick={() => onSelect('card')}
            className={`flex items-center justify-center p-4 border rounded-lg ${
              selectedMethod === 'card'
                ? 'border-orange-500 bg-orange-50 text-orange-700'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <CreditCard className="h-5 w-5 mr-2" />
            <span>Credit Card</span>
          </button>
        )}
        {showCash && (
          <button
            type="button"
            onClick={() => onSelect('cash')}
            className={`flex items-center justify-center p-4 border rounded-lg ${
              selectedMethod === 'cash'
                ? 'border-orange-500 bg-orange-50 text-orange-700'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <DollarSign className="h-5 w-5 mr-2" />
            <span>Cash on Delivery</span>
          </button>
        )}
      </div>
    </div>
  );
}