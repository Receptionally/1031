import React from 'react';
import { FAQ } from './FAQ';

export function Products() {
  return (
    <div id="products" className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-orange-600 font-semibold tracking-wide uppercase">Our Platform</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Find Local Firewood Sellers
          </p>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            WoodHeat connects you with local firewood suppliers in your area. Simply enter your delivery address above to discover trusted sellers who can provide quality firewood for your home.
          </p>
          <p className="mt-2 text-base text-gray-500">
            Each seller sets their own prices, delivery areas, and services - ensuring you find the perfect match for your needs.
          </p>
        </div>

        <FAQ />
      </div>
    </div>
  );
}