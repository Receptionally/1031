import React from 'react';
import { Thermometer } from 'lucide-react';
import { formatUnit } from '../../utils/units';

interface KilnDriedSelectorProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  kilnDriedFee: number;
  unit: string;
  businessName: string;
}

export function KilnDriedSelector({ checked, onChange, kilnDriedFee, unit, businessName }: KilnDriedSelectorProps) {
  return (
    <div className="relative flex items-start py-4">
      <div className="min-w-0 flex-1 text-sm">
        <label htmlFor="kiln-dried" className="font-medium text-gray-900">
          <div className="flex items-center gap-2 mb-1">
            <Thermometer className="h-5 w-5 text-orange-500" />
          Add Kiln Dried Wood (+${kilnDriedFee} per {formatUnit(unit, 1)})
          </div>
        </label>
        <p className="text-gray-500">
          {businessName} offers premium kiln dried wood that has been dried in a controlled environment for optimal moisture content and better burning efficiency.
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
          <span className="sr-only">Add kiln dried wood</span>
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