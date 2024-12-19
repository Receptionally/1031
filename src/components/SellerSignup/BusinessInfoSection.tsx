import React from 'react';
import { formatPhoneNumber } from '../../utils/phone';
import { BusinessAddressInput } from './BusinessAddressInput';
import type { SellerFormState } from '../../types/seller';

interface BusinessInfoSectionProps {
  formState: SellerFormState;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddressChange: (address: string) => void;
}

export function BusinessInfoSection({ formState, onChange, onAddressChange }: BusinessInfoSectionProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Business Information</h2>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formState.name}
            onChange={onChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          />
        </div>

        <div>
          <label htmlFor="businessName" className="block text-sm font-medium text-gray-700">
            Business Name
          </label>
          <input
            type="text"
            id="businessName"
            name="businessName"
            value={formState.businessName}
            onChange={onChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formState.email}
            onChange={onChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formState.password}
            onChange={onChange}
            required
            minLength={6}
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
            name="phone"
            value={formState.phone}
            onChange={(e) => onChange({
              ...e,
              target: {
                ...e.target,
                value: formatPhoneNumber(e.target.value)
              }
            })}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            placeholder="(555) 555-5555"
          />
        </div>

        <div className="sm:col-span-2">
          <BusinessAddressInput
            value={formState.businessAddress}
            onChange={onAddressChange}
          />
        </div>
      </div>
    </div>
  );
}