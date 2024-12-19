import React from 'react';
import type { SellerFormState } from '../../types/seller';

interface PaymentOptionsSectionProps {
  formState: SellerFormState;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export function PaymentOptionsSection({ formState, onChange }: PaymentOptionsSectionProps) {
  return (
    <div className="space-y-6 pt-6 border-t border-gray-200">
      <h2 className="text-xl font-semibold text-gray-900">Payment Options</h2>
      
      <div className="space-y-6">
        <div>
          <label htmlFor="paymentTiming" className="block text-sm font-medium text-gray-700">
            Payment Required
          </label>
          <select
            id="paymentTiming"
            name="paymentTiming"
            value={formState.paymentTiming}
            onChange={onChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          >
            <option value="">Select when payment is required</option>
            <option value="scheduling">When delivery gets scheduled</option>
            <option value="delivery">At delivery</option>
          </select>
        </div>

        <div>
          <div className="relative flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                id="acceptsCashOnDelivery"
                name="acceptsCashOnDelivery"
                checked={formState.acceptsCashOnDelivery}
                onChange={(e) => onChange({
                  target: {
                    name: 'acceptsCashOnDelivery',
                    value: e.target.checked
                  }
                } as React.ChangeEvent<HTMLInputElement>)}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="acceptsCashOnDelivery" className="font-medium text-gray-700">
                Accept Cash on Delivery
              </label>
              <p className="text-gray-500">Check this if you accept cash payments upon delivery</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}