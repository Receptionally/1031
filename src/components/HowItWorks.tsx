import React from 'react';
import { useParams } from 'react-router-dom';
import { Truck, Flame, ThermometerSun } from 'lucide-react';

export function HowItWorks() {
  const { slug } = useParams();
  const [city] = (slug || '').split('-').map(part => 
    part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
  );

  const steps = [
    {
      icon: ThermometerSun,
      title: 'Order Premium Firewood',
      description: city 
        ? `Choose from our selection of high-quality, well-seasoned firewood delivered right to your ${city} home.`
        : 'Choose from our selection of high-quality, well-seasoned firewood delivered right to your door.',
    },
    {
      icon: Truck,
      title: 'Fast Local Delivery',
      description: city
        ? `Our ${city} firewood sellers provide prompt delivery and professional stacking services if needed.`
        : 'Our local sellers provide prompt delivery and professional stacking services if needed.',
    },
    {
      icon: Flame,
      title: 'Enjoy Cozy Warmth',
      description: 'Experience the comfort and ambiance of a perfect fire with our seasoned firewood.',
    },
  ];

  return (
    <div id="how-it-works" className="bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-orange-600 font-semibold tracking-wide uppercase">How It Works</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Simple Steps to Warmth
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Get quality firewood delivered in three easy steps
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 text-orange-600 mb-6">
                    <step.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-base text-gray-500">
                    {step.description}
                  </p>
                </div>

                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gray-200">
                    <div className="absolute right-0 -mt-1 -mr-2">
                      <div className="w-4 h-4 rounded-full bg-orange-600"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}