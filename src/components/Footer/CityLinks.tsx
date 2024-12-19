import React from 'react';
import { Link } from 'react-router-dom';

const FEATURED_CITIES = [
  { city: 'Portland', state: 'OR' },
  { city: 'Seattle', state: 'WA' },
  { city: 'San Francisco', state: 'CA' },
  { city: 'Denver', state: 'CO' },
  { city: 'Chicago', state: 'IL' }
];

export function CityLinks() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {FEATURED_CITIES.map(({ city, state }) => {
        const slug = `${city.toLowerCase().replace(/\s+/g, '-')}-${state.toLowerCase()}`;
        return (
          <Link
            key={slug}
            to={`/firewood/${slug}`}
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            {city} Firewood
          </Link>
        );
      })}
    </div>
  );
}