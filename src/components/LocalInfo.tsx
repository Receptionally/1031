import React from 'react';
import { MapPin, Truck, ThermometerSun, TreeDeciduous } from 'lucide-react';

export function LocalInfo() {
  return (
    <div className="bg-gray-50 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-orange-600 font-semibold tracking-wide uppercase">Local Information</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Premium Firewood Delivery Across America
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Connecting homes with trusted local firewood suppliers nationwide
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white rounded-lg shadow-lg p-6 transform transition duration-300 hover:scale-105">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-100 text-orange-600 mx-auto">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">Nationwide Coverage</h3>
              <p className="mt-2 text-base text-gray-500 text-center">
                Connected with local suppliers across all 50 states for reliable firewood delivery.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 transform transition duration-300 hover:scale-105">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-100 text-orange-600 mx-auto">
                <Truck className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">Local Delivery</h3>
              <p className="mt-2 text-base text-gray-500 text-center">
                Fast, efficient delivery from sellers in your area, with optional stacking service.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 transform transition duration-300 hover:scale-105">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-100 text-orange-600 mx-auto">
                <ThermometerSun className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">Quality Guaranteed</h3>
              <p className="mt-2 text-base text-gray-500 text-center">
                All firewood is properly seasoned and ready to burn, guaranteed by our local suppliers.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 transform transition duration-300 hover:scale-105">
              <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-100 text-orange-600 mx-auto">
                <TreeDeciduous className="h-6 w-6" />
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">Regional Species</h3>
              <p className="mt-2 text-base text-gray-500 text-center">
                Local hardwoods specific to your region for the best burning experience.
              </p>
            </div>
          </div>

          <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              About Our Firewood Delivery Service
            </h3>
            <div className="space-y-4">
              <p className="text-gray-600">
                Our nationwide network of trusted firewood suppliers ensures that quality firewood is just a click away, 
                no matter where you are in the United States. We've carefully vetted local suppliers in every region to 
                guarantee you receive properly seasoned, high-quality firewood that's perfect for your needs.
              </p>
              <p className="text-gray-600">
                Each region offers wood species native to the area, ensuring you get the best burning characteristics 
                for your climate and heating needs. From oak and maple in the Northeast to mesquite in the Southwest, 
                our suppliers provide the ideal wood for your location.
              </p>
              <div className="mt-8">
                <h4 className="text-lg font-medium text-gray-900 text-center mb-6">As Seen On</h4>
                <div className="grid grid-cols-2 gap-8 items-center justify-items-center">
                  <img 
                    src="https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=200&h=80&q=80" 
                    alt="Featured publication logo"
                    className="h-12 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                  />
                  <img 
                    src="https://images.unsplash.com/photo-1611162616305-c69b3037c7bb?auto=format&fit=crop&w=200&h=80&q=80" 
                    alt="Featured publication logo"
                    className="h-12 object-contain grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}