import React, { useState, useCallback } from 'react';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { ENV } from '../config/env';
import { logger } from '../services/utils/logger';

const libraries: ("places")[] = ["places"];

// Custom styles for the autocomplete dropdown
const autocompleteStyles = {
  container: {
    width: '100%'
  }
};

// Custom CSS to increase font size of autocomplete dropdown
const customDropdownCSS = `
  .pac-container {
    font-size: 16px;
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    padding: 8px 0;
    border-radius: 8px;
    border: 1px solid #e5e7eb;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  }
  .pac-item {
    padding: 8px 16px;
    cursor: pointer;
  }
  .pac-item:hover {
    background-color: #f3f4f6;
  }
  .pac-item-query {
    font-size: 16px;
    padding-right: 4px;
  }
  .pac-matched {
    font-weight: 600;
  }
`;

export function AddressSearch() {
  const [address, setAddress] = useState("");
  const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: ENV.google.mapsApiKey,
    libraries,
    preventGoogleFontsLoading: true
  });

  // Add custom styles to the document head
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = customDropdownCSS;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const onLoad = useCallback((autocomplete: google.maps.places.Autocomplete) => {
    setAutocomplete(autocomplete);
  }, []);

  const onPlaceChanged = useCallback(() => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.formatted_address) {
        setAddress(place.formatted_address);
        sessionStorage.setItem('delivery_address', place.formatted_address);
        logger.info('Selected address:', place.formatted_address);
      }
    }
  }, [autocomplete]);

  const handleSearch = useCallback(() => {
    if (!address) {
      setError('Please enter a delivery address');
      return;
    }

    try {
      // Store address and navigate
      sessionStorage.setItem('delivery_address', address);
      logger.info('Searching for sellers near:', address);
      navigate(`/firewood-near-me?address=${encodeURIComponent(address)}`);
    } catch (err) {
      logger.error('Error handling address search:', err);
      setError('Failed to process address');
    }
  }, [address, navigate]);

  if (loadError) {
    logger.error('Google Maps load error:', loadError);
    return (
      <div className="text-white bg-red-500/10 px-4 py-2 rounded-lg">
        Error loading address search. Please try again later.
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
      {isLoaded ? (
        <div className="flex-grow relative">
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
              placeholder="Enter your delivery address"
              className="w-full px-4 py-3 rounded-lg text-gray-900 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                setError(null);
              }}
            />
          </Autocomplete>
          {error && (
            <p className="absolute -bottom-6 left-0 text-sm text-red-600">
              {error}
            </p>
          )}
        </div>
      ) : (
        <div className="h-12 bg-white/20 animate-pulse rounded-lg flex-grow" />
      )}
      
      <button
        onClick={handleSearch}
        disabled={!address}
        className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg shadow-lg flex items-center justify-center transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
      >
        <Search className="w-5 h-5 mr-2" />
        Find Firewood
      </button>
    </div>
  );
}