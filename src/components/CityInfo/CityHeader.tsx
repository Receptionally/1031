import React from 'react';

interface CityHeaderProps {
  city: string;
  state: string;
}

export function CityHeader({ city, state }: CityHeaderProps) {
  return (
    <div className="text-center">
      <h2 className="text-base text-orange-600 font-semibold tracking-wide uppercase">
        Local Firewood Delivery
      </h2>
      <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
        Premium Firewood in {city}, {state}
      </p>
      <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
        Your trusted source for premium firewood delivery in the {city} area
      </p>
    </div>
  );
}