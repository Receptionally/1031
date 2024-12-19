import React from 'react';
import type { SellerFormState } from '../../types/seller';

interface DeliveryOptionsSectionProps {
  formState: SellerFormState;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export function DeliveryOptionsSection({ formState, onChange }: DeliveryOptionsSectionProps) {
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    onChange({
      target: {
        name,
        value: checked,
        type: 'checkbox',
        checked
      }
    } as React.ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="space-y-6 pt-6 border-t border-gray-200">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Delivery & Service Options</h2>
        <p className="mt-2 text-sm text-gray-500">
          Set your delivery range, pricing, and stacking service options. All fields are required.
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="firewoodUnit" className="block text-sm font-medium text-gray-700">
            Firewood Unit Size
          </label>
          <p className="mt-1 text-xs text-gray-500">
            A face cord/rick is 4' high x 8' long x 16-18" deep. A full cord is 4' x 4' x 8'.
          </p>
          <select
            id="firewoodUnit"
            name="firewoodUnit"
            value={formState.firewoodUnit}
            onChange={onChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          >
            <option value="">Select unit</option>
            <option value="cords">Cords</option>
            <option value="facecords">Face Cords</option>
            <option value="ricks">Ricks</option>
          </select>
        </div>

        <div>
          <label htmlFor="pricePerUnit" className="block text-sm font-medium text-gray-700">
            Price per {formState.firewoodUnit || 'unit'}
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="pricePerUnit"
              name="pricePerUnit"
              min="0"
              step="0.01"
              value={formState.pricePerUnit || ''}
              onChange={onChange}
              required
              className="block w-full pl-7 rounded-md border-gray-300 focus:border-orange-500 focus:ring-orange-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="maxDeliveryDistance" className="block text-sm font-medium text-gray-700">
            Max Delivery Distance (miles)
          </label>
          <input
            type="number"
            id="maxDeliveryDistance"
            name="maxDeliveryDistance"
            min="0"
            value={formState.maxDeliveryDistance || ''}
            onChange={onChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          />
        </div>

        <div>
          <label htmlFor="minDeliveryFee" className="block text-sm font-medium text-gray-700">
            Minimum Delivery Fee (for short distances)
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="minDeliveryFee"
              name="minDeliveryFee"
              min="0"
              step="0.01"
              value={formState.minDeliveryFee || ''}
              onChange={onChange}
              required
              className="block w-full pl-7 rounded-md border-gray-300 focus:border-orange-500 focus:ring-orange-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="pricePerMile" className="block text-sm font-medium text-gray-700">
            Price per Mile
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <input
              type="number"
              id="pricePerMile"
              name="pricePerMile"
              min="0"
              step="0.01"
              value={formState.pricePerMile || ''}
              onChange={onChange}
              required
              className="block w-full pl-7 rounded-md border-gray-300 focus:border-orange-500 focus:ring-orange-500"
            />
          </div>
        </div>

        <div className="sm:col-span-2">
          <div className="relative flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                id="providesStacking"
                name="providesStacking"
                checked={formState.providesStacking}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="providesStacking" className="font-medium text-gray-700">
                Provide Stacking Service
              </label>
              <p className="text-gray-500">Check this if you offer firewood stacking services</p>
            </div>
          </div>
        </div>

        <div className="sm:col-span-2">
          <div className="relative flex items-start">
            <div className="flex items-center h-5">
              <button
                type="button"
                role="switch"
                aria-checked={formState.providesKilnDried}
                onClick={() => handleCheckboxChange({
                  target: {
                    name: 'providesKilnDried',
                    checked: !formState.providesKilnDried
                  }
                } as React.ChangeEvent<HTMLInputElement>)}
                className={`
                  relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                  transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2
                  ${formState.providesKilnDried ? 'bg-orange-600' : 'bg-gray-200'}
                `}
              >
                <span className="sr-only">Provide kiln dried wood</span>
                <span
                  className={`
                    pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
                    transition duration-200 ease-in-out
                    ${formState.providesKilnDried ? 'translate-x-5' : 'translate-x-0'}
                  `}
                />
              </button>
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="providesKilnDried" className="font-medium text-gray-700">
                Provide Kiln Dried Wood
              </label>
              <p className="text-gray-500">Premium kiln dried wood with optimal moisture content</p>
            </div>
          </div>
        </div>

        {formState.providesKilnDried && (
          <div>
            <label htmlFor="kilnDriedFeePerUnit" className="block text-sm font-medium text-gray-700">
              Kiln Dried Fee (per {formState.firewoodUnit || 'unit'})
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">$</span>
              </div>
              <input
                type="number"
                id="kilnDriedFeePerUnit"
                name="kilnDriedFeePerUnit"
                min="0"
                step="0.01"
                value={formState.kilnDriedFeePerUnit}
                onChange={onChange}
                required={formState.providesKilnDried}
                className="block w-full pl-7 rounded-md border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
          </div>
        )}

        {formState.providesStacking && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="stackingFeePerUnit" className="block text-sm font-medium text-gray-700">
                Stacking Fee (per {formState.firewoodUnit || 'unit'})
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  id="stackingFeePerUnit"
                  name="stackingFeePerUnit"
                  min="0"
                  step="0.01"
                  value={formState.stackingFeePerUnit}
                  onChange={onChange}
                  required={formState.providesStacking}
                  className="block w-full pl-7 rounded-md border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>
            <div>
              <label htmlFor="maxStackingDistance" className="block text-sm font-medium text-gray-700">
                Maximum Stacking Distance (feet)
              </label>
              <div className="mt-1">
                <input
                  type="number"
                  id="maxStackingDistance"
                  name="maxStackingDistance"
                  min="1"
                  value={formState.maxStackingDistance}
                  onChange={onChange}
                  required={formState.providesStacking}
                  className="block w-full rounded-md border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                  placeholder="Distance from truck to stacking location"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}