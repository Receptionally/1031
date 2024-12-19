import { logger } from '../services/utils/logger';

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

    const data = await response.json();
    logger.info('Distance calculation result:', data);

    return data.distance;
  } catch (err) {
    logger.error('Error calculating distance:', err);
    throw err;
  }
}

// For state rules only - uses straight-line distance
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 3958.8; // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}