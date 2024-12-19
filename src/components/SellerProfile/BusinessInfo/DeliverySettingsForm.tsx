import React, { useState } from 'react';
import type { Seller } from '../../../types/seller';

interface DeliverySettingsFormProps {
  seller: Seller;
  onSubmit: (data: Partial<Seller>) => Promise<void>;
  loading: boolean;
}

export function DeliverySettingsForm({ seller, onSubmit, loading }: DeliverySettingsFormProps) {
  const [formData, setFormData] = useState({
    max_delivery_distance: seller.max_delivery_distance,
    min_delivery_fee: seller.min_delivery_fee,
    price_per_mile: seller.price_per_mile,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h4 className="text-sm font-medium text-gray-900 border-b pb-2">Delivery Settings</h4>

      <div className="space-y-4">
        <div>
          <label htmlFor="max_delivery_distance" className="block text-sm font-medium text-gray-700">
            Maximum Delivery Distance (miles)
          </label>
          <input
            type="number"
            id="max_delivery_distance"
            min="0"
            value={formData.max_delivery_distance}
            onChange={(e) => setFormData(prev => ({ ...prev, max_delivery_distance: parseInt(e.target.value) }))}
            className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label htmlFor="min_delivery_fee" className="block text-sm font-medium text-gray-700">
            Base Delivery Fee
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="min_delivery_fee"
              min="0"
              step="0.01"
              value={formData.min_delivery_fee}
              onChange={(e) => setFormData(prev => ({ ...prev, min_delivery_fee: parseFloat(e.target.value) }))}
              className="mt-1 block w-full pl-7 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>

        <div>
          <label htmlFor="price_per_mile" className="block text-sm font-medium text-gray-700">
            Price per Mile
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="price_per_mile"
              min="0"
              step="0.01"
              value={formData.price_per_mile}
              onChange={(e) => setFormData(prev => ({ ...prev, price_per_mile: parseFloat(e.target.value) }))}
              className="mt-1 block w-full pl-7 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
          </div>
        </div>
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