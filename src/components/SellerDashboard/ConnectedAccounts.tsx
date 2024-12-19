import React from 'react';
import { useConnectedAccounts } from '../../hooks/useConnectedAccounts';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { disconnectStripeAccount } from '../../services/stripe';

export function ConnectedAccounts() {
  const { accounts, loading, error } = useConnectedAccounts();
  const [disconnecting, setDisconnecting] = React.useState<string | null>(null);
  const [disconnectError, setDisconnectError] = React.useState<string | null>(null);

  const handleDisconnect = async (stripeAccountId: string) => {
    if (!window.confirm('Are you sure you want to disconnect this Stripe account? This action cannot be undone.')) {
      return;
    }

    setDisconnecting(stripeAccountId);
    setDisconnectError(null);

    try {
      await disconnectStripeAccount(stripeAccountId);
      window.location.reload();
    } catch (err) {
      console.error('Failed to disconnect account:', err);
      setDisconnectError(err instanceof Error ? err.message : 'Failed to disconnect account');
    } finally {
      setDisconnecting(null);
    }
  };

  if (loading) {
    return (
      <div className="mt-8 text-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-2 text-gray-600">Loading connected accounts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 bg-red-50 p-4 rounded-lg">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Error</h3>
            <p className="mt-1 text-sm text-red-700">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!accounts || accounts.length === 0) {
    return (
      <div className="mt-8 bg-yellow-50 p-4 rounded-lg">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">No Connected Accounts</h3>
            <p className="mt-1 text-sm text-yellow-700">
              Connect your Stripe account to start accepting payments.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Connected Accounts</h2>
      <div className="space-y-4">
        {accounts.map((account) => (
          <div
            key={account.stripe_account_id}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Connected Account
                  </p>
                  <p className="text-sm text-gray-500">
                    Connected: {new Date(account.connected_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDisconnect(account.stripe_account_id)}
                disabled={disconnecting === account.stripe_account_id}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {disconnecting === account.stripe_account_id ? (
                  <>
                    <div className="w-4 h-4 border-2 border-red-700 border-t-transparent rounded-full animate-spin mr-2"></div>
                    Disconnecting...
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4 mr-1" />
                    Disconnect
                  </>
                )}
              </button>
            </div>
            {disconnectError && disconnecting === account.stripe_account_id && (
              <div className="mt-2 text-sm text-red-600">
                {disconnectError}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}