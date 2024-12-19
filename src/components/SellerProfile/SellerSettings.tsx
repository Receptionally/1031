import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { supabase } from '../../config/supabase';
import type { Seller } from '../../types/seller';
import { BusinessInfoForm } from './BusinessInfo/BusinessInfoForm';
import { DeliverySettingsForm } from './BusinessInfo/DeliverySettingsForm';
import { PricingSettingsForm } from './BusinessInfo/PricingSettingsForm';
import { PaymentSettings } from './PaymentSettings';

interface SellerSettingsProps {
  seller: Seller;
  onUpdate: () => void;
}

export function SellerSettings({ seller, onUpdate }: SellerSettingsProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleUpdate = async (formData: Partial<Seller>) => {
    setLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from('sellers')
        .update(formData)
        .eq('id', seller.id);

      if (updateError) throw updateError;
      
      onUpdate();
    } catch (err) {
      console.error('Error updating settings:', err);
      setError(err instanceof Error ? err.message : 'Failed to update settings');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <PaymentSettings seller={seller} onUpdate={handleUpdate} />

      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Settings className="h-6 w-6 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900">Business Settings</h3>
        </div>

        <div className="space-y-8">
          <BusinessInfoForm 
            seller={seller} 
            onSubmit={handleUpdate}
            loading={loading}
          />
          
          <PricingSettingsForm 
            seller={seller}
            onSubmit={handleUpdate}
            loading={loading}
          />

          <DeliverySettingsForm 
            seller={seller}
            onSubmit={handleUpdate}
            loading={loading}
          />
        </div>

        {error && (
          <div className="mt-4 rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}