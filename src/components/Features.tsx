import React from 'react';
import { useParams } from 'react-router-dom';
import { Flame, Truck, ThermometerSun, TreeDeciduous } from 'lucide-react';

export function Features() {
  const { slug } = useParams();
  const [city] = (slug || '').split('-').map(part => 
    part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
  );

  const features = [
    {
      name: 'Local Sellers',
      description: 'All sellers are vetted to ensure premium, seasoned firewood',
      icon: Flame,
    },
    {
      name: 'Quality Guaranteed',
      description: 'Every delivery meets our strict quality standards for moisture content and wood condition',
      icon: ThermometerSun,
    },
    {
      name: 'Transparent Pricing',
      description: 'See total cost including delivery fees before you order',
      icon: Truck,
    },
    {
      name: 'Sustainable Sourcing',
      description: 'Support local suppliers who follow responsible harvesting practices',
      icon: TreeDeciduous,
    },
  ];

  return (
    <div id="features" className="bg-gray-50 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-base text-orange-600 font-semibold tracking-wide uppercase">Features</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Why Choose WoodHeat?
          </p>
          <p className="mt-4 text-xl text-gray-500">
            The easiest way to find and order firewood from trusted local suppliers
          </p>
          <p className="mt-4 text-lg text-gray-600 font-medium">
            Each seller sets their own prices, delivery areas, and services - ensuring you find the perfect match for your needs.
          </p>
        </div>
        <div className="mt-10">
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-orange-500 text-white">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="ml-16">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">{feature.name}</h3>
                  <p className="mt-2 text-base text-gray-500">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}