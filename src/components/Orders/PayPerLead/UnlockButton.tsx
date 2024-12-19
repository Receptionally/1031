import React from 'react';
import { DollarSign } from 'lucide-react';

interface UnlockButtonProps {
  onUnlock: () => void;
  loading: boolean;
  error: string | null;
}

export function UnlockButton({ onUnlock, loading, error }: UnlockButtonProps) {
  return (
    <div className="text-center">
      <h3 className="text-lg font-medium text-orange-900 mb-2">
        Unlock Order Details
      </h3>
      <p className="text-sm text-orange-700 mb-4">
        Pay $10 to view this lead's contact information and order details
      </p>
      <button
        onClick={onUnlock}
        disabled={loading}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
      >
        {loading ? (
          <div className="flex items-center">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Processing...
          </div>
        ) : (
          <>
            <DollarSign className="h-4 w-4 mr-2" />
            Unlock for $10
          </>
        )}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}