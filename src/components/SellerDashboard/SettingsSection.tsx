import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { supabase } from '../../config/supabase';
import type { Seller } from '../../types/seller';
import { formatPhoneNumber } from '../../utils/phone';
import { BusinessAddressInput } from '../BusinessAddressInput';
import { PaymentSettings } from './PaymentSettings';
import { CustomerReviews } from './CustomerReviews';

interface SettingsSectionProps {
  seller: Seller;
}

export function SettingsSection({ seller }: SettingsSectionProps) {
  const [formData, setFormData] = useState({
    name: seller.name,
    business_name: seller.business_name,
    business_address: seller.business_address,
    phone: seller.phone,
    payment_timing: seller.payment_timing,
    firewood_unit: seller.firewood_unit,
    price_per_unit: seller.price_per_unit?.toString() || '',
    max_delivery_distance: seller.max_delivery_distance?.toString() || '',
    min_delivery_fee: seller.min_delivery_fee?.toString() || '',
    price_per_mile: seller.price_per_mile?.toString() || '',
    provides_stacking: seller.provides_stacking,
    stacking_fee_per_unit: seller.stacking_fee_per_unit?.toString() || '',
    max_stacking_distance: seller.max_stacking_distance?.toString() || '',
    bio: seller.bio || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate required fields
      if (!formData.name || !formData.business_name || !formData.business_address || !formData.phone) {
        throw new Error('Please fill in all required fields');
      }

      // Validate numeric fields
      const numericFields = {
        price_per_unit: 'Price per Unit',
        max_delivery_distance: 'Maximum Delivery Distance',
        min_delivery_fee: 'Minimum Delivery Fee',
        price_per_mile: 'Price per Mile',
      };

      for (const [field, label] of Object.entries(numericFields)) {
        const value = parseFloat(formData[field]);
        if (isNaN(value) || value < 0) {
          throw new Error(`${label} must be a valid positive number`);
        }
      }

      const { error: updateError } = await supabase
        .from('seller_updates')
        .insert([{
          seller_id: seller.id,
          updates: {
            name: formData.name,
            business_name: formData.business_name,
            business_address: formData.business_address,
            phone: formData.phone,
            firewood_unit: formData.firewood_unit,
            price_per_unit: parseFloat(formData.price_per_unit),
            max_delivery_distance: parseInt(formData.max_delivery_distance),
            min_delivery_fee: parseFloat(formData.min_delivery_fee),
            price_per_mile: parseFloat(formData.price_per_mile),
            provides_stacking: formData.provides_stacking,
            stacking_fee_per_unit: formData.provides_stacking ? parseFloat(formData.stacking_fee_per_unit) : 0,
            max_stacking_distance: formData.provides_stacking ? parseInt(formData.max_stacking_distance) : null,
            bio: formData.bio,
          },
          status: 'pending'
        }]);

      if (updateError) throw updateError;
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <PaymentSettings sellerId={seller.id} />
      <CustomerReviews sellerId={seller.id} />
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Settings className="h-6 w-6 text-gray-400" />
          <h2 className="text-xl font-semibold text-gray-900">Settings</h2>
        </div>

        {success && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-400 p-4">
            <p className="text-green-700">
              Your changes have been submitted for review. Updates will be reflected within 24 hours after admin approval.
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <div>
              <label htmlFor="business_name" className="block text-sm font-medium text-gray-700">
                Business Name
              </label>
              <input
                type="text"
                id="business_name"
                value={formData.business_name}
                onChange={(e) => setFormData(prev => ({ ...prev, business_name: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: formatPhoneNumber(e.target.value) }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            <div>
              <BusinessAddressInput
                value={formData.business_address}
                onChange={(address) => setFormData(prev => ({ ...prev, business_address: address }))}
              />
            </div>

            <div>
              <label htmlFor="payment_timing" className="block text-sm font-medium text-gray-700">
                Payment Timing
              </label>
              <select
                id="payment_timing"
                value={formData.payment_timing}
                onChange={(e) => setFormData(prev => ({ ...prev, payment_timing: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              >
                <option value="scheduling">When delivery is scheduled</option>
                <option value="delivery">Upon delivery</option>
              </select>
            </div>

            <div>
              <label htmlFor="firewood_unit" className="block text-sm font-medium text-gray-700">
                Firewood Unit
              </label>
              <select
                id="firewood_unit"
                value={formData.firewood_unit}
                onChange={(e) => setFormData(prev => ({ ...prev, firewood_unit: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              >
                <option value="cords">Cords</option>
                <option value="facecords">Face Cords</option>
                <option value="ricks">Ricks</option>
              </select>
            </div>

            <div>
              <label htmlFor="price_per_unit" className="block text-sm font-medium text-gray-700">
                Price per Unit
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="price_per_unit"
                  value={formData.price_per_unit}
                  onChange={(e) => setFormData(prev => ({ ...prev, price_per_unit: e.target.value }))}
                  className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label htmlFor="max_delivery_distance" className="block text-sm font-medium text-gray-700">
                Maximum Delivery Distance (miles)
              </label>
              <input
                type="number"
                id="max_delivery_distance"
                value={formData.max_delivery_distance}
                onChange={(e) => setFormData(prev => ({ ...prev, max_delivery_distance: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                min="0"
              />
            </div>

            <div>
              <label htmlFor="min_delivery_fee" className="block text-sm font-medium text-gray-700">
                Minimum Delivery Fee
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="min_delivery_fee"
                  value={formData.min_delivery_fee}
                  onChange={(e) => setFormData(prev => ({ ...prev, min_delivery_fee: e.target.value }))}
                  className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  step="0.01"
                  min="0"
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
                  value={formData.price_per_mile}
                  onChange={(e) => setFormData(prev => ({ ...prev, price_per_mile: e.target.value }))}
                  className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="provides_stacking"
                  checked={formData.provides_stacking}
                  onChange={(e) => setFormData(prev => ({ ...prev, provides_stacking: e.target.checked }))}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                />
                <label htmlFor="provides_stacking" className="ml-2 block text-sm text-gray-700">
                  Provide Stacking Service
                </label>
              </div>
            </div>

            {formData.provides_stacking && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="stacking_fee_per_unit" className="block text-sm font-medium text-gray-700">
                    Stacking Fee (per {seller.firewood_unit})
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
                      onChange={(e) => setFormData(prev => ({ ...prev, stacking_fee_per_unit: e.target.value }))}
                      className="mt-1 block w-full pl-7 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="max_stacking_distance" className="block text-sm font-medium text-gray-700">
                    Maximum Stacking Distance (feet)
                  </label>
                  <input
                    type="number"
                    id="max_stacking_distance"
                    min="1"
                    value={formData.max_stacking_distance}
                    onChange={(e) => setFormData(prev => ({ ...prev, max_stacking_distance: e.target.value }))}
                    className="mt-1 block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Distance from truck to stacking location"
                  />
                </div>
              </div>
            )}

            <div className="sm:col-span-2">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}