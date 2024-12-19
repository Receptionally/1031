import React, { useState } from 'react';
import { CustomerFormFields } from './CustomerFormFields';
import { logger } from '../../services/utils/logger';

interface CustomerFormContentProps {
  onSubmit: (formData: {
    customerName: string;
    email: string;
    phone: string;
  }) => Promise<void>;
  loading: boolean;
  error: string | null;
  deliveryAddress: string;
}

export function CustomerFormContent({
  onSubmit,
  loading,
  error,
  deliveryAddress,
}: CustomerFormContentProps) {
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await onSubmit({
        customerName,
        email,
        phone,
      });
    } catch (err) {
      logger.error('Form submission error:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <CustomerFormFields
        customerName={customerName}
        email={email}
        phone={phone}
        deliveryAddress={deliveryAddress}
        onCustomerNameChange={setCustomerName}
        onEmailChange={setEmail}
        onPhoneChange={setPhone}
      />

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50"
      >
        {loading ? (
          <div className="flex items-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Processing...
          </div>
        ) : (
          'Submit Order'
        )}
      </button>
    </form>
  );
}