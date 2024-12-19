import React from 'react';
import { CreditCard } from 'lucide-react';
import { SubscriptionButton } from './SubscriptionButton';
import type { SubscriptionStatus } from '../../../types/seller';

interface SubscriptionCardProps {
  sellerId: string;
  subscriptionStatus: SubscriptionStatus;
}

export function SubscriptionCard({ sellerId, subscriptionStatus }: SubscriptionCardProps) {
  const ordersRemaining = Math.max(0, 3 - subscriptionStatus.total_orders);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-4">
        <CreditCard className="h-6 w-6 text-orange-600" />
        <h3 className="text-lg font-medium text-gray-900">
          {subscriptionStatus.subscription_status === 'active' 
            ? 'Subscription Active'
            : 'Subscription Required'}
        </h3>
      </div>

      <p className="text-gray-600 mb-6">
        {ordersRemaining > 0 ? (
          <>You have {ordersRemaining} free {ordersRemaining === 1 ? 'order' : 'orders'} remaining. After that, a fee of $10 per order will apply.</>
        ) : (
          <>You've used all your free orders. A fee of $10 per order now applies to continue accepting orders.</>
        )}
      </p>

      {subscriptionStatus.subscription_status !== 'active' && (
        <div className="space-y-4">
          <SubscriptionButton 
            sellerId={sellerId}
            disabled={subscriptionStatus.total_orders < 3}
          />

          <div className="text-sm text-gray-500">
            <ul className="list-disc list-inside space-y-1">
              <li>No monthly fees or minimums</li>
              <li>Only pay when you receive orders</li>
              <li>Keep 100% of delivery fees</li>
              <li>Cancel anytime</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}