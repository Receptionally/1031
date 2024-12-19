import React from 'react';
import { MapPin, Truck, ThermometerSun, TreeDeciduous } from 'lucide-react';
import { CityHeader } from './CityHeader';
import { CityFeature } from './CityFeature';
import { CityDescription } from './CityDescription';

interface CityInfoProps {
  city: string;
  state: string;
}

export function CityInfo({ city, state }: CityInfoProps) {
  const features = [
    {
      icon: MapPin,
      title: 'Local Service Area',
      description: `Serving ${city} and surrounding communities with reliable firewood delivery.`
    },
    {
      icon: Truck,
      title: 'Fast Local Delivery',
      description: `Same-week delivery available throughout the ${city} metropolitan area.`
    },
    {
      icon: ThermometerSun,
      title: 'Seasoned Wood',
      description: 'Properly dried and seasoned firewood sourced from local suppliers.'
    },
    {
      icon: TreeDeciduous,
      title: 'Local Species',
      description: `Premium hardwoods native to the ${state} region for optimal burning.`
    }
  ];

  return (
    <div className="bg-gray-50 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CityHeader city={city} state={state} />
        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <CityFeature key={index} {...feature} />
            ))}
          </div>
          <CityDescription city={city} state={state} />
        </div>
      </div>
    </div>
  );
}