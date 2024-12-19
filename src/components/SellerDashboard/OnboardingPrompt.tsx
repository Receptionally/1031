import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Seller } from '../../types/seller';

interface OnboardingPromptProps {
  seller: Seller;
}

export function OnboardingPrompt({ seller }: OnboardingPromptProps) {
  // Check for incomplete required fields
  const missingFields = [];

  if (!seller.firewood_unit || !seller.price_per_unit) {
    missingFields.push('Product details');
  }
  if (!seller.max_delivery_distance || !seller.min_delivery_fee || !seller.price_per_mile) {
    missingFields.push('Delivery options');
  }
  
  // Don't show prompt if all required fields are complete
  if (missingFields.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex">
        <AlertTriangle className="h-5 w-5 text-yellow-400" />
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">Complete Required Information</h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>Please complete the following required information to start accepting orders:</p>
            <ul className="list-disc list-inside mt-1">
              {missingFields.map(field => (
                <li key={field}>{field}</li>
              ))}
            </ul>
          </div>
          <div className="mt-4">
            <Link
              to="/seller-onboarding"
              className="text-sm font-medium text-yellow-800 hover:text-yellow-700"
            >
              Complete Required Info →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}