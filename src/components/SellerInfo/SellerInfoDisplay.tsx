import React from 'react';
import { CreditCard, User } from 'lucide-react';
import type { SellerWithAccount } from '../../types/seller';

interface SellerInfoDisplayProps {
  seller: SellerWithAccount;
}

export function SellerInfoDisplay({ seller }: SellerInfoDisplayProps) {
  const hasStripeAccount = seller.has_stripe_account;
  const stripeAccountId = seller.stripe_account_id;

  return (
    <div className="bg-gray-50 p-4 rounded-lg mb-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-700">Seller ID</p>
            <p className="text-sm text-gray-900">{seller.id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <CreditCard className="h-5 w-5 text-gray-400" />
          <div>
            <p className="text-sm font-medium text-gray-700">Stripe Account</p>
            <p className={`text-sm ${hasStripeAccount ? 'text-green-600' : 'text-red-600'}`}>
              {hasStripeAccount ? stripeAccountId : 'Not Connected'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}