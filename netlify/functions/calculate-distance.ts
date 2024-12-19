import { Handler } from '@netlify/functions';
import { logger } from '../../src/services/utils/logger';

const GOOGLE_MAPS_API_KEY = process.env.VITE_GOOGLE_MAPS_API_KEY;
const APP_URL = process.env.VITE_APP_URL;

if (!GOOGLE_MAPS_API_KEY) {
  throw new Error('Missing Google Maps API key');
}

interface DistanceMatrixResponse {
  rows: Array<{
    elements: Array<{
      status: string;
      distance: {
        value: number;
      };
      duration: {
        value: number;
      };
    }>;
  }>;
  status: string;
}

async function getDistance(origin: string, destination: string): Promise<number> {
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(origin)}&destinations=${encodeURIComponent(destination)}&key=${GOOGLE_MAPS_API_KEY}`;
  
  const response = await fetch(url);
  const data: DistanceMatrixResponse = await response.json();

  if (data.status !== 'OK' || !data.rows[0]?.elements[0]) {
    throw new Error('Failed to calculate distance');
  }

  const element = data.rows[0].elements[0];
  if (element.status !== 'OK') {
    throw new Error('Route not found');
  }

  // Convert meters to miles
  return Math.round(element.distance.value * 0.000621371);
}

export const handler: Handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': APP_URL || '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    if (!event.body) {
      throw new Error('Missing request body');
    }

    const { origin, destination } = JSON.parse(event.body);

    if (!origin || !destination) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Both origin and destination addresses are required' }),
      };
    }

    logger.info('Calculating distance between:', { origin, destination });

    // Get driving distance
    const distance = await getDistance(origin, destination);

    logger.info('Distance calculation result:', { distance });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        distance,
        text: `${distance} miles (driving distance)`,
        mode: 'driving'
      }),
    };
  } catch (error) {
    logger.error('Error calculating distance:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Failed to calculate distance',
        details: error instanceof Error ? error.stack : undefined
      }),
    };
  }
};