import React, { useState } from 'react';
import { MapPin, Phone, Mail, Building2 } from 'lucide-react';
import type { Seller } from '../../types/seller';
import { BusinessInfoDisplay } from './BusinessInfo/BusinessInfoDisplay';
import { BusinessInfoForm } from './BusinessInfo/BusinessInfoForm';

interface BusinessInfoTabProps {
  seller: Seller;
  onUpdate: (updates: Partial<Seller>) => Promise<void>;
}

export function BusinessInfoTab({ seller, onUpdate }: BusinessInfoTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: { phone: string; email: string }) => {
    try {
      setError(null);
      await onUpdate(formData);
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update business info:', err);
      setError(err instanceof Error ? err.message : 'Failed to update business information');
    }
  };

  return (
    <div className="space-y-6">
      {!isEditing && (
        <div className="flex justify-end">
          <button
            onClick={() => setIsEditing(true)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Edit Contact Information
          </button>
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {isEditing ? (
        <BusinessInfoForm
          seller={seller}
          onSubmit={handleSubmit}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <BusinessInfoDisplay seller={seller} />
      )}
    </div>
  );
}