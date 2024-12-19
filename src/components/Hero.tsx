import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { AddressSearch } from './AddressSearch';

export function Hero() {
  const { slug } = useParams();
  
  // If we're on a city page, customize the content
  const isCityPage = !!slug;
  const [city, state] = (slug || '').split('-').map(part => 
    part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
  );

  if (isCityPage) {
    return (
      <div className="relative">
        <div className="absolute inset-0">
          <img
            className="w-full h-full object-cover"
            src="https://images.unsplash.com/photo-1520114878144-6123749968dd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt={`Firewood delivery in ${city}, ${state}`}
          />
          <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl max-w-3xl mx-auto">
            Premium Firewood Delivered in {city}, {state}
          </h1>
          <p className="mt-6 text-xl text-gray-300 max-w-2xl mx-auto">
            Connect with trusted firewood suppliers in {city}. Professional delivery and stacking available. Order today!
          </p>
          <div className="mt-10 w-full max-w-xl mx-auto">
            <AddressSearch />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="absolute inset-0">
        <img
          className="w-full h-full object-cover"
          src="https://images.unsplash.com/photo-1520114878144-6123749968dd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
          alt="Stacked firewood"
        />
        <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
      </div>
      <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl max-w-3xl mx-auto">
          Find Local Firewood Sellers Near You
        </h1>
        <p className="mt-6 text-xl text-gray-300 max-w-2xl mx-auto">
          Connect with trusted local firewood suppliers in your area. Enter your address to discover sellers who deliver premium, seasoned firewood right to your door.
        </p>
        <div className="mt-10 w-full max-w-xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <AddressSearch />
          <Link
            to="/mock-product"
            className="px-6 py-3 bg-white text-orange-600 border-2 border-orange-600 rounded-lg shadow-lg hover:bg-orange-50 transition-colors duration-200 whitespace-nowrap"
          >
            View Demo Product
          </Link>
          </div>
        </div>
      </div>
    </div>
  );
}