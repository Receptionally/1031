import React from 'react';

import { formatPhoneNumber } from '../../utils/phone';

interface CustomerFormFieldsProps {
  customerName: string;
  email: string;
  phone: string;
  deliveryAddress: string;
  onCustomerNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPhoneChange: (value: string) => void;
  readOnly?: boolean;
}

export function CustomerFormFields({
  customerName,
  email,
  phone,
  deliveryAddress,
  onCustomerNameChange,
  onEmailChange,
  onPhoneChange,
  readOnly = false,
}: CustomerFormFieldsProps) {
  return (
    <>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Full Name
        </label>
        <input
          type="text"
          id="name"
          value={customerName}
          onChange={(e) => onCustomerNameChange(e.target.value)}
          required
          readOnly={readOnly}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 py-3"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          required
          readOnly={readOnly}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 py-3"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone Number
        </label>
        <input
          type="tel"
          id="phone"
          value={phone}
          onChange={(e) => onPhoneChange(formatPhoneNumber(e.target.value))}
          required
          readOnly={readOnly}
          placeholder="(555) 555-5555"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 py-3"
        />
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Delivery Address
        </label>
        <input
          type="text"
          id="address"
          value={deliveryAddress}
          readOnly
          className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm text-gray-500 py-3"
        />
      </div>
    </>
  );
}