import React from 'react';

export function ImageGallery() {
  const images = [
    {
      url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      alt: 'Stacked firewood ready for delivery'
    },
    {
      url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      alt: 'Premium seasoned firewood'
    }
  ];

  return (
    <div className="mt-8 mb-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Product Images</h3>
      <div className="grid grid-cols-2 gap-4">
        {images.map((image, index) => (
          <div key={index} className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100">
            <img
              src={image.url}
              alt={image.alt}
              className="absolute inset-0 h-full w-full object-cover transform hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
}