import React from 'react';
import { DeliveryOptionsSection } from '../../SellerSignup/DeliveryOptionsSection';
import type { SellerFormState } from '../../../types/seller';

interface DeliveryStepProps {
  formState: SellerFormState;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export function DeliveryStep({ formState, onChange }: DeliveryStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Delivery & Payment Options</h2>
        <p className="mt-2 text-sm text-gray-500">
          Set your delivery range, pricing, and stacking service options.
        </p>
      </div>
      <div className="space-y-8">
        <DeliveryOptionsSection formState={formState} onChange={onChange} />
        
        <div className="pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Payment Timing</h3>
          <p className="text-sm text-gray-500 mb-4">Choose when you want to receive payment from customers</p>
          <div className="space-y-4">
            <div className="flex items-center">
              <input
                type="radio"
                id="payment_scheduling"
                name="paymentTiming"
                value="scheduling"
                checked={formState.paymentTiming === 'scheduling'}
                onChange={onChange}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
              />
              <label htmlFor="payment_scheduling" className="ml-3 block text-sm text-gray-700">
                When delivery is scheduled
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="radio"
                id="payment_delivery"
                name="paymentTiming"
                value="delivery"
                checked={formState.paymentTiming === 'delivery'}
                onChange={onChange}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300"
              />
              <label htmlFor="payment_delivery" className="ml-3 block text-sm text-gray-700">
                Upon delivery
              </label>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Note: This setting can be changed later in your seller dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}