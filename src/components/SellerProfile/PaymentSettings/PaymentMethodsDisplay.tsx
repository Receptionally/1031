import React from 'react';
import { CreditCard, DollarSign } from 'lucide-react';
import type { Seller } from '../../../types/seller';

interface PaymentMethodsDisplayProps {
  seller: Seller;
}

export function PaymentMethodsDisplay({ seller }: PaymentMethodsDisplayProps) {
  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-gray-900 border-b pb-2">Payment Methods</h4>
      
      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <CreditCard className="h-5 w-5 text-gray-400 mt-1" />
          <div>
            <p className="text-sm font-medium text-gray-900">Payment Required</p>
            <p className="text-sm text-gray-500">
              {seller.payment_timing === 'scheduling' 
                ? 'When delivery gets scheduled' 
                : 'At delivery'}
            </p>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <DollarSign className="h-5 w-5 text-gray-400 mt-1" />
          <div>
            <p className="text-sm font-medium text-gray-900">Cash on Delivery</p>
            <p className="text-sm text-gray-500">
              {seller.accepts_cash_on_delivery ? 'Accepted' : 'Not accepted'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}