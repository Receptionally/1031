import React from 'react';
import { ExternalLink, XCircle } from 'lucide-react';

interface StripeConnectProps {
  onConnect: () => void;
  isLoading?: boolean;
  isConnected?: boolean;
  onDisconnect?: () => void;
}

export function StripeConnect({ onConnect, onDisconnect, isLoading = false, isConnected = false }: StripeConnectProps) {
  if (isConnected && onDisconnect) {
    return (
      <button
        onClick={onDisconnect}
        disabled={isLoading}
        className="inline-flex items-center px-6 py-3 border border-red-600 text-base font-medium rounded-md text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-2" />
        ) : (
          <XCircle className="w-5 h-5 mr-2" />
        )}
        Disconnect Stripe
      </button>
    );
  }

  return (
    <button
      onClick={onConnect}
      disabled={isLoading}
      className="inline-flex items-center px-6 py-3 border border-blue-600 text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
      ) : (
        <ExternalLink className="w-5 h-5 mr-2" />
      )}
      Connect with Stripe
    </button>
  );
}