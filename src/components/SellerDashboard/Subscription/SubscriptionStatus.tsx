import React from 'react';
import { CreditCard, AlertCircle, CheckCircle } from 'lucide-react';
import { useSubscriptionStatus } from '../hooks/useSubscriptionStatus';

interface SubscriptionStatusProps {
  sellerId: string;
}

export function SubscriptionStatus({ sellerId }: SubscriptionStatusProps) {
  const { status, loading, error } = useSubscriptionStatus(sellerId);

  if (loading || error || !status) {
    return null;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <CreditCard className="h-6 w-6 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900">Subscription Status</h3>
        </div>
        {status.subscription_status === 'active' && (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Active
          </span>
        )}
      </div>

      <div className="space-y-4">
        {/* Show subscription details */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            {status.subscription_status === 'active' ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-500" />
            )}
            <div>
              <p className="font-medium text-gray-900">
                {status.subscription_status === 'active' 
                  ? 'Subscription Active'
                  : `${status.orders_until_subscription} free ${status.orders_until_subscription === 1 ? 'order' : 'orders'} remaining`}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {status.subscription_status === 'active'
                  ? 'Your subscription is active and you can accept unlimited orders'
                  : 'After your free orders, a fee of $10 per order will apply'}
              </p>
            </div>
          </div>
        </div>

        {/* Show payment method if available */}
        {status.card_last4 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">
                  {status.card_brand} ending in {status.card_last4}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Added on {new Date(status.subscription_start_date!).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Show order count */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600">
            Total Orders: <span className="font-medium">{status.total_orders}</span>
          </p>
        </div>
      </div>
    </div>
  );
}