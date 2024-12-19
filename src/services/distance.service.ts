import { ENV } from '../config/env';
import { logger } from './utils/logger';

interface DistanceResponse {
  distance: number;
  text: string;
  mode: string;
}

export async function calculateDistance(origin: string, destination: string): Promise<number> {
  try {
    logger.info('Calculating distance between:', { origin, destination });
    
    const response = await fetch('/.netlify/functions/calculate-distance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ origin, destination }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to calculate distance');
    }

    const data: DistanceResponse = await response.json();
    logger.info('Distance calculation result:', data);

    return data.distance;
  } catch (err) {
    logger.error('Error calculating distance:', err);
    throw err;
  }
}