import React from 'react';
import { Wallet } from 'lucide-react';
import { StripeConnect } from './StripeConnect';

interface ConnectCardProps {
  onConnect: () => void;
  isConnecting: boolean;
}

export function ConnectCard({ onConnect, isConnecting }: ConnectCardProps) {
  return (
    <div className="bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="sm:flex sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Wallet className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="ml-2 text-lg leading-6 font-medium text-gray-900">
                Connect your Stripe account
              </h3>
            </div>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>
                Connect your Stripe account to start accepting payments. You'll be
                redirected to Stripe to complete the setup process.
              </p>
            </div>
          </div>
          <div className="mt-5 sm:mt-0 sm:ml-6 sm:flex-shrink-0">
            <StripeConnect onConnect={onConnect} isLoading={isConnecting} />
          </div>
        </div>
      </div>
    </div>
  );
}