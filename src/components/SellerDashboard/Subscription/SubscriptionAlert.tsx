import React from 'react';
import { AlertTriangle, CheckCircle } from 'lucide-react';
import { useSubscriptionStatus } from '../hooks/useSubscriptionStatus';
import { formatCurrency } from '../../../utils/format';
import { SubscriptionButton } from './SubscriptionButton';

interface SubscriptionAlertProps {
  sellerId: string;
}

export function SubscriptionAlert({ sellerId }: SubscriptionAlertProps) {
  const { status, loading, error } = useSubscriptionStatus(sellerId);

  if (loading || error || !status) {
    return null;
  }
  
  // Show active subscription notice
  if (status.subscription_status === 'active') {
    return (
      <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg mb-6">
        <div className="flex">
          <CheckCircle className="h-5 w-5 text-green-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              Subscription Active
            </h3>
            <div className="mt-2 text-sm text-green-700">
              <p>Your subscription is active and you can continue accepting orders.</p>
              {status.card_last4 && (
                <p className="mt-1">
                  Payment method: {status.card_brand} ending in {status.card_last4}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show past due notice
  if (status.subscription_status === 'past_due' || status.debt_amount > 0) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg mb-6">
        <div className="flex">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Payment Required
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>
                Your last subscription charge of ${status.failed_charge_amount?.toFixed(2)} failed. 
                Please update your payment method to continue accepting orders.
              </p>
              <div className="mt-4">
                <SubscriptionButton sellerId={sellerId} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show remaining free orders notice
  if (status.total_orders < 3) {
    return (
      <div className="bg-green-50 border-l-4 border-green-400 p-4 rounded-r-lg mb-6">
        <div className="flex">
          <CheckCircle className="h-5 w-5 text-green-400" />
          <div className="ml-3">
            <p className="text-sm font-medium text-green-700">
              You have {status.orders_until_subscription} free {status.orders_until_subscription === 1 ? 'order' : 'orders'} remaining!
            </p>
            <p className="text-sm text-green-600 mt-2">
              After your free orders, a fee of $10 per order will apply. Keep 100% of delivery fees.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show subscription required notice
  if (status.requires_subscription && status.subscription_status !== 'active') {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg mb-6">
        <div className="flex">
          <AlertTriangle className="h-5 w-5 text-yellow-400" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Subscription Required
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                You've reached {status.total_orders} orders! To continue accepting orders, please add a payment method. You will be charged $10 per order.
              </p>
              <div className="mt-4">
                <SubscriptionButton sellerId={sellerId} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}