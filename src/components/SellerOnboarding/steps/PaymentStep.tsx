import React from 'react';
import { PaymentOptionsSection } from '../../SellerSignup/PaymentOptionsSection';
import type { SellerFormState } from '../../../types/seller';

interface PaymentStepProps {
  formState: SellerFormState;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export function PaymentStep({ formState, onChange }: PaymentStepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Payment Options</h2>
      <PaymentOptionsSection formState={formState} onChange={onChange} />
    </div>
  );
}