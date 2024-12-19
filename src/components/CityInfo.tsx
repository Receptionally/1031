import React from 'react';
import { MapPin, Truck, ThermometerSun, TreeDeciduous } from 'lucide-react';

interface CityInfoProps {
  city: string;
  state: string;
}

export function CityInfo({ city, state }: CityInfoProps) {
  return (
    <div className="bg-gray-50 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-orange-600 font-semibold tracking-wide uppercase">Local Information</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Firewood Delivery in {city}, {state}
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Your trusted source for premium firewood delivery in the {city} area
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-100 text-orange-600 mx-auto">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">Local Service Area</h3>
              <p className="mt-2 text-base text-gray-500 text-center">
                Serving {city} and surrounding communities with reliable firewood delivery.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-100 text-orange-600 mx-auto">
                <Truck className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">Fast Local Delivery</h3>
              <p className="mt-2 text-base text-gray-500 text-center">
                Same-week delivery available throughout the {city} metropolitan area.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-100 text-orange-600 mx-auto">
                <ThermometerSun className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">Seasoned Wood</h3>
              <p className="mt-2 text-base text-gray-500 text-center">
                Properly dried and seasoned firewood sourced from local suppliers.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-100 text-orange-600 mx-auto">
                <TreeDeciduous className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">Local Species</h3>
              <p className="mt-2 text-base text-gray-500 text-center">
                Premium hardwoods native to the {state} region for optimal burning.
              </p>
            </div>
          </div>

          <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              About {city} Firewood Delivery
            </h3>
            <p className="text-gray-600 mb-4">
              Finding reliable firewood delivery in {city}, {state} has never been easier. Our local sellers provide premium, 
              seasoned firewood delivered right to your door. Whether you need wood for your fireplace, wood stove, or outdoor 
              fire pit, we connect you with trusted local suppliers who understand the specific needs of {city} residents.
            </p>
            <p className="text-gray-600">
              Our sellers offer various wood types common to the {state} region, ensuring you get the best burning experience 
              possible. With options for convenient delivery and professional stacking services, we make it simple to keep your 
              home warm and cozy throughout the season.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}