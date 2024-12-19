import React from 'react';
import { CreditCard, Link as LinkIcon, Calendar, DollarSign, Package } from 'lucide-react';
import { useAdminStripeAccounts } from '../../../hooks/useAdminStripeAccounts';

export function StripeAccountsList() {
  const { accounts, loading, error } = useAdminStripeAccounts();

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md">
        <p className="text-sm text-red-700">{error}</p>
      </div>
    );
  }

  const connectedSellers = accounts.filter(account => account.stripe_account_id);
  const unconnectedSellers = accounts.filter(account => !account.stripe_account_id);

  return (
    <div className="space-y-6">
      {/* Connected Sellers */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Connected Stripe Accounts</h3>
          
          {connectedSellers.length === 0 ? (
            <div className="text-center py-6">
              <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No Connected Accounts</h3>
              <p className="mt-1 text-sm text-gray-500">
                No sellers have connected their Stripe accounts yet.
              </p>
            </div>
          ) : (
            <div className="mt-4 divide-y divide-gray-200">
              {connectedSellers.map((seller) => (
                <div key={seller.seller_id} className="py-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {seller.profile_image ? (
                            <img
                              src={seller.profile_image}
                              alt={seller.business_name}
                              className="h-10 w-10 rounded-full"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <CreditCard className="h-5 w-5 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <h4 className="text-sm font-medium text-gray-900">{seller.business_name}</h4>
                          <p className="text-sm text-gray-500">{seller.email}</p>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <LinkIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        <span>Account ID: {seller.stripe_account_id}</span>
                      </div>
                      <div className="mt-1 flex items-center text-sm text-gray-500">
                        <Calendar className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        <span>Connected: {new Date(seller.connected_at).toLocaleDateString()}</span>
                      </div>
                      <div className="mt-2 flex items-center space-x-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Package className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <span>{seller.total_orders} orders</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <DollarSign className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                          <span>${seller.total_processed} processed</span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 flex-shrink-0">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        seller.seller_status === 'approved' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {seller.seller_status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Unconnected Sellers */}
      {unconnectedSellers.length > 0 && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Sellers Without Stripe</h3>
            <div className="mt-4 divide-y divide-gray-200">
              {unconnectedSellers.map((seller) => (
                <div key={seller.seller_id} className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {seller.profile_image ? (
                          <img
                            src={seller.profile_image}
                            alt={seller.business_name}
                            className="h-10 w-10 rounded-full"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <CreditCard className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-gray-900">{seller.business_name}</h4>
                        <p className="text-sm text-gray-500">{seller.email}</p>
                      </div>
                    </div>
                    <div className="ml-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        Not Connected
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}