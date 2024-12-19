import React, { useState } from 'react';
import type { Seller } from '../../../types/seller';

interface PricingSettingsFormProps {
  seller: Seller;
  onSubmit: (data: Partial<Seller>) => Promise<void>;
  loading: boolean;
}

export function PricingSettingsForm({ seller, onSubmit, loading }: PricingSettingsFormProps) {
  const [formData, setFormData] = useState({
    price_per_unit: seller.price_per_unit,
    provides_stacking: seller.provides_stacking,
    stacking_fee_per_unit: seller.stacking_fee_per_unit,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h4 className="text-sm font-medium text-gray-900 border-b pb-2">Pricing Settings</h4>

      <div className="space-y-4">
        <div>
          <label htmlFor="price_per_unit" className="block text-sm font-medium text-gray-700">
            Price per {seller.firewood_unit}
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="price_per_unit"
              min="0"
              step="0.01"
              value={formData.price_per_unit}
              onChange={(e) => setFormData(prev => ({ ...prev, price_per_unit: parseFloat(e.target.value) }))}
              className="mt-1 block w-full pl-7 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div className="relative flex items-start">
          <div className="flex items-center h-5">
            <input
              type="checkbox"
              id="provides_stacking"
              checked={formData.provides_stacking}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                provides_stacking: e.target.checked,
                stacking_fee_per_unit: e.target.checked ? prev.stacking_fee_per_unit : 0
              }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="provides_stacking" className="font-medium text-gray-700">
              Provide Stacking Service
            </label>
          </div>
        </div>

        {formData.provides_stacking && (
          <div>
            <label htmlFor="stacking_fee_per_unit" className="block text-sm font-medium text-gray-700">
              Stacking Fee per {seller.firewood_unit}
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                id="stacking_fee_per_unit"
                min="0"
                step="0.01"
                value={formData.stacking_fee_per_unit}
                onChange={(e) => setFormData(prev => ({ ...prev, stacking_fee_per_unit: parseFloat(e.target.value) }))}
                className="mt-1 block w-full pl-7 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}