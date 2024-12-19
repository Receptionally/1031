import React, { useState } from 'react';
import { CreditCard, DollarSign } from 'lucide-react';
import type { Seller } from '../../../types/seller';

interface PaymentMethodsFormProps {
  seller: Seller;
  onSubmit: (data: Partial<Seller>) => Promise<void>;
  loading: boolean;
}

export function PaymentMethodsForm({ seller, onSubmit, loading }: PaymentMethodsFormProps) {
  const [formData, setFormData] = useState({
    payment_timing: seller.payment_timing || 'delivery',
    accepts_cash_on_delivery: seller.accepts_cash_on_delivery || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Settings</h3>
        
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700">Payment Required</label>
            <div className="mt-2 space-y-4">
              <div className="flex items-center">
                <input
                  type="radio"
                  id="payment_scheduling"
                  name="payment_timing"
                  value="scheduling"
                  checked={formData.payment_timing === 'scheduling'}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    payment_timing: e.target.value as 'scheduling' | 'delivery'
                  }))}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                />
                <label htmlFor="payment_scheduling" className="ml-3 block text-sm text-gray-700">
                  When delivery gets scheduled
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="payment_delivery"
                  name="payment_timing"
                  value="delivery"
                  checked={formData.payment_timing === 'delivery'}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    payment_timing: e.target.value as 'scheduling' | 'delivery'
                  }))}
                  className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
                />
                <label htmlFor="payment_delivery" className="ml-3 block text-sm text-gray-700">
                  At delivery
                </label>
              </div>
            </div>
          </div>

          <div className="relative flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                id="accepts_cash"
                checked={formData.accepts_cash_on_delivery}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  accepts_cash_on_delivery: e.target.checked
                }))}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="accepts_cash" className="font-medium text-gray-700">
                Accept Cash on Delivery
              </label>
              <p className="text-gray-500">Allow customers to pay with cash upon delivery</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}