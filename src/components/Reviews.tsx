import React from 'react';
import { useParams } from 'react-router-dom';
import { Star, Quote } from 'lucide-react';
import { AddressSearch } from './AddressSearch';

export function Reviews() {
  const { slug } = useParams();
  const [city] = (slug || '').split('-').map(part => 
    part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
  );

  const reviews = [
    {
      author: "Sarah Johnson",
      location: city || "Portland, OR",
      rating: 5,
      text: "The quality of firewood is exceptional - perfectly seasoned and burns beautifully. The delivery was right on time and the stacking service was worth every penny.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
    },
    {
      author: "Michael Chen",
      location: city || "Seattle, WA",
      rating: 5,
      text: "I love how easy it is to order firewood through this service. The local seller was professional and the wood has been keeping us warm all winter.",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
    },
    {
      author: "Emily Rodriguez",
      location: city || "Denver, CO",
      rating: 5,
      text: "Great experience from start to finish. The website made it simple to find a seller in my area, and the delivery was quick and efficient.",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
    },
    {
      author: "David Thompson",
      location: city || "Burlington, VT",
      rating: 5,
      text: "The convenience of having quality firewood delivered and stacked is unbeatable. Will definitely be ordering again next season!",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
    }
  ];

  return (
    <div className="bg-gray-50 py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-orange-600 font-semibold tracking-wide uppercase">
            Customer Reviews
          </h2>
          <p className="mt-2 text-3xl font-extrabold text-gray-900 sm:text-4xl">
            {city ? `What ${city} Customers Say` : 'What Our Customers Say'}
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            Join thousands of satisfied customers who trust us for their firewood needs
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {reviews.map((review, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
            >
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={review.image}
                    alt={review.author}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      {review.author}
                    </h3>
                    <p className="text-sm text-gray-500">{review.location}</p>
                  </div>
                </div>

                <div className="flex items-center mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>

                <div className="relative">
                  <Quote className="h-8 w-8 text-gray-200 absolute -top-4 -left-2 transform -rotate-12" />
                  <p className="text-gray-600 relative z-10 pl-4">
                    "{review.text}"
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900">
              {city ? `Ready to Order Firewood in ${city}?` : 'Ready to Order?'}
            </h3>
            <p className="mt-4 text-lg text-gray-600">
              Enter your delivery address to find local sellers in your area
            </p>
          </div>
          <AddressSearch />
        </div>
      </div>
    </div>
  );
}