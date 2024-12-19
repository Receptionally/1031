import React from 'react';

interface CityDescriptionProps {
  city: string;
  state: string;
}

export function CityDescription({ city, state }: CityDescriptionProps) {
  return (
    <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Premium Firewood Delivery in {city}
      </h3>
      <div className="space-y-4">
        <p className="text-gray-600">
          Finding reliable firewood delivery in {city}, {state} has never been easier. Our local sellers provide premium, 
          seasoned firewood delivered right to your door. Whether you need wood for your fireplace, wood stove, or outdoor 
          fire pit, we connect you with trusted local suppliers who understand the specific needs of {city} residents.
        </p>
        <p className="text-gray-600">
          Our sellers offer various wood types common to the {state} region, ensuring you get the best burning experience 
          possible. With options for convenient delivery and professional stacking services, we make it simple to keep your 
          home warm and cozy throughout the season.
        </p>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-medium text-orange-800 mb-2">Local Expertise</h4>
            <p className="text-orange-700 text-sm">
              Our {city} suppliers have deep knowledge of local wood species and burning characteristics.
            </p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <h4 className="font-medium text-orange-800 mb-2">Quality Guarantee</h4>
            <p className="text-orange-700 text-sm">
              All firewood is properly seasoned and ready to burn, guaranteed.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}