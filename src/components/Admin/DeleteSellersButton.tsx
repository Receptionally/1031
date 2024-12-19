import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';

export function DeleteSellersButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete ALL sellers and their accounts? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/.netlify/functions/delete-sellers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete sellers');
      }

      window.location.reload();
    } catch (err) {
      console.error('Error deleting sellers:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete sellers');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Trash2 className="h-6 w-6 text-red-500" />
          <div>
            <h3 className="text-lg font-medium text-gray-900">Delete All Sellers</h3>
            <p className="text-sm text-gray-500">
              Remove all sellers, their accounts, and associated data for testing purposes
            </p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
        >
          {loading ? 'Deleting...' : 'Delete All'}
        </button>
      </div>
      {error && (
        <div className="mt-4 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
}