import React, { useState } from 'react';
import { CreditCard } from 'lucide-react';
import type { Seller } from '../../../types/seller';
import { PaymentMethodsDisplay } from './PaymentMethodsDisplay';
import { PaymentMethodsForm } from './PaymentMethodsForm';

interface PaymentSettingsProps {
  seller: Seller;
  onUpdate: (updates: Partial<Seller>) => Promise<void>;
}

export function PaymentSettings({ seller, onUpdate }: PaymentSettingsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: Partial<Seller>) => {
    setLoading(true);
    setError(null);

    try {
      await onUpdate(formData);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update payment settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <CreditCard className="h-6 w-6 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900">Payment Settings</h3>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-orange-600 hover:text-orange-700"
          >
            Edit Settings
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {isEditing ? (
        <PaymentMethodsForm
          seller={seller}
          onSubmit={handleSubmit}
          loading={loading}
        />
      ) : (
        <PaymentMethodsDisplay seller={seller} />
      )}
    </div>
  );
}