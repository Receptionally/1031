import React from 'react';
import { LucideIcon } from 'lucide-react';

interface CityFeatureProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function CityFeature({ icon: Icon, title, description }: CityFeatureProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 transform transition duration-300 hover:scale-105">
      <div className="flex items-center justify-center h-12 w-12 rounded-md bg-orange-100 text-orange-600 mx-auto">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-900 text-center">{title}</h3>
      <p className="mt-2 text-base text-gray-500 text-center">{description}</p>
    </div>
  );
}