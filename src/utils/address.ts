import { ENV } from '../config/env';
import { logger } from '../services/utils/logger';

interface GeocodeResponse {
  results: Array<{
    address_components: Array<{
      long_name: string;
      short_name: string;
      types: string[];
    }>;
    formatted_address: string;
  }>;
  status: string;
}

export async function getStateFromAddress(address: string): Promise<string | null> {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${ENV.google.mapsApiKey}`;
    const response = await fetch(url);
    const data: GeocodeResponse = await response.json();

    if (data.status !== 'OK' || !data.results[0]) {
      logger.warn('Geocoding failed:', data);
      return null;
    }

    const stateComponent = data.results[0].address_components.find(
      component => component.types.includes('administrative_area_level_1')
    );

    if (!stateComponent) {
      logger.warn('No state found in address:', address);
      return null;
    }

    logger.info('Found state:', stateComponent.short_name);
    return stateComponent.short_name;
  } catch (error) {
    logger.error('Error getting state from address:', error);
    return null;
  }
}