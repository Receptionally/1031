import React from 'react';
import { Ruler } from 'lucide-react';

const UNIT_MEASUREMENTS = {
  cords: {
    dimensions: '4 feet x 4 feet x 8 feet',
    description: 'A standard Cord is a neatly stacked pile of wood measuring 4 feet high by 4 feet wide by 8 feet long'
  },
  facecords: {
    dimensions: '4 feet x 8 feet x 16-18 inches',
    description: 'A Face Cord is one-third of a full Cord, with logs cut to 16-18 inch lengths'
  },
  ricks: {
    dimensions: '4 feet x 8 feet x 16-18 inches',
    description: 'A Rick is equivalent to a Face Cord, measuring 4 feet high by 8 feet long with 16-18 inch logs'
  }
};

interface UnitMeasurementsProps {
  unit: 'cords' | 'facecords' | 'ricks';
}

export function UnitMeasurements({ unit }: UnitMeasurementsProps) {
  const measurements = UNIT_MEASUREMENTS[unit];

  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <div className="flex items-center space-x-2 mb-3">
        <Ruler className="h-5 w-5 text-gray-400" />
        <h3 className="font-medium text-gray-900">Unit Measurements</h3>
      </div>
      <div className="space-y-2 text-sm">
        <p className="flex justify-between">
          <span className="text-gray-500">Dimensions:</span>
          <span className="font-medium">{measurements.dimensions}</span>
        </p>
        <p className="mt-3 text-gray-600 text-xs">
          {measurements.description}
        </p>
      </div>
    </div>
  );
}