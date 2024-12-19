import React from 'react';

interface StackingOptionProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  stackingFee: number;
  unit: string;
}

export function StackingOption({ checked, onChange, stackingFee, unit }: StackingOptionProps) {
  return (
    <div className="relative flex items-start py-4">
      <div className="min-w-0 flex-1 text-sm">
        <label htmlFor="stacking" className="font-medium text-gray-700">
          Add Stacking Service
        </label>
        <p className="text-gray-500">
          We'll stack your firewood for an additional ${stackingFee} per {unit}
        </p>
      </div>
      <div className="ml-3 flex h-5 items-center">
        <input
          id="stacking"
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
        />
      </div>
    </div>
  );
}