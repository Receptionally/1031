import React, { useState, useCallback } from 'react';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';
import { ENV } from '../../config/env';

const libraries: ("places")[] = ["places"];

interface BusinessAddressInputProps {
  value: string;
  onChange: (address: string) => void;
}

export function BusinessAddressInput({ value, onChange }: BusinessAddressInputProps) {
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: ENV.google.mapsApiKey,
    libraries,
    preventGoogleFontsLoading: true
  });

  const onLoad = useCallback((autocomplete: google.maps.places.Autocomplete) => {
    setAutocomplete(autocomplete);
  }, []);

  const onPlaceChanged = useCallback(() => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.formatted_address) {
        onChange(place.formatted_address);
      }
    }
  }, [autocomplete, onChange]);

  if (loadError) {
    return (
      <div className="text-sm text-red-600">
        Error loading Google Maps. Please try again later.
      </div>
    );
  }

  return (
    <div>
      <label htmlFor="businessAddress" className="block text-sm font-medium text-gray-700">
        Business Address
      </label>
      {isLoaded ? (
        <Autocomplete
          onLoad={onLoad}
          onPlaceChanged={onPlaceChanged}
          options={{
            componentRestrictions: { country: "us" },
            types: ["address"]
          }}
        >
          <input
            type="text"
            id="businessAddress"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter your business address"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          />
        </Autocomplete>
      ) : (
        <div className="mt-1 h-10 bg-gray-100 animate-pulse rounded-md" />
      )}
    </div>
  );
}