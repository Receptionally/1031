import React from 'react';
import { BusinessDetailsForm } from '../BusinessDetailsForm';
import type { SellerFormState } from '../../../types/seller';

interface BusinessStepProps {
  formState: SellerFormState;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddressChange: (address: string) => void;
}

export function BusinessStep({ formState, onChange, onAddressChange }: BusinessStepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Business Information</h2>
      <BusinessDetailsForm
        formData={formState}
        onChange={onChange}
        onAddressChange={onAddressChange}
      />
    </div>
  );
}