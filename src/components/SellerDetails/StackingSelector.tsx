import React from 'react';
import { Fence } from 'lucide-react';
import type { SellerWithAccount } from '../../types/seller';
import { formatUnit } from '../../utils/units';

interface StackingSelectorProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  stackingFee: number;
  unit: string;
  maxStackingDistance: number;
  businessName: string;
}

export function StackingSelector({ checked, onChange, stackingFee, unit, maxStackingDistance, businessName }: StackingSelectorProps) {
  return (
    <div className="relative flex items-start py-4">
      <div className="min-w-0 flex-1 text-sm">
        <label htmlFor="stacking" className="font-medium text-gray-900">
          <div className="flex items-center gap-2 mb-1">
            <Fence className="h-5 w-5 text-orange-500 transform -rotate-90" />
          Add Stacking Service (+${stackingFee} per {formatUnit(unit, 1)})
          </div>
        </label>
        <p className="text-gray-500">
          {businessName} will stack firewood a maximum of {maxStackingDistance} feet from the driveway.
        </p>
      </div>
      <div className="ml-3 flex h-5 items-center">
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={() => onChange(!checked)}
          className={`
            relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
            transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
            ${checked ? 'bg-orange-600' : 'bg-gray-200'}
          `}
        >
          <span className="sr-only">Add stacking service</span>
          <span
            className={`
              pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
              transition duration-200 ease-in-out
              ${checked ? 'translate-x-5' : 'translate-x-0'}
            `}
          />
        </button>
      </div>
    </div>
  );
}