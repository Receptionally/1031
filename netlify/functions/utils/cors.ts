import { logger } from '../../../src/services/utils/logger';

// Get environment variables
const APP_URL = process.env.APP_URL;
const NODE_ENV = process.env.NODE_ENV;

// CORS headers for Netlify functions
export const corsHeaders = {
  'Access-Control-Allow-Origin': NODE_ENV === 'development' 
    ? 'http://localhost:5173'
    : APP_URL || '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

// Handle CORS preflight requests
export function handleCors(httpMethod: string) {
  if (!APP_URL) {
    logger.warn('APP_URL environment variable is not set');
  }

  if (httpMethod === 'OPTIONS') {
    return { 
      statusCode: 204, 
      headers: corsHeaders, 
      body: '' 
    };
  }
  return null;
}